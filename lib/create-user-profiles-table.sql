-- Create user_profiles table from scratch
-- Run this in Supabase SQL Editor if the table doesn't exist

-- Drop table if it exists (BE CAREFUL - this will delete all data)
-- DROP TABLE IF EXISTS user_profiles;

-- Create the user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Create an index on clerk_user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_clerk_user_id ON user_profiles(clerk_user_id);

-- Disable RLS for testing
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Insert a test record to verify it works
INSERT INTO user_profiles (clerk_user_id, email, first_name, last_name, role, status) 
VALUES ('test_user_123', 'test@example.com', 'Test', 'User', 'member', 'active')
ON CONFLICT (clerk_user_id) DO NOTHING;

-- Check that it worked
SELECT * FROM user_profiles WHERE clerk_user_id = 'test_user_123';
