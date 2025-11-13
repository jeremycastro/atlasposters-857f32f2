-- Add reference_number column to project_tasks table
ALTER TABLE project_tasks 
ADD COLUMN reference_number TEXT;

-- Create unique index
CREATE UNIQUE INDEX project_tasks_reference_number_idx 
ON project_tasks(reference_number);

-- Create a sequence for task numbers
CREATE SEQUENCE IF NOT EXISTS task_reference_seq START 1;

-- Function to generate next reference number
CREATE OR REPLACE FUNCTION generate_task_reference()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  ref_num TEXT;
BEGIN
  next_num := nextval('task_reference_seq');
  ref_num := 'TASK-' || LPAD(next_num::TEXT, 3, '0');
  RETURN ref_num;
END;
$$ LANGUAGE plpgsql;

-- Backfill existing tasks with reference numbers based on creation order
WITH numbered_tasks AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) as task_num
  FROM project_tasks
  WHERE reference_number IS NULL
)
UPDATE project_tasks pt
SET reference_number = 'TASK-' || LPAD(nt.task_num::TEXT, 3, '0')
FROM numbered_tasks nt
WHERE pt.id = nt.id;

-- Update the sequence to continue from the highest number
SELECT setval('task_reference_seq', 
  (SELECT COALESCE(MAX(CAST(SUBSTRING(reference_number FROM 6) AS INTEGER)), 0) 
   FROM project_tasks WHERE reference_number IS NOT NULL), 
  true);

-- Make reference_number NOT NULL after backfill
ALTER TABLE project_tasks 
ALTER COLUMN reference_number SET NOT NULL;

-- Create trigger function to auto-generate reference number on insert
CREATE OR REPLACE FUNCTION set_task_reference_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_number IS NULL THEN
    NEW.reference_number := generate_task_reference();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate reference number on insert
CREATE TRIGGER task_reference_number_trigger
  BEFORE INSERT ON project_tasks
  FOR EACH ROW
  EXECUTE FUNCTION set_task_reference_number();