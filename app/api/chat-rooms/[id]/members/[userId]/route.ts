import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// 채팅방에서 멤버 제거
export async function DELETE(
    request: Request,
    { params }: { params: { id: string; userId: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 본인이 나가거나, 생성자가 제거하는 경우만 허용
        const chatRoom = await prisma.chatRoom.findUnique({
            where: { id: params.id },
            select: { createdById: true }
        })

        if (!chatRoom) {
            return NextResponse.json({ error: 'Chat room not found' }, { status: 404 })
        }

        const isOwner = chatRoom.createdById === session.user.id
        const isSelf = session.user.id === params.userId

        if (!isOwner && !isSelf) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        await prisma.chatRoomMember.delete({
            where: {
                chatRoomId_userId: {
                    chatRoomId: params.id,
                    userId: params.userId
                }
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error removing member:', error)
        return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 })
    }
}

