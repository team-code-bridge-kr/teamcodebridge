import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { name, email } = await request.json()

        // 먼저 사용자를 이름으로 찾기
        const existingUser = await prisma.user.findFirst({
            where: { name }
        })

        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // ID로 업데이트
        const user = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                email,
                isApproved: true
            }
        })

        return NextResponse.json({ success: true, user })
    } catch (error) {
        console.error('Update user error:', error)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }
}
