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
    <section id="about" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            TeamCodeBridge 멘토, <span className="text-primary-500">왜 특별할까요?</span>
          </motion.h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            단순히 코딩을 잘하는 것을 넘어, 실전 경험과 교육 철학을 겸비한
            상위 1%의 멘토진이 함께합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: '전국 규모 수상 실적', desc: '국내외 유수의 해커톤 및 공모전에서 실력을 검증받은 인재들입니다.', icon: '🏆' },
            { title: '실전 프로젝트 & 창업', desc: '실제 서비스를 런칭하거나 스타트업을 운영해본 실무형 멘토진입니다.', icon: '🚀' },
            { title: '교육 전문가 & 강의', desc: '다양한 교육 기관에서 수백 명의 학생들을 가르쳐본 베테랑입니다.', icon: '👨‍🏫' },
            { title: 'AI·SW 연구 및 논문', desc: '최신 AI 트렌드를 연구하고 학술적 깊이를 더하는 연구자들입니다.', icon: '🔬' },
            { title: '디지털 콘텐츠 영향력', desc: '유튜브, 블로그 등을 통해 지식을 공유하고 소통하는 크리에이터입니다.', icon: '📱' },
            { title: '리더십 & 대외활동', desc: '다양한 커뮤니티를 이끌며 협업과 소통의 가치를 아는 리더들입니다.', icon: '🤝' },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block p-[1px] rounded-3xl bg-gradient-to-r from-primary-500 to-primary-700"
          >
            <div className="bg-black rounded-[23px] px-8 py-12 md:px-16 md:py-20">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                "가능성의 끝에서 IT 교육의 시작"
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
                TeamCodeBridge는 단순히 기술을 전달하는 것을 넘어,<br className="hidden md:block" />
                학생들이 스스로의 가능성을 발견하고 현실로 만드는 다리가 되고자 합니다.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
