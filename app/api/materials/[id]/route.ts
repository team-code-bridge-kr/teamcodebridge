import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE: 교재 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
        }

        // 권한 확인 (업로더 또는 ADMIN만 삭제 가능)
        const material = await prisma.material.findUnique({
            where: { id: params.id }
        })

        if (!material) {
            return NextResponse.json({ error: '교재를 찾을 수 없습니다.' }, { status: 404 })
        }

        if (material.uploadedById !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: '삭제 권한이 없습니다.' }, { status: 403 })
        }

        // 교재 삭제
        await prisma.material.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ message: '교재가 삭제되었습니다.' }, { status: 200 })
    } catch (error) {
        console.error('교재 삭제 오류:', error)
        return NextResponse.json(
            { error: '교재 삭제에 실패했습니다.' },
            { status: 500 }
        )
    }
}

