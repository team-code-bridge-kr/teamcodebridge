import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const senderId = searchParams.get('senderId')
    const receiverId = searchParams.get('receiverId')
    const chatRoomId = searchParams.get('chatRoomId')

    try {
        // 그룹 채팅 메시지 조회
        if (chatRoomId) {
            if (!senderId) {
                return NextResponse.json({ error: 'Missing senderId for chat room' }, { status: 400 })
            }

            // 채팅방 멤버인지 확인
            const member = await prisma.chatRoomMember.findUnique({
                where: {
                    chatRoomId_userId: {
                        chatRoomId,
                        userId: senderId
                    }
                }
            })

            if (!member) {
                return NextResponse.json({ error: 'Not a member of this chat room' }, { status: 403 })
            }

            const messages = await prisma.message.findMany({
                where: {
                    chatRoomId
                },
                orderBy: {
                    createdAt: 'asc'
                },
                include: {
                    sender: {
                        select: { name: true, image: true }
                    }
                }
            })

            const formattedMessages = messages.map((msg: any) => ({
                id: msg.id,
                content: msg.content,
                senderId: msg.senderId,
                senderName: msg.sender.name,
                senderImage: msg.sender.image,
                createdAt: msg.createdAt,
                isMyMessage: msg.senderId === senderId,
                read: msg.read
            }))

            return NextResponse.json(formattedMessages)
        }

        // 1:1 채팅 메시지 조회
        if (!senderId || !receiverId) {
            return NextResponse.json({ error: 'Missing senderId or receiverId' }, { status: 400 })
        }

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
                ],
                chatRoomId: null // 1:1 채팅만
            },
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                sender: {
                    select: { name: true, image: true }
                }
            }
        })

        const formattedMessages = messages.map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            senderId: msg.senderId,
            senderName: msg.sender.name,
            senderImage: msg.sender.image,
            createdAt: msg.createdAt,
            isMyMessage: msg.senderId === senderId,
            read: msg.read
        }))

        return NextResponse.json(formattedMessages)
    } catch (error) {
        console.error('Error fetching messages:', error)
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const { content, senderId, receiverId, chatRoomId } = await request.json()

        if (!content || !senderId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 그룹 채팅 또는 1:1 채팅 중 하나만 있어야 함
        if (!receiverId && !chatRoomId) {
            return NextResponse.json({ error: 'Either receiverId or chatRoomId is required' }, { status: 400 })
        }

        if (receiverId && chatRoomId) {
            return NextResponse.json({ error: 'Cannot specify both receiverId and chatRoomId' }, { status: 400 })
        }

        // ID 검증: 실제로 User 테이블에 존재하는지 확인
        const sender = await prisma.user.findUnique({
            where: { id: senderId }
        })

        if (!sender) {
            console.error(`Sender ID not found: ${senderId}`)
            return NextResponse.json({ error: 'Sender not found' }, { status: 404 })
        }

        // 그룹 채팅인 경우
        if (chatRoomId) {
            // 채팅방 멤버인지 확인
            const member = await prisma.chatRoomMember.findUnique({
                where: {
                    chatRoomId_userId: {
                        chatRoomId,
                        userId: senderId
                    }
                }
            })

            if (!member) {
                return NextResponse.json({ error: 'Not a member of this chat room' }, { status: 403 })
            }

            const message = await prisma.message.create({
                data: {
                    content,
                    senderId,
                    chatRoomId
                },
                include: {
                    sender: {
                        select: { name: true, image: true }
                    }
                }
            })

            // 채팅방 업데이트 시간 갱신
            await prisma.chatRoom.update({
                where: { id: chatRoomId },
                data: { updatedAt: new Date() }
            })

            return NextResponse.json(message)
        }

        // 1:1 채팅인 경우
        if (receiverId) {
            const receiver = await prisma.user.findUnique({
                where: { id: receiverId }
            })

            if (!receiver) {
                console.error(`Receiver ID not found: ${receiverId}`)
                return NextResponse.json({ error: 'Receiver not found' }, { status: 404 })
            }

            const message = await prisma.message.create({
                data: {
                    content,
                    senderId,
                    receiverId
                },
                include: {
                    sender: {
                        select: { name: true, image: true }
                    }
                }
            })

            return NextResponse.json(message)
        }

        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
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
