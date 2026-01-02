import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        const { name } = await request.json()

        if (!name) {
            return NextResponse.json({ error: '이름을 입력해주세요.' }, { status: 400 })
        }

        // 이름으로 유저 찾기 (이름 컬럼이 없으므로 임시로 email에서 이름 추출하여 비교하거나, 
        // 기존에 import_members.js에서 name 필드를 채웠으므로 name으로 검색)
        // 주의: 동명이인이 있을 경우 첫 번째 사람으로 로그인됨.
        const user = await prisma.user.findFirst({
            where: {
                name: name
            }
        })

        if (!user) {
            return NextResponse.json({ error: '등록되지 않은 사용자입니다. 관리자에게 문의하세요.' }, { status: 404 })
        }

        // 세션 쿠키 설정 (간단한 인증)
        // 실제 프로덕션에서는 JWT 등을 사용하여 안전하게 서명해야 함.
        // 여기서는 사용자 편의성을 위해 간단히 userId를 저장.
        cookies().set('session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })

        // 사용자 정보를 식별하기 위한 쿠키 추가
        cookies().set('userId', user.id, {
            httpOnly: false, // 클라이언트에서 읽을 수 있도록 (채팅 등에서 사용)
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })

        cookies().set('userName', encodeURIComponent(user.name || ''), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })

        return NextResponse.json({ success: true, user })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: '로그인 처리 중 오류가 발생했습니다.' }, { status: 500 })
    }
}
