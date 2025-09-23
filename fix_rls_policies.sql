-- Fix RLS policies to allow reading for authentication checks
DROP POLICY IF EXISTS "Patients can view own data" ON patients;
DROP POLICY IF EXISTS "Anyone can view doctors" ON doctors;

-- Allow authenticated users to read patients for OAuth callback
CREATE POLICY "Allow authenticated to read patients" ON patients
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to read doctors for OAuth callback  
CREATE POLICY "Allow authenticated to read doctors" ON doctors
  FOR SELECT TO authenticated USING (true);