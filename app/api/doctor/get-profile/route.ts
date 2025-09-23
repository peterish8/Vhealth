import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('doctors')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()

    if (profileError || !profile) {
      return Response.json({ error: 'Doctor profile not found' }, { status: 404 })
    }

    const { data: records, error: recordsError } = await supabase
      .from('health_records')
      .select(`
        *,
        patient:patients!health_records_patient_id_fkey(
          name,
          vh_id
        )
      `)
      .eq('doctor_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(10)

    return Response.json({ 
      success: true, 
      profile,
      recentUploads: records || []
    })

  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}