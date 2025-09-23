"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  Heart,
  Shield,
  Clock,
  User,
  Phone,
  Droplets,
  Pill,
  Zap,
  ArrowLeft,

} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function DoctorEmergencyView() {
  const [patientData, setPatientData] = useState<any>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const storedData = sessionStorage.getItem('emergencyData')
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setPatientData(parsedData.patientData)
        sessionStorage.removeItem('emergencyData')
      } catch (error) {
        console.error('Error parsing stored emergency data:', error)
      }
    }
  }, [])

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emergency/5 via-background to-emergency/10 flex items-center justify-center">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-emergency/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-emergency/10 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-emergency animate-pulse" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-emergency">Loading Emergency Data</h2>
              <p className="text-sm text-muted-foreground">Please wait...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const highImportanceRecords = patientData.health_records?.filter((r: any) => r.importance_level >= 3) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-emergency/5 via-background to-emergency/10">
      <header className="border-b border-emergency/20 bg-emergency/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/doctor/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex-1 flex flex-col items-center">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-emergency" />
                <div className="text-center">
                  <h1 className="text-xl font-bold text-emergency">EMERGENCY ACCESS</h1>
                  <p className="text-sm text-muted-foreground">High-Importance Medical Records</p>
                </div>
              </div>
            </div>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  Patient Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-bold text-lg">{patientData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VHealth ID:</span>
                    <span className="font-mono text-sm bg-primary/10 px-2 py-1 rounded">{patientData.vh_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age:</span>
                    <span className="font-medium">{patientData.age?.toString().replace(/ years$/, '') || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gender:</span>
                    <span className="font-medium">{patientData.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blood Group:</span>
                    <Badge variant="destructive" className="font-bold">
                      <Droplets className="h-3 w-3 mr-1" />
                      {patientData.blood_group}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-emergency/5 border-emergency/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-emergency">
                  <Shield className="h-5 w-5" />
                  High-Importance Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                {highImportanceRecords.length > 0 ? (
                  <div className="space-y-4">
                    {highImportanceRecords.map((record: any) => (
                      <div key={record.id} className="p-4 border rounded-lg bg-card">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{record.title}</h3>
                            <p className="text-sm text-muted-foreground">{record.report_type}</p>
                          </div>
                          <Badge variant="destructive">Level {record.importance_level}</Badge>
                        </div>
                        {record.file_url && (
                          <Button asChild variant="link" className="p-0 h-auto mt-2">
                            <a href={record.file_url} target="_blank" rel="noopener noreferrer">
                              View Document
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No high-importance (level 3-5) records found for this patient.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}