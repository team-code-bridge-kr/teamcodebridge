'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const fadeInUpVariants = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
}

const fadeInUpTransition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] }

const staggerContainer = {
    initial: {},
    whileInView: {
        transition: {
            staggerChildren: 0.1
        }
    }
}

export default function MentorRecruitContent() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="bg-white text-black overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-48 pb-32 px-6 bg-[#050505] text-white">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
                        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[70%] bg-primary-900/20 rounded-full blur-[120px]" />
                        <div className="absolute bottom-0 left-[-5%] w-[40%] h-[50%] bg-blue-900/10 rounded-full blur-[100px]" />
                    </div>
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div
                        initial="initial"
                        animate="whileInView"
                        variants={fadeInUpVariants}
                        transition={fadeInUpTransition}
                    >
                        <span className="inline-block px-4 py-2 mb-8 text-sm font-bold tracking-widest text-primary-400 bg-primary-950/50 rounded-full uppercase border border-primary-900/50">
                            2026 Season Mentor Recruitment
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[1.1]">
                            가능성을 현실로 만드는 <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-300">
                                여정에 합류하세요
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed font-light mb-12">
                            TeamCodeBridge와 함께 IT 교육의 새로운 기준을 세우고, <br />
                            다음 세대의 성장을 이끌어갈 열정적인 멘토를 기다립니다.
                        </p>
                        <motion.a
                            href="#apply"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block bg-primary-600 text-white px-12 py-5 rounded-full font-bold text-xl transition-all hover:bg-primary-500 shadow-xl shadow-primary-600/20"
                        >
                            지금 지원하기 →
                        </motion.a>
                    </motion.div>
                </div>
            </section>

            {/* Environment & Benefits Section - Integrated 8 Cards */}
            <section className="py-40 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial="initial"
                        whileInView="whileInView"
                        variants={fadeInUpVariants}
                        transition={fadeInUpTransition}
                        viewport={{ once: true }}
                        className="mb-24"
                    >
                        <h2 className="text-orange-500 font-black text-lg mb-4 tracking-tight">'겁 없이 달려들기 위한'</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-black leading-tight">
                            몰입과 성장의 환경을 제공합니다.
                        </h3>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: "⏰", title: "자율적인 근무환경", desc: "멘토링 관련된 업무 외에는 자율적인 근무환경을 제공해요." },
                            { icon: "🪪", title: "명함 제공", desc: "멘토링 출강 및 미팅시 사용할 수 있는 팀코드브릿지만의 명함을 제공해요." },
                            { icon: "📧", title: "메일 제공", desc: "yourname@teamcodebridge.dev로 시작하는 개인별 팀메일을 제공해요. 자유롭게 이용하세요." },
                            { icon: "🚀", title: "실전 프로젝트 리딩", desc: "다양한 도메인의 프로젝트를 직접 리딩하며 실무 역량을 키워요." },
                            { icon: "🎓", title: "멘토링 역량 강화", desc: "체계적인 교육을 통해 누군가를 가르치고 이끄는 힘을 배워요." },
                            { icon: "🏆", title: "우수 멘토 시상", desc: "뛰어난 성과를 보여준 멘토에게는 특별한 포상과 혜택을 제공합니다." },
                            { icon: "🖥️", title: "서버 제공", desc: "연구 및 개발을 할 수 있는 개발서버를 제공해요." },
                            { icon: "📚", title: "성장 지원", desc: "구성원 성장을 위해 일부 도서를 대여해드려요." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial="initial"
                                whileInView="whileInView"
                                variants={fadeInUpVariants}
                                transition={{ ...fadeInUpTransition, delay: i * 0.05 }}
                                viewport={{ once: true }}
                                className="p-10 bg-[#f8f9fa] rounded-[32px] flex flex-col items-center text-center group hover:bg-white hover:shadow-2xl hover:shadow-primary-600/5 transition-all duration-500"
                            >
                                <div className="text-5xl mb-8 transform group-hover:scale-110 transition-transform duration-500">
                                    {item.icon}
                                </div>
                                <h4 className="text-xl font-black mb-4 text-black">{item.title}</h4>
                                <p className="text-gray-500 leading-relaxed text-sm font-light break-keep">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recruitment Process */}
            <section className="py-40 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial="initial"
                        whileInView="whileInView"
                        variants={fadeInUpVariants}
                        transition={fadeInUpTransition}
                        viewport={{ once: true }}
                        className="text-center mb-24"
                    >
                        <h2 className="text-5xl md:text-7xl font-black text-black mb-8">RECRUIT PROCESS</h2>
                        <p className="text-gray-500 text-xl font-light">합류를 위한 여정을 소개합니다.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -translate-y-1/2 z-0" />

                        {[
                            { step: "01", title: "서류 접수", desc: "지원 동기와 역량을 <br/> 중심으로 검토합니다." },
                            { step: "02", title: "비대면 면접", desc: "서로의 가치관과 <br/> 핏을 맞추어 봅니다." },
                            { step: "03", title: "최종 합격", desc: "TeamCodeBridge의 <br/> 멘토로 합류합니다." },
                            { step: "04", title: "온보딩", desc: "멘토링 활동을 위한 <br/> 준비를 시작합니다." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial="initial"
                                whileInView="whileInView"
                                variants={fadeInUpVariants}
                                viewport={{ once: true }}
                                transition={{ ...fadeInUpTransition, delay: i * 0.1 }}
                                className="relative z-10 bg-white p-8 text-center"
                            >
                                <div className="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-8 text-2xl font-black shadow-xl shadow-primary-600/20">
                                    {item.step}
                                </div>
                                <h4 className="text-2xl font-black mb-4 text-black">{item.title}</h4>
                                <p className="text-gray-500 font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: item.desc }} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Culture Section */}
            <section className="py-40 px-6 bg-[#fafafa]">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial="initial"
                        whileInView="whileInView"
                        variants={fadeInUpVariants}
                        transition={fadeInUpTransition}
                        viewport={{ once: true }}
                        className="mb-24"
                    >
                        <h2 className="text-primary-600 font-black text-sm tracking-[0.3em] uppercase mb-6">Our Culture</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-black leading-tight">
                            최고의 동료들과 함께 <br />
                            성장하는 문화를 만듭니다.
                        </h3>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "수평적인 소통", desc: "직급과 나이에 상관없이 누구나 자유롭게 의견을 제안하고 토론합니다." },
                            { title: "빠른 실행과 피드백", desc: "완벽함보다 빠른 실행을 지향하며, 피드백을 통해 함께 개선해 나갑니다." },
                            { title: "공유와 성장", desc: "자신이 배운 것을 아낌없이 공유하며 팀 전체의 성장을 도모합니다." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial="initial"
                                whileInView="whileInView"
                                variants={fadeInUpVariants}
                                transition={{ ...fadeInUpTransition, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-12 bg-white rounded-[40px] shadow-sm hover:shadow-xl transition-all duration-500"
                            >
                                <h4 className="text-2xl font-black mb-6 text-black">{item.title}</h4>
                                <p className="text-gray-500 leading-relaxed font-light">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section id="apply" className="py-60 px-6 bg-[#050505] text-white text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-900/20 rounded-full blur-[150px] pointer-events-none" />

                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div
                        initial="initial"
                        whileInView="whileInView"
                        variants={fadeInUpVariants}
                        transition={fadeInUpTransition}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-6xl md:text-9xl font-black mb-16 leading-none tracking-tighter">
                            BE THE <br />
                            <span className="text-primary-500">BRIDGE.</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-400 mb-20 font-light max-w-2xl mx-auto">
                            당신의 지식과 경험이 누군가에게는 <br />
                            새로운 세상으로 향하는 다리가 됩니다.
                        </p>
                        <motion.a
                            href="https://forms.gle/your-google-form-link"
                            target="_blank"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block bg-white text-black px-16 py-6 rounded-full font-black text-2xl transition-all hover:bg-primary-500 hover:text-white"
                        >
                            지원서 작성하기 →
                        </motion.a>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
