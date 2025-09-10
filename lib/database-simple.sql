-- Simple version to test connection first
-- Just create the basic tables without complex constraints

-- User Profiles (extends Clerk user data)
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

-- Subscription Plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, features) VALUES
('Free', 'Basic club access', 0, 0, '["Access to public events", "Basic member directory"]'),
('Premium', 'Enhanced club experience', 29.99, 299.99, '["Access to all events", "Priority booking", "Member-only content", "Guest privileges"]'),
('VIP', 'Exclusive club experience', 99.99, 999.99, '["All Premium features", "VIP-only events", "Concierge service", "Complimentary guest passes", "Priority support"]')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Enable read access for all users" ON subscription_plans FOR SELECT USING (true);
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (true);
