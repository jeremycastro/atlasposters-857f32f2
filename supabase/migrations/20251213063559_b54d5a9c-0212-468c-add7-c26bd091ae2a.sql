
-- =============================================
-- CHANGELOG VERSIONING SYSTEM
-- =============================================

-- 1. Project Version Table (single-row for current version)
CREATE TABLE public.project_version (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  major integer NOT NULL DEFAULT 0,
  minor integer NOT NULL DEFAULT 5,
  patch integer NOT NULL DEFAULT 3,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid REFERENCES public.profiles(id)
);

-- Enable RLS
ALTER TABLE public.project_version ENABLE ROW LEVEL SECURITY;

-- Policies for project_version
CREATE POLICY "Anyone can view project version"
ON public.project_version FOR SELECT
USING (true);

CREATE POLICY "Admins can update project version"
ON public.project_version FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed with current version 0.5.03
INSERT INTO public.project_version (major, minor, patch) VALUES (0, 5, 3);

-- 2. Dev Changelog Table (one row per finalized version)
CREATE TABLE public.dev_changelog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  major integer NOT NULL,
  minor integer NOT NULL,
  patch integer NOT NULL,
  changelog_date date NOT NULL,
  is_auto_generated boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES public.profiles(id)
);

-- Enable RLS
ALTER TABLE public.dev_changelog ENABLE ROW LEVEL SECURITY;

-- Policies for dev_changelog
CREATE POLICY "Anyone can view changelog"
ON public.dev_changelog FOR SELECT
USING (true);

CREATE POLICY "Admins can manage changelog"
ON public.dev_changelog FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 3. Dev Changelog Entries Table (individual changes)
CREATE TYPE public.changelog_entry_type AS ENUM ('added', 'changed', 'fixed', 'removed');

CREATE TABLE public.dev_changelog_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  changelog_id uuid REFERENCES public.dev_changelog(id) ON DELETE CASCADE,
  entry_type public.changelog_entry_type NOT NULL,
  description text NOT NULL,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dev_changelog_entries ENABLE ROW LEVEL SECURITY;

-- Policies for dev_changelog_entries
CREATE POLICY "Anyone can view changelog entries"
ON public.dev_changelog_entries FOR SELECT
USING (true);

