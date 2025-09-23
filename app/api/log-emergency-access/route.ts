import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { patientId } = await req.json()
    
    if (!patientId) {
      return Response.json({ error: 'Patient ID is required' }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Get current authenticated user (doctor)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the actual doctor profile
    const { data: doctor, error: doctorError } = await supabase
      .from('doctors')
      .select('id, name, specialization, hospital')
      .eq('auth_user_id', user.id)
      .single()

    if (doctorError || !doctor) {
      return Response.json({ error: 'Doctor profile not found' }, { status: 404 })
    }

    // Log emergency access with actual doctor information
    const { error } = await supabase
      .from('emergency_access_logs')
      .insert({
        patient_id: patientId,
        doctor_id: doctor.id,
        doctor_name: doctor.name,
        doctor_specialization: doctor.specialization,
        doctor_hospital: doctor.hospital,
        accessed_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('Error logging emergency access:', error)
      return Response.json({ error: 'Failed to log emergency access' }, { status: 500 })
    }

    return Response.json({ success: true, doctor: doctor })

  } catch (error) {
    console.error('Log emergency access error:', error)
    return Response.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}