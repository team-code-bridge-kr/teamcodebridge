'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function Introduction() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section ref={ref} className="py-24 bg-black relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="mb-6"
                    >
                        <span className="text-brand font-bold tracking-widest uppercase text-sm">Our Mission</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-2xl md:text-4xl font-bold text-white mb-10 leading-tight text-balance"
                    >
                        IT 교육의 기회가 모두에게 평등하게 닿을 수 있도록,<br className="hidden md:block" />
                        우리는 <span className="text-brand">가능성과 현실을 잇는 다리</span>가 됩니다.
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="max-w-3xl"
                    >
                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-medium">
                            팀코드브릿지는 단순한 지식 전달을 넘어, 멘티들이 스스로 문제를 정의하고
                            해결하는 <span className="text-white">'메이커'</span>로 성장할 수 있도록 돕는 대학생 비영리 단체입니다.
                            우리는 기술이라는 도구로 세상과 소통하고, 함께 성장하는 즐거움을 만들어갑니다.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="mt-12 w-12 h-px bg-brand/50"
                    />
                </div>
            </div>
        </section>
    )
}
