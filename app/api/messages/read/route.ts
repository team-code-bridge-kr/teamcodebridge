import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// 메시지 읽음 처리
export async function POST(request: Request) {
    try {
        const { userId, senderId } = await request.json()

        if (!userId || !senderId) {
            return NextResponse.json({ error: 'Missing userId or senderId' }, { status: 400 })
        }

        // 해당 사용자로부터 받은 모든 읽지 않은 메시지를 읽음 처리
        await prisma.message.updateMany({
            where: {
                receiverId: userId,
                senderId: senderId,
                read: false
            },
            data: {
                read: true
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error marking messages as read:', error)
        return NextResponse.json({ error: 'Failed to mark messages as read' }, { status: 500 })
    }
}


