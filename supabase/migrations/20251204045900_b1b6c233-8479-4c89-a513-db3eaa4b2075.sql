-- Partner Products staging table for normalized import data
CREATE TABLE public.partner_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  artwork_id UUID REFERENCES artworks(id) ON DELETE SET NULL,
  
  -- Source tracking
  source_table TEXT NOT NULL,
  source_record_id UUID NOT NULL,
  
  -- Extracted/Normalized Data
  artwork_code TEXT,
  original_title TEXT NOT NULL,
  original_sku TEXT,
  original_handle TEXT,
  product_type TEXT,
  vendor TEXT,
  
  -- Variant data (JSON array of normalized variants)
  variants JSONB DEFAULT '[]'::jsonb,
  
  -- Import Tracking
  import_method TEXT NOT NULL CHECK (import_method IN ('syncio', 'csv', 'api', 'manual')),
  import_status TEXT NOT NULL DEFAULT 'pending' CHECK (import_status IN ('pending', 'reviewing', 'mapped', 'created', 'rejected')),
  imported_at TIMESTAMPTZ DEFAULT NOW(),
  mapped_at TIMESTAMPTZ,
  mapped_by UUID REFERENCES profiles(id),
  
  -- Notes
  mapping_notes TEXT,
  rejection_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SKU Crosswalk for reporting and lookups
CREATE TABLE public.sku_crosswalk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  atlas_variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  partner_product_id UUID NOT NULL REFERENCES partner_products(id) ON DELETE CASCADE,
  partner_sku TEXT NOT NULL,
  partner_variant_id TEXT,
  source_platform TEXT NOT NULL DEFAULT 'shopify',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(atlas_variant_id, partner_sku)
);

-- Indexes for performance
CREATE INDEX idx_partner_products_partner_id ON partner_products(partner_id);
CREATE INDEX idx_partner_products_import_status ON partner_products(import_status);
CREATE INDEX idx_partner_products_artwork_code ON partner_products(artwork_code);
CREATE INDEX idx_partner_products_source ON partner_products(source_table, source_record_id);
CREATE INDEX idx_sku_crosswalk_partner_sku ON sku_crosswalk(partner_sku);
CREATE INDEX idx_sku_crosswalk_atlas_variant ON sku_crosswalk(atlas_variant_id);

-- Enable RLS
ALTER TABLE partner_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sku_crosswalk ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partner_products
CREATE POLICY "Admins can manage all partner products"
  ON partner_products FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Partners can view own partner products"
  ON partner_products FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM partner_contacts pc
    WHERE pc.partner_id = partner_products.partner_id
    AND pc.user_id = auth.uid()
  ));

-- RLS Policies for sku_crosswalk
CREATE POLICY "Admins can manage all sku crosswalk"
  ON sku_crosswalk FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view sku crosswalk"
  ON sku_crosswalk FOR SELECT
  USING (true);

-- Updated_at trigger
CREATE TRIGGER update_partner_products_updated_at
  BEFORE UPDATE ON partner_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();