import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, status, priority, timeline, driveUrl, projectId, ownerId, mission } = body

        const task = await prisma.task.create({
            data: {
                name,
                status,
                priority,
                timeline,
                driveUrl,
                projectId,
                ownerId,
                context: mission ? {
                    create: {
                        mission
                    }
                } : undefined
            }
        })
        return NextResponse.json(task)
    } catch (error) {
        console.error("Failed to create task:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
