import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendPollFinalizedEmail } from '@/lib/email'

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

        // 최종 일정이 확정된 경우 모든 멘토에게 이메일 발송
        if (selectedOptionId && status === '완료') {
            try {
                const selectedOption = poll.options.find(opt => opt.id === selectedOptionId)
                if (selectedOption) {
                    const selectedDate = new Date(selectedOption.startDate)
                    const dateStr = selectedDate.toLocaleDateString('ko-KR', { 
                        month: 'long', 
                        day: 'numeric', 
                        weekday: 'short' 
                    })
                    const timeStr = selectedDate.toLocaleTimeString('ko-KR', { 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        hour12: false 
                    })

                    const allMentors = await prisma.user.findMany({
                        where: {
                            role: 'MENTOR',
                            email: { not: null },
                        },
                        select: {
                            email: true,
                        },
                    })
                    
                    const recipientEmails = allMentors
                        .map(m => m.email)
                        .filter((email): email is string => email !== null)
                    
                    if (recipientEmails.length > 0) {
                        // 비동기로 이메일 발송
                        sendPollFinalizedEmail(
                            poll.title,
                            dateStr,
                            timeStr,
                            recipientEmails
                        ).catch(err => {
                            console.error('Failed to send poll finalized email:', err)
                        })
                    }
                }
            } catch (emailError) {
                console.error('Error sending poll finalized email:', emailError)
                // 이메일 발송 실패해도 일정 확정은 성공으로 처리
            }
        }

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

