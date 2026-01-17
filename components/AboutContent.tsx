'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
}

export default function AboutContent() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="bg-white text-[#000000] overflow-hidden">
            {/* Hero Section - High Contrast */}
            <section className="relative pt-48 pb-32 px-6 overflow-hidden z-0">
                <div className="absolute top-0 left-0 w-full h-full -z-10">
                    <img src="/img/main_img_1.jpg" alt="Hero Background" className="w-full h-full object-cover" />
                    <div className="absolute top-0 left-0 w-full h-full bg-black/70" />
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center md:text-left"
                    >
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.9] text-white">
                            LIMITLESS <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-400">
                                POSSIBILITY
                            </span>
                        </h1>

                        {/* Highlight Keywords (Badges) */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-12">
                            <span className="px-6 py-3 bg-white/10 text-white rounded-full text-sm md:text-base font-bold border border-white/20 backdrop-blur-sm">
                                프로젝트 중심 교육
                            </span>
                            <span className="px-6 py-3 bg-white/5 text-gray-300 rounded-full text-sm md:text-base font-bold border border-white/10 backdrop-blur-sm">
                                전공 선배 멘토링
                            </span>
                            <span className="px-6 py-3 bg-white/5 text-gray-300 rounded-full text-sm md:text-base font-bold border border-white/10 backdrop-blur-sm">
                                비영리 교육봉사
                            </span>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed font-light">
                                우리는 단순히 기술을 가르치는 것을 넘어, <br />
                                아이디어가 현실이 되는 <span className="text-white font-semibold underline decoration-primary-500 decoration-4 underline-offset-4">'완주'의 경험</span>을 선물합니다.
                            </p>
                            <div className="hidden md:block w-32 h-32 border-t-2 border-l-2 border-primary-500 opacity-40" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Concerns Section - Floating Dark Style */}
            <section className="py-40 bg-[#050505] relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-900/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
                    <motion.div {...fadeInUp} className="mb-20">
                        <h2 className="text-4xl md:text-6xl font-black mb-8 text-white tracking-tight leading-tight">
                            우리는 이 질문들에 대한 <br className="md:hidden" />
                            <span className="text-primary-500">답을 함께</span> 찾아갑니다.
                        </h2>
                    </motion.div>

                    <div className="relative h-[500px] md:h-[400px] w-full max-w-5xl mx-auto">
                        {[
                            { text: "프로젝트를 해보고 싶은데 할 줄 아는 게 없어요.", x: "5%", y: "10%", rotate: -5, delay: 0 },
                            { text: "효율적으로 프로젝트도 하고 세특도 남기고 싶어요.", x: "65%", y: "5%", rotate: 3, delay: 0.2 },
                            { text: "아이디어는 있는데 어떻게 시작할지 막막해요.", x: "0%", y: "50%", rotate: 2, delay: 0.4 },
                            { text: "제 프로젝트가 맞는 방향으로 가고 있는지 걱정돼요.", x: "70%", y: "45%", rotate: -2, delay: 0.1 },
                            { text: "정보 교사인데 시간과 인프라가 부족해요.", x: "35%", y: "75%", rotate: 4, delay: 0.3 },
                            { text: "생활기록부에 적을 내용이 고민이에요.", x: "20%", y: "35%", rotate: -3, delay: 0.5 }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                animate={{
                                    y: [0, -15, 0],
                                    transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: item.delay }
                                }}
                                style={{
                                    left: item.x,
                                    top: item.y,
                                    rotate: `${item.rotate}deg`
                                }}
                                className={`absolute p-6 md:p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl whitespace-nowrap hidden md:block ${i === 2 || i === 4 ? 'z-20' : 'z-10'}`}
                            >
                                <p className="text-white/80 text-sm md:text-lg font-medium tracking-tight">
                                    {item.text}
                                </p>
                            </motion.div>
                        ))}

                        {/* Mobile Version of Cards (Stacked/Simplified) */}
                        <div className="md:hidden flex flex-col gap-4 items-center">
                            {[
                                "프로젝트를 해보고 싶은데 할 줄 아는 게 없어요.",
                                "효율적으로 프로젝트도 하고 세특도 남기고 싶어요.",
                                "아이디어는 있는데 어떻게 시작할지 막막해요.",
                                "제 프로젝트가 맞는 방향으로 가고 있는지 걱정돼요."
                            ].map((text, i) => (
                                <motion.div
                                    key={`mobile-${i}`}
                                    {...fadeInUp}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-5 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl w-full max-w-[280px]"
                                >
                                    <p className="text-white/70 text-sm font-medium">{text}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Dots */}
                    <div className="mt-20 flex flex-col items-center gap-2 opacity-30">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                </div>
            </section>


            {/* University Marquee - Two Rows, Opposite Directions */}
            {/* <section className="py-24 bg-white border-y border-gray-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 mb-16">
                    <p className="text-xs font-bold text-primary-600 uppercase tracking-[0.4em]">
                        Partner Universities
                    </p>
                </div>
                <div className="space-y-16">
                    {/* Row 1: Moving Left */}
            {/* <div className="relative flex overflow-hidden">
                        <div className="animate-marquee flex items-center gap-16 md:gap-24 whitespace-nowrap">
                            {[
                                { name: '연세대학교', file: '연세대학교.png' },
                                { name: '고려대학교', file: '고려대학교.svg' },
                                { name: '포항공대', file: '포항공대.png' },
                                { name: '숭실대학교', file: '숭실대학교.png' },
                                { name: '광운대학교', file: '광운대학교.png' },
                                { name: '명지대학교', file: '명지대학교.png' },
                                { name: '가천대학교', file: '가천대학교.png' },
                                // Duplicate for infinite loop
                                { name: '연세대학교', file: '연세대학교.png' },
                                { name: '고려대학교', file: '고려대학교.svg' },
                                { name: '포항공대', file: '포항공대.png' },
                                { name: '숭실대학교', file: '숭실대학교.png' },
                                { name: '광운대학교', file: '광운대학교.png' },
                                { name: '명지대학교', file: '명지대학교.png' },
                                { name: '가천대학교', file: '가천대학교.png' },
                            ].map((uni, idx) => (
                                <img
                                    key={`row1-${uni.name}-${idx}`}
                                    src={`/img/university/${uni.file}`}
                                    alt={uni.name}
                                    className="h-12 md:h-16 w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-default"
                                />
                            ))}
                        </div>
                    </div> */}

            {/* Row 2: Moving Right (Reversed and Offset) */}
            {/* <div className="relative flex overflow-hidden">
                        <div className="animate-marquee-reverse flex items-center gap-16 md:gap-24 whitespace-nowrap">
                            {[
                                { name: '숭실대학교', file: '숭실대학교.png' },
                                { name: '포항공대', file: '포항공대.png' },
                                { name: '고려대학교', file: '고려대학교.svg' },
                                { name: '연세대학교', file: '연세대학교.png' },
                                { name: '가천대학교', file: '가천대학교.png' },
                                { name: '명지대학교', file: '명지대학교.png' },
                                { name: '광운대학교', file: '광운대학교.png' },
                                // Duplicate for infinite loop
                                { name: '숭실대학교', file: '숭실대학교.png' },
                                { name: '포항공대', file: '포항공대.png' },
                                { name: '고려대학교', file: '고려대학교.svg' },
                                { name: '연세대학교', file: '연세대학교.png' },
                                { name: '가천대학교', file: '가천대학교.png' },
                                { name: '명지대학교', file: '명지대학교.png' },
                                { name: '광운대학교', file: '광운대학교.png' },
                            ].map((uni, idx) => (
                                <img
                                    key={`row2-${uni.name}-${idx}`}
                                    src={`/img/university/${uni.file}`}
                                    alt={uni.name}
                                    className="h-12 md:h-16 w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-default"
                                />
                            ))}
                        </div>
                    </div> */}
            {/* </div>

            </section> */}

            {/* Our Story - New Deep Storytelling */}
            <section className="pt-40 pb-12 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    {/* Section Header */}
                    <motion.div {...fadeInUp} className="mb-32 text-center">
                        <h2 className="text-4xl md:text-6xl font-black text-black leading-tight tracking-tight">
                            <span className="text-primary-600">팀코드브릿지</span>는 어떻게 만들어졌을까요?
                        </h2>
                    </motion.div>

                    {/* Story 1: 고등학생 시절부터 품어온 질문 */}
                    <motion.div {...fadeInUp} className="text-center">
                        <h3 className="text-3xl md:text-5xl font-black text-black mb-12">고등학생 시절부터 품어온 질문</h3>

                        <div className="max-w-4xl mx-auto space-y-6">
                            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
                                학생 시절 <span className="text-black font-semibold">코딩을 포함한 IT 역량</span>을 제대로 쌓아가는 일은 생각보다 쉽지 않았습니다.
                            </p>

                            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
                                여기서 말하는 역량이란 <span className="text-black font-semibold">단순히 문법을 배우는 것이 아니라</span><span className="text-black font-semibold underline decoration-primary-500 decoration-4 underline-offset-4"><br />기획하고, 협업하며, 하나의 프로젝트를 끝까지 완주하는 경험</span>을 의미합니다.
                            </p>

                            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
                                학교에서 배울 수 있는 내용은 <span className="text-black font-bold">한정적이었고</span><br />
                                궁금한 점이 생기면 주변에 도움을 요청해야 했습니다.<br />
                                하지만 <span className="text-black font-bold">언제든 편하게 질문할 수 있는 구조는 아니었습니다.</span>
                            </p>

                            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
                                많은 학생들은 결국 <span className="text-black font-bold">스스로 자료를 찾고, 시행착오를 겪으며</span><br />
                                각자의 방식으로 프로젝트와 진로를 준비하게 됩니다.
                            </p>

                            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
                                이 과정은 분명 성장의 계기가 되기도 하지만<br />
                                동시에 <span className="text-black font-bold">개인의 노력에만 의존해야 하는 한계</span>를 드러냅니다.
                            </p>

                            <blockquote className="my-16 text-center">
                                <div className="text-2xl md:text-4xl font-black text-gray-900 leading-relaxed">
                                    이미 이 길을 걸어본 선배가 <span className="bg-primary-600 text-white px-1">옆에 있었다면 어땠을까?</span>
                                </div>
                            </blockquote>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* Story 2: 대학에 와서 보인 공백 */}
            <section className="pt-12 pb-20 px-6 bg-[#F4F9FF]">
                <div className="max-w-5xl mx-auto">
                    <motion.div {...fadeInUp} className="text-center">
                        <h3 className="text-3xl md:text-5xl font-black text-black mb-12">학생을 위한 IT 성장 환경의 부재</h3>

                        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
                            대학생이 되고 나서 주변을 돌아보니<br />
                            <span className="text-black font-semibold">중·고등학생을 대상으로 대학생이 직접 운영하는 비영리 IT 교육</span>은 거의 없었습니다.
                        </p>

                        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light mt-6">
                            아이러니하게도 가장 좋은 선생님이 될 수 있는 사람들이 바로 가까이에 있었는데 말이죠.
                        </p>

                        <div className="flex flex-col gap-3 my-10 max-w-2xl mx-auto">
                            {[
                                "같은 길을 먼저 걸어본 사람, 경험에서 방향을 읽을 수 있는 사람",
                                "비슷한 고민을 해봤던 사람, 문제의 맥락을 이해하고 기획할 수 있는 사람",
                                "실패와 시행착오를 이미 겪어본 사람, AI가 대신할 수 없는 판단을 할 수 있는 사람"
                            ].map((text, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-4 bg-white border border-primary-50 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
                                >
                                    <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 6L9 17L4 12" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-800">{text}</p>
                                </motion.div>
                            ))}
                        </div>

                        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
                            학생의 입장에서 <span className="bg-primary-600 text-white px-1 font-semibold">'선배'의 설명과 조언만큼 와닿는 교육은 없습니다.</span>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story 3: 그래서, 팀코드브릿지 */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <motion.div {...fadeInUp} className="text-center">
                        <h3 className="text-3xl md:text-5xl font-black text-black mb-8">그래서 만들어진 <span className="text-primary-600">팀코드브릿지</span></h3>

                        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light mb-4">
                            팀코드브릿지는 여기서 시작되었습니다.
                        </p>

                        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
                            우리는 단순히 지식을 전달하는 단체가 아닙니다.<br />
                            <span className="text-black font-semibold">학생들의 시선에서 고민하고 같은 눈높이에서 설명하는 IT 교육 봉사 단체</span>입니다.
                        </p>

                        <blockquote className="my-10">
                            <div className="text-xl md:text-2xl leading-relaxed">
                                <p className="font-black text-gray-900 mb-1">
                                    <span className="bg-primary-600 text-white px-1">같은 과정을 먼저 경험한 선배들의 시선</span>에서
                                </p>
                                <p className="text-gray-700 font-light">
                                    팀코드브릿지의 교육은 출발합니다.
                                </p>
                            </div>
                        </blockquote>
                    </motion.div>
                </div>
            </section>

            {/* Story 4: 우리가 모인 이유 */}
            <section className="py-12 px-6 bg-[#F4F9FF]">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div {...fadeInUp}>
                        <h3 className="text-3xl md:text-5xl font-black text-black mb-8"><span className="text-primary-600">팀코드브릿지</span>가 품은 하나의 질문</h3>

                        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light mb-8">
                            팀코드브릿지는 하나의 공통된 질문으로 모였습니다.
                        </p>

                        <blockquote className="my-10 max-w-4xl mx-auto relative px-16 py-8">
                            <span className="absolute top-[-20px] left-0 text-6xl md:text-8xl text-gray-300 font-serif leading-none">“</span>

                            <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed relative z-10">
                                우리가 과거에 받지 못해 아쉬웠던 도움을<br />
                                지금의 학생들에게 전해줄 수는 없을까?
                            </p>

                            <span className="absolute bottom-[-40px] right-0 text-6xl md:text-8xl text-gray-300 font-serif leading-none">”</span>
                        </blockquote>

                        <p className="text-xl md:text-2xl text-black leading-relaxed font-bold mb-4">
                            그래서 팀코드브릿지 멘토들은
                        </p>

                        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light mt-4">
                            학생 시절의 마음을 잊지 않고 <span className="bg-primary-600 text-white px-0.5 font-bold">콘텐츠를 만들며</span><br />
                            교육 방식을 계속해서 고민해 <span className="bg-primary-600 text-white px-0.5 font-bold">IT 교육 봉사</span>라는 하나의 방향으로 모였습니다.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story 5: 우리의 다짐 */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div {...fadeInUp}>
                        <h3 className="text-3xl md:text-5xl font-black text-black mb-12">다음 다리를 놓는 <span className="text-primary-600">사람들</span></h3>

                        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
                            팀코드브릿지의 교육은 <span className="text-black font-bold">한 번으로 끝나지</span> 않습니다.
                        </p>

                        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light mt-8">
                            교육을 통해 성장한 멘티가<br />
                            다시 <span className="text-black font-bold">멘토로 참여해</span> 자신의 경험을 나누고<br />
                            그 과정에서 <span className="text-black font-bold">또 다른 멘티가 성장합니다.</span>
                        </p>

                        <p className="text-xl md:text-2xl text-black leading-relaxed font-bold mt-12">
                            우리는 이 반복되는 연결이<br />
                            <span className="bg-primary-600 text-white px-1">가장 현실적이고 건강한 교육 모델</span>이라 믿습니다.
                        </p>
                    </motion.div>
                </div>
            </section>



            {/* CTA Section - Join Us */}
            <section className="py-32 px-6 bg-[#0B1121] text-center">
                <div className="max-w-4xl mx-auto">
                    <motion.div {...fadeInUp}>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
                            BE THE BRIDGE
                        </h2>
                        <p className="text-lg md:text-xl text-gray-400 mb-12 font-medium">
                            가능성의 끝에서 IT 교육의 시작!<br />
                            함께 성장하고 함께 만들어가는 TeamCodeBridge
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                            <motion.a
                                href="/recruit/mentor"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-primary-600 text-white rounded-full font-bold text-lg hover:bg-primary-700 transition-colors w-full md:w-auto shadow-lg shadow-primary-900/20"
                            >
                                26 시즌 멘토 신청 →
                            </motion.a>
                            <motion.a
                                href="/recruit/school"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 rounded-full font-bold text-lg hover:border-white hover:text-white transition-colors w-full md:w-auto"
                            >
                                26 시즌 스쿨어택 신청 →
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
