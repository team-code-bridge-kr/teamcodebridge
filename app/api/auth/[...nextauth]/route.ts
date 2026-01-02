import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
        } & DefaultSession["user"]
    }
}
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24시간
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
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
            return session
        },
        async signIn({ user, account, profile }) {
            if (!user.email) return false

            try {
                // 1. 관리자 계정 확인 (admin@activejang.com, 2025teamcodebridge@gmail.com, yeonhj0507@gmail.com)
                if (user.email === 'admin@activejang.com' || user.email === '2025teamcodebridge@gmail.com' || user.email === 'yeonhj0507@gmail.com') {
                    await prisma.user.upsert({
                        where: { email: user.email },
                        update: {
                            role: 'ADMIN',
                            isApproved: true,
                            image: user.image,
                            name: user.name
                        },
                        create: {
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            role: 'ADMIN',
                            isApproved: true
                        }
                    })
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
})

export { handler as GET, handler as POST }
