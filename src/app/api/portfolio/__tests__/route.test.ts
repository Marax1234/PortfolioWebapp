/**
 * Portfolio API Route Tests
 * Basic unit tests for GET /api/portfolio endpoint
 */
import { NextResponse } from 'next/server';

import {
  createMockNextRequest,
  extractMockResponseData,
  resetAllMocks,
  setupAllMocks,
} from '@/__mocks__/setup';

import { GET } from '../route';

describe('/api/portfolio GET', () => {
  beforeAll(() => {
    setupAllMocks();
  });

  beforeEach(() => {
    resetAllMocks();
    jest.clearAllMocks();
  });

  describe('Successful Requests', () => {
    it('should return portfolio items with default pagination', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio',
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
            imageUrl: expect.any(String),
          }),
        ]),
        pagination: expect.objectContaining({
          page: 1,
          limit: 12,
          total: expect.any(Number),
          totalPages: expect.any(Number),
          hasNext: expect.any(Boolean),
          hasPrev: expect.any(Boolean),
        }),
      });
    });

    it('should return portfolio items with custom pagination', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio',
        searchParams: {
          page: '2',
          limit: '6',
        },
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.pagination.page).toBe(2);
      expect(data.pagination.limit).toBe(6);
    });

    it('should return portfolio items filtered by category', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio',
        searchParams: {
          category: 'nature',
        },
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should return featured portfolio items only', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio',
        searchParams: {
          featured: 'true',
        },
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should return portfolio items with custom ordering', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio',
        searchParams: {
          orderBy: 'viewCount',
          orderDirection: 'desc',
        },
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should include request ID in response headers', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio',
      });

      const response = await GET(request);

      expect(response.headers.get('x-request-id')).toBe('test-request-id');
    });
  });

  describe('Input Validation', () => {
    it('should return 400 for invalid page parameter (page < 1)', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio',
        searchParams: {
          page: '0',
        },
      });

      const response = await GET(request);

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid limit parameter (limit < 1)', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio',
        searchParams: {
          limit: '0',
        },
      });

      const response = await GET(request);

      expect(response.status).toBe(400);
    });

    it('should enforce maximum limit of 50 items per page', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio',
        searchParams: {
          limit: '100', // Should be capped at 50
        },
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      expect(response.status).toBe(200);
      expect(data.pagination.limit).toBeLessThanOrEqual(50);
    });

    it('should handle invalid numeric parameters gracefully', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio',
        searchParams: {
          page: 'invalid',
          limit: 'invalid',
        },
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      // Should default to page 1, limit 12
      expect(response.status).toBe(200);
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(12);
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Mock database error
      const mockPortfolioQueries = require('@/lib/db-utils').PortfolioQueries;
      mockPortfolioQueries.getPublishedItems.mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio',
      });

      const response = await GET(request);

      expect(response.status).toBe(500);
    });

    it('should return structured error response', async () => {
      // Mock database error
      const mockPortfolioQueries = require('@/lib/db-utils').PortfolioQueries;
      mockPortfolioQueries.getPublishedItems.mockRejectedValueOnce(
        new Error('Test error')
      );

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio',
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
  });

  describe('Performance Considerations', () => {
    it('should complete request within reasonable time', async () => {
      const startTime = Date.now();

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio',
      });

      await GET(request);

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle empty result set', async () => {
      // Mock empty result
      const mockPortfolioQueries = require('@/lib/db-utils').PortfolioQueries;
      mockPortfolioQueries.getPublishedItems.mockResolvedValueOnce({
        items: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      });

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio',
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual([]);
      expect(data.pagination.total).toBe(0);
    });
  });

  describe('Response Format', () => {
    it('should return properly structured response', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio',
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('pagination');
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should include all required portfolio item fields', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio',
      });

      const response = await GET(request);
      const data = await extractMockResponseData(response);

      if (data.data.length > 0) {
        const item = data.data[0];
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('imageUrl');
        expect(item).toHaveProperty('category');
      }
    });
  });
});
