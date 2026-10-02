/**
 * Conditional Database Seeding Script for Production Deployment
 * Only seeds database if it's empty to prevent data loss
 */
import { PrismaClient } from '@prisma/client';
import { spawn } from 'child_process';
import { promisify } from 'util';

const prisma = new PrismaClient();
const exec = promisify(spawn);

async function checkDatabaseEmpty(): Promise<boolean> {
  try {
    const userCount = await prisma.user.count();
    const categoryCount = await prisma.category.count();
    const portfolioCount = await prisma.portfolioItem.count();

    console.log(
      `Database status: Users: ${userCount}, Categories: ${categoryCount}, Portfolio Items: ${portfolioCount}`
    );

    return userCount === 0 && categoryCount === 0 && portfolioCount === 0;
  } catch (error) {
    console.error('Error checking database status:', error);
    // If we can't check, assume it needs seeding
    return true;
  }
}

async function runScript(command: string, args: string[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);

    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
    });

    process.on('close', code => {
      if (code === 0) {
        console.log(`✅ ${command} completed successfully`);
        resolve();
      } else {
        console.error(`❌ ${command} failed with code ${code}`);
        reject(new Error(`Process failed with code ${code}`));
      }
    });

    process.on('error', error => {
      console.error(`❌ Error running ${command}:`, error);
      reject(error);
    });
  });
}

async function conditionalSeed() {
  try {
    console.log('🔍 Checking if database needs seeding...');

    const isEmpty = await checkDatabaseEmpty();

    if (!isEmpty) {
      console.log('✅ Database already contains data, skipping seeding');
      return;
    }

    console.log('🌱 Database is empty, starting seeding process...');

    // Run seeding scripts in sequence
    await runScript('tsx', ['prisma/seed.ts']);
    await runScript('tsx', ['scripts/setup-admin-password.ts']);
    await runScript('node', ['scripts/seed-analytics.js']);

    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Error during conditional seeding:', error);

    // In production, we don't want to fail the build because of seeding issues
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        '⚠️  Seeding failed in production, but continuing deployment...'
      );
      console.warn('💡 You may need to run seeding manually after deployment');
    } else {
      // In development, we want to know about seeding issues
      process.exit(1);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  conditionalSeed();
}

export { conditionalSeed };
