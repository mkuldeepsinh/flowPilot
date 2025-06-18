import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Here you would typically handle any cleanup needed for logout
    // For example, invalidating tokens, clearing sessions, etc.

    return new NextResponse("Logged out successfully", { status: 200 })
  } catch (error) {
    console.error("[LOGOUT_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 