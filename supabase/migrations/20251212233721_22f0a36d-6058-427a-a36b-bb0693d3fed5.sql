-- Restrict partner_contacts visibility to admins only
-- Remove editor access to prevent contact harvesting

DROP POLICY IF EXISTS "Editors can view all contacts" ON public.partner_contacts;

-- Keep existing policies:
-- 1. "Admins can manage all contacts" - admins have full access
-- 2. "Partners can view own contact record" - users can see their own record
-- 3. "Partners can view contacts in their organization" - partners can see their org contacts