-- Add new columns to partner_contacts table
ALTER TABLE public.partner_contacts
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT,
ADD COLUMN country_code TEXT DEFAULT '+1',
ADD COLUMN mobile_phone TEXT;

-- Migrate existing full_name data to first_name (temporary)
UPDATE public.partner_contacts
SET first_name = full_name
WHERE full_name IS NOT NULL;

-- Migrate existing phone data to mobile_phone
UPDATE public.partner_contacts
SET mobile_phone = phone
WHERE phone IS NOT NULL;

-- Drop old columns (keeping full_name as NOT NULL will be handled by making it a generated column)
ALTER TABLE public.partner_contacts
DROP COLUMN phone;

-- Now convert full_name to a generated column
ALTER TABLE public.partner_contacts
DROP COLUMN full_name;

ALTER TABLE public.partner_contacts
ADD COLUMN full_name TEXT GENERATED ALWAYS AS (
  CASE
    WHEN first_name IS NOT NULL AND last_name IS NOT NULL THEN first_name || ' ' || last_name
    WHEN first_name IS NOT NULL THEN first_name
    WHEN last_name IS NOT NULL THEN last_name
    ELSE ''
  END
) STORED;

-- Make first_name required
ALTER TABLE public.partner_contacts
ALTER COLUMN first_name SET NOT NULL;