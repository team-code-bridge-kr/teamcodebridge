import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT: 커리큘럼 수정
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
        const { name, description, motivation, benefits, minMentors, recommendedStudents, expectedEffect, sessions } = body

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

        // 커리큘럼 수정 (세션 포함)
        const updatedCurriculum = await prisma.curriculum.update({
            where: { id: params.id },
            data: {
                name,
                description,
                motivation,
                benefits,
                minMentors,
                recommendedStudents,
                expectedEffect,
                sessions: {
                    deleteMany: {}, // 기존 세션 삭제
                    create: sessions.map((session: any) => ({
                        sessionNumber: session.sessionNumber,
                        sessionName: session.sessionName,
                        scheduledDate: session.scheduledDate,
                        location: session.location,
                        goal: session.goal,
                        content: session.content
                    }))
                }
            },
            include: {
                sessions: {
                    orderBy: { sessionNumber: 'asc' }
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        })

        return NextResponse.json(updatedCurriculum, { status: 200 })
    } catch (error) {
        console.error('커리큘럼 수정 오류:', error)
        return NextResponse.json(
            { error: '커리큘럼 수정에 실패했습니다.' },
            { status: 500 }
        )
    }
}

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

