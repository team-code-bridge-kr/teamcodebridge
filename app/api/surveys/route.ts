import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET: 모든 설문조사 목록 가져오기
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') // 준비중, 진행중, 종료
        const isDraft = searchParams.get('isDraft') // true, false

        const where: any = {}
        
        if (status) {
            where.status = status
        }
        
        if (isDraft !== null) {
            where.isDraft = isDraft === 'true'
        }

        const surveys = await prisma.survey.findMany({
            where,
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
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(surveys)
    } catch (error) {
        console.error('설문조사 목록 가져오기 오류:', error)
        return NextResponse.json(
            { error: '설문조사 목록을 가져오는데 실패했습니다.' },
            { status: 500 }
        )
    }
}

// POST: 새 설문조사 생성 (임시저장 또는 Google Forms 생성)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
        }

        const body = await request.json()
        const {
            title,
            description,
            targetClass,
            startDate,
            endDate,
            questions,
            isDraft,
            createGoogleForm // true면 Google Forms 생성
        } = body

        // 필수 필드 검증
        if (!title) {
            return NextResponse.json(
                { error: '설문조사명은 필수입니다.' },
                { status: 400 }
            )
        }

        // DB에 설문조사 저장
        const survey = await prisma.survey.create({
            data: {
                title,
                description,
                targetClass,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                isDraft: isDraft !== false, // 기본값: true (임시저장)
                status: isDraft !== false ? '준비중' : '진행중',
                createdById: session.user.id,
                questions: {
                    create: questions?.map((q: any, index: number) => ({
                        order: index + 1,
                        questionText: q.questionText,
                        questionType: q.questionType,
                        required: q.required !== false,
                        options: q.options || null,
                        scaleMin: q.scaleMin || null,
                        scaleMax: q.scaleMax || null,
                        scaleMinLabel: q.scaleMinLabel || null,
                        scaleMaxLabel: q.scaleMaxLabel || null
                    })) || []
                }
            },
            include: {
                questions: true
            }
        })

        // Google Forms 생성 (isDraft = false이고 createGoogleForm = true인 경우)
        if (!isDraft && createGoogleForm) {
            // Google Forms API 호출은 클라이언트 측에서 수행
            // (accessToken이 필요하므로)
            return NextResponse.json({
                ...survey,
                message: 'DB 저장 완료. Google Forms는 클라이언트에서 생성하세요.'
            }, { status: 201 })
        }

        return NextResponse.json(survey, { status: 201 })
    } catch (error) {
        console.error('설문조사 생성 오류:', error)
        return NextResponse.json(
            { error: '설문조사 생성에 실패했습니다.' },
            { status: 500 }
        )
    }
}

