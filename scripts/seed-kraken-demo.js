// 크라켄 뷰 테스트용 더미 데이터 시드 스크립트
// 실행: npx ts-node scripts/seed-kraken-demo.ts

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🐙 크라켄 데모 데이터 생성 시작...')

    // 1. 프로젝트 생성
    const project = await prisma.project.upsert({
        where: { id: 'demo-project-2026' },
        update: {},
        create: {
            id: 'demo-project-2026',
            title: '멘토링톤 2026',
            description: '2026년 멘토링톤 준비 프로젝트',
        },
    })
    console.log('✅ 프로젝트 생성:', project.title)

    // 2. Core 업무 (depth=0)
    const coreTask = await prisma.task.upsert({
        where: { id: 'core-mentoringthon-2026' },
        update: {},
        create: {
            id: 'core-mentoringthon-2026',
            name: '🐙 멘토링톤 2026 운영',
            status: '진행 중',
            priority: '높음',
            depth: 0,
            parentId: null,
            projectId: project.id,
            timeline: '2026.01 - 2026.06',
        },
    })
    console.log('✅ Core 업무 생성:', coreTask.name)

    // 3. Main Branch 업무 (depth=1)
    const mainBranches = [
        { id: 'branch-curriculum', name: '📚 커리큘럼 설계', status: '진행 중' },
        { id: 'branch-mentor', name: '👥 멘토 섭외', status: '대기' },
        { id: 'branch-material', name: '📖 교재 제작', status: '대기' },
        { id: 'branch-operation', name: '⚙️ 운영/행정', status: '진행 중' },
    ]

    for (const branch of mainBranches) {
        await prisma.task.upsert({
            where: { id: branch.id },
            update: {},
            create: {
                id: branch.id,
                name: branch.name,
                status: branch.status,
                priority: '중간',
                depth: 1,
                parentId: coreTask.id,
                projectId: project.id,
            },
        })
        console.log('✅ Main Branch 생성:', branch.name)
    }

    // 4. Sub Branch 업무 (depth=2)
    const subTasks = [
        // 커리큘럼 하위
        { id: 'sub-curriculum-1', name: '1차 초안 작성', parentId: 'branch-curriculum', status: '완료', dependsOnId: null },
        { id: 'sub-curriculum-2', name: '멘토 피드백 반영', parentId: 'branch-curriculum', status: '진행 중', dependsOnId: 'sub-curriculum-1' },
        { id: 'sub-curriculum-3', name: '최종안 확정', parentId: 'branch-curriculum', status: '대기', dependsOnId: 'sub-curriculum-2' },

        // 멘토 섭외 하위
        { id: 'sub-mentor-1', name: '후보 리스트 작성', parentId: 'branch-mentor', status: '완료', dependsOnId: null },
        { id: 'sub-mentor-2', name: '컨택 및 섭외', parentId: 'branch-mentor', status: '지연', dependsOnId: 'sub-mentor-1' },

        // 교재 제작 하위
        { id: 'sub-material-1', name: '교재 목차 수립', parentId: 'branch-material', status: '대기', dependsOnId: 'sub-curriculum-3' },

        // 운영/행정 하위
        { id: 'sub-operation-1', name: '예산안 작성', parentId: 'branch-operation', status: '완료', dependsOnId: null },
        { id: 'sub-operation-2', name: '장소 섭외', parentId: 'branch-operation', status: '진행 중', dependsOnId: 'sub-operation-1' },
    ]

    for (const sub of subTasks) {
        await prisma.task.upsert({
            where: { id: sub.id },
            update: {},
            create: {
                id: sub.id,
                name: sub.name,
                status: sub.status,
                priority: sub.status === '지연' ? '높음' : '중간',
                depth: 2,
                parentId: sub.parentId,
                dependsOnId: sub.dependsOnId,
                projectId: project.id,
            },
        })
        console.log('✅ Sub Task 생성:', sub.name)
    }

    console.log('\n🎉 크라켄 데모 데이터 생성 완료!')
    console.log('👉 http://localhost:3001/workspace/kraken 에서 확인하세요')
}

main()
    .catch((e) => {
        console.error('❌ 에러 발생:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
