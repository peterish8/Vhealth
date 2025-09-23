"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, LogOut, Settings, Bell } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface PatientInfo {
  name: string
  healthId: string
  bloodGroup: string
  age: number
  gender: string
  emergencyContact: string
}

interface PatientHeaderProps {
  patient: PatientInfo
  onNotificationClick?: () => void
}

export function PatientHeader({ patient, onNotificationClick }: PatientHeaderProps) {
  const [notificationCount, setNotificationCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // Fetch notification count
    const fetchNotificationCount = async () => {
      try {
        const response = await fetch('/api/patient/notifications')
        const result = await response.json()
        if (result.success) {
          setNotificationCount(result.notifications.length)
        }
      } catch (error) {
        console.error('Error fetching notification count:', error)
      }
    }
    
    fetchNotificationCount()
  }, [])

  const handleLogout = () => {
    console.log("[v0] Patient logout initiated")
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser")
      localStorage.removeItem("userType")
      localStorage.removeItem("healthId")
    }
    console.log("[v0] Session data cleared, redirecting to home")
    router.push("/")
  }

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">V Health</h1>
                <p className="text-sm text-muted-foreground">Health Vault</p>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-2">
              <Shield className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Secure Session Active</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">Welcome, {patient.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>ID: {patient.healthId}</span>
                <Badge variant="outline" className="text-xs">
                  {patient.bloodGroup}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onNotificationClick || (() => alert('Click on Notifications tab to view'))}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {notificationCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
