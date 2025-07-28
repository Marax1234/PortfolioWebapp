/**
 * Database Client Configuration for Kilian Siebert Portfolio
 * Prisma Client with Connection Pooling and Error Handling
 */

import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

/**
 * Create Prisma Client with optimal configuration
 */
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'minimal',
  })
}

/**
 * Global Prisma Client Instance
 * Prevents multiple instances in development due to hot reloading
 */
const prisma = globalThis.prisma ?? createPrismaClient()

if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = prisma
}

export { prisma }

/**
 * Graceful shutdown handler
 */
export const disconnectDB = async () => {
  try {
    await prisma.$disconnect()
    console.log('✅ Database connection closed successfully')
  } catch (error) {
    console.error('❌ Error closing database connection:', error)
  }
}

/**
 * Test database connection
 */
export const testConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

/**
 * Database health check
 */
export const healthCheck = async () => {
  try {
    const result = await prisma.$queryRaw`SELECT 
      COUNT(*) as total_portfolio_items,
      (SELECT COUNT(*) FROM categories WHERE is_active = true) as active_categories,
      NOW() as timestamp`
    
    return {
      status: 'healthy',
      data: result,
      timestamp: new Date()
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }
  }
}

// Handle process termination
if (typeof process !== 'undefined') {
  process.on('SIGINT', async () => {
    await disconnectDB()
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    await disconnectDB()
    process.exit(0)
  })
}