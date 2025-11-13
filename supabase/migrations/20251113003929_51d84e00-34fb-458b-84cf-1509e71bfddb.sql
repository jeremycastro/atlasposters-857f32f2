-- Add is_archived field to brand_story_timeline table
ALTER TABLE public.brand_story_timeline 
ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT false;

-- Add index for better query performance
CREATE INDEX idx_brand_story_timeline_is_archived ON public.brand_story_timeline(is_archived);