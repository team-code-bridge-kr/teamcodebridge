import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/users - Get all users for assignment
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            where: {
                isApproved: true // Only approved users
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                team: true,
                position: true,
            },
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json(users)
    } catch (error) {
        console.error('Failed to fetch users:', error)
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
}
