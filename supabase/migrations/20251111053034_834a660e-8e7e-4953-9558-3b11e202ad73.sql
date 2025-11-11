-- ============================================================================
-- ATLAS SKU MANAGEMENT SYSTEM - DATABASE SCHEMA (FIXED)
-- ============================================================================
-- Fixed: Renamed 'asc' column to 'asc_code' (asc is a reserved keyword)
-- ============================================================================

-- ============================================================================
-- PART 1: SEQUENCES AND ENUMS
-- ============================================================================

CREATE SEQUENCE IF NOT EXISTS asc_sequence START WITH 10000 INCREMENT BY 1;

CREATE TYPE artwork_status AS ENUM ('draft', 'active', 'archived', 'discontinued');
CREATE TYPE sync_direction AS ENUM ('atlas_to_shopify', 'shopify_to_atlas', 'bidirectional');
CREATE TYPE sync_status AS ENUM ('synced', 'pending', 'error', 'conflict');
CREATE TYPE import_status AS ENUM ('pending', 'mapped', 'imported', 'error', 'skipped');
CREATE TYPE import_method AS ENUM ('csv', 'syncio', 'api', 'manual');
CREATE TYPE store_type AS ENUM ('atlas_managed', 'partner_owned');
CREATE TYPE asc_history_status AS ENUM ('assigned', 'voided', 'transferred');

-- ============================================================================
-- PART 2: MASTER CODE TABLES
-- ============================================================================

CREATE TABLE product_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_code TEXT NOT NULL UNIQUE CHECK (type_code = upper(type_code)),
  type_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES profiles(id)
);

COMMENT ON TABLE product_types IS 'Master list of product categories (TSH=T-Shirt, PST=Poster, etc.)';

CREATE TABLE variant_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_type_id UUID NOT NULL REFERENCES product_types(id) ON DELETE CASCADE,
  group_name TEXT NOT NULL,
  description TEXT,
  is_required BOOLEAN DEFAULT false,
  allow_multiple BOOLEAN DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(product_type_id, group_name)
);

COMMENT ON TABLE variant_groups IS 'Variant attribute categories (Size, Color, PosterSize, FrameOption, etc.)';

CREATE TABLE variant_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_group_id UUID NOT NULL REFERENCES variant_groups(id) ON DELETE CASCADE,
  code TEXT NOT NULL CHECK (code ~ '^[0-9]{2}$'),
  display_value TEXT NOT NULL,
  display_order INTEGER,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(variant_group_id, code)
);

COMMENT ON TABLE variant_codes IS 'Individual variant options (01=Black, 02=White, 03=12x18, etc.)';

-- ============================================================================
-- PART 3: ARTWORK AND ASC MANAGEMENT
-- ============================================================================

CREATE TABLE artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asc_code TEXT NOT NULL UNIQUE CHECK (asc_code ~ '^[0-9]{2}[A-Z][0-9]{3}$'),
  sequence_number INTEGER NOT NULL UNIQUE,
  partner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  artist_name TEXT,
  description TEXT,
  art_medium TEXT,
  year_created INTEGER,
  original_dimensions TEXT,
  status artwork_status DEFAULT 'draft',
  metadata JSONB DEFAULT '{}',
  tags TEXT[],
  is_exclusive BOOLEAN DEFAULT false,
  rights_start_date DATE,
  rights_end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES profiles(id)
);

COMMENT ON TABLE artworks IS 'Master artwork catalog with unique ASC identifiers';
COMMENT ON COLUMN artworks.asc_code IS 'Artwork Serial Code format: 10A001 (2 digits + 1 letter + 3 digits)';

CREATE TABLE asc_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asc_code TEXT NOT NULL,
  artwork_id UUID REFERENCES artworks(id) ON DELETE SET NULL,
  status asc_history_status NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  assigned_by UUID REFERENCES profiles(id),
  voided_at TIMESTAMPTZ,
  voided_by UUID REFERENCES profiles(id),
  void_reason TEXT,
  notes TEXT
);

COMMENT ON TABLE asc_history IS 'Tracks ASC lifecycle: assignment, voiding, transfers';

CREATE TABLE artwork_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  file_type TEXT NOT NULL CHECK (file_type IN ('original', 'print_ready', 'thumbnail', 'mockup', 'reference')),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  dimensions TEXT,
  dpi INTEGER,
  color_profile TEXT,
  is_primary BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  uploaded_by UUID REFERENCES profiles(id)
);

