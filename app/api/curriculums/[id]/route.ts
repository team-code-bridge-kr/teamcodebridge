import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE: 커리큘럼 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
        }

        // 권한 확인 (생성자 또는 ADMIN만 삭제 가능)
        const curriculum = await prisma.curriculum.findUnique({
            where: { id: params.id }
        })

        if (!curriculum) {
            return NextResponse.json({ error: '커리큘럼을 찾을 수 없습니다.' }, { status: 404 })
        }

        if (curriculum.createdById !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: '삭제 권한이 없습니다.' }, { status: 403 })
        }

        // 커리큘럼 삭제 (cascade로 sessions도 함께 삭제됨)
        await prisma.curriculum.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ message: '커리큘럼이 삭제되었습니다.' }, { status: 200 })
    } catch (error) {
        console.error('커리큘럼 삭제 오류:', error)
        return NextResponse.json(
            { error: '커리큘럼 삭제에 실패했습니다.' },
            { status: 500 }
        )
    }
}

