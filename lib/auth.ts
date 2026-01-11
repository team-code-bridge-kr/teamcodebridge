import NextAuth, { DefaultSession, type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import { sendWelcomeEmail } from "@/lib/email"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
        } & DefaultSession["user"]
        accessToken?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string
        refreshToken?: string
        role?: string
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            name: "TeamCodeBridge",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    scope: [
                        'openid',
                        'https://www.googleapis.com/auth/userinfo.email',
                        'https://www.googleapis.com/auth/userinfo.profile',
                        'https://www.googleapis.com/auth/drive.file', // 앱이 생성한 파일만 접근
                        'https://www.googleapis.com/auth/forms.body', // Google Forms 생성/수정
                        'https://www.googleapis.com/auth/forms.responses.readonly', // Google Forms 응답 읽기
                    ].join(' ')
                }
            }
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30일 (2,592,000초)
        updateAge: 24 * 60 * 60, // 24시간마다 세션 갱신
    },
    cookies: {
        sessionToken: {
            name: `__Secure-next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true, // HTTPS 환경에서만 전송
                maxAge: 30 * 24 * 60 * 60 // 30일 - 브라우저 닫아도 유지!
            }
        }
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 30 * 24 * 60 * 60, // JWT도 30일
    },
    pages: {
        signIn: '/workspace/login',
        error: '/workspace/login', // 에러 발생 시 로그인 페이지로
    },
    callbacks: {
        async jwt({ token, user, account, trigger }) {
            // 로그인 시 또는 세션 업데이트 시
            if (account && user) {
                // Prisma에서 실제 User ID 가져오기
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email! }
                })
                
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    id: dbUser?.id || user.id, // Prisma User ID 사용
                    role: dbUser?.role || (user as any).role, // Role 저장
                    email: user.email, // email도 저장
                }
            }
            
            // 기존 토큰에서 email이 있고 id가 Google OAuth ID 형식인 경우 업데이트
            // Google OAuth ID는 보통 숫자로만 구성되어 있음
            if (token.email) {
                const currentId = token.id as string
                // Google OAuth ID는 숫자로만 구성되어 있고 길이가 20자 이상
                const isGoogleOAuthId = currentId && /^\d+$/.test(currentId) && currentId.length > 15
                
                if (isGoogleOAuthId || !currentId) {
                    try {
                        const dbUser = await prisma.user.findUnique({
                            where: { email: token.email as string }
                        })
                        if (dbUser) {
                            console.log(`Updating token ID from ${currentId} to ${dbUser.id}`)
                            token.id = dbUser.id
                            token.role = dbUser.role
                        }
                    } catch (error) {
                        console.error('Error updating token:', error)
                    }
                }
            }
            
            return token
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                id: token.id as string,
                role: token.role as string,
            } as any
            session.accessToken = token.accessToken as string
            return session
        },
        async signIn({ user, account, profile }) {
            if (!user.email) return false

            try {
                // 1. 관리자 계정 확인 및 이름 기반 매칭
                if (user.email === 'admin@activejang.com' || user.email === '2025teamcodebridge@gmail.com' || user.email === 'yeonhj0507@gmail.com') {
                    // 이름과 이메일 매칭 정의
                    const adminMapping: Record<string, { name: string; position: string }> = {
                        'admin@activejang.com': { name: '장원준', position: '대표이사' },
                        '2025teamcodebridge@gmail.com': { name: 'TeamCodeBridge', position: '' },
                        'yeonhj0507@gmail.com': { name: '연현중', position: '팀장' }
                    }
                    
                    const mapping = adminMapping[user.email]
                    
                    // 이름으로 기존 사용자 찾기 (이메일이 다른 경우)
                    const existingByName = await prisma.user.findFirst({
                        where: { name: mapping.name }
                    })
                    
                    if (existingByName && existingByName.email !== user.email) {
                        // 기존 사용자의 이메일을 업데이트하고 정보 병합
                        await prisma.user.update({
                            where: { id: existingByName.id },
                            data: {
                                email: user.email,
                                role: 'ADMIN',
                                isApproved: true,
                                image: user.image,
                                name: mapping.name,
                                position: mapping.position || existingByName.position
                            }
                        })
                        console.log(`Merged user ${mapping.name}: updated email from ${existingByName.email} to ${user.email}`)
                    } else {
                        // 일반 upsert
                        await prisma.user.upsert({
                            where: { email: user.email },
                            update: {
                                role: 'ADMIN',
                                isApproved: true,
                                image: user.image,
                                name: mapping.name,
                                position: mapping.position
                            },
                            create: {
                                email: user.email,
                                name: mapping.name,
                                image: user.image,
                                role: 'ADMIN',
                                isApproved: true,
                                position: mapping.position
                            }
                        })
                    }
                    
                    // 🎉 관리자 로그인 시 환영 메일 발송
                    try {
                        await sendWelcomeEmail(mapping.name, user.email)
                        console.log(`✅ 환영 메일 발송 완료: ${user.email}`)
                    } catch (emailError) {
                        console.error('❌ 환영 메일 발송 실패 (로그인은 성공):', emailError)
                    }
                    
                    return true
                }

                // 2. 일반 사용자 확인
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email }
                })

                if (existingUser) {
                    // 이미 존재하는 경우 승인 여부 확인
                    if (existingUser.isApproved) {
                        // 정보 업데이트 (이미지 등)
                        await prisma.user.update({
                            where: { email: user.email },
                            data: {
                                image: user.image,
                                name: user.name
                            }
                        })
                        
                        // 🎉 승인된 사용자 로그인 시 환영 메일 발송
                        try {
                            await sendWelcomeEmail(user.name || '멘토님', user.email)
                            console.log(`✅ 환영 메일 발송 완료: ${user.email}`)
                        } catch (emailError) {
                            console.error('❌ 환영 메일 발송 실패 (로그인은 성공):', emailError)
                        }
                        
                        return true
                    } else {
                        // 승인 대기 중
                        return '/workspace/login?error=PendingApproval'
                    }
                } else {
                    // 3. 신규 사용자 생성 (승인 대기)
                    await prisma.user.create({
                        data: {
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            role: 'MENTOR',
                            isApproved: false
                        }
                    })
                    return '/workspace/login?error=PendingApproval'
                }
            } catch (error) {
                console.error('SignIn Error:', error)
                // DB 연결 실패 시에도 일단 로그인은 허용 (개발 환경 편의성)
                // 실제 운영 환경에서는 false를 반환하여 로그인을 막아야 할 수도 있음
                return true
            }
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}

