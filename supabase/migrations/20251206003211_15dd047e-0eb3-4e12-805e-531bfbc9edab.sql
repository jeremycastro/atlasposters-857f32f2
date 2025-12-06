-- Fix remaining functions missing search_path

-- 1. update_file_tags_updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_file_tags_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 2. update_tag_usage_count trigger function
CREATE OR REPLACE FUNCTION public.update_tag_usage_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tag_definitions SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tag_definitions SET usage_count = GREATEST(0, usage_count - 1) WHERE id = OLD.tag_id;
  END IF;
  RETURN NULL;
END;
$function$;