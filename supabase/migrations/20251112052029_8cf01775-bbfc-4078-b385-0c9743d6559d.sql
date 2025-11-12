
-- Fix search_path security warning for the auto_update_milestone_status function
CREATE OR REPLACE FUNCTION public.auto_update_milestone_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deliverable jsonb;
  all_completed boolean := true;
  has_deliverables boolean := false;
BEGIN
  -- Check if deliverables exist and are not empty
  IF NEW.deliverables IS NOT NULL AND jsonb_array_length(NEW.deliverables) > 0 THEN
    has_deliverables := true;
    
    -- Loop through each deliverable to check completion status
    FOR deliverable IN SELECT * FROM jsonb_array_elements(NEW.deliverables)
    LOOP
      -- If any deliverable is not completed, set flag to false
      IF NOT (deliverable->>'completed')::boolean THEN
        all_completed := false;
        EXIT; -- Exit loop early since we found an incomplete one
      END IF;
    END LOOP;
    
    -- Update status based on completion
    IF all_completed THEN
      NEW.status := 'completed';
    ELSE
      -- Only set to in_progress if not already completed or not_started
      IF NEW.status = 'completed' THEN
        NEW.status := 'in_progress';
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;
