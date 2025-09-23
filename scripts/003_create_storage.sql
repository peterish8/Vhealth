-- Create storage bucket for medical files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medical-files', 'medical-files', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for medical files
CREATE POLICY "Doctors can upload medical files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'medical-files' AND
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE user_type = 'doctor'
    )
  );

CREATE POLICY "Users can view their own medical files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'medical-files' AND (
      -- Doctors can see files they uploaded
      auth.uid() IN (
        SELECT id FROM public.profiles WHERE user_type = 'doctor'
      ) OR
      -- Patients can see files in their records
      name LIKE CONCAT(auth.uid()::text, '/%')
    )
  );

CREATE POLICY "Doctors can update medical files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'medical-files' AND
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE user_type = 'doctor'
    )
  );

CREATE POLICY "Doctors can delete medical files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'medical-files' AND
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE user_type = 'doctor'
    )
  );
