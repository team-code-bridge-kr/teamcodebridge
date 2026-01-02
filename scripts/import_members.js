const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { parse } = require('csv-parse/sync');

const prisma = new PrismaClient();

async function main() {
    const csvFilePath = path.join(__dirname, '../멤버DB 215f614f5cac800ca079ef4f5e728d0e_all.csv');
    const fileContent = fs.readFileSync(csvFilePath, 'utf8');

    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        bom: true // Handle UTF-8 BOM if present
    });

    console.log(`Found ${records.length} records to import.`);

    for (const record of records) {
        // CSV 컬럼 매핑
        // 이름,ID,개인별업무링크,소속팀,"이름 ",입사일,재직여부,전화번호,직책,학교
        // "이름 " 컬럼이 실제 이름(한글)이고, "이름" 컬럼은 직책이 포함된 이름일 수 있음. 확인 필요.
        // CSV 내용을 보면 "이름 " 컬럼이 순수 이름(예: 장원준)이고, "이름" 컬럼은 "장원준 [대표이사]" 형태임.
        // 따라서 "이름 "을 name으로 사용.

        const name = record['이름 ']?.trim() || record['이름']?.split('[')[0].trim();
        const team = record['소속팀'];
        const position = record['직책'];
        const phone = record['전화번호'];
        const university = record['학교'];
        const joinDate = record['입사일'];
        const status = record['재직여부'];

        // 이메일은 CSV에 없으므로 이름 기반으로 임시 생성하거나 비워둠.
        // 여기서는 기존 데이터와 매칭을 위해 이름을 기준으로 업데이트하거나 새로 생성.
        // 이메일 형식이 '이름@teamcodebridge.dev'라고 가정하고 생성 (기존 로직 참고)
        const email = `${name}@teamcodebridge.dev`;

        console.log(`Processing user: ${name} (${email})`);

        try {
            await prisma.user.upsert({
                where: { email: email },
                update: {
                    name: name,
                    team: team,
                    position: position,
                    phone: phone,
                    university: university,
                    joinDate: joinDate,
                    status: status,
                },
                create: {
                    name: name,
                    email: email,
                    team: team,
                    position: position,
                    phone: phone,
                    university: university,
                    joinDate: joinDate,
                    status: status,
                    role: 'MENTOR'
                }
            });
            console.log(`Successfully imported/updated: ${name}`);
        } catch (error) {
            console.error(`Error processing ${name}:`, error);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