CREATE POLICY "Admins can manage changelog entries"
ON public.dev_changelog_entries FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 4. Increment Version Function
CREATE OR REPLACE FUNCTION public.increment_version()
RETURNS TABLE(new_major integer, new_minor integer, new_patch integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_major integer;
  v_minor integer;
  v_patch integer;
BEGIN
  -- Get current version
  SELECT major, minor, patch INTO v_major, v_minor, v_patch
  FROM project_version
  LIMIT 1;
  
  -- Increment with rollover logic
  IF v_patch = 99 THEN
    -- Rollover patch, increment minor
    v_patch := 0;
    IF v_minor = 99 THEN
      -- Rollover minor, increment major
      v_minor := 0;
      v_major := v_major + 1;
    ELSE
      v_minor := v_minor + 1;
    END IF;
  ELSE
    v_patch := v_patch + 1;
  END IF;
  
  -- Update the version
  UPDATE project_version
  SET major = v_major,
      minor = v_minor,
      patch = v_patch,
      updated_at = now(),
      updated_by = auth.uid();
  
  RETURN QUERY SELECT v_major, v_minor, v_patch;
END;
$$;

-- 5. Finalize Daily Changelog Function
CREATE OR REPLACE FUNCTION public.finalize_daily_changelog(for_date date DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_date date;
  pending_count integer;
  new_version record;
  new_changelog_id uuid;
  result jsonb;
BEGIN
  -- Default to yesterday if no date provided
  target_date := COALESCE(for_date, CURRENT_DATE - INTERVAL '1 day');
  
  -- Count pending entries for the target date
  SELECT COUNT(*) INTO pending_count
  FROM dev_changelog_entries
  WHERE entry_date = target_date
    AND changelog_id IS NULL;
  
  -- If no pending entries, return early
  IF pending_count = 0 THEN
    RETURN jsonb_build_object(
      'success', true,
      'action', 'no_changes',
      'message', 'No pending entries for ' || target_date::text,
      'entries_processed', 0
    );
  END IF;
  
  -- Increment version
  SELECT * INTO new_version FROM increment_version();
  
  -- Create changelog record
  INSERT INTO dev_changelog (major, minor, patch, changelog_date, is_auto_generated, created_by)
  VALUES (new_version.new_major, new_version.new_minor, new_version.new_patch, target_date, true, auth.uid())
  RETURNING id INTO new_changelog_id;
  
  -- Link pending entries to the new changelog
  UPDATE dev_changelog_entries
  SET changelog_id = new_changelog_id
  WHERE entry_date = target_date
    AND changelog_id IS NULL;
  
  -- Build result
  result := jsonb_build_object(
    'success', true,
    'action', 'finalized',
    'version', format('%s.%s.%s', new_version.new_major, new_version.new_minor, LPAD(new_version.new_patch::text, 2, '0')),
    'date', target_date,
    'entries_processed', pending_count
  );
  
  RETURN result;
END;
$$;

-- 6. Override Version Function
CREATE OR REPLACE FUNCTION public.override_version(new_major integer, new_minor integer, new_patch integer)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  old_major integer;
  old_minor integer;
  old_patch integer;
BEGIN
  -- Get current version
  SELECT major, minor, patch INTO old_major, old_minor, old_patch
  FROM project_version
  LIMIT 1;
  
  -- Update to new version
  UPDATE project_version
  SET major = new_major,
      minor = new_minor,
      patch = new_patch,
      updated_at = now(),
      updated_by = auth.uid();
  
  RETURN jsonb_build_object(
    'success', true,
    'old_version', format('%s.%s.%s', old_major, old_minor, LPAD(old_patch::text, 2, '0')),
    'new_version', format('%s.%s.%s', new_major, new_minor, LPAD(new_patch::text, 2, '0'))
  );
END;
$$;

-- 7. Migrate existing static changelog data
-- Version 0.5.03 - December 12, 2024
INSERT INTO dev_changelog (major, minor, patch, changelog_date, is_auto_generated) 
VALUES (0, 5, 3, '2024-12-12', false);

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Atlas logo and branded favicon for consistent identity', '2024-12-12'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 5 AND dc.patch = 3;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'OG meta image for social sharing preview', '2024-12-12'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 5 AND dc.patch = 3;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Brand tag management system for organizing brands with tags', '2024-12-12'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 5 AND dc.patch = 3;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Tag analytics dashboard showing usage metrics', '2024-12-12'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 5 AND dc.patch = 3;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'changed'::changelog_entry_type, 'Changelog now tracks development progress with version numbers', '2024-12-12'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 5 AND dc.patch = 3;

-- Version 0.5.02 - December 11, 2024
INSERT INTO dev_changelog (major, minor, patch, changelog_date, is_auto_generated) 
VALUES (0, 5, 2, '2024-12-11', false);

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Unified tag selector with smart filtering and category organization', '2024-12-11'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 5 AND dc.patch = 2;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'AI-powered tag suggestions for artworks using image and metadata analysis', '2024-12-11'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 5 AND dc.patch = 2;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Tag inheritance system for brand-to-artwork tag propagation', '2024-12-11'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 5 AND dc.patch = 2;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'changed'::changelog_entry_type, 'Improved tag management UI with category-based organization', '2024-12-11'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 5 AND dc.patch = 2;

-- Version 0.5.01 - December 10, 2024
INSERT INTO dev_changelog (major, minor, patch, changelog_date, is_auto_generated) 
VALUES (0, 5, 1, '2024-12-10', false);

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Multi-tier tagging system with categories and definitions', '2024-12-10'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 5 AND dc.patch = 1;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Entity tags junction table for flexible tag-to-entity relationships', '2024-12-10'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 5 AND dc.patch = 1;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Tag permissions per role for controlled access', '2024-12-10'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 5 AND dc.patch = 1;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Tag management interface for CRUD operations', '2024-12-10'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 5 AND dc.patch = 1;

-- Version 0.5.00 - December 9, 2024
INSERT INTO dev_changelog (major, minor, patch, changelog_date, is_auto_generated) 
VALUES (0, 5, 0, '2024-12-09', false);

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Print file assignment system with variant-to-file linking', '2024-12-09'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 5 AND dc.patch = 0;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Bulk print file assignment for efficient multi-variant updates', '2024-12-09'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 5 AND dc.patch = 0;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Auto-assignment suggestions based on SKU pattern matching', '2024-12-09'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 5 AND dc.patch = 0;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'changed'::changelog_entry_type, 'Artwork files tab now shows print file status indicators', '2024-12-09'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 5 AND dc.patch = 0;

-- Version 0.4.05 - December 8, 2024
INSERT INTO dev_changelog (major, minor, patch, changelog_date, is_auto_generated) 
VALUES (0, 4, 5, '2024-12-08', false);

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Product variant management with pricing and inventory', '2024-12-08'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 5;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Full SKU generation from artwork code + type + variant codes', '2024-12-08'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 5;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Variant groups and codes library for reusable options', '2024-12-08'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 5;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'fixed'::changelog_entry_type, 'Product type assignment now properly links to variant groups', '2024-12-08'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 5;

-- Version 0.4.04 - December 7, 2024
INSERT INTO dev_changelog (major, minor, patch, changelog_date, is_auto_generated) 
VALUES (0, 4, 4, '2024-12-07', false);

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Product types configuration with variant group assignments', '2024-12-07'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 4;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Products tab on artwork detail for viewing linked products', '2024-12-07'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 4;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'changed'::changelog_entry_type, 'SKU methodology documentation updated with variant hierarchy', '2024-12-07'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 4;

-- Version 0.4.03 - December 6, 2024
INSERT INTO dev_changelog (major, minor, patch, changelog_date, is_auto_generated) 
VALUES (0, 4, 3, '2024-12-06', false);

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Artwork file upload with type categorization (original, reference, derivative)', '2024-12-06'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 3;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'File versioning with automatic version number tracking', '2024-12-06'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 3;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'File tag system for print specifications (dimensions, material)', '2024-12-06'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 3;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'fixed'::changelog_entry_type, 'Primary file selection now persists correctly', '2024-12-06'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 6;

-- Version 0.4.02 - December 5, 2024
INSERT INTO dev_changelog (major, minor, patch, changelog_date, is_auto_generated) 
VALUES (0, 4, 2, '2024-12-05', false);

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Artwork detail page with tabbed interface', '2024-12-05'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 2;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Artwork metadata editing (medium, dimensions, year)', '2024-12-05'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 2;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Rights management tab with date ranges', '2024-12-05'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 2;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'changed'::changelog_entry_type, 'Artwork catalog now shows card and table view options', '2024-12-05'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 2;

-- Version 0.4.01 - December 4, 2024
INSERT INTO dev_changelog (major, minor, patch, changelog_date, is_auto_generated) 
VALUES (0, 4, 1, '2024-12-04', false);

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Artwork catalog with grid and list views', '2024-12-04'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 1;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'ASC (Artwork Sequence Code) auto-generation', '2024-12-04'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 1;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Quick-create artwork dialog with minimal required fields', '2024-12-04'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 1;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Artwork statistics dashboard (total, active, draft counts)', '2024-12-04'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 1;

-- Version 0.4.00 - December 3, 2024
INSERT INTO dev_changelog (major, minor, patch, changelog_date, is_auto_generated) 
VALUES (0, 4, 0, '2024-12-03', false);

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Partner management system with multi-contact support', '2024-12-03'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 0;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Partner agreements with royalty and payment terms', '2024-12-03'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 0;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'added'::changelog_entry_type, 'Brand creation linked to partners', '2024-12-03'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 0;

INSERT INTO dev_changelog_entries (changelog_id, entry_type, description, entry_date)
SELECT dc.id, 'changed'::changelog_entry_type, 'Navigation reorganized into logical groups', '2024-12-03'
FROM dev_changelog dc WHERE dc.major = 0 AND dc.minor = 4 AND dc.patch = 0;
