const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const prisma = new PrismaClient();

async function main() {
    const todoDir = "/root/teamcodebridge/TCB ToDoList";
    if (!fs.existsSync(todoDir)) {
        console.error("Directory not found:", todoDir);
        return;
    }
    const files = fs.readdirSync(todoDir).filter(f => f.endsWith(".md"));

    let project = await prisma.project.findFirst({ where: { title: "TCB 메인 프로젝트" } });
    if (!project) {
        project = await prisma.project.create({ data: { title: "TCB 메인 프로젝트", description: "실제 업무 데이터" } });
    }

    for (const file of files) {
        const content = fs.readFileSync(path.join(todoDir, file), "utf-8");
        const nameMatch = content.match(/업무명:\s*(.*)/);
        const ownerMatch = content.match(/담당자:\s*(.*)/);
        const statusMatch = content.match(/상태:\s*(.*)/);
        const priorityMatch = content.match(/우선순위:\s*(.*)/);
        const deadlineMatch = content.match(/마감날짜:\s*(.*)/);

        if (nameMatch) {
            const taskName = nameMatch[1].trim();
            const ownerName = ownerMatch ? ownerMatch[1].split("[")[0].trim() : "미지정";
            const status = statusMatch ? statusMatch[1].trim() : "대기";
            const priority = priorityMatch ? priorityMatch[1].trim() : "중간";
            const timeline = deadlineMatch ? deadlineMatch[1].trim() : null;

            let user = null;
            if (ownerName !== "미지정") {
                user = await prisma.user.upsert({
                    where: { email: ownerName + "@teamcodebridge.dev" },
                    update: { name: ownerName },
                    create: { name: ownerName, email: ownerName + "@teamcodebridge.dev", role: "MENTOR" }
                });
            }

            const existingTask = await prisma.task.findFirst({
                where: { name: taskName, projectId: project.id }
            });

            if (!existingTask) {
                await prisma.task.create({
                    data: {
                        name: taskName,
                        status: status === "완료" ? "완료" : (status === "진행" ? "진행 중" : "대기"),
                        priority: priority === "긴급" ? "높음" : (priority === "보통" ? "중간" : "낮음"),
                        timeline: timeline,
                        projectId: project.id,
                        ownerId: user ? user.id : null
                    }
                });
                console.log("Migrated:", taskName);
            }
        }
    }
}

main()
    .then(() => console.log("Migration Done"))
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
