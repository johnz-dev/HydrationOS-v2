-- Create missing tables to prevent errors in test page
-- Run this in Supabase SQL Editor

-- Create events table (simplified)
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT DEFAULT 'general',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  max_attendees INTEGER,
  price DECIMAL(10,2),
  cover_image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'canceled')),
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_posts table (simplified)
CREATE TABLE IF NOT EXISTS content_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  content_type TEXT DEFAULT 'post' CHECK (content_type IN ('post', 'event_announcement', 'offer', 'news')),
  media_urls JSONB DEFAULT '[]',
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'members', 'vip_only')),
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for testing
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE content_posts DISABLE ROW LEVEL SECURITY;

-- Insert some test data for events
INSERT INTO events (title, description, start_date, status) VALUES
('Welcome Meetup', 'Join us for our monthly welcome meetup', NOW() + INTERVAL '7 days', 'published'),
('Networking Event', 'Professional networking opportunity', NOW() + INTERVAL '14 days', 'published')
ON CONFLICT DO NOTHING;

-- Insert some test data for content
INSERT INTO content_posts (title, content, content_type, published_at) VALUES
('Welcome to HydrationOS', 'We are excited to launch our new platform!', 'post', NOW()),
('Upcoming Events This Month', 'Check out what we have planned for this month.', 'event_announcement', NOW())
ON CONFLICT DO NOTHING;

-- Verify tables were created
SELECT 'events' as table_name, COUNT(*) as row_count FROM events
UNION ALL
SELECT 'content_posts' as table_name, COUNT(*) as row_count FROM content_posts;
