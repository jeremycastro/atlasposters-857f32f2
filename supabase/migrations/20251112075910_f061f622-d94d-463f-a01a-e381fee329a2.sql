-- Part 1: Add 4 New Roadmap Milestones to Phase 1
-- First, get the Phase 1 ID (assuming it exists)
-- We'll insert the new milestones with specific order_index values

-- Milestone 1.5: Manufacturing Process (order_index: 5)
INSERT INTO roadmap_milestones (
  phase_id,
  milestone_number,
  name,
  description,
  order_index,
  status,
  deliverables
)
SELECT 
  id as phase_id,
  '1.5',
  'Manufacturing Process',
  'Production workflow, print file management, and quality control systems',
  5,
  'not_started',
  jsonb_build_array(
    jsonb_build_object('title', 'Print file validation & quality checks', 'completed', false),
    jsonb_build_object('title', 'Manufacturing partner integration system', 'completed', false),
    jsonb_build_object('title', 'Print job specification generator', 'completed', false),
    jsonb_build_object('title', 'Production order workflow', 'completed', false),
    jsonb_build_object('title', 'Print profile management', 'completed', false),
    jsonb_build_object('title', 'Quality control checkpoints', 'completed', false),
    jsonb_build_object('title', 'Manufacturing status tracking', 'completed', false)
  )
FROM roadmap_phases
WHERE phase_number = 1
LIMIT 1;

-- Milestone 1.6: Fulfillment (order_index: 6)
INSERT INTO roadmap_milestones (
  phase_id,
  milestone_number,
  name,
  description,
  order_index,
  status,
  deliverables
)
SELECT 
  id as phase_id,
  '1.6',
  'Fulfillment',
  'Shipping integration, tracking, and order fulfillment workflows',
  6,
  'not_started',
  jsonb_build_array(
    jsonb_build_object('title', 'Shipping carrier integration (USPS, UPS, FedEx)', 'completed', false),
    jsonb_build_object('title', 'Label generation system', 'completed', false),
    jsonb_build_object('title', 'Tracking number assignment', 'completed', false),
    jsonb_build_object('title', 'Fulfillment status workflow', 'completed', false),
    jsonb_build_object('title', 'Packaging slip generation', 'completed', false),
    jsonb_build_object('title', 'Batch fulfillment processing', 'completed', false),
    jsonb_build_object('title', 'Returns management system', 'completed', false)
  )
FROM roadmap_phases
WHERE phase_number = 1
LIMIT 1;

-- Milestone 1.7: Customer Support (order_index: 7)
INSERT INTO roadmap_milestones (
  phase_id,
  milestone_number,
  name,
  description,
  order_index,
  status,
  deliverables
)
SELECT 
  id as phase_id,
  '1.7',
  'Customer Support',
  'Support ticket system, order inquiries, and customer communication',
  7,
  'not_started',
  jsonb_build_array(
    jsonb_build_object('title', 'Support ticket system', 'completed', false),
    jsonb_build_object('title', 'Order inquiry interface', 'completed', false),
    jsonb_build_object('title', 'Return/exchange workflow', 'completed', false),
    jsonb_build_object('title', 'Customer communication templates', 'completed', false),
    jsonb_build_object('title', 'Issue resolution tracking', 'completed', false),
    jsonb_build_object('title', 'FAQ & help center', 'completed', false),
    jsonb_build_object('title', 'Chat support integration', 'completed', false)
  )
FROM roadmap_phases
WHERE phase_number = 1
LIMIT 1;

-- Milestone 1.8: Marketing Campaigns (order_index: 8)
INSERT INTO roadmap_milestones (
  phase_id,
  milestone_number,
  name,
  description,
  order_index,
  status,
  deliverables
)
SELECT 
  id as phase_id,
  '1.8',
  'Marketing Campaigns',
  'Email campaigns, customer segmentation, and promotional tools',
  8,
  'not_started',
  jsonb_build_array(
    jsonb_build_object('title', 'Email campaign builder', 'completed', false),
    jsonb_build_object('title', 'Customer segmentation tools', 'completed', false),
    jsonb_build_object('title', 'Promotional code management', 'completed', false),
    jsonb_build_object('title', 'Campaign analytics dashboard', 'completed', false),
    jsonb_build_object('title', 'Social media integration', 'completed', false),
    jsonb_build_object('title', 'Newsletter management', 'completed', false),
    jsonb_build_object('title', 'Referral program system', 'completed', false)
  )
FROM roadmap_phases
WHERE phase_number = 1
LIMIT 1;

-- Update existing Milestone 1.21 to order_index 9 (shift it down)
UPDATE roadmap_milestones
SET order_index = 9
WHERE milestone_number = '1.21';

