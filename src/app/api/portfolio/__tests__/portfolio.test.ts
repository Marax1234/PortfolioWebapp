// Import mock setup FIRST to ensure mocks are established
import { NextRequest, NextResponse } from 'next/server';

import '@/__tests__/setup/mock-setup';
import { MockFactories } from '@/__tests__/utils/mock-factories';
import { PortfolioQueries } from '@/lib/db-utils';
import { ErrorHandler } from '@/lib/error-handler';
import { Logger } from '@/lib/logger';
import { getRequestContext } from '@/lib/middleware/logging';

import { GET, POST } from '../route';

// Mock dependencies
jest.mock('@/lib/db-utils');
jest.mock('@/lib/error-handler');
jest.mock('@/lib/logger');
jest.mock('@/lib/middleware/logging');

// Mock implementations
const mockPortfolioQueries = PortfolioQueries as jest.Mocked<
  typeof PortfolioQueries
>;
const mockErrorHandler = ErrorHandler as jest.Mocked<typeof ErrorHandler>;
const mockLogger = Logger as jest.Mocked<typeof Logger>;
const mockGetRequestContext = getRequestContext as jest.MockedFunction<
  typeof getRequestContext
>;

// Mock request context
const mockRequestContext = {
  requestId: 'test-request-id-123',
  startTime: Date.now(),
  method: 'GET',
  url: 'http://localhost:3000/api/portfolio',
  pathname: '/api/portfolio',
  ip: '127.0.0.1',
  userAgent: 'jest/test-agent',
  searchParams: {},
};

