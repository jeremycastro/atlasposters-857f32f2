-- Create brand-assets storage bucket (public for displaying logos on website)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'brand-assets',
  'brand-assets',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
);

-- RLS Policies for brand-assets bucket

-- Anyone can view brand assets (public bucket)
CREATE POLICY "Anyone can view brand assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-assets');

-- Admins can upload brand assets
CREATE POLICY "Admins can upload brand assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'brand-assets' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Admins can update brand assets
CREATE POLICY "Admins can update brand assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'brand-assets' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Admins can delete brand assets
CREATE POLICY "Admins can delete brand assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'brand-assets' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Partners can upload assets for their own brands
CREATE POLICY "Partners can upload own brand assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'brand-assets'
  AND (storage.foldername(name))[1] IN (
    SELECT b.id::text 
    FROM brands b
    WHERE EXISTS (
      SELECT 1 FROM partner_contacts pc
      WHERE pc.partner_id = b.partner_id 
      AND pc.user_id = auth.uid()
    )
  )
);

-- Partners can update their own brand assets
CREATE POLICY "Partners can update own brand assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'brand-assets'
  AND (storage.foldername(name))[1] IN (
    SELECT b.id::text 
    FROM brands b
    WHERE EXISTS (
      SELECT 1 FROM partner_contacts pc
      WHERE pc.partner_id = b.partner_id 
      AND pc.user_id = auth.uid()
    )
  )
);

-- Partners can delete their own brand assets
CREATE POLICY "Partners can delete own brand assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'brand-assets'
  AND (storage.foldername(name))[1] IN (
    SELECT b.id::text 
    FROM brands b
    WHERE EXISTS (
      SELECT 1 FROM partner_contacts pc
      WHERE pc.partner_id = b.partner_id 
      AND pc.user_id = auth.uid()
    )
  )
);