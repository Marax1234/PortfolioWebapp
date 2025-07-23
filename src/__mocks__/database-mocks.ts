/**
 * Database Mocks for Testing
 * Mock implementations of Prisma client and database operations
 */

// Mock portfolio items data
export const mockPortfolioItems = [
  {
    id: 'portfolio-1',
    title: 'Test Portfolio Item 1',
    description: 'Test description 1',
    imageUrl: 'https://example.com/image1.jpg',
    thumbnailUrl: 'https://example.com/thumb1.jpg',
    tags: ['nature', 'photography'],
    mediaType: 'IMAGE',
    status: 'PUBLISHED',
    featured: true,
    viewCount: 100,
    categoryId: 'category-1',
    category: {
      id: 'category-1',
      name: 'Nature',
      slug: 'nature',
      description: 'Nature photography',
      isActive: true,
      sortOrder: 1,
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    publishedAt: new Date('2024-01-01'),
  },
  {
    id: 'portfolio-2',
    title: 'Test Portfolio Item 2',
    description: 'Test description 2',
    imageUrl: 'https://example.com/image2.jpg',
    thumbnailUrl: 'https://example.com/thumb2.jpg',
    tags: ['travel'],
    mediaType: 'IMAGE',
    status: 'PUBLISHED',
    featured: false,
    viewCount: 50,
    categoryId: 'category-2',
    category: {
      id: 'category-2',
      name: 'Travel',
      slug: 'travel',
      description: 'Travel photography',
      isActive: true,
      sortOrder: 2,
    },
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    publishedAt: new Date('2024-01-02'),
  },
]

// Mock categories data
export const mockCategories = [
  {
    id: 'category-1',
    name: 'Nature',
    slug: 'nature',
    description: 'Nature photography',
    isActive: true,
    sortOrder: 1,
    coverImage: 'https://example.com/nature-cover.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    _count: {
      portfolioItems: 5,
    },
  },
  {
    id: 'category-2',
    name: 'Travel',
    slug: 'travel',
    description: 'Travel photography',
    isActive: true,
    sortOrder: 2,
    coverImage: 'https://example.com/travel-cover.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    _count: {
      portfolioItems: 3,
    },
  },
]

// Mock users data
export const mockUsers = [
  {
    id: 'user-admin',
    email: 'admin@portfolio.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
    emailVerified: true,
    passwordHash: '$2a$12$hashedpassword',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lastLogin: new Date('2024-01-01'),
  },
  {
    id: 'user-visitor',
    email: 'visitor@example.com',
    firstName: 'Test',
    lastName: 'Visitor',
    role: 'VISITOR',
    emailVerified: false,
    passwordHash: '$2a$12$hashedpassword',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lastLogin: null,
  },
]

// Mock Prisma client
export const createMockPrismaClient = () => ({
  portfolioItem: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  category: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  inquiry: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  analyticsEvent: {
    create: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $transaction: jest.fn(),
})

// Default mock implementations
export const setupDefaultMocks = (mockPrisma: ReturnType<typeof createMockPrismaClient>) => {
  // Portfolio item mocks
  mockPrisma.portfolioItem.findMany.mockResolvedValue(mockPortfolioItems)
  mockPrisma.portfolioItem.findFirst.mockImplementation(({ where }) => {
    const item = mockPortfolioItems.find(item => 
      !where || Object.keys(where).every(key => {
        if (key === 'id') return item.id === where.id
        if (key === 'status') return item.status === where.status
        return true
      })
    )
    return Promise.resolve(item || null)
  })
  mockPrisma.portfolioItem.count.mockResolvedValue(mockPortfolioItems.length)
  mockPrisma.portfolioItem.update.mockImplementation(({ where, data }) => {
    const item = mockPortfolioItems.find(item => item.id === where.id)
    if (item) {
      Object.assign(item, data)
      return Promise.resolve(item)
    }
    throw new Error('Portfolio item not found')
  })

  // Category mocks
  mockPrisma.category.findMany.mockResolvedValue(mockCategories)
  mockPrisma.category.findFirst.mockImplementation(({ where }) => {
    const category = mockCategories.find(cat => 
      !where || Object.keys(where).every(key => {
        if (key === 'slug') return cat.slug === where.slug
        if (key === 'isActive') return cat.isActive === where.isActive
        return true
      })
    )
    return Promise.resolve(category || null)
  })

  // User mocks
  mockPrisma.user.findUnique.mockImplementation(({ where }) => {
    const user = mockUsers.find(user => 
      (where.id && user.id === where.id) || 
      (where.email && user.email === where.email)
    )
    return Promise.resolve(user || null)
  })

  // Inquiry mocks
  mockPrisma.inquiry.create.mockResolvedValue({
    id: 'inquiry-1',
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'Test message',
    category: 'GENERAL',
    status: 'NEW',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // Analytics mocks
  mockPrisma.analyticsEvent.create.mockResolvedValue({
    id: 'analytics-1',
    eventType: 'page_view',
    eventData: '{}',
    createdAt: new Date(),
  })

  return mockPrisma
}

// Error simulation helpers
export const createPrismaError = (code: string, message: string) => {
  const error = new Error(message) as any
  error.code = code
  error.name = 'PrismaClientKnownRequestError'
  return error
}

export const createValidationError = (message: string) => {
  const error = new Error(message)
  error.name = 'PrismaClientValidationError'
  return error
}