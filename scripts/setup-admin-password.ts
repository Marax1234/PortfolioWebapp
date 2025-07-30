/**
 * Admin Password Setup Script
 * Safely updates admin user password with proper bcrypt hashing
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function setupAdminPassword() {
  console.log('🔐 Setting up admin password...');

  try {
    // Admin credentials (change these for production!)
    const adminEmail = 'kilian@example.com';
    const adminPassword = 'AdminPass123!'; // Meets security requirements

    console.log('📝 Admin credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('   ⚠️  Change these credentials in production!');

    // Hash the password with salt rounds 12
    console.log('🔒 Hashing password...');
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

    // Update or create admin user
    const adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        passwordHash: passwordHash,
        emailVerified: true,
        updatedAt: new Date(),
      },
      create: {
        email: adminEmail,
        firstName: 'Kilian',
        lastName: 'Siebert',
        role: 'ADMIN',
        emailVerified: true,
        passwordHash: passwordHash,
      },
    });

    console.log('✅ Admin user updated successfully!');
    console.log(`   User ID: ${adminUser.id}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Email Verified: ${adminUser.emailVerified}`);

    // Verify the password works
    console.log('🧪 Testing password verification...');
    const isPasswordValid = await bcrypt.compare(adminPassword, passwordHash);

    if (isPasswordValid) {
      console.log('✅ Password verification successful!');
    } else {
      console.error('❌ Password verification failed!');
      process.exit(1);
    }

    console.log('\n🎉 Admin password setup completed successfully!');
    console.log('\nYou can now log in with:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n⚠️  Remember to change these credentials in production!');
  } catch (error) {
    console.error('❌ Error setting up admin password:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
setupAdminPassword();
