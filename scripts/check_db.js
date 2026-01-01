const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const project = await prisma.project.findFirst({
        where: { title: "TCB 메인 프로젝트" },
        include: { tasks: true }
    });

    if (project) {
        console.log(`Project: ${project.title}`);
        console.log(`Task count: ${project.tasks.length}`);
        if (project.tasks.length > 0) {
            console.log("First 5 tasks:");
            project.tasks.slice(0, 5).forEach(t => console.log(`- ${t.name} (${t.status})`));
        }
    } else {
        console.log("Project not found");
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
