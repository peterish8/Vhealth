import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { patientId } = await req.json();

    if (!patientId) {
      return Response.json(
        { error: "Patient ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user (doctor)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get doctor profile
    const { data: doctor, error: doctorError } = await supabase
      .from("doctors")
      .select("id, name, specialization, hospital")
      .eq("auth_user_id", user.id)
      .single();

    if (doctorError || !doctor) {
      return Response.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Get patient data with calculated priority levels
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select(
        `
        id,
        vh_id,
        name,
        gender,
        date_of_birth,
        blood_group,
        chronic_conditions,
        allergies,
        current_medications,
        emergency_contact_name,
        emergency_contact_number,
        health_records (
          id,
          report_type,
          title,
          description,
          file_url,
          priority_level,
          test_date,
          created_at
        )
      `
      )
      .eq("vh_id", patientId)
      .single();

    if (patientError || !patient) {
      return Response.json({ error: "Patient not found" }, { status: 404 });
    }

    // Calculate age if date_of_birth exists
    const age = patient.date_of_birth
      ? Math.floor(
          (new Date().getTime() - new Date(patient.date_of_birth).getTime()) /
            (365.25 * 24 * 60 * 60 * 1000)
        )
      : null;

    console.log(
      "Date of birth:",
      patient.date_of_birth,
      "Calculated age:",
      age
    );

    // Log emergency access
    const { error: logError } = await supabase
      .from("emergency_access_logs")
      .insert({
        patient_id: patient.id,
        doctor_id: doctor.id,
        doctor_name: doctor.name,
        doctor_specialization: doctor.specialization,
        doctor_hospital: doctor.hospital,
        patient_vh_id: patient.vh_id,
        priority_level: Math.max(
          ...(patient.health_records?.map((r) => r.priority_level) || [0])
        ),
      });

    if (logError) {
      console.error("Error logging emergency access:", logError);
    }

    // Filter and sort records by priority
    const healthRecords = (patient.health_records || [])
      .filter((record) => record.priority_level >= 3)
      .sort((a, b) => (b.priority_level || 0) - (a.priority_level || 0));

    return Response.json({
      success: true,
      patientData: {
        ...patient,
        age: age ? `${age} years` : null,
        health_records: healthRecords,
      },
    });
  } catch (error) {
    console.error("Emergency view API error:", error);
    return Response.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
