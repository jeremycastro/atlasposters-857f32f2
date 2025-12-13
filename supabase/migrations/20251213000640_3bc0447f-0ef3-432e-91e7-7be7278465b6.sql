-- Remove editor access to all profiles - only admins should see all profile data
DROP POLICY IF EXISTS "Editors can view all profiles" ON public.profiles;