#!/usr/bin/env node

// Load test environment variables from .env.test
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load .env.test file
const envPath = path.join(__dirname, '..', '.env.test');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
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

  // Set environment variables
  Object.assign(process.env, envVars);

  // Ensure NODE_ENV is set to test
  process.env.NODE_ENV = 'test';
} else {
  console.error('❌ .env.test file not found. Please create it first.');
  process.exit(1);
}

// Execute the command passed as arguments
const command = process.argv.slice(2).join(' ');
if (command) {
  try {
    console.log(`🧪 Running test command: ${command}`);
    execSync(command, {
      stdio: 'inherit',
      env: process.env,
      cwd: path.join(__dirname, '..'),
    });
  } catch (error) {
    console.error(`❌ Test command failed: ${command}`);
    process.exit(error.status || 1);
  }
}
