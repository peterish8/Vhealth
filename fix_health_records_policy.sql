-- Drop existing policy and create a new one that works
DROP POLICY IF EXISTS "Doctors can insert health records" ON health_records;

-- Create a new policy that allows doctors to insert records
CREATE POLICY "Doctors can insert health records" ON health_records
  FOR INSERT WITH CHECK (
    doctor_id IN (
      SELECT id FROM doctors WHERE auth_user_id = auth.uid()
    )
  );