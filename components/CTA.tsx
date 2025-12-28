'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function CTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="recruit" className="py-24 bg-gradient-to-r from-black via-slate-900 to-primary-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-700/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            TeamCodeBridge와 함께 할
            <br />
            여러분을 기다립니다
          </h2>
          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            가능성의 끝에서 IT 교육의 시작!
            <br />
            함께 성장하고 함께 만들어가는 TeamCodeBridge
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#apply-mentoring"
              className="bg-gradient-to-r from-brand to-brand-dark text-white px-10 py-4 rounded-full font-bold text-lg hover:from-brand-light hover:to-brand transition-all transform hover:scale-105 shadow-lg shadow-brand/20"
            >
              26 시즌 멘토 신청 →
            </a>
            <a
              href="#apply-school"
              className="border-2 border-primary-400/50 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-primary-500/10 hover:border-primary-400 transition-all"
            >
              26 시즌 스쿨어택 신청 →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
