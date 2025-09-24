-- Add priority_level column to health_records
ALTER TABLE health_records
ADD COLUMN IF NOT EXISTS priority_level INTEGER 
CHECK (priority_level >= 1 AND priority_level <= 5);

-- Add priority_level to emergency_access_logs
ALTER TABLE emergency_access_logs
ADD COLUMN IF NOT EXISTS priority_level INTEGER 
CHECK (priority_level >= 1 AND priority_level <= 5);

-- Create or replace function to calculate priority level based on conditions
CREATE OR REPLACE FUNCTION calculate_patient_priority(
  p_chronic_conditions text[],
  p_allergies text[],
  p_current_medications text
) RETURNS INTEGER AS $$
DECLARE
  condition_count INTEGER;
  medication_count INTEGER;
  priority INTEGER;
BEGIN
  -- Count chronic conditions
  condition_count := array_length(p_chronic_conditions, 1);
  
  -- Count medications (approximate by newlines)
  medication_count := regexp_count(p_current_medications, E'\\n') + 1;
  
  -- Calculate base priority
  priority := 1; -- Default priority
  
  -- Increase priority based on conditions
  IF condition_count >= 3 THEN
    priority := priority + 2;
  ELSIF condition_count >= 1 THEN
    priority := priority + 1;
  END IF;
  
  -- Increase priority based on medications
  IF medication_count >= 5 THEN
    priority := priority + 2;
  ELSIF medication_count >= 3 THEN
    priority := priority + 1;
  END IF;
  
  -- Increase priority if allergies exist
  IF array_length(p_allergies, 1) > 0 THEN
    priority := priority + 1;
  END IF;
  
  -- Cap priority at 5
  RETURN LEAST(priority, 5);
END;
$$ LANGUAGE plpgsql;