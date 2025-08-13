#!/usr/bin/env node

// Load environment variables from .env.local
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load .env.local file
const envPath = path.join(__dirname, '..', '.env.local');
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
}

// Execute the command passed as arguments
const command = process.argv.slice(2).join(' ');
if (command) {
  try {
    execSync(command, {
      stdio: 'inherit',
      env: process.env,
      cwd: path.join(__dirname, '..'),
    });
  } catch (error) {
    process.exit(error.status || 1);
  }
}
