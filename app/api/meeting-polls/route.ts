import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// 회의 투표 목록 조회
export async function GET() {
    try {
        const polls = await prisma.meetingPoll.findMany({
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
                options: {
                    include: {
                        votes: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        image: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        startDate: 'asc',
                    },
                },
            },
        })

        return NextResponse.json(polls)
    } catch (error) {
        console.error('Error fetching meeting polls:', error)
        return NextResponse.json({ error: 'Failed to fetch meeting polls' }, { status: 500 })
    }
}

// 회의 투표 생성
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
        const { title, description, voteDeadline, options } = body

        if (!title || !options || !Array.isArray(options) || options.length === 0) {
            return NextResponse.json({ error: 'Title and at least one option are required' }, { status: 400 })
        }

        const poll = await prisma.meetingPoll.create({
            data: {
                title,
                description,
                voteDeadline: voteDeadline ? new Date(voteDeadline) : null,
                createdById: user.id,
                options: {
                    create: options.map((opt: { startDate: string; endDate?: string }) => ({
                        startDate: new Date(opt.startDate),
                        endDate: opt.endDate ? new Date(opt.endDate) : null,
                    })),
                },
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                options: {
                    include: {
                        votes: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        image: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        return NextResponse.json(poll, { status: 201 })
    } catch (error) {
        console.error('Error creating meeting poll:', error)
        return NextResponse.json({ error: 'Failed to create meeting poll' }, { status: 500 })
    }
}

