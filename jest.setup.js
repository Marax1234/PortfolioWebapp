// Jest setup for test environment
import '@testing-library/jest-dom';

// Set up test environment variables
process.env.NODE_ENV = 'test';

// Global test utilities
global.testUtils = {
  // Helper function to create clean test data
  createTestData: async () => {
    // This will be implemented when writing actual tests
    return {};
  },

  // Helper function to clean up test data
  cleanupTestData: async () => {
    // This will be implemented when writing actual tests
    return true;
  },
};
