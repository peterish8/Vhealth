-- Add has_password column to doctors table
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS has_password boolean DEFAULT false;

-- Add has_password column to patients table
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS has_password boolean DEFAULT false;

-- Update existing records to have has_password = true where auth is set up
UPDATE doctors 
SET has_password = true 
WHERE auth_user_id IS NOT NULL;

UPDATE patients 
SET has_password = true 
WHERE auth_user_id IS NOT NULL;