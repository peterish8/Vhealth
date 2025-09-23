'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth error:', error)
          router.push('/')
          return
        }

        if (data.session?.user) {
          const userEmail = data.session.user.email
          const userId = data.session.user.id
          const urlParams = new URLSearchParams(window.location.search)
          const userType = urlParams.get('type')
          
          console.log('OAuth Callback Debug:', { userEmail, userType, userId })
          
          // Try to find existing user by checking database
          try {
            const supabase = createClient()
            
            // Check patients table
            const { data: patientData } = await supabase
              .from('patients')
              .select('id')
              .or(`auth_user_id.eq.${userId},email.eq.${userEmail}`)
              .limit(1)
            
            // Check doctors table
            const { data: doctorData } = await supabase
              .from('doctors')
              .select('id')
              .or(`auth_user_id.eq.${userId},email.eq.${userEmail}`)
              .limit(1)
            
            // Validate user type matches the intended login
            if (userType === 'patient') {
              if (patientData && patientData.length > 0) {
                router.push('/patient/dashboard')
                return
              } else if (doctorData && doctorData.length > 0) {
                // User is trying to login as patient but email belongs to doctor
                router.push('/?error=wrong-user-type&type=doctor')
                return
              }
            } else if (userType === 'doctor') {
              if (doctorData && doctorData.length > 0) {
                router.push('/doctor/dashboard')
                return
              } else if (patientData && patientData.length > 0) {
                // User is trying to login as doctor but email belongs to patient
                router.push('/?error=wrong-user-type&type=patient')
                return
              }
            }
          } catch (error) {
            console.log('Database check failed, treating as new user')
          }
          
          // New user - redirect to registration
          if (userType === 'patient') {
            router.push('/patient/register')
          } else if (userType === 'doctor') {
            router.push('/doctor/register')
          } else {
            router.push('/auth/choose-role')
          }
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Callback error:', error)
        router.push('/')
      }
    }

    handleAuthCallback()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}