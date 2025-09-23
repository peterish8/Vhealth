import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { userId, password, userType } = await req.json();

  if (!userId || !password || !userType) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

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

  try {
    // Update user password in auth.users
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: password }
    );

    if (authError) {
      throw new Error(`Auth update failed: ${authError.message}`);
    }

    // Update password_enabled flag in the corresponding table
    const tableName = userType === "doctor" ? "doctors" : "patients";
    const { error: dbError } = await supabaseAdmin
      .from(tableName)
      .update({ has_password: true })
      .eq("auth_user_id", userId);

    if (dbError) {
      throw new Error(`Database update failed: ${dbError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    console.error("Set password error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
