import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata = {
    title: '활동 | 대학생들이 직접 운영하는 비영리 IT 교육봉사',
    description: '대학생들이 직접 운영하는 비영리 IT 교육봉사, 팀코드브릿지!',
}

const activities = [
    {
        id: 1,
        title: '멘토링톤',
        description: '컴퓨터공학 전공 선배들과 함께하는 창의적 미니 해커톤!',
        icon: '🚀',
        details: [
            'AI·소프트웨어 프로젝트 기획부터 프로토타입 개발',
            '기획력과 문제해결력을 키우는 팀 기반 챌린지',
            '실제 서비스 런칭 경험',
        ],
    },
    {
        id: 2,
        title: '멘토링',
        description: '대학 진학을 위한 실질적인 진로 상담과 코딩 멘토링',
        icon: '💡',
        details: [
            '입시 꿀팁, 생활기록부 작성 가이드',
            '세특 설계 및 코딩 프로젝트 기획',
            '1:1 맞춤형 멘토링',
        ],
    },
    {
        id: 3,
        title: '스쿨어택',
        description: '멘토들이 직접 고등학교로 찾아가는 출동형 프로그램',
        icon: '🎯',
        details: [
            '코딩 교육 & 진로 멘토링',
            '처음 접하는 학생도 쉽게 이해',
            '학교 맞춤형 커리큘럼 제공',
        ],
    },
    {
        id: 4,
        title: '코딩콘서트',
        description: '우수 멘토들의 성공 스토리와 개발 팁 공유',
        icon: '🎤',
        details: [
            '실제 경험 기반 강연',
            'AI, 소프트웨어 분야 인사이트',
            '네트워킹 기회 제공',
        ],
    },
]

export default function ActivitiesPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navigation variant="light" />

            {/* Hero Section */}
            <section className="pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-cyan-600 font-medium mb-4 tracking-wide">ACTIVITIES</p>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                        주요 활동
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                        TeamCodeBridge에서 진행하는 다양한 프로그램을 소개합니다.
                    </p>
                </div>
            </section>

            {/* Activities Grid */}
            <section className="py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-6">
                        {activities.map((activity) => (
                            <div
                                key={activity.id}
                                className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors"
                            >
                                <span className="text-4xl mb-4 block">{activity.icon}</span>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h3>
                                <p className="text-gray-600 mb-4">{activity.description}</p>
                                <ul className="space-y-2">
                                    {activity.details.map((detail, i) => (
                                        <li key={i} className="flex items-start text-gray-500 text-sm">
                                            <span className="text-cyan-600 mr-2">•</span>
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-gray-50 mt-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        함께 성장할 준비가 되셨나요?
                    </h2>
                    <a
                        href="/#recruit"
                        className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                    >
                        지원하기 →
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    )
}
