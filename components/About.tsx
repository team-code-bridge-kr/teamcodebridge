'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const features = [
    {
      icon: '💡',
      title: '생각을 확장하고',
      description: '다양한 관점에서 문제를 바라보는 시야를 키웁니다'
    },
    {
      icon: '🔍',
      title: '새로운 관점으로 바라보며',
      description: '기술을 통해 세상의 문제를 해결하는 방법을 배웁니다'
    },
    {
      icon: '🎯',
      title: '결과물을 만들어냅니다',
      description: '아이디어를 실제 프로젝트로 구현하는 경험을 합니다'
    }
  ]

  return (
    <section id="about" className="py-16 bg-[#0a0a0c] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-brand/5 blur-[80px] rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-white mb-3"
          >
            TeamCodeBridge 멘토, <span className="gradient-text">왜 특별할까요?</span>
          </motion.h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            단순히 코딩을 잘하는 것을 넘어, 실전 경험과 교육 철학을 겸비한<br className="hidden md:block" />
            상위 1%의 대학생 멘토진이 함께합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: '전국 규모 수상 실적', desc: '해커톤 및 공모전에서 실력을 검증받은 인재들입니다.', icon: '🏆' },
            { title: '실전 프로젝트 & 창업', desc: '실제 서비스를 런칭하거나 운영해본 실무형 멘토진입니다.', icon: '🚀' },
            { title: '교육 전문가 & 강의', desc: '수백 명의 학생들을 가르쳐본 베테랑 교육자입니다.', icon: '👨‍🏫' },
            { title: 'AI·SW 연구 및 논문', desc: '최신 기술 트렌드를 연구하고 깊이를 더하는 연구자들입니다.', icon: '🔬' },
            { title: '디지털 콘텐츠 영향력', desc: '지식을 공유하고 소통하는 크리에이터 멘토입니다.', icon: '📱' },
            { title: '리더십 & 대외활동', desc: '커뮤니티를 이끌며 협업의 가치를 아는 리더들입니다.', icon: '🤝' },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-xl p-5 hover:bg-white/[0.05] transition-all group"
            >
              <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">{item.title}</h3>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  )
}
