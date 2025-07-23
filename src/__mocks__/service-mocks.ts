/**
 * Service Layer Mocks for Testing
 * Mock implementations of service classes and external dependencies
 */

// Mock UserService
export const createMockUserService = () => ({
  authenticateUser: jest.fn(),
  createUser: jest.fn(),
  updatePassword: jest.fn(),
  getUserById: jest.fn(),
  getUserByEmail: jest.fn(),
  verifyEmail: jest.fn(),
})

// Default UserService mock implementations
export const setupUserServiceMocks = (mockUserService: ReturnType<typeof createMockUserService>) => {
  mockUserService.authenticateUser.mockImplementation(async (email: string, password: string) => {
    if (email === 'admin@portfolio.com' && password === 'validPassword123') {
      return {
        id: 'user-admin',
        email: 'admin@portfolio.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        emailVerified: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        lastLogin: new Date('2024-01-01'),
      }
    }
    return null
  })

  mockUserService.getUserByEmail.mockImplementation(async (email: string) => {
    if (email === 'admin@portfolio.com') {
      return {
        id: 'user-admin',
        email: 'admin@portfolio.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        emailVerified: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        lastLogin: new Date('2024-01-01'),
      }
    }
    return null
  })

  return mockUserService
}

// Mock PortfolioQueries
export const createMockPortfolioQueries = () => ({
  getPublishedItems: jest.fn(),
  getById: jest.fn(),
  getFeaturedItems: jest.fn(),
  getRelatedItems: jest.fn(),
})

// Default PortfolioQueries mock implementations
export const setupPortfolioQueriesMocks = (mockQueries: ReturnType<typeof createMockPortfolioQueries>) => {
  mockQueries.getPublishedItems.mockResolvedValue({
    items: [
      {
        id: 'portfolio-1',
        title: 'Test Portfolio Item 1',
        description: 'Test description 1',
        imageUrl: 'https://example.com/image1.jpg',
        category: { name: 'Nature', slug: 'nature' },
        viewCount: 100,
        featured: true,
      },
    ],
    pagination: {
      page: 1,
      limit: 12,
      total: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  })

  mockQueries.getById.mockImplementation(async (id: string) => {
    if (id === 'portfolio-1') {
      return {
        id: 'portfolio-1',
        title: 'Test Portfolio Item 1',
        description: 'Test description 1',
        imageUrl: 'https://example.com/image1.jpg',
        category: { name: 'Nature', slug: 'nature' },
        viewCount: 100,
        featured: true,
        categoryId: 'category-1',
      }
    }
    return null
  })

  mockQueries.getRelatedItems.mockResolvedValue([
    {
      id: 'portfolio-2',
      title: 'Related Item',
      imageUrl: 'https://example.com/image2.jpg',
      category: { name: 'Nature', slug: 'nature' },
    },
  ])

  return mockQueries
}

// Mock CategoryQueries
export const createMockCategoryQueries = () => ({
  getActiveWithCounts: jest.fn(),
  getBySlug: jest.fn(),
})

// Default CategoryQueries mock implementations
export const setupCategoryQueriesMocks = (mockQueries: ReturnType<typeof createMockCategoryQueries>) => {
  mockQueries.getActiveWithCounts.mockResolvedValue([
    {
      id: 'category-1',
      name: 'Nature',
      slug: 'nature',
      description: 'Nature photography',
      coverImage: 'https://example.com/nature-cover.jpg',
      sortOrder: 1,
      _count: { portfolioItems: 5 },
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 'category-2',
      name: 'Travel',
      slug: 'travel',
      description: 'Travel photography',
      coverImage: 'https://example.com/travel-cover.jpg',
      sortOrder: 2,
      _count: { portfolioItems: 3 },
      createdAt: new Date('2024-01-01'),
    },
  ])

  return mockQueries
}

// Mock Error Handler
export const createMockErrorHandler = () => ({
  handleError: jest.fn(),
  createValidationError: jest.fn(),
  createNotFoundError: jest.fn(),
  createUnauthorizedError: jest.fn(),
  createForbiddenError: jest.fn(),
  createConflictError: jest.fn(),
  createRateLimitError: jest.fn(),
})

// Default ErrorHandler mock implementations
export const setupErrorHandlerMocks = (mockErrorHandler: ReturnType<typeof createMockErrorHandler>) => {
  mockErrorHandler.handleError.mockImplementation(async (error, context) => {
    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        success: false,
        error: error.message || 'An error occurred',
        requestId: context?.requestId || 'test-request-id',
        timestamp: new Date().toISOString(),
      }),
      status: error.statusCode || 500,
      headers: new Map([['x-request-id', context?.requestId || 'test-request-id']]),
    }
    return mockResponse
  })

  mockErrorHandler.createValidationError.mockImplementation((message, details) => {
    const error = new Error(message) as any
    error.type = 'VALIDATION_ERROR'
    error.statusCode = 400
    error.details = details
    return error
  })

  mockErrorHandler.createNotFoundError.mockImplementation((resource) => {
    const error = new Error(`${resource} not found`) as any
    error.type = 'NOT_FOUND_ERROR'
    error.statusCode = 404
    return error
  })

  mockErrorHandler.createRateLimitError.mockImplementation((message) => {
    const error = new Error(message) as any
    error.type = 'RATE_LIMIT_ERROR'
    error.statusCode = 429
    return error
  })

  return mockErrorHandler
}

// Mock middleware logging
export const createMockRequestLogger = () => ({
  createContext: jest.fn(),
  logRequest: jest.fn(),
  logResponse: jest.fn(),
  logSecurityEvent: jest.fn(),
  withLogging: jest.fn(),
})

export const setupRequestLoggerMocks = (mockLogger: ReturnType<typeof createMockRequestLogger>) => {
  mockLogger.createContext.mockReturnValue({
    requestId: 'test-request-id',
    startTime: Date.now(),
    ip: '127.0.0.1',
    userAgent: 'Jest Test Agent',
    method: 'GET',
    url: 'http://localhost:3000/api/test',
    pathname: '/api/test',
    searchParams: {},
  })

  return mockLogger
}