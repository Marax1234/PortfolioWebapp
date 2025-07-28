# Logs Directory

This directory contains application logs in production.

- `combined.log` - All application logs
- `error.log` - Error logs only  
- `security.log` - Security events
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

## Log Format

All logs are in structured JSON format with the following fields:

- `timestamp` - ISO 8601 timestamp
- `level` - Log level (error, warn, info, debug)
- `category` - Log category (auth, api, database, security, performance, error, system)
- `message` - Human-readable message
- `requestId` - Unique request identifier for tracing
- `metadata` - Additional context data

## Development

In development mode, logs are output to the console with colorized formatting.
In production mode, logs are written to files in this directory with log rotation.

## Security

Security logs contain authentication events, authorization failures, and suspicious activity.
These logs should be monitored for security incidents and analyzed for patterns.