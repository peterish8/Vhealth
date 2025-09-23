'use client'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Stethoscope, Shield, LogOut, Settings, Bell } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface DoctorInfo {
  name: string
  doctorId: string
  specialization: string
  hospital: string
  license: string
}

interface DoctorHeaderProps {
  doctor: DoctorInfo
  onSettingsClick?: () => void
  onNotificationsClick?: () => void
}

export function DoctorHeader({ doctor, onSettingsClick, onNotificationsClick }: DoctorHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">V Health</h1>
                <p className="text-sm text-muted-foreground">Doctor Portal</p>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-2">
              <Shield className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Verified Doctor Session</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">{doctor.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{doctor.doctorId}</span>
                <Badge variant="outline" className="text-xs">
                  {doctor.specialization}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
