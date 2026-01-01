import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: "/workspace/login",
    },
})

export const config = {
    matcher: [
        "/workspace",
        "/workspace/:path*",
    ],
}
