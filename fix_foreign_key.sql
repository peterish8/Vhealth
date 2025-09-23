-- Check the foreign key constraint
SELECT conname, conrelid::regclass, confrelid::regclass 
FROM pg_constraint 
WHERE conname = 'health_records_patient_id_fkey';

-- Drop and recreate the health_records table with correct foreign keys
DROP TABLE IF EXISTS health_records CASCADE;

CREATE TABLE health_records (
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
  test_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Create simple policies
CREATE POLICY "Allow authenticated users" ON health_records
  FOR ALL TO authenticated USING (true) WITH CHECK (true);