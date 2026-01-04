import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// 채팅방 목록 조회
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 현재 사용자가 멤버로 참여한 채팅방만 조회
        const chatRooms = await prisma.chatRoom.findMany({
            where: {
                members: {
                    some: {
                        userId: session.user.id
                    }
                }
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                team: true,
                                position: true
                            }
                        }
                    }
                },
                messages: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1,
                    include: {
                        sender: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })

        return NextResponse.json(chatRooms)
    } catch (error) {
        console.error('Error fetching chat rooms:', error)
        return NextResponse.json({ error: 'Failed to fetch chat rooms' }, { status: 500 })
    }
}

// 새 채팅방 생성
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { name, description, memberIds } = await request.json()

        if (!name || !memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
            return NextResponse.json({ error: 'Name and memberIds are required' }, { status: 400 })
        }

        // 생성자를 포함한 멤버 목록
        const allMemberIds = Array.from(new Set([session.user.id, ...memberIds]))

        // 채팅방 생성 및 멤버 추가
        const chatRoom = await prisma.chatRoom.create({
            data: {
                name,
                description,
                createdById: session.user.id,
                members: {
                    create: allMemberIds.map(userId => ({
                        userId
                    }))
                }
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                team: true,
                                position: true
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json(chatRoom, { status: 201 })
    } catch (error) {
        console.error('Error creating chat room:', error)
        return NextResponse.json({ error: 'Failed to create chat room' }, { status: 500 })
    }
}

