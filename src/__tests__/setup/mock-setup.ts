/**
 * Comprehensive mock setup for unit testing
 */

// Test for mock setup
describe('Mock Setup', () => {
  it('should be available for imports', () => {
    expect(true).toBe(true);
  });
});

// Mock Prisma Client
export const prismaMock = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  portfolioItem: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  category: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  inquiry: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  analyticsEvent: {
    findMany: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
  },
  newsletterSubscriber: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  $transaction: jest.fn(),
  $disconnect: jest.fn(),
  $connect: jest.fn(),
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => prismaMock),
}));

// Mock NextAuth
export const mockGetServerSession = jest.fn();
export const mockJwt = {
  sign: jest.fn(),
  verify: jest.fn(),
};

jest.mock('next-auth', () => ({
  getServerSession: mockGetServerSession,
}));

jest.mock('next-auth/next', () => ({
  getServerSession: mockGetServerSession,
}));

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(),
  encode: jest.fn(),
  decode: jest.fn(),
}));

// Mock bcrypt
export const mockBcrypt = {
  hash: jest.fn(),
  compare: jest.fn(),
  genSalt: jest.fn(),
};

jest.mock('bcrypt', () => mockBcrypt);

// Mock nodemailer
export const mockTransporter = {
  sendMail: jest.fn(),
  verify: jest.fn(),
};

export const mockNodemailer = {
  createTransporter: jest.fn(() => mockTransporter),
  createTestAccount: jest.fn(),
  getTestMessageUrl: jest.fn(),
};

jest.mock('nodemailer', () => mockNodemailer);

// Mock winston logger
export const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  apiLog: jest.fn(),
  errorLog: jest.fn(),
  databaseLog: jest.fn(),
  performanceLog: jest.fn(),
  securityLog: jest.fn(),
  generateRequestId: jest.fn(),
};

export const mockLogLevel = {
  INFO: 'info',
  ERROR: 'error',
  WARN: 'warn',
  DEBUG: 'debug',
};

export const mockLogCategory = {
  API: 'api',
  DATABASE: 'database',
  ERROR: 'error',
  SECURITY: 'security',
  PERFORMANCE: 'performance',
};

jest.mock('@/lib/logger', () => ({
  Logger: mockLogger,
  LogLevel: mockLogLevel,
  LogCategory: mockLogCategory,
}));

// Mock database utilities - exported before jest.mock for proper reference
export const mockPortfolioQueries = {
  getPublishedItems: jest.fn(),
  getItemById: jest.fn(),
  getById: jest.fn(),
  getByIdForAdmin: jest.fn(),
  getAllItems: jest.fn(),
  createPortfolioItem: jest.fn(),
  updatePortfolioItem: jest.fn(),
  deletePortfolioItem: jest.fn(),
  incrementViewCount: jest.fn(),
  getRelatedItems: jest.fn(),
};

export const mockCategoryQueries = {
  getAllCategories: jest.fn(),
  getCategoryById: jest.fn(),
  createCategory: jest.fn(),
  updateCategory: jest.fn(),
  deleteCategory: jest.fn(),
  getCategoryWithItems: jest.fn(),
};

export const mockInquiryQueries = {
  getAllInquiries: jest.fn(),
  getInquiryById: jest.fn(),
  createInquiry: jest.fn(),
  updateInquiryStatus: jest.fn(),
  deleteInquiry: jest.fn(),
};

export const mockAnalyticsQueries = {
  getDashboardStats: jest.fn(),
  getViewsByPeriod: jest.fn(),
  getTopCategories: jest.fn(),
  getRecentActivities: jest.fn(),
  createAnalyticsEvent: jest.fn(),
};

jest.mock('@/lib/db-utils', () => ({
  PortfolioQueries: mockPortfolioQueries,
  CategoryQueries: mockCategoryQueries,
  InquiryQueries: mockInquiryQueries,
  AnalyticsQueries: mockAnalyticsQueries,
}));

// Mock error handler
export const mockErrorHandler = {
  handleError: jest.fn(),
  createValidationError: jest.fn(),
  createAuthenticationError: jest.fn(),
  createAuthorizationError: jest.fn(),
  createNotFoundError: jest.fn(),
  createConflictError: jest.fn(),
};

jest.mock('@/lib/error-handler', () => ({
  ErrorHandler: mockErrorHandler,
}));

// Mock request context middleware
export const mockGetRequestContext = jest.fn();

jest.mock('@/lib/middleware/logging', () => ({
  getRequestContext: mockGetRequestContext,
}));

// Mock file upload utilities
export const mockFileUpload = {
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
  validateFile: jest.fn(),
  generateThumbnail: jest.fn(),
  processImage: jest.fn(),
  processVideo: jest.fn(),
};

// Note: Upload utils mock will be added when the module exists

// Mock email service
export const mockEmailService = {
  sendContactNotification: jest.fn(),
  sendInquiryConfirmation: jest.fn(),
  sendInquiryReply: jest.fn(),
  sendWelcomeEmail: jest.fn(),
};