COMMENT ON TABLE artwork_files IS 'Stores references to artwork files in storage buckets';

-- ============================================================================
-- PART 4: PRODUCTS AND VARIANTS
-- ============================================================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  product_type_id UUID NOT NULL REFERENCES product_types(id) ON DELETE RESTRICT,
  base_sku TEXT NOT NULL UNIQUE,
  product_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  launch_date DATE,
  discontinue_date DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES profiles(id),
  UNIQUE(artwork_id, product_type_id)
);

COMMENT ON TABLE products IS 'Products created from artworks (one artwork can have multiple product types)';
COMMENT ON COLUMN products.base_sku IS 'Format: 10A001-TSH (ASC + Product Type Code)';

CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  full_sku TEXT NOT NULL UNIQUE CHECK (length(full_sku) <= 16),
  variant_code TEXT NOT NULL,
  variant_name TEXT,
  retail_price DECIMAL(10,2),
  wholesale_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  inventory_qty INTEGER DEFAULT 0,
  reserved_qty INTEGER DEFAULT 0,
  reorder_point INTEGER DEFAULT 0,
  weight_oz DECIMAL(8,2),
  barcode TEXT,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE product_variants IS 'Specific product configurations with complete SKUs';
COMMENT ON COLUMN product_variants.full_sku IS 'Complete SKU: 10A001-TSH-BLK01 (max 16 chars)';
COMMENT ON COLUMN product_variants.variant_code IS 'Variant portion: BLK01, 020102, etc.';

CREATE TABLE variant_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  variant_code_id UUID NOT NULL REFERENCES variant_codes(id) ON DELETE RESTRICT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(variant_id, variant_code_id)
);

COMMENT ON TABLE variant_attributes IS 'Links variants to their specific attribute codes (color, size, etc.)';

CREATE TABLE variant_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  file_type TEXT NOT NULL CHECK (file_type IN ('product_image', 'mockup', 'lifestyle', 'detail')),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  uploaded_by UUID REFERENCES profiles(id)
);

-- ============================================================================
-- PART 5: SKU HISTORY AND AUDIT
-- ============================================================================

CREATE TABLE sku_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'voided', 'reactivated', 'price_change', 'inventory_change')),
  changes JSONB DEFAULT '{}',
  changed_by UUID REFERENCES profiles(id),
  changed_at TIMESTAMPTZ DEFAULT now(),
  reason TEXT,
  ip_address INET,
  user_agent TEXT
);

COMMENT ON TABLE sku_history IS 'Comprehensive audit log for all SKU-related changes';

-- ============================================================================
-- PART 6: SHOPIFY INTEGRATION
-- ============================================================================

CREATE TABLE shopify_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  store_domain TEXT NOT NULL UNIQUE,
  store_type store_type DEFAULT 'atlas_managed',
  shop_name TEXT,
  shopify_store_id TEXT,
  access_token_encrypted TEXT,
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  sync_settings JSONB DEFAULT '{}',
  connected_at TIMESTAMPTZ DEFAULT now(),
  connected_by UUID REFERENCES profiles(id),
  metadata JSONB DEFAULT '{}'
);

COMMENT ON TABLE shopify_stores IS 'Shopify stores connected for sync (both Atlas-managed and partner-owned)';

CREATE TABLE shopify_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_store_id UUID NOT NULL REFERENCES shopify_stores(id) ON DELETE CASCADE,
  shopify_product_id TEXT NOT NULL,
  shopify_variant_id TEXT,
  title TEXT NOT NULL,
  handle TEXT,
  product_type TEXT,
  vendor TEXT,
  tags TEXT[],
  raw_data JSONB,
  last_synced_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(shopify_store_id, shopify_product_id, shopify_variant_id)
);

COMMENT ON TABLE shopify_products IS 'Cached Shopify product data for import and sync operations';

CREATE TABLE shopify_sync_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  shopify_store_id UUID NOT NULL REFERENCES shopify_stores(id) ON DELETE CASCADE,
  shopify_product_id TEXT NOT NULL,
  shopify_variant_id TEXT NOT NULL,
  sync_direction sync_direction DEFAULT 'bidirectional',
  sync_status sync_status DEFAULT 'pending',
  last_sync_at TIMESTAMPTZ,
  last_sync_error TEXT,
  sync_settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(variant_id, shopify_store_id),
  UNIQUE(shopify_store_id, shopify_product_id, shopify_variant_id)
);

