'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function Introduction() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section ref={ref} className="py-24 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="text-3xl md:text-5xl font-bold text-gray-900 mb-12 leading-tight"
                    >
                        가능성과 현실을 잇는 <span className="gradient-text">다리</span>
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-3xl space-y-6"
                    >
                        <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-medium">
                            팀코드브릿지는 단순한 지식 전달을 넘어,<br className="hidden md:block" />
                            멘티들이 스스로 문제를 정의하고 해결하는 <span className="text-gray-900 font-bold">'메이커'</span>로<br className="hidden md:block" />
                            성장할 수 있도록 돕는 대학생 비영리 단체입니다.
                        </p>
                        <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-medium">
                            우리는 기술이라는 도구로 세상과 소통하고,<br className="hidden md:block" />
                            함께 성장하는 즐거움을 만들어갑니다.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="mt-16 w-20 h-1.5 bg-brand rounded-full"
                    />
                </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </section>
    )
}
