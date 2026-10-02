const { execSync } = require('child_process');
const path = require('path');

module.exports = async () => {
  console.log('🧹 Starting global test teardown...');

  try {
    // Stop test database container
    console.log('🛑 Stopping test database container...');
    execSync(
      'docker compose -f docker-compose.test.yml down --remove-orphans',
      {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..'),
      }
    );

    console.log('✅ Global test teardown completed');
  } catch (error) {
    console.error('❌ Global test teardown failed:', error.message);
    // Don't throw error during teardown to avoid masking test failures
    console.error('Continuing despite teardown failure...');
  }
};
