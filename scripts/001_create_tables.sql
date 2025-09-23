-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('patient', 'doctor')),
  health_id TEXT UNIQUE, -- For patients
  medical_council_id TEXT UNIQUE, -- For doctors
  full_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  blood_group TEXT,
  address TEXT,
  emergency_contact TEXT,
  specialization TEXT, -- For doctors
  hospital TEXT, -- For doctors
  license_number TEXT, -- For doctors
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_records table for medical reports
CREATE TABLE IF NOT EXISTS public.health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

-- Create emergency_summaries table for AI-generated summaries
CREATE TABLE IF NOT EXISTS public.emergency_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  summary_data JSONB NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Create audit_logs table for security tracking
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for health_records
CREATE POLICY "Patients can view their own records" ON public.health_records
  FOR SELECT USING (
    patient_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
  );

CREATE POLICY "Doctors can view records they created" ON public.health_records
  FOR SELECT USING (
    doctor_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
  );

CREATE POLICY "Doctors can insert health records" ON public.health_records
  FOR INSERT WITH CHECK (
    doctor_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id AND user_type = 'doctor')
  );

CREATE POLICY "Doctors can update their own records" ON public.health_records
  FOR UPDATE USING (
    doctor_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
  );

-- RLS Policies for emergency_summaries
CREATE POLICY "Patients can view their own emergency summaries" ON public.emergency_summaries
  FOR SELECT USING (
    patient_id IN (SELECT id FROM public.profiles WHERE auth.uid() = id)
  );

CREATE POLICY "System can insert emergency summaries" ON public.emergency_summaries
  FOR INSERT WITH CHECK (true);

-- RLS Policies for audit_logs
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);
