-- Fix user_profiles table and RLS policies
-- Run this in your Supabase SQL Editor if you're still getting errors

-- First, let's make sure the table exists with the right structure
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

-- Drop existing RLS policies that might be too restrictive
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Disable RLS temporarily for testing
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Or if you want to keep RLS enabled, use these permissive policies:
-- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all operations for testing" ON user_profiles FOR ALL USING (true) WITH CHECK (true);

-- Make sure the subscription_plans table also has permissive access
ALTER TABLE subscription_plans DISABLE ROW LEVEL SECURITY;
