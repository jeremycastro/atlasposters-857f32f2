-- Fix profiles table RLS policies - convert from restrictive to permissive
-- Drop existing SELECT policies that are incorrectly set as restrictive
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Editors can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Partners can view partner profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create proper PERMISSIVE SELECT policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Editors can view all profiles
CREATE POLICY "Editors can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'editor'::app_role));

-- Partners can view other active partner profiles (for collaboration features)
CREATE POLICY "Partners can view active partner profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  public.has_role(auth.uid(), 'partner'::app_role) 
  AND partner_status = 'active'
);

-- Also fix the UPDATE policies
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));