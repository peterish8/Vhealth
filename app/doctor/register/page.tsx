"use client"
"t suse client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Copy, Eye, EyeOff } from "lucide-react";

export default function DoctorRegister() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ docId: "" });
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    hospital: "",
    licenseNo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted:", formData);
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("Auth user:", user);
      if (!user) throw new Error("Not authenticated");

      const doctorData: any = {
        auth_user_id: user.id,
        name: formData.name,
        email: user.email || "",
        hospital: formData.hospital,
        license_no: formData.licenseNo,
        specialization: formData.specialization,
      };

      const { data, error } = await supabase
        .from("doctors")
        .insert(doctorData)
        .select();

      if (error) {
        console.error("Database error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        // If doctor profile already exists, update it instead
        if (error.code === "23505") {
          // unique_violation
          const { data: updateData, error: updateError } = await supabase
            .from("doctors")
            .update(doctorData)
            .eq("auth_user_id", user.id)
            .select();

          if (updateError)
            throw new Error(`Database error: ${updateError.message}`);

          setCredentials({
            docId: updateData[0].doc_id,
          });
          setStep(2);
          return;
        }
        throw new Error(`Database error: ${error.message}`);
      }

      setCredentials({
        docId: data[0].doc_id,
      });
      setStep(2);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    const text = `Doctor ID: ${credentials.docId}`;
    navigator.clipboard.writeText(text);
    toast.success("Doctor ID copied to clipboard!");
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-green-700">
                Registration Successful!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-3">
                  Your Login Credentials
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Doctor ID:</span>
                    <code className="bg-white px-2 py-1 rounded text-sm">
                      {credentials.docId}
                    </code>
                  </div>
                </div>
                <Button
                  onClick={copyCredentials}
                  className="w-full mt-3"
                  variant="outline"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Credentials
                </Button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Save these credentials safely.
                  You'll need them to login.
                </p>
              </div>

              <Button
                onClick={() => router.push("/doctor/dashboard")}
                className="w-full"
              >
                Continue to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Doctor Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              onClick={() => console.log("Form clicked")}
            >
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="specialization">Specialization *</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      specialization: e.target.value,
                    }))
                  }
                  placeholder="e.g., Cardiology"
                  required
                />
              </div>

              <div>
                <Label htmlFor="hospital">Hospital *</Label>
                <Input
                  id="hospital"
                  value={formData.hospital}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hospital: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="license">License Number *</Label>
                <Input
                  id="license"
                  value={formData.licenseNo}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      licenseNo: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Doctor Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
