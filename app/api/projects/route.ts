import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
    console.log("GET /api/projects called")
    try {
        const projects = await prisma.project.findMany({
            include: {
                tasks: {
                    include: {
                        owner: true
                    }
                }
            }
        })
        return NextResponse.json(projects)
    } catch (error) {
        console.error("Failed to fetch projects:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title, description } = body

        const project = await prisma.project.create({
            data: {
                title,
                description
            }
        })
        return NextResponse.json(project)
    } catch (error) {
        console.error("Failed to create project:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
