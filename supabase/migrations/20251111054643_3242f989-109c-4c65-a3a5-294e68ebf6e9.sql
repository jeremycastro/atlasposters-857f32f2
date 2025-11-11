-- Add group_order column to track the order of groups/sections
ALTER TABLE public.admin_navigation
ADD COLUMN group_order INTEGER DEFAULT 0;

-- Create index for group ordering
CREATE INDEX idx_admin_navigation_group_order ON public.admin_navigation(group_order, order_index);

-- Set initial group orders based on existing groups
UPDATE public.admin_navigation
SET group_order = CASE group_name
  WHEN 'Overview' THEN 1
  WHEN 'Content' THEN 2
  WHEN 'Management' THEN 3
  WHEN 'Settings' THEN 4
  ELSE 99
END;