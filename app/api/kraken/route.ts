import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 동적 라우트 설정 (빌드 시 정적 생성 방지)
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/kraken - 크라켄 시각화용 계층 데이터 조회
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const projectId = searchParams.get('projectId')

        const where = projectId ? { projectId } : {}

        const tasks = await prisma.task.findMany({
            where,
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                children: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: [
                { depth: 'asc' },
                { createdAt: 'asc' },
            ],
        })

        return NextResponse.json(tasks)
    } catch (error) {
        console.error('Kraken API Error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch kraken data' },
            { status: 500 }
        )
    }
}
