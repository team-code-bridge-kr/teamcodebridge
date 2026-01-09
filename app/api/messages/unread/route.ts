import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// 읽지 않은 메시지 개수 조회
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    try {
        // 각 사용자별로 읽지 않은 메시지 개수 조회
        const unreadCounts = await prisma.message.groupBy({
            by: ['senderId'],
            where: {
                receiverId: userId,
                read: false
            },
            _count: {
                id: true
            }
        })

        // 결과를 객체로 변환 { senderId: count }
        const result: Record<string, number> = {}
        unreadCounts.forEach(item => {
            result[item.senderId] = item._count.id
        })

        // 전체 읽지 않은 메시지 개수
        const totalUnread = await prisma.message.count({
            where: {
                receiverId: userId,
                read: false
            }
        })

        return NextResponse.json({
            byUser: result,
            total: totalUnread
        })
    } catch (error) {
        console.error('Error fetching unread messages:', error)
        return NextResponse.json({ error: 'Failed to fetch unread messages' }, { status: 500 })
    }
}


