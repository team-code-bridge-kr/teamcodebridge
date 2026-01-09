import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// 공지사항 수정 (관리자만)
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! }
        })

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { title, content, category, isImportant } = body

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
        }

        const announcement = await prisma.announcement.update({
            where: { id: params.id },
            data: {
                title,
                content,
                category: category || '공지',
                isImportant: isImportant || false,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

        return NextResponse.json(announcement)
    } catch (error) {
        console.error('Error updating announcement:', error)
        return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 })
    }
}

// 공지사항 삭제 (관리자만)
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! }
        })

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        await prisma.announcement.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting announcement:', error)
        return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 })
    }
}


