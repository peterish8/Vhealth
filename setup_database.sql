-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vh_id TEXT UNIQUE NOT NULL,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  contact_number TEXT,
  address TEXT,
  blood_group TEXT CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  allergies TEXT[],
  chronic_conditions TEXT[],
  current_medications TEXT,
  emergency_contact_name TEXT,
  emergency_contact_number TEXT,
  insurance_provider TEXT,
  insurance_policy_no TEXT,
  profile_picture_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctors table  
CREATE TABLE IF NOT EXISTS doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doc_id TEXT UNIQUE NOT NULL,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  specialization TEXT,
  hospital TEXT,
  license_no TEXT,
  password_hash TEXT,
  experience_years INTEGER,
  consultation_fee INTEGER,
  available_days TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert 10 hardcoded doctors
INSERT INTO doctors (doc_id, name, email, specialization, hospital, license_no, experience_years, consultation_fee, available_days) VALUES
('DOC-2025-0001', 'Dr. Sarah Johnson', 'sarah.johnson@vhealth.com', 'Cardiology', 'City General Hospital', 'MCI-12345', 15, 500, ARRAY['Monday', 'Tuesday', 'Wednesday', 'Friday']),
('DOC-2025-0002', 'Dr. Michael Chen', 'michael.chen@vhealth.com', 'Neurology', 'Metro Medical Center', 'MCI-12346', 12, 600, ARRAY['Tuesday', 'Thursday', 'Saturday']),
('DOC-2025-0003', 'Dr. Priya Sharma', 'priya.sharma@vhealth.com', 'Pediatrics', 'Children Hospital', 'MCI-12347', 8, 400, ARRAY['Monday', 'Wednesday', 'Friday', 'Saturday']),
('DOC-2025-0004', 'Dr. Robert Wilson', 'robert.wilson@vhealth.com', 'Orthopedics', 'Bone & Joint Clinic', 'MCI-12348', 20, 700, ARRAY['Monday', 'Tuesday', 'Thursday']),
('DOC-2025-0005', 'Dr. Anita Patel', 'anita.patel@vhealth.com', 'Dermatology', 'Skin Care Center', 'MCI-12349', 10, 450, ARRAY['Wednesday', 'Thursday', 'Friday']),
('DOC-2025-0006', 'Dr. James Miller', 'james.miller@vhealth.com', 'Gastroenterology', 'Digestive Health Institute', 'MCI-12350', 14, 550, ARRAY['Tuesday', 'Wednesday', 'Saturday']),
('DOC-2025-0007', 'Dr. Kavya Reddy', 'kavya.reddy@vhealth.com', 'Gynecology', 'Women Health Center', 'MCI-12351', 11, 500, ARRAY['Monday', 'Thursday', 'Friday']),
('DOC-2025-0008', 'Dr. David Brown', 'david.brown@vhealth.com', 'Psychiatry', 'Mental Wellness Clinic', 'MCI-12352', 16, 600, ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday']),
('DOC-2025-0009', 'Dr. Ravi Kumar', 'ravi.kumar@vhealth.com', 'Endocrinology', 'Diabetes & Hormone Center', 'MCI-12353', 13, 520, ARRAY['Tuesday', 'Thursday', 'Saturday']),
('DOC-2025-0010', 'Dr. Lisa Anderson', 'lisa.anderson@vhealth.com', 'Ophthalmology', 'Eye Care Institute', 'MCI-12354', 9, 480, ARRAY['Monday', 'Wednesday', 'Friday', 'Saturday']);

-- Enable RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Patients can insert own data" ON patients
  FOR INSERT WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Patients can view own data" ON patients
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "Doctors can view patients for reports" ON patients
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view doctors" ON doctors
  FOR SELECT USING (true);

CREATE POLICY "Doctors can insert own data" ON doctors
  FOR INSERT WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Doctors can update own data" ON doctors
  FOR UPDATE USING (auth_user_id = auth.uid());

-- Auto-generate VH ID function
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

-- Trigger to auto-generate VH ID
CREATE OR REPLACE FUNCTION set_patient_vh_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.vh_id IS NULL OR NEW.vh_id LIKE 'VH-%' THEN
    NEW.vh_id := generate_vh_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_patient_vh_id
  BEFORE INSERT ON patients
  FOR EACH ROW
  EXECUTE FUNCTION set_patient_vh_id();

-- Auto-generate DOC ID function
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

-- Trigger to auto-generate DOC ID
CREATE OR REPLACE FUNCTION set_doctor_doc_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.doc_id IS NULL OR NEW.doc_id LIKE 'DOC-%' THEN
    NEW.doc_id := generate_doc_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_doctor_doc_id
  BEFORE INSERT ON doctors
  FOR EACH ROW
  EXECUTE FUNCTION set_doctor_doc_id();

-- Create health_records table for medical reports
CREATE TABLE IF NOT EXISTS health_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  clinical_notes TEXT,
  extracted_text TEXT,
  test_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for health_records
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Policies for health_records
CREATE POLICY "Doctors can insert health records" ON health_records
  FOR INSERT WITH CHECK (doctor_id IN (SELECT id FROM doctors WHERE auth_user_id = auth.uid()));

CREATE POLICY "Doctors can view their own records" ON health_records
  FOR SELECT USING (doctor_id IN (SELECT id FROM doctors WHERE auth_user_id = auth.uid()));

CREATE POLICY "Patients can view their own records" ON health_records
  FOR SELECT USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));