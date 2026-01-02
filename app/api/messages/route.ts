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
        // ID 검증
        const sender = await prisma.user.findUnique({ where: { id: senderId } })
        const receiver = await prisma.user.findUnique({ where: { id: receiverId } })

        if (!sender || !receiver) {
            console.error(`User not found - sender: ${senderId}, receiver: ${receiverId}`)
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const messages = await prisma.message.findMany({
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

        // ID 검증: 실제로 User 테이블에 존재하는지 확인
        const sender = await prisma.user.findUnique({
            where: { id: senderId }
        })
        const receiver = await prisma.user.findUnique({
            where: { id: receiverId }
        })

        if (!sender) {
            console.error(`Sender ID not found: ${senderId}`)
            return NextResponse.json({ error: 'Sender not found' }, { status: 404 })
        }
        if (!receiver) {
            console.error(`Receiver ID not found: ${receiverId}`)
            return NextResponse.json({ error: 'Receiver not found' }, { status: 404 })
        }

        const message = await prisma.message.create({
            data: {
                content,
                senderId,
                receiverId
            }
        })

        return NextResponse.json(message)
    } catch (error: any) {
        console.error('Error sending message:', error)
        console.error('Error details:', {
            code: error.code,
            meta: error.meta,
            message: error.message
        })
        return NextResponse.json({ 
            error: 'Failed to send message',
            details: error.message 
        }, { status: 500 })
    }
}
