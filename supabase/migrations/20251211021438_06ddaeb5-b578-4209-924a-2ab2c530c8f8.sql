-- Fix partner_contacts table RLS policies - convert from restrictive to permissive
-- Drop existing policies that are incorrectly set as restrictive
DROP POLICY IF EXISTS "Admins can manage all contacts" ON public.partner_contacts;
DROP POLICY IF EXISTS "Partners can view contacts where they are listed" ON public.partner_contacts;

-- Create proper PERMISSIVE policies that require authentication

-- Admins can manage all contacts (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can manage all contacts" 
ON public.partner_contacts 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Partners can view contacts where they are the linked user
CREATE POLICY "Partners can view own contact record" 
ON public.partner_contacts 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Partners can also view contacts for their own partner organization
CREATE POLICY "Partners can view contacts in their organization" 
ON public.partner_contacts 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.partner_contacts pc 
    WHERE pc.user_id = auth.uid() 
    AND pc.partner_id = partner_contacts.partner_id
  )
);

-- Editors can view all contacts for management
CREATE POLICY "Editors can view all contacts" 
ON public.partner_contacts 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'editor'::app_role));