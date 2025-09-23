"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Calendar,
  Hospital,
  User,
  Search,
  Filter,
  Download,
  Settings,
  Edit,
  Save,
  X,
  Bell,
} from "lucide-react";
import { PatientHeader } from "@/components/patient-header";
import { HealthTimeline } from "@/components/health-timeline";
import { EmergencyButton } from "@/components/emergency-button";
import { SetPasswordModal } from "@/components/set-password-modal";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

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
  // Joined data from profiles table
  doctor_name?: string;
  hospital?: string;
}

interface PatientProfile {
  id: string;
  user_type: string;
  health_id?: string;
  vh_id?: string; // Added VHealth ID field
  password_enabled?: boolean; // Added password enabled field
  oauth_provider?: string; // Added OAuth provider field
  full_name: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  blood_group?: string;
  address?: string;
  emergency_contact?: string;
  current_medications?: string;
  has_password?: boolean;
  created_at: string;
  updated_at: string;
}

export default function PatientDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isEditingMedications, setIsEditingMedications] = useState(false);
  const [currentMedications, setCurrentMedications] = useState("");
  const [tempMedications, setTempMedications] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("timeline");

  // Load notifications when notifications tab is accessed
  useEffect(() => {
    if (
      activeTab === "notifications" &&
      notifications.length === 0 &&
      !loadingNotifications
    ) {
      const loadNotifications = async () => {
        setLoadingNotifications(true);
        try {
          const response = await fetch("/api/patient/notifications");
          const result = await response.json();
          if (result.success) {
            setNotifications(result.notifications);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        } finally {
          setLoadingNotifications(false);
        }
      };
      loadNotifications();
    }
  }, [activeTab]);
  const [isEditingContacts, setIsEditingContacts] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    contactNumber: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
  });
  const [tempContactInfo, setTempContactInfo] = useState({
    contactNumber: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    address: "",
    insuranceProvider: "",
    insurancePolicyNo: "",
  });
  const [tempProfileInfo, setTempProfileInfo] = useState({
    address: "",
    insuranceProvider: "",
    insurancePolicyNo: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchPatientData = async () => {
      const supabase = createClient();

      try {
        // Fetch patient profile via secure API
        const profileResponse = await fetch("/api/patient/get-profile");
        const profileResult = await profileResponse.json();

        if (!profileResult.success) {
          if (profileResponse.status === 401) {
            router.push("/");
            return;
          }
          setError("Failed to load patient profile");
          return;
        }

        const profile = profileResult.profile;

        setPatientProfile(profile);
        setCurrentMedications(profile.current_medications || "");
        setTempMedications(profile.current_medications || "");

        const contacts = {
          contactNumber: profile.contact_number || "",
          emergencyContactName: profile.emergency_contact_name || "",
          emergencyContactNumber: profile.emergency_contact_number || "",
        };
        setContactInfo(contacts);
        setTempContactInfo(contacts);

        const profileData = {
          address: profile.address || "",
          insuranceProvider: profile.insurance_provider || "",
          insurancePolicyNo: profile.insurance_policy_no || "",
        };
        setProfileInfo(profileData);
        setTempProfileInfo(profileData);

        // Fetch health records via secure API
        const recordsResponse = await fetch("/api/patient/get-records");
        const recordsResult = await recordsResponse.json();

        if (!recordsResult.success) {
          setError("Failed to load health records");
          return;
        }

        // Transform the data to match our interface
        const transformedRecords: HealthRecord[] = (
          recordsResult.records || []
        ).map((record) => ({
          ...record,
          doctor_name: record.doctor?.name || "Unknown Doctor",
          hospital: record.doctor?.hospital || "Unknown Hospital",
        }));

        setHealthRecords(transformedRecords);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setError("Failed to load patient data");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [router]);

  const filteredRecords = healthRecords.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.report_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.doctor_name &&
        record.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.hospital &&
        record.hospital.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" ||
      record.report_type.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your health data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!patientProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              Patient profile not found
            </p>
            <Button onClick={() => router.push("/")}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const patientInfo = {
    name: patientProfile.name,
    healthId: patientProfile.vh_id || "Not Set",
    vhealthId: patientProfile.vh_id || "Generating...",
    passwordEnabled: !!patientProfile.has_password,
    oauthProvider: "google",
    bloodGroup: patientProfile.blood_group || "Not Set",
    age: patientProfile.date_of_birth
      ? (() => {
          const today = new Date();
          const birthDate = new Date(patientProfile.date_of_birth);
          let years = today.getFullYear() - birthDate.getFullYear();
          let months = today.getMonth() - birthDate.getMonth();

          if (months < 0) {
            years--;
            months += 12;
          }

          return `${years} years ${months} months`;
        })()
      : "Not Set",
    gender: patientProfile.gender || "Not Set",
    contactNumber: patientProfile.contact_number || "Not Set",
    emergencyContact: patientProfile.emergency_contact_number || "Not Set",
    emergencyContactName: patientProfile.emergency_contact_name || "Not Set",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <PatientHeader
        patient={patientInfo}
        onNotificationClick={() => setActiveTab("notifications")}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Patient Info Card */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  Patient Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{patientInfo.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">VHealth ID:</span>
                    <span className="font-mono text-xs bg-primary/10 px-2 py-1 rounded">
                      {patientInfo.vhealthId}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Blood Group:</span>
                    <Badge variant="outline" className="text-xs">
                      {patientInfo.bloodGroup}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Age:</span>
                    <span>{patientInfo.age}</span>
                  </div>
                </div>

                {!patientInfo.passwordEnabled && (
                  <div className="pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      Set Password for VHealth ID
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Enable login with VHealth ID + password
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Health Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Records
                  </span>
                  <Badge variant="secondary">{healthRecords.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last Visit
                  </span>
                  <span className="text-sm">
                    {healthRecords.length > 0
                      ? new Date(
                          healthRecords[0].created_at
                        ).toLocaleDateString("en-IN")
                      : "No visits"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Hospitals
                  </span>
                  <span className="text-sm">
                    {new Set(healthRecords.map((r) => r.hospital)).size}{" "}
                    Different
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search" className="sr-only">
                      Search records
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by doctor, hospital, or procedure..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="all">All Categories</option>
                      <option value="blood">Blood Test</option>
                      <option value="x-ray">X-Ray</option>
                      <option value="mri">MRI</option>
                      <option value="prescription">Prescription</option>
                      <option value="consultation">Consultation</option>
                    </select>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Records */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="timeline">Timeline View</TabsTrigger>
                <TabsTrigger value="records">Records List</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="space-y-6">
                <HealthTimeline records={filteredRecords} />
              </TabsContent>

              <TabsContent value="records" className="space-y-4">
                {filteredRecords.length === 0 ? (
                  <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                    <CardContent className="pt-6 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No health records found
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your medical reports will appear here once uploaded by
                        healthcare providers
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredRecords.map((record) => (
                    <Card
                      key={record.id}
                      className="bg-card/80 backdrop-blur-sm border-border/50"
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              <h3 className="font-semibold">{record.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {record.report_type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(record.created_at).toLocaleDateString(
                                  "en-IN"
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Hospital className="h-3 w-3" />
                                {record.hospital}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {record.doctor_name}
                              </div>
                            </div>
                            {record.clinical_notes && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {record.clinical_notes}
                              </p>
                            )}
                            {record.file_name && (
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-xs"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  {record.file_name}
                                  {record.file_size && (
                                    <span className="ml-1 text-muted-foreground">
                                      (
                                      {record.file_size >= 1024 * 1024
                                        ? `${(
                                            record.file_size /
                                            1024 /
                                            1024
                                          ).toFixed(1)} MB`
                                        : `${(record.file_size / 1024).toFixed(
                                            0
                                          )} KB`}
                                      )
                                    </span>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            completed
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Emergency Access Notifications</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          setLoadingNotifications(true);
                          try {
                            const response = await fetch(
                              "/api/patient/notifications"
                            );
                            const result = await response.json();
                            if (result.success) {
                              setNotifications(result.notifications);
                            }
                          } catch (error) {
                            console.error(
                              "Error fetching notifications:",
                              error
                            );
                          } finally {
                            setLoadingNotifications(false);
                          }
                        }}
                        disabled={loadingNotifications}
                      >
                        {loadingNotifications ? "Loading..." : "Refresh"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {notifications.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          No emergency access notifications
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          You'll be notified when doctors access your emergency
                          medical records
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="border rounded-lg p-4 bg-muted/30"
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 bg-red-500 rounded-full" />
                                  <h4 className="font-semibold text-sm">
                                    Emergency Records Accessed
                                  </h4>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Dr. {notification.doctor?.name || "Unknown"} (
                                  {notification.doctor?.specialization ||
                                    "General"}
                                  ) from{" "}
                                  {notification.doctor?.hospital ||
                                    "Unknown Hospital"}{" "}
                                  accessed your medical records.
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(
                                    notification.accessed_at
                                  ).toLocaleString("en-IN", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                              <Badge variant="destructive" className="text-xs">
                                Emergency
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                {/* Current Medications */}
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Current Medications</span>
                      {!isEditingMedications ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingMedications(true)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              try {
                                const response = await fetch(
                                  "/api/patient/update-profile",
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      currentMedications: tempMedications,
                                      patientId: patientProfile?.id,
                                    }),
                                  }
                                );

                                const result = await response.json();

                                if (!response.ok) {
                                  throw new Error(
                                    result.error ||
                                      "Failed to update medications"
                                  );
                                }

                                setCurrentMedications(tempMedications);
                                setIsEditingMedications(false);
                                alert("Medications updated successfully!");
                              } catch (error: any) {
                                console.error(
                                  "Error updating medications:",
                                  error
                                );
                                alert(
                                  error.message ||
                                    "Failed to update medications"
                                );
                              }
                            }}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setTempMedications(currentMedications);
                              setIsEditingMedications(false);
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!isEditingMedications ? (
                      <div className="space-y-2">
                        {currentMedications ? (
                          <p className="text-sm whitespace-pre-wrap">
                            {currentMedications}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            No current medications listed
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="medications">
                          Update your current medications
                        </Label>
                        <Textarea
                          id="medications"
                          placeholder="List your current medications, dosages, and frequency...\n\nExample:\n- Metformin 500mg - twice daily\n- Lisinopril 10mg - once daily\n- Vitamin D3 1000IU - once daily"
                          value={tempMedications}
                          onChange={(e) => setTempMedications(e.target.value)}
                          rows={6}
                        />
                        <p className="text-xs text-muted-foreground">
                          Keep this updated so doctors have accurate information
                          during emergencies
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Change Password */}
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (passwordForm.new !== passwordForm.confirm) {
                          alert("New passwords don't match");
                          return;
                        }

                        setIsChangingPassword(true);
                        try {
                          const response = await fetch(
                            "/api/patient/change-password",
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                currentPassword: passwordForm.current,
                                newPassword: passwordForm.new,
                                patientId: patientProfile?.id,
                              }),
                            }
                          );

                          const result = await response.json();

                          if (!response.ok) {
                            throw new Error(
                              result.error || "Failed to change password"
                            );
                          }

                          setPasswordForm({
                            current: "",
                            new: "",
                            confirm: "",
                          });
                          alert("Password changed successfully!");

                          // Update local state
                          if (patientProfile) {
                            setPatientProfile({
                              ...patientProfile,
                              has_password: true,
                            });
                          }
                        } catch (error: any) {
                          console.error("Password change error:", error);
                          alert(error.message || "Failed to change password");
                        } finally {
                          setIsChangingPassword(false);
                        }
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="current-password">
                          Current Password
                        </Label>
                        <Input
                          id="current-password"
                          type="password"
                          placeholder="Enter current password"
                          value={passwordForm.current}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              current: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="Enter new password"
                          value={passwordForm.new}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              new: e.target.value,
                            }))
                          }
                          required
                          minLength={6}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm new password"
                          value={passwordForm.confirm}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              confirm: e.target.value,
                            }))
                          }
                          required
                          minLength={6}
                        />
                      </div>
                      <Button type="submit" disabled={isChangingPassword}>
                        {isChangingPassword
                          ? "Changing Password..."
                          : "Change Password"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Contact Information</span>
                      {!isEditingContacts ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingContacts(true)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              try {
                                const response = await fetch(
                                  "/api/patient/update-contacts",
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      ...tempContactInfo,
                                      patientId: patientProfile?.id,
                                    }),
                                  }
                                );

                                const result = await response.json();

                                if (!response.ok) {
                                  throw new Error(
                                    result.error || "Failed to update contacts"
                                  );
                                }

                                setContactInfo(tempContactInfo);
                                setIsEditingContacts(false);
                                alert(
                                  "Contact information updated successfully!"
                                );
                              } catch (error: any) {
                                console.error(
                                  "Error updating contacts:",
                                  error
                                );
                                alert(
                                  error.message || "Failed to update contacts"
                                );
                              }
                            }}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setTempContactInfo(contactInfo);
                              setIsEditingContacts(false);
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!isEditingContacts ? (
                      <>
                        <div>
                          <Label className="text-sm font-medium">
                            Contact Number
                          </Label>
                          <p className="text-sm">
                            {contactInfo.contactNumber || "Not Set"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Emergency Contact Name
                          </Label>
                          <p className="text-sm">
                            {contactInfo.emergencyContactName || "Not Set"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Emergency Contact Number
                          </Label>
                          <p className="text-sm">
                            {contactInfo.emergencyContactNumber || "Not Set"}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="contact-number">Contact Number</Label>
                          <Input
                            id="contact-number"
                            placeholder="Enter your contact number"
                            value={tempContactInfo.contactNumber}
                            onChange={(e) =>
                              setTempContactInfo((prev) => ({
                                ...prev,
                                contactNumber: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergency-name">
                            Emergency Contact Name
                          </Label>
                          <Input
                            id="emergency-name"
                            placeholder="Enter emergency contact name"
                            value={tempContactInfo.emergencyContactName}
                            onChange={(e) =>
                              setTempContactInfo((prev) => ({
                                ...prev,
                                emergencyContactName: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergency-number">
                            Emergency Contact Number
                          </Label>
                          <Input
                            id="emergency-number"
                            placeholder="Enter emergency contact number"
                            value={tempContactInfo.emergencyContactNumber}
                            onChange={(e) =>
                              setTempContactInfo((prev) => ({
                                ...prev,
                                emergencyContactNumber: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Additional Profile Information */}
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Additional Information</span>
                      {!isEditingProfile ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingProfile(true)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              try {
                                const response = await fetch(
                                  "/api/patient/update-profile",
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      ...tempProfileInfo,
                                      patientId: patientProfile?.id,
                                    }),
                                  }
                                );

                                const result = await response.json();

                                if (!response.ok) {
                                  throw new Error(
                                    result.error || "Failed to update profile"
                                  );
                                }

                                setProfileInfo(tempProfileInfo);
                                setIsEditingProfile(false);
                                alert("Profile updated successfully!");
                              } catch (error: any) {
                                console.error("Error updating profile:", error);
                                alert(
                                  error.message || "Failed to update profile"
                                );
                              }
                            }}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setTempProfileInfo(profileInfo);
                              setIsEditingProfile(false);
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!isEditingProfile ? (
                      <>
                        <div>
                          <Label className="text-sm font-medium">Address</Label>
                          <p className="text-sm">
                            {profileInfo.address || "Not Set"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Insurance Provider
                          </Label>
                          <p className="text-sm">
                            {profileInfo.insuranceProvider || "Not Set"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Insurance Policy Number
                          </Label>
                          <p className="text-sm">
                            {profileInfo.insurancePolicyNo || "Not Set"}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Textarea
                            id="address"
                            placeholder="Enter your address"
                            value={tempProfileInfo.address}
                            onChange={(e) =>
                              setTempProfileInfo((prev) => ({
                                ...prev,
                                address: e.target.value,
                              }))
                            }
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="insurance-provider">
                            Insurance Provider
                          </Label>
                          <Input
                            id="insurance-provider"
                            placeholder="Enter insurance provider name"
                            value={tempProfileInfo.insuranceProvider}
                            onChange={(e) =>
                              setTempProfileInfo((prev) => ({
                                ...prev,
                                insuranceProvider: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="insurance-policy">
                            Insurance Policy Number
                          </Label>
                          <Input
                            id="insurance-policy"
                            placeholder="Enter policy number"
                            value={tempProfileInfo.insurancePolicyNo}
                            onChange={(e) =>
                              setTempProfileInfo((prev) => ({
                                ...prev,
                                insurancePolicyNo: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Basic Profile Information */}
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">
                          VHealth ID
                        </Label>
                        <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {patientInfo.vhealthId}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Blood Group
                        </Label>
                        <p className="text-sm">{patientInfo.bloodGroup}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Age</Label>
                        <p className="text-sm">{patientInfo.age}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Gender</Label>
                        <p className="text-sm">{patientInfo.gender}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {patientProfile && (
        <SetPasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          patientId={patientProfile.id}
          vhealthId={patientProfile.vh_id || ""}
        />
      )}
    </div>
  );
}
