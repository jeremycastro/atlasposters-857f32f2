-- Create enums for roadmap statuses
CREATE TYPE roadmap_version_status AS ENUM ('draft', 'current', 'archived');
CREATE TYPE roadmap_phase_status AS ENUM ('planned', 'in_progress', 'completed', 'on_hold');
CREATE TYPE roadmap_milestone_status AS ENUM ('not_started', 'in_progress', 'completed', 'blocked');

-- Create roadmap_versions table
CREATE TABLE public.roadmap_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  release_date DATE,
  status roadmap_version_status DEFAULT 'draft',
  content_markdown TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create roadmap_phases table
CREATE TABLE public.roadmap_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id UUID REFERENCES public.roadmap_versions(id) ON DELETE CASCADE NOT NULL,
  phase_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  target_end_date DATE,
  actual_end_date DATE,
  status roadmap_phase_status DEFAULT 'planned',
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create roadmap_milestones table
CREATE TABLE public.roadmap_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID REFERENCES public.roadmap_phases(id) ON DELETE CASCADE NOT NULL,
  milestone_number TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  deliverables JSONB DEFAULT '[]',
  success_metrics JSONB DEFAULT '[]',
  target_week INTEGER,
  due_date DATE,
  completed_date DATE,
  status roadmap_milestone_status DEFAULT 'not_started',
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_roadmap_phases_version_id ON public.roadmap_phases(version_id);
CREATE INDEX idx_roadmap_milestones_phase_id ON public.roadmap_milestones(phase_id);

-- Enable RLS
ALTER TABLE public.roadmap_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Everyone can read, only admins can modify
CREATE POLICY "Anyone can view roadmap versions"
  ON public.roadmap_versions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage roadmap versions"
  ON public.roadmap_versions FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view roadmap phases"
  ON public.roadmap_phases FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage roadmap phases"
  ON public.roadmap_phases FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view roadmap milestones"
  ON public.roadmap_milestones FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage roadmap milestones"
  ON public.roadmap_milestones FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Add phase_id and milestone_id to project_tasks
ALTER TABLE public.project_tasks
  ADD COLUMN phase_id UUID REFERENCES public.roadmap_phases(id) ON DELETE SET NULL,
  ADD COLUMN milestone_id UUID REFERENCES public.roadmap_milestones(id) ON DELETE SET NULL;

-- Create indexes for the new foreign keys
CREATE INDEX idx_project_tasks_phase_id ON public.project_tasks(phase_id);
CREATE INDEX idx_project_tasks_milestone_id ON public.project_tasks(milestone_id);

-- Seed initial roadmap data (Version 0.002 - Current)
INSERT INTO public.roadmap_versions (version, title, description, status, release_date)
VALUES 
  ('0.002', 'Phase 1 & 2 Implementation', 'Atlas Catalog and Storefront Development', 'current', '2025-03-01');

-- Seed phases and milestones
DO $$
DECLARE
  v_version_id UUID;
  v_phase1_id UUID;
  v_phase2_id UUID;
BEGIN
  SELECT id INTO v_version_id FROM public.roadmap_versions WHERE version = '0.002';
  
  -- Insert Phase 1: Atlas Catalog
  INSERT INTO public.roadmap_phases (version_id, phase_number, name, description, status, order_index, start_date)
  VALUES (v_version_id, 1, 'Atlas Catalog - Internal Admin Platform', 'Internal tools for managing artwork, product configuration, and order fulfillment', 'in_progress', 1, '2025-01-15')
  RETURNING id INTO v_phase1_id;
  
  -- Insert Phase 1 Milestones
  INSERT INTO public.roadmap_milestones (phase_id, milestone_number, name, description, status, order_index, target_week)
  VALUES 
    (v_phase1_id, '1.1', 'Core Infrastructure & Database', 'Set up project foundation, authentication, and database schema', 'completed', 1, 1),
    (v_phase1_id, '1.2', 'Artwork Catalog Module', 'Admin interface for managing artwork library', 'in_progress', 2, 2),
    (v_phase1_id, '1.3', 'Product Builder & Configurator', 'Tool for creating product templates and variants', 'not_started', 3, 3),
    (v_phase1_id, '1.4', 'Inventory & Order Management', 'Order processing and fulfillment tracking', 'not_started', 4, 4);
  
  -- Insert Phase 2: Storefront
  INSERT INTO public.roadmap_phases (version_id, phase_number, name, description, status, order_index, start_date)
  VALUES (v_version_id, 2, 'Atlas Storefront - Customer Experience', 'Public-facing storefront for browsing and purchasing posters', 'in_progress', 2, '2025-02-01')
  RETURNING id INTO v_phase2_id;
  
  -- Insert Phase 2 Milestones
  INSERT INTO public.roadmap_milestones (phase_id, milestone_number, name, description, status, order_index, target_week)
  VALUES 
    (v_phase2_id, '2.1', 'Brand Foundation & Product Pages', 'Homepage, product browsing, and detail pages', 'in_progress', 1, 5),
    (v_phase2_id, '2.2', 'Partner Pages & Integration', 'Partner-specific storefronts and authentication', 'not_started', 2, 6),
    (v_phase2_id, '2.3', 'Shopping Cart & Checkout', 'Cart functionality and payment processing', 'not_started', 3, 7),
    (v_phase2_id, '2.4', 'Customer Account & Order History', 'User profiles and order tracking', 'not_started', 4, 8);
END $$;