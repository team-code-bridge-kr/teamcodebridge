'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function Achievement() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 blur-[120px] rounded-full z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold text-white mb-4"
                    >
                        우리의 성과는 <span className="text-primary-500">현재진행형</span>입니다
                    </motion.h2>
                    <p className="text-gray-400 text-lg">검증된 전문성으로 IT 교육의 새로운 기준을 만듭니다</p>
                </div>

                <div ref={ref} className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Minister Award */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="text-8xl">🏆</span>
                        </div>
                        <div className="relative z-10">
                            <div className="inline-block px-4 py-1 bg-primary-500/20 text-primary-500 rounded-full text-sm font-bold mb-6">
                                Achievement
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">교육부장관상 수상</h3>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                IT 교육의 혁신성과 공익성을 인정받아 교육부장관상을 수상하였습니다.
                                우리는 단순히 코딩을 가르치는 것을 넘어, 학생들의 미래를 설계하는 교육의 가치를 증명했습니다.
                            </p>
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">01</span>
                                </div>
                                <span className="text-white font-medium">대한민국 IT 교육의 표준</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Vision/Next Step */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-gradient-to-br from-primary-500/20 to-primary-700/20 backdrop-blur-xl border border-primary-500/30 rounded-3xl p-8 md:p-12 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                            <span className="text-8xl">✨</span>
                        </div>
                        <div className="relative z-10">
                            <div className="inline-block px-4 py-1 bg-white/20 text-white rounded-full text-sm font-bold mb-6">
                                Vision
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">더 넓은 세상으로</h3>
                            <p className="text-white/80 leading-relaxed mb-6">
                                우리의 목표는 멈추지 않습니다. 더 많은 학생들에게 꿈을 심어주고,
                                IT 기술을 통해 세상의 문제를 해결할 수 있는 미래 인재를 양성하기 위해 끊임없이 도전합니다.
                            </p>
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">02</span>
                                </div>
                                <span className="text-white font-medium">글로벌 IT 인재 양성의 허브</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
