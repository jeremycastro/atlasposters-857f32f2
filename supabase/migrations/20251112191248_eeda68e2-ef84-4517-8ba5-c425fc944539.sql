-- Create enums for brand story system
CREATE TYPE brand_component_type AS ENUM (
  'origin_story',
  'mission',
  'vision',
  'core_value',
  'positioning',
  'brand_promise',
  'persona',
  'brand_personality',
  'voice_guideline',
  'messaging_pillar',
  'writing_example',
  'story_narrative',
  'content_guideline',
  'campaign_template',
  'seo_keyword'
);

CREATE TYPE brand_story_status AS ENUM (
  'draft',
  'in_review',
  'approved',
  'archived'
);

CREATE TYPE brand_story_scope AS ENUM (
  'brand',
  'atlas_global'
);

CREATE TYPE brand_event_type AS ENUM (
  'milestone',
  'decision',
  'insight',
  'launch',
  'update',
  'retrospective'
);

CREATE TYPE brand_asset_type AS ENUM (
  'image',
  'document',
  'presentation',
  'video',
  'template'
);

CREATE TYPE brand_export_type AS ENUM (
  'presentation',
  'one_pager',
  'brand_guide_pdf',
  'messaging_matrix',
  'persona_sheet'
);

-- Table 1: brand_story_components
CREATE TABLE public.brand_story_components (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  scope brand_story_scope NOT NULL DEFAULT 'brand',
  component_type brand_component_type NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  status brand_story_status NOT NULL DEFAULT 'draft',
  version_number INTEGER NOT NULL DEFAULT 1,
  is_current_version BOOLEAN NOT NULL DEFAULT true,
  parent_version_id UUID REFERENCES public.brand_story_components(id) ON DELETE SET NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table 2: brand_story_timeline
CREATE TABLE public.brand_story_timeline (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  scope brand_story_scope NOT NULL DEFAULT 'brand',
  event_type brand_event_type NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  event_date DATE NOT NULL,
  related_components UUID[] DEFAULT ARRAY[]::UUID[],
  related_tasks UUID[] DEFAULT ARRAY[]::UUID[],
  featured_image_url TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table 3: brand_story_assets
CREATE TABLE public.brand_story_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  component_id UUID REFERENCES public.brand_story_components(id) ON DELETE CASCADE,
  timeline_event_id UUID REFERENCES public.brand_story_timeline(id) ON DELETE CASCADE,
  asset_type brand_asset_type NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  description TEXT,
  usage_context TEXT,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table 4: brand_story_exports
CREATE TABLE public.brand_story_exports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  scope brand_story_scope NOT NULL DEFAULT 'brand',
  export_type brand_export_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  included_components UUID[] DEFAULT ARRAY[]::UUID[],
  file_path TEXT NOT NULL,
  format TEXT NOT NULL,
  generated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_brand_story_components_brand_id ON public.brand_story_components(brand_id);
CREATE INDEX idx_brand_story_components_scope ON public.brand_story_components(scope);
CREATE INDEX idx_brand_story_components_type ON public.brand_story_components(component_type);
CREATE INDEX idx_brand_story_components_status ON public.brand_story_components(status);
CREATE INDEX idx_brand_story_components_current ON public.brand_story_components(is_current_version);

CREATE INDEX idx_brand_story_timeline_brand_id ON public.brand_story_timeline(brand_id);
CREATE INDEX idx_brand_story_timeline_scope ON public.brand_story_timeline(scope);
CREATE INDEX idx_brand_story_timeline_event_date ON public.brand_story_timeline(event_date);
CREATE INDEX idx_brand_story_timeline_published ON public.brand_story_timeline(is_published);

CREATE INDEX idx_brand_story_assets_component_id ON public.brand_story_assets(component_id);
CREATE INDEX idx_brand_story_assets_timeline_id ON public.brand_story_assets(timeline_event_id);

CREATE INDEX idx_brand_story_exports_brand_id ON public.brand_story_exports(brand_id);
CREATE INDEX idx_brand_story_exports_scope ON public.brand_story_exports(scope);

-- Enable Row Level Security
ALTER TABLE public.brand_story_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_story_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_story_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_story_exports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for brand_story_components
CREATE POLICY "Anyone can view approved components"
  ON public.brand_story_components
  FOR SELECT
  USING (status = 'approved' OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins and Editors can create components"
  ON public.brand_story_components
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and Editors can update components"
  ON public.brand_story_components
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor') OR created_by = auth.uid());

CREATE POLICY "Admins can delete components"
  ON public.brand_story_components
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for brand_story_timeline
CREATE POLICY "Anyone can view published timeline events"
  ON public.brand_story_timeline
  FOR SELECT
  USING (is_published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins and Editors can create timeline events"
  ON public.brand_story_timeline
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and Editors can update timeline events"
  ON public.brand_story_timeline
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor') OR created_by = auth.uid());

CREATE POLICY "Admins can delete timeline events"
  ON public.brand_story_timeline
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for brand_story_assets
CREATE POLICY "Anyone can view assets"
  ON public.brand_story_assets
  FOR SELECT
  USING (true);

CREATE POLICY "Admins and Editors can upload assets"
  ON public.brand_story_assets
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and Editors can update assets"
  ON public.brand_story_assets
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor') OR uploaded_by = auth.uid());

CREATE POLICY "Admins can delete assets"
  ON public.brand_story_assets
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for brand_story_exports
CREATE POLICY "Anyone can view exports"
  ON public.brand_story_exports
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create exports"
  ON public.brand_story_exports
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete exports"
  ON public.brand_story_exports
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_brand_story_components_updated_at
  BEFORE UPDATE ON public.brand_story_components
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brand_story_timeline_updated_at
  BEFORE UPDATE ON public.brand_story_timeline
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for brand story assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('brand-story-assets', 'brand-story-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for brand-story-assets bucket
CREATE POLICY "Anyone can view brand story assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'brand-story-assets');

CREATE POLICY "Authenticated users can upload brand story assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'brand-story-assets' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins and Editors can update brand story assets"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'brand-story-assets' AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor')));

CREATE POLICY "Admins can delete brand story assets"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'brand-story-assets' AND has_role(auth.uid(), 'admin'));