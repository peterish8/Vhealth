import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    if (patientError || !patient) {
      return Response.json({ error: 'Patient not found' }, { status: 404 })
    }

    const { data: records, error: recordsError } = await supabase
      .from('health_records')
      .select(`
        *,
        doctor:doctors!health_records_doctor_id_fkey(
          name,
          hospital
        )
      `)
      .eq('patient_id', patient.id)
      .order('created_at', { ascending: false })

    if (recordsError) {
      return Response.json({ error: 'Failed to fetch records' }, { status: 500 })
    }

    return Response.json({ success: true, records: records || [] })

  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}