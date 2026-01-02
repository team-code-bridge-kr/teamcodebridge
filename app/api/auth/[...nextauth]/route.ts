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
        async jwt({ token, user, account }) {
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    id: user.id, // User ID 저장
                    role: (user as any).role, // Role 저장
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
