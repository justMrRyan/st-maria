-- ============================================================================
-- MERYAM SWILEM INTERIOR DESIGN PORTFOLIO - DATABASE SCHEMA
-- ============================================================================
-- This SQL file creates all necessary tables and Row-Level Security (RLS)
-- policies for the interior design portfolio website.
--
-- To use this file:
-- 1. Go to your Supabase project
-- 2. Open the SQL Editor
-- 3. Click "New Query"
-- 4. Copy and paste the entire contents of this file
-- 5. Click "Run"
--
-- Make sure you're connected to your project database!
-- ============================================================================

-- ============================================================================
-- 1. PROJECTS TABLE
-- ============================================================================
-- Stores all interior design projects with images, descriptions, and metadata

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Project details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  
  -- Date field for sorting
  date TIMESTAMP WITH TIME ZONE,
  
  -- Images stored as JSONB array
  -- Format: [{ url: string, alt: string, order: number }, ...]
  images JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure title is not empty
  CONSTRAINT title_not_empty CHECK (title != '')
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- Create index on date for sorting
CREATE INDEX IF NOT EXISTS idx_projects_date ON projects(date DESC);

-- ============================================================================
-- 2. MESSAGES TABLE
-- ============================================================================
-- Stores contact form submissions from visitors

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Contact information from visitor
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  
  -- Message content
  message TEXT NOT NULL,
  
  -- Status tracking
  read BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT name_not_empty CHECK (name != ''),
  CONSTRAINT email_not_empty CHECK (email != ''),
  CONSTRAINT message_not_empty CHECK (message != ''),
  CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);

-- Create index on created_at for sorting (newest first)
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Create index on read status
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);

-- ============================================================================
-- 3. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Enable RLS on both tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROJECTS RLS POLICIES
-- ============================================================================

-- Policy: Users can see all published projects (no user_id required)
-- This allows the public to see the portfolio gallery
CREATE POLICY "Anyone can view projects" 
  ON projects 
  FOR SELECT 
  USING (true);

-- Policy: Users can only create projects for themselves
CREATE POLICY "Users can create their own projects" 
  ON projects 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own projects
CREATE POLICY "Users can update their own projects" 
  ON projects 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own projects
CREATE POLICY "Users can delete their own projects" 
  ON projects 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================================================
-- MESSAGES RLS POLICIES
-- ============================================================================

-- Policy: Only the owner can view messages
CREATE POLICY "Users can view their own messages" 
  ON messages 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Anyone (unauthenticated) can insert messages
-- This allows public contact form submissions
CREATE POLICY "Anyone can create messages" 
  ON messages 
  FOR INSERT 
  WITH CHECK (true);

-- Policy: Users can only update their own messages (to mark as read)
CREATE POLICY "Users can update their own messages" 
  ON messages 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own messages
CREATE POLICY "Users can delete their own messages" 
  ON messages 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================================================
-- 4. HELPER FUNCTIONS
-- ============================================================================

-- Function to update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 5. ADDITIONAL CONFIGURATION
-- ============================================================================

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON projects TO authenticated;
GRANT ALL PRIVILEGES ON messages TO authenticated;

-- Grant permissions for service role (backend operations)
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON projects TO service_role;
GRANT ALL PRIVILEGES ON messages TO service_role;

-- ============================================================================
-- 6. SAMPLE DATA (Optional - for testing)
-- ============================================================================
-- Uncomment the lines below to insert sample data for testing
-- Note: Replace 'YOUR_USER_ID_HERE' with an actual user ID from your Supabase project

/*
INSERT INTO projects (user_id, title, description, category, date, images) VALUES
(
  'YOUR_USER_ID_HERE',
  'Modern Living Room Transformation',
  'Complete redesign of a contemporary living space with neutral tones and minimalist furniture.',
  'Living Room',
  NOW(),
  '[
    {"url": "https://example.com/image1.jpg", "alt": "Modern living room", "order": 1},
    {"url": "https://example.com/image2.jpg", "alt": "Close-up of furniture", "order": 2}
  ]'::jsonb
),
(
  'YOUR_USER_ID_HERE',
  'Luxurious Bedroom Suite',
  'Elegant bedroom design featuring custom lighting and high-end finishes.',
  'Bedroom',
  NOW() - INTERVAL '1 month',
  '[
    {"url": "https://example.com/image3.jpg", "alt": "Bedroom overview", "order": 1}
  ]'::jsonb
);

INSERT INTO messages (user_id, name, email, message) VALUES
(
  'YOUR_USER_ID_HERE',
  'John Doe',
  'john@example.com',
  'I love your work! Would love to discuss a project for my new home.'
);
*/

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
-- 
-- After running this script, you should:
-- 1. Verify both tables exist: projects and messages
-- 2. Check that RLS is enabled on both tables
-- 3. Test that you can insert/update records
-- 4. Create a Supabase Storage bucket named "MERYAMSWILEM" for images
-- 5. Make the storage bucket PUBLIC so images are accessible
--
-- For detailed setup instructions, see SETUP_GUIDE.md in the project root.
-- ============================================================================
