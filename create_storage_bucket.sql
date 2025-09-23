-- Create storage bucket for health records
INSERT INTO storage.buckets (id, name, public)
VALUES ('health-records', 'health-records', true);

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'health-records');

-- Create policy to allow public access to files
CREATE POLICY "Allow public access" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'health-records');