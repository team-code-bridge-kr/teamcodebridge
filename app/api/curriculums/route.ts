import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET: 모든 커리큘럼 조회
export async function GET() {
    try {
        const curriculums = await prisma.curriculum.findMany({
            include: {
                sessions: {
                    orderBy: {
                        sessionNumber: 'asc'
                    }
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(curriculums)
    } catch (error) {
        console.error('Failed to fetch curriculums:', error)
        return NextResponse.json({ error: 'Failed to fetch curriculums' }, { status: 500 })
    }
}

// POST: 새 커리큘럼 생성
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const body = await request.json()
        const {
            name,
            description,
            motivation,
            benefits,
            minMentors,
            recommendedStudents,
            expectedEffect,
            sessions
        } = body

        // 커리큘럼 생성
        const curriculum = await prisma.curriculum.create({
            data: {
                name,
                description,
                motivation,
                benefits,
                minMentors: parseInt(minMentors),
                recommendedStudents: parseInt(recommendedStudents),
                expectedEffect,
                createdById: user.id,
                sessions: {
                    create: sessions.map((session: any) => ({
                        sessionNumber: session.sessionNumber,
                        sessionName: session.sessionName,
                        scheduledDate: session.scheduledDate || null,
                        location: session.location || null,
                        goal: session.goal,
                        content: session.content
                    }))
                }
            },
            include: {
                sessions: {
                    orderBy: {
                        sessionNumber: 'asc'
                    }
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        })

        return NextResponse.json(curriculum, { status: 201 })
    } catch (error) {
        console.error('Failed to create curriculum:', error)
        return NextResponse.json({ error: 'Failed to create curriculum' }, { status: 500 })
    }
}

