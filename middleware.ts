import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone()
    const hostname = request.headers.get('host') || ''

    // 1. e2g.teamcodebridge.dev 루트(/) 접속 시 자동 리다이렉트 제거
    // Google OAuth 인증을 위해 홈페이지는 로그인 없이 접근 가능해야 함
    // 사용자가 직접 "워크스페이스 로그인" 버튼을 클릭할 때만 로그인 페이지로 이동

    // 2. 워크스페이스 접근 권한 체크
    if (url.pathname.startsWith('/workspace')) {
        console.log(`[Middleware] Checking auth for: ${url.pathname}`)

        // 로그인 페이지는 체크 제외
        if (url.pathname === '/workspace/login') {
            return NextResponse.next()
        }

        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
        console.log(`[Middleware] Token exists: ${!!token}`)

        if (!token) {
            console.log(`[Middleware] Redirecting to login`)
            const loginUrl = new URL('/workspace/login', request.url)
            loginUrl.searchParams.set('callbackUrl', request.url)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

// 미들웨어가 적용될 경로 설정
// 미들웨어가 적용될 경로 설정
export const config = {
    matcher: [
        '/workspace/:path*',
        '/'
    ],
}
