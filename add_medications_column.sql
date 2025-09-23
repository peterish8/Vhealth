-- Add current_medications column to patients table
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS current_medications TEXT;

-- Add password_hash boolean column to track if password is set
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS password_hash BOOLEAN DEFAULT FALSE;

-- Add missing contact columns if they don't exist
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS contact_number TEXT;

ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;

ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS emergency_contact_number TEXT;

-- Update existing patients to reflect if they have passwords set
-- (This would need to be done based on your auth setup)
UPDATE patients 
SET password_hash = TRUE 
WHERE auth_user_id IS NOT NULL;

-- Add comment for the new column
COMMENT ON COLUMN patients.current_medications IS 'Patient''s current medications list - editable by patient';
COMMENT ON COLUMN patients.password_hash IS 'Whether patient has set a password for VHealth ID login';