
-- Drop existing policies that conflict before recreating
DROP POLICY IF EXISTS "Admins can manage all agreements" ON public.partner_agreements;
DROP POLICY IF EXISTS "Partners can view own agreements" ON public.partner_agreements;
DROP POLICY IF EXISTS "Admins can manage all shopify stores" ON public.shopify_stores;
DROP POLICY IF EXISTS "Partners can view own shopify stores" ON public.shopify_stores;
DROP POLICY IF EXISTS "Admins can manage all addresses" ON public.partner_addresses;
DROP POLICY IF EXISTS "Partners can view own addresses" ON public.partner_addresses;
DROP POLICY IF EXISTS "Editors can view addresses for managed partners" ON public.partner_addresses;

-- Recreate restrictive policy for partner_agreements
CREATE POLICY "Admins can manage all agreements"
ON public.partner_agreements
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners can view own agreements"
ON public.partner_agreements
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.partner_contacts pc
    WHERE pc.partner_id = partner_agreements.partner_id
    AND pc.user_id = auth.uid()
  )
);

-- Shopify stores - admins and store owners only
CREATE POLICY "Admins can manage all shopify stores"
ON public.shopify_stores
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners can view own shopify stores"
ON public.shopify_stores
FOR SELECT
USING (partner_id = auth.uid());

-- Partner addresses - admins, partners, and editors for managed partners
CREATE POLICY "Admins can manage all addresses"
ON public.partner_addresses
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners can view own addresses"
ON public.partner_addresses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.partner_contacts pc
    WHERE pc.partner_id = partner_addresses.partner_id
    AND pc.user_id = auth.uid()
  )
);

CREATE POLICY "Editors can view addresses for managed partners"
ON public.partner_addresses
FOR SELECT
USING (
  has_role(auth.uid(), 'editor') AND
  EXISTS (
    SELECT 1 FROM public.partners p
    WHERE p.id = partner_addresses.partner_id
    AND p.atlas_manager_id = auth.uid()
  )
);
