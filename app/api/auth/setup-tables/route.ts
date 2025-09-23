import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Add has_password column to doctors table
    const { error: doctorsError } = await supabaseAdmin.rpc(
      "alter_table_doctors_add_has_password"
    );
    if (doctorsError) {
      throw new Error(
        `Failed to update doctors table: ${doctorsError.message}`
      );
    }

    // Add has_password column to patients table
    const { error: patientsError } = await supabaseAdmin.rpc(
      "alter_table_patients_add_has_password"
    );
    if (patientsError) {
      throw new Error(
        `Failed to update patients table: ${patientsError.message}`
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tables updated successfully",
    });
  } catch (error: any) {
    console.error("Setup tables error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to setup tables" },
      { status: 500 }
    );
  }
}
