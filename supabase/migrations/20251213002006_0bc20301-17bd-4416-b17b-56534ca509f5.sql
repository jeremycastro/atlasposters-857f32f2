-- Create a separate, highly restricted table for API credentials
CREATE TABLE IF NOT EXISTS public.shopify_store_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_store_id uuid NOT NULL REFERENCES public.shopify_stores(id) ON DELETE CASCADE,
  access_token_encrypted text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(shopify_store_id)
);

-- Enable RLS on credentials table
ALTER TABLE public.shopify_store_credentials ENABLE ROW LEVEL SECURITY;

-- ONLY admins can access credentials - no partner access
CREATE POLICY "Only admins can view credentials"
ON public.shopify_store_credentials
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can manage credentials"
ON public.shopify_store_credentials
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Migrate existing tokens to the new table
INSERT INTO public.shopify_store_credentials (shopify_store_id, access_token_encrypted)
SELECT id, access_token_encrypted 
FROM public.shopify_stores 
WHERE access_token_encrypted IS NOT NULL
ON CONFLICT (shopify_store_id) DO NOTHING;

-- Remove the token column from the main table (partners can no longer see it)
ALTER TABLE public.shopify_stores DROP COLUMN IF EXISTS access_token_encrypted;

-- Clean up duplicate policies on shopify_stores
DROP POLICY IF EXISTS "Admins can manage all shopify stores" ON public.shopify_stores;
DROP POLICY IF EXISTS "Partners can view own shopify stores" ON public.shopify_stores;