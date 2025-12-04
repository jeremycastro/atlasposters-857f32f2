-- Phase 1: Clean existing data (in correct order to avoid FK violations)
DELETE FROM variant_codes;
DELETE FROM variant_groups;
DELETE FROM product_variants;
DELETE FROM products;
DELETE FROM product_types;

-- Phase 2: Modify variant_groups table (remove product_type_id and move columns to junction)
ALTER TABLE variant_groups DROP COLUMN IF EXISTS product_type_id;
ALTER TABLE variant_groups DROP COLUMN IF EXISTS is_required;
ALTER TABLE variant_groups DROP COLUMN IF EXISTS allow_multiple;
ALTER TABLE variant_groups DROP COLUMN IF EXISTS sort_order;

-- Phase 3: Create junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS product_type_variant_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_type_id UUID NOT NULL REFERENCES product_types(id) ON DELETE CASCADE,
  variant_group_id UUID NOT NULL REFERENCES variant_groups(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN DEFAULT false,
  allow_multiple BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(product_type_id, variant_group_id)
);

-- Enable RLS on junction table
ALTER TABLE product_type_variant_groups ENABLE ROW LEVEL SECURITY;

-- RLS policies for junction table
CREATE POLICY "Admins can manage product type variant groups"
ON product_type_variant_groups FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view product type variant groups"
ON product_type_variant_groups FOR SELECT
USING (true);

-- Phase 4: Seed Product Types
INSERT INTO product_types (type_code, type_name, description, sort_order, is_active)
VALUES 
  ('PST', 'Poster', 'Unframed art prints on paper', 0, true),
  ('TEE', 'Unisex T-Shirt', 'Standard apparel product', 1, true);

-- Phase 5: Seed Shared Variant Groups
INSERT INTO variant_groups (group_name, description, is_active)
VALUES 
  ('Print Size', 'Paper dimensions for prints (ordered by area)', true),
  ('Paper Type', 'Paper finish and material options', true),
  ('Apparel Size', 'Garment sizing options', true),
  ('Apparel Color', 'Display color for apparel (maps to brand colors)', true);

-- Phase 6: Seed Variant Codes for Print Size (ordered by area)
INSERT INTO variant_codes (variant_group_id, code, display_value, description, display_order, is_active)
SELECT 
  vg.id,
  codes.code,
  codes.display_value,
  codes.description,
  codes.display_order,
  true
FROM variant_groups vg
CROSS JOIN (VALUES
  ('00', 'A5', '148×210mm (31,080 mm²)', 0),
  ('01', '8×10"', '203×254mm (51,562 mm²)', 1),
  ('02', 'A4', '210×297mm (62,370 mm²)', 2),
  ('03', '11×14"', '279×356mm (99,324 mm²)', 3),
  ('04', 'A3', '297×420mm (124,740 mm²)', 4),
  ('05', '16×20"', '406×508mm (206,248 mm²)', 5),
  ('06', 'A2', '420×594mm (249,480 mm²)', 6),
  ('07', '18×24"', '457×610mm (278,770 mm²)', 7),
  ('08', 'A1', '594×841mm (499,554 mm²)', 8),
  ('09', '24×36"', '610×914mm (557,540 mm²)', 9)
) AS codes(code, display_value, description, display_order)
WHERE vg.group_name = 'Print Size';

-- Phase 7: Seed Variant Codes for Paper Type
INSERT INTO variant_codes (variant_group_id, code, display_value, description, display_order, is_active)
SELECT 
  vg.id,
  codes.code,
  codes.display_value,
  codes.description,
  codes.display_order,
  true
FROM variant_groups vg
CROSS JOIN (VALUES
  ('00', 'Matte', 'Standard matte finish', 0),
  ('01', 'Gloss', 'High gloss finish', 1),
  ('02', 'Fine Art', 'Premium fine art paper', 2)
) AS codes(code, display_value, description, display_order)
WHERE vg.group_name = 'Paper Type';

-- Phase 8: Seed Variant Codes for Apparel Size
INSERT INTO variant_codes (variant_group_id, code, display_value, description, display_order, is_active)
SELECT 
  vg.id,
  codes.code,
  codes.display_value,
  codes.description,
  codes.display_order,
  true
FROM variant_groups vg
CROSS JOIN (VALUES
  ('00', 'XS', 'Extra Small', 0),
  ('01', 'S', 'Small', 1),
  ('02', 'M', 'Medium', 2),
  ('03', 'L', 'Large', 3),
  ('04', 'XL', 'Extra Large', 4),
  ('05', '2XL', 'Double Extra Large', 5)
) AS codes(code, display_value, description, display_order)
WHERE vg.group_name = 'Apparel Size';

-- Phase 9: Seed Variant Codes for Apparel Color
INSERT INTO variant_codes (variant_group_id, code, display_value, description, display_order, is_active)
SELECT 
  vg.id,
  codes.code,
  codes.display_value,
  codes.description,
  codes.display_order,
  true
FROM variant_groups vg
CROSS JOIN (VALUES
  ('00', 'Black', 'Standard black', 0),
  ('01', 'White', 'Standard white', 1),
  ('02', 'Navy', 'Navy blue', 2),
  ('03', 'Heather Grey', 'Heather grey blend', 3)
) AS codes(code, display_value, description, display_order)
WHERE vg.group_name = 'Apparel Color';

-- Phase 10: Link Variant Groups to Product Types
-- PST (Poster): Print Size (VAR1), Paper Type (VAR2)
INSERT INTO product_type_variant_groups (product_type_id, variant_group_id, sort_order, is_required)
SELECT pt.id, vg.id, 0, true
FROM product_types pt, variant_groups vg
WHERE pt.type_code = 'PST' AND vg.group_name = 'Print Size';

INSERT INTO product_type_variant_groups (product_type_id, variant_group_id, sort_order, is_required)
SELECT pt.id, vg.id, 1, true
FROM product_types pt, variant_groups vg
WHERE pt.type_code = 'PST' AND vg.group_name = 'Paper Type';

-- TEE (T-Shirt): Apparel Size (VAR1), Apparel Color (VAR2)
INSERT INTO product_type_variant_groups (product_type_id, variant_group_id, sort_order, is_required)
SELECT pt.id, vg.id, 0, true
FROM product_types pt, variant_groups vg
WHERE pt.type_code = 'TEE' AND vg.group_name = 'Apparel Size';

INSERT INTO product_type_variant_groups (product_type_id, variant_group_id, sort_order, is_required)
SELECT pt.id, vg.id, 1, true
FROM product_types pt, variant_groups vg
WHERE pt.type_code = 'TEE' AND vg.group_name = 'Apparel Color';