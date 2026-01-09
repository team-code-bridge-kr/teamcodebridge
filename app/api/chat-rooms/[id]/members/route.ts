import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// 채팅방에 멤버 추가
export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { userId } = await request.json()

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 })
        }

        // 채팅방 존재 및 멤버 권한 확인
        const chatRoom = await prisma.chatRoom.findUnique({
            where: { id: params.id },
            include: {
                members: true
            }
        })

        if (!chatRoom) {
            return NextResponse.json({ error: 'Chat room not found' }, { status: 404 })
        }

        const isMember = chatRoom.members.some(m => m.userId === session.user.id)
        if (!isMember) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // 이미 멤버인지 확인
        const alreadyMember = chatRoom.members.some(m => m.userId === userId)
        if (alreadyMember) {
            return NextResponse.json({ error: 'User is already a member' }, { status: 400 })
        }

        // 멤버 추가
        await prisma.chatRoomMember.create({
            data: {
                chatRoomId: params.id,
                userId
            }
        })

        return NextResponse.json({ success: true }, { status: 201 })
    } catch (error) {
        console.error('Error adding member:', error)
        return NextResponse.json({ error: 'Failed to add member' }, { status: 500 })
    }
}


