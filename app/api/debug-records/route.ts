import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get all health records with extracted text
    const { data: records, error } = await supabase
      .from('health_records')
      .select('id, title, file_name, extracted_text, clinical_notes, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }
    
    return Response.json({ 
      success: true, 
      records: records?.map(record => ({
        ...record,
        extracted_text_length: record.extracted_text?.length || 0,
        extracted_text_preview: record.extracted_text?.substring(0, 200) || 'No text'
      }))
    })
    
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}