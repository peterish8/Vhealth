import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    // Get doctor profile
    const { data: doctor, error: doctorError } = await supabase
      .from("doctors")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (doctorError || !doctor) {
      return Response.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Get high priority patients (levels 3-5)
    const { data: highPriorityPatients, error: patientsError } = await supabase
      .from("patients")
      .select(
        `
        id,
        vh_id,
        name,
        chronic_conditions,
        allergies,
        current_medications,
        blood_group,
        emergency_contact_name,
        emergency_contact_number,
        priority_level:calculate_patient_priority(chronic_conditions, allergies, current_medications)
      `
      )
      .gte(
        "calculate_patient_priority(chronic_conditions, allergies, current_medications)",
        3
      )
      .order(
        "calculate_patient_priority(chronic_conditions, allergies, current_medications)",
        { ascending: false }
      );

    if (patientsError) {
      console.error("Error fetching patients:", patientsError);
      return Response.json(
        { error: "Failed to fetch patients" },
        { status: 500 }
      );
    }

    // Transform the data to include priority level description
    const transformedPatients = highPriorityPatients.map((patient) => ({
      ...patient,
      priority_description: getPriorityDescription(patient.priority_level),
      condition_count: patient.chronic_conditions?.length || 0,
      medication_count:
        (patient.current_medications?.match(/\n/g) || []).length + 1,
    }));

    return Response.json({
      success: true,
      patients: transformedPatients,
    });
  } catch (error) {
    console.error("Emergency patients API error:", error);
    return Response.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

function getPriorityDescription(level: number): string {
  switch (level) {
    case 5:
      return "Critical Priority - Immediate Attention Required";
    case 4:
      return "High Priority - Urgent Care Needed";
    case 3:
      return "Medium Priority - Elevated Risk";
    case 2:
      return "Low Priority - Stable Condition";
    case 1:
      return "Standard Priority - Regular Care";
    default:
      return "Priority Not Assessed";
  }
}
