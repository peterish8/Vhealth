"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Stethoscope,
  Upload,
  FileText,
  User,
  Calendar,
  Search,
  CheckCircle,
  Bell,
  Settings,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { DoctorHeader } from "@/components/doctor-header";
import { FileUploadZone } from "@/components/file-upload-zone";
import { PasswordSetupModal } from "@/components/password-setup-modal";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface DoctorProfile {
  id: string;
  doc_id: string;
  auth_user_id: string;
  name: string;
  email: string;
  hospital?: string;
  license_no?: string;
  created_at: string;
  password_hash?: string;
  specialization?: string;
  experience_years?: number;
  consultation_fee?: number;
  available_days?: string[];
  full_name: string;
  vh_id: string;
  has_password?: boolean;
}

interface HealthRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  report_type: string;
  title: string;
  description?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  clinical_notes?: string;
  test_date?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  patient_name?: string;
  patient_health_id?: string;
}

interface SelectedFile {
  file: File;
  importance: number;
}

export default function DoctorDashboard() {
  const [patientId, setPatientId] = useState("");
  const [reportType, setReportType] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<SelectedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(
    null
  );
  const [recentUploads, setRecentUploads] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emergencyPatientId, setEmergencyPatientId] = useState("");
  const [isGeneratingEmergency, setIsGeneratingEmergency] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctorData = async () => {
      const supabase = createClient();

      try {
        // Fetch doctor data via secure API
        const response = await fetch("/api/doctor/get-profile");
        const result = await response.json();

        if (!result.success) {
          if (response.status === 401) {
            router.push("/");
            return;
          }
          setError("Failed to load doctor profile");
          return;
        }

        setDoctorProfile(result.profile);

        // Transform recent uploads data
        const transformedRecords: HealthRecord[] = (
          result.recentUploads || []
        ).map((record: any) => ({
          ...record,
          patient_name: record.patient?.full_name || "Unknown Patient",
          patient_health_id: record.patient?.vh_id || "Unknown ID",
        }));
        setRecentUploads(transformedRecords);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        setError("Failed to load doctor data");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [router]);

  const handleFileUpload = (files: SelectedFile[]) => {
    setUploadedFiles(files);
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", {
      patientId,
      reportType,
      reportTitle,
      notes,
      uploadedFiles,
    });

    if (!doctorProfile) {
      console.error("No doctor profile found");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("patientId", patientId);
      formData.append("reportType", reportType);
      formData.append("reportTitle", reportTitle);
      formData.append("notes", notes);

      if (uploadedFiles.length > 0) {
        formData.append("file", uploadedFiles[0].file);
        formData.append("importance", uploadedFiles[0].importance.toString());
      }

      const response = await fetch("/api/doctor/upload-report", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      // Reset form
      setPatientId("");
      setReportType("");
      setReportTitle("");
      setNotes("");
      setUploadedFiles([]);

      // Refresh data
      const refreshResponse = await fetch("/api/doctor/get-profile");
      const refreshResult = await refreshResponse.json();

      if (refreshResult.success) {
        const transformedRecords: HealthRecord[] = (
          refreshResult.recentUploads || []
        ).map((record: any) => ({
          ...record,
          patient_name: record.patient?.full_name || "Unknown Patient",
          patient_health_id: record.patient?.vh_id || "Unknown ID",
        }));
        setRecentUploads(transformedRecords);
      }

      alert(result.message);
    } catch (error: any) {
      console.error("Upload error:", error);
      setError(error.message || "Failed to upload report");
    } finally {
      setIsUploading(false);
    }
  };

  const filteredUploads = recentUploads.filter(
    (upload) =>
      (upload.patient_name &&
        upload.patient_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (upload.patient_health_id &&
        upload.patient_health_id.includes(searchTerm)) ||
      upload.report_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading doctor dashboard...</p>
        </div>
      </div>
    );
  }

  if (!doctorProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              Doctor profile not found
            </p>
            <Button onClick={() => router.push("/")}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const doctorInfo = {
    name: doctorProfile.name,
    doctorId: doctorProfile.doc_id || "Not Set",
    vhealthId: doctorProfile.doc_id || "Generating...",
    passwordEnabled: !!doctorProfile.has_password,
    oauthProvider: "google",
    specialization: doctorProfile.specialization || "General Medicine",
    hospital: doctorProfile.hospital || "Not Set",
    license: doctorProfile.license_no || "Not Set",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <DoctorHeader doctor={doctorInfo} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Doctor Info Card */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Doctor Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{doctorInfo.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Doctor ID:</span>
                    <span className="font-mono text-xs bg-primary/10 px-2 py-1 rounded">
                      {doctorInfo.vhealthId}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">MCI ID:</span>
                    <span className="font-mono text-xs">
                      {doctorInfo.doctorId}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Specialty:</span>
                    <Badge variant="outline" className="text-xs">
                      {doctorInfo.specialization}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hospital:</span>
                    <span className="text-xs">{doctorInfo.hospital}</span>
                  </div>
                </div>

                {!doctorInfo.passwordEnabled && (
                  <div className="pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => setIsPasswordModalOpen(true)}
                    >
                      Set Password for Doctor ID
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Enable login with Doctor ID + password
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Today's Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Reports Uploaded
                  </span>
                  <Badge variant="secondary">{recentUploads.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Patients Served
                  </span>
                  <Badge variant="secondary">
                    {new Set(recentUploads.map((r) => r.patient_id)).size}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Pending Reviews
                  </span>
                  <Badge variant="outline">0</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="upload" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="upload">Upload Report</TabsTrigger>
                <TabsTrigger value="history">Upload History</TabsTrigger>
                <TabsTrigger value="emergency">Emergency AI</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6">
                {/* Upload Form */}
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-primary" />
                      Upload Medical Report
                    </CardTitle>
                    <CardDescription>
                      Upload reports directly to patient's secure health vault
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmitReport} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="patient-id">
                            Patient VHealth ID *
                          </Label>
                          <Input
                            id="patient-id"
                            placeholder="VH-2025-0001"
                            value={patientId}
                            onChange={(e) =>
                              setPatientId(e.target.value.toUpperCase())
                            }
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter the patient's VHealth ID (e.g., VH-2025-0001)
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="report-type">Report Type *</Label>
                          <Select
                            value={reportType}
                            onValueChange={setReportType}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select report type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="blood-test">
                                Blood Test
                              </SelectItem>
                              <SelectItem value="x-ray">X-Ray</SelectItem>
                              <SelectItem value="mri">MRI Scan</SelectItem>
                              <SelectItem value="ct-scan">CT Scan</SelectItem>
                              <SelectItem value="ultrasound">
                                Ultrasound
                              </SelectItem>
                              <SelectItem value="ecg">ECG</SelectItem>
                              <SelectItem value="prescription">
                                Prescription
                              </SelectItem>
                              <SelectItem value="consultation">
                                Consultation Notes
                              </SelectItem>
                              <SelectItem value="discharge">
                                Discharge Summary
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="report-title">Report Title</Label>
                        <Input
                          id="report-title"
                          placeholder="Enter a descriptive title for this report"
                          value={reportTitle}
                          onChange={(e) => setReportTitle(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Clinical Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          placeholder="Add any relevant clinical notes or observations..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Upload Files</Label>
                        <FileUploadZone onFilesSelected={handleFileUpload} />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isUploading || !patientId || !reportType}
                      >
                        {isUploading ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                            Uploading to Health Vault...
                          </div>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload to Patient Vault
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                {/* Search */}
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="pt-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by patient name, ID, or report type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Upload History */}
                <div className="space-y-4">
                  {filteredUploads.length === 0 ? (
                    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                      <CardContent className="pt-6 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          No upload history found
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Your uploaded reports will appear here
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredUploads.map((upload) => (
                      <Card
                        key={upload.id}
                        className="bg-card/80 backdrop-blur-sm border-border/50"
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <h3 className="font-semibold">
                                  {upload.title}
                                </h3>
                                <Badge variant="default" className="text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Uploaded
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {upload.patient_name}
                                </div>
                                <div className="flex items-center gap-1">
                                  <span>ID: {upload.patient_health_id}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(
                                    upload.created_at
                                  ).toLocaleDateString("en-IN")}
                                </div>
                              </div>
                              {upload.clinical_notes && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  {upload.clinical_notes}
                                </p>
                              )}
                              {upload.file_name && (
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {upload.file_name}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="emergency" className="space-y-6">
                {/* Emergency AI Access */}
                <Card className="bg-emergency/5 border-emergency/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emergency">
                      <AlertTriangle className="h-5 w-5" />
                      Emergency AI Summary Access
                    </CardTitle>
                    <CardDescription>
                      Generate AI emergency summary for any patient (Emergency
                      use only)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergency-patient-id">
                        Patient VHealth ID
                      </Label>
                      <Input
                        id="emergency-patient-id"
                        placeholder="VH-2025-0001"
                        className="font-mono"
                        value={emergencyPatientId}
                        onChange={(e) =>
                          setEmergencyPatientId(e.target.value.toUpperCase())
                        }
                      />
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full"
                      disabled={!emergencyPatientId || isGeneratingEmergency}
                      onClick={async () => {
                        if (!emergencyPatientId || !doctorProfile) return;

                        setIsGeneratingEmergency(true);
                        try {
                          const patientResponse = await fetch(
                            "/api/doctor/get-patient-emergency",
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                patientVhId: emergencyPatientId,
                              }),
                            }
                          );

                          const patientResult = await patientResponse.json();

                          if (!patientResponse.ok || !patientResult.success) {
                            throw new Error(
                              patientResult.error ||
                                "Patient not found with this VHealth ID"
                            );
                          }

                          const { patient } = patientResult;

                          sessionStorage.setItem(
                            "emergencyData",
                            JSON.stringify({
                              patientData: patient,
                            })
                          );
                          window.open("/doctor/emergency-view", "_blank");

                          alert(
                            `Emergency records for ${patient.full_name} accessed. This action has been logged.`
                          );
                          setEmergencyPatientId("");
                        } catch (error: any) {
                          console.error("Emergency access error:", error);
                          alert(
                            error.message ||
                              "Failed to access emergency records"
                          );
                        } finally {
                          setIsGeneratingEmergency(false);
                        }
                      }}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      {isGeneratingEmergency
                        ? "Accessing..."
                        : "Access Emergency Records"}
                    </Button>
                    <div className="bg-warning/10 border border-warning/20 rounded-md p-3">
                      <p className="text-xs text-warning">
                        <strong>Emergency Access:</strong> This feature allows
                        doctors to access any patient's emergency summary. All
                        access is logged and audited.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No new notifications
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        You're all caught up!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle>Doctor Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">
                        Your Profile
                      </h3>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p>
                          <strong>Doctor ID:</strong> {doctorInfo.doctorId}
                        </p>
                        <p>
                          <strong>Name:</strong> {doctorInfo.name}
                        </p>
                        <p>
                          <strong>Specialization:</strong>{" "}
                          {doctorInfo.specialization}
                        </p>
                        <p>
                          <strong>Hospital:</strong> {doctorInfo.hospital}
                        </p>
                      </div>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Change Password
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="current">Current Password</Label>
                            <Input
                              id="current"
                              type="password"
                              placeholder="Enter current password"
                            />
                          </div>
                          <div>
                            <Label htmlFor="new">New Password</Label>
                            <Input
                              id="new"
                              type="password"
                              placeholder="Enter new password"
                            />
                          </div>
                          <div>
                            <Label htmlFor="confirm">
                              Confirm New Password
                            </Label>
                            <Input
                              id="confirm"
                              type="password"
                              placeholder="Confirm new password"
                            />
                          </div>
                          <Button>Update Password</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {doctorProfile && (
        <PasswordSetupModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          userId={doctorProfile.auth_user_id}
          displayId={doctorProfile.vh_id || ""}
          userType="doctor"
        />
      )}
    </div>
  );
}
