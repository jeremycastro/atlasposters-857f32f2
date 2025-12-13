-- Add admin-only SELECT policy for email signups
CREATE POLICY "Admins can view email signups"
ON public.email_signups
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));