import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// PrismaClient를 정상적으로 초기화
// 빌드 시점에는 DATABASE_URL이 없어도 에러가 발생하지 않도록 처리
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}
