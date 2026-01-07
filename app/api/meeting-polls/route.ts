import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// 회의 투표 목록 조회
export async function GET() {
    try {
        // 진행중인 투표만 가져오고, 최대 20개로 제한
        const polls = await prisma.meetingPoll.findMany({
            where: {
                status: '진행중'
            },
            take: 20,  // 최대 20개만
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                selectedOptionId: true,
                voteDeadline: true,
                createdAt: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                options: {
                    select: {
                        id: true,
                        startDate: true,
                        endDate: true,
                    },
                    orderBy: {
                        startDate: 'asc',
                    },
                    take: 50,  // 옵션도 최대 50개만
                },
            },
        })

        // votes는 별도 쿼리로 (필요한 경우만)
        const pollsWithVoteCounts = await Promise.all(
            polls.map(async (poll) => {
                const optionsWithCounts = await Promise.all(
                    poll.options.map(async (option) => {
                        const voteCount = await prisma.pollVote.count({
                            where: { optionId: option.id }
                        })
                        return {
                            ...option,
                            voteCount
                        }
                    })
                )
                return {
                    ...poll,
                    options: optionsWithCounts
                }
            })
        )

        return NextResponse.json(pollsWithVoteCounts)
    } catch (error: any) {
        console.error('Error fetching meeting polls:', error)
        // voteDeadline 필드 에러 처리
        if (error?.code === 'P2021' || error?.message?.includes('voteDeadline')) {
            return NextResponse.json([])
        }
        return NextResponse.json({ 
            error: 'Failed to fetch meeting polls',
            details: error?.message || String(error)
        }, { status: 500 })
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
    } catch (error: any) {
        console.error('Error creating meeting poll:', error)
        console.error('Error details:', {
            message: error?.message,
            code: error?.code,
            meta: error?.meta,
            stack: error?.stack
        })
        return NextResponse.json({ 
            error: 'Failed to create meeting poll',
            details: error?.message || String(error),
            code: error?.code
        }, { status: 500 })
    }
}