COMMENT ON TABLE shopify_sync_map IS 'Maps Atlas variants to Shopify products for bi-directional sync';

CREATE TABLE import_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_product_id UUID NOT NULL REFERENCES shopify_products(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  import_status import_status DEFAULT 'pending',
  import_method import_method NOT NULL,
  mapping_data JSONB DEFAULT '{}',
  suggested_asc_code TEXT,
  suggested_product_type_id UUID REFERENCES product_types(id),
  suggested_variant_codes JSONB,
  validation_errors JSONB,
  imported_artwork_id UUID REFERENCES artworks(id),
  imported_product_id UUID REFERENCES products(id),
  queued_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES profiles(id),
  notes TEXT
);

COMMENT ON TABLE import_queue IS 'Stages Shopify products for import into Atlas catalog';

CREATE TABLE sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_map_id UUID REFERENCES shopify_sync_map(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('push', 'pull', 'bidirectional')),
  operation TEXT NOT NULL CHECK (operation IN ('create', 'update', 'delete', 'inventory', 'price')),
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'partial')),
  sync_payload JSONB,
  response_data JSONB,
  error_message TEXT,
  error_code TEXT,
  duration_ms INTEGER,
  synced_at TIMESTAMPTZ DEFAULT now(),
  synced_by UUID REFERENCES profiles(id)
);

COMMENT ON TABLE sync_log IS 'Detailed log of all sync operations for troubleshooting';

-- ============================================================================
-- PART 7: FINANCIAL AGREEMENTS
-- ============================================================================

CREATE TABLE financial_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  agreement_type TEXT NOT NULL CHECK (agreement_type IN ('commission', 'wholesale', 'consignment', 'licensing')),
  commission_rate DECIMAL(5,2),
  wholesale_discount_rate DECIMAL(5,2),
  minimum_order_value DECIMAL(10,2),
  payment_terms TEXT,
  effective_date DATE NOT NULL,
  expiration_date DATE,
  is_active BOOLEAN DEFAULT true,
  terms JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES profiles(id)
);

COMMENT ON TABLE financial_agreements IS 'Partner financial terms, commissions, and pricing structures';

-- ============================================================================
-- PART 8: INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_artworks_partner ON artworks(partner_id);
CREATE INDEX idx_artworks_status ON artworks(status) WHERE status = 'active';
CREATE INDEX idx_artworks_asc_code ON artworks(asc_code);
CREATE INDEX idx_artworks_sequence ON artworks(sequence_number);
CREATE INDEX idx_artworks_tags ON artworks USING gin(tags);

CREATE INDEX idx_products_artwork ON products(artwork_id);
CREATE INDEX idx_products_type ON products(product_type_id);
CREATE INDEX idx_products_base_sku ON products(base_sku);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(full_sku);
CREATE INDEX idx_variants_active ON product_variants(is_active) WHERE is_active = true;
CREATE INDEX idx_variants_inventory ON product_variants(inventory_qty) WHERE is_active = true;

CREATE INDEX idx_variant_codes_group ON variant_codes(variant_group_id);
CREATE INDEX idx_variant_codes_active ON variant_codes(is_active) WHERE is_active = true;
CREATE INDEX idx_variant_attributes_variant ON variant_attributes(variant_id);
CREATE INDEX idx_variant_attributes_code ON variant_attributes(variant_code_id);

CREATE INDEX idx_shopify_stores_partner ON shopify_stores(partner_id);
CREATE INDEX idx_shopify_products_store ON shopify_products(shopify_store_id);
CREATE INDEX idx_shopify_sync_map_variant ON shopify_sync_map(variant_id);
CREATE INDEX idx_shopify_sync_map_store ON shopify_sync_map(shopify_store_id);
CREATE INDEX idx_import_queue_status ON import_queue(import_status);
CREATE INDEX idx_import_queue_partner ON import_queue(partner_id);

CREATE INDEX idx_sku_history_variant ON sku_history(variant_id);
CREATE INDEX idx_sku_history_sku ON sku_history(sku);
CREATE INDEX idx_sku_history_changed_at ON sku_history(changed_at DESC);
CREATE INDEX idx_asc_history_asc_code ON asc_history(asc_code);
CREATE INDEX idx_asc_history_artwork ON asc_history(artwork_id);

