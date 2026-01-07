import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// 사용자가 특정 옵션에 투표했는지 확인
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session || !session.user) {
            return NextResponse.json({ voted: false })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! }
        })

        if (!user) {
            return NextResponse.json({ voted: false })
        }

        const { searchParams } = new URL(request.url)
        const optionId = searchParams.get('optionId')

        if (!optionId) {
            return NextResponse.json({ error: 'optionId is required' }, { status: 400 })
        }

        const vote = await prisma.pollVote.findUnique({
            where: {
                optionId_userId: {
                    optionId: optionId,
                    userId: user.id,
                },
            },
        })

        return NextResponse.json({ voted: !!vote })
    } catch (error) {
        console.error('Error checking vote:', error)
        return NextResponse.json({ voted: false })
    }
}

