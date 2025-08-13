import { NextRequest, NextResponse } from 'next/server';

/**
 * Test utilities for API route testing
 */

// Test for test utilities
describe('TestUtils', () => {
  it('should be available for imports', () => {
    expect(TestUtils).toBeDefined();
  });
});

export class TestUtils {
  /**
   * Creates a mock NextRequest for testing
   */
  static createMockRequest(
    url: string = 'http://localhost:3000/api/test',
    options: {
      method?: string;
      headers?: Record<string, string>;
      body?: any;
      searchParams?: Record<string, string>;
    } = {}
  ): NextRequest {
    const { method = 'GET', headers = {}, body, searchParams = {} } = options;
    
    const urlWithParams = new URL(url);
    Object.entries(searchParams).forEach(([key, value]) => {
      urlWithParams.searchParams.set(key, value);
    });

    const requestInit: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body && method !== 'GET') {
      requestInit.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    return new NextRequest(urlWithParams.toString(), requestInit);
  }


  /**
   * Extracts JSON response from NextResponse
   */
  static async extractJsonResponse(response: NextResponse) {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  /**
   * Creates a standardized API error response for testing
   */
  static createErrorResponse(
    message: string,
    status: number = 500,
    code?: string,
    details?: any
  ) {
    return {
      success: false,
      error: {
        message,
        code,
        details,
      },
    };
  }

  /**
   * Creates a standardized API success response for testing
   */
  static createSuccessResponse(data: any, meta?: any) {
    const response: any = {
      success: true,
      data,
    };

    if (meta) {
      response.meta = meta;
    }

    return response;
  }

  /**
   * Waits for a specified amount of time (for async operation testing)
   */
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generates a random string for testing
   */
  static randomString(length: number = 10): string {
    return Math.random().toString(36).substring(2, 2 + length);
  }

  /**
   * Generates a random email for testing
   */
  static randomEmail(): string {
    return `test-${this.randomString(8)}@example.com`;
  }

  /**
   * Creates a mock file for upload testing
   */
  static createMockFile(
    filename: string = 'test.jpg',
    type: string = 'image/jpeg',
    size: number = 1024
  ): File {
    const content = new Uint8Array(size).fill(65); // Fill with 'A' characters
    return new File([content], filename, { type });
  }

  /**
   * Validates that a response matches the expected structure
   */
  static validateApiResponse(
    response: any,
    expectedStructure: {
      success?: boolean;
      status?: number;
      hasData?: boolean;
      hasError?: boolean;
      hasPagination?: boolean;
    }
  ): boolean {
    const {
      success,
      status,
      hasData = false,
      hasError = false,
      hasPagination = false,
    } = expectedStructure;

    if (success !== undefined && response.success !== success) return false;
    if (hasData && !response.data) return false;
    if (hasError && !response.error) return false;
    if (hasPagination && !response.pagination) return false;

    return true;
  }

  /**
   * Validates pagination structure
   */
  static validatePagination(pagination: any): boolean {
    const requiredFields = [
      'currentPage',
      'totalPages',
      'totalItems',
      'itemsPerPage',
      'hasNextPage',
      'hasPreviousPage',
    ];

    return requiredFields.every(field => field in pagination);
  }
}