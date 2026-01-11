import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// DELETE /api/tasks/[id]/links/[linkId] - Remove a link from a task
export async function DELETE(
    request: Request,
    { params }: { params: { id: string; linkId: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify link exists and belongs to the task
        const link = await prisma.taskLink.findFirst({
            where: { 
                id: params.linkId,
                taskId: params.id
            }
        })
        
        if (!link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 })
        }

        await prisma.taskLink.delete({
            where: { id: params.linkId }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to delete task link:', error)
        return NextResponse.json({ error: 'Failed to delete task link' }, { status: 500 })
    }
}

// PATCH /api/tasks/[id]/links/[linkId] - Update a link
export async function PATCH(
    request: Request,
    { params }: { params: { id: string; linkId: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { linkType, url, repoPath, artifactId, label, isRequired } = body

        // Verify link exists and belongs to the task
        const existingLink = await prisma.taskLink.findFirst({
            where: { 
                id: params.linkId,
                taskId: params.id
            }
        })
        
        if (!existingLink) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 })
        }

        const link = await prisma.taskLink.update({
            where: { id: params.linkId },
            data: {
                ...(linkType && { linkType }),
                ...(url !== undefined && { url }),
                ...(repoPath !== undefined && { repoPath }),
                ...(artifactId !== undefined && { artifactId }),
                ...(label !== undefined && { label }),
                ...(isRequired !== undefined && { isRequired })
            }
        })

        return NextResponse.json(link)
    } catch (error) {
        console.error('Failed to update task link:', error)
        return NextResponse.json({ error: 'Failed to update task link' }, { status: 500 })
    }
}