-- ============================================================================
-- PART 9: ROW LEVEL SECURITY POLICIES
-- ============================================================================

ALTER TABLE product_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE asc_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE artwork_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE sku_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify_sync_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product types" ON product_types FOR SELECT USING (true);
CREATE POLICY "Admins can manage product types" ON product_types FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view variant groups" ON variant_groups FOR SELECT USING (true);
CREATE POLICY "Admins can manage variant groups" ON variant_groups FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active variant codes" ON variant_codes FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage variant codes" ON variant_codes FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Active artworks are publicly viewable" ON artworks FOR SELECT USING (status = 'active');
CREATE POLICY "Partners can view own artworks" ON artworks FOR SELECT USING (partner_id = auth.uid() OR has_role(auth.uid(), 'partner'));
CREATE POLICY "Partners can create artworks" ON artworks FOR INSERT WITH CHECK (partner_id = auth.uid());
CREATE POLICY "Partners can update own artworks" ON artworks FOR UPDATE USING (partner_id = auth.uid());
CREATE POLICY "Admins can manage all artworks" ON artworks FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Active products are publicly viewable" ON products FOR SELECT USING (
  is_active = true AND EXISTS (SELECT 1 FROM artworks WHERE artworks.id = products.artwork_id AND artworks.status = 'active')
);
CREATE POLICY "Partners can view own products" ON products FOR SELECT USING (
  EXISTS (SELECT 1 FROM artworks WHERE artworks.id = products.artwork_id AND artworks.partner_id = auth.uid())
);
CREATE POLICY "Partners can create products from own artworks" ON products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM artworks WHERE artworks.id = products.artwork_id AND artworks.partner_id = auth.uid())
);
CREATE POLICY "Partners can update own products" ON products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM artworks WHERE artworks.id = products.artwork_id AND artworks.partner_id = auth.uid())
);
CREATE POLICY "Admins can manage all products" ON products FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Active variants are publicly viewable" ON product_variants FOR SELECT USING (
  is_active = true AND EXISTS (
    SELECT 1 FROM products p JOIN artworks a ON p.artwork_id = a.id 
    WHERE p.id = product_variants.product_id AND p.is_active = true AND a.status = 'active'
  )
);
CREATE POLICY "Partners can view own variants" ON product_variants FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM products p JOIN artworks a ON p.artwork_id = a.id 
    WHERE p.id = product_variants.product_id AND a.partner_id = auth.uid()
  )
);
CREATE POLICY "Partners can manage own variants" ON product_variants FOR ALL USING (
  EXISTS (
    SELECT 1 FROM products p JOIN artworks a ON p.artwork_id = a.id 
    WHERE p.id = product_variants.product_id AND a.partner_id = auth.uid()
  )
);
CREATE POLICY "Admins can manage all variants" ON product_variants FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view variant attributes" ON variant_attributes FOR SELECT USING (true);
CREATE POLICY "Partners can manage own variant attributes" ON variant_attributes FOR ALL USING (
  EXISTS (
    SELECT 1 FROM product_variants pv JOIN products p ON pv.product_id = p.id JOIN artworks a ON p.artwork_id = a.id 
    WHERE pv.id = variant_attributes.variant_id AND a.partner_id = auth.uid()
  )
);
CREATE POLICY "Admins can manage all variant attributes" ON variant_attributes FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view files for active artworks" ON artwork_files FOR SELECT USING (
  EXISTS (SELECT 1 FROM artworks WHERE artworks.id = artwork_files.artwork_id AND artworks.status = 'active')
);
CREATE POLICY "Partners can manage own artwork files" ON artwork_files FOR ALL USING (
  EXISTS (SELECT 1 FROM artworks WHERE artworks.id = artwork_files.artwork_id AND artworks.partner_id = auth.uid())
);
CREATE POLICY "Admins can manage all artwork files" ON artwork_files FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view variant files" ON variant_files FOR SELECT USING (true);
CREATE POLICY "Partners can manage own variant files" ON variant_files FOR ALL USING (
  EXISTS (
    SELECT 1 FROM product_variants pv JOIN products p ON pv.product_id = p.id JOIN artworks a ON p.artwork_id = a.id 
    WHERE pv.id = variant_files.variant_id AND a.partner_id = auth.uid()
  )
);
CREATE POLICY "Admins can manage all variant files" ON variant_files FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all history" ON sku_history FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Partners can view own SKU history" ON sku_history FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM product_variants pv JOIN products p ON pv.product_id = p.id JOIN artworks a ON p.artwork_id = a.id 
    WHERE pv.id = sku_history.variant_id AND a.partner_id = auth.uid()
  )
);
CREATE POLICY "System can log SKU history" ON sku_history FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view ASC history" ON asc_history FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Partners can view own ASC history" ON asc_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM artworks WHERE artworks.id = asc_history.artwork_id AND artworks.partner_id = auth.uid())
);
CREATE POLICY "System can log ASC history" ON asc_history FOR INSERT WITH CHECK (true);

