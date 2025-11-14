-- Drop and recreate the print file suggestions function with filename parsing
DROP FUNCTION IF EXISTS public.get_print_file_suggestions(uuid, text[]);

CREATE OR REPLACE FUNCTION public.get_print_file_suggestions(
  p_artwork_id uuid, 
  p_variant_codes text[]
)
RETURNS TABLE(
  file_id uuid, 
  file_name text, 
  tags jsonb, 
  match_score integer, 
  match_reasons text[]
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
  v_artwork_asc text;
BEGIN
  -- Get artwork's ASC code
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
      -- Parse SKU from filename using regex
      -- Pattern: {ASC}-{TYPE}(-{VAR1})?(-{VAR2})?(-{VAR3})?[_\.]
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
      -- Calculate match score
      (
        CASE WHEN pf.is_primary THEN 10 ELSE 0 END +
        CASE WHEN pf.is_latest THEN 5 ELSE 0 END +
        -- SKU matching scores
        CASE WHEN pf.parsed_asc IS NOT NULL THEN
          CASE 
            -- Exact match with artwork ASC
            WHEN pf.parsed_asc = v_artwork_asc THEN 50
            -- Partial match (different ASC but has structure)
            ELSE 20
          END
        ELSE 0 END +
        -- Variant specificity scores
        CASE 
          WHEN pf.parsed_var3 IS NOT NULL THEN 30  -- 3D specific
          WHEN pf.parsed_var2 IS NOT NULL THEN 20  -- 2D specific
          WHEN pf.parsed_var1 IS NOT NULL THEN 10  -- 1D specific
          ELSE 5 -- Product level only
        END
      ) AS calc_score
    FROM parsed_files pf
  )
  SELECT 
    sf.id,
    sf.file_name,
    sf.tags,
    sf.calc_score::INTEGER,
    -- Build match reasons array
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
$$;