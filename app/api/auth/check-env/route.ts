import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if environment variables are available
    const envStatus = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }

    return NextResponse.json(envStatus)
  } catch (error) {
    console.error("[v0] Error checking environment variables:", error)
    return NextResponse.json(
      {
        NEXT_PUBLIC_SUPABASE_URL: false,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: false,
        error: "Failed to check environment variables",
      },
      { status: 500 },
    )
  }
}
