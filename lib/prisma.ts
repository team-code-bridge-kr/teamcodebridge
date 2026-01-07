import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// PrismaClient를 lazy initialization으로 변경
// 빌드 시점에 초기화되지 않고, 실제 사용 시점에만 초기화됨
function getPrismaClient(): PrismaClient {
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

// PrismaClient를 getter로 export하여 실제 사용 시점에만 초기화
// 빌드 시점에는 PrismaClient가 초기화되지 않음
export const prisma = new Proxy({} as PrismaClient, {
    get(_target, prop) {
        const client = getPrismaClient()
        const value = (client as any)[prop]
        if (typeof value === 'function') {
            return value.bind(client)
        }
        return value
    },
    set(_target, prop, value) {
        const client = getPrismaClient()
        ;(client as any)[prop] = value
        return true
    }
})
