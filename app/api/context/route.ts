import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')

    if (!taskId) {
        return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    try {
        const capsule = await prisma.contextCapsule.findUnique({
            where: { taskId },
        })
        return NextResponse.json(capsule)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch context capsule' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { taskId, mission, risks, lastStableState, openLoops, nextAction } = body

        if (!taskId) {
            return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
        }

        // Determine Task Status change
        let taskStatusUpdate = {}
        if (risks) {
            // Ignition phase -> In Progress
            taskStatusUpdate = { status: '진행 중' }
        } else if (lastStableState) {
            // Clear phase -> Pending (Paused)
            taskStatusUpdate = { status: '대기' }
        }

        const [capsule] = await prisma.$transaction([
            prisma.contextCapsule.upsert({
                where: { taskId },
                update: {
                    mission,
                    risks,
                    lastStableState,
                    openLoops,
                    nextAction,
                },
                create: {
                    taskId,
                    mission,
                    risks,
                    lastStableState,
                    openLoops,
                    nextAction,
                },
            }),
            prisma.task.update({
                where: { id: taskId },
                data: taskStatusUpdate
            })
        ])

        return NextResponse.json(capsule)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update context capsule' }, { status: 500 })
    }
}
