import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export const dynamic = 'force-dynamic'

// 특정 사용자 조회
export async function GET(
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

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const targetUser = await prisma.user.findUnique({
            where: { id: params.id }
        })

        if (!targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json(targetUser)
    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
    }
}

// 사용자 수정
export async function PUT(
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

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { email, name, role, isApproved, team, position, phone, university, joinDate, status } = body

        // 이메일 중복 확인 (다른 사용자가 사용 중인지)
        if (email) {
            const existingUser = await prisma.user.findUnique({
                where: { email }
            })
            if (existingUser && existingUser.id !== params.id) {
                return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: {
                ...(email !== undefined && { email }),
                ...(name !== undefined && { name }),
                ...(role !== undefined && { role }),
                ...(isApproved !== undefined && { isApproved }),
                ...(team !== undefined && { team }),
                ...(position !== undefined && { position }),
                ...(phone !== undefined && { phone }),
                ...(university !== undefined && { university }),
                ...(joinDate !== undefined && { joinDate }),
                ...(status !== undefined && { status }),
            }
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }
}

// 사용자 삭제
export async function DELETE(
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

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        await prisma.user.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }
}

