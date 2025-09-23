-- Add extracted_text column to health_records table
ALTER TABLE health_records ADD COLUMN IF NOT EXISTS extracted_text TEXT;