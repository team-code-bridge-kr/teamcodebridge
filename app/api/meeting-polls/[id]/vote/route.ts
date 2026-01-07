import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// 투표하기
export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const body = await request.json()
        const { optionId, action } = body // action: 'add' or 'remove'

        if (!optionId) {
            return NextResponse.json({ error: 'optionId is required' }, { status: 400 })
        }

        // 기존 투표가 있는지 확인 (이제 optionId와 userId로 확인)
        const existingVote = await prisma.pollVote.findUnique({
            where: {
                optionId_userId: {
                    optionId: optionId,
                    userId: user.id,
                },
            },
        })

        if (action === 'remove' && existingVote) {
            // 투표 제거
            await prisma.pollVote.delete({
                where: { id: existingVote.id },
            })
            return NextResponse.json({ message: 'Vote removed' })
        } else if (action === 'add' || !action) {
            // 투표 추가 (이미 있으면 무시)
            if (existingVote) {
                return NextResponse.json({ message: 'Already voted' })
            }
            
            const vote = await prisma.pollVote.create({
                data: {
                    pollId: params.id,
                    optionId,
                    userId: user.id,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                    option: true,
                },
            })

            return NextResponse.json(vote, { status: 201 })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    } catch (error) {
        console.error('Error voting:', error)
        return NextResponse.json({ error: 'Failed to vote' }, { status: 500 })
    }
}

