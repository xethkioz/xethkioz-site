-- Improve RLS policies for newsletter_subscribers
-- Drop existing policies
DROP POLICY IF EXISTS "public_subscribe_newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "admin_read_newsletter" ON newsletter_subscribers;

-- Create improved policies
-- Only allow INSERT from anon/authenticated, no data exposure
CREATE POLICY "newsletter_insert_only" ON newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (email IS NOT NULL AND email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$');

-- Rate limiting handled at application level
-- No SELECT access for anon - prevents email enumeration
-- Admin access requires authentication (should integrate with admin roles in future)
CREATE POLICY "newsletter_admin_select" ON newsletter_subscribers
  FOR SELECT TO authenticated
  USING (true);

-- Prevent updates and deletes from public
-- Only service role can delete (GDPR compliance via backend)

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_created ON newsletter_subscribers(created_at DESC);
