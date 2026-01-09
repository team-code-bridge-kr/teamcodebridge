import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// 특정 채팅방 조회
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const chatRoom = await prisma.chatRoom.findUnique({
            where: { id: params.id },
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

        if (!chatRoom) {
            return NextResponse.json({ error: 'Chat room not found' }, { status: 404 })
        }

        // 멤버인지 확인
        const isMember = chatRoom.members.some(m => m.userId === session.user.id)
        if (!isMember) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        return NextResponse.json(chatRoom)
    } catch (error) {
        console.error('Error fetching chat room:', error)
        return NextResponse.json({ error: 'Failed to fetch chat room' }, { status: 500 })
    }
}

// 채팅방 삭제 (생성자만)
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const chatRoom = await prisma.chatRoom.findUnique({
            where: { id: params.id },
            select: { createdById: true }
        })

        if (!chatRoom) {
            return NextResponse.json({ error: 'Chat room not found' }, { status: 404 })
        }

        if (chatRoom.createdById !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        await prisma.chatRoom.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting chat room:', error)
        return NextResponse.json({ error: 'Failed to delete chat room' }, { status: 500 })
    }
}

