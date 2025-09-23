"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, CheckCircle, Eye, Lock, Activity } from "lucide-react"

interface SecurityEvent {
  id: string
  type: "login" | "emergency" | "failed_attempt" | "data_access"
  severity: "low" | "medium" | "high"
  timestamp: string
  message: string
}

export function SecurityMonitor() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [systemStatus, setSystemStatus] = useState({
    encryption: "active",
    firewall: "active",
    monitoring: "active",
    backups: "active",
  })

  useEffect(() => {
    // Simulate real-time security events
    const mockEvents: SecurityEvent[] = [
      {
        id: "1",
        type: "emergency",
        severity: "high",
        timestamp: new Date().toISOString(),
        message: "Emergency access granted for patient ID 123456789012",
      },
      {
        id: "2",
        type: "login",
        severity: "low",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        message: "Doctor login successful from AIIMS Delhi",
      },
      {
        id: "3",
        type: "failed_attempt",
        severity: "medium",
        timestamp: new Date(Date.now() - 600000).toISOString(),
        message: "Failed login attempt detected from unknown IP",
      },
    ]
    setSecurityEvents(mockEvents)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return <AlertTriangle className="h-4 w-4" />
      case "login":
        return <CheckCircle className="h-4 w-4" />
      case "failed_attempt":
        return <Shield className="h-4 w-4" />
      case "data_access":
        return <Eye className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* System Status */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-success" />
            System Security Status
          </CardTitle>
          <CardDescription>Real-time security system monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Encryption</span>
              </div>
              <Badge variant="outline" className="text-success border-success/20">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Firewall</span>
              </div>
              <Badge variant="outline" className="text-success border-success/20">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Monitoring</span>
              </div>
              <Badge variant="outline" className="text-success border-success/20">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Backups</span>
              </div>
              <Badge variant="outline" className="text-success border-success/20">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Events */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Live monitoring of security-related activities</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All Events
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                <div className="mt-0.5">{getEventIcon(event.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getSeverityColor(event.severity)} className="text-xs">
                      {event.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString("en-IN")}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{event.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
