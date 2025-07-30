/**
 * Jest Configuration for Next.js API Route Testing
 * Minimal setup focused on API route testing with TypeScript support
 */

const nextJest = require('next/jest');

// Create Jest config with Next.js defaults
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Custom Jest configuration
const customJestConfig = {
  // Test environment for API routes (Node.js)
  testEnvironment: 'node',

  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],

  // Module name mapping for absolute imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/out/',
  ],

  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
        },
      },
    ],
  },

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Coverage configuration (optional)
  collectCoverageFrom: [
    'src/app/api/**/*.{js,ts,jsx,tsx}',
    'src/lib/**/*.{js,ts,jsx,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.{js,ts,jsx,tsx}',
    '!src/**/*.spec.{js,ts,jsx,tsx}',
  ],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output for better debugging
  verbose: true,

  // Global timeout for tests (10 seconds)
  testTimeout: 10000,
};

// Export Jest config that is aware of Next.js
module.exports = createJestConfig(customJestConfig);
