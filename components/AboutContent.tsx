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
            <section className="relative pt-48 pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[70%] bg-primary-50 rounded-full blur-[120px] opacity-60" />
                    <div className="absolute bottom-0 left-[-5%] w-[40%] h-[50%] bg-blue-50 rounded-full blur-[100px] opacity-40" />
                </div>

                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center md:text-left"
                    >
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.9] text-black">
                            LIMITLESS <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-400">
                                POSSIBILITY
                            </span>
                        </h1>

                        {/* Highlight Keywords (Badges) */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-12">
                            <span className="px-6 py-3 bg-primary-50 text-primary-700 rounded-full text-sm md:text-base font-bold border border-primary-100 shadow-sm">
                                프로젝트 중심 교육
                            </span>
                            <span className="px-6 py-3 bg-gray-50 text-gray-700 rounded-full text-sm md:text-base font-bold border border-gray-100 shadow-sm">
                                전공 선배 멘토링
                            </span>
                            <span className="px-6 py-3 bg-gray-50 text-gray-700 rounded-full text-sm md:text-base font-bold border border-gray-100 shadow-sm">
                                비영리 교육봉사
                            </span>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <p className="text-xl md:text-2xl text-gray-500 max-w-2xl leading-relaxed font-light">
                                우리는 단순히 기술을 가르치는 것을 넘어, <br />
                                아이디어가 현실이 되는 <span className="text-black font-semibold underline decoration-primary-500 decoration-4 underline-offset-4">'완주'의 경험</span>을 선물합니다.
                            </p>
                            <div className="hidden md:block w-32 h-32 border-t-2 border-l-2 border-primary-600 opacity-20" />
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
            <section className="py-24 bg-white border-y border-gray-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 mb-16">
                    <p className="text-xs font-bold text-primary-600 uppercase tracking-[0.4em]">
                        Partner Universities
                    </p>
                </div>

                <div className="space-y-16">
                    {/* Row 1: Moving Left */}
                    <div className="relative flex overflow-hidden">
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
                    </div>

                    {/* Row 2: Moving Right (Reversed and Offset) */}
                    <div className="relative flex overflow-hidden">
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
                    </div>
                </div>
            </section>

            {/* Our Story - Bold Timeline */}
            <section className="py-40 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <motion.div {...fadeInUp} className="mb-32">
                        <span className="text-primary-600 font-bold tracking-[0.4em] text-xs uppercase mb-6 block">Our Story</span>
                        <h2 className="text-5xl md:text-8xl font-black text-black leading-none tracking-tighter">
                            KIND START, <br />
                            STRONG END.
                        </h2>
                    </motion.div>

                    <div className="space-y-16">
                        {[
                            {
                                step: "01",
                                title: "문제의식",
                                desc: "코딩 교육의 가장 큰 장벽은 '재능'이 아니라 '시작의 어려움'이었습니다. 우리는 누구나 쉽게 첫 발을 뗄 수 있는 환경을 고민했습니다."
                            },
                            {
                                step: "02",
                                title: "다르게 하기",
                                desc: "단순한 강의를 넘어 '멘토링'과 '프로젝트'를 결합했습니다. 잘 가르치는 것보다 끝까지 같이 가는 것을 선택했습니다."
                            },
                            {
                                step: "03",
                                title: "완주의 경험",
                                desc: "짧은 시간에 집중해 결과물을 만들어내는 해커톤을 통해, 학생들에게 '나도 할 수 있다'는 강력한 성취감을 선물합니다."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                {...fadeInUp}
                                className="group flex flex-col md:flex-row gap-12 p-12 hover:bg-primary-50 transition-colors duration-700 rounded-[40px]"
                            >
                                <div className="text-7xl font-black text-primary-600/20 group-hover:text-primary-600 transition-colors duration-700 md:w-1/4">
                                    {item.step}
                                </div>
                                <div className="md:w-3/4">
                                    <h3 className="text-3xl font-black mb-6 text-black">{item.title}</h3>
                                    <p className="text-xl text-gray-600 leading-relaxed font-light">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section - Blue Background Point */}
            <section className="py-40 px-6 bg-primary-600 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-white rounded-full blur-[150px]" />
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div {...fadeInUp} className="mb-24">
                        <h2 className="text-5xl md:text-7xl font-black mb-8">CORE VALUES</h2>
                        <div className="h-1 w-32 bg-white" />
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: "🔍", title: "생각 확장", desc: "다양한 관점에서 문제를 바라보는 시야를 키웁니다." },
                            { icon: "💻", title: "기술 성장", desc: "기술을 통해 세상의 문제를 해결하는 방법을 배웁니다." },
                            { icon: "🎯", title: "결과 창출", desc: "아이디어를 실제 프로젝트로 구현하는 경험을 합니다." }
                        ].map((value, i) => (
                            <motion.div
                                key={i}
                                {...fadeInUp}
                                transition={{ delay: i * 0.1 }}
                                className="p-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-[48px] hover:bg-white hover:text-primary-600 transition-all duration-500 group"
                            >
                                <div className="text-6xl mb-10 grayscale group-hover:grayscale-0 transition-all">{value.icon}</div>
                                <h3 className="text-2xl font-black mb-6">{value.title}</h3>
                                <p className="text-primary-100 group-hover:text-primary-700 text-lg leading-relaxed font-light transition-colors">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Bold Black & Blue */}
            <section className="py-48 px-6 bg-white text-center">
                <div className="max-w-4xl mx-auto">
                    <motion.div {...fadeInUp}>
                        <span className="text-primary-600 font-black tracking-[0.5em] text-xs uppercase mb-10 block">Join Us</span>
                        <h2 className="text-6xl md:text-9xl font-black mb-16 leading-[0.85] text-black tracking-tighter">
                            READY TO <br />
                            <span className="text-primary-600">BRIDGE?</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-500 mb-20 font-light max-w-2xl mx-auto">
                            처음 배우는 순간부터 결과물을 만드는 순간까지. <br />
                            TeamCodeBridge가 당신의 다리가 되어드립니다.
                        </p>
                        <motion.a
                            href="/#recruit"
                            whileHover={{ scale: 1.05, backgroundColor: '#000000', color: '#ffffff' }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block border-4 border-black text-black px-16 py-6 rounded-full font-black text-2xl transition-all duration-300"
                        >
                            지원하기 →
                        </motion.a>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
