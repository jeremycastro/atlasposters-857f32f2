-- Fix Function Search Path Mutable security warning
-- Add SET search_path TO 'public' to all functions missing it

-- 1. apply_tag_inheritance trigger function
CREATE OR REPLACE FUNCTION public.apply_tag_inheritance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
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
$function$;

-- 2. build_full_sku function
CREATE OR REPLACE FUNCTION public.build_full_sku(p_asc_code text, p_product_type_code text, p_variant_code text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN p_asc_code || '-' || p_product_type_code || '-' || p_variant_code;
END;
$function$;

-- 3. create_file_version function
CREATE OR REPLACE FUNCTION public.create_file_version(p_original_file_id uuid, p_new_file_data jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_new_file_id UUID;
  v_next_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1 INTO v_next_version
  FROM artwork_files
  WHERE artwork_id = (SELECT artwork_id FROM artwork_files WHERE id = p_original_file_id);
  
  UPDATE artwork_files
  SET is_latest = false
  WHERE id = p_original_file_id;
  
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
  
  UPDATE artwork_files
  SET replaced_by = v_new_file_id
  WHERE id = p_original_file_id;
  
  RETURN v_new_file_id;
END;
$function$;

-- 4. generate_next_asc function
CREATE OR REPLACE FUNCTION public.generate_next_asc()
RETURNS text
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
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
$function$;

-- 5. generate_task_reference function
CREATE OR REPLACE FUNCTION public.generate_task_reference()
RETURNS text
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  next_num INTEGER;
  ref_num TEXT;
BEGIN
  next_num := nextval('task_reference_seq');
  ref_num := 'TASK-' || LPAD(next_num::TEXT, 3, '0');
  RETURN ref_num;
END;
$function$;

-- 6. get_entity_tags function
CREATE OR REPLACE FUNCTION public.get_entity_tags(p_entity_type text, p_entity_id uuid)
RETURNS TABLE(tag_id uuid, category_key text, category_name text, tag_key text, tag_name text, tag_type text, source text, inherited_from_type text, inherited_from_id uuid, confidence_score numeric)
LANGUAGE plpgsql
STABLE
SET search_path TO 'public'
AS $function$
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
$function$;

-- 7. get_print_file_suggestions function
CREATE OR REPLACE FUNCTION public.get_print_file_suggestions(p_artwork_id uuid, p_variant_codes text[])
RETURNS TABLE(file_id uuid, file_name text, tags jsonb, match_score integer, match_reasons text[])
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_artwork_asc text;
BEGIN
  SELECT asc_code INTO v_artwork_asc
  FROM artworks
  WHERE id = p_artwork_id;

  RETURN QUERY
  WITH parsed_files AS (
    SELECT 
      af.id,
      af.file_name,
      af.tags,
      af.is_primary,
      af.is_latest,
      (regexp_matches(af.file_name, '([0-9]{2}[A-Z][0-9]{3})-([A-Z]{3})(?:-([0-9]{2}))?(?:-([0-9]{2}))?(?:-([0-9]{2}))?[_\.]', 'i'))[1] AS parsed_asc,
      (regexp_matches(af.file_name, '([0-9]{2}[A-Z][0-9]{3})-([A-Z]{3})(?:-([0-9]{2}))?(?:-([0-9]{2}))?(?:-([0-9]{2}))?[_\.]', 'i'))[2] AS parsed_type,
      (regexp_matches(af.file_name, '([0-9]{2}[A-Z][0-9]{3})-([A-Z]{3})(?:-([0-9]{2}))?(?:-([0-9]{2}))?(?:-([0-9]{2}))?[_\.]', 'i'))[3] AS parsed_var1,
      (regexp_matches(af.file_name, '([0-9]{2}[A-Z][0-9]{3})-([A-Z]{3})(?:-([0-9]{2}))?(?:-([0-9]{2}))?(?:-([0-9]{2}))?[_\.]', 'i'))[4] AS parsed_var2,
      (regexp_matches(af.file_name, '([0-9]{2}[A-Z][0-9]{3})-([A-Z]{3})(?:-([0-9]{2}))?(?:-([0-9]{2}))?(?:-([0-9]{2}))?[_\.]', 'i'))[5] AS parsed_var3
    FROM artwork_files af
    WHERE 
      af.artwork_id = p_artwork_id
      AND af.file_type = 'original'
      AND af.is_latest = true
      AND af.file_name ~* '([0-9]{2}[A-Z][0-9]{3})-([A-Z]{3})'
  ),
  scored_files AS (
    SELECT 
      pf.id,
      pf.file_name,
      pf.tags,
      pf.parsed_asc,
      pf.parsed_type,
      pf.parsed_var1,
      pf.parsed_var2,
      pf.parsed_var3,
      (
        CASE WHEN pf.is_primary THEN 10 ELSE 0 END +
        CASE WHEN pf.is_latest THEN 5 ELSE 0 END +
        CASE WHEN pf.parsed_asc IS NOT NULL THEN
          CASE 
            WHEN pf.parsed_asc = v_artwork_asc THEN 50
            ELSE 20
          END
        ELSE 0 END +
        CASE 
          WHEN pf.parsed_var3 IS NOT NULL THEN 30
          WHEN pf.parsed_var2 IS NOT NULL THEN 20
          WHEN pf.parsed_var1 IS NOT NULL THEN 10
          ELSE 5
        END
      ) AS calc_score
    FROM parsed_files pf
  )
  SELECT 
    sf.id,
    sf.file_name,
    sf.tags,
    sf.calc_score::INTEGER,
    ARRAY_REMOVE(ARRAY[
      CASE WHEN sf.parsed_asc = v_artwork_asc 
        THEN 'Matches artwork ASC: ' || v_artwork_asc
        ELSE 'Different ASC: ' || sf.parsed_asc || ' (artwork: ' || v_artwork_asc || ')'
      END,
      CASE WHEN sf.parsed_type IS NOT NULL 
        THEN 'Product type: ' || sf.parsed_type 
        ELSE NULL 
      END,
      CASE 
        WHEN sf.parsed_var3 IS NOT NULL THEN 'Exact 3D variant: ' || sf.parsed_var1 || '-' || sf.parsed_var2 || '-' || sf.parsed_var3
        WHEN sf.parsed_var2 IS NOT NULL THEN '2D variant group: ' || sf.parsed_var1 || '-' || sf.parsed_var2 || '-XX'
        WHEN sf.parsed_var1 IS NOT NULL THEN 'VAR1 family: ' || sf.parsed_var1 || '-XX-XX'
        ELSE 'Product-level match: all variants'
      END
    ], NULL) AS match_reasons
  FROM scored_files sf
  WHERE sf.parsed_asc IS NOT NULL
  ORDER BY sf.calc_score DESC, sf.file_name;
END;
$function$;

-- 8. remove_inherited_brand_tags function
CREATE OR REPLACE FUNCTION public.remove_inherited_brand_tags()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
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
$function$;

-- 9. search_by_tags function
CREATE OR REPLACE FUNCTION public.search_by_tags(p_entity_type text, p_tag_ids uuid[], p_match_all boolean DEFAULT false)
RETURNS TABLE(entity_id uuid)
LANGUAGE plpgsql
STABLE
SET search_path TO 'public'
AS $function$
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
$function$;

-- 10. set_task_reference_number trigger function
CREATE OR REPLACE FUNCTION public.set_task_reference_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.reference_number IS NULL THEN
    NEW.reference_number := generate_task_reference();
  END IF;
  RETURN NEW;
END;
$function$;

-- 11. sync_brand_tags_to_artworks function
CREATE OR REPLACE FUNCTION public.sync_brand_tags_to_artworks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
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
$function$;

-- 12. update_artwork_brand_tags trigger function
CREATE OR REPLACE FUNCTION public.update_artwork_brand_tags()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF OLD.brand_id IS DISTINCT FROM NEW.brand_id THEN
    IF OLD.brand_id IS NOT NULL THEN
      DELETE FROM entity_tags
      WHERE entity_type = 'artwork'
        AND entity_id = NEW.id
        AND source = 'inherited'
        AND inherited_from_type = 'brand'
        AND inherited_from_id = OLD.brand_id::text;
    END IF;
    
    IF NEW.brand_id IS NOT NULL THEN
      INSERT INTO entity_tags (entity_type, entity_id, tag_id, source, inherited_from_type, inherited_from_id)
      SELECT 
        'artwork',
        NEW.id,
        et.tag_id,
        'inherited',
        'brand',
        NEW.brand_id::text
      FROM entity_tags et
      JOIN tag_definitions td ON et.tag_id = td.id
      JOIN tag_inheritance_rules tir ON tir.category_id = td.category_id
      WHERE et.entity_type = 'brand'
        AND et.entity_id = NEW.brand_id::text
        AND et.source = 'manual'
        AND tir.from_entity_type = 'brand'
        AND tir.to_entity_type = 'artwork'
        AND tir.is_active = true
      ON CONFLICT (entity_type, entity_id, tag_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 13. update_partner_contact_full_name trigger function
CREATE OR REPLACE FUNCTION public.update_partner_contact_full_name()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.full_name := TRIM(CONCAT(NEW.first_name, ' ', COALESCE(NEW.last_name, '')));
  RETURN NEW;
END;
$function$;

-- 14. update_updated_at_column trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;