-- RLS Policies for partners table
CREATE POLICY "Admins can manage all partners" 
  ON public.partners FOR ALL 
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners can view own partner record" 
  ON public.partners FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.partner_contacts
      WHERE partner_contacts.partner_id = partners.id 
      AND partner_contacts.user_id = auth.uid()
    )
  );

-- RLS Policies for brands table
CREATE POLICY "Admins can manage all brands" 
  ON public.brands FOR ALL 
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners can view own brands" 
  ON public.brands FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.partner_contacts
      WHERE partner_contacts.partner_id = brands.partner_id 
      AND partner_contacts.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view active brands" 
  ON public.brands FOR SELECT 
  USING (is_active = true);

-- RLS Policies for agreements
CREATE POLICY "Admins can manage all agreements" 
  ON public.partner_agreements FOR ALL 
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners can view own agreements" 
  ON public.partner_agreements FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.partner_contacts
      WHERE partner_contacts.partner_id = partner_agreements.partner_id 
      AND partner_contacts.user_id = auth.uid()
    )
  );

-- RLS Policies for contacts
CREATE POLICY "Admins can manage all contacts" 
  ON public.partner_contacts FOR ALL 
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners can view own contacts" 
  ON public.partner_contacts FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.partner_contacts pc
      WHERE pc.partner_id = partner_contacts.partner_id 
      AND pc.user_id = auth.uid()
    )
  );

-- RLS Policies for addresses
CREATE POLICY "Admins can manage all addresses" 
  ON public.partner_addresses FOR ALL 
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners can view own addresses" 
  ON public.partner_addresses FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.partner_contacts
      WHERE partner_contacts.partner_id = partner_addresses.partner_id 
      AND partner_contacts.user_id = auth.uid()
    )
  );

-- RLS Policies for assets
CREATE POLICY "Admins can manage all partner assets" 
  ON public.partner_assets FOR ALL 
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners can view own assets" 
  ON public.partner_assets FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.partner_contacts
      WHERE partner_contacts.partner_id = partner_assets.partner_id 
      AND partner_contacts.user_id = auth.uid()
    )
  );

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('partner-documents', 'partner-documents', false) 
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Admins can upload partner documents" 
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'partner-documents' 
    AND has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can view all partner documents" 
  ON storage.objects FOR SELECT 
  USING (
    bucket_id = 'partner-documents' 
    AND has_role(auth.uid(), 'admin')
  );