"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, ExternalLink, Copy } from "lucide-react"

export default function OAuthSetupPage() {
  const [envVars, setEnvVars] = useState<{ [key: string]: boolean }>({})
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check which environment variables are available
    const checkEnvVars = async () => {
      try {
        const response = await fetch("/api/auth/check-env")
        const data = await response.json()
        setEnvVars(data)
      } catch (error) {
        console.error("[v0] Failed to check environment variables:", error)
        setEnvVars({
          NEXT_PUBLIC_SUPABASE_URL: false,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: false,
        })
      } finally {
        setLoading(false)
      }
    }

    checkEnvVars()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const [setupSteps, setSetupSteps] = useState([
    { id: 1, title: "Check Environment Variables", completed: false },
    { id: 2, title: "Access Supabase Dashboard", completed: false },
    { id: 3, title: "Enable Google Provider", completed: false },
    { id: 4, title: "Configure OAuth Settings", completed: false },
    { id: 5, title: "Test Authentication", completed: false },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Supabase Configuration Error
          </CardTitle>
          <CardDescription>Fix the environment variable error and enable Google authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error:</strong> "Your project's URL and Key are required to create a Supabase client!"
              <br />
              This means the Supabase environment variables are not properly configured.
            </AlertDescription>
          </Alert>

          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-3">Environment Variables Status</h3>
            {loading ? (
              <p className="text-sm text-muted-foreground">Checking environment variables...</p>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>NEXT_PUBLIC_SUPABASE_URL</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${envVars.NEXT_PUBLIC_SUPABASE_URL ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {envVars.NEXT_PUBLIC_SUPABASE_URL ? "Found" : "Missing"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Found" : "Missing"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  1
                </span>
                Fix Environment Variables
              </h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  The Supabase integration should be automatically configured, but it seems the environment variables
                  are not available.
                </p>
                <p>
                  <strong>Solution:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Check if Supabase integration is properly connected in Project Settings</li>
                  <li>Try refreshing the page or redeploying the project</li>
                  <li>Verify the integration is active in your v0 workspace</li>
                </ul>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  2
                </span>
                Access Supabase Dashboard
              </h3>
              <p className="text-sm text-muted-foreground mb-3">Go to your Supabase project dashboard</p>
              <Button variant="outline" size="sm" asChild>
                <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                  Open Supabase Dashboard <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  3
                </span>
                Enable Google Provider
              </h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Navigate to Authentication → Providers</p>
                <p>• Find "Google" in the list and click to configure</p>
                <p>• Toggle "Enable sign in with Google" to ON</p>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  4
                </span>
                Configure OAuth Settings
              </h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Create a Google OAuth app in Google Cloud Console</p>
                <p>• Add your Client ID and Client Secret to Supabase</p>
                <p>• Set authorized redirect URIs:</p>
                <div className="bg-gray-100 p-2 rounded font-mono text-xs flex items-center justify-between">
                  <span>https://your-project.supabase.co/auth/v1/callback</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("https://your-project.supabase.co/auth/v1/callback")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p>• Add authorized domains (your v0 preview URL and localhost)</p>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  5
                </span>
                Test Authentication
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Return to the login page and test Google authentication
              </p>
              <Button size="sm" asChild>
                <a href="/">Back to Login</a>
              </Button>
            </div>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Need Help?</strong> If environment variables are still missing after checking the integration,
              contact support or check your v0 project settings to ensure Supabase is properly connected.
            </AlertDescription>
          </Alert>

          {copied && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Copied to clipboard!</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
