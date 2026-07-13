import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"
import { PlanType } from "@prisma/client"

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { plan } = data

    if (!plan || !Object.values(PlanType).includes(plan)) {
      return NextResponse.json({ error: "Invalid plan type" }, { status: 400 })
    }

    // Update user plan
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        plan: plan as PlanType,
      },
    })

    return NextResponse.json({ success: true, plan: updatedUser.plan })
  } catch (error: any) {
    console.error("Plan update error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update plan" },
      { status: 500 }
    )
  }
}
