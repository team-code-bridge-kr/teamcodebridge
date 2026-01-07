import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// 빌드 시점에 DATABASE_URL이 없어도 에러가 발생하지 않도록 처리
const getPrismaClient = () => {
    if (!process.env.DATABASE_URL) {
        // 빌드 시점에는 더미 클라이언트 반환 (실제 사용 시 에러 발생)
        return {} as PrismaClient
    }
    
    return globalForPrisma.prisma ??
        new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        })
}

export const prisma = getPrismaClient()

if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL) {
    globalForPrisma.prisma = prisma
}