-- Part 2: File Management System - Update artwork_files table
ALTER TABLE artwork_files
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '{
  "structured": {},
  "custom": [],
  "matches_variants": {}
}'::jsonb,
ADD COLUMN IF NOT EXISTS version_number INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS is_latest BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS replaced_by UUID REFERENCES artwork_files(id),
ADD COLUMN IF NOT EXISTS print_specifications JSONB DEFAULT '{}'::jsonb;

-- Add comment explaining tags structure
COMMENT ON COLUMN artwork_files.tags IS 'Hybrid tag system: structured (size, color_profile, print_method), custom tags array, and variant matching (matches_variants with size_codes, color_codes, etc.)';

-- Create index on tags for faster querying
CREATE INDEX IF NOT EXISTS idx_artwork_files_tags ON artwork_files USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_artwork_files_version ON artwork_files(artwork_id, version_number);
CREATE INDEX IF NOT EXISTS idx_artwork_files_is_latest ON artwork_files(artwork_id, is_latest) WHERE is_latest = true;

-- Part 3: Create file_tags reference table for predefined tag categories
CREATE TABLE IF NOT EXISTS file_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'size', 'color_profile', 'print_method', 'resolution', 'material'
  tag_value TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(category, tag_value)
);

-- Insert predefined tag values
INSERT INTO file_tags (category, tag_value, display_name, description, sort_order) VALUES
-- Sizes
('size', '4x6', '4" × 6"', 'Small print size', 1),
('size', '5x7', '5" × 7"', 'Medium print size', 2),
('size', '8x10', '8" × 10"', 'Standard print size', 3),
('size', '11x14', '11" × 14"', 'Large print size', 4),
('size', '16x20', '16" × 20"', 'Extra large print size', 5),
('size', '18x24', '18" × 24"', 'Poster size', 6),
('size', '24x36', '24" × 36"', 'Large poster size', 7),

-- Color Profiles
('color_profile', 'sRGB', 'sRGB', 'Standard web color space', 1),
('color_profile', 'CMYK', 'CMYK', 'Print color space', 2),
('color_profile', 'Adobe_RGB', 'Adobe RGB', 'Extended color gamut', 3),
('color_profile', 'ProPhoto_RGB', 'ProPhoto RGB', 'Wide gamut color space', 4),

-- Print Methods
('print_method', 'giclee', 'Giclée', 'High-quality inkjet printing', 1),
('print_method', 'offset', 'Offset Lithography', 'Commercial printing method', 2),
('print_method', 'screen', 'Screen Print', 'Traditional screen printing', 3),
('print_method', 'digital', 'Digital Print', 'Standard digital printing', 4),
('print_method', 'sublimation', 'Dye Sublimation', 'Heat transfer printing', 5),

-- Resolution
('resolution', '72dpi', '72 DPI', 'Screen resolution', 1),
('resolution', '150dpi', '150 DPI', 'Draft print quality', 2),
('resolution', '300dpi', '300 DPI', 'Standard print quality', 3),
('resolution', '600dpi', '600 DPI', 'High print quality', 4),

-- Material
('material', 'canvas', 'Canvas', 'Canvas material', 1),
('material', 'paper', 'Paper', 'Standard paper', 2),
('material', 'metal', 'Metal', 'Metal substrate', 3),
('material', 'wood', 'Wood', 'Wood substrate', 4),
('material', 'fabric', 'Fabric', 'Fabric material', 5);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_file_tags_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER file_tags_updated_at
BEFORE UPDATE ON file_tags
FOR EACH ROW
EXECUTE FUNCTION update_file_tags_updated_at();

-- Part 4: Update product_variants table
ALTER TABLE product_variants
ADD COLUMN IF NOT EXISTS print_file_id UUID REFERENCES artwork_files(id),
ADD COLUMN IF NOT EXISTS print_specifications JSONB DEFAULT '{}'::jsonb;

-- Add index for print file lookups
CREATE INDEX IF NOT EXISTS idx_product_variants_print_file ON product_variants(print_file_id);

-- Add comment
COMMENT ON COLUMN product_variants.print_file_id IS 'Specific print file assigned to this variant. Falls back to product or artwork default if null.';

