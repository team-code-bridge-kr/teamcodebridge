import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// 캘린더 이벤트 조회
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')

        const where: any = {}
        
        if (startDate && endDate) {
            where.OR = [
                {
                    startDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate)
                    }
                },
                {
                    AND: [
                        { startDate: { lte: new Date(endDate) } },
                        {
                            OR: [
                                { endDate: { gte: new Date(startDate) } },
                                { endDate: null }
                            ]
                        }
                    ]
                }
            ]
        }

        const events = await prisma.calendarEvent.findMany({
            where,
            orderBy: {
                startDate: 'asc',
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

        return NextResponse.json(events)
    } catch (error) {
        console.error('Error fetching calendar events:', error)
        return NextResponse.json({ error: 'Failed to fetch calendar events' }, { status: 500 })
    }
}

// 캘린더 이벤트 생성
export async function POST(request: Request) {
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
        const { title, description, startDate, endDate, location, type, color } = body

        if (!title || !startDate) {
            return NextResponse.json({ error: 'Title and startDate are required' }, { status: 400 })
        }

        const event = await prisma.calendarEvent.create({
            data: {
                title,
                description,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                location,
                type: type || '회의',
                color,
                createdById: user.id,
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

        return NextResponse.json(event, { status: 201 })
    } catch (error) {
        console.error('Error creating calendar event:', error)
        return NextResponse.json({ error: 'Failed to create calendar event' }, { status: 500 })
    }
}

