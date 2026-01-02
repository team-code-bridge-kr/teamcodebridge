import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const senderId = searchParams.get('senderId')
    const receiverId = searchParams.get('receiverId')

    if (!senderId || !receiverId) {
        return NextResponse.json({ error: 'Missing senderId or receiverId' }, { status: 400 })
    }

    try {
        const messages = await (prisma as any).message.findMany({
            where: {
                OR: [
                    { senderId: senderId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            },
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                sender: {
                    select: { name: true }
                }
            }
        })

        const formattedMessages = messages.map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            senderId: msg.senderId,
            senderName: msg.sender.name,
            createdAt: msg.createdAt,
            isMyMessage: msg.senderId === senderId
        }))

        return NextResponse.json(formattedMessages)
    } catch (error) {
        console.error('Error fetching messages:', error)
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const { content, senderId, receiverId } = await request.json()

        if (!content || !senderId || !receiverId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const message = await (prisma as any).message.create({
            data: {
                content,
                senderId,
                receiverId
            }
        })

        return NextResponse.json(message)
    } catch (error) {
        console.error('Error sending message:', error)
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }
}
