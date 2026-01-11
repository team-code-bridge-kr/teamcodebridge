import { NextResponse } from 'next/server'
import { PrismaClient, TaskStatus } from '@prisma/client'

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
        let taskStatusUpdate: { status?: TaskStatus } = {}
        
        // Map incoming status to Prisma TaskStatus enum
        const statusMap: Record<string, TaskStatus> = {
            '진행 중': TaskStatus.IN_PROGRESS,
            '대기': TaskStatus.PENDING,
            '완료': TaskStatus.COMPLETED,
            '차단됨': TaskStatus.BLOCKED,
            '지연': TaskStatus.DEFERRED,
            'IN_PROGRESS': TaskStatus.IN_PROGRESS,
            'PENDING': TaskStatus.PENDING,
            'COMPLETED': TaskStatus.COMPLETED,
            'BLOCKED': TaskStatus.BLOCKED,
            'DEFERRED': TaskStatus.DEFERRED,
        }
        
        if (status && statusMap[status]) {
            taskStatusUpdate = { status: statusMap[status] }
        } else if (risks !== undefined) {
            // Ignition -> In Progress
            taskStatusUpdate = { status: TaskStatus.IN_PROGRESS }
        } else if (lastStableState !== undefined) {
            // Clear -> Pending
            taskStatusUpdate = { status: TaskStatus.PENDING }
        }

        console.log('[Context API] Updating task:', taskId, 'with status:', taskStatusUpdate)

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

        console.log('[Context API] Successfully updated task status')
        return NextResponse.json(capsule)
    } catch (error) {
        console.error('[Context API] Failed to update:', error)
        return NextResponse.json({ error: 'Failed to update context capsule' }, { status: 500 })
    }
}

