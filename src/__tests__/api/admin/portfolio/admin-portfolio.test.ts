
/**
 * Unit tests for /api/admin/portfolio routes
 */
// Import mock setup FIRST to ensure mocks are established
import '@/__tests__/setup/mock-setup';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/admin/portfolio/route';
import { TestUtils } from '@/__tests__/utils/test-utils';
import { MockFactories } from '@/__tests__/utils/mock-factories';
import {
  resetAllMocks,
  mockPortfolioQueries,
  mockGetRequestContext,
  defaultRequestContext,
  mockErrorHandler,
  mockLogger,
} from '@/__tests__/setup/mock-setup';

describe('/api/admin/portfolio', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe('GET /api/admin/portfolio', () => {
    const mockPaginationResult = MockFactories.createPaginatedResult(
      MockFactories.createMultiple(
        MockFactories.createMockPortfolioItem,
        5,
        { status: 'DRAFT' } // Include non-published items for admin
      ),
      1,
      12,
      15
    );

    it('should return all portfolio items with default pagination', async () => {
      // Arrange
      mockPortfolioQueries.getAllItems.mockResolvedValue(mockPaginationResult);

      const request = TestUtils.createMockRequest(
        'http://localhost:3000/api/admin/portfolio'
      );

      // Act
      const response = await GET(request);
      const responseData = await TestUtils.extractJsonResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        data: mockPaginationResult.items,
        pagination: mockPaginationResult.pagination,
      });

      expect(mockPortfolioQueries.getAllItems).toHaveBeenCalledWith({
        page: 1,
        limit: 12,
        category: undefined,
        status: undefined,
        featured: undefined,
        orderBy: 'createdAt',
        orderDirection: 'desc',
      });

      // Check response headers
      expect(response.headers.get('x-request-id')).toBe(
        defaultRequestContext.requestId
      );
    });

    it('should handle query parameters correctly', async () => {
      // Arrange
      const filteredResult = MockFactories.createPaginatedResult(
        MockFactories.createMultiple(
          MockFactories.createMockPortfolioItem,
          3,
          { status: 'PUBLISHED', categoryId: 'nature-category' }
        ),
        2,
        5,
        10
      );

      mockPortfolioQueries.getAllItems.mockResolvedValue(filteredResult);

      const request = TestUtils.createMockRequest(
        'http://localhost:3000/api/admin/portfolio',
        {
          searchParams: {
            page: '2',
            limit: '5',
            category: 'nature',
            status: 'PUBLISHED',
            featured: 'true',
            orderBy: 'viewCount',
            orderDirection: 'asc',
          },
        }
      );

      // Act
      const response = await GET(request);
      const responseData = await TestUtils.extractJsonResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.data).toEqual(filteredResult.items);
      expect(responseData.pagination).toEqual(filteredResult.pagination);

      expect(mockPortfolioQueries.getAllItems).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        category: 'nature',
        status: 'PUBLISHED',
        featured: true,
        orderBy: 'viewCount',
        orderDirection: 'asc',
      });
    });

    it('should enforce maximum limit of 50 items per page', async () => {
      // Arrange
      const largeResult = MockFactories.createPaginatedResult(
        MockFactories.createMultiple(MockFactories.createMockPortfolioItem, 50),
        1,
        50,
        100
      );

      mockPortfolioQueries.getAllItems.mockResolvedValue(largeResult);

      const request = TestUtils.createMockRequest(
        'http://localhost:3000/api/admin/portfolio',
        {
          searchParams: {
            limit: '100', // Should be capped at 50
          },
        }
      );

      // Act
      await GET(request);

      // Assert - Should cap at 50
      expect(mockPortfolioQueries.getAllItems).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 50,
        })
      );
    });

    it('should validate page parameter and return error for invalid page', async () => {
      // Arrange
      const mockError = new Error('Page must be greater than 0');
      const mockErrorResponse = TestUtils.createErrorResponse(
        'Page must be greater than 0',
        400
      );

      mockErrorHandler.createValidationError.mockReturnValue(mockError);
      mockErrorHandler.handleError.mockReturnValue(
        new Response(JSON.stringify(mockErrorResponse), { status: 400 })
      );

      const request = TestUtils.createMockRequest(
        'http://localhost:3000/api/admin/portfolio',
        {
          searchParams: {
            page: '0',
          },
        }
      );

      // Act
      const response = await GET(request);

      // Assert
      expect(response.status).toBe(400);
      expect(mockErrorHandler.createValidationError).toHaveBeenCalledWith(
        'Page must be greater than 0',
        { page: 0 }
      );
      expect(mockPortfolioQueries.getAllItems).not.toHaveBeenCalled();
    });

    it('should validate limit parameter and return error for invalid limit', async () => {
      // Arrange
      const mockError = new Error('Limit must be greater than 0');
      const mockErrorResponse = TestUtils.createErrorResponse(
        'Limit must be greater than 0',
        400
      );

      mockErrorHandler.createValidationError.mockReturnValue(mockError);
      mockErrorHandler.handleError.mockReturnValue(
        new Response(JSON.stringify(mockErrorResponse), { status: 400 })
      );

      const request = TestUtils.createMockRequest(
        'http://localhost:3000/api/admin/portfolio',
        {
          searchParams: {
            limit: '0',
          },
        }
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

    it('should handle database errors gracefully', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockPortfolioQueries.getAllItems.mockRejectedValue(dbError);

      const mockErrorResponse = TestUtils.createErrorResponse(
        'Internal server error',
        500
      );
      mockErrorHandler.handleError.mockReturnValue(
        new Response(JSON.stringify(mockErrorResponse), { status: 500 })
      );

      const request = TestUtils.createMockRequest(
        'http://localhost:3000/api/admin/portfolio'
      );

      // Act
      const response = await GET(request);

      // Assert
      expect(response.status).toBe(500);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith(
        dbError,
        expect.objectContaining({
          route: '/api/admin/portfolio',
          operation: 'fetch_admin_portfolio_items',
        })
      );
    });

    it('should filter by all supported status values', async () => {
      // Arrange
      const statuses = ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'] as const;
      
      for (const status of statuses) {
        const filteredResult = MockFactories.createPaginatedResult(
          MockFactories.createMultiple(
            MockFactories.createMockPortfolioItem,
            2,
            { status }
          )
        );

        mockPortfolioQueries.getAllItems.mockResolvedValue(filteredResult);

        const request = TestUtils.createMockRequest(
          'http://localhost:3000/api/admin/portfolio',
          {
            searchParams: {
              status,
            },
          }
        );

        // Act
        await GET(request);

        // Assert
        expect(mockPortfolioQueries.getAllItems).toHaveBeenCalledWith(
          expect.objectContaining({
            status,
          })
        );
      }
    });

    it('should support all ordering options', async () => {
      // Arrange
      const orderByOptions = ['createdAt', 'publishedAt', 'viewCount', 'title'] as const;
      const orderDirections = ['asc', 'desc'] as const;

      for (const orderBy of orderByOptions) {
        for (const orderDirection of orderDirections) {
          const mockResult = MockFactories.createPaginatedResult(
            MockFactories.createMultiple(MockFactories.createMockPortfolioItem, 3)
          );

          mockPortfolioQueries.getAllItems.mockResolvedValue(mockResult);

          const request = TestUtils.createMockRequest(
            'http://localhost:3000/api/admin/portfolio',
            {
              searchParams: {
                orderBy,
                orderDirection,
              },
            }
          );

          // Act
          await GET(request);

          // Assert
          expect(mockPortfolioQueries.getAllItems).toHaveBeenCalledWith(
            expect.objectContaining({
              orderBy,
              orderDirection,
            })
          );
        }
      }
    });

    it('should handle featured filter correctly', async () => {
      // Arrange - Test both true and undefined (false should not be passed)
      const testCases = [
        { featuredParam: 'true', expectedValue: true },
        { featuredParam: 'false', expectedValue: undefined }, // Not featured
        { featuredParam: undefined, expectedValue: undefined },
      ];

      for (const { featuredParam, expectedValue } of testCases) {
        const mockResult = MockFactories.createPaginatedResult(
          MockFactories.createMultiple(
            MockFactories.createMockPortfolioItem,
            2,
            { featured: expectedValue === true }
          )
        );

        mockPortfolioQueries.getAllItems.mockResolvedValue(mockResult);

        const searchParams: Record<string, string> = {};
        if (featuredParam) {
          searchParams.featured = featuredParam;
        }

        const request = TestUtils.createMockRequest(
          'http://localhost:3000/api/admin/portfolio',
          { searchParams }
        );

        // Act
        await GET(request);

        // Assert
        expect(mockPortfolioQueries.getAllItems).toHaveBeenCalledWith(
          expect.objectContaining({
            featured: expectedValue,
          })
        );
      }
    });

    it('should parse query parameters with proper type conversion', async () => {
      // Arrange
      mockPortfolioQueries.getAllItems.mockResolvedValue(
        MockFactories.createPaginatedResult([])
      );

      const request = TestUtils.createMockRequest(
        'http://localhost:3000/api/admin/portfolio',
        {
          searchParams: {
            page: '3',
            limit: '20',
          },
        }
      );

      // Act
      await GET(request);

      // Assert - Verify numbers are parsed correctly
      expect(mockPortfolioQueries.getAllItems).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 3, // Should be number, not string
          limit: 20, // Should be number, not string
        })
      );
    });

    it('should log all operations correctly', async () => {
      // Arrange
      mockPortfolioQueries.getAllItems.mockResolvedValue(mockPaginationResult);

      const request = TestUtils.createMockRequest(
        'http://localhost:3000/api/admin/portfolio'
      );

      // Act
      await GET(request);

      // Assert - Check all logging operations
      expect(mockLogger.apiLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Admin portfolio items fetch request',
          requestId: defaultRequestContext.requestId,
          statusCode: 0,
          responseTime: 0,
        })
      );

      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Parsed admin portfolio query parameters',
        expect.objectContaining({
          requestId: defaultRequestContext.requestId,
          page: 1,
          limit: 12,
        })
      );

      expect(mockLogger.databaseLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Fetching admin portfolio items',
          operation: 'READ',
          table: 'PortfolioItem',
        })
      );

      expect(mockLogger.databaseLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Admin portfolio items fetched successfully',
          operation: 'READ',
          table: 'PortfolioItem',
        })
      );

      expect(mockLogger.apiLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Admin portfolio items fetched successfully',
          statusCode: 200,
        })
      );
    });

    it('should validate response structure matches API specification', async () => {
      // Arrange
      mockPortfolioQueries.getAllItems.mockResolvedValue(mockPaginationResult);

      const request = TestUtils.createMockRequest(
        'http://localhost:3000/api/admin/portfolio'
      );

      // Act
      const response = await GET(request);
      const responseData = await TestUtils.extractJsonResponse(response);

      // Assert
      expect(TestUtils.validateApiResponse(responseData, {
        success: true,
        hasData: true,
        hasError: false,
        hasPagination: true,
      })).toBe(true);

      // Validate pagination structure
      expect(TestUtils.validatePagination(responseData.pagination)).toBe(true);

      // Validate data is array
      expect(Array.isArray(responseData.data)).toBe(true);

      // Validate items structure if present
      if (responseData.data.length > 0) {
        const item = responseData.data[0];
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('status');
        expect(item).toHaveProperty('createdAt');
      }
    });

    it('should handle empty results correctly', async () => {
      // Arrange
      const emptyResult = MockFactories.createPaginatedResult([], 1, 12, 0);
      mockPortfolioQueries.getAllItems.mockResolvedValue(emptyResult);

      const request = TestUtils.createMockRequest(
        'http://localhost:3000/api/admin/portfolio'
      );

      // Act
      const response = await GET(request);
      const responseData = await TestUtils.extractJsonResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.data).toEqual([]);
      expect(responseData.pagination.totalItems).toBe(0);
      expect(responseData.pagination.totalPages).toBe(0);
    });

    it('should include request context in error handling', async () => {
      // Arrange
      const customContext = {
        ...defaultRequestContext,
        ip: '192.168.1.200',
        userAgent: 'Admin Dashboard',
      };

      mockGetRequestContext.mockReturnValue(customContext);
      
      const dbError = new Error('Connection timeout');
      mockPortfolioQueries.getAllItems.mockRejectedValue(dbError);

      const mockErrorResponse = TestUtils.createErrorResponse(
        'Internal server error',
        500
      );
      mockErrorHandler.handleError.mockReturnValue(
        new Response(JSON.stringify(mockErrorResponse), { status: 500 })
      );

      const request = TestUtils.createMockRequest(
        'http://localhost:3000/api/admin/portfolio'
      );

      // Act
      await GET(request);

      // Assert
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith(
        dbError,
        expect.objectContaining({
          requestId: customContext.requestId,
          ip: customContext.ip,
          userAgent: customContext.userAgent,
          route: '/api/admin/portfolio',
          operation: 'fetch_admin_portfolio_items',
        })
      );
    });
  });
});