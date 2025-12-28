import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata = {
    title: '팀코드브릿지 소개 | TeamCodeBridge',
    description: 'TeamCodeBridge - 가능성의 끝에서 IT 교육의 시작!',
}

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Navigation with light theme override */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <a href="/" className="text-xl font-bold text-gray-900">
                            TeamCodeBridge
                        </a>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="/about" className="text-gray-900 font-medium text-sm">팀코드브릿지 소개</a>
                            <a href="/projects" className="text-gray-600 hover:text-gray-900 text-sm">프로젝트</a>
                            <a href="/activities" className="text-gray-600 hover:text-gray-900 text-sm">활동</a>
                            <a href="/#recruit" className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800">
                                26 시즌 신청
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-cyan-600 font-medium mb-4 tracking-wide">ABOUT US</p>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                        가능성의 끝에서 IT 교육의 시작
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                        TeamCodeBridge는 AI 시대의 중심에서 미래 인재를 키우고,<br className="hidden md:block" />
                        함께 새로운 가능성을 현실로 만듭니다.
                    </p>
                </div>
            </section>

            {/* Content Sections */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Section 1 */}
                    <div className="mb-20">
                        <div className="flex items-center mb-8">
                            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-2xl mr-4">
                                💡
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">TeamCodeBridge란?</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-gray-50 rounded-2xl p-8">
                                <h3 className="font-semibold text-gray-900 mb-3">우리의 미션</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    TeamCodeBridge는 단순히 '코딩을 가르치는 교육팀'이 아닙니다.
                                    우리는 학생들이 스스로 기획하고, 제작하고, 세상에 선보일 수 있는 힘을 기르는 것을 목표로 합니다.
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-8">
                                <h3 className="font-semibold text-gray-900 mb-3">우리의 비전</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    우리는 '코드'라는 도구로 세상과 연결되는 다리를 만들고 있습니다.
                                    누구든지 자신의 생각을 표현하고, 의미 있는 결과를 만들어내는 경험을 제공합니다.
                                </p>
                            </div>
                        </div>
                    </div>



                    {/* Section 3: Values */}
                    <div>
                        <div className="flex items-center mb-8">
                            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-2xl mr-4">
                                ⭐
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">핵심 가치</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 rounded-2xl p-6 text-center">
                                <span className="text-3xl mb-4 block">🔍</span>
                                <h3 className="font-semibold text-gray-900 mb-2">생각 확장</h3>
                                <p className="text-gray-600 text-sm">다양한 관점에서 문제를 바라보는 시야를 키웁니다</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-6 text-center">
                                <span className="text-3xl mb-4 block">💻</span>
                                <h3 className="font-semibold text-gray-900 mb-2">기술 성장</h3>
                                <p className="text-gray-600 text-sm">기술을 통해 세상의 문제를 해결하는 방법을 배웁니다</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-6 text-center">
                                <span className="text-3xl mb-4 block">🎯</span>
                                <h3 className="font-semibold text-gray-900 mb-2">결과 창출</h3>
                                <p className="text-gray-600 text-sm">아이디어를 실제 프로젝트로 구현하는 경험을 합니다</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        가능성을 향한 여정, 지금 함께하세요!
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
