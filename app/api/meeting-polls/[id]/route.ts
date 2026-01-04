import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// 회의 투표 상세 조회
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const poll = await prisma.meetingPoll.findUnique({
            where: { id: params.id },
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

        if (!poll) {
            return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
        }

        return NextResponse.json(poll)
    } catch (error) {
        console.error('Error fetching meeting poll:', error)
        return NextResponse.json({ error: 'Failed to fetch meeting poll' }, { status: 500 })
    }
}

// 회의 투표 완료 처리 (최종 일정 선택)
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { selectedOptionId, status } = body

        const poll = await prisma.meetingPoll.update({
            where: { id: params.id },
            data: {
                ...(selectedOptionId !== undefined && { selectedOptionId }),
                ...(status !== undefined && { status }),
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

        return NextResponse.json(poll)
    } catch (error) {
        console.error('Error updating meeting poll:', error)
        return NextResponse.json({ error: 'Failed to update meeting poll' }, { status: 500 })
    }
}

// 회의 투표 삭제
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.meetingPoll.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting meeting poll:', error)
        return NextResponse.json({ error: 'Failed to delete meeting poll' }, { status: 500 })
    }
}

