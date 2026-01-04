import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// 캘린더 이벤트 수정
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, description, startDate, endDate, location, type, color } = body

        const event = await prisma.calendarEvent.update({
            where: { id: params.id },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(startDate !== undefined && { startDate: new Date(startDate) }),
                ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
                ...(location !== undefined && { location }),
                ...(type !== undefined && { type }),
                ...(color !== undefined && { color }),
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

        return NextResponse.json(event)
    } catch (error) {
        console.error('Error updating calendar event:', error)
        return NextResponse.json({ error: 'Failed to update calendar event' }, { status: 500 })
    }
}

// 캘린더 이벤트 삭제
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.calendarEvent.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting calendar event:', error)
        return NextResponse.json({ error: 'Failed to delete calendar event' }, { status: 500 })
    }
}

