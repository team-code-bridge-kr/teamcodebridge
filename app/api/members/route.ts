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

        // 개발 환경이거나 DB 연결 실패 시 더미 데이터 반환 (UI 테스트용)
        if (process.env.NODE_ENV === 'development') {
            return NextResponse.json([
                { id: 'dummy-1', name: '장원준', team: '개발팀', position: '팀장', status: '재직중', image: null },
                { id: 'dummy-2', name: '김철수', team: '기획팀', position: '팀원', status: '재직중', image: null },
                { id: 'dummy-3', name: '이영희', team: '디자인팀', position: '팀원', status: '휴직중', image: null },
                { id: 'dummy-4', name: '박민수', team: '개발팀', position: '팀원', status: '군대', image: null },
            ])
        }

        return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
    }
}
