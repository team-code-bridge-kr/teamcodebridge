import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, status, priority, timeline, driveUrl, projectId, ownerId, mission, parentId, dependsOnId, depth } = body

        const task = await prisma.task.create({
            data: {
                name,
                status: status || '대기',
                priority: priority || '중간',
                timeline,
                driveUrl,
                projectId,
                ownerId,
                parentId: parentId || null,
                dependsOnId: dependsOnId || null,
                depth: depth ?? 0,
                context: mission ? {
                    create: {
                        mission
                    }
                } : undefined
            },
            include: {
                owner: true,
                context: true,
                project: true
            }
        })
        return NextResponse.json(task)
    } catch (error) {
        console.error("Failed to create task:", error)
        console.error("Error details:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
