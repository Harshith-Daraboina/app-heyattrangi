import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ appointmentId: string }> }
) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "DOCTOR") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { appointmentId } = await params
        const { notes } = await req.json()

        const appointment = await prisma.appointment.update({
            where: { id: appointmentId },
            data: { doctorNotes: notes },
        })

        return NextResponse.json({
            success: true,
            notes: appointment.doctorNotes
        })

    } catch (error) {
        console.error("Notes API Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
