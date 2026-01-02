import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// 모든 사용자 조회 (관리자만)
export async function GET() {
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

        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json(users)
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
}

// 새 사용자 생성 (관리자만)
export async function POST(request: Request) {
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
        const { email, teamcodebridgeEmail, name, role, isApproved, team, position, phone, university, joinDate, status } = body

        // 이메일 중복 확인
        if (email) {
            const existingUser = await prisma.user.findUnique({
                where: { email }
            })
            if (existingUser) {
                return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
            }
        }

        const newUser = await prisma.user.create({
            data: {
                email: email || null,
                teamcodebridgeEmail: teamcodebridgeEmail || null,
                name: name || null,
                role: role || 'MENTOR',
                isApproved: isApproved ?? false,
                team: team || null,
                position: position || null,
                phone: phone || null,
                university: university || null,
                joinDate: joinDate || null,
                status: status || null,
            }
        })

        return NextResponse.json(newUser, { status: 201 })
    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }
}

