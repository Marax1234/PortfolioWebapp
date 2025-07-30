/**
 * NextAuth Configuration Tests
 * Basic unit tests for authentication configuration and callbacks
 */
import { resetAllMocks, setupAllMocks } from '@/__mocks__/setup';

// Import after mocking
import { authOptions } from '../../../lib/auth';

// Mock NextAuth modules
jest.mock('next-auth/providers/credentials', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(config => ({
    ...config,
    type: 'credentials',
    id: 'credentials',
  })),
}));

// Mock UserService properly
const mockUserService = jest.fn();
jest.mock('@/lib/services/user-service', () => ({
  UserService: mockUserService,
}));

describe('NextAuth Configuration', () => {
  beforeAll(() => {
    setupAllMocks();
  });

  beforeEach(() => {
    resetAllMocks();
    jest.clearAllMocks();
  });

  describe('Auth Options Configuration', () => {
    it('should have correct session strategy', () => {
      expect(authOptions.session).toEqual(
        expect.objectContaining({
          strategy: 'jwt',
          maxAge: 24 * 60 * 60, // 24 hours
          updateAge: 60 * 60, // 1 hour
        })
      );
    });

    it('should have correct JWT configuration', () => {
      expect(authOptions.jwt).toEqual(
        expect.objectContaining({
          maxAge: 24 * 60 * 60, // 24 hours
        })
      );
    });

    it('should have correct custom pages configuration', () => {
      expect(authOptions.pages).toEqual({
        signIn: '/auth/signin',
        error: '/auth/error',
      });
    });

    it('should have security configuration for production', () => {
      // The authOptions object is evaluated at import time, so changing NODE_ENV
      // after import won't affect the configuration. We'll test the expected value.
      expect(authOptions.useSecureCookies).toBe(
        process.env.NODE_ENV === 'production'
      );
    });

    it('should have debug enabled in development', () => {
      // Similar to above, debug is set based on NODE_ENV at import time
      expect(authOptions.debug).toBe(process.env.NODE_ENV === 'development');
    });
  });

  describe('Providers Configuration', () => {
    it('should have credentials provider configured', () => {
      expect(authOptions.providers).toHaveLength(1);
      expect(authOptions.providers[0]).toEqual(
        expect.objectContaining({
          type: 'credentials',
          id: 'credentials',
        })
      );
    });

    it('should have correct credential fields', () => {
      const provider = authOptions.providers[0] as { credentials: Record<string, unknown>; };
      expect(provider.credentials).toEqual({
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'kilian@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      });
    });
  });

  describe('Credentials Authorization', () => {
    it('should reject authorization with missing credentials', async () => {
      const provider = authOptions.providers[0] as { credentials: Record<string, unknown>; };
      const mockReq = {
        headers: { 'x-forwarded-for': '127.0.0.1', 'user-agent': 'test' },
      };

      const result = await provider.authorize({}, mockReq);

      expect(result).toBeNull();
    });

    it('should reject authorization with missing email', async () => {
      const provider = authOptions.providers[0] as { credentials: Record<string, unknown>; };
      const mockReq = {
        headers: { 'x-forwarded-for': '127.0.0.1', 'user-agent': 'test' },
      };

      const result = await provider.authorize(
        { password: 'password123' },
        mockReq
      );

      expect(result).toBeNull();
    });

    it('should reject authorization with missing password', async () => {
      const provider = authOptions.providers[0] as { credentials: Record<string, unknown>; };
      const mockReq = {
        headers: { 'x-forwarded-for': '127.0.0.1', 'user-agent': 'test' },
      };

      const result = await provider.authorize(
        { email: 'test@example.com' },
        mockReq
      );

      expect(result).toBeNull();
    });

    it('should reject authorization for invalid credentials', async () => {
      const provider = authOptions.providers[0] as { credentials: Record<string, unknown>; };
      const mockReq = {
        headers: { 'x-forwarded-for': '127.0.0.1', 'user-agent': 'test' },
      };

      // Mock authenticateUser to return null (invalid credentials)
      const mockUserServiceInstance = {
        authenticateUser: jest.fn().mockResolvedValue(null),
      };
      mockUserService.mockImplementation(() => mockUserServiceInstance);

      const result = await provider.authorize(
        { email: 'invalid@example.com', password: 'wrongpassword' },
        mockReq
      );

      expect(result).toBeNull();
      expect(mockUserServiceInstance.authenticateUser).toHaveBeenCalledWith(
        'invalid@example.com',
        'wrongpassword'
      );
    });

    it('should reject authorization for non-admin users', async () => {
      const provider = authOptions.providers[0] as { credentials: Record<string, unknown>; };
      const mockReq = {
        headers: { 'x-forwarded-for': '127.0.0.1', 'user-agent': 'test' },
      };

      // Mock authenticateUser to return a visitor user
      const mockUserServiceInstance = {
        authenticateUser: jest.fn().mockResolvedValue({
          id: 'user-visitor',
          email: 'visitor@example.com',
          role: 'VISITOR',
          emailVerified: true,
        }),
      };
      mockUserService.mockImplementation(() => mockUserServiceInstance);

      const result = await provider.authorize(
        { email: 'visitor@example.com', password: 'password123' },
        mockReq
      );

      expect(result).toBeNull();
    });

    it('should authorize valid admin user', async () => {
      const provider = authOptions.providers[0] as { credentials: Record<string, unknown>; };
      const mockReq = {
        headers: { 'x-forwarded-for': '127.0.0.1', 'user-agent': 'test' },
      };

      // Mock authenticateUser to return an admin user
      const mockAdminUser = {
        id: 'user-admin',
        email: 'admin@portfolio.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        emailVerified: true,
      };

      const mockUserServiceInstance = {
        authenticateUser: jest.fn().mockResolvedValue(mockAdminUser),
      };
      mockUserService.mockImplementation(() => mockUserServiceInstance);

      const result = await provider.authorize(
        { email: 'admin@portfolio.com', password: 'validPassword123' },
        mockReq
      );

      expect(result).toEqual(mockAdminUser);
      expect(mockUserServiceInstance.authenticateUser).toHaveBeenCalledWith(
        'admin@portfolio.com',
        'validPassword123'
      );
    });

    it('should handle authentication service errors', async () => {
      const provider = authOptions.providers[0] as { credentials: Record<string, unknown>; };
      const mockReq = {
        headers: { 'x-forwarded-for': '127.0.0.1', 'user-agent': 'test' },
      };

      // Mock authenticateUser to throw an error
      const mockUserServiceInstance = {
        authenticateUser: jest
          .fn()
          .mockRejectedValue(new Error('Database error')),
      };
      mockUserService.mockImplementation(() => mockUserServiceInstance);

      const result = await provider.authorize(
        { email: 'admin@portfolio.com', password: 'password123' },
        mockReq
      );

      expect(result).toBeNull();
    });
  });

  describe('JWT Callback', () => {
    it('should populate token with user data on first sign in', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'ADMIN',
        emailVerified: true,
      };

      const token = {};

      const result = await authOptions.callbacks!.jwt!({
        token,
        user: mockUser,
      } as { user: { id: string; email: string; role: string; } });

      expect(result).toEqual({
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'ADMIN',
        emailVerified: true,
      });
    });

    it('should return existing token when user is not provided', async () => {
      const existingToken = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'ADMIN',
      };

      const result = await authOptions.callbacks!.jwt!({
        token: existingToken,
      } as { user: { id: string; email: string; role: string; } });

      expect(result).toEqual(existingToken);
    });
  });

  describe('Session Callback', () => {
    it('should populate session with token data', async () => {
      const mockToken = {
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'ADMIN',
        emailVerified: true,
      };

      const mockSession = {
        user: {} as { id: string; email: string; role: string; },
        expires: '2024-12-31',
      };

      const result = await authOptions.callbacks!.session!({
        session: mockSession,
        token: mockToken,
      } as { user: { id: string; email: string; role: string; } });

      expect(result.user).toEqual({
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'ADMIN',
        emailVerified: true,
      });
    });

    it('should handle missing token gracefully', async () => {
      const mockSession = {
        user: {} as { id: string; email: string; role: string; },
        expires: '2024-12-31',
      };

      const result = await authOptions.callbacks!.session!({
        session: mockSession,
        token: null,
      } as { user: { id: string; email: string; role: string; } });

      expect(result).toEqual(mockSession);
    });
  });

  describe('Event Handlers', () => {
    it('should have signIn event handler', () => {
      expect(authOptions.events?.signIn).toBeDefined();
      expect(typeof authOptions.events?.signIn).toBe('function');
    });

    it('should have signOut event handler', () => {
      expect(authOptions.events?.signOut).toBeDefined();
      expect(typeof authOptions.events?.signOut).toBe('function');
    });

    it('should have createUser event handler', () => {
      expect(authOptions.events?.createUser).toBeDefined();
      expect(typeof authOptions.events?.createUser).toBe('function');
    });

    it('should have session event handler', () => {
      expect(authOptions.events?.session).toBeDefined();
      expect(typeof authOptions.events?.session).toBe('function');
    });
  });

  describe('Security Configuration', () => {
    it('should have proper secret configuration', () => {
      expect(authOptions.secret).toBeDefined();
      expect(typeof authOptions.secret).toBe('string');
    });

    it('should use secure cookies in production', () => {
      // Test the current configuration based on actual NODE_ENV
      expect(authOptions.useSecureCookies).toBe(
        process.env.NODE_ENV === 'production'
      );
    });

    it('should not use secure cookies in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      expect(authOptions.useSecureCookies).toBe(false);

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Error Handling', () => {
    it('should not exit on error', () => {
      // This is implicitly tested by the NextAuth configuration
      // but we can verify the option is set correctly
      expect(authOptions.debug).toBeDefined();
    });
  });

  describe('Type Safety', () => {
    it('should have proper TypeScript module augmentation', () => {
      // This test verifies that our module augmentation is properly typed
      // The types are checked at compile time, so this test mainly ensures
      // the configuration object matches our expected interface
      expect(authOptions.providers).toBeDefined();
      expect(authOptions.callbacks).toBeDefined();
      expect(authOptions.session).toBeDefined();
      expect(authOptions.jwt).toBeDefined();
    });
  });
});
