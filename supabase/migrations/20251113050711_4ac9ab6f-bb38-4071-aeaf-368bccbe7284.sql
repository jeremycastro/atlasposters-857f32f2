-- Phase 1: Complete Unified Tagging System Database Schema

-- Category definitions (the taxonomy structure)
CREATE TABLE category_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_key TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  scope TEXT[] NOT NULL,
  parent_category_id UUID REFERENCES category_definitions(id) ON DELETE SET NULL,
  is_hierarchical BOOLEAN DEFAULT false,
  allows_custom_tags BOOLEAN DEFAULT true,
  is_required BOOLEAN DEFAULT false,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tag definitions (the actual tags)
CREATE TABLE tag_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES category_definitions(id) ON DELETE CASCADE,
  parent_tag_id UUID REFERENCES tag_definitions(id) ON DELETE SET NULL,
  tag_key TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  tag_type TEXT CHECK (tag_type IN ('system', 'custom')) DEFAULT 'system',
  metadata JSONB DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(category_id, tag_key)
);

-- Entity tagging (junction table)
CREATE TABLE entity_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('partner', 'brand', 'artwork', 'product', 'product_variant', 'file')),
  entity_id UUID NOT NULL,
  tag_id UUID NOT NULL REFERENCES tag_definitions(id) ON DELETE CASCADE,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'inherited', 'auto', 'ai')),
  confidence_score NUMERIC(3,2),
  inherited_from_type TEXT,
  inherited_from_id UUID,
  tagged_by UUID REFERENCES profiles(id),
  tagged_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  UNIQUE(entity_type, entity_id, tag_id)
);

-- Tag inheritance rules
CREATE TABLE tag_inheritance_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES category_definitions(id) ON DELETE CASCADE,
  from_entity_type TEXT NOT NULL,
  to_entity_type TEXT NOT NULL,
  is_bidirectional BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tag permissions
CREATE TABLE tag_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES category_definitions(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  can_view BOOLEAN DEFAULT true,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  can_apply BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(category_id, role)
);

-- Tag suggestions cache
CREATE TABLE tag_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  suggested_tags JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT now() + interval '7 days',
  UNIQUE(entity_type, entity_id)
);

-- Indexes
CREATE INDEX idx_entity_tags_entity ON entity_tags(entity_type, entity_id);
CREATE INDEX idx_entity_tags_tag ON entity_tags(tag_id);
CREATE INDEX idx_entity_tags_source ON entity_tags(source);
CREATE INDEX idx_tag_definitions_category ON tag_definitions(category_id);
CREATE INDEX idx_tag_definitions_parent ON tag_definitions(parent_tag_id);
CREATE INDEX idx_tag_definitions_key ON tag_definitions(tag_key);
CREATE INDEX idx_category_definitions_key ON category_definitions(category_key);
CREATE INDEX idx_tag_suggestions_entity ON tag_suggestions(entity_type, entity_id);
CREATE INDEX idx_tag_suggestions_expires ON tag_suggestions(expires_at);

-- Tag inheritance function
CREATE OR REPLACE FUNCTION apply_tag_inheritance()
RETURNS TRIGGER AS $$
DECLARE
  rule RECORD;
BEGIN
  IF NEW.source != 'manual' THEN
    RETURN NEW;
  END IF;

  FOR rule IN 
    SELECT DISTINCT
      tir.to_entity_type,
      tir.from_entity_type,
      td.category_id
    FROM tag_inheritance_rules tir
    JOIN tag_definitions td ON td.category_id = tir.category_id
    WHERE tir.from_entity_type = NEW.entity_type
      AND tir.is_active = true
      AND td.id = NEW.tag_id
  LOOP
    IF rule.from_entity_type = 'brand' AND rule.to_entity_type = 'artwork' THEN
      INSERT INTO entity_tags (entity_type, entity_id, tag_id, source, inherited_from_type, inherited_from_id)
      SELECT 'artwork', a.id, NEW.tag_id, 'inherited', 'brand', NEW.entity_id
      FROM artworks a WHERE a.brand_id = NEW.entity_id
      ON CONFLICT (entity_type, entity_id, tag_id) DO NOTHING;
    END IF;

    IF rule.from_entity_type = 'artwork' AND rule.to_entity_type = 'product' THEN
      INSERT INTO entity_tags (entity_type, entity_id, tag_id, source, inherited_from_type, inherited_from_id)
      SELECT 'product', p.id, NEW.tag_id, 'inherited', 'artwork', NEW.entity_id
      FROM products p WHERE p.artwork_id = NEW.entity_id
      ON CONFLICT (entity_type, entity_id, tag_id) DO NOTHING;
    END IF;

    IF rule.from_entity_type = 'product' AND rule.to_entity_type = 'product_variant' THEN
      INSERT INTO entity_tags (entity_type, entity_id, tag_id, source, inherited_from_type, inherited_from_id)
      SELECT 'product_variant', pv.id, NEW.tag_id, 'inherited', 'product', NEW.entity_id
      FROM product_variants pv WHERE pv.product_id = NEW.entity_id
      ON CONFLICT (entity_type, entity_id, tag_id) DO NOTHING;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tag_inheritance_trigger
  AFTER INSERT ON entity_tags
  FOR EACH ROW
  EXECUTE FUNCTION apply_tag_inheritance();

