import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const { userId, vhealthId, systemEmail, password, userType } = await request.json()

    if (!userId || !vhealthId || !systemEmail || !password || !userType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user || user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create a new auth user for VHealth ID login using admin API
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: systemEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        vh_id: vhealthId,
        user_type: userType,
        linked_to: userId, // Link to original OAuth user
      },
    })

    if (createError) {
      console.error("Error creating password user:", createError)
      return NextResponse.json({ error: "Failed to create password login" }, { status: 500 })
    }

    // Update the original profile to enable password login
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        password_enabled: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (updateError) {
      console.error("Error updating profile:", updateError)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Password setup completed successfully",
    })
  } catch (error) {
    console.error("Password setup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
