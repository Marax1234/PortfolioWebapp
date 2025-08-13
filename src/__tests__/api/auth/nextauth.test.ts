
/**
 * Unit tests for NextAuth.js authentication configuration
 */
// Import mock setup FIRST to ensure mocks are established
import '@/__tests__/setup/mock-setup';
import { NextRequest } from 'next/server';
import { authOptions } from '@/lib/auth';
import { UserService } from '@/lib/services/user-service';
import { Logger } from '@/lib/logger';
import { TestUtils } from '@/__tests__/utils/test-utils';
import { MockFactories } from '@/__tests__/utils/mock-factories';
import {
  resetAllMocks,
  mockAuthenticatedSession,
  prismaMock,
  mockLogger,
  mockBcrypt,
} from '@/__tests__/setup/mock-setup';

// Mock UserService
jest.mock('@/lib/services/user-service');
const mockUserService = UserService as jest.MockedClass<typeof UserService>;

describe('NextAuth Configuration', () => {
  let mockUserServiceInstance: jest.Mocked<UserService>;

  beforeEach(() => {
    resetAllMocks();
    mockUserServiceInstance = {
      authenticateUser: jest.fn(),
    } as any;
    mockUserService.mockImplementation(() => mockUserServiceInstance);
    
    // Mock Logger methods
    jest.spyOn(Logger, 'generateRequestId').mockReturnValue('test-request-id');
    jest.spyOn(Logger, 'securityLog').mockImplementation(jest.fn());
    jest.spyOn(Logger, 'errorLog').mockImplementation(jest.fn());
    jest.spyOn(Logger, 'info').mockImplementation(jest.fn());
    jest.spyOn(Logger, 'debug').mockImplementation(jest.fn());
  });

  describe('Credentials Provider Authorization', () => {
    const mockCredentials = {
      email: 'admin@example.com',
      password: 'password123',
    };

    const mockRequest = {
      headers: {
        'x-forwarded-for': '192.168.1.1',
        'user-agent': 'test-browser',
      },
    };

    it('should authenticate valid admin user successfully', async () => {
      // Arrange
      const mockUser = MockFactories.createMockUser({
        email: mockCredentials.email,
        role: 'ADMIN',
        emailVerified: true,
      });

      mockUserServiceInstance.authenticateUser.mockResolvedValue(mockUser);

      const provider = authOptions.providers[0] as any;

      // Act
      const result = await provider.authorize(mockCredentials, mockRequest);

      // Assert
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role,
        emailVerified: mockUser.emailVerified,
      });

      expect(mockUserServiceInstance.authenticateUser).toHaveBeenCalledWith(
        mockCredentials.email,
        mockCredentials.password
      );

      expect(Logger.securityLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Authentication successful'),
          eventType: 'LOGIN_SUCCESS',
        })
      );
    });

    it('should reject user with missing credentials', async () => {
      // Arrange
      const incompleteCredentials = { email: 'admin@example.com' };
      const provider = authOptions.providers[0] as any;

      // Act
      const result = await provider.authorize(incompleteCredentials, mockRequest);

      // Assert
      expect(result).toBeNull();
      expect(Logger.securityLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Login attempt with missing credentials',
          eventType: 'LOGIN_FAILURE',
          severity: 'MEDIUM',
        })
      );
    });

    it('should reject user with invalid credentials', async () => {
      // Arrange
      mockUserServiceInstance.authenticateUser.mockResolvedValue(null);
      const provider = authOptions.providers[0] as any;

      // Act
      const result = await provider.authorize(mockCredentials, mockRequest);

      // Assert
      expect(result).toBeNull();
      expect(Logger.securityLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Authentication failed'),
          eventType: 'LOGIN_FAILURE',
          severity: 'MEDIUM',
        })
      );
    });

    it('should reject non-admin user', async () => {
      // Arrange
      const mockUser = MockFactories.createMockUser({
        email: mockCredentials.email,
        role: 'REGISTERED', // Non-admin role
      });

      mockUserServiceInstance.authenticateUser.mockResolvedValue(mockUser);
      const provider = authOptions.providers[0] as any;

      // Act
      const result = await provider.authorize(mockCredentials, mockRequest);

      // Assert
      expect(result).toBeNull();
      expect(Logger.securityLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Access denied - insufficient privileges'),
          eventType: 'UNAUTHORIZED_ACCESS',
          severity: 'HIGH',
        })
      );
    });

    it('should handle authentication system error', async () => {
      // Arrange
      const systemError = new Error('Database connection failed');
      mockUserServiceInstance.authenticateUser.mockRejectedValue(systemError);
      const provider = authOptions.providers[0] as any;

      // Act
      const result = await provider.authorize(mockCredentials, mockRequest);

      // Assert
      expect(result).toBeNull();
      expect(Logger.securityLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Authentication system error'),
          eventType: 'LOGIN_FAILURE',
          severity: 'HIGH',
        })
      );
      expect(Logger.errorLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'NextAuth authentication error',
          error: expect.objectContaining({
            message: systemError.message,
          }),
        })
      );
    });

    it('should log IP address and user agent from headers', async () => {
      // Arrange
      const mockUser = MockFactories.createMockUser({
        role: 'ADMIN',
      });
      mockUserServiceInstance.authenticateUser.mockResolvedValue(mockUser);
      
      const requestWithHeaders = {
        headers: {
          'x-forwarded-for': '203.0.113.1',
          'user-agent': 'Mozilla/5.0 Test Browser',
        },
      };

      const provider = authOptions.providers[0] as any;

      // Act
      await provider.authorize(mockCredentials, requestWithHeaders);

      // Assert
      expect(Logger.securityLog).toHaveBeenCalledWith(
        expect.objectContaining({
          ip: '203.0.113.1',
          userAgent: 'Mozilla/5.0 Test Browser',
        })
      );
    });
  });

  describe('JWT Callback', () => {
    it('should populate JWT token with user data', async () => {
      // Arrange
      const mockUser = MockFactories.createMockUser({
        role: 'ADMIN',
      });
      
      const token = {};

      // Act
      const result = await authOptions.callbacks!.jwt!({
        token,
        user: mockUser as any,
      } as any);

      // Assert
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role,
        emailVerified: Boolean(mockUser.emailVerified),
      });
    });

    it('should return token unchanged when no user provided', async () => {
      // Arrange
      const existingToken = {
        id: 'existing-id',
        email: 'existing@example.com',
        role: 'ADMIN',
      };

      // Act
      const result = await authOptions.callbacks!.jwt!({
        token: existingToken,
      } as any);

      // Assert
      expect(result).toEqual(existingToken);
    });
  });

  describe('Session Callback', () => {
    it('should populate session with token data', async () => {
      // Arrange
      const mockToken = {
        id: 'test-user-id',
        email: 'admin@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'ADMIN' as const,
        emailVerified: true,
      };

      const session = {
        user: {} as any,
        expires: new Date().toISOString(),
      };

      // Act
      const result = await authOptions.callbacks!.session!({
        session,
        token: mockToken,
      } as any);

      // Assert
      expect(result.user).toEqual({
        id: mockToken.id,
        email: mockToken.email,
        firstName: mockToken.firstName,
        lastName: mockToken.lastName,
        role: mockToken.role,
        emailVerified: mockToken.emailVerified,
      });
    });
  });

  describe('Event Handlers', () => {
    it('should log successful sign in', async () => {
      // Arrange
      const mockUser = MockFactories.createMockUser({
        role: 'ADMIN',
      });

      const mockAccount = { provider: 'credentials' };

      // Act
      await authOptions.events!.signIn!({
        user: mockUser as any,
        account: mockAccount,
        isNewUser: false,
      });

      // Assert
      expect(Logger.securityLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('User session created'),
          eventType: 'LOGIN_SUCCESS',
          userId: mockUser.id,
          details: expect.objectContaining({
            email: mockUser.email,
            role: mockUser.role,
            provider: 'credentials',
          }),
        })
      );

      expect(Logger.info).toHaveBeenCalledWith(
        'User session established',
        expect.objectContaining({
          userId: mockUser.id,
          email: mockUser.email,
        })
      );
    });

    it('should log sign out', async () => {
      // Arrange
      const mockSession = {
        user: {
          id: 'test-user-id',
          email: 'admin@example.com',
        },
      };

      // Act
      await authOptions.events!.signOut!({
        session: mockSession as any,
        token: null as any,
      });

      // Assert
      expect(Logger.securityLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('User session terminated'),
          userId: mockSession.user.id,
          details: expect.objectContaining({
            email: mockSession.user.email,
            sessionEnd: true,
          }),
        })
      );
    });

    it('should log new user creation', async () => {
      // Arrange
      const mockUser = MockFactories.createMockUser({
        role: 'ADMIN',
      });

      // Act
      await authOptions.events!.createUser!({
        user: mockUser as any,
      });

      // Assert
      expect(Logger.securityLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('New user account created'),
          userId: mockUser.id,
          details: expect.objectContaining({
            email: mockUser.email,
            role: mockUser.role,
            accountCreation: true,
          }),
        })
      );
    });

    it('should log session verification', async () => {
      // Arrange
      const mockSession = {
        user: {
          id: 'test-user-id',
          email: 'admin@example.com',
          role: 'ADMIN',
        },
      };

      // Act
      await authOptions.events!.session!({
        session: mockSession as any,
        token: null as any,
      });

      // Assert
      expect(Logger.debug).toHaveBeenCalledWith(
        'Session verified',
        expect.objectContaining({
          userId: mockSession.user.id,
          email: mockSession.user.email,
          role: mockSession.user.role,
        })
      );
    });
  });

  describe('Configuration Validation', () => {
    it('should have correct session configuration', () => {
      expect(authOptions.session).toEqual({
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 hours
        updateAge: 60 * 60, // 1 hour
      });
    });

    it('should have correct JWT configuration', () => {
      expect(authOptions.jwt).toEqual({
        maxAge: 24 * 60 * 60, // 24 hours
      });
    });

    it('should have custom pages configured', () => {
      expect(authOptions.pages).toEqual({
        signIn: '/auth/signin',
        error: '/auth/error',
      });
    });

    it('should use secure cookies in production', () => {
      // Mock production environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      // Re-import to get updated config
      jest.resetModules();
      const { authOptions: prodAuthOptions } = require('@/lib/auth');

      expect(prodAuthOptions.useSecureCookies).toBe(true);

      // Restore environment
      process.env.NODE_ENV = originalEnv;
    });

    it('should have debug enabled in development', () => {
      // Mock development environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      // Re-import to get updated config
      jest.resetModules();
      const { authOptions: devAuthOptions } = require('@/lib/auth');

      expect(devAuthOptions.debug).toBe(true);

      // Restore environment
      process.env.NODE_ENV = originalEnv;
    });
  });
});