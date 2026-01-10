import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET: 특정 설문조사 상세 정보
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
        }

        const survey = await prisma.survey.findUnique({
            where: { id: params.id },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                questions: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        })

        if (!survey) {
            return NextResponse.json(
                { error: '설문조사를 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        return NextResponse.json(survey)
    } catch (error) {
        console.error('설문조사 조회 오류:', error)
        return NextResponse.json(
            { error: '설문조사를 가져오는데 실패했습니다.' },
            { status: 500 }
        )
    }
}

// PUT: 설문조사 수정
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
        }

        // 권한 확인
        const existingSurvey = await prisma.survey.findUnique({
            where: { id: params.id }
        })

        if (!existingSurvey) {
            return NextResponse.json(
                { error: '설문조사를 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        if (existingSurvey.createdById !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: '수정 권한이 없습니다.' },
                { status: 403 }
            )
        }

        const body = await request.json()
        const {
            title,
            description,
            targetClass,
            startDate,
            endDate,
            status,
            googleFormId,
            googleFormUrl,
            googleSheetUrl,
            responseCount,
            isDraft,
            questions
        } = body

        // 질문 업데이트 (있는 경우)
        if (questions) {
            // 기존 질문 삭제
            await prisma.surveyQuestion.deleteMany({
                where: { surveyId: params.id }
            })

            // 새 질문 생성
            await prisma.surveyQuestion.createMany({
                data: questions.map((q: any, index: number) => ({
                    surveyId: params.id,
                    order: index + 1,
                    questionText: q.questionText,
                    questionType: q.questionType,
                    required: q.required !== false,
                    options: q.options || null,
                    scaleMin: q.scaleMin || null,
                    scaleMax: q.scaleMax || null,
                    scaleMinLabel: q.scaleMinLabel || null,
                    scaleMaxLabel: q.scaleMaxLabel || null
                }))
            })
        }

        // 설문조사 기본 정보 업데이트
        const updatedSurvey = await prisma.survey.update({
            where: { id: params.id },
            data: {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(targetClass !== undefined && { targetClass }),
                ...(startDate && { startDate: new Date(startDate) }),
                ...(endDate && { endDate: new Date(endDate) }),
                ...(status && { status }),
                ...(googleFormId !== undefined && { googleFormId }),
                ...(googleFormUrl !== undefined && { googleFormUrl }),
                ...(googleSheetUrl !== undefined && { googleSheetUrl }),
                ...(responseCount !== undefined && { responseCount }),
                ...(isDraft !== undefined && { isDraft })
            },
            include: {
                questions: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        })

        return NextResponse.json(updatedSurvey)
    } catch (error) {
        console.error('설문조사 수정 오류:', error)
        return NextResponse.json(
            { error: '설문조사 수정에 실패했습니다.' },
            { status: 500 }
        )
    }
}

// DELETE: 설문조사 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
        }

        // 권한 확인
        const survey = await prisma.survey.findUnique({
            where: { id: params.id }
        })

        if (!survey) {
            return NextResponse.json(
                { error: '설문조사를 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        if (survey.createdById !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: '삭제 권한이 없습니다.' },
                { status: 403 }
            )
        }

        // 설문조사 삭제 (cascade로 질문도 함께 삭제됨)
        await prisma.survey.delete({
            where: { id: params.id }
        })

        return NextResponse.json(
            {
                message: '설문조사가 삭제되었습니다.',
                googleFormId: survey.googleFormId // 클라이언트에서 Google Forms 삭제 시 사용
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('설문조사 삭제 오류:', error)
        return NextResponse.json(
            { error: '설문조사 삭제에 실패했습니다.' },
            { status: 500 }
        )
    }
}

