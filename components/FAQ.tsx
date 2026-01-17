'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
    {
        question: "팀코드브릿지는 무슨 일을 하나요?",
        answer: "팀코드브릿지는 IT 교육의 격차를 해소하기 위해 대학생 멘토들이 모여 만든 비영리 교육 봉사 단체입니다.\n초중고 학생들을 대상으로 코딩 교육, 진로 멘토링, 해커톤 등 다양한 프로그램을 기획하고 운영합니다."
    },
    {
        question: "멘토로 참여하고 싶어요.",
        answer: "매년 상반기(1~2월)와 하반기(7~8월)에 신규 멘토를 모집합니다.\n모집 공고는 홈페이지와 공식 인스타그램을 통해 확인하실 수 있으며, IT 교육에 열정이 있는 대학생(휴학생 포함)이라면 전공 무관하게 누구나 지원 가능합니다."
    },
    {
        question: "스쿨어택 신청은 어떻게 하나요?",
        answer: "스쿨어택은 학교 선생님이나 학생 대표가 직접 신청할 수 있습니다.\n하단의 '문의하기' 또는 이메일을 통해 학교명, 희망 날짜, 예상 인원 등을 남겨주시면 담당자가 확인 후 연락드립니다."
    },
    {
        question: "교육은 무료인가요?",
        answer: "네, 팀코드브릿지의 모든 교육 프로그램은 기본적으로 전액 무료로 진행됩니다.\n우리는 경제적 여건과 관계없이 누구나 양질의 IT 교육을 받을 수 있어야 한다고 믿습니다."
    },
    {
        question: "코딩을 못해도 활동에 참여 할 수 있을까요?",
        answer: "물론입니다! 멘토는 개발 직군 외에도 기획, 디자인, 홍보, 운영 등 다양한 분야에서 모집하고 있습니다.\n학생들 또한 코딩을 처음 접하는 입문자부터 심화 과정까지 수준별 맞춤 교육을 제공하므로 걱정하지 않으셔도 됩니다."
    }
]

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section className="py-24 bg-white relative overflow-hidden" id="faq">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                        자주 묻는 질문
                    </h2>
                    <p className="text-gray-600 text-lg">
                        팀코드브릿지에 대해 궁금한 점을 확인해보세요.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden transition-colors hover:bg-gray-100"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-brand font-bold text-xl md:text-2xl">Q.</span>
                                    <span className="text-gray-900 font-bold text-lg md:text-xl break-keep">
                                        {faq.question}
                                    </span>
                                </div>
                                <motion.span
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    className="text-gray-400 flex-shrink-0 ml-4"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </motion.span>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 pl-[4.5rem] text-gray-600 leading-relaxed break-keep whitespace-pre-line border-t border-gray-200 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
