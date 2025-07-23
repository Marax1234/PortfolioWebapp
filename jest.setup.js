/**
 * Jest Setup File
 * Global test configuration and mocks
 */

// Import Jest DOM matchers
import '@testing-library/jest-dom'

// Mock Next.js modules that are not available in test environment
jest.mock('next/headers', () => ({
  headers: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    has: jest.fn(),
    delete: jest.fn(),
    entries: jest.fn(),
    forEach: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
  })),
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    has: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn(),
    getAll: jest.fn(),
  })),
}))

// Mock Next.js server components
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, options) => ({
      status: options?.status || 200,
      headers: new Map(Object.entries(options?.headers || {})),
      json: () => Promise.resolve(data),
      headers: {
        set: jest.fn(),
        get: jest.fn(),
      },
    })),
    redirect: jest.fn(),
    rewrite: jest.fn(),
    next: jest.fn(),
  },
}))

// Mock NextAuth
jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('next-auth/middleware', () => ({
  withAuth: jest.fn((middleware) => middleware),
}))

// Mock Winston logger to prevent console spam during tests
jest.mock('@/lib/logger', () => ({
  Logger: {
    generateRequestId: jest.fn(() => 'test-request-id'),
    apiLog: jest.fn(),
    securityLog: jest.fn(),
    performanceLog: jest.fn(),
    databaseLog: jest.fn(),
    errorLog: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  },
  LogLevel: {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug',
  },
  LogCategory: {
    AUTH: 'auth',
    API: 'api',
    DATABASE: 'database',
    SECURITY: 'security',
    PERFORMANCE: 'performance',
    ERROR: 'error',
    SYSTEM: 'system',
  },
}))

// Mock environment variables for testing
process.env.NODE_ENV = 'test'
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'

// Global test utilities
global.TestUtils = {
  // Helper to create mock request objects
  createMockRequest: (options = {}) => ({
    url: options.url || 'http://localhost:3000/api/test',
    method: options.method || 'GET',
    headers: new Map(Object.entries(options.headers || {})),
    json: jest.fn().mockResolvedValue(options.body || {}),
    text: jest.fn().mockResolvedValue(JSON.stringify(options.body || {})),
    ...options,
  }),

  // Helper to create mock NextResponse
  createMockResponse: (data, status = 200) => ({
    status,
    headers: new Map(),
    json: () => Promise.resolve(data),
  }),

  // Helper to extract response data from mocked NextResponse.json
  extractResponseData: (mockResponse) => {
    if (mockResponse && typeof mockResponse.json === 'function') {
      return mockResponse.json()
    }
    return mockResponse
  },
}