import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Prisma 클라이언트를 lazy initialization으로 변경하여 빌드 시점 에러 방지
function getPrismaClient(): PrismaClient {
    if (!process.env.DATABASE_URL) {
        // 빌드 시점에는 에러를 던지지 않고, 런타임에 에러가 발생하도록 함
        // PrismaClient는 실제 사용 시점에 초기화됨
        throw new Error('DATABASE_URL is not set. Please set it in your environment variables.')
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

// Lazy getter로 변경하여 빌드 시점에 초기화되지 않도록 함
export const prisma = new Proxy({} as PrismaClient, {
    get(target, prop) {
        const client = getPrismaClient()
        const value = (client as any)[prop]
        if (typeof value === 'function') {
            return value.bind(client)
        }
        return value
    }
})
