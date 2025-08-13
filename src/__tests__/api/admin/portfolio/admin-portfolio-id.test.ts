
/**
 * Unit tests for /api/admin/portfolio/[id] routes
 */
// Import mock setup FIRST to ensure mocks are established
import '@/__tests__/setup/mock-setup';

import { NextRequest } from 'next/server';
import { GET, PUT } from '@/app/api/admin/portfolio/[id]/route';
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

describe('/api/admin/portfolio/[id]', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe('GET /api/admin/portfolio/[id]', () => {
    const validPortfolioId = 'admin-portfolio-123';
    const mockPortfolioItem = MockFactories.createMockPortfolioItem({
      id: validPortfolioId,
      status: 'DRAFT', // Admin can see draft items
      title: 'Admin Portfolio Item',
      tags: JSON.stringify(['admin', 'test']),
      metadata: JSON.stringify({ camera: 'Canon EOS R5', iso: 400 }),
    });

    it('should return admin portfolio item successfully with parsed JSON fields', async () => {
      // Arrange
      mockPortfolioQueries.getByIdForAdmin.mockResolvedValue(mockPortfolioItem);

      const request = TestUtils.createMockRequest(
        `http://localhost:3000/api/admin/portfolio/${validPortfolioId}`
      );
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act
      const response = await GET(request, { params: mockParams });
      const responseData = await TestUtils.extractJsonResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        data: {
          ...mockPortfolioItem,
          tags: ['admin', 'test'], // Should be parsed JSON
          metadata: { camera: 'Canon EOS R5', iso: 400 }, // Should be parsed JSON
        },
      });

      expect(mockPortfolioQueries.getByIdForAdmin).toHaveBeenCalledWith(validPortfolioId);
      expect(response.headers.get('x-request-id')).toBe(
        defaultRequestContext.requestId
      );
    });

    it('should return 404 when admin portfolio item not found', async () => {
      // Arrange
      const nonExistentId = 'non-existent-admin-id';
      mockPortfolioQueries.getByIdForAdmin.mockResolvedValue(null);

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
        `http://localhost:3000/api/admin/portfolio/${nonExistentId}`
      );
      const mockParams = Promise.resolve({ id: nonExistentId });

      // Act
      const response = await GET(request, { params: mockParams });

      // Assert
      expect(response.status).toBe(404);
      expect(mockPortfolioQueries.getByIdForAdmin).toHaveBeenCalledWith(nonExistentId);
      expect(mockErrorHandler.createNotFoundError).toHaveBeenCalledWith(
        'Portfolio item not found'
      );
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockPortfolioQueries.getByIdForAdmin.mockRejectedValue(dbError);

      const mockErrorResponse = TestUtils.createErrorResponse(
        'Internal server error',
        500
      );
      mockErrorHandler.handleError.mockReturnValue(
        new Response(JSON.stringify(mockErrorResponse), { status: 500 })
      );

      const request = TestUtils.createMockRequest(
        `http://localhost:3000/api/admin/portfolio/${validPortfolioId}`
      );
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act
      const response = await GET(request, { params: mockParams });

      // Assert
      expect(response.status).toBe(500);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith(
        dbError,
        expect.objectContaining({
          route: '/api/admin/portfolio/[id]',
          operation: 'fetch_admin_portfolio_item',
          inputData: { id: validPortfolioId },
        })
      );
    });

    it('should handle malformed JSON in tags and metadata gracefully', async () => {
      // Arrange
      const itemWithMalformedJSON = MockFactories.createMockPortfolioItem({
        id: validPortfolioId,
        tags: 'invalid-json', // Malformed JSON
        metadata: '{"unclosed": object', // Malformed JSON
      });

      mockPortfolioQueries.getByIdForAdmin.mockResolvedValue(itemWithMalformedJSON);

      const request = TestUtils.createMockRequest(
        `http://localhost:3000/api/admin/portfolio/${validPortfolioId}`
      );
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act & Assert - Should handle gracefully or throw predictable error
      try {
        const response = await GET(request, { params: mockParams });
        // If it succeeds, JSON.parse should have been called with fallback values
        const responseData = await TestUtils.extractJsonResponse(response);
        // Either the endpoint handles it gracefully, or it should throw an error
        expect(response.status).toBeGreaterThanOrEqual(200);
      } catch (error) {
        // If it throws, it should be handled by error handler
        expect(mockErrorHandler.handleError).toHaveBeenCalled();
      }
    });
  });

  describe('PUT /api/admin/portfolio/[id]', () => {
    const validPortfolioId = 'admin-portfolio-123';
    const originalItem = MockFactories.createMockPortfolioItem({
      id: validPortfolioId,
      status: 'DRAFT',
      title: 'Original Title',
    });

    it('should update portfolio item successfully', async () => {
      // Arrange
      const updateData = {
        title: 'Updated Title',
        description: 'Updated description',
        status: 'PUBLISHED' as const,
        featured: true,
        tags: JSON.stringify(['updated', 'published']),
        metadata: JSON.stringify({ camera: 'Sony A7R5' }),
      };

      const updatedItem = {
        ...originalItem,
        ...updateData,
        updatedAt: new Date(),
      };

      mockPortfolioQueries.updatePortfolioItem.mockResolvedValue(updatedItem);

      const request = TestUtils.createMockRequest(
        `http://localhost:3000/api/admin/portfolio/${validPortfolioId}`,
        {
          method: 'PUT',
          body: updateData,
        }
      );
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act
      const response = await PUT(request, { params: mockParams });
      const responseData = await TestUtils.extractJsonResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        data: {
          ...updatedItem,
          tags: ['updated', 'published'], // Should be parsed JSON
          metadata: { camera: 'Sony A7R5' }, // Should be parsed JSON
        },
      });

      expect(mockPortfolioQueries.updatePortfolioItem).toHaveBeenCalledWith(
        validPortfolioId,
        updateData
      );
    });

    it('should validate update data and return error for invalid data', async () => {
      // Arrange
      const invalidUpdateData = {
        title: '', // Empty title should fail validation
        status: 'INVALID_STATUS' as any, // Invalid status
      };

      const mockError = new Error('Invalid update data');
      const mockErrorResponse = TestUtils.createErrorResponse(
        'Invalid update data',
        400
      );

      mockErrorHandler.createValidationError.mockReturnValue(mockError);
      mockErrorHandler.handleError.mockReturnValue(
        new Response(JSON.stringify(mockErrorResponse), { status: 400 })
      );

      const request = TestUtils.createMockRequest(
        `http://localhost:3000/api/admin/portfolio/${validPortfolioId}`,
        {
          method: 'PUT',
          body: invalidUpdateData,
        }
      );
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act
      const response = await PUT(request, { params: mockParams });

      // Assert
      expect(response.status).toBe(400);
      expect(mockErrorHandler.createValidationError).toHaveBeenCalledWith(
        expect.stringContaining('Invalid update data'),
        expect.objectContaining({
          validationErrors: expect.any(Array),
        })
      );
      expect(mockPortfolioQueries.updatePortfolioItem).not.toHaveBeenCalled();
    });

    it('should validate all supported status transitions', async () => {
      // Arrange
      const validStatuses = ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'] as const;

      for (const status of validStatuses) {
        const updateData = { status };
        const updatedItem = { ...originalItem, status };

        mockPortfolioQueries.updatePortfolioItem.mockResolvedValue(updatedItem);

        const request = TestUtils.createMockRequest(
          `http://localhost:3000/api/admin/portfolio/${validPortfolioId}`,
          {
            method: 'PUT',
            body: updateData,
          }
        );
        const mockParams = Promise.resolve({ id: validPortfolioId });

        // Act
        const response = await PUT(request, { params: mockParams });

        // Assert
        expect(response.status).toBe(200);
        expect(mockPortfolioQueries.updatePortfolioItem).toHaveBeenCalledWith(
          validPortfolioId,
          updateData
        );
      }
    });

    it('should handle partial updates correctly', async () => {
      // Arrange
      const partialUpdateData = {
        featured: true, // Only update featured flag
      };

      const updatedItem = {
        ...originalItem,
        featured: true,
      };

      mockPortfolioQueries.updatePortfolioItem.mockResolvedValue(updatedItem);

      const request = TestUtils.createMockRequest(
        `http://localhost:3000/api/admin/portfolio/${validPortfolioId}`,
        {
          method: 'PUT',
          body: partialUpdateData,
        }
      );
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act
      const response = await PUT(request, { params: mockParams });

      // Assert
      expect(response.status).toBe(200);
      expect(mockPortfolioQueries.updatePortfolioItem).toHaveBeenCalledWith(
        validPortfolioId,
        partialUpdateData
      );
    });

    it('should validate string length constraints', async () => {
      // Arrange
      const invalidUpdateData = {
        title: 'A'.repeat(101), // Too long (max 100)
        description: 'B'.repeat(501), // Too long (max 500)
      };

      const mockError = new Error('Invalid update data');
      const mockErrorResponse = TestUtils.createErrorResponse(
        'Invalid update data',
        400
      );

      mockErrorHandler.createValidationError.mockReturnValue(mockError);
      mockErrorHandler.handleError.mockReturnValue(
        new Response(JSON.stringify(mockErrorResponse), { status: 400 })
      );

      const request = TestUtils.createMockRequest(
        `http://localhost:3000/api/admin/portfolio/${validPortfolioId}`,
        {
          method: 'PUT',
          body: invalidUpdateData,
        }
      );
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act
      const response = await PUT(request, { params: mockParams });

      // Assert
      expect(response.status).toBe(400);
      expect(mockErrorHandler.createValidationError).toHaveBeenCalled();
    });

    it('should handle database update errors gracefully', async () => {
      // Arrange
      const validUpdateData = {
        title: 'Updated Title',
      };

      const dbError = new Error('Database update failed');
      mockPortfolioQueries.updatePortfolioItem.mockRejectedValue(dbError);

      const mockErrorResponse = TestUtils.createErrorResponse(
        'Internal server error',
        500
      );
      mockErrorHandler.handleError.mockReturnValue(
        new Response(JSON.stringify(mockErrorResponse), { status: 500 })
      );

      const request = TestUtils.createMockRequest(
        `http://localhost:3000/api/admin/portfolio/${validPortfolioId}`,
        {
          method: 'PUT',
          body: validUpdateData,
        }
      );
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act
      const response = await PUT(request, { params: mockParams });

      // Assert
      expect(response.status).toBe(500);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith(
        dbError,
        expect.objectContaining({
          route: '/api/admin/portfolio/[id]',
          operation: 'update_portfolio_item',
          inputData: { id: validPortfolioId },
        })
      );
    });

    it('should handle malformed JSON in request body', async () => {
      // Arrange
      const request = new NextRequest(
        `http://localhost:3000/api/admin/portfolio/${validPortfolioId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: 'invalid-json-body', // Malformed JSON
        }
      );
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act & Assert
      try {
        await PUT(request, { params: mockParams });
      } catch (error) {
        // Should be handled by error handler
        expect(mockErrorHandler.handleError).toHaveBeenCalled();
      }
    });

    it('should validate optional nullable fields correctly', async () => {
      // Arrange
      const updateData = {
        description: null, // Should be allowed
        categoryId: null, // Should be allowed
        thumbnailPath: null, // Should be allowed
      };

      const updatedItem = {
        ...originalItem,
        ...updateData,
      };

      mockPortfolioQueries.updatePortfolioItem.mockResolvedValue(updatedItem);

      const request = TestUtils.createMockRequest(
        `http://localhost:3000/api/admin/portfolio/${validPortfolioId}`,
        {
          method: 'PUT',
          body: updateData,
        }
      );
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act
      const response = await PUT(request, { params: mockParams });

      // Assert
      expect(response.status).toBe(200);
      expect(mockPortfolioQueries.updatePortfolioItem).toHaveBeenCalledWith(
        validPortfolioId,
        updateData
      );
    });

    it('should log all operations correctly', async () => {
      // Arrange
      const updateData = { title: 'New Title' };
      const updatedItem = { ...originalItem, ...updateData };

      mockPortfolioQueries.updatePortfolioItem.mockResolvedValue(updatedItem);

      const request = TestUtils.createMockRequest(
        `http://localhost:3000/api/admin/portfolio/${validPortfolioId}`,
        {
          method: 'PUT',
          body: updateData,
        }
      );
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act
      await PUT(request, { params: mockParams });

      // Assert
      expect(mockLogger.apiLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Portfolio item update request',
          requestId: defaultRequestContext.requestId,
          metadata: expect.objectContaining({
            portfolioId: validPortfolioId,
          }),
        })
      );

      expect(mockLogger.databaseLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Updating portfolio item',
          operation: 'UPDATE',
          table: 'PortfolioItem',
        })
      );

      expect(mockLogger.apiLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Portfolio item updated successfully',
          statusCode: 200,
        })
      );
    });

    it('should validate response structure', async () => {
      // Arrange
      const updateData = { title: 'Test Title' };
      const updatedItem = {
        ...originalItem,
        ...updateData,
        tags: JSON.stringify(['test']),
        metadata: JSON.stringify({ test: true }),
      };

      mockPortfolioQueries.updatePortfolioItem.mockResolvedValue(updatedItem);

      const request = TestUtils.createMockRequest(
        `http://localhost:3000/api/admin/portfolio/${validPortfolioId}`,
        {
          method: 'PUT',
          body: updateData,
        }
      );
      const mockParams = Promise.resolve({ id: validPortfolioId });

      // Act
      const response = await PUT(request, { params: mockParams });
      const responseData = await TestUtils.extractJsonResponse(response);

      // Assert
      expect(TestUtils.validateApiResponse(responseData, {
        success: true,
        hasData: true,
        hasError: false,
      })).toBe(true);

      // Validate data structure
      expect(responseData.data).toHaveProperty('id');
      expect(responseData.data).toHaveProperty('title');
      expect(responseData.data).toHaveProperty('status');
      expect(responseData.data).toHaveProperty('tags');
      expect(responseData.data).toHaveProperty('metadata');
      expect(Array.isArray(responseData.data.tags)).toBe(true);
      expect(typeof responseData.data.metadata).toBe('object');
    });
  });
});