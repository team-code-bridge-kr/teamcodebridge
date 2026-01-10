import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH: 커리큘럼 상태 변경
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
        }

        const body = await request.json()
        const { status } = body

        // 유효한 상태값 체크
        const validStatuses = ['준비중', '검토중', '수업중', '종료됨']
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: '유효하지 않은 상태값입니다.' }, { status: 400 })
        }

        // 권한 확인 (생성자 또는 ADMIN만 수정 가능)
        const curriculum = await prisma.curriculum.findUnique({
            where: { id: params.id }
        })

        if (!curriculum) {
            return NextResponse.json({ error: '커리큘럼을 찾을 수 없습니다.' }, { status: 404 })
        }

        if (curriculum.createdById !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: '수정 권한이 없습니다.' }, { status: 403 })
        }

        // 상태 업데이트
        const updatedCurriculum = await prisma.curriculum.update({
            where: { id: params.id },
            data: { status }
        })

        return NextResponse.json(updatedCurriculum, { status: 200 })
    } catch (error) {
        console.error('커리큘럼 상태 변경 오류:', error)
        return NextResponse.json(
            { error: '상태 변경에 실패했습니다.' },
            { status: 500 }
        )
    }
}

