import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { currentPassword, newPassword, patientId } = await req.json();

    if (!currentPassword || !newPassword || !patientId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return Response.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the patient belongs to the current user
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("id, auth_user_id")
      .eq("id", patientId)
      .eq("auth_user_id", user.id)
      .single();

    if (patientError || !patient) {
      return Response.json(
        { error: "Patient not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update password in Supabase Auth
    const { error: passwordError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (passwordError) {
      console.error("Password update error:", passwordError);
      return Response.json(
        {
          error: "Failed to update password",
          details: passwordError.message,
        },
        { status: 400 }
      );
    }

    // Update has_password flag in patients table
    const { error: updateError } = await supabase
      .from("patients")
      .update({
        has_password: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", patientId);

    if (updateError) {
      console.error("Error updating password flag:", updateError);
      // Don't fail the request if this fails, password was already changed
    }

    return Response.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return Response.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
