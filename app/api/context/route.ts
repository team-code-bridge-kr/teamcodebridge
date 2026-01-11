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
        const { taskId, mission, risks, lastStableState, openLoops, nextAction, status } = body

        if (!taskId) {
            return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
        }

        // Determine Task Status change (using Prisma enum values)
        let taskStatusUpdate = {}
        if (status) {
            // Map incoming status to enum value
            const statusMap: Record<string, string> = {
                '진행 중': 'IN_PROGRESS',
                '대기': 'PENDING',
                '완료': 'COMPLETED',
                '차단됨': 'BLOCKED',
                '지연': 'DEFERRED',
                // Also accept enum values directly
                'IN_PROGRESS': 'IN_PROGRESS',
                'PENDING': 'PENDING',
                'COMPLETED': 'COMPLETED',
                'BLOCKED': 'BLOCKED',
                'DEFERRED': 'DEFERRED',
            }
            taskStatusUpdate = { status: statusMap[status] || status }
        } else if (risks !== undefined) {
             // Ignition -> In Progress
            taskStatusUpdate = { status: 'IN_PROGRESS' }
        } else if (lastStableState !== undefined) {
            // Clear -> Pending
            taskStatusUpdate = { status: 'PENDING' }
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
