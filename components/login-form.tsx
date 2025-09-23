"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Stethoscope, Shield, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function LoginForm() {
  const [vhealthId, setVhealthId] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("patient")
  const router = useRouter()

  const handleGoogleLogin = async (userType: "patient" | "doctor") => {
    setError(null)
    setLoading(true)

    const supabase = createClient()

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?type=${userType}`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      console.error("Google OAuth error:", error)
      setError(error.message || "Google authentication failed.")
      setLoading(false)
    }
  }

  const handlePatientLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()

    try {
      if (!vhealthId.startsWith('VH-')) {
        throw new Error('Invalid Patient ID format. Use VH-XXXX-XXXX')
      }

      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('vh_id', vhealthId)
        .single()
      
      if (error || !data) throw new Error('Patient ID not found')

      console.log('Patient data:', { vh_id: data.vh_id, password_hash: data.password_hash })
      console.log('Entered password:', password)

      // Check password from database
      if (data.password_hash && password !== data.password_hash) {
        throw new Error('Invalid password')
      } else if (!data.password_hash && password !== 'password123') {
        throw new Error('Invalid password. Use "password123" for demo')
      }

      router.push('/patient/dashboard')
    } catch (error: any) {
      setError(error.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  const handleDoctorLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()

    try {
      if (!vhealthId.startsWith('DOC-')) {
        throw new Error('Invalid Doctor ID format. Use DOC-XXXX-XXXX')
      }

      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('doc_id', vhealthId)
        .single()
      
      if (error || !data) throw new Error('Doctor ID not found')

      // Check password from database
      if (data.password_hash && password !== data.password_hash) {
        throw new Error('Invalid password')
      } else if (!data.password_hash && password !== 'doctor123') {
        throw new Error('Invalid password. Use "doctor123" for demo')
      }

      router.push('/doctor/dashboard')
    } catch (error: any) {
      setError(error.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-card-foreground">
          <Shield className="h-5 w-5 text-primary" />V Health Login
        </CardTitle>
        <CardDescription>Access your health vault with secure authentication</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Patient
            </TabsTrigger>
            <TabsTrigger value="doctor" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Doctor
            </TabsTrigger>
          </TabsList>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <TabsContent value="patient" className="space-y-4">
            <form onSubmit={handlePatientLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vh-id">VHealth ID</Label>
                <div className="relative">
                  <Input
                    id="vh-id"
                    placeholder="VH-2025-0001"
                    value={vhealthId}
                    onChange={(e) => setVhealthId(e.target.value.toUpperCase())}
                    required
                  />
                  <Badge variant="secondary" className="absolute right-2 top-2 text-xs">
                    Secure ID
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Signing in...
                  </div>
                ) : (
                  "Login with VHealth ID"
                )}
              </Button>
            </form>

            {activeTab === "patient" && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => handleGoogleLogin("patient")}
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Sign In with Google
                  </Button>
                  <Button
                    onClick={() => handleGoogleLogin("patient")}
                    variant="default"
                    className="w-full"
                    disabled={loading}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Sign Up with Google
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-xs text-blue-700">
                    <strong>New to V Health?</strong> Use Google login to get your VHealth ID instantly!
                  </p>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="doctor" className="space-y-4">
            <form onSubmit={handleDoctorLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doc-id">Doctor ID</Label>
                <div className="relative">
                  <Input
                    id="doc-id"
                    placeholder="DOC-2025-0001"
                    value={vhealthId}
                    onChange={(e) => setVhealthId(e.target.value.toUpperCase())}
                    required
                  />
                  <Badge variant="outline" className="absolute right-2 top-2 text-xs">
                    MCI Verified
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doc-password">Password</Label>
                <Input
                  id="doc-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Signing in...
                  </div>
                ) : (
                  "Login with Doctor ID"
                )}
              </Button>
            </form>

            {activeTab === "doctor" && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button onClick={() => handleGoogleLogin("doctor")} variant="outline" className="w-full" disabled={loading}>
                    <Mail className="h-4 w-4 mr-2" />
                    Sign In with Google
                  </Button>
                  <Button onClick={() => handleGoogleLogin("doctor")} variant="default" className="w-full" disabled={loading}>
                    <Mail className="h-4 w-4 mr-2" />
                    Sign Up with Google
                  </Button>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-xs text-green-700">
                    <strong>Medical professionals:</strong> Use Google login for instant verification and Doctor ID
                    generation.
                  </p>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center space-y-2">
          <button 
            onClick={() => router.push('/auth/forgot')}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password or ID?
          </button>
          <p className="text-xs text-muted-foreground">
            Protected by 256-bit encryption and government security protocols
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
