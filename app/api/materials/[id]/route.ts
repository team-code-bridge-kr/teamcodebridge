import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT: 교재 수정
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
        }

        const body = await request.json()
        const { name, description, fileType, driveUrl, fileSize, curriculumId } = body

        // 권한 확인 (업로더 또는 ADMIN만 수정 가능)
        const material = await prisma.material.findUnique({
            where: { id: params.id }
        })

        if (!material) {
            return NextResponse.json({ error: '교재를 찾을 수 없습니다.' }, { status: 404 })
        }

        if (material.uploadedById !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: '수정 권한이 없습니다.' }, { status: 403 })
        }

        // 교재 수정
        const updatedMaterial = await prisma.material.update({
            where: { id: params.id },
            data: {
                name,
                description,
                fileType,
                driveUrl,
                fileSize,
                curriculumId
            },
            include: {
                curriculum: true,
                uploadedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        })

        return NextResponse.json(updatedMaterial, { status: 200 })
    } catch (error) {
        console.error('교재 수정 오류:', error)
        return NextResponse.json(
            { error: '교재 수정에 실패했습니다.' },
            { status: 500 }
        )
    }
}

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

