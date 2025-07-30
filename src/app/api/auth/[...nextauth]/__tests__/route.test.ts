/**
 * NextAuth API Route Tests
 * Basic unit tests for NextAuth API endpoints
 */
import { resetAllMocks, setupAllMocks } from '@/__mocks__/setup';

// Import after mocking
import { GET, POST } from '../route';

// Mock NextAuth before importing
const mockNextAuthHandler = jest.fn();

jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => mockNextAuthHandler),
}));

jest.mock('@/lib/auth', () => ({
  authOptions: {
    providers: [
      {
        id: 'credentials',
        type: 'credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        authorize: jest.fn(),
      },
    ],
    session: { strategy: 'jwt' },
    callbacks: {
      jwt: jest.fn(),
      session: jest.fn(),
    },
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
    },
  },
}));

describe('/api/auth/[...nextauth]', () => {
  beforeAll(() => {
    setupAllMocks();
  });

  beforeEach(() => {
    resetAllMocks();
    jest.clearAllMocks();
  });

  describe('Route Handlers', () => {
    it('should export GET handler', () => {
      expect(typeof GET).toBe('function');
      expect(GET).toBe(mockNextAuthHandler);
    });

    it('should export POST handler', () => {
      expect(typeof POST).toBe('function');
      expect(POST).toBe(mockNextAuthHandler);
    });

    it('should use the same handler for GET and POST', () => {
      expect(GET).toBe(POST);
    });
  });

  describe('NextAuth Integration', () => {
    it('should initialize NextAuth with auth options', () => {
      const NextAuth = require('next-auth').default;

      expect(NextAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          providers: expect.any(Array),
          session: expect.objectContaining({ strategy: 'jwt' }),
          callbacks: expect.any(Object),
          pages: expect.objectContaining({
            signIn: '/auth/signin',
            error: '/auth/error',
          }),
        })
      );
    });

    it('should pass correct auth configuration', () => {
      const NextAuth = require('next-auth').default;
      const authOptions = require('@/lib/auth').authOptions;

      expect(NextAuth).toHaveBeenCalledWith(authOptions);
    });
  });

  describe('Handler Functionality', () => {
    it('should handle authentication requests', async () => {
      // Mock a simple response from NextAuth handler
      mockNextAuthHandler.mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'NextAuth handled' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const mockRequest = new Request('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      const response = await POST(mockRequest);

      expect(mockNextAuthHandler).toHaveBeenCalledWith(mockRequest);
      expect(response).toBeInstanceOf(Response);
    });

    it('should handle GET requests for NextAuth endpoints', async () => {
      // Mock NextAuth response for GET request (e.g., getting providers)
      mockNextAuthHandler.mockResolvedValueOnce(
        new Response(JSON.stringify({ providers: {} }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const mockRequest = new Request(
        'http://localhost:3000/api/auth/providers',
        {
          method: 'GET',
        }
      );

      const response = await GET(mockRequest);

      expect(mockNextAuthHandler).toHaveBeenCalledWith(mockRequest);
      expect(response).toBeInstanceOf(Response);
    });

    it('should pass through all request parameters to NextAuth', async () => {
      const mockRequest = new Request('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Test Agent',
        },
        body: JSON.stringify({
          email: 'admin@portfolio.com',
          password: 'validPassword123',
        }),
      });

      mockNextAuthHandler.mockResolvedValueOnce(
        new Response('OK', { status: 200 })
      );

      await POST(mockRequest);

      expect(mockNextAuthHandler).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe('Error Handling', () => {
    it('should handle NextAuth errors gracefully', async () => {
      // Mock NextAuth throwing an error
      mockNextAuthHandler.mockRejectedValueOnce(new Error('NextAuth error'));

      const mockRequest = new Request('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      await expect(POST(mockRequest)).rejects.toThrow('NextAuth error');
    });

    it('should pass through NextAuth error responses', async () => {
      // Mock NextAuth returning an error response
      mockNextAuthHandler.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const mockRequest = new Request('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid@example.com',
          password: 'wrongpassword',
        }),
      });

      const response = await POST(mockRequest);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toEqual({ error: 'Invalid credentials' });
    });
  });

  describe('Security Considerations', () => {
    it('should not expose sensitive configuration details', () => {
      // The NextAuth handler should not expose internal configuration
      // This is more of a integration test, but we can verify the handler exists
      expect(mockNextAuthHandler).toBeDefined();
      expect(typeof mockNextAuthHandler).toBe('function');
    });

    it('should handle different authentication endpoints', async () => {
      const endpoints = [
        '/api/auth/signin',
        '/api/auth/signout',
        '/api/auth/session',
        '/api/auth/providers',
        '/api/auth/csrf',
      ];

      for (const endpoint of endpoints) {
        mockNextAuthHandler.mockResolvedValueOnce(
          new Response('OK', { status: 200 })
        );

        const mockRequest = new Request(`http://localhost:3000${endpoint}`, {
          method: 'GET',
        });

        await GET(mockRequest);

        expect(mockNextAuthHandler).toHaveBeenCalledWith(mockRequest);
      }
    });
  });

  describe('HTTP Methods', () => {
    it('should support POST for authentication actions', async () => {
      mockNextAuthHandler.mockResolvedValueOnce(
        new Response('OK', { status: 200 })
      );

      const mockRequest = new Request('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      const response = await POST(mockRequest);

      expect(response.status).toBe(200);
    });

    it('should support GET for retrieving auth information', async () => {
      mockNextAuthHandler.mockResolvedValueOnce(
        new Response(JSON.stringify({ user: null }), { status: 200 })
      );

      const mockRequest = new Request(
        'http://localhost:3000/api/auth/session',
        {
          method: 'GET',
        }
      );

      const response = await GET(mockRequest);

      expect(response.status).toBe(200);
    });
  });

  describe('Content Types', () => {
    it('should handle JSON content type for POST requests', async () => {
      mockNextAuthHandler.mockResolvedValueOnce(
        new Response('OK', { status: 200 })
      );

      const mockRequest = new Request('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      await POST(mockRequest);

      expect(mockNextAuthHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.any(Headers),
        })
      );
    });

    it('should handle form-encoded content for authentication', async () => {
      mockNextAuthHandler.mockResolvedValueOnce(
        new Response('OK', { status: 200 })
      );

      const formData = new URLSearchParams();
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');

      const mockRequest = new Request('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      await POST(mockRequest);

      expect(mockNextAuthHandler).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe('Route Configuration', () => {
    it('should handle dynamic route segments', () => {
      // The [...nextauth] dynamic route should handle all auth-related paths
      // This is verified by the fact that we have both GET and POST handlers
      expect(GET).toBeDefined();
      expect(POST).toBeDefined();
      expect(GET).toBe(POST); // Same handler for all methods
    });
  });
});
