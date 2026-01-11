import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/tasks/[id]/links - Get all links for a task
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const links = await prisma.taskLink.findMany({
            where: { taskId: params.id },
            orderBy: [
                { isRequired: 'desc' },
                { createdAt: 'asc' }
            ]
        })
        return NextResponse.json(links)
    } catch (error) {
        console.error('Failed to fetch task links:', error)
        return NextResponse.json({ error: 'Failed to fetch task links' }, { status: 500 })
    }
}

// POST /api/tasks/[id]/links - Add a link to a task
export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { linkType, url, repoPath, artifactId, label, isRequired } = body

        // Validate linkType
        const validLinkTypes = ['SPEC', 'DESIGN', 'CODE', 'DATA', 'PARENT', 'BLOCKER', 'RELATED']
        if (!linkType || !validLinkTypes.includes(linkType)) {
            return NextResponse.json({ 
                error: 'Invalid or missing linkType. Must be one of: ' + validLinkTypes.join(', ') 
            }, { status: 400 })
        }

        // Validate that at least one target is provided
        if (!url && !repoPath && !artifactId) {
            return NextResponse.json({ 
                error: 'At least one of url, repoPath, or artifactId must be provided' 
            }, { status: 400 })
        }

        // Verify task exists
        const task = await prisma.task.findUnique({
            where: { id: params.id }
        })
        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 })
        }

        const link = await prisma.taskLink.create({
            data: {
                taskId: params.id,
                linkType,
                url,
                repoPath,
                artifactId,
                label,
                isRequired: isRequired ?? false
            }
        })

        return NextResponse.json(link, { status: 201 })
    } catch (error) {
        console.error('Failed to create task link:', error)
        return NextResponse.json({ error: 'Failed to create task link' }, { status: 500 })
    }
}
