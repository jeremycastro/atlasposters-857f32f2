-- Fix profiles table RLS: Remove overly permissive partner policy
-- Partners should only be able to view their own profile, not all active partner profiles

-- Drop the problematic policy that allows partners to view all active partner profiles
DROP POLICY IF EXISTS "Partners can view active partner profiles" ON public.profiles;

-- The existing policies are sufficient:
-- 1. "Users can view own profile" - users can see their own profile
-- 2. "Users can update own profile" - users can update their own profile  
-- 3. "Admins can view all profiles" - admins have full access
-- 4. "Admins can update any profile" - admins can update any profile
-- 5. "Editors can view all profiles" - editors need to see profiles for management

-- No need to add a new partner policy - partners should only access their own profile
-- via the existing "Users can view own profile" policy which checks (auth.uid() = id)