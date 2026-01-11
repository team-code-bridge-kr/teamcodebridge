import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/tasks/[id] - Get single task with full context
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const task = await prisma.task.findUnique({
            where: { id: params.id },
            include: {
                owner: true,
                context: true,
                links: true,
                parent: {
                    include: {
                        context: true
                    }
                }
            }
        })

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 })
        }

        return NextResponse.json(task)
    } catch (error) {
        console.error('Failed to fetch task:', error)
        return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 })
    }
}

// PATCH /api/tasks/[id] - Update task
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { name, status, priority, timeline, driveUrl, ownerId, parentId } = body

        // Build update data (only include provided fields)
        const updateData: Record<string, any> = {}
        if (name !== undefined) updateData.name = name
        if (status !== undefined) updateData.status = status
        if (priority !== undefined) updateData.priority = priority
        if (timeline !== undefined) updateData.timeline = timeline
        if (driveUrl !== undefined) updateData.driveUrl = driveUrl
        if (ownerId !== undefined) updateData.ownerId = ownerId
        if (parentId !== undefined) updateData.parentId = parentId

        const task = await prisma.task.update({
            where: { id: params.id },
            data: updateData,
            include: {
                owner: true,
                context: true,
                links: true
            }
        })

        return NextResponse.json(task)
    } catch (error) {
        console.error('Failed to update task:', error)
        return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
    }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.task.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to delete task:', error)
        return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
    }
}
