import { prisma } from "@/lib/prisma"
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 빌드 시점에 이 라우트가 실행되지 않도록 설정
export const revalidate = 0

export async function GET() {
    try {
        const todoDir = path.join(process.cwd(), 'TCB ToDoList')
        if (!fs.existsSync(todoDir)) {
            return Response.json({ error: "Directory not found" }, { status: 404 })
        }

        const files = fs.readdirSync(todoDir).filter(f => f.endsWith('.md'))

        // 1. 기본 프로젝트 생성 (없을 경우)
        let project = await prisma.project.findFirst({
            where: { title: "TCB 메인 프로젝트" }
        })

        if (!project) {
            project = await prisma.project.create({
                data: {
                    title: "TCB 메인 프로젝트",
                    description: "노션에서 마이그레이션된 실제 업무 데이터입니다."
                }
            })
        }

        const results = []

        for (const file of files) {
            const content = fs.readFileSync(path.join(todoDir, file), 'utf-8')

            // 데이터 파싱
            const nameMatch = content.match(/업무명:\s*(.*)/)
            const ownerMatch = content.match(/담당자:\s*(.*)/)
            const statusMatch = content.match(/상태:\s*(.*)/)
            const priorityMatch = content.match(/우선순위:\s*(.*)/)
            const deadlineMatch = content.match(/마감날짜:\s*(.*)/)

            if (nameMatch) {
                const taskName = nameMatch[1].trim()
                const ownerName = ownerMatch ? ownerMatch[1].split('[')[0].trim() : "미지정"
                const status = statusMatch ? statusMatch[1].trim() : "대기"
                const priority = priorityMatch ? priorityMatch[1].trim() : "중간"
                const timeline = deadlineMatch ? deadlineMatch[1].trim() : null

                // 2. 담당자 생성/찾기
                let user = null
                if (ownerName !== "미지정") {
                    user = await prisma.user.upsert({
                        where: { email: `${ownerName}@teamcodebridge.dev` }, // 임시 이메일
                        update: { name: ownerName },
                        create: {
                            name: ownerName,
                            email: `${ownerName}@teamcodebridge.dev`,
                            role: "MENTOR"
                        }
                    })
                }

                // 3. 업무 생성 (중복 체크)
                const existingTask = await prisma.task.findFirst({
                    where: { name: taskName, projectId: project.id }
                })

                if (!existingTask) {
                    const task = await prisma.task.create({
                        data: {
                            name: taskName,
                            status: status === "완료" ? "완료" : (status === "진행" ? "진행 중" : "대기"),
                            priority: priority === "긴급" ? "높음" : (priority === "보통" ? "중간" : "낮음"),
                            timeline: timeline,
                            projectId: project.id,
                            ownerId: user?.id
                        }
                    })
                    results.push(task)
                }
            }
        }

        return Response.json({
            message: "Migration completed",
            count: results.length,
            totalFiles: files.length
        })
    } catch (error: any) {
        console.error("Migration failed:", error)
        return Response.json({ error: error.message }, { status: 500 })
    }
}
