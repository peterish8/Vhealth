"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Hospital, User, FileText, Download } from "lucide-react"

interface HealthRecord {
  id: string
  patient_id: string
  doctor_id: string
  report_type: string
  title: string
  description?: string
  file_url?: string
  file_name?: string
  file_size?: number
  clinical_notes?: string
  test_date?: string
  created_at: string
  updated_at: string
  // Joined data from profiles table
  doctor_name?: string
  hospital?: string
}

interface HealthTimelineProps {
  records: HealthRecord[]
}

export function HealthTimeline({ records }: HealthTimelineProps) {
  if (records.length === 0) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardContent className="pt-6 text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Health Records</h3>
          <p className="text-muted-foreground">
            Your medical timeline will appear here once healthcare providers upload your reports
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>

        {records.map((record, index) => (
          <div key={record.id} className="relative flex items-start gap-6 pb-8">
            {/* Timeline dot */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground border-4 border-background">
              <FileText className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-card-foreground">{record.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {record.report_type}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          completed
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(record.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Hospital className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Hospital:</span>
                      <span className="font-medium">{record.hospital || "Unknown Hospital"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Doctor:</span>
                      <span className="font-medium">{record.doctor_name || "Unknown Doctor"}</span>
                    </div>
                  </div>

                  {record.clinical_notes && (
                    <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Clinical Notes:</p>
                      <p className="text-sm">{record.clinical_notes}</p>
                    </div>
                  )}

                  {record.file_name && (
                    <div className="border-t border-border pt-4">
                      <p className="text-sm text-muted-foreground mb-2">Attached Files:</p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => {
                            if (record.file_url) {
                              window.open(record.file_url, "_blank")
                            }
                          }}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {record.file_name}
                          {record.file_size && (
                            <span className="ml-1 text-muted-foreground">
                              ({record.file_size >= 1024 * 1024 ? `${(record.file_size / 1024 / 1024).toFixed(1)} MB` : `${(record.file_size / 1024).toFixed(0)} KB`})
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {record.description && record.description !== record.clinical_notes && (
                    <div className="border-t border-border pt-4 mt-4">
                      <p className="text-sm text-muted-foreground mb-1">Description:</p>
                      <p className="text-sm">{record.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
