import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ appointmentId: string }> }
) {
    try {
        const { appointmentId } = await params
        const { recordingUrl } = await req.json()

        if (!recordingUrl) {
            return NextResponse.json({ error: "Missing recordingUrl" }, { status: 400 })
        }

        // 1. Create or Update SessionRecording in DB
        const sessionRecording = await prisma.sessionRecording.upsert({
            where: { appointmentId },
            update: { recordingUrl },
            create: {
                appointmentId,
                recordingUrl,
            },
        })

        // 2. Trigger Transcription via Standalone Service (Hugging Face)
        const transcriptionServiceUrl = process.env.TRANSCRIPTION_SERVICE_URL || "https://heyattrangi-spaces-open-whisper-be.hf.space/transcribe"
        // Use your public or local URL for the callback
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        const callbackUrl = `${baseUrl}/api/appointments/${appointmentId}/recording/callback`

        try {
            // We don't await this as we want to return the response immediately
            fetch(transcriptionServiceUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    appointment_id: appointmentId,
                    recording_url: recordingUrl,
                    callback_url: callbackUrl
                })
            }).catch(e => console.error("Failed to trigger transcription service:", e))
        } catch (e) {
            console.error("Transcription service call failed:", e)
        }

        return NextResponse.json({
            success: true,
            message: "Recording received and transcription triggered via local service.",
            sessionRecordingId: sessionRecording.id
        })

    } catch (error) {
        console.error("Recording API Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
