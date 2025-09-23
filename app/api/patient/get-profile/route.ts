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
      .from('patients')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()

    if (profileError || !profile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 })
    }

    return Response.json({ success: true, profile })

  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}