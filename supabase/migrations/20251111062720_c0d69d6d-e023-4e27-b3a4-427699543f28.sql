-- Drop problematic recursive policies
DROP POLICY IF EXISTS "Partners can view own contacts" ON public.partner_contacts;
DROP POLICY IF EXISTS "Partners can view own brands" ON public.brands;
DROP POLICY IF EXISTS "Partners can view own agreements" ON public.partner_agreements;
DROP POLICY IF EXISTS "Partners can view own addresses" ON public.partner_addresses;
DROP POLICY IF EXISTS "Partners can view own assets" ON public.partner_assets;

-- Recreate policies without recursion
-- For partner_contacts: Partners can view contacts where they ARE the contact (user_id match)
CREATE POLICY "Partners can view contacts where they are listed" 
  ON public.partner_contacts FOR SELECT 
  USING (user_id = auth.uid());

-- For brands: Check partner relationship through partners table
CREATE POLICY "Partners can view own brands" 
  ON public.brands FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.partners
      WHERE partners.id = brands.partner_id 
      AND EXISTS (
        SELECT 1 FROM public.partner_contacts pc
        WHERE pc.partner_id = partners.id 
        AND pc.user_id = auth.uid()
      )
    )
  );

-- For agreements: Check through partners table
CREATE POLICY "Partners can view own agreements" 
  ON public.partner_agreements FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.partners
      WHERE partners.id = partner_agreements.partner_id 
      AND EXISTS (
        SELECT 1 FROM public.partner_contacts pc
        WHERE pc.partner_id = partners.id 
        AND pc.user_id = auth.uid()
      )
    )
  );

-- For addresses: Check through partners table
CREATE POLICY "Partners can view own addresses" 
  ON public.partner_addresses FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.partners
      WHERE partners.id = partner_addresses.partner_id 
      AND EXISTS (
        SELECT 1 FROM public.partner_contacts pc
        WHERE pc.partner_id = partners.id 
        AND pc.user_id = auth.uid()
      )
    )
  );

-- For assets: Check through partners table
CREATE POLICY "Partners can view own assets" 
  ON public.partner_assets FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.partners
      WHERE partners.id = partner_assets.partner_id 
      AND EXISTS (
        SELECT 1 FROM public.partner_contacts pc
        WHERE pc.partner_id = partners.id 
        AND pc.user_id = auth.uid()
      )
    )
  );