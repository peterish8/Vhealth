-- Allow patients to update their own password
CREATE POLICY "Patients can update own password" ON patients
  FOR UPDATE TO authenticated USING (auth_user_id = auth.uid()) WITH CHECK (auth_user_id = auth.uid());