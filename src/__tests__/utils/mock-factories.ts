import type { User, PortfolioItem, Category, Inquiry, AnalyticsEvent } from '@prisma/client';
import { TestUtils } from './test-utils';

/**
 * Factory functions for creating consistent test data
 */

// Test for mock factories
describe('MockFactories', () => {
  it('should be available for imports', () => {
    expect(MockFactories).toBeDefined();
  });
});

export class MockFactories {
  /**
   * Creates a mock User
   */
  static createMockUser(overrides: Partial<User> = {}): User {
    return {
      id: TestUtils.randomString(12),
      email: TestUtils.randomEmail(),
      password: '$2b$10$hash', // bcrypt hash for 'password'
      role: 'ADMIN',
      name: `Test User ${TestUtils.randomString(4)}`,
      bio: 'Test bio',
      profileImage: null,
      socialLinks: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: null,
      ...overrides,
    };
  }

  /**
   * Creates a mock PortfolioItem
   */
  static createMockPortfolioItem(overrides: Partial<PortfolioItem> = {}): PortfolioItem {
    return {
      id: TestUtils.randomString(12),
      title: `Test Portfolio Item ${TestUtils.randomString(4)}`,
      description: 'Test portfolio item description',
      mediaType: 'IMAGE',
      filePath: `/uploads/test-${TestUtils.randomString(8)}.jpg`,
      thumbnailPath: null,
      altText: null,
      categoryId: TestUtils.randomString(12),
      status: 'PUBLISHED',
      featured: false,
      tags: JSON.stringify(['test', 'portfolio']),
      metadata: JSON.stringify({ camera: 'Test Camera' }),
      viewCount: 0,
      sortOrder: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      ...overrides,
    };
  }

  /**
   * Creates a mock Category
   */
  static createMockCategory(overrides: Partial<Category> = {}): Category {
    return {
      id: TestUtils.randomString(12),
      name: `Test Category ${TestUtils.randomString(4)}`,
      slug: `test-category-${TestUtils.randomString(4)}`,
      description: 'Test category description',
      color: '#3B82F6',
      icon: 'camera',
      sortOrder: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides,
    };
  }

  /**
   * Creates a mock Inquiry
   */
  static createMockInquiry(overrides: Partial<Inquiry> = {}): Inquiry {
    return {
      id: TestUtils.randomString(12),
      name: `Test Customer ${TestUtils.randomString(4)}`,
      email: TestUtils.randomEmail(),
      phone: '+1234567890',
      subject: `Test Subject ${TestUtils.randomString(4)}`,
      message: 'This is a test inquiry message',
      inquiryType: 'GENERAL',
      status: 'PENDING',
      priority: 'MEDIUM',
      source: 'WEBSITE',
      metadata: JSON.stringify({ ip: '127.0.0.1' }),
      adminNotes: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      respondedAt: null,
      ...overrides,
    };
  }

  /**
   * Creates a mock AnalyticsEvent
   */
  static createMockAnalyticsEvent(overrides: Partial<AnalyticsEvent> = {}): AnalyticsEvent {
    return {
      id: TestUtils.randomString(12),
      eventType: 'PAGE_VIEW',
      eventName: 'portfolio_view',
      userId: null,
      sessionId: TestUtils.randomString(16),
      path: '/portfolio',
      referrer: null,
      userAgent: 'test-agent',
      ipAddress: '127.0.0.1',
      country: 'US',
      city: 'Test City',
      metadata: JSON.stringify({ test: true }),
      createdAt: new Date().toISOString(),
      ...overrides,
    };
  }

  /**
   * Creates a mock pagination object
   */
  static createMockPagination(overrides: {
    currentPage?: number;
    totalPages?: number;
    totalItems?: number;
    itemsPerPage?: number;
  } = {}) {
    const {
      currentPage = 1,
      totalPages = 1,
      totalItems = 0,
      itemsPerPage = 12,
    } = overrides;

    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }

  /**
   * Creates a mock session for NextAuth
   */
  static createMockSession(userOverrides: Partial<User> = {}) {
    const user = this.createMockUser(userOverrides);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.profileImage,
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };
  }

  /**
   * Creates multiple mock items using a factory function
   */
  static createMultiple<T>(
    factory: (overrides?: any) => T,
    count: number,
    overrides: any = {}
  ): T[] {
    return Array.from({ length: count }, (_, index) => 
      factory({ ...overrides, sortOrder: index })
    );
  }

  /**
   * Creates a mock database query result with pagination
   */
  static createPaginatedResult<T>(
    items: T[],
    page: number = 1,
    limit: number = 12,
    totalItems?: number
  ) {
    const total = totalItems ?? items.length;
    const totalPages = Math.ceil(total / limit);
    
    return {
      items,
      pagination: this.createMockPagination({
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
      }),
    };
  }

  /**
   * Creates a mock contact form submission
   */
  static createMockContactFormData(overrides: any = {}) {
    return {
      name: `Test Customer ${TestUtils.randomString(4)}`,
      email: TestUtils.randomEmail(),
      phone: '+1234567890',
      subject: `Test Subject ${TestUtils.randomString(4)}`,
      message: 'This is a test contact form message',
      inquiryType: 'GENERAL',
      ...overrides,
    };
  }

  /**
   * Creates a mock file upload data
   */
  static createMockUploadData(overrides: any = {}) {
    return {
      filename: 'test-image.jpg',
      originalName: 'test-image.jpg',
      mimetype: 'image/jpeg',
      size: 1024 * 1024, // 1MB
      path: `/uploads/test-${TestUtils.randomString(8)}.jpg`,
      ...overrides,
    };
  }

  /**
   * Creates a mock portfolio item creation data
   */
  static createMockPortfolioItemData(overrides: any = {}) {
    return {
      title: `Test Portfolio Item ${TestUtils.randomString(4)}`,
      description: 'Test portfolio item description',
      mediaType: 'IMAGE',
      filePath: `/uploads/test-${TestUtils.randomString(8)}.jpg`,
      categoryId: TestUtils.randomString(12),
      status: 'DRAFT',
      featured: false,
      tags: ['test', 'portfolio'],
      metadata: { camera: 'Test Camera' },
      sortOrder: 0,
      ...overrides,
    };
  }

  /**
   * Creates a mock category creation data
   */
  static createMockCategoryData(overrides: any = {}) {
    return {
      name: `Test Category ${TestUtils.randomString(4)}`,
      slug: `test-category-${TestUtils.randomString(4)}`,
      description: 'Test category description',
      color: '#3B82F6',
      icon: 'camera',
      sortOrder: 0,
      isActive: true,
      ...overrides,
    };
  }

  /**
   * Creates mock analytics data for dashboard
   */
  static createMockAnalyticsData(overrides: any = {}) {
    return {
      totalViews: 1250,
      totalInquiries: 45,
      totalPortfolioItems: 120,
      averageViewsPerDay: 35,
      topCategories: [
        { name: 'Nature', views: 450 },
        { name: 'Travel', views: 380 },
        { name: 'Events', views: 250 },
      ],
      recentActivities: [
        { type: 'portfolio_view', count: 15, date: new Date().toISOString() },
        { type: 'inquiry_submitted', count: 3, date: new Date().toISOString() },
      ],
      ...overrides,
    };
  }
}