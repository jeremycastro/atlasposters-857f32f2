-- Create admin navigation configuration table
CREATE TABLE public.admin_navigation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  icon TEXT NOT NULL, -- Lucide icon name
  route TEXT NOT NULL,
  group_name TEXT, -- Section/group name like "Content", "Management"
  order_index INTEGER NOT NULL DEFAULT 0,
  visible_to_roles app_role[] NOT NULL DEFAULT ARRAY['admin']::app_role[],
  is_active BOOLEAN DEFAULT true,
  parent_id UUID REFERENCES public.admin_navigation(id) ON DELETE CASCADE, -- For nested items
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(route)
);

-- Enable RLS
ALTER TABLE public.admin_navigation ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage navigation"
ON public.admin_navigation
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "All authenticated users can view active navigation"
ON public.admin_navigation
FOR SELECT
TO authenticated
USING (is_active = true);

-- Add update trigger
CREATE TRIGGER update_admin_navigation_updated_at
BEFORE UPDATE ON public.admin_navigation
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default navigation items
INSERT INTO public.admin_navigation (label, icon, route, group_name, order_index, visible_to_roles) VALUES
  ('Dashboard', 'LayoutDashboard', '/admin/dashboard', 'Overview', 1, ARRAY['admin', 'editor', 'viewer']::app_role[]),
  ('Task Manager', 'CheckSquare', '/admin/tasks', 'Content', 2, ARRAY['admin', 'editor', 'viewer']::app_role[]),
  ('Roadmap', 'Map', '/admin/roadmap', 'Content', 3, ARRAY['admin', 'editor', 'viewer']::app_role[]),
  ('Changelog', 'GitBranch', '/admin/changelog', 'Content', 4, ARRAY['admin', 'editor', 'viewer']::app_role[]),
  ('Tech Stack', 'Code2', '/admin/techstack', 'Content', 5, ARRAY['admin', 'editor', 'viewer']::app_role[]),
  ('Artwork Catalog', 'Image', '/admin/artworks', 'Management', 6, ARRAY['admin']::app_role[]),
  ('User Management', 'Users', '/admin/users', 'Management', 7, ARRAY['admin']::app_role[]),
  ('Navigation Config', 'Settings', '/admin/navigation', 'Settings', 8, ARRAY['admin']::app_role[]);

-- Create index for ordering
CREATE INDEX idx_admin_navigation_order ON public.admin_navigation(group_name, order_index);
CREATE INDEX idx_admin_navigation_active ON public.admin_navigation(is_active) WHERE is_active = true;