/**
 * Unit tests for /api/portfolio/[id] route
 */
// Import mock setup FIRST to ensure mocks are established
import '@/__tests__/setup/mock-setup';
import {
  defaultRequestContext,
  mockErrorHandler,
  mockGetRequestContext,
  mockLogger,
  mockPortfolioQueries,
  resetAllMocks,
} from '@/__tests__/setup/mock-setup';
import { MockFactories } from '@/__tests__/utils/mock-factories';
import { TestUtils } from '@/__tests__/utils/test-utils';
import { GET } from '@/app/api/portfolio/[id]/route';

describe('/api/portfolio/[id]', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe('GET /api/portfolio/[id]', () => {
    const validPortfolioId = 'portfolio-id-123';
    const mockPortfolioItem = MockFactories.createMockPortfolioItem({
      id: validPortfolioId,
      status: 'PUBLISHED',
      categoryId: 'category-123',
      title: 'Test Portfolio Item',
    });

    it('should return portfolio item with related items successfully', async () => {
      // Arrange
      const mockRelatedItems = MockFactories.createMultiple(
        MockFactories.createMockPortfolioItem,
        3,
        { categoryId: mockPortfolioItem.categoryId, status: 'PUBLISHED' }
      );

      mockPortfolioQueries.getById.mockResolvedValue(mockPortfolioItem);
      mockPortfolioQueries.getRelatedItems.mockResolvedValue(mockRelatedItems);

      const request = TestUtils.createMockRequest(
        `http://localhost:3000/api/portfolio/${validPortfolioId}`
      );

      // Mock params properly
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act
      const response = await GET(request, { params: mockParams });
      const responseData = await TestUtils.extractJsonResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        data: {
          item: {
            ...mockPortfolioItem,
            createdAt: expect.any(String), // Date is serialized as string in JSON response
            updatedAt: expect.any(String), // Date is serialized as string in JSON response
            publishedAt: expect.any(String), // Date is serialized as string in JSON response
          },
          relatedItems: mockRelatedItems.map(item => ({
            ...item,
            createdAt: expect.any(String), // Date is serialized as string in JSON response
            updatedAt: expect.any(String), // Date is serialized as string in JSON response
            publishedAt: expect.any(String), // Date is serialized as string in JSON response
          })),
        },
      });

      expect(mockPortfolioQueries.getById).toHaveBeenCalledWith(
        validPortfolioId
      );
      expect(mockPortfolioQueries.getRelatedItems).toHaveBeenCalledWith(
        mockPortfolioItem.id,
        mockPortfolioItem.categoryId,
        4
      );

      // Check response headers
      expect(response.headers.get('x-request-id')).toBe(
        defaultRequestContext.requestId
      );
    });

    it('should return portfolio item without related items when no category', async () => {
      // Arrange
      const mockItemWithoutCategory = MockFactories.createMockPortfolioItem({
        id: validPortfolioId,
        categoryId: null,
        status: 'PUBLISHED',
      });

      mockPortfolioQueries.getById.mockResolvedValue(mockItemWithoutCategory);

      const request = TestUtils.createMockRequest(
        `http://localhost:3000/api/portfolio/${validPortfolioId}`
      );
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act
      const response = await GET(request, { params: mockParams });
      const responseData = await TestUtils.extractJsonResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(responseData.data).toEqual({
        item: {
          ...mockItemWithoutCategory,
          createdAt: expect.any(String), // Date is serialized as string in JSON response
          updatedAt: expect.any(String), // Date is serialized as string in JSON response
          publishedAt: expect.any(String), // Date is serialized as string in JSON response
        },
        relatedItems: [],
      });

      expect(mockPortfolioQueries.getById).toHaveBeenCalledWith(
        validPortfolioId
      );
      expect(mockPortfolioQueries.getRelatedItems).not.toHaveBeenCalled();
    });

    it('should return 404 when portfolio item not found', async () => {
      // Arrange
      const nonExistentId = 'non-existent-id';
      mockPortfolioQueries.getById.mockResolvedValue(null);

      const mockError = new Error('Portfolio item not found');
      const mockErrorResponse = TestUtils.createErrorResponse(
        'Portfolio item not found',
        404
      );

      mockErrorHandler.createNotFoundError.mockReturnValue(mockError);
      mockErrorHandler.handleError.mockReturnValue(
        new Response(JSON.stringify(mockErrorResponse), { status: 404 })
      );

      const request = TestUtils.createMockRequest(
        `http://localhost:3000/api/portfolio/${nonExistentId}`
      );
      const mockParams = Promise.resolve({ id: nonExistentId });

      // Act
      const response = await GET(request, { params: mockParams });

      // Assert
      expect(response.status).toBe(404);
      expect(mockPortfolioQueries.getById).toHaveBeenCalledWith(nonExistentId);
      expect(mockErrorHandler.createNotFoundError).toHaveBeenCalledWith(
        'Portfolio item'
      );
    });

    it('should validate ID parameter and return error for invalid ID', async () => {
      // Arrange
      const invalidId = '';
      const mockError = new Error('Valid portfolio item ID is required');
      const mockErrorResponse = TestUtils.createErrorResponse(
        'Valid portfolio item ID is required',
        400
      );

      mockErrorHandler.createValidationError.mockReturnValue(mockError);
      mockErrorHandler.handleError.mockReturnValue(
        new Response(JSON.stringify(mockErrorResponse), { status: 400 })
      );

      const request = TestUtils.createMockRequest(
        'http://localhost:3000/api/portfolio/'
      );
      const mockParams = Promise.resolve({ id: invalidId });

      // Act
      const response = await GET(request, { params: mockParams });

      // Assert
      expect(response.status).toBe(400);
      expect(mockErrorHandler.createValidationError).toHaveBeenCalledWith(
        'Valid portfolio item ID is required',
        { id: invalidId }
      );
      expect(mockPortfolioQueries.getById).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockPortfolioQueries.getById.mockRejectedValue(dbError);

      const mockErrorResponse = TestUtils.createErrorResponse(
        'Internal server error',
        500
      );
      mockErrorHandler.handleError.mockReturnValue(
        new Response(JSON.stringify(mockErrorResponse), { status: 500 })
      );

      const request = TestUtils.createMockRequest(
        `http://localhost:3000/api/portfolio/${validPortfolioId}`
      );
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act
      const response = await GET(request, { params: mockParams });

      // Assert
      expect(response.status).toBe(500);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith(
        dbError,
        expect.objectContaining({
          route: '/api/portfolio/[id]',
          operation: 'fetch_portfolio_item',
          inputData: { id: validPortfolioId },
        })
      );
    });

    it('should handle related items query error gracefully', async () => {
      // Arrange
      const relatedItemsError = new Error('Related items query failed');
      mockPortfolioQueries.getById.mockResolvedValue(mockPortfolioItem);
      mockPortfolioQueries.getRelatedItems.mockRejectedValue(relatedItemsError);

      const mockErrorResponse = TestUtils.createErrorResponse(
        'Internal server error',
        500
      );
      mockErrorHandler.handleError.mockReturnValue(
        new Response(JSON.stringify(mockErrorResponse), { status: 500 })
      );

      const request = TestUtils.createMockRequest(
        `http://localhost:3000/api/portfolio/${validPortfolioId}`
      );
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act
      const response = await GET(request, { params: mockParams });

      // Assert
      expect(response.status).toBe(500);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith(
        relatedItemsError,
        expect.objectContaining({
          route: '/api/portfolio/[id]',
          operation: 'fetch_portfolio_item',
        })
      );
    });

    it('should log performance warning for slow queries', async () => {
      // Arrange
      mockPortfolioQueries.getById.mockImplementation(async () => {
        // Simulate slow database query
        await TestUtils.wait(600); // 600ms > 500ms threshold
        return mockPortfolioItem;
      });

      mockPortfolioQueries.getRelatedItems.mockResolvedValue([]);

      const request = TestUtils.createMockRequest(
        `http://localhost:3000/api/portfolio/${validPortfolioId}`
      );
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act
      await GET(request, { params: mockParams });

      // Assert
      expect(mockLogger.performanceLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Slow portfolio item query detected',
          requestId: defaultRequestContext.requestId,
          metrics: expect.objectContaining({
            responseTime: expect.any(Number),
            dbQueryTime: expect.any(Number),
            dbQueryCount: expect.any(Number),
            memoryUsage: expect.any(Number),
          }),
        })
      );
    });

    it('should log all API and database operations correctly', async () => {
      // Arrange
      mockPortfolioQueries.getById.mockResolvedValue(mockPortfolioItem);
      mockPortfolioQueries.getRelatedItems.mockResolvedValue([]);

      const request = TestUtils.createMockRequest(
        `http://localhost:3000/api/portfolio/${validPortfolioId}`
      );
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act
      await GET(request, { params: mockParams });

      // Assert - Check that all logging calls were made
      expect(mockLogger.apiLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Portfolio item fetch request',
          requestId: defaultRequestContext.requestId,
          metadata: expect.objectContaining({
            portfolioId: validPortfolioId,
          }),
        })
      );

      expect(mockLogger.databaseLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Fetching portfolio item by ID',
          operation: 'READ',
          table: 'PortfolioItem',
        })
      );

      expect(mockLogger.databaseLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Portfolio item fetched successfully',
          operation: 'READ',
          table: 'PortfolioItem',
        })
      );

      expect(mockLogger.apiLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Portfolio item fetched successfully',
          statusCode: 200,
        })
      );
    });

    it('should include request context in all operations', async () => {
      // Arrange
      const customContext = {
        ...defaultRequestContext,
        ip: '192.168.1.100',
        userAgent: 'Custom Test Agent',
        url: `http://localhost:3000/api/portfolio/${validPortfolioId}`,
      };

      mockGetRequestContext.mockReturnValue(customContext);
      mockPortfolioQueries.getById.mockResolvedValue(mockPortfolioItem);
      mockPortfolioQueries.getRelatedItems.mockResolvedValue([]);

      const request = TestUtils.createMockRequest(customContext.url, {
        headers: {
          'x-forwarded-for': customContext.ip,
          'user-agent': customContext.userAgent,
        },
      });
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act
      await GET(request, { params: mockParams });

      // Assert - Verify context is passed correctly
      expect(mockLogger.apiLog).toHaveBeenCalledWith(
        expect.objectContaining({
          requestId: customContext.requestId,
          ip: customContext.ip,
          userAgent: customContext.userAgent,
          url: customContext.url,
        })
      );
    });

    it('should handle non-string ID parameter', async () => {
      // Arrange
      const mockError = new Error('Valid portfolio item ID is required');
      const mockErrorResponse = TestUtils.createErrorResponse(
        'Valid portfolio item ID is required',
        400
      );

      mockErrorHandler.createValidationError.mockReturnValue(mockError);
      mockErrorHandler.handleError.mockReturnValue(
        new Response(JSON.stringify(mockErrorResponse), { status: 400 })
      );

      const request = TestUtils.createMockRequest(
        'http://localhost:3000/api/portfolio/123'
      );
      // Simulate invalid ID (though in practice, route params are strings)
      const mockParams = Promise.resolve({ id: null as any });

      // Act
      const response = await GET(request, { params: mockParams });

      // Assert
      expect(response.status).toBe(400);
      expect(mockErrorHandler.createValidationError).toHaveBeenCalledWith(
        'Valid portfolio item ID is required',
        { id: null }
      );
    });

    it('should validate response structure', async () => {
      // Arrange
      const mockRelatedItems = MockFactories.createMultiple(
        MockFactories.createMockPortfolioItem,
        2
      );

      mockPortfolioQueries.getById.mockResolvedValue(mockPortfolioItem);
      mockPortfolioQueries.getRelatedItems.mockResolvedValue(mockRelatedItems);

      const request = TestUtils.createMockRequest(
        `http://localhost:3000/api/portfolio/${validPortfolioId}`
      );
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act
      const response = await GET(request, { params: mockParams });
      const responseData = await TestUtils.extractJsonResponse(response);

      // Assert
      expect(
        TestUtils.validateApiResponse(responseData, {
          success: true,
          hasData: true,
          hasError: false,
        })
      ).toBe(true);

      // Validate data structure
      expect(responseData.data).toHaveProperty('item');
      expect(responseData.data).toHaveProperty('relatedItems');
      expect(Array.isArray(responseData.data.relatedItems)).toBe(true);

      // Validate item structure
      expect(responseData.data.item).toHaveProperty('id');
      expect(responseData.data.item).toHaveProperty('title');
      expect(responseData.data.item).toHaveProperty('status');
      expect(responseData.data.item).toHaveProperty('categoryId');
    });
  });
});
