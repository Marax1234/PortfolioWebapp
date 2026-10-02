const { execSync } = require('child_process');
const path = require('path');

module.exports = async () => {
  console.log('🧪 Starting global test setup...');

  try {
    // Ensure test environment variables are loaded
    const envTestPath = path.join(__dirname, '..', '.env.test');
    const fs = require('fs');

    if (fs.existsSync(envTestPath)) {
      const envContent = fs.readFileSync(envTestPath, 'utf8');
      const envVars = envContent
        .split('\n')
        .filter(line => line && !line.startsWith('#'))
        .reduce((acc, line) => {
          const [key, ...valueParts] = line.split('=');
          if (key && valueParts.length) {
            const value = valueParts.join('=').replace(/^"(.*)"$/, '$1');
            acc[key] = value;
          }
          return acc;
        }, {});

      Object.assign(process.env, envVars);
      process.env.NODE_ENV = 'test';
    }

    // Start test database container
    console.log('🐳 Starting test database container...');
    execSync(
      'docker compose -f docker-compose.test.yml up -d postgres-test --remove-orphans',
      {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..'),
      }
    );

    // Wait for database to be ready
    console.log('⏳ Waiting for test database to be ready...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Initialize database schema
    console.log('🗃️ Initializing database schema...');
    execSync('node scripts/load-env-test.js prisma db push', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });

    console.log('✅ Global test setup completed');
  } catch (error) {
    console.error('❌ Global test setup failed:', error.message);
    throw error;
  }
};
