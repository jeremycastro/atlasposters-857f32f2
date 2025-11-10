-- Create email_signups table for Coming Soon page
CREATE TABLE public.email_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT DEFAULT 'coming_soon',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.email_signups ENABLE ROW LEVEL SECURITY;

-- Public can insert their email
CREATE POLICY "Anyone can sign up for email list"
ON public.email_signups
FOR INSERT
TO public
WITH CHECK (true);

-- Index for fast email lookups
CREATE INDEX idx_email_signups_email ON public.email_signups(email);
CREATE INDEX idx_email_signups_created_at ON public.email_signups(created_at DESC);