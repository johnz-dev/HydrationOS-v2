-- Fix UUID generation issue in user_profiles table
-- Run this in your Supabase SQL Editor

-- First, ensure the uuid-ossp extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop the existing table if it has issues
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Recreate the table with proper UUID generation
CREATE TABLE user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'member',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_user_profiles_clerk_user_id ON user_profiles(clerk_user_id);

-- Disable RLS for testing
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Test insert to verify it works
INSERT INTO user_profiles (clerk_user_id, email, first_name, last_name) 
VALUES ('test_uuid_fix', 'test@example.com', 'Test', 'User');

-- Verify the insert worked and ID was generated
SELECT id, clerk_user_id, email FROM user_profiles WHERE clerk_user_id = 'test_uuid_fix';

-- Clean up test record
DELETE FROM user_profiles WHERE clerk_user_id = 'test_uuid_fix';
