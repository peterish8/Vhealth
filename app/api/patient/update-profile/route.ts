import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { address, insuranceProvider, insurancePolicyNo, currentMedications, patientId } = await req.json()
    
    if (!patientId) {
      return Response.json({ error: 'Missing patient ID' }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Update profile information
    const { data, error: updateError } = await supabase
      .from('patients')
      .update({ 
        address: address || null,
        insurance_provider: insuranceProvider || null,
        insurance_policy_no: insurancePolicyNo || null,
        current_medications: currentMedications || null
      })
      .eq('id', patientId)
      .eq('auth_user_id', user.id)
      .select()

    if (updateError) {
      console.error('Update error:', updateError)
      return Response.json({ 
        error: 'Failed to update profile information',
        details: updateError.message
      }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return Response.json({ 
        error: 'No patient found or unauthorized'
      }, { status: 404 })
    }

    return Response.json({ 
      success: true, 
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return Response.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}