// Mock UserService
export const mockUserService = {
  authenticateUser: jest.fn(),
  createUser: jest.fn(),
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

jest.mock('@/lib/services/user-service', () => ({
  UserService: jest.fn().mockImplementation(() => mockUserService),
}));

// Note: Email service mock will be added when the module exists

// Mock validation schemas
export const mockValidation = {
  portfolioItemSchema: {
    parse: jest.fn(),
    safeParse: jest.fn(),
  },
  contactFormSchema: {
    parse: jest.fn(),
    safeParse: jest.fn(),
  },
  categorySchema: {
    parse: jest.fn(),
    safeParse: jest.fn(),
  },
  inquiryUpdateSchema: {
    parse: jest.fn(),
    safeParse: jest.fn(),
  },
};

// Note: Validation mock will be added when the module exists

// Mock authentication utilities
export const mockAuth = {
  verifyPassword: jest.fn(),
  hashPassword: jest.fn(),
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
  requireAuth: jest.fn(),
  requireAdmin: jest.fn(),
};

// Note: Auth utils mock will be added when the module exists

// Default request context for tests
export const defaultRequestContext = {
  requestId: 'test-request-id-123',
  method: 'GET',
  url: 'http://localhost:3000/api/test',
  ip: '127.0.0.1',
  userAgent: 'jest/test-agent',
  searchParams: {},
};

/**
 * Resets all mocks to their default state
 */
export const resetAllMocks = () => {
  jest.clearAllMocks();

  // Setup default mock implementations
  mockGetRequestContext.mockReturnValue(defaultRequestContext);

  // Setup bcrypt defaults
  mockBcrypt.hash.mockResolvedValue('$2b$10$hashedpassword');
  mockBcrypt.compare.mockResolvedValue(true);
  mockBcrypt.genSalt.mockResolvedValue('$2b$10$salt');

  // Setup email defaults
  mockEmailService.sendContactNotification.mockResolvedValue(true);
  mockEmailService.sendInquiryConfirmation.mockResolvedValue(true);
  mockEmailService.sendInquiryReply.mockResolvedValue(true);

  // Setup validation defaults
  mockValidation.portfolioItemSchema.safeParse.mockReturnValue({
    success: true,
    data: {},
  });
  mockValidation.contactFormSchema.safeParse.mockReturnValue({
    success: true,
    data: {},
  });
  mockValidation.categorySchema.safeParse.mockReturnValue({
    success: true,
    data: {},
  });
  mockValidation.inquiryUpdateSchema.safeParse.mockReturnValue({
    success: true,
    data: {},
  });

  // Setup auth defaults
  mockAuth.verifyPassword.mockResolvedValue(true);
  mockAuth.hashPassword.mockResolvedValue('$2b$10$hashedpassword');
  mockAuth.generateToken.mockReturnValue('mock-jwt-token');
  mockAuth.verifyToken.mockReturnValue({ userId: 'mock-user-id' });

  // Setup file upload defaults
  mockFileUpload.uploadFile.mockResolvedValue({
    filePath: '/uploads/mock-file.jpg',
    thumbnailPath: '/uploads/thumbnails/mock-file-thumb.jpg',
  });
  mockFileUpload.validateFile.mockReturnValue({ isValid: true });

  // Setup transporter verify
  mockTransporter.verify.mockResolvedValue(true);
  mockNodemailer.createTransporter.mockReturnValue(mockTransporter);
};

/**
 * Sets up authenticated user session for tests
 */
export const mockAuthenticatedSession = (
  userOverrides: Record<string, unknown> = {}
) => {
  const user = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'ADMIN',
    ...userOverrides,
  };

  const session = {
    user,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  mockGetServerSession.mockResolvedValue(session);
  return session;
};

/**
 * Sets up unauthenticated session for tests
 */
export const mockUnauthenticatedSession = () => {
  mockGetServerSession.mockResolvedValue(null);
};

/**
 * Sets up database error for tests
 */
export const mockDatabaseError = (
  operation: string,
  error: Error = new Error('Database error')
) => {
  switch (operation) {
    case 'findMany':
      prismaMock.portfolioItem.findMany.mockRejectedValue(error);
      prismaMock.category.findMany.mockRejectedValue(error);
      prismaMock.inquiry.findMany.mockRejectedValue(error);
      break;
    case 'findUnique':
      prismaMock.portfolioItem.findUnique.mockRejectedValue(error);
      prismaMock.category.findUnique.mockRejectedValue(error);
      prismaMock.inquiry.findUnique.mockRejectedValue(error);
      break;
    case 'create':
      prismaMock.portfolioItem.create.mockRejectedValue(error);
      prismaMock.category.create.mockRejectedValue(error);
      prismaMock.inquiry.create.mockRejectedValue(error);
      break;
    case 'update':
      prismaMock.portfolioItem.update.mockRejectedValue(error);
      prismaMock.category.update.mockRejectedValue(error);
      prismaMock.inquiry.update.mockRejectedValue(error);
      break;
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
};
