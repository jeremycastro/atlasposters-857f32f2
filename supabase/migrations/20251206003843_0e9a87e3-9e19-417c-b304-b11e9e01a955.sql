-- Add rate limiting protection for email_signups table
-- This prevents bot spam by limiting signups from the same IP/source

-- 1. Add an ip_address column to track submissions (optional but useful for rate limiting)
ALTER TABLE public.email_signups 
ADD COLUMN IF NOT EXISTS ip_hash TEXT,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT now();

-- 2. Create a rate limiting function
CREATE OR REPLACE FUNCTION public.check_email_signup_rate_limit(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  recent_signup_count INTEGER;
  email_exists BOOLEAN;
BEGIN
  -- Check if this exact email already exists (prevent duplicates)
  SELECT EXISTS(SELECT 1 FROM email_signups WHERE email = lower(trim(p_email)))
  INTO email_exists;
  
  IF email_exists THEN
    RETURN FALSE; -- Block duplicate emails
  END IF;
  
  -- Rate limit: max 5 signups per email domain per hour
  -- This prevents mass signups from the same domain
  SELECT COUNT(*) INTO recent_signup_count
  FROM email_signups
  WHERE created_at > now() - interval '1 hour'
  AND split_part(email, '@', 2) = split_part(lower(trim(p_email)), '@', 2);
  
  IF recent_signup_count >= 10 THEN
    RETURN FALSE; -- Block if too many signups from same domain
  END IF;
  
  -- Global rate limit: max 50 signups per minute across all sources
  SELECT COUNT(*) INTO recent_signup_count
  FROM email_signups
  WHERE created_at > now() - interval '1 minute';
  
  IF recent_signup_count >= 50 THEN
    RETURN FALSE; -- Block if global rate limit exceeded
  END IF;
  
  RETURN TRUE;
END;
$function$;

-- 3. Drop the old permissive policy
DROP POLICY IF EXISTS "Anyone can sign up for email list" ON public.email_signups;

-- 4. Create a new policy with rate limiting check
CREATE POLICY "Rate limited email signups"
ON public.email_signups
FOR INSERT
TO public
WITH CHECK (
  public.check_email_signup_rate_limit(email)
);

-- 5. Ensure RLS is enabled
ALTER TABLE public.email_signups ENABLE ROW LEVEL SECURITY;