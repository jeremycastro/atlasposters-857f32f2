-- Create knowledge_categories table
CREATE TABLE public.knowledge_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_key TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create knowledge_articles table
CREATE TABLE public.knowledge_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.knowledge_categories(id) ON DELETE RESTRICT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT false,
  current_version_id UUID,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create knowledge_article_versions table
CREATE TABLE public.knowledge_article_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.knowledge_articles(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  content_markdown TEXT NOT NULL,
  change_summary TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(article_id, version_number)
);

-- Add foreign key for current_version_id after versions table exists
ALTER TABLE public.knowledge_articles 
ADD CONSTRAINT knowledge_articles_current_version_fkey 
FOREIGN KEY (current_version_id) REFERENCES public.knowledge_article_versions(id);

-- Create indexes for performance
CREATE INDEX idx_knowledge_articles_category ON public.knowledge_articles(category_id);
CREATE INDEX idx_knowledge_articles_slug ON public.knowledge_articles(slug);
CREATE INDEX idx_knowledge_articles_published ON public.knowledge_articles(is_published);
CREATE INDEX idx_knowledge_article_versions_article ON public.knowledge_article_versions(article_id);
CREATE INDEX idx_knowledge_article_versions_number ON public.knowledge_article_versions(article_id, version_number DESC);

-- Enable RLS
ALTER TABLE public.knowledge_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_article_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for knowledge_categories
CREATE POLICY "Anyone can view active categories"
ON public.knowledge_categories FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage categories"
ON public.knowledge_categories FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for knowledge_articles
CREATE POLICY "Anyone can view published articles"
ON public.knowledge_articles FOR SELECT
USING (is_published = true);

CREATE POLICY "Authenticated users can view all articles"
ON public.knowledge_articles FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and editors can manage articles"
ON public.knowledge_articles FOR ALL
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

-- RLS Policies for knowledge_article_versions
CREATE POLICY "Anyone can view versions of published articles"
ON public.knowledge_article_versions FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.knowledge_articles 
  WHERE id = article_id AND is_published = true
));

CREATE POLICY "Authenticated users can view all versions"
ON public.knowledge_article_versions FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and editors can create versions"
ON public.knowledge_article_versions FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins can delete versions"
ON public.knowledge_article_versions FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Function to create a new article version
CREATE OR REPLACE FUNCTION public.create_article_version(
  p_article_id UUID,
  p_content_markdown TEXT,
  p_change_summary TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_next_version INTEGER;
  v_new_version_id UUID;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1 INTO v_next_version
  FROM knowledge_article_versions
  WHERE article_id = p_article_id;

  -- Create new version
  INSERT INTO knowledge_article_versions (
    article_id,
    version_number,
    content_markdown,
    change_summary,
    created_by
  ) VALUES (
    p_article_id,
    v_next_version,
    p_content_markdown,
    p_change_summary,
    auth.uid()
  )
  RETURNING id INTO v_new_version_id;

  -- Update article's current version
  UPDATE knowledge_articles
  SET current_version_id = v_new_version_id,
      updated_at = now()
  WHERE id = p_article_id;

  RETURN v_new_version_id;
END;
$$;

-- Function to restore a previous version
CREATE OR REPLACE FUNCTION public.restore_article_version(
  p_version_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_article_id UUID;
  v_content TEXT;
  v_old_version_number INTEGER;
  v_new_version_id UUID;
BEGIN
  -- Get the version details
  SELECT article_id, content_markdown, version_number 
  INTO v_article_id, v_content, v_old_version_number
  FROM knowledge_article_versions
  WHERE id = p_version_id;

  IF v_article_id IS NULL THEN
    RAISE EXCEPTION 'Version not found';
  END IF;

  -- Create new version with the old content
  v_new_version_id := create_article_version(
    v_article_id,
    v_content,
    'Restored from version ' || v_old_version_number
  );

  RETURN v_new_version_id;
END;
$$;

-- Seed initial categories
INSERT INTO public.knowledge_categories (category_key, display_name, description, icon, color, sort_order) VALUES
('systems-methodology', 'Systems & Methodology', 'Core systems, SKU methodology, and foundational architecture', 'Settings', 'blue', 1),
('workflows-processes', 'Workflows & Processes', 'Step-by-step guides for common tasks and operational procedures', 'GitBranch', 'green', 2),
('brand-design', 'Brand & Design', 'Brand guidelines, design systems, and visual standards', 'Palette', 'purple', 3),
('technical-documentation', 'Technical Documentation', 'API references, integrations, and technical specifications', 'Code', 'orange', 4);

-- Create updated_at trigger
CREATE TRIGGER update_knowledge_categories_updated_at
BEFORE UPDATE ON public.knowledge_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_knowledge_articles_updated_at
BEFORE UPDATE ON public.knowledge_articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();