import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata = {
    title: '팀코드브릿지 소개 | 대학생들이 직접 운영하는 비영리 IT 교육봉사',
    description: '대학생들이 직접 운영하는 비영리 IT 교육봉사, 팀코드브릿지!',
}

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navigation variant="light" />

            {/* Hero Section */}
            <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                        <div className="text-center lg:text-left order-2 lg:order-1">
                            <p className="text-primary-600 font-medium mb-3 sm:mb-4 tracking-wide uppercase text-xs sm:text-sm">ABOUT US</p>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                                가능성의 끝에서 <br className="hidden sm:block" />
                                IT 교육의 시작
                    </h1>
                            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-6 sm:mb-8">
                                TeamCodeBridge는 AI 시대의 중심에서 미래 인재를 키우고,<br className="hidden sm:block" />
                        함께 새로운 가능성을 현실로 만듭니다.
                    </p>

                            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
                                <span className="inline-flex items-center rounded-full bg-primary-50 text-primary-700 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold border border-primary-100">
                                    프로젝트 중심 교육
                                </span>
                                <span className="inline-flex items-center rounded-full bg-gray-50 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold border border-gray-100">
                                    전공 선배 멘토링
                                </span>
                                <span className="inline-flex items-center rounded-full bg-gray-50 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold border border-gray-100">
                                    비영리 교육봉사
                                </span>
                            </div>
                        </div>

                        <div className="relative order-1 lg:order-2">
                            <div className="absolute -inset-1 sm:-inset-2 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-primary-100 via-white to-primary-50 blur-xl sm:blur-2xl opacity-70" />
                            <div className="relative bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
                                <div className="aspect-[16/11] w-full">
                                    <img
                                        src="/img/main_img_1.jpg"
                                        alt="TeamCodeBridge 활동 사진"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-4 sm:p-5 bg-white">
                                    <p className="text-xs sm:text-sm text-gray-500">함께 배우고, 함께 만들고, 함께 성장합니다.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Sections */}
            <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white via-gray-50/30 to-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    {/* Section 1 */}
                    <div className="mb-10 sm:mb-12">
                        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                <span className="text-white text-xl sm:text-2xl">💡</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 break-keep">TeamCodeBridge란?</h2>
                        </div>

                        {/* 연합 동아리 소개 + 대학 로고 */}
                        <div className="mb-10 sm:mb-12 bg-gradient-to-br from-primary-50/50 via-white to-gray-50/30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 shadow-xl border border-primary-100/50 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary-100/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                            {/* 텍스트 부분 */}
                            <div className="mb-6 sm:mb-8 md:mb-10 relative z-10">
                                <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-3 sm:mb-4">
                                    TeamCodeBridge는 <span className="font-bold text-primary-700">연세대·고려대·포항공대·숭실대·광운대·명지대·가천대</span> 컴퓨터 관련 학과 학생들이 모인 <span className="font-semibold text-gray-900">연합 봉사 동아리</span>입니다.
                                </p>
                                <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-2 sm:mb-3">
                                    멘토링·IT공모전·해커톤 경험을 바탕으로 초/중/고등학생 대상 AI·코딩 기초, 실습, 미니 해커톤까지 체계적 멘토링과 진로 탐색 지원을 제공합니다.
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                    타 학교도 지원이 가능해요! | 2025.06.21 기준
                                </p>
                            </div>

                            {/* 대학 로고 자동 스크롤 */}
                            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/60 backdrop-blur-sm py-6 sm:py-8 md:py-10 z-10">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-10"></div>
                                <div className="flex animate-marquee gap-6 sm:gap-10 md:gap-16 items-center">
                                    {/* 첫 번째 세트 */}
                                    {[...Array(7)].map((_, i) => (
                                        <div key={`logo-1-${i}`} className="flex-shrink-0 flex items-center justify-center px-1 sm:px-2">
                                            <img
                                                src="/img/TeamCodeBridge_Logo_Black_Web.png"
                                                alt={`참여 대학 ${i + 1}`}
                                                className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                                            />
                                        </div>
                                    ))}
                                    {/* 두 번째 세트 (무한 스크롤을 위해) */}
                                    {[...Array(7)].map((_, i) => (
                                        <div key={`logo-2-${i}`} className="flex-shrink-0 flex items-center justify-center px-1 sm:px-2">
                                            <img
                                                src="/img/TeamCodeBridge_Logo_Black_Web.png"
                                                alt={`참여 대학 ${i + 1}`}
                                                className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 mb-10 sm:mb-12">
                        <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                            <div className="overflow-hidden relative">
                                <div className="aspect-[4/3] w-full">
                                    <img
                                        src="/img/main_img_1.jpg"
                                        alt="우리의 미션"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div className="p-6 sm:p-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                                        <span className="text-primary-600 text-lg">🎯</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg sm:text-xl">우리의 미션</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4">
                                    TeamCodeBridge는 단순히 '코딩을 가르치는 교육팀'이 아닙니다.
                                    우리는 학생들이 스스로 기획하고, 제작하고, 세상에 선보일 수 있는 힘을 기르는 것을 목표로 합니다.
                                </p>
                                <p className="text-primary-700 font-semibold text-sm sm:text-base border-l-4 border-primary-500 pl-3">
                                    처음 배우는 순간부터 결과물을 만드는 순간까지.
                                </p>
                            </div>
                        </div>
                        <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                            <div className="overflow-hidden relative">
                                <div className="aspect-[4/3] w-full">
                                    <img
                                        src="/img/main_img_1.jpg"
                                        alt="우리의 비전"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div className="p-6 sm:p-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                                        <span className="text-primary-600 text-lg">🌉</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg sm:text-xl">우리의 비전</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4">
                                    우리는 '코드'라는 도구로 세상과 연결되는 다리를 만들고 있습니다.
                                    누구든지 자신의 생각을 표현하고, 의미 있는 결과를 만들어내는 경험을 제공합니다.
                                </p>
                                <p className="text-primary-700 font-semibold text-sm sm:text-base border-l-4 border-primary-500 pl-3">
                                    코드는 목적이 아니라, 가능성을 연결하는 도구입니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 1.5: 고민 섹션 */}
                    <div className="mb-10 sm:mb-12">
                        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 md:mb-8">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                <span className="text-white text-xl sm:text-2xl">💭</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 break-keep">혹시 이런 고민 해보신 적 있나요?</h2>
                        </div>
                        <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mb-6 sm:mb-8 md:mb-10">
                            TeamCodeBridge는 바로 이런 고민들에 함께 답을 찾기 위해 존재합니다.
                        </p>

                        {/* 고민 무한 스크롤 */}
                        <div className="mb-8 sm:mb-10 relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50/50 to-white p-3 sm:p-4">
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white pointer-events-none z-10"></div>
                            <div className="flex animate-marquee-slow gap-3 sm:gap-4 md:gap-6 items-stretch">
                                {/* 첫 번째 세트 */}
                                {[
                                    { text: "컴퓨터 관련 프로젝트를 해보고 싶은데... 할 줄 아는 게 없어요...", author: "24년도 최강적중 수강생" },
                                    { text: "시간이 없는데 효율적으로 프로젝트도 하고 세특도 남기고 싶어요!", author: "멘토링톤 1회차 수강생" },
                                    { text: "아이디어는 있는데 어떻게 구성해야 할지 막막해요", author: "23년도 최강적중 수강생" },
                                    { text: "하고 있는 프로젝트가 제대로 된 방향으로 가고 있는 건지 걱정돼요.", author: "멘토링톤 1회차 수강생" },
                                    { text: "정보 교사인데, 해주고 싶은 건 많은데 시간도 인프라도 부족해요.", author: "서울 동대문구 소재의 정보선생님" },
                                    { text: "생활기록부에 적을 내용이 괜찮은지 모르겠어요...", author: "수만휘 컴퓨터 게시판 학생" },
                                    { text: "코딩 공부를 하고 싶은데 매번 실패만 해요.", author: "24년도 최강적중 수강생" },
                                    { text: "그냥 좀... 조언이나 상담을 받고 싶어요", author: "멘토링톤 1회차 수강생" },
                                ].map((concern, i) => (
                                    <div key={`concern-1-${i}`} className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[320px] lg:w-[360px]">
                                        <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 h-full border border-gray-200 shadow-md hover:shadow-xl hover:border-primary-200 transition-all duration-300 group">
                                            <div className="mb-2 sm:mb-3">
                                                <span className="text-xl sm:text-2xl opacity-20 group-hover:opacity-40 transition-opacity">💭</span>
                                            </div>
                                            <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4 font-medium">
                                                "{concern.text}"
                                            </p>
                                            <div className="pt-3 sm:pt-4 border-t border-gray-100">
                                                <p className="text-xs sm:text-sm text-gray-500 text-right">
                                                    - {concern.author}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* 두 번째 세트 (무한 스크롤을 위해) */}
                                {[
                                    { text: "컴퓨터 관련 프로젝트를 해보고 싶은데... 할 줄 아는 게 없어요...", author: "24년도 최강적중 수강생" },
                                    { text: "시간이 없는데 효율적으로 프로젝트도 하고 세특도 남기고 싶어요!", author: "멘토링톤 1회차 수강생" },
                                    { text: "아이디어는 있는데 어떻게 구성해야 할지 막막해요", author: "23년도 최강적중 수강생" },
                                    { text: "하고 있는 프로젝트가 제대로 된 방향으로 가고 있는 건지 걱정돼요.", author: "멘토링톤 1회차 수강생" },
                                    { text: "정보 교사인데, 해주고 싶은 건 많은데 시간도 인프라도 부족해요.", author: "서울 동대문구 소재의 정보선생님" },
                                    { text: "생활기록부에 적을 내용이 괜찮은지 모르겠어요...", author: "수만휘 컴퓨터 게시판 학생" },
                                    { text: "코딩 공부를 하고 싶은데 매번 실패만 해요.", author: "24년도 최강적중 수강생" },
                                    { text: "그냥 좀... 조언이나 상담을 받고 싶어요", author: "멘토링톤 1회차 수강생" },
                                ].map((concern, i) => (
                                    <div key={`concern-2-${i}`} className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[320px] lg:w-[360px]">
                                        <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 h-full border border-gray-200 shadow-md hover:shadow-xl hover:border-primary-200 transition-all duration-300 group">
                                            <div className="mb-2 sm:mb-3">
                                                <span className="text-xl sm:text-2xl opacity-20 group-hover:opacity-40 transition-opacity">💭</span>
                                            </div>
                                            <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4 font-medium">
                                                "{concern.text}"
                                            </p>
                                            <div className="pt-3 sm:pt-4 border-t border-gray-100">
                                                <p className="text-xs sm:text-sm text-gray-500 text-right">
                                                    - {concern.author}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* OUR STORY 섹션 */}
                        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary-50/50 via-white to-gray-50/50 p-6 sm:p-8 md:p-10 lg:p-12 shadow-xl border border-primary-100/50">
                            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative grid md:grid-cols-2 gap-6 sm:gap-8 items-center z-10">
                                <div className="flex flex-col justify-center order-2 md:order-1">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-primary-600 text-base sm:text-lg">🌱</span>
                                        </div>
                                        <p className="text-primary-700 font-semibold tracking-wide text-xs sm:text-sm uppercase">OUR STORY</p>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4">
                                        친절한 시작이, 끝까지 가는 힘이 되도록
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg font-medium mb-3 sm:mb-4">
                                        처음 배우는 순간부터 결과물을 세상에 내놓는 순간까지.
                                    </p>
                                    <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">
                                        TeamCodeBridge는 '완주'의 경험을 설계합니다.
                                        <span className="block mt-2 text-primary-700 font-semibold text-sm sm:text-base md:text-lg">우리는 가르치기보다, 끝까지 함께 갑니다.</span>
                                    </p>
                                </div>
                                <div className="aspect-[16/10] md:aspect-auto md:min-h-[240px] sm:md:min-h-[280px] lg:min-h-[320px] order-1 md:order-2 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="/img/main_img_1.jpg"
                                        alt="TeamCodeBridge 활동 이미지"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 문제의식 섹션 */}
                    <div className="mb-10 sm:mb-12">
                        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 md:mb-8">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                <span className="text-white text-xl sm:text-2xl">❓</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 break-keep">왜 이렇게 많은 학생들이 코딩을 시작도 전에 포기할까?</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg max-w-3xl mb-6 sm:mb-8">
                            TeamCodeBridge는 <span className="font-semibold text-gray-800">"왜 이렇게 많은 학생들이 코딩을 시작도 전에 포기할까?"</span>라는 질문에서 출발했습니다.
                            코딩 교육의 가장 큰 장벽은 '재능'이 아니라 <span className="font-semibold text-gray-800">'시작의 어려움'</span>이었습니다.
                        </p>

                        {/* 기존 교육의 한계 카드뷰 */}
                        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
                            {/* 카드 1: 중/고등학교에서의 정규 행사 */}
                            <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl hover:border-primary-200 transition-all duration-300 flex flex-col">
                                <div className="aspect-[4/3] w-full overflow-hidden relative">
                                    <img
                                        src="/img/main_img_1.jpg"
                                        alt="중/고등학교에서의 정규 행사"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <span className="text-xs font-semibold text-gray-700">정규 행사</span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h4 className="font-bold text-gray-900 mb-3 text-lg">중/고등학교에서의 정규 행사</h4>
                                    <p className="text-gray-600 text-sm mb-5 italic flex-1 border-l-2 border-gray-300 pl-3">
                                        "정보교사 및 졸업생 멘토로서는 수업을 준비하기 매우 벅참."
                                    </p>
                                    <div className="space-y-2.5 text-xs sm:text-sm pt-4 border-t border-gray-100">
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-red-500 font-bold mt-0.5 text-base">✗</span>
                                            <span className="text-gray-600 leading-relaxed">컴퓨터과 관련 졸업생 멘토를 찾기 매우 어렵다.</span>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-green-500 font-bold mt-0.5 text-base">✓</span>
                                            <span className="text-gray-600 leading-relaxed">수업 받을 학생들을 매우 쉽게 찾을 수 있다.</span>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-red-500 font-bold mt-0.5 text-base">✗</span>
                                            <span className="text-gray-600 leading-relaxed">정보 교사 혼자서 프로젝트를 준비하기 어렵다.</span>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-red-500 font-bold mt-0.5 text-base">✗</span>
                                            <span className="text-gray-600 leading-relaxed">학생들 개개인의 코딩 수준을 알기 매우 어렵다.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 카드 2: 사설 컴퓨터 코딩 학원 */}
                            <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl hover:border-primary-200 transition-all duration-300 flex flex-col">
                                <div className="aspect-[4/3] w-full overflow-hidden relative">
                                    <img
                                        src="/img/main_img_1.jpg"
                                        alt="사설 컴퓨터 코딩 학원"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <span className="text-xs font-semibold text-gray-700">사설 학원</span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h4 className="font-bold text-gray-900 mb-3 text-lg">사설 컴퓨터 코딩 학원</h4>
                                    <p className="text-gray-600 text-sm mb-5 italic flex-1 border-l-2 border-gray-300 pl-3">
                                        "사설 코딩 학원을 가기에 시간이 부족하고 부모님이 가지 말라고 해요!"
                                    </p>
                                    <div className="space-y-2.5 text-xs sm:text-sm pt-4 border-t border-gray-100">
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-red-500 font-bold mt-0.5 text-base">✗</span>
                                            <span className="text-gray-600 leading-relaxed">수강료가 학부모님과 학생들에게 부담이 됨.</span>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-red-500 font-bold mt-0.5 text-base">✗</span>
                                            <span className="text-gray-600 leading-relaxed">타 과목 학원 다니기 벅차, 코딩학원 가기 힘들다.</span>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-green-500 font-bold mt-0.5 text-base">✓</span>
                                            <span className="text-gray-600 leading-relaxed">학원에서 A-Z까지 준비해주니 걱정이 없다.</span>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-red-500 font-bold mt-0.5 text-base">✗</span>
                                            <span className="text-gray-600 leading-relaxed">내가 잘 이해하고 있는지를 모르겠다.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 카드 3: 대학교 멘토링 프로젝트 */}
                            <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl hover:border-primary-200 transition-all duration-300 flex flex-col">
                                <div className="aspect-[4/3] w-full overflow-hidden relative">
                                    <img
                                        src="/img/main_img_1.jpg"
                                        alt="대학교 멘토링 프로젝트"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <span className="text-xs font-semibold text-gray-700">대학 프로젝트</span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h4 className="font-bold text-gray-900 mb-3 text-lg">대학교 멘토링 프로젝트</h4>
                                    <p className="text-gray-600 text-sm mb-5 italic flex-1 border-l-2 border-gray-300 pl-3">
                                        "1년에 단 한번의 기회 놓치면 방법이 없어요."
                                    </p>
                                    <div className="space-y-2.5 text-xs sm:text-sm pt-4 border-t border-gray-100">
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-red-500 font-bold mt-0.5 text-base">✗</span>
                                            <span className="text-gray-600 leading-relaxed">대학교에서 진행하는 행사에 대해서 잘 알지 못함.</span>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-red-500 font-bold mt-0.5 text-base">✗</span>
                                            <span className="text-gray-600 leading-relaxed">신청하기에 매우 힘들고 랜덤으로 선정됨.</span>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-red-500 font-bold mt-0.5 text-base">✗</span>
                                            <span className="text-gray-600 leading-relaxed">수도권 외 지방에 거주하는 경우 멘토 받기 어려움.</span>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-red-500 font-bold mt-0.5 text-base">✗</span>
                                            <span className="text-gray-600 leading-relaxed">진학하고자 하는 학교에 대해서 자세히 알 수 있음.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* 전환점 섹션 */}
                    <div className="mb-10 sm:mb-12">
                        <div className="bg-gradient-to-br from-primary-50 via-white to-primary-50/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-xl border border-primary-100/50 overflow-hidden relative">
                            {/* 배경 장식 */}
                            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                        <span className="text-white text-xl sm:text-2xl">🔄</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-xl sm:text-2xl md:text-3xl break-keep">그래서 우리는 다르게 하기로 했다</h3>
                                </div>
                                <p className="text-gray-700 leading-relaxed text-base sm:text-lg md:text-xl mb-8 sm:mb-10 font-medium max-w-3xl">
                                    우리는 '잘 가르치는 것'보다 <span className="text-primary-700 font-bold text-lg sm:text-xl">'끝까지 같이 가는 것'</span>을 선택했습니다.
                                </p>
                                
                                <div className="grid sm:grid-cols-3 gap-5 sm:gap-6 relative">
                                    {/* 화살표 (데스크톱에서만 표시) */}
                                    <div className="hidden sm:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary-300 via-primary-400 to-primary-300 transform -translate-y-1/2 z-0">
                                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
                                            <div className="w-0 h-0 border-l-8 border-l-primary-400 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                                        </div>
                                    </div>
                                    
                                    <div className="group relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-gray-200 hover:border-primary-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-red-400 to-blue-500 flex items-center justify-center shadow-lg">
                                                <span className="text-white text-base sm:text-lg">📚</span>
                                            </div>
                                        </div>
                                        <div className="mt-3 sm:mt-4 text-center">
                                            <p className="text-xs text-gray-500 mb-2 sm:mb-3 font-semibold uppercase tracking-wider">변화</p>
                                            <div className="space-y-1.5 sm:space-y-2">
                                                <p className="text-gray-400 text-xs sm:text-sm line-through">강의</p>
                                                <div className="text-primary-600 text-lg sm:text-xl">↓</div>
                                                <p className="text-primary-700 font-bold text-sm sm:text-base md:text-lg">프로젝트 중심</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="group relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-gray-200 hover:border-primary-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                                                <span className="text-white text-base sm:text-lg">👥</span>
                                            </div>
                                        </div>
                                        <div className="mt-3 sm:mt-4 text-center">
                                            <p className="text-xs text-gray-500 mb-2 sm:mb-3 font-semibold uppercase tracking-wider">변화</p>
                                            <div className="space-y-1.5 sm:space-y-2">
                                                <p className="text-gray-400 text-xs sm:text-sm line-through">혼자</p>
                                                <div className="text-primary-600 text-lg sm:text-xl">↓</div>
                                                <p className="text-primary-700 font-bold text-sm sm:text-base md:text-lg">멘토와 팀</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="group relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-gray-200 hover:border-primary-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                                                <span className="text-white text-base sm:text-lg">🎯</span>
                                            </div>
                                        </div>
                                        <div className="mt-3 sm:mt-4 text-center">
                                            <p className="text-xs text-gray-500 mb-2 sm:mb-3 font-semibold uppercase tracking-wider">변화</p>
                                            <div className="space-y-1.5 sm:space-y-2">
                                                <p className="text-gray-400 text-xs sm:text-sm line-through">이론</p>
                                                <div className="text-primary-600 text-lg sm:text-xl">↓</div>
                                                <p className="text-primary-700 font-bold text-sm sm:text-base md:text-lg">결과물</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 우리가 만들어온 방식 섹션 */}
                    <div className="mb-10 sm:mb-12">
                        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                <span className="text-white text-xl sm:text-2xl">⚙️</span>
                            </div>
                            <h3 className="font-bold text-gray-900 text-xl sm:text-2xl md:text-3xl break-keep">우리가 만들어온 방식</h3>
                            </div>

                        <div className="bg-gradient-to-br from-white via-gray-50/30 to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-xl border border-gray-100 relative overflow-hidden">
                            {/* 배경 장식 */}
                            <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-primary-50/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
                            
                            <div className="relative z-10">
                                <ol className="relative space-y-6 sm:space-y-8 md:space-y-10">
                                    <li className="relative pl-7 sm:pl-8 md:pl-12">
                                        <div className="absolute left-0 top-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg flex items-center justify-center border-2 sm:border-4 border-white">
                                            <span className="text-white font-bold text-base sm:text-lg">1</span>
                                        </div>
                                        <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
                                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                                <span className="text-xl sm:text-2xl">💡</span>
                                                <h4 className="font-bold text-gray-900 text-base sm:text-lg md:text-xl">문제의식</h4>
                                            </div>
                                            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
                                                "처음 배우는 사람도 쉽게 시작할 수 있는 교육이 필요하다"는 공감에서 출발했습니다.
                                            </p>
                                        </div>
                                    </li>
                                    
                                    <li className="relative pl-7 sm:pl-8 md:pl-12">
                                        <div className="absolute left-0 top-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg flex items-center justify-center border-2 sm:border-4 border-white">
                                            <span className="text-white font-bold text-base sm:text-lg">2</span>
                                        </div>
                                        <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
                                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                                <span className="text-xl sm:text-2xl">👨‍🏫</span>
                                                <h4 className="font-bold text-gray-900 text-base sm:text-lg md:text-xl">선배 멘토링</h4>
                                            </div>
                                            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-2">
                                            전공 선배(멘토)와 함께 배우고 질문하며, 막히는 구간을 끝까지 넘어갈 수 있도록 돕습니다.
                                        </p>
                                            <p className="text-primary-700 text-xs sm:text-sm md:text-base font-medium italic border-l-2 border-primary-300 pl-2 sm:pl-3">
                                                "끝까지 가본 경험"이 왜 중요한지 알고 있습니다.
                                            </p>
                                        </div>
                                    </li>
                                    
                                    <li className="relative pl-7 sm:pl-8 md:pl-12">
                                        <div className="absolute left-0 top-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg flex items-center justify-center border-2 sm:border-4 border-white">
                                            <span className="text-white font-bold text-base sm:text-lg">3</span>
                                        </div>
                                        <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
                                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                                <span className="text-xl sm:text-2xl">🚀</span>
                                                <h4 className="font-bold text-gray-900 text-base sm:text-lg md:text-xl">프로젝트 중심</h4>
                                            </div>
                                            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
                                                아이디어를 실제로 <span className="font-bold text-primary-700">기획하고 프로토타입까지 구현</span>해보는 경험을 제공합니다.
                                                실패해도 괜찮은 구조로 도전할 수 있습니다.
                                            </p>
                                        </div>
                                    </li>
                                    
                                    <li className="relative pl-7 sm:pl-8 md:pl-12">
                                        <div className="absolute left-0 top-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg flex items-center justify-center border-2 sm:border-4 border-white">
                                            <span className="text-white font-bold text-base sm:text-lg">4</span>
                                        </div>
                                        <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
                                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                                <span className="text-xl sm:text-2xl">🏆</span>
                                                <h4 className="font-bold text-gray-900 text-base sm:text-lg md:text-xl">미니 해커톤</h4>
                                            </div>
                                            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-2">
                                            짧은 시간에 집중해 결과물을 만들어내며, 성취감을 통해 다음 도전을 이어가게 합니다.
                                        </p>
                                            <p className="text-primary-700 text-xs sm:text-sm md:text-base font-medium italic border-l-2 border-primary-300 pl-2 sm:pl-3">
                                                결과물을 만들어내는 경험의 힘을 믿습니다.
                                            </p>
                                        </div>
                                    </li>
                                </ol>
                            </div>
                        </div>

                        {/* 실행 모델 카드 */}
                        <div className="mt-8 sm:mt-10 grid sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                            <div className="group bg-gradient-to-br from-white to-primary-50/30 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-gray-200 hover:border-primary-400 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors flex-shrink-0">
                                        <span className="text-primary-600 text-lg sm:text-xl">🌱</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-500 font-semibold uppercase tracking-wide">교육 철학</p>
                                </div>
                                <p className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl">포용적 시작</p>
                            </div>
                            
                            <div className="group bg-gradient-to-br from-white to-primary-50/30 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-gray-200 hover:border-primary-400 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors flex-shrink-0">
                                        <span className="text-primary-600 text-lg sm:text-xl">🤝</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-500 font-semibold uppercase tracking-wide">학습 방식</p>
                                </div>
                                <p className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl">멘토와 함께</p>
                            </div>
                            
                            <div className="group bg-gradient-to-br from-white to-primary-50/30 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-gray-200 hover:border-primary-400 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors flex-shrink-0">
                                        <span className="text-primary-600 text-lg sm:text-xl">🎯</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-500 font-semibold uppercase tracking-wide">성장의 기준</p>
                                </div>
                                <p className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl">결과물 완주</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Values */}
                    <div className="mb-10 sm:mb-12">
                        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                <span className="text-white text-xl sm:text-2xl">⭐</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">핵심 가치</h2>
                        </div>

                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
                            <div className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-primary-400 transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
                                <div className="aspect-[4/3] w-full overflow-hidden relative">
                                    <img
                                        src="/img/main_img_1.jpg"
                                        alt="생각 확장"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-6 text-center flex-1 flex flex-col">
                                    <span className="text-4xl mb-3 block">🔍</span>
                                    <h3 className="font-bold text-gray-900 mb-2 text-lg">생각 확장</h3>
                                    <p className="text-gray-600 text-sm sm:text-base flex-1">다양한 관점에서 문제를 바라보는 시야를 키웁니다</p>
                                </div>
                            </div>
                            <div className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-primary-400 transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
                                <div className="aspect-[4/3] w-full overflow-hidden relative">
                                    <img
                                        src="/img/main_img_1.jpg"
                                        alt="기술 성장"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-6 text-center flex-1 flex flex-col">
                                    <span className="text-4xl mb-3 block">💻</span>
                                    <h3 className="font-bold text-gray-900 mb-2 text-lg">기술 성장</h3>
                                    <p className="text-gray-600 text-sm sm:text-base flex-1">기술을 통해 세상의 문제를 해결하는 방법을 배웁니다</p>
                                </div>
                            </div>
                            <div className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-primary-400 transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
                                <div className="aspect-[4/3] w-full overflow-hidden relative">
                                    <img
                                        src="/img/main_img_1.jpg"
                                        alt="결과 창출"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-6 text-center flex-1 flex flex-col">
                                    <span className="text-4xl mb-3 block">🎯</span>
                                    <h3 className="font-bold text-gray-900 mb-2 text-lg">결과 창출</h3>
                                    <p className="text-gray-600 text-sm sm:text-base flex-1">아이디어를 실제 프로젝트로 구현하는 경험을 합니다</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 지금의 TeamCodeBridge 섹션 */}
            <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white via-primary-50/20 to-gray-50/50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg flex-shrink-0">
                            <span className="text-white text-xl sm:text-2xl">🚀</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center break-keep">
                            지금의 TeamCodeBridge
                        </h2>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto text-center mb-8 sm:mb-10 md:mb-12">
                        이건 시작에 불과합니다. TeamCodeBridge는 지금도 계속 진화하고 있습니다.
                    </p>

                    <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8 mb-8 sm:mb-10">
                        <div className="group text-center p-5 sm:p-6 md:p-8 bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-primary-400 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-2">+</div>
                            <p className="text-xs sm:text-sm text-gray-500 mb-2 font-semibold uppercase tracking-wide">참여 학생</p>
                            <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900">함께 성장하는</p>
                        </div>
                        <div className="group text-center p-5 sm:p-6 md:p-8 bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-primary-400 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-2">+</div>
                            <p className="text-xs sm:text-sm text-gray-500 mb-2 font-semibold uppercase tracking-wide">프로젝트</p>
                            <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900">결과물 중심</p>
                        </div>
                        <div className="group text-center p-5 sm:p-6 md:p-8 bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-primary-400 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-2">+</div>
                            <p className="text-xs sm:text-sm text-gray-500 mb-2 font-semibold uppercase tracking-wide">멘토 경험</p>
                            <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900">지속 가능한</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary-50 via-white to-primary-50/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-primary-100/50 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-primary-100/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
                        <div className="relative z-10 max-w-3xl mx-auto text-center">
                            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                                더 많은 학생, 더 다양한 프로젝트, 지속 가능한 비영리 구조
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                                TeamCodeBridge의 모든 교육은 '결과물'로 마무리됩니다.
                                앞으로도 더 많은 학생들이 자신만의 프로젝트를 완성하고, 
                                그 경험을 바탕으로 다음 도전을 이어갈 수 있도록 돕겠습니다.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-gray-50/50 via-white to-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <div className="mb-6 sm:mb-8 md:mb-10">
                        <div className="max-w-3xl mx-auto rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
                            <div className="aspect-[16/8] w-full">
                                <img
                                    src="/img/main_img_1.jpg"
                                    alt="TeamCodeBridge 프로그램 이미지"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight break-keep">
                        가능성을 향한 여정, 지금 함께하세요!
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 max-w-2xl mx-auto">
                        처음 배우는 순간부터 결과물을 만드는 순간까지. 
                        TeamCodeBridge와 함께 성장해보세요.
                    </p>
                    <a
                        href="/#recruit"
                        className="inline-block bg-primary-600 text-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-full font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-600/30 text-sm sm:text-base min-h-[44px] flex items-center justify-center"
                    >
                        지원하기 →
                    </a>
                </div>
            </section>

            <Footer variant="light" />
        </main>
    )
}
