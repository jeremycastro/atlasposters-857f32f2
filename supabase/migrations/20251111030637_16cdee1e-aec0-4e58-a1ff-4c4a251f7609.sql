-- Add order_index column to project_tasks table
ALTER TABLE public.project_tasks 
ADD COLUMN order_index INTEGER;

-- Create index for efficient ordering queries
CREATE INDEX idx_project_tasks_milestone_order 
ON public.project_tasks(milestone_id, order_index);

-- Backfill existing tasks with sequential order values grouped by milestone_id
WITH ordered_tasks AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY milestone_id ORDER BY created_at) as new_order
  FROM public.project_tasks
  WHERE milestone_id IS NOT NULL
)
UPDATE public.project_tasks
SET order_index = ordered_tasks.new_order
FROM ordered_tasks
WHERE project_tasks.id = ordered_tasks.id;

-- Set order_index for tasks without milestone
UPDATE public.project_tasks
SET order_index = 0
WHERE milestone_id IS NULL AND order_index IS NULL;