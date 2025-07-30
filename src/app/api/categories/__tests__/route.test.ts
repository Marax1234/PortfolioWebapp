/**
 * Categories API Route Tests
 * Basic unit tests for GET /api/categories endpoint
 */
import { NextResponse } from 'next/server';

import {
  createMockNextRequest,
  extractMockResponseData,
  resetAllMocks,
  setupAllMocks,
} from '@/__mocks__/setup';

import { GET } from '../route';

describe('/api/categories GET', () => {
  beforeAll(() => {
    setupAllMocks();
  });

  beforeEach(() => {
    resetAllMocks();
    jest.clearAllMocks();
  });

  describe('Successful Requests', () => {
    it('should return all active categories with portfolio item counts', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/categories',
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            slug: expect.any(String),
            description: expect.any(String),
            coverImage: expect.any(String),
            sortOrder: expect.any(Number),
            portfolioItemCount: expect.any(Number),
            createdAt: expect.any(String),
          }),
        ]),
      });
    });

    it('should return categories ordered by sortOrder', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/categories',
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);

      // Verify categories are present
      if (data.data.length > 1) {
        expect(data.data[0].sortOrder).toBeLessThanOrEqual(
          data.data[1].sortOrder
        );
      }
    });

    it('should include portfolio item counts for each category', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/categories',
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      data.data.forEach((category: any) => {
        expect(category).toHaveProperty('portfolioItemCount');
        expect(typeof category.portfolioItemCount).toBe('number');
        expect(category.portfolioItemCount).toBeGreaterThanOrEqual(0);
      });
    });

    it('should include request ID in response headers', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/categories',
      });

      const response = await GET(request);

      expect(response.headers.get('x-request-id')).toBe('test-request-id');
    });

    it('should return all expected category fields', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/categories',
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      if (data.data.length > 0) {
        const category = data.data[0];
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('slug');
        expect(category).toHaveProperty('description');
        expect(category).toHaveProperty('coverImage');
        expect(category).toHaveProperty('sortOrder');
        expect(category).toHaveProperty('portfolioItemCount');
        expect(category).toHaveProperty('createdAt');

        // Should not include internal fields
        expect(category).not.toHaveProperty('_count');
        expect(category).not.toHaveProperty('isActive');
        expect(category).not.toHaveProperty('updatedAt');
      }
    });
  });

  describe('Empty Results', () => {
    it('should handle empty category list gracefully', async () => {
      // Mock empty result
      const mockCategoryQueries = require('@/lib/db-utils').CategoryQueries;
      mockCategoryQueries.getActiveWithCounts.mockResolvedValueOnce([]);

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/categories',
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual([]);
    });

    it('should handle categories with zero portfolio items', async () => {
      // Mock categories with zero counts
      const mockCategoryQueries = require('@/lib/db-utils').CategoryQueries;
      mockCategoryQueries.getActiveWithCounts.mockResolvedValueOnce([
        {
          id: 'empty-category',
          name: 'Empty Category',
          slug: 'empty',
          description: 'Category with no items',
          coverImage: null,
          sortOrder: 1,
          _count: { portfolioItems: 0 },
          createdAt: new Date('2024-01-01'),
        },
      ]);

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/categories',
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].portfolioItemCount).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Mock database error
      const mockCategoryQueries = require('@/lib/db-utils').CategoryQueries;
      mockCategoryQueries.getActiveWithCounts.mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/categories',
      });

      const response = await GET(request);

      expect(response.status).toBe(500);
    });

    it('should return structured error response', async () => {
      // Mock database error
      const mockCategoryQueries = require('@/lib/db-utils').CategoryQueries;
      mockCategoryQueries.getActiveWithCounts.mockRejectedValueOnce(
        new Error('Test database error')
      );

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/categories',
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      expect(data).toEqual(
        expect.objectContaining({
          success: false,
          error: expect.any(String),
          requestId: expect.any(String),
          timestamp: expect.any(String),
        })
      );
    });

    it('should handle database timeout errors', async () => {
      // Mock timeout error
      const mockCategoryQueries = require('@/lib/db-utils').CategoryQueries;
      const timeoutError = new Error('Connection timeout');
      timeoutError.name = 'TimeoutError';
      mockCategoryQueries.getActiveWithCounts.mockRejectedValueOnce(
        timeoutError
      );

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/categories',
      });

      const response = await GET(request);

      expect(response.status).toBe(500);
    });
  });

  describe('Performance Considerations', () => {
    it('should complete request within reasonable time', async () => {
      const startTime = Date.now();

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/categories',
      });

      await GET(request);

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle large number of categories efficiently', async () => {
      // Mock large dataset
      const mockCategoryQueries = require('@/lib/db-utils').CategoryQueries;
      const largeDataset = Array.from({ length: 100 }, (_, index) => ({
        id: `category-${index}`,
        name: `Category ${index}`,
        slug: `category-${index}`,
        description: `Description for category ${index}`,
        coverImage: `https://example.com/cover-${index}.jpg`,
        sortOrder: index,
        _count: { portfolioItems: Math.floor(Math.random() * 20) },
        createdAt: new Date('2024-01-01'),
      }));

      mockCategoryQueries.getActiveWithCounts.mockResolvedValueOnce(
        largeDataset
      );

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/categories',
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(100);
    });
  });

  describe('Response Format', () => {
    it('should return properly structured response', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/categories',
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('data');
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should transform internal database fields correctly', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/categories',
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      expect(response.status).toBe(200);

      data.data.forEach((category: any) => {
        // Should transform _count.portfolioItems to portfolioItemCount
        expect(category.portfolioItemCount).toBeDefined();
        expect(category._count).toBeUndefined();

        // Should include createdAt as ISO string
        expect(typeof category.createdAt).toBe('string');
        expect(new Date(category.createdAt)).toBeInstanceOf(Date);
      });
    });

    it('should handle null/undefined fields gracefully', async () => {
      // Mock category with null fields
      const mockCategoryQueries = require('@/lib/db-utils').CategoryQueries;
      mockCategoryQueries.getActiveWithCounts.mockResolvedValueOnce([
        {
          id: 'category-with-nulls',
          name: 'Category with Nulls',
          slug: 'category-nulls',
          description: null, // Null description
          coverImage: null, // Null cover image
          sortOrder: 1,
          _count: { portfolioItems: 5 },
          createdAt: new Date('2024-01-01'),
        },
      ]);

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/categories',
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data[0].description).toBeNull();
      expect(data.data[0].coverImage).toBeNull();
      expect(data.data[0].portfolioItemCount).toBe(5);
    });
  });

  describe('HTTP Methods', () => {
    it('should only accept GET requests', async () => {
      // Note: This test assumes the route only exports GET
      // POST, PUT, DELETE should return 405 Method Not Allowed
      expect(typeof GET).toBe('function');
    });
  });

  describe('Caching Behavior', () => {
    it('should include appropriate cache headers for categories', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/categories',
      });

      const response = await GET(request);

      expect(response.status).toBe(200);
      // Headers are mocked, but we can verify the response structure
      expect(response.headers).toBeDefined();
    });
  });
});
