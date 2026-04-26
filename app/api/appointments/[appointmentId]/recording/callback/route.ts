import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ appointmentId: string }> }
) {
    try {
        const { appointmentId } = await params
        const body = await req.json()

        if (body.error) {
            console.error(`Transcription error for ${appointmentId}:`, body.error)
            return NextResponse.json({ success: false })
        }

        if (body.success && body.transcript) {
            // Update the DB with the transcript
            await prisma.sessionRecording.update({
                where: { appointmentId },
                data: {
                    transcript: body.transcript,
                    duration: Math.round(body.duration || 0),
                },
            })
            console.log(`Transcription successfully received and saved for ${appointmentId}`)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Transcription Callback Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
