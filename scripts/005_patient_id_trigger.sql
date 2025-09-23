-- Auto-generate VH ID trigger for patients
CREATE OR REPLACE FUNCTION set_patient_vh_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.vh_id IS NULL OR NEW.vh_id LIKE 'VH-%' THEN
    NEW.vh_id := generate_vh_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_set_patient_vh_id ON patients;
CREATE TRIGGER trigger_set_patient_vh_id
  BEFORE INSERT ON patients
  FOR EACH ROW
  EXECUTE FUNCTION set_patient_vh_id();

-- Add policy for patients to insert their own data
CREATE POLICY "Patients can insert own data" ON patients
  FOR INSERT WITH CHECK (auth_user_id = auth.uid());