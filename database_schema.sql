-- VHealth Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Patients table
CREATE TABLE patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vh_id TEXT UNIQUE NOT NULL,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  contact_number TEXT,
  address TEXT,
  blood_group TEXT CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  allergies TEXT[], -- Array of allergies
  chronic_conditions TEXT[], -- Array of chronic conditions
  current_medications TEXT,
  emergency_contact_name TEXT,
  emergency_contact_number TEXT,
  insurance_provider TEXT,
  insurance_policy_no TEXT,
  profile_picture_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doctors table  
CREATE TABLE doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doc_id TEXT UNIQUE NOT NULL,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  hospital TEXT,
  license_no TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency logs table
CREATE TABLE emergency_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  ai_summary JSONB,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_logs ENABLE ROW LEVEL SECURITY;

-- Patients can only see their own data
CREATE POLICY "Patients can view own data" ON patients
  FOR SELECT USING (auth_user_id = auth.uid());

-- Doctors can view all patients (for emergency access)
CREATE POLICY "Doctors can view patients" ON patients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM doctors WHERE auth_user_id = auth.uid()
    )
  );

-- Reports policies
CREATE POLICY "Patients can view own reports" ON reports
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM patients WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can view and insert reports" ON reports
  FOR ALL USING (
    doctor_id IN (
      SELECT id FROM doctors WHERE auth_user_id = auth.uid()
    )
  );

-- Emergency logs policies  
CREATE POLICY "Patients can view own emergency logs" ON emergency_logs
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM patients WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can insert emergency logs" ON emergency_logs
  FOR INSERT WITH CHECK (
    doctor_id IN (
      SELECT id FROM doctors WHERE auth_user_id = auth.uid()
    )
  );

-- Functions to auto-generate IDs
CREATE OR REPLACE FUNCTION generate_vh_id()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(vh_id FROM 9) AS INTEGER)), 0) + 1
  INTO next_num
  FROM patients
  WHERE vh_id LIKE 'VH-2025-%';
  
  RETURN 'VH-2025-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_doc_id()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(doc_id FROM 10) AS INTEGER)), 0) + 1
  INTO next_num
  FROM doctors
  WHERE doc_id LIKE 'DOC-2025-%';
  
  RETURN 'DOC-2025-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Storage bucket for reports (run this in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('reports', 'reports', false);

-- Storage policies
-- CREATE POLICY "Authenticated users can upload reports" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'reports' AND auth.role() = 'authenticated');

-- CREATE POLICY "Users can view reports they have access to" ON storage.objects
--   FOR SELECT USING (bucket_id = 'reports' AND auth.role() = 'authenticated');