import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { medications, patientId } = await req.json()
    
    if (!medications || !patientId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient()
    
    // Get current user to verify authorization
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the patient belongs to the current user
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, auth_user_id')
      .eq('id', patientId)
      .eq('auth_user_id', user.id)
      .single()

    if (patientError || !patient) {
      return Response.json({ error: 'Patient not found or unauthorized' }, { status: 404 })
    }

    // Update medications
    const { error: updateError } = await supabase
      .from('patients')
      .update({ 
        current_medications: medications,
        updated_at: new Date().toISOString()
      })
      .eq('id', patientId)

    if (updateError) {
      console.error('Error updating medications:', updateError)
      return Response.json({ error: 'Failed to update medications' }, { status: 500 })
    }

    return Response.json({ 
      success: true, 
      message: 'Medications updated successfully' 
    })

  } catch (error) {
    console.error('Update medications error:', error)
    return Response.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}