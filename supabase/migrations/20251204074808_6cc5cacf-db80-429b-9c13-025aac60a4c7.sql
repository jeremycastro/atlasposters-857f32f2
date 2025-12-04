-- Create static_article_versions table for tracking archived versions of React components
CREATE TABLE public.static_article_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  component_path TEXT NOT NULL,
  change_summary TEXT,
  archived_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  archived_by UUID REFERENCES auth.users(id),
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(slug, version_number)
);

-- Enable RLS
ALTER TABLE public.static_article_versions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view static article versions"
ON public.static_article_versions
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage static article versions"
ON public.static_article_versions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed initial data for all 10 existing static articles as version 1 (current)
INSERT INTO public.static_article_versions (slug, version_number, component_path, is_current, change_summary) VALUES
  ('sku-methodology', 1, 'SKUMethodology', true, 'Initial version'),
  ('partner-management', 1, 'PartnerManagement', true, 'Initial version'),
  ('brand-assets', 1, 'BrandAssets', true, 'Initial version'),
  ('task-management', 1, 'TaskManagement', true, 'Initial version'),
  ('artwork-catalog', 1, 'ArtworkCatalog', true, 'Initial version'),
  ('admin-brand-guide', 1, 'AdminBrandGuide', true, 'Initial version'),
  ('brand-story', 1, 'BrandStory', true, 'Initial version'),
  ('prodigi-api', 1, 'ProdigiAPI', true, 'Initial version'),
  ('product-importing', 1, 'ProductImporting', true, 'Initial version'),
  ('readymades-framing', 1, 'ReadymadesFraming', true, 'Initial version');

-- Create index for faster lookups
CREATE INDEX idx_static_article_versions_slug ON public.static_article_versions(slug);
CREATE INDEX idx_static_article_versions_current ON public.static_article_versions(slug, is_current) WHERE is_current = true;