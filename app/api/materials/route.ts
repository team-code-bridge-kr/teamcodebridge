import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET: 모든 교재 조회
export async function GET() {
    try {
        const materials = await prisma.material.findMany({
            include: {
                curriculum: {
                    select: {
                        id: true,
                        name: true,
                        status: true
                    }
                },
                uploadedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(materials)
    } catch (error) {
        console.error('Failed to fetch materials:', error)
        return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 })
    }
}

// POST: 새 교재 업로드
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const body = await request.json()
        const {
            name,
            description,
            fileType,
            driveUrl,
            fileSize,
            curriculumId
        } = body

        const material = await prisma.material.create({
            data: {
                name,
                description,
                fileType,
                driveUrl,
                fileSize: fileSize || null,
                curriculumId,
                uploadedById: user.id
            },
            include: {
                curriculum: {
                    select: {
                        id: true,
                        name: true,
                        status: true
                    }
                },
                uploadedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        })

        return NextResponse.json(material, { status: 201 })
    } catch (error) {
        console.error('Failed to create material:', error)
        return NextResponse.json({ error: 'Failed to create material' }, { status: 500 })
    }
}