CREATE POLICY "Partners can view own stores" ON shopify_stores FOR SELECT USING (partner_id = auth.uid());
CREATE POLICY "Partners can manage own stores" ON shopify_stores FOR ALL USING (partner_id = auth.uid());
CREATE POLICY "Admins can manage all stores" ON shopify_stores FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners can view own Shopify products" ON shopify_products FOR SELECT USING (
  EXISTS (SELECT 1 FROM shopify_stores WHERE shopify_stores.id = shopify_products.shopify_store_id AND shopify_stores.partner_id = auth.uid())
);
CREATE POLICY "System can manage Shopify products" ON shopify_products FOR ALL USING (true);

CREATE POLICY "Partners can view own sync mappings" ON shopify_sync_map FOR SELECT USING (
  EXISTS (SELECT 1 FROM shopify_stores WHERE shopify_stores.id = shopify_sync_map.shopify_store_id AND shopify_stores.partner_id = auth.uid())
);
CREATE POLICY "Partners can manage own sync mappings" ON shopify_sync_map FOR ALL USING (
  EXISTS (SELECT 1 FROM shopify_stores WHERE shopify_stores.id = shopify_sync_map.shopify_store_id AND shopify_stores.partner_id = auth.uid())
);
CREATE POLICY "Admins can manage all sync mappings" ON shopify_sync_map FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners can view own import queue" ON import_queue FOR SELECT USING (partner_id = auth.uid());
CREATE POLICY "Partners can manage own import queue" ON import_queue FOR ALL USING (partner_id = auth.uid());
CREATE POLICY "Admins can manage all import queue" ON import_queue FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners can view own sync logs" ON sync_log FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM shopify_sync_map ssm JOIN shopify_stores ss ON ssm.shopify_store_id = ss.id 
    WHERE ssm.id = sync_log.sync_map_id AND ss.partner_id = auth.uid()
  )
);
CREATE POLICY "System can log sync operations" ON sync_log FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all sync logs" ON sync_log FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners can view own agreements" ON financial_agreements FOR SELECT USING (partner_id = auth.uid());
CREATE POLICY "Admins can manage all agreements" ON financial_agreements FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ============================================================================
-- PART 10: TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_types_updated_at BEFORE UPDATE ON product_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_variant_groups_updated_at BEFORE UPDATE ON variant_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_variant_codes_updated_at BEFORE UPDATE ON variant_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artworks_updated_at BEFORE UPDATE ON artworks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_agreements_updated_at BEFORE UPDATE ON financial_agreements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PART 11: HELPER FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_next_asc()
RETURNS TEXT AS $$
DECLARE
  seq_val INTEGER;
  decade_digit INTEGER;
  letter_code TEXT;
  number_part TEXT;
BEGIN
  seq_val := nextval('asc_sequence');
  decade_digit := 10 + (EXTRACT(YEAR FROM CURRENT_DATE) - 2020) / 10;
  letter_code := chr(65 + (seq_val / 1000) % 26);
  number_part := LPAD((seq_val % 1000)::TEXT, 3, '0');
  RETURN LPAD(decade_digit::TEXT, 2, '0') || letter_code || number_part;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_next_asc() IS 'Generates next ASC in format: 10A001 (decade + letter + sequence)';

CREATE OR REPLACE FUNCTION build_full_sku(
  p_asc_code TEXT,
  p_product_type_code TEXT,
  p_variant_code TEXT
)
RETURNS TEXT AS $$
BEGIN
  RETURN p_asc_code || '-' || p_product_type_code || '-' || p_variant_code;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION build_full_sku IS 'Builds full SKU from components: 10A001-TSH-BLK01';