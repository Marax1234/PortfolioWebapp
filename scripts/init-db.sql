-- Initialize PostgreSQL database for Portfolio WebApp
-- This script runs when the container is first created

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The database and user are already created by environment variables
-- This script can be used for additional initialization if needed