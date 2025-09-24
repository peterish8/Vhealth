import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Mark route as dynamic
export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get patient profile
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (patientError || !patient) {
      return Response.json({ error: "Patient not found" }, { status: 404 });
    }

    // Get emergency access logs with stored doctor details
    const { data: notifications, error: logsError } = await supabase
      .from("emergency_access_logs")
      .select(
        "id, accessed_at, doctor_name, doctor_specialization, doctor_hospital, patient_vh_id"
      )
      .eq("patient_id", patient.id)
      .order("accessed_at", { ascending: false })
      .limit(20);

    if (logsError) {
      console.error("Error fetching logs:", logsError);
      return Response.json({
        success: true,
        notifications: [],
      });
    }

    // Transform to match expected format
    const transformedNotifications = (notifications || []).map((log) => ({
      ...log,
      doctor: {
        name: log.doctor_name,
        specialization: log.doctor_specialization,
        hospital: log.doctor_hospital,
      },
    }));

    return Response.json({
      success: true,
      notifications: transformedNotifications,
    });
  } catch (error) {
    console.error("Notifications API error:", error);
    return Response.json({
      success: true,
      notifications: [],
    });
  }
}
