-- XETHKIOZ Fusion Platform
-- Migration: create news_articles and news_audit_log
-- Date: 2026-06-29

CREATE TABLE IF NOT EXISTS public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content JSONB NOT NULL,
  category TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  source_urls TEXT[] DEFAULT '{}',
  ai_generated BOOLEAN DEFAULT false,
  review_status TEXT DEFAULT 'pending',
  editor_notes TEXT,
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT news_articles_status_check CHECK (status IN ('draft', 'review', 'published', 'archived')),
  CONSTRAINT news_articles_review_status_check CHECK (review_status IN ('pending', 'approved', 'rejected')),
  CONSTRAINT news_articles_category_check CHECK (category IN ('gaming', 'tech', 'science', 'ai', 'community', 'green', 'programming'))
);

CREATE INDEX IF NOT EXISTS idx_news_articles_status ON public.news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON public.news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON public.news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_slug ON public.news_articles(slug);
CREATE INDEX IF NOT EXISTS idx_news_articles_author_id ON public.news_articles(author_id);

CREATE TABLE IF NOT EXISTS public.news_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.news_articles(id) ON DELETE SET NULL,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_audit_log_article_id ON public.news_audit_log(article_id);
CREATE INDEX IF NOT EXISTS idx_news_audit_log_actor_id ON public.news_audit_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_news_audit_log_created_at ON public.news_audit_log(created_at DESC);

CREATE OR REPLACE FUNCTION public.update_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_news_articles_updated_at ON public.news_articles;
CREATE TRIGGER trg_news_articles_updated_at
  BEFORE UPDATE ON public.news_articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_news_updated_at();

ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS news_public_read ON public.news_articles;
CREATE POLICY news_public_read ON public.news_articles
  FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS news_admin_read_all ON public.news_articles;
CREATE POLICY news_admin_read_all ON public.news_articles
  FOR SELECT
  USING (
    auth.uid() = author_id
    OR auth.jwt() ->> 'role' = 'admin'
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

DROP POLICY IF EXISTS news_admin_insert ON public.news_articles;
CREATE POLICY news_admin_insert ON public.news_articles
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

DROP POLICY IF EXISTS news_admin_update ON public.news_articles;
CREATE POLICY news_admin_update ON public.news_articles
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'admin'
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

DROP POLICY IF EXISTS news_admin_delete ON public.news_articles;
CREATE POLICY news_admin_delete ON public.news_articles
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin'
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

DROP POLICY IF EXISTS news_audit_admin_read ON public.news_audit_log;
CREATE POLICY news_audit_admin_read ON public.news_audit_log
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'admin'
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

DROP POLICY IF EXISTS news_audit_admin_insert ON public.news_audit_log;
CREATE POLICY news_audit_admin_insert ON public.news_audit_log
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
    OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

-- Rollback manual, ejecutar solo si se decide revertir esta migración:
-- DROP TABLE IF EXISTS public.news_audit_log CASCADE;
-- DROP TABLE IF EXISTS public.news_articles CASCADE;
-- DROP FUNCTION IF EXISTS public.update_news_updated_at() CASCADE;
