import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const members = await prisma.user.findMany({
            orderBy: {
                name: 'asc',
            },
        })
        return NextResponse.json(members)
    } catch (error) {
        console.error('Error fetching members:', error)
        return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
    }
}
