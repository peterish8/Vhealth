"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Shield, Search, AlertTriangle, Eye, Download, MapPin, User, Clock, Filter } from "lucide-react"
import { SecurityHeader } from "@/components/security-header"

// Mock audit log data
const auditLogs = [
  {
    id: "1",
    timestamp: "2024-12-15T14:30:00Z",
    action: "Emergency Access",
    user: "Dr. Emergency Staff",
    userType: "doctor",
    patientId: "123456789012",
    patientName: "Rahul Sharma",
    location: "AIIMS Delhi Emergency Room",
    ipAddress: "192.168.1.100",
    severity: "high",
    details: "AI Emergency Summary accessed during medical emergency",
    status: "completed",
  },
  {
    id: "2",
    timestamp: "2024-12-15T10:15:00Z",
    action: "Report Upload",
    user: "Dr. Rajesh Kumar",
    userType: "doctor",
    patientId: "123456789012",
    patientName: "Rahul Sharma",
    location: "AIIMS Delhi",
    ipAddress: "192.168.1.50",
    severity: "normal",
    details: "Blood test report uploaded to patient vault",
    status: "completed",
  },
  {
    id: "3",
    timestamp: "2024-12-15T09:45:00Z",
    action: "Patient Login",
    user: "Rahul Sharma",
    userType: "patient",
    patientId: "123456789012",
    patientName: "Rahul Sharma",
    location: "New Delhi",
    ipAddress: "192.168.1.25",
    severity: "normal",
    details: "Patient accessed health vault dashboard",
    status: "completed",
  },
  {
    id: "4",
    timestamp: "2024-12-14T16:20:00Z",
    action: "Failed Login Attempt",
    user: "Unknown",
    userType: "unknown",
    patientId: "123456789012",
    patientName: "Rahul Sharma",
    location: "Mumbai",
    ipAddress: "192.168.2.100",
    severity: "high",
    details: "Multiple failed login attempts detected",
    status: "blocked",
  },
  {
    id: "5",
    timestamp: "2024-12-14T11:30:00Z",
    action: "Data Export",
    user: "Rahul Sharma",
    userType: "patient",
    patientId: "123456789012",
    patientName: "Rahul Sharma",
    location: "New Delhi",
    ipAddress: "192.168.1.25",
    severity: "normal",
    details: "Patient downloaded medical records PDF",
    status: "completed",
  },
]

export default function AuditLogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [selectedAction, setSelectedAction] = useState("all")

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = selectedSeverity === "all" || log.severity === selectedSeverity
    const matchesAction = selectedAction === "all" || log.action.toLowerCase().includes(selectedAction.toLowerCase())
    return matchesSearch && matchesSeverity && matchesAction
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "normal":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "blocked":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <SecurityHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Security Audit Log</h1>
              <p className="text-muted-foreground">Monitor all system access and security events</p>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>

          {/* Security Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Events</p>
                    <p className="text-2xl font-bold">{auditLogs.length}</p>
                  </div>
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">High Severity</p>
                    <p className="text-2xl font-bold text-destructive">
                      {auditLogs.filter((log) => log.severity === "high").length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Emergency Access</p>
                    <p className="text-2xl font-bold text-warning">
                      {auditLogs.filter((log) => log.action === "Emergency Access").length}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Blocked Events</p>
                    <p className="text-2xl font-bold text-destructive">
                      {auditLogs.filter((log) => log.status === "blocked").length}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by user, patient, action, or details..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="all">All Severity</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="normal">Normal</option>
                  </select>
                  <select
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="all">All Actions</option>
                    <option value="login">Login</option>
                    <option value="emergency">Emergency</option>
                    <option value="upload">Upload</option>
                    <option value="export">Export</option>
                  </select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Log Table */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
              <CardDescription>Comprehensive log of all system access and security-related activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityColor(log.severity)} className="text-xs">
                            {log.severity.toUpperCase()}
                          </Badge>
                          <Badge variant={getStatusColor(log.status)} className="text-xs">
                            {log.status.toUpperCase()}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg">{log.action}</h3>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(log.timestamp).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">User:</span>
                        <span className="font-medium">{log.user}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Patient:</span>
                        <span className="font-medium">{log.patientName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{log.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">IP:</span>
                        <span className="font-mono text-xs">{log.ipAddress}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">{log.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
