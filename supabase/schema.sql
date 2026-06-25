-- XETHKIOZ Database Schema - Run in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS categories (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, slug text NOT NULL UNIQUE, description text, icon text, portal text NOT NULL DEFAULT 'gaming', sort_order int NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS authors (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, slug text NOT NULL UNIQUE, bio text, avatar_url text, role text NOT NULL DEFAULT 'Editor', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS articles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, slug text NOT NULL UNIQUE, excerpt text, content text NOT NULL, cover_image text, category_id uuid REFERENCES categories(id) ON DELETE SET NULL, author_id uuid REFERENCES authors(id) ON DELETE SET NULL, tags text[] NOT NULL DEFAULT '{}', status text NOT NULL DEFAULT 'published', is_featured boolean NOT NULL DEFAULT false, is_trending boolean NOT NULL DEFAULT false, is_editors_pick boolean NOT NULL DEFAULT false, is_popular boolean NOT NULL DEFAULT false, views int NOT NULL DEFAULT 0, published_at timestamptz NOT NULL DEFAULT now(), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS streams (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, platform text NOT NULL, channel_name text NOT NULL, channel_url text NOT NULL, video_id text, thumbnail text, is_live boolean NOT NULL DEFAULT false, is_featured boolean NOT NULL DEFAULT false, views int NOT NULL DEFAULT 0, published_at timestamptz NOT NULL DEFAULT now(), created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS media_items (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, type text NOT NULL DEFAULT 'image', url text NOT NULL, thumbnail text, description text, is_featured boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS social_links (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), platform text NOT NULL, handle text NOT NULL, url text NOT NULL, followers text, icon text, sort_order int NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS newsletter_subscribers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text NOT NULL UNIQUE, created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_categories_portal ON categories(portal);
CREATE INDEX IF NOT EXISTS idx_streams_platform ON streams(platform);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_categories" ON categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_authors" ON authors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_articles" ON articles FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "public_read_streams" ON streams FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_media" ON media_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_social" ON social_links FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_subscribe_newsletter" ON newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin_read_newsletter" ON newsletter_subscribers FOR SELECT TO authenticated USING (true);

-- XETHKIOZ v3.5 Community Creator Profiles
-- Optional table used by /creator after Supabase Auth signup.
CREATE TABLE IF NOT EXISTS creator_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  username text NOT NULL UNIQUE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'Creador de contenido',
  status text NOT NULL DEFAULT 'pending',
  bio text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_creator_profiles_username ON creator_profiles(username);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_status ON creator_profiles(status);

ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "creator_profiles_public_read" ON creator_profiles
  FOR SELECT TO anon, authenticated
  USING (status IN ('approved', 'active'));

CREATE POLICY "creator_profiles_owner_insert" ON creator_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "creator_profiles_owner_update" ON creator_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- XETHKIOZ v3.6 Community Data Layer
-- Where user content will be stored:
-- 1) Supabase Auth stores accounts in auth.users.
-- 2) creator_profiles stores public creator/community profile metadata.
-- 3) community_posts stores user posts.
-- 4) community_comments stores comments tied to posts and articles.
-- 5) community_reactions stores likes/reactions.
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS community_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  reaction text NOT NULL DEFAULT 'like',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(author_id, post_id, article_id, reaction)
);

CREATE INDEX IF NOT EXISTS idx_community_posts_author ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON community_posts(status);
CREATE INDEX IF NOT EXISTS idx_community_comments_post ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_article ON community_comments(article_id);
CREATE INDEX IF NOT EXISTS idx_community_reactions_post ON community_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_community_reactions_article ON community_reactions(article_id);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "community_posts_public_read" ON community_posts
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "community_posts_owner_insert" ON community_posts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "community_posts_owner_update" ON community_posts
  FOR UPDATE TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "community_comments_public_read" ON community_comments
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "community_comments_owner_insert" ON community_comments
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "community_reactions_public_read" ON community_reactions
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "community_reactions_owner_insert" ON community_reactions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- XETHKIOZ v3.6.3 Auth/Profile Hotfix
-- Allows a logged-in user to read their own profile even when email confirmation is pending.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'creator_profiles'
      AND policyname = 'creator_profiles_owner_read'
  ) THEN
    CREATE POLICY "creator_profiles_owner_read" ON creator_profiles
      FOR SELECT TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;

-- Keeps profile usernames easier to manage during early community setup.
CREATE INDEX IF NOT EXISTS idx_creator_profiles_email ON creator_profiles(email);
