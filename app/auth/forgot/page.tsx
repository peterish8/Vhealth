'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ForgotCredentials() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [credentials, setCredentials] = useState({ id: '', password: '' })
  const [userType, setUserType] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Check if email exists in patients table
      const { data: patient } = await supabase
        .from('patients')
        .select('vh_id, password_hash, name')
        .eq('email', email)
        .single()

      // Check if email exists in doctors table
      const { data: doctor } = await supabase
        .from('doctors')
        .select('doc_id, password_hash, name')
        .eq('email', email)
        .single()

      if (patient) {
        setCredentials({ id: patient.vh_id, password: patient.password_hash || 'Not set' })
        setUserType('Patient')
        setStep(2)
      } else if (doctor) {
        setCredentials({ id: doctor.doc_id, password: doctor.password_hash || 'Not set' })
        setUserType('Doctor')
        setStep(2)
      } else {
        toast.error('Email not found in our records')
      }
    } catch (error: any) {
      toast.error('Email not found in our records')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (newPassword: string) => {
    setLoading(true)
    try {
      const table = userType === 'Patient' ? 'patients' : 'doctors'
      const idField = userType === 'Patient' ? 'vh_id' : 'doc_id'
      
      const { error } = await supabase
        .from(table)
        .update({ password_hash: newPassword })
        .eq(idField, credentials.id)

      if (error) throw error

      toast.success('Password updated successfully!')
      setCredentials(prev => ({ ...prev, password: newPassword }))
    } catch (error: any) {
      toast.error('Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-green-700">Credentials Found!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-3">Your {userType} Credentials</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">{userType} ID:</span>
                    <code className="bg-white px-2 py-1 rounded text-sm">{credentials.id}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Password:</span>
                    <code className="bg-white px-2 py-1 rounded text-sm">{credentials.password}</code>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Change Password (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const newPassword = (e.target as HTMLInputElement).value
                        if (newPassword.length >= 6) {
                          handlePasswordChange(newPassword)
                        } else {
                          toast.error('Password must be at least 6 characters')
                        }
                      }
                    }}
                  />
                  <Button 
                    onClick={() => {
                      const input = document.querySelector('input[type="password"]') as HTMLInputElement
                      const newPassword = input.value
                      if (newPassword.length >= 6) {
                        handlePasswordChange(newPassword)
                      } else {
                        toast.error('Password must be at least 6 characters')
                      }
                    }}
                    disabled={loading}
                  >
                    Update
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => router.push('/')} className="flex-1">
                  Back to Login
                </Button>
                <Button 
                  onClick={() => {
                    const text = `${userType} ID: ${credentials.id}\nPassword: ${credentials.password}`
                    navigator.clipboard.writeText(text)
                    toast.success('Credentials copied!')
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Copy Credentials
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>Forgot Password or ID?</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <Mail className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Enter your email address to recover your credentials
                </p>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Searching...' : 'Find My Credentials'}
              </Button>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This will show your current password. Make sure you're in a private location.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}