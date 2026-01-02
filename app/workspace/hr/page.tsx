import HRClient from './HRClient'

export const dynamic = 'force-dynamic'

export default async function HRPage() {
    // API 서버에서 데이터 가져오기
    const res = await fetch('https://api.teamcodebridge.dev/members', {
        cache: 'no-store',
    })

    if (!res.ok) {
        return (
            <div className="p-8">
                <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
            </div>
        )
    }

    const members: any[] = await res.json()

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">인사 관리</h1>
                <p className="text-gray-500 mt-1">팀코드브릿지 멤버들의 정보를 확인합니다.</p>
            </div>

            <HRClient initialMembers={members} />
        </div>
    )
}
