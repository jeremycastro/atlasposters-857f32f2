-- Fix 1: Restrict brand_story_assets access
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view assets" ON public.brand_story_assets;

-- Create restrictive policies based on content status and user roles
CREATE POLICY "Public can view approved component assets"
  ON public.brand_story_assets
  FOR SELECT
  USING (
    component_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM brand_story_components
      WHERE brand_story_components.id = brand_story_assets.component_id
      AND brand_story_components.status = 'approved'
    )
  );

CREATE POLICY "Public can view published timeline assets"
  ON public.brand_story_assets
  FOR SELECT
  USING (
    timeline_event_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM brand_story_timeline
      WHERE brand_story_timeline.id = brand_story_assets.timeline_event_id
      AND brand_story_timeline.is_published = true
    )
  );

CREATE POLICY "Authenticated users can view own and team assets"
  ON public.brand_story_assets
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'editor')
    OR uploaded_by = auth.uid()
  );

-- Fix 2: Allow partner self-registration with approval required
CREATE POLICY "Users can request partner role"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND role = 'partner'
    AND is_active = false
  );