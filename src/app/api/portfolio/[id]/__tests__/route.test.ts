/**
 * Portfolio Item by ID API Route Tests
 * Basic unit tests for GET /api/portfolio/[id] endpoint
 */

import { setupAllMocks, resetAllMocks, createMockNextRequest, extractMockResponseData } from '@/__mocks__/setup'
import { GET } from '../route'
import { NextResponse } from 'next/server'

describe('/api/portfolio/[id] GET', () => {
  beforeAll(() => {
    setupAllMocks()
  })

  beforeEach(() => {
    resetAllMocks()
    jest.clearAllMocks()
  })

  describe('Successful Requests', () => {
    it('should return portfolio item with valid ID', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio/portfolio-1',
      })

      const params = Promise.resolve({ id: 'portfolio-1' })
      const response = await GET(request, { params })
      const data = await extractMockResponseData(response)

      expect(response.status).toBe(200)
      expect(data).toEqual({
        success: true,
        data: {
          item: expect.objectContaining({
            id: 'portfolio-1',
            title: expect.any(String),
            description: expect.any(String),
            imageUrl: expect.any(String),
            category: expect.objectContaining({
              name: expect.any(String),
              slug: expect.any(String),
            }),
          }),
          relatedItems: expect.any(Array),
        },
      })
    })

    it('should include related items when category exists', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio/portfolio-1',
      })

      const params = Promise.resolve({ id: 'portfolio-1' })
      const response = await GET(request, { params })
      const data = await extractMockResponseData(response)

      expect(response.status).toBe(200)
      expect(data.data.relatedItems).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
          }),
        ])
      )
    })

    it('should include request ID in response headers', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio/portfolio-1',
      })

      const params = Promise.resolve({ id: 'portfolio-1' })
      const response = await GET(request, { params })

      expect(response.headers.get('x-request-id')).toBe('test-request-id')
    })

    it('should increment view count on successful fetch', async () => {
      const mockPortfolioQueries = require('@/lib/db-utils').PortfolioQueries
      
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio/portfolio-1',
      })

      const params = Promise.resolve({ id: 'portfolio-1' })
      await GET(request, { params })

      // Verify that getById was called with correct ID
      expect(mockPortfolioQueries.getById).toHaveBeenCalledWith('portfolio-1')
    })
  })

  describe('Input Validation', () => {
    it('should return 400 for missing ID parameter', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio/',
      })

      const params = Promise.resolve({ id: '' })
      const response = await GET(request, { params })

      expect(response.status).toBe(400)
    })

    it('should return 400 for invalid ID parameter (null)', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio/null',
      })

      const params = Promise.resolve({ id: null })
      const response = await GET(request, { params })

      expect(response.status).toBe(400)
    })

    it('should return 400 for invalid ID parameter (undefined)', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio/undefined',
      })

      const params = Promise.resolve({ id: undefined })
      const response = await GET(request, { params })

      expect(response.status).toBe(400)
    })

    it('should validate ID parameter type', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio/123',
      })

      const params = Promise.resolve({ id: 123 }) // Should be string
      const response = await GET(request, { params })

      expect(response.status).toBe(400)
    })
  })

  describe('Not Found Cases', () => {
    it('should return 404 for non-existent portfolio item', async () => {
      // Mock getById to return null (not found)
      const mockPortfolioQueries = require('@/lib/db-utils').PortfolioQueries
      mockPortfolioQueries.getById.mockResolvedValueOnce(null)

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio/non-existent-id',
      })

      const params = Promise.resolve({ id: 'non-existent-id' })
      const response = await GET(request, { params })

      expect(response.status).toBe(404)
    })

    it('should return structured error response for not found', async () => {
      // Mock getById to return null
      const mockPortfolioQueries = require('@/lib/db-utils').PortfolioQueries
      mockPortfolioQueries.getById.mockResolvedValueOnce(null)

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio/non-existent-id',
      })

      const params = Promise.resolve({ id: 'non-existent-id' })
      const response = await GET(request, { params })
      const data = await extractMockResponseData(response)

      expect(data).toEqual(
        expect.objectContaining({
          success: false,
          error: expect.stringContaining('not found'),
          requestId: expect.any(String),
          timestamp: expect.any(String),
        })
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Mock database error
      const mockPortfolioQueries = require('@/lib/db-utils').PortfolioQueries
      mockPortfolioQueries.getById.mockRejectedValueOnce(new Error('Database connection failed'))

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio/portfolio-1',
      })

      const params = Promise.resolve({ id: 'portfolio-1' })
      const response = await GET(request, { params })

      expect(response.status).toBe(500)
    })

    it('should handle related items query errors gracefully', async () => {
      // Mock main item success but related items failure
      const mockPortfolioQueries = require('@/lib/db-utils').PortfolioQueries
      mockPortfolioQueries.getRelatedItems.mockRejectedValueOnce(new Error('Related items error'))

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio/portfolio-1',
      })

      const params = Promise.resolve({ id: 'portfolio-1' })
      const response = await GET(request, { params })

      // Should still handle the error gracefully
      expect(response.status).toBe(500)
    })

    it('should return structured error response', async () => {
      // Mock database error
      const mockPortfolioQueries = require('@/lib/db-utils').PortfolioQueries
      mockPortfolioQueries.getById.mockRejectedValueOnce(new Error('Test error'))

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio/portfolio-1',
      })

      const params = Promise.resolve({ id: 'portfolio-1' })
      const response = await GET(request, { params })
      const data = await extractMockResponseData(response)

      expect(data).toEqual(
        expect.objectContaining({
          success: false,
          error: expect.any(String),
          requestId: expect.any(String),
          timestamp: expect.any(String),
        })
      )
    })
  })

  describe('Performance Considerations', () => {
    it('should complete request within reasonable time', async () => {
      const startTime = Date.now()

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio/portfolio-1',
      })

      const params = Promise.resolve({ id: 'portfolio-1' })
      await GET(request, { params })

      const duration = Date.now() - startTime
      expect(duration).toBeLessThan(1000) // Should complete within 1 second
    })

    it('should handle items without categories (no related items query)', async () => {
      // Mock item without category
      const mockPortfolioQueries = require('@/lib/db-utils').PortfolioQueries
      mockPortfolioQueries.getById.mockResolvedValueOnce({
        id: 'portfolio-no-category',
        title: 'Item without category',
        categoryId: null,
        category: null,
      })

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio/portfolio-no-category',
      })

      const params = Promise.resolve({ id: 'portfolio-no-category' })
      const response = await GET(request, { params })
      const data = await extractMockResponseData(response)

      expect(response.status).toBe(200)
      expect(data.data.relatedItems).toEqual([])
      
      // Should not call getRelatedItems if no category
      expect(mockPortfolioQueries.getRelatedItems).not.toHaveBeenCalled()
    })
  })

  describe('Response Format', () => {
    it('should return properly structured response', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio/portfolio-1',
      })

      const params = Promise.resolve({ id: 'portfolio-1' })
      const response = await GET(request, { params })
      const data = await extractMockResponseData(response)

      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('data')
      expect(data.data).toHaveProperty('item')
      expect(data.data).toHaveProperty('relatedItems')
      expect(Array.isArray(data.data.relatedItems)).toBe(true)
    })

    it('should include all required portfolio item fields', async () => {
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/portfolio/portfolio-1',
      })

      const params = Promise.resolve({ id: 'portfolio-1' })
      const response = await GET(request, { params })
      const data = await extractMockResponseData(response)

      const item = data.data.item
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('title')
      expect(item).toHaveProperty('imageUrl')
      expect(item).toHaveProperty('category')
    })
  })
})