-- Helper function: Get all tags for an entity
CREATE OR REPLACE FUNCTION get_entity_tags(
  p_entity_type TEXT,
  p_entity_id UUID
)
RETURNS TABLE (
  tag_id UUID,
  category_key TEXT,
  category_name TEXT,
  tag_key TEXT,
  tag_name TEXT,
  tag_type TEXT,
  source TEXT,
  inherited_from_type TEXT,
  inherited_from_id UUID,
  confidence_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    td.id,
    cd.category_key,
    cd.display_name,
    td.tag_key,
    td.display_name,
    td.tag_type,
    et.source,
    et.inherited_from_type,
    et.inherited_from_id,
    et.confidence_score
  FROM entity_tags et
  JOIN tag_definitions td ON et.tag_id = td.id
  JOIN category_definitions cd ON td.category_id = cd.id
  WHERE et.entity_type = p_entity_type
    AND et.entity_id = p_entity_id
    AND td.is_active = true
  ORDER BY cd.sort_order, td.sort_order;
END;
$$ LANGUAGE plpgsql STABLE;

-- Helper function: Search entities by tags
CREATE OR REPLACE FUNCTION search_by_tags(
  p_entity_type TEXT,
  p_tag_ids UUID[],
  p_match_all BOOLEAN DEFAULT false
)
RETURNS TABLE (entity_id UUID) AS $$
BEGIN
  IF p_match_all THEN
    RETURN QUERY
    SELECT et.entity_id
    FROM entity_tags et
    WHERE et.entity_type = p_entity_type
      AND et.tag_id = ANY(p_tag_ids)
    GROUP BY et.entity_id
    HAVING COUNT(DISTINCT et.tag_id) = array_length(p_tag_ids, 1);
  ELSE
    RETURN QUERY
    SELECT DISTINCT et.entity_id
    FROM entity_tags et
    WHERE et.entity_type = p_entity_type
      AND et.tag_id = ANY(p_tag_ids);
  END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- Update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tag_definitions SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tag_definitions SET usage_count = GREATEST(0, usage_count - 1) WHERE id = OLD.tag_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tag_usage_count_trigger
  AFTER INSERT OR DELETE ON entity_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_tag_usage_count();

-- RLS Policies
ALTER TABLE category_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active categories" ON category_definitions FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage categories" ON category_definitions FOR ALL USING (has_role(auth.uid(), 'admin'));

ALTER TABLE tag_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active tags" ON tag_definitions FOR SELECT USING (is_active = true);
CREATE POLICY "Admins and editors can manage system tags" ON tag_definitions FOR ALL 
  USING (has_role(auth.uid(), 'admin') OR (has_role(auth.uid(), 'editor') AND tag_type = 'system'));
CREATE POLICY "Users can create custom tags" ON tag_definitions FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL AND tag_type = 'custom');

ALTER TABLE entity_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View tags on viewable entities" ON entity_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage all entity tags" ON entity_tags FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Editors can manage entity tags" ON entity_tags FOR ALL 
  USING (has_role(auth.uid(), 'editor') AND source IN ('manual', 'auto'));
CREATE POLICY "Partners can tag own entities" ON entity_tags FOR INSERT 
  WITH CHECK (has_role(auth.uid(), 'partner') AND source = 'manual');

ALTER TABLE tag_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view permissions" ON tag_permissions FOR SELECT USING (true);
CREATE POLICY "Admins can manage permissions" ON tag_permissions FOR ALL USING (has_role(auth.uid(), 'admin'));

ALTER TABLE tag_inheritance_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view inheritance rules" ON tag_inheritance_rules FOR SELECT USING (true);
CREATE POLICY "Admins can manage inheritance rules" ON tag_inheritance_rules FOR ALL USING (has_role(auth.uid(), 'admin'));

ALTER TABLE tag_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own suggestions" ON tag_suggestions FOR SELECT USING (true);
CREATE POLICY "System can manage suggestions" ON tag_suggestions FOR ALL USING (true);