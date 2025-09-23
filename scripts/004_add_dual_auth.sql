-- Add VHealth ID and password support to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS vh_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS password_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS oauth_provider TEXT DEFAULT 'email';

-- Create function to generate VHealth IDs
CREATE OR REPLACE FUNCTION generate_vh_id(user_type_param TEXT)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  next_number INTEGER;
  vh_id TEXT;
BEGIN
  -- Set prefix based on user type
  IF user_type_param = 'patient' THEN
    prefix := 'VH-2025-';
  ELSE
    prefix := 'DOC-2025-';
  END IF;
  
  -- Get next number for this type
  SELECT COALESCE(MAX(CAST(SUBSTRING(vh_id FROM LENGTH(prefix) + 1) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.profiles 
  WHERE vh_id LIKE prefix || '%';
  
  -- Format with leading zeros
  vh_id := prefix || LPAD(next_number::TEXT, 4, '0');
  
  RETURN vh_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate VHealth IDs
CREATE OR REPLACE FUNCTION auto_generate_vh_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.vh_id IS NULL THEN
    NEW.vh_id := generate_vh_id(NEW.user_type);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_vh_id
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_vh_id();

-- Add RLS policy for VHealth ID lookup
CREATE POLICY "Allow VHealth ID lookup for authentication" ON public.profiles
  FOR SELECT USING (true);
