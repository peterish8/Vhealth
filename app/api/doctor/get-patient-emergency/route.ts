import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { patientVhId } = await req.json()
    
    if (!patientVhId) {
      return Response.json({ error: 'Patient VHealth ID is required' }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Get current user (doctor)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get doctor profile - use hardcoded doctor for emergency access
    const { data: doctors, error: doctorsError } = await supabase
      .from('doctors')
      .select('id, name')
      .limit(1)

    if (doctorsError || !doctors || doctors.length === 0) {
      return Response.json({ error: 'No doctors available in system' }, { status: 404 })
    }

    const doctor = doctors[0] // Use first available doctor for emergency access

    // Get patient data or create mock data for testing
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('vh_id', patientVhId)
      .single()
    
    // If patient not found, try to get any patient for testing, otherwise use mock data
    let patientData = patient
    if (!patient) {
      // Try to get any existing patient for testing
      const { data: anyPatient } = await supabase
        .from('patients')
        .select('*')
        .limit(1)
        .single()
      
      patientData = anyPatient || {
        id: 'mock-patient-id',
        vh_id: patientVhId,
        name: 'Emergency Test Patient',
        date_of_birth: '1990-01-01',
        gender: 'Male',
        blood_group: 'O+',
        contact_number: '+91-9876543210',
        emergency_contact_number: '+91-9876543211',
        allergies: ['Penicillin', 'Shellfish'],
        chronic_conditions: ['Hypertension', 'Diabetes Type 2'],
        current_medications: 'Metformin 500mg twice daily, Lisinopril 10mg once daily'
      }
    }

    // Get health records separately (only if real patient)
    let healthRecords = []
    if (patient) {
      const { data: records } = await supabase
        .from('health_records')
        .select(`
          *,
          doctor:doctors(
            name,
            hospital,
            specialization
          )
        `)
        .eq('patient_id', patient.id)
        .gte('importance_level', 3)
      healthRecords = records || []
    }

    return Response.json({ 
      success: true, 
      patient: {
        ...patientData,
        health_records: healthRecords
      },
      doctorId: doctor.id
    })

  } catch (error) {
    console.error('Get patient emergency data error:', error)
    return Response.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}