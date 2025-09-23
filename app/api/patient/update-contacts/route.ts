import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    console.log('Contact update API called')
    const body = await req.json()
    console.log('Request body:', body)
    
    const { contactNumber, emergencyContactName, emergencyContactNumber, patientId } = body
    
    if (!patientId) {
      console.log('Missing patient ID')
      return Response.json({ error: 'Missing patient ID' }, { status: 400 })
    }

    const supabase = await createClient()
    console.log('Supabase client created')
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('User check:', { user: !!user, userError })
    
    if (userError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Update contact information directly
    console.log('Updating patient:', patientId)
    const { data, error: updateError } = await supabase
      .from('patients')
      .update({ 
        contact_number: contactNumber || null,
        emergency_contact_name: emergencyContactName || null,
        emergency_contact_number: emergencyContactNumber || null
      })
      .eq('id', patientId)
      .eq('auth_user_id', user.id)
      .select()

    console.log('Update result:', { data, updateError })

    if (updateError) {
      console.error('Update error details:', updateError)
      return Response.json({ 
        error: 'Failed to update contact information',
        details: updateError.message,
        code: updateError.code,
        hint: updateError.hint
      }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return Response.json({ 
        error: 'No patient found or unauthorized',
        patientId 
      }, { status: 404 })
    }

    console.log('Update successful')
    return Response.json({ 
      success: true, 
      message: 'Contact information updated successfully',
      updated: data[0]
    })

  } catch (error) {
    console.error('API error:', error)
    return Response.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}