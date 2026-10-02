const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const path = require('path');

// Singleton Prisma client for tests
let prismaClient;

const getTestPrismaClient = () => {
  if (!prismaClient) {
    prismaClient = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
      log:
        process.env.NODE_ENV === 'test'
          ? []
          : ['query', 'info', 'warn', 'error'],
    });
  }
  return prismaClient;
};

const resetTestDatabase = async () => {
  console.log('🔄 Resetting test database...');

  try {
    // Reset database schema with force flag (non-interactive)
    execSync('node scripts/load-env-test.js prisma db push --force-reset', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });

    // Refresh Prisma client connection
    if (prismaClient) {
      await prismaClient.$disconnect();
      prismaClient = null;
    }

    console.log('✅ Test database reset completed');
  } catch (error) {
    console.error('❌ Test database reset failed:', error.message);
    throw error;
  }
};

const seedTestDatabase = async () => {
  console.log('🌱 Seeding test database...');

  try {
    execSync('node scripts/load-env-test.js tsx prisma/seed.ts', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });

    console.log('✅ Test database seeding completed');
  } catch (error) {
    console.error('❌ Test database seeding failed:', error.message);
    throw error;
  }
};

const cleanupTestDatabase = async () => {
  const prisma = getTestPrismaClient();

  try {
    // Clean up test data in reverse order of dependencies
    await prisma.analyticsEvent.deleteMany({});
    await prisma.inquiry.deleteMany({});
    await prisma.newsletterSubscriber.deleteMany({});
    await prisma.portfolioItem.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('🧹 Test database cleanup completed');
  } catch (error) {
    console.error('❌ Test database cleanup failed:', error.message);
    throw error;
  }
};

const disconnectTestDatabase = async () => {
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = null;
  }
};

module.exports = {
  getTestPrismaClient,
  resetTestDatabase,
  seedTestDatabase,
  cleanupTestDatabase,
  disconnectTestDatabase,
};
