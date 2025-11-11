-- Add brand identity fields to brands table
ALTER TABLE public.brands
ADD COLUMN logo_url text,
ADD COLUMN primary_color text,
ADD COLUMN secondary_color text,
ADD COLUMN accent_color text,
ADD COLUMN tagline text,
ADD COLUMN brand_story text,
ADD COLUMN website_url text,
ADD COLUMN social_links jsonb DEFAULT '{}'::jsonb,
ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;

-- Add comments for documentation
COMMENT ON COLUMN public.brands.logo_url IS 'URL to brand logo image file';
COMMENT ON COLUMN public.brands.primary_color IS 'Primary brand color (hex format)';
COMMENT ON COLUMN public.brands.secondary_color IS 'Secondary brand color (hex format)';
COMMENT ON COLUMN public.brands.accent_color IS 'Accent brand color (hex format)';
COMMENT ON COLUMN public.brands.tagline IS 'Brand tagline or slogan';
COMMENT ON COLUMN public.brands.brand_story IS 'Brand story or description for landing pages';
COMMENT ON COLUMN public.brands.website_url IS 'Brand website URL';
COMMENT ON COLUMN public.brands.social_links IS 'JSON object with social media links';
COMMENT ON COLUMN public.brands.metadata IS 'Additional brand metadata for landing pages';

-- Create index for brand lookups by partner
CREATE INDEX idx_brands_partner_id ON public.brands(partner_id) WHERE is_active = true;

-- Create index for artwork brand lookups
CREATE INDEX idx_artworks_brand_id ON public.artworks(brand_id) WHERE status = 'active';