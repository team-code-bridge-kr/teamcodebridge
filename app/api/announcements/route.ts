import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// 공지사항 조회 (모든 사용자)
export async function GET() {
    try {
        const announcements = await prisma.announcement.findMany({
            orderBy: {
                createdAt: 'desc',
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

        return NextResponse.json(announcements)
    } catch (error) {
        console.error('Error fetching announcements:', error)
        return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 })
    }
}

// 공지사항 생성 (관리자만)
export async function POST(request: Request) {
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

        const announcement = await prisma.announcement.create({
            data: {
                title,
                content,
                category: category || '공지',
                isImportant: isImportant || false,
                createdById: user.id,
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

        return NextResponse.json(announcement, { status: 201 })
    } catch (error) {
        console.error('Error creating announcement:', error)
        return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 })
    }
}


