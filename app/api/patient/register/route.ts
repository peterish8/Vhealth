import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Insert patient data
    const { data, error } = await supabase.from('patients').insert({
      auth_user_id: user.id,
      vh_id: `VH-${Date.now()}`, // Temporary ID, will be replaced by trigger
      name: body.name,
      email: body.email,
      date_of_birth: body.dateOfBirth,
      gender: body.gender,
      contact_number: body.contactNumber,
      address: body.address,
      blood_group: body.bloodGroup,
      allergies: body.allergies ? body.allergies.split(',').map((a: string) => a.trim()) : [],
      chronic_conditions: body.chronicConditions || [],
      current_medications: body.currentMedications,
      emergency_contact_name: body.emergencyContactName,
      emergency_contact_number: body.emergencyContactNumber,
      insurance_provider: body.insuranceProvider,
      insurance_policy_no: body.insurancePolicyNo
    }).select()

    if (error) {
      console.error('Patient registration error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, patient: data[0] })
  } catch (error) {
    console.error('Registration API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}