import { prisma } from '@/lib/prisma'
import {
    UserCircleIcon,
    PhoneIcon,
    AcademicCapIcon,
    BriefcaseIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/outline'

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                                    {member.image ? (
                                        <img src={member.image} alt={member.name || ''} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <UserCircleIcon className="w-8 h-8" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {member.position || '직책 미정'}
                                    </span>
                                </div>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-semibold ${member.status === '재직중' ? 'bg-green-100 text-green-700' :
                                member.status === '군대' ? 'bg-orange-100 text-orange-700' :
                                    'bg-gray-100 text-gray-600'
                                }`}>
                                {member.status || '상태 미정'}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                                <span>{member.team || '소속팀 미정'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <PhoneIcon className="w-4 h-4 text-gray-400" />
                                <span>{member.phone || '연락처 없음'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <AcademicCapIcon className="w-4 h-4 text-gray-400" />
                                <span>{member.university || '학교 정보 없음'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                                <span>입사일: {member.joinDate || '-'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
