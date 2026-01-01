import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24시간 (Bearer 토큰 유효 기간)
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    pages: {
        signIn: '/workspace/login',
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                }
            }
            return token
        },
        async session({ session, token }) {
            session.user = token as any
            return session
        },
        async signIn({ user }) {
            // 현재는 테스트를 위해 모든 구글 계정 로그인을 허용합니다.
            // 나중에 특정 도메인(@teamcodebridge.dev)만 허용하려면 아래 주석을 해제하세요.
            /*
            if (user.email?.endsWith("@teamcodebridge.dev") || user.email === "activejang@gmail.com") {
                return true
            }
            return false
            */
            return true
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
