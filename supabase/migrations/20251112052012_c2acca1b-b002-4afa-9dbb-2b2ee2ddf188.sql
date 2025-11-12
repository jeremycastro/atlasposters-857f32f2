
-- Create function to automatically update milestone status based on deliverables
CREATE OR REPLACE FUNCTION public.auto_update_milestone_status()
RETURNS TRIGGER
LANGUAGE plpgsql
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

-- Create trigger on roadmap_milestones table
DROP TRIGGER IF EXISTS trigger_auto_update_milestone_status ON public.roadmap_milestones;

CREATE TRIGGER trigger_auto_update_milestone_status
  BEFORE UPDATE OF deliverables
  ON public.roadmap_milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_update_milestone_status();

-- Also update the status when we modify it (to allow manual overrides if needed)
COMMENT ON FUNCTION public.auto_update_milestone_status() IS 'Automatically updates milestone status to completed when all deliverables are checked, and back to in_progress when any are unchecked';
