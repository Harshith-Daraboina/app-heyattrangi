import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { patient: true },
    })

    if (!user?.patient) {
      return NextResponse.json(
        { error: "Patient profile required" },
        { status: 400 }
      )
    }

    const tasks = await prisma.dailyTask.findMany({
      where: {
        patientId: user.patient.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { title, description, type, difficulty, points, dueDate } = data

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { patient: true },
    })

    if (!user?.patient) {
      return NextResponse.json(
        { error: "Patient profile required" },
        { status: 400 }
      )
    }

    const task = await prisma.dailyTask.create({
      data: {
        patientId: user.patient.id,
        title,
        description,
        type: type || "CUSTOM",
        difficulty: difficulty || "EASY",
        points: points || 10,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { taskId, completed } = data

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { patient: true },
    })

    if (!user?.patient) {
      return NextResponse.json(
        { error: "Patient profile required" },
        { status: 400 }
      )
    }

    const task = await prisma.dailyTask.update({
      where: {
        id: taskId,
        patientId: user.patient.id, // Ensure task belongs to patient
      },
      data: {
        completed,
        completedAt: completed ? new Date() : null,
      },
    })

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    )
  }
}

