-- Create emergency_access_logs table to track when doctors access patient emergency AI
CREATE TABLE IF NOT EXISTS emergency_access_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  doctor_name TEXT,
  doctor_specialization TEXT,
  doctor_hospital TEXT,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_emergency_access_patient_id ON emergency_access_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_emergency_access_doctor_id ON emergency_access_logs(doctor_id);
CREATE INDEX IF NOT EXISTS idx_emergency_access_accessed_at ON emergency_access_logs(accessed_at);

-- Add RLS policy
ALTER TABLE emergency_access_logs ENABLE ROW LEVEL SECURITY;

-- Policy for patients to see their own emergency access logs
CREATE POLICY "Patients can view their emergency access logs" ON emergency_access_logs
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM patients WHERE auth_user_id = auth.uid()
    )
  );

-- Policy for doctors to see logs of their emergency access
CREATE POLICY "Doctors can view their emergency access logs" ON emergency_access_logs
  FOR SELECT USING (
    doctor_id IN (
      SELECT id FROM doctors WHERE auth_user_id = auth.uid()
    )
  );

-- Policy for inserting emergency access logs (system use)
CREATE POLICY "Allow emergency access log creation" ON emergency_access_logs
  FOR INSERT WITH CHECK (true);