describe('/api/portfolio', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementations
    mockGetRequestContext.mockReturnValue(mockRequestContext);
    mockLogger.apiLog = jest.fn();
    mockLogger.debug = jest.fn();
    mockLogger.databaseLog = jest.fn();
    mockLogger.errorLog = jest.fn();
    mockLogger.performanceLog = jest.fn();
  });

  describe('GET /api/portfolio', () => {
    it('should return portfolio items with default pagination', async () => {
      // Arrange
      const mockCategory1 = MockFactories.createMockCategory({
        id: 'cat-1',
        name: 'Nature',
        slug: 'nature',
      });
      
      const mockCategory2 = MockFactories.createMockCategory({
        id: 'cat-2',
        name: 'Travel',
        slug: 'travel',
      });

      const mockPortfolioItems = [
        {
          ...MockFactories.createMockPortfolioItem({
            id: '1',
            title: 'Test Image 1',
            description: 'Test description',
            mediaType: 'IMAGE',
            filePath: '/test/image1.jpg',
            status: 'PUBLISHED',
            viewCount: 10,
          }),
          category: mockCategory1,
        },
        {
          ...MockFactories.createMockPortfolioItem({
            id: '2',
            title: 'Test Image 2',
            description: 'Another test description',
            mediaType: 'IMAGE',
            filePath: '/test/image2.jpg',
            status: 'PUBLISHED',
            viewCount: 5,
          }),
          category: mockCategory2,
        },
      ];

      const mockPagination = {
        page: 1,
        limit: 12,
        total: 2,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      };

      mockPortfolioQueries.getPublishedItems.mockResolvedValue({
        items: mockPortfolioItems,
        pagination: mockPagination,
      });

      const request = new NextRequest('http://localhost:3000/api/portfolio');

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        data: mockPortfolioItems.map(item => ({
          ...item,
          createdAt: expect.any(String), // Date is serialized as string in JSON response
          updatedAt: expect.any(String), // Date is serialized as string in JSON response
          publishedAt: expect.any(String), // Date is serialized as string in JSON response
          category: {
            ...item.category,
            createdAt: expect.any(String), // Date is serialized as string in JSON response
          },
        })),
        pagination: mockPagination,
      });

      expect(mockPortfolioQueries.getPublishedItems).toHaveBeenCalledWith({
        page: 1,
        limit: 12,
        category: undefined,
        featured: undefined,
        orderBy: 'createdAt',
        orderDirection: 'desc',
      });
    });

    it('should handle query parameters correctly', async () => {
      // Arrange
      const mockResult = {
        items: [],
        pagination: {
          page: 2,
          limit: 10,
          total: 30,
          totalPages: 3,
          hasNext: true,
          hasPrev: true,
        },
      };

      mockPortfolioQueries.getPublishedItems.mockResolvedValue(mockResult);

      const request = new NextRequest(
        'http://localhost:3000/api/portfolio?page=2&limit=10&category=nature&featured=true&orderBy=viewCount&orderDirection=asc'
      );

      // Act
      await GET(request);

      // Assert
      expect(mockPortfolioQueries.getPublishedItems).toHaveBeenCalledWith({
        page: 2,
        limit: 10,
        category: 'nature',
        featured: true,
        orderBy: 'viewCount',
        orderDirection: 'asc',
      });
    });

    it('should validate page parameter and return error for invalid page', async () => {
      // Arrange
      const mockError = {
        message: 'Page must be greater than 0',
        type: 'VALIDATION_ERROR',
        statusCode: 400,
        isOperational: true,
      };
      const mockErrorResponse = Promise.resolve(NextResponse.json(
        { success: false as const, error: 'Validation error', timestamp: new Date().toISOString() },
        { status: 400 }
      ));

      mockErrorHandler.createValidationError.mockReturnValue(mockError as any);
      mockErrorHandler.handleError.mockReturnValue(mockErrorResponse);

      const request = new NextRequest(
        'http://localhost:3000/api/portfolio?page=0'
      );

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData).toEqual(
        expect.objectContaining({
          success: false,
          error: 'Validation error',
        })
      );

      expect(mockErrorHandler.createValidationError).toHaveBeenCalledWith(
        'Page must be greater than 0',
        { page: 0 }
      );
    });

    it('should validate limit parameter and return error for invalid limit', async () => {
      // Arrange
      const mockError = {
        message: 'Limit must be greater than 0',
        type: 'VALIDATION_ERROR',
        statusCode: 400,
        isOperational: true,
      };
      const mockErrorResponse = Promise.resolve(NextResponse.json(
        { success: false as const, error: 'Validation error', timestamp: new Date().toISOString() },
        { status: 400 }
      ));

      mockErrorHandler.createValidationError.mockReturnValue(mockError as any);
      mockErrorHandler.handleError.mockReturnValue(mockErrorResponse);

      const request = new NextRequest(
        'http://localhost:3000/api/portfolio?limit=0'
      );

      // Act
      const response = await GET(request);

      // Assert
      expect(response.status).toBe(400);
      expect(mockErrorHandler.createValidationError).toHaveBeenCalledWith(
        'Limit must be greater than 0',
        { limit: 0 }
      );
    });

    it('should enforce maximum limit of 50 items per page', async () => {
      // Arrange
      const mockResult = {
        items: [],
        pagination: {
          page: 1,
          limit: 50,
          total: 0,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

      mockPortfolioQueries.getPublishedItems.mockResolvedValue(mockResult);

      const request = new NextRequest(
        'http://localhost:3000/api/portfolio?limit=100'
      );

      // Act
      await GET(request);

      // Assert - should cap at 50
      expect(mockPortfolioQueries.getPublishedItems).toHaveBeenCalledWith({
        page: 1,
        limit: 50,
        category: undefined,
        featured: undefined,
        orderBy: 'createdAt',
        orderDirection: 'desc',
      });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      const mockErrorResponse = Promise.resolve(NextResponse.json(
        { success: false as const, error: 'Internal server error', timestamp: new Date().toISOString() },
        { status: 500 }
      ));

      mockPortfolioQueries.getPublishedItems.mockRejectedValue(dbError);
      mockErrorHandler.handleError.mockReturnValue(mockErrorResponse);

      const request = new NextRequest('http://localhost:3000/api/portfolio');

      // Act
      const response = await GET(request);

      // Assert
      expect(response.status).toBe(500);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith(
        dbError,
        expect.objectContaining({
          route: '/api/portfolio',
          operation: 'fetch_portfolio_items',
        })
      );
    });
  });

  describe('POST /api/portfolio', () => {
    it('should create a new portfolio item successfully', async () => {
      // Arrange
      const portfolioData = {
        title: 'New Portfolio Item',
        description: 'Test description',
        mediaType: 'IMAGE',
        filePath: '/uploads/test-image.jpg',
        categoryId: 'category-1',
        status: 'DRAFT',
        featured: false,
        tags: ['test', 'portfolio'],
        metadata: { camera: 'Canon EOS R5' },
        sortOrder: 0,
      };

      const mockCategory = MockFactories.createMockCategory({
        id: portfolioData.categoryId,
        name: 'Nature',
        slug: 'nature',
      });

      const mockCreatedItem = {
        ...MockFactories.createMockPortfolioItem({
          id: 'new-item-id',
          title: portfolioData.title,
          description: portfolioData.description,
          mediaType: 'IMAGE',
          filePath: portfolioData.filePath,
          thumbnailPath: null,
          tags: JSON.stringify(portfolioData.tags),
          metadata: JSON.stringify(portfolioData.metadata),
          status: 'DRAFT',
          featured: portfolioData.featured,
          sortOrder: portfolioData.sortOrder,
          viewCount: 0,
          publishedAt: null,
          categoryId: portfolioData.categoryId,
          userId: null,
        }),
        category: mockCategory,
      };

      mockPortfolioQueries.createPortfolioItem.mockResolvedValue(
        mockCreatedItem
      );

      const request = new NextRequest('http://localhost:3000/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolioData),
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(responseData).toEqual({
        success: true,
        data: {
          ...mockCreatedItem,
          createdAt: expect.any(String), // Date is serialized as string in JSON response
          updatedAt: expect.any(String), // Date is serialized as string in JSON response
          publishedAt: mockCreatedItem.publishedAt ? expect.any(String) : null,
          category: {
            ...mockCreatedItem.category,
            createdAt: expect.any(String), // Date is serialized as string in JSON response
          },
          tags: portfolioData.tags,
          metadata: portfolioData.metadata,
        },
      });

      expect(mockPortfolioQueries.createPortfolioItem).toHaveBeenCalledWith(
        expect.objectContaining({
          title: portfolioData.title,
          description: portfolioData.description,
          mediaType: portfolioData.mediaType as any,
          filePath: portfolioData.filePath,
          categoryId: portfolioData.categoryId,
          status: portfolioData.status,
          featured: portfolioData.featured,
        })
      );
    });

    it('should validate required fields and return validation error', async () => {
      // Arrange
      const invalidData = {
        title: '', // Empty title should fail validation
        mediaType: 'IMAGE',
        filePath: '/test.jpg',
      };

      const mockError = {
        message: 'Invalid portfolio data',
        type: 'VALIDATION_ERROR',
        statusCode: 400,
        isOperational: true,
      };
      const mockErrorResponse = Promise.resolve(NextResponse.json(
        { success: false as const, error: 'Validation error', timestamp: new Date().toISOString() },
        { status: 400 }
      ));

      mockErrorHandler.createValidationError.mockReturnValue(mockError as any);
      mockErrorHandler.handleError.mockReturnValue(mockErrorResponse);

      const request = new NextRequest('http://localhost:3000/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      // Act
      const response = await POST(request);

      // Assert
      expect(response.status).toBe(400);
      expect(mockErrorHandler.createValidationError).toHaveBeenCalledWith(
        expect.stringContaining('Invalid portfolio data'),
        expect.any(Object)
      );
    });

    it('should handle database errors during creation', async () => {
      // Arrange
      const validData = {
        title: 'Test Item',
        mediaType: 'IMAGE',
        filePath: '/test.jpg',
      };

      const dbError = new Error('Database insert failed');
      const mockErrorResponse = Promise.resolve(NextResponse.json(
        { success: false as const, error: 'Internal server error', timestamp: new Date().toISOString() },
        { status: 500 }
      ));

      mockPortfolioQueries.createPortfolioItem.mockRejectedValue(dbError);
      mockErrorHandler.handleError.mockReturnValue(mockErrorResponse);

      const request = new NextRequest('http://localhost:3000/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validData),
      });

      // Act
      const response = await POST(request);

      // Assert
      expect(response.status).toBe(500);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith(
        dbError,
        expect.objectContaining({
          route: '/api/portfolio',
          operation: 'create_portfolio_item',
        })
      );
    });
  });

  describe('Logging', () => {
    it('should log API requests and responses', async () => {
      // Arrange
      mockPortfolioQueries.getPublishedItems.mockResolvedValue({
        items: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      });

      const request = new NextRequest('http://localhost:3000/api/portfolio');

      // Act
      await GET(request);

      // Assert
      expect(mockLogger.apiLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Portfolio items fetch request',
          requestId: mockRequestContext.requestId,
          method: 'GET',
        })
      );

      expect(mockLogger.apiLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Portfolio items fetched successfully',
          statusCode: 200,
        })
      );
    });

    it('should log database operations', async () => {
      // Arrange
      mockPortfolioQueries.getPublishedItems.mockResolvedValue({
        items: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      });

      const request = new NextRequest('http://localhost:3000/api/portfolio');

      // Act
      await GET(request);

      // Assert
      expect(mockLogger.databaseLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Fetching portfolio items',
          operation: 'READ',
          table: 'PortfolioItem',
        })
      );

      expect(mockLogger.databaseLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Portfolio items fetched successfully',
          operation: 'READ',
          table: 'PortfolioItem',
        })
      );
    });
  });
});
