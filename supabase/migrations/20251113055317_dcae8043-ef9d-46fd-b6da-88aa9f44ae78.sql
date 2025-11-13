-- Set up tag inheritance rules for brand to artwork cascade
-- This ensures when you tag a brand, all its artworks inherit those tags

-- First, check if tag_inheritance_rules table needs the rules
INSERT INTO tag_inheritance_rules (
  from_entity_type,
  to_entity_type,
  category_id,
  is_active
)
SELECT 
  'brand',
  'artwork',
  cd.id,
  true
FROM category_definitions cd
WHERE 'artwork' = ANY(cd.scope) 
  AND 'brand' = ANY(cd.scope)
  AND NOT EXISTS (
    SELECT 1 FROM tag_inheritance_rules tir 
    WHERE tir.from_entity_type = 'brand' 
      AND tir.to_entity_type = 'artwork' 
      AND tir.category_id = cd.id
  )
ON CONFLICT DO NOTHING;

-- Create a function to manually sync existing brand tags to artworks
-- This is useful for applying inheritance retroactively
CREATE OR REPLACE FUNCTION sync_brand_tags_to_artworks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- For each brand tag, create inherited tags on all artworks under that brand
  INSERT INTO entity_tags (entity_type, entity_id, tag_id, source, inherited_from_type, inherited_from_id)
  SELECT 
    'artwork',
    a.id,
    et.tag_id,
    'inherited',
    'brand',
    et.entity_id
  FROM entity_tags et
  JOIN artworks a ON a.brand_id = et.entity_id::uuid
  JOIN tag_definitions td ON et.tag_id = td.id
  JOIN tag_inheritance_rules tir ON tir.category_id = td.category_id
  WHERE et.entity_type = 'brand'
    AND et.source = 'manual'
    AND tir.from_entity_type = 'brand'
    AND tir.to_entity_type = 'artwork'
    AND tir.is_active = true
  ON CONFLICT (entity_type, entity_id, tag_id) DO NOTHING;
END;
$$;

-- Run the sync function to apply inheritance to existing data
SELECT sync_brand_tags_to_artworks();

-- Create a function to cascade tag removal from brands to artworks
CREATE OR REPLACE FUNCTION remove_inherited_brand_tags()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- When a brand tag is removed, remove all inherited instances from artworks
  IF OLD.entity_type = 'brand' AND OLD.source = 'manual' THEN
    DELETE FROM entity_tags
    WHERE entity_type = 'artwork'
      AND tag_id = OLD.tag_id
      AND source = 'inherited'
      AND inherited_from_type = 'brand'
      AND inherited_from_id = OLD.entity_id
      AND entity_id IN (
        SELECT id FROM artworks WHERE brand_id = OLD.entity_id::uuid
      );
  END IF;
  RETURN OLD;
END;
$$;

-- Create trigger for tag removal cascade
DROP TRIGGER IF EXISTS cascade_brand_tag_removal ON entity_tags;
CREATE TRIGGER cascade_brand_tag_removal
  BEFORE DELETE ON entity_tags
  FOR EACH ROW
  EXECUTE FUNCTION remove_inherited_brand_tags();

-- Create a function to handle brand changes on artworks
-- When an artwork's brand changes, update inherited tags
CREATE OR REPLACE FUNCTION update_artwork_brand_tags()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If brand_id changed, remove old inherited tags and add new ones
  IF OLD.brand_id IS DISTINCT FROM NEW.brand_id THEN
    -- Remove inherited tags from old brand
    IF OLD.brand_id IS NOT NULL THEN
      DELETE FROM entity_tags
      WHERE entity_type = 'artwork'
        AND entity_id = NEW.id
        AND source = 'inherited'
        AND inherited_from_type = 'brand'
        AND inherited_from_id = OLD.brand_id;
    END IF;
    
    -- Add inherited tags from new brand
    IF NEW.brand_id IS NOT NULL THEN
      INSERT INTO entity_tags (entity_type, entity_id, tag_id, source, inherited_from_type, inherited_from_id)
      SELECT 
        'artwork',
        NEW.id,
        et.tag_id,
        'inherited',
        'brand',
        et.entity_id
      FROM entity_tags et
      JOIN tag_definitions td ON et.tag_id = td.id
      JOIN tag_inheritance_rules tir ON tir.category_id = td.category_id
      WHERE et.entity_type = 'brand'
        AND et.entity_id = NEW.brand_id
        AND et.source = 'manual'
        AND tir.from_entity_type = 'brand'
        AND tir.to_entity_type = 'artwork'
        AND tir.is_active = true
      ON CONFLICT (entity_type, entity_id, tag_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for brand changes on artworks
DROP TRIGGER IF EXISTS sync_artwork_brand_tags ON artworks;
CREATE TRIGGER sync_artwork_brand_tags
  AFTER UPDATE ON artworks
  FOR EACH ROW
  WHEN (OLD.brand_id IS DISTINCT FROM NEW.brand_id)
  EXECUTE FUNCTION update_artwork_brand_tags();