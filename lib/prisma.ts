import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Prisma 클라이언트를 lazy initialization으로 변경하여 빌드 시점 에러 방지
function createPrismaClient(): PrismaClient {
    if (!process.env.DATABASE_URL) {
        // 빌드 시점에는 더미 객체 반환 (실제 사용 시 에러 발생)
        // 이렇게 하면 빌드는 성공하지만 런타임에 에러가 발생함
        console.warn('DATABASE_URL is not set. Prisma operations will fail at runtime.')
        return {} as PrismaClient
    }
    
    if (globalForPrisma.prisma) {
        return globalForPrisma.prisma
    }
    
    const prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
    
    if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = prisma
    }
    
    return prisma
}

// Lazy initialization: 실제 사용 시점에만 PrismaClient 생성
let _prisma: PrismaClient | null = null

export const prisma = new Proxy({} as PrismaClient, {
    get(target, prop) {
        if (!_prisma) {
            _prisma = createPrismaClient()
        }
        const value = (_prisma as any)[prop]
        if (typeof value === 'function') {
            return value.bind(_prisma)
        }
        return value
    }
})