-- Part 5: Create order_print_files junction table
CREATE TABLE IF NOT EXISTS order_print_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL, -- Will reference orders table when created
  product_variant_id UUID REFERENCES product_variants(id) NOT NULL,
  print_file_id UUID REFERENCES artwork_files(id) NOT NULL,
  
  -- Snapshot of file info at order time (immutable)
  file_snapshot JSONB NOT NULL, -- Contains file_name, file_path, tags, print_specifications
  file_version_number INTEGER NOT NULL,
  
  -- Manufacturing tracking
  sent_to_manufacturer_at TIMESTAMPTZ,
  manufacturer_id UUID, -- Future reference to manufacturers table
  manufacturing_status TEXT DEFAULT 'pending', -- pending, sent, in_production, completed
  
  -- Print specifications used (can override variant/file defaults)
  print_specifications JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_order_print_files_order ON order_print_files(order_id);
CREATE INDEX IF NOT EXISTS idx_order_print_files_variant ON order_print_files(product_variant_id);
CREATE INDEX IF NOT EXISTS idx_order_print_files_status ON order_print_files(manufacturing_status);

-- Add trigger for updated_at
CREATE TRIGGER order_print_files_updated_at
BEFORE UPDATE ON order_print_files
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Part 6: Enable RLS on new tables
ALTER TABLE file_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_print_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for file_tags
CREATE POLICY "Anyone can view active file tags"
ON file_tags FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage file tags"
ON file_tags FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for order_print_files
CREATE POLICY "Admins can view all order print files"
ON order_print_files FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage order print files"
ON order_print_files FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Partners can view their own order print files (when orders table exists)
-- Will add this policy later when orders table is created

-- Part 7: Create function to get smart print file suggestions
CREATE OR REPLACE FUNCTION get_print_file_suggestions(
  p_artwork_id UUID,
  p_variant_codes TEXT[]
)
RETURNS TABLE (
  file_id UUID,
  file_name TEXT,
  tags JSONB,
  match_score INTEGER,
  match_reasons TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    af.id,
    af.file_name,
    af.tags,
    -- Calculate match score
    (
      CASE WHEN af.is_primary THEN 10 ELSE 0 END +
      CASE WHEN af.is_latest THEN 5 ELSE 0 END +
      -- Add points for matching variant codes in tags
      (
        SELECT COUNT(*)::INTEGER * 20
        FROM unnest(p_variant_codes) AS vc
        WHERE af.tags->'matches_variants' ? vc
      )
    ) AS match_score,
    -- Build array of match reasons
    ARRAY(
      SELECT unnest(ARRAY[
        CASE WHEN af.is_primary THEN 'Primary file for artwork' ELSE NULL END,
        CASE WHEN af.is_latest THEN 'Latest version' ELSE NULL END
      ] || ARRAY(
        SELECT 'Matches variant: ' || vc
        FROM unnest(p_variant_codes) AS vc
        WHERE af.tags->'matches_variants' ? vc
      ))
      WHERE unnest IS NOT NULL
    ) AS match_reasons
  FROM artwork_files af
  WHERE 
    af.artwork_id = p_artwork_id
    AND af.file_type = 'original'
    AND af.is_latest = true
  ORDER BY match_score DESC, af.created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Add comment
COMMENT ON FUNCTION get_print_file_suggestions IS 'Returns ranked list of print files for an artwork based on variant codes. Higher match_score = better fit.';

-- Part 8: Create function to handle file versioning
CREATE OR REPLACE FUNCTION create_file_version(
  p_original_file_id UUID,
  p_new_file_data JSONB
)
RETURNS UUID AS $$
DECLARE
  v_new_file_id UUID;
  v_next_version INTEGER;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1 INTO v_next_version
  FROM artwork_files
  WHERE artwork_id = (SELECT artwork_id FROM artwork_files WHERE id = p_original_file_id);
  
  -- Mark old file as not latest
  UPDATE artwork_files
  SET is_latest = false
  WHERE id = p_original_file_id;
  
  -- Create new file version
  INSERT INTO artwork_files (
    artwork_id,
    file_name,
    file_path,
    file_type,
    file_size,
    mime_type,
    tags,
    print_specifications,
    version_number,
    is_latest,
    uploaded_by
  )
  SELECT
    artwork_id,
    p_new_file_data->>'file_name',
    p_new_file_data->>'file_path',
    file_type,
    (p_new_file_data->>'file_size')::BIGINT,
    p_new_file_data->>'mime_type',
    COALESCE((p_new_file_data->'tags')::JSONB, tags),
    COALESCE((p_new_file_data->'print_specifications')::JSONB, print_specifications),
    v_next_version,
    true,
    auth.uid()
  FROM artwork_files
  WHERE id = p_original_file_id
  RETURNING id INTO v_new_file_id;
  
  -- Link old file to new version
  UPDATE artwork_files
  SET replaced_by = v_new_file_id
  WHERE id = p_original_file_id;
  
  RETURN v_new_file_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION create_file_version IS 'Creates a new version of an existing file, maintains version history, and marks old version as replaced.';