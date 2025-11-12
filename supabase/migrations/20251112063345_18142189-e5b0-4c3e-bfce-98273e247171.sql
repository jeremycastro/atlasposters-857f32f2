-- Drop the incorrect foreign key constraint
ALTER TABLE public.artworks 
DROP CONSTRAINT IF EXISTS artworks_partner_id_fkey;

-- Add the correct foreign key constraint pointing to partners table
ALTER TABLE public.artworks 
ADD CONSTRAINT artworks_partner_id_fkey 
FOREIGN KEY (partner_id) 
REFERENCES public.partners(id) 
ON DELETE RESTRICT;