/**
 * Global Test Mocks Setup
 * Centralized mock configuration for all API route tests
 */

import { createMockPrismaClient, setupDefaultMocks } from './database-mocks'
import { 
  createMockUserService, 
  setupUserServiceMocks,
  createMockPortfolioQueries,
  setupPortfolioQueriesMocks,
  createMockCategoryQueries,
  setupCategoryQueriesMocks,
  createMockErrorHandler,
  setupErrorHandlerMocks,
} from './service-mocks'

// Global mock instances
export let mockPrisma: ReturnType<typeof createMockPrismaClient>
export let mockUserService: ReturnType<typeof createMockUserService>
export let mockPortfolioQueries: ReturnType<typeof createMockPortfolioQueries>
export let mockCategoryQueries: ReturnType<typeof createMockCategoryQueries>
export let mockErrorHandler: ReturnType<typeof createMockErrorHandler>

// Setup all mocks
export const setupAllMocks = () => {
  // Database mocks
  mockPrisma = createMockPrismaClient()
  setupDefaultMocks(mockPrisma)

  // Service mocks
  mockUserService = createMockUserService()
  setupUserServiceMocks(mockUserService)

  mockPortfolioQueries = createMockPortfolioQueries()
  setupPortfolioQueriesMocks(mockPortfolioQueries)

  mockCategoryQueries = createMockCategoryQueries()
  setupCategoryQueriesMocks(mockCategoryQueries)

  mockErrorHandler = createMockErrorHandler()
  setupErrorHandlerMocks(mockErrorHandler)

  // Mock implementations for modules
  jest.mock('@/lib/db', () => ({
    prisma: mockPrisma,
  }))

  jest.mock('@/lib/services/user-service', () => ({
    UserService: jest.fn().mockImplementation(() => mockUserService),
  }))

  jest.mock('@/lib/db-utils', () => ({
    PortfolioQueries: mockPortfolioQueries,
    CategoryQueries: mockCategoryQueries,
    handlePrismaError: jest.fn().mockImplementation((error) => {
      if (error?.code === 'P2025') {
        return { error: 'Record not found', code: 404 }
      }
      return { error: 'Internal server error', code: 500 }
    }),
  }))

  jest.mock('@/lib/error-handler', () => ({
    ErrorHandler: mockErrorHandler,
  }))

  jest.mock('@/lib/middleware/logging', () => ({
    getRequestContext: jest.fn().mockReturnValue({
      requestId: 'test-request-id',
      startTime: Date.now(),
      ip: '127.0.0.1',
      userAgent: 'Jest Test Agent',
      method: 'GET',
      url: 'http://localhost:3000/api/test',
      pathname: '/api/test',
      searchParams: {},
    }),
    RequestLogger: {
      createContext: jest.fn(),
      logRequest: jest.fn(),
      logResponse: jest.fn(),
    },
  }))
}

// Reset all mocks between tests
export const resetAllMocks = () => {
  if (mockPrisma) {
    Object.values(mockPrisma).forEach(mock => {
      if (typeof mock === 'object' && mock !== null) {
        Object.values(mock).forEach(method => {
          if (jest.isMockFunction(method)) {
            method.mockClear()
          }
        })
      }
    })
  }

  if (mockUserService) {
    Object.values(mockUserService).forEach(method => {
      if (jest.isMockFunction(method)) {
        method.mockClear()
      }
    })
  }

  if (mockPortfolioQueries) {
    Object.values(mockPortfolioQueries).forEach(method => {
      if (jest.isMockFunction(method)) {
        method.mockClear()
      }
    })
  }

  if (mockCategoryQueries) {
    Object.values(mockCategoryQueries).forEach(method => {
      if (jest.isMockFunction(method)) {
        method.mockClear()
      }
    })
  }

  if (mockErrorHandler) {
    Object.values(mockErrorHandler).forEach(method => {
      if (jest.isMockFunction(method)) {
        method.mockClear()
      }
    })
  }
}

// Setup fresh mocks for each test
export const setupFreshMocks = () => {
  resetAllMocks()
  setupDefaultMocks(mockPrisma)
  setupUserServiceMocks(mockUserService)
  setupPortfolioQueriesMocks(mockPortfolioQueries)
  setupCategoryQueriesMocks(mockCategoryQueries)
  setupErrorHandlerMocks(mockErrorHandler)
}

// Helper to create test request context
export const createTestContext = (overrides = {}) => ({
  requestId: 'test-request-id',
  startTime: Date.now(),
  ip: '127.0.0.1',
  userAgent: 'Jest Test Agent',
  method: 'GET',
  url: 'http://localhost:3000/api/test',
  pathname: '/api/test',
  searchParams: {},
  ...overrides,
})

// Helper to create mock Next.js request
export const createMockNextRequest = (options: {
  url?: string
  method?: string
  headers?: Record<string, string>
  body?: any
  searchParams?: Record<string, string>
} = {}) => {
  const url = new URL(options.url || 'http://localhost:3000/api/test')
  if (options.searchParams) {
    Object.entries(options.searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  return {
    url: url.toString(),
    method: options.method || 'GET',
    headers: new Map(Object.entries(options.headers || {})),
    json: jest.fn().mockResolvedValue(options.body || {}),
    text: jest.fn().mockResolvedValue(JSON.stringify(options.body || {})),
    nextUrl: url,
  } as any
}

// Helper to extract response data from mocked NextResponse
export const extractMockResponseData = async (mockResponse: any) => {
  if (mockResponse && typeof mockResponse.json === 'function') {
    return await mockResponse.json()
  }
  return mockResponse
}