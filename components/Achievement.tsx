'use client'

import { motion, useSpring, useTransform, animate } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

function Counter({ value, decimals = 0 }: { value: number, decimals?: number }) {
    const [displayValue, setDisplayValue] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true }) // Run animation only once

    useEffect(() => {
        if (isInView) {
            let start = 0
            const end = value
            const duration = 2000 // 2 seconds
            const startTime = performance.now()

            const updateCounter = (currentTime: number) => {
                const elapsed = currentTime - startTime
                const progress = Math.min(elapsed / duration, 1)

                // Linear increment logic similar to user's request
                const currentCount = progress * end
                setDisplayValue(currentCount)

                if (progress < 1) {
                    requestAnimationFrame(updateCounter)
                } else {
                    setDisplayValue(end)
                }
            }

            requestAnimationFrame(updateCounter)
        }
    }, [isInView, value])

    return (
        <span ref={ref}>
            {displayValue.toFixed(decimals)}
        </span>
    )
}

const stats = [
    { label: '멘토링 참여 학생', value: 100, suffix: '+', decimals: 0 },
    { label: '제작 프로젝트', value: 30, suffix: '+', decimals: 0 },
    { label: '교육 만족도', value: 4.85, suffix: '/5', decimals: 2 },
    { label: '재참여 의향', value: 4.9, suffix: '/5', decimals: 1 },
]

const achievementCards = [
    {
        id: 1,
        category: 'Achievement',
        title: '교육부장관상 수상',
        description: 'IT 교육의 혁신성과 공익성을 인정받아 교육부장관상을 수상하였습니다. 학생들의 미래를 설계하는 교육의 가치를 증명했습니다.',
        number: '01',
        subtitle: '대한민국 IT 교육의 표준',
        icon: '🏆',
        bgStyle: 'bg-white/5 backdrop-blur-xl border border-white/10',
        labelStyle: 'bg-primary-500/20 text-primary-500',
    },
    {
        id: 2,
        category: 'Vision',
        title: '더 넓은 세상으로',
        description: '우리의 목표는 멈추지 않습니다. 더 많은 학생들에게 꿈을 심어주고, 미래 인재를 양성하기 위해 끊임없이 도전합니다.',
        number: '02',
        subtitle: '글로벌 IT 인재 양성의 허브',
        icon: '✨',
        bgStyle: 'bg-gradient-to-br from-primary-500/20 to-primary-700/20 backdrop-blur-xl border border-primary-500/30',
        labelStyle: 'bg-white/20 text-white',
    },
    {
        id: 3,
        category: 'Recognition',
        title: '교육기부 우수 동아리 지정',
        description: '한국과학창의재단에서 교육기부 우수 동아리로 지정되었습니다.\n교육 기부 문화의 선도 기관으로서 지속적으로 혁신적인 교육 프로그램을 제공합니다.',
        number: '03',
        subtitle: '교육 기부 문화의 선도 기관',
        icon: '🏅',
        bgStyle: 'bg-white/5 backdrop-blur-xl border border-white/10',
        labelStyle: 'bg-primary-500/20 text-primary-500',
    },
    {
        id: 4,
        category: 'Media',
        title: '뉴스에 나온 팀코드브릿지',
        description: '팀코드브릿지의 놀라운 성과를 뉴스에서 만나보세요!',
        number: '04',
        subtitle: '언론이 주목하는 교육 기부 단체',
        icon: '📰',
        bgStyle: 'bg-gradient-to-br from-primary-500/20 to-primary-700/20 backdrop-blur-xl border border-primary-500/30',
        labelStyle: 'bg-white/20 text-white',
        links: [
            { name: '한겨레', url: 'https://www.hani.co.kr/arti/economy/biznews/1215438.html' },
            { name: '중앙이코노미뉴스', url: 'https://www.joongangenews.com/news/articleView.html?idxno=444481' },
            { name: '스마트경제', url: 'https://www.dailysmart.co.kr/news/articleView.html?idxno=112121' },
        ],
    },
]

export default function Achievement() {
    const ref = useRef(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })
    const [currentIndex, setCurrentIndex] = useState(0)
    const isProgrammaticScroll = useRef(false)

    // Auto scroll effect
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isProgrammaticScroll.current) {
                setCurrentIndex((prev) => (prev + 1) % achievementCards.length)
            }
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    // Scroll to current card
    useEffect(() => {
        if (scrollRef.current) {
            const isMobile = window.innerWidth < 768
            const cardWidth = isMobile ? Math.min(window.innerWidth * 0.9, 500) : 500
            const gap = isMobile ? 16 : 20
            const scrollPos = currentIndex * (cardWidth + gap)

            scrollRef.current.scrollTo({
                left: scrollPos,
                behavior: 'smooth'
            })

            const timeout = setTimeout(() => {
                isProgrammaticScroll.current = false
            }, 600)

            return () => clearTimeout(timeout)
        }
    }, [currentIndex])

    const handlePrev = () => {
        isProgrammaticScroll.current = true
        setCurrentIndex((prev) => (prev - 1 + achievementCards.length) % achievementCards.length)
    }

    const handleNext = () => {
        isProgrammaticScroll.current = true
        setCurrentIndex((prev) => (prev + 1) % achievementCards.length)
    }

    const handleDotClick = (index: number) => {
        isProgrammaticScroll.current = true
        setCurrentIndex(index)
    }

    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 blur-[120px] rounded-full z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-5xl font-bold text-white mb-6 break-keep"
                    >
                        우리의 성과는 <span className="gradient-text">현재진행형</span>입니다
                    </motion.h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto break-keep">
                        숫자로 증명하는 팀코드브릿지의 진심과 열정,<br className="hidden md:block" />
                        우리는 매일 더 높은 교육의 가치를 만들어갑니다.
                    </p>
                </div>

                {/* Statistics Grid - Reverted to simple style */}
                <div className="max-w-4xl mx-auto mb-24">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 mb-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                                    <Counter value={stat.value} decimals={stat.decimals} />
                                    <span className="text-primary-400 text-xl md:text-3xl ml-1">{stat.suffix}</span>
                                </div>
                                <div className="text-gray-300 text-sm md:text-base font-semibold drop-shadow-md break-keep">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="text-center text-gray-500 text-xs md:text-sm font-medium break-keep"
                    >
                        * 2025.12.28 기준
                    </motion.div>
                </div>

                {/* Achievement Cards Slider */}
                <div ref={ref} className="relative group">
                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/80 border border-white/20 rounded-full items-center justify-center text-white transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 disabled:opacity-0"
                        aria-label="Previous card"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6"></path>
                        </svg>
                    </button>
                    <button
                        onClick={handleNext}
                        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/80 border border-white/20 rounded-full items-center justify-center text-white transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 disabled:opacity-0"
                        aria-label="Next card"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6"></path>
                        </svg>
                    </button>

                    {/* Horizontal Scroll Container */}
                    <div
                        ref={scrollRef}
                        className="flex gap-4 md:gap-5 overflow-x-auto pb-10 px-[50vw] md:px-8 scrollbar-hide snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {/* Left padding for mobile */}
                        <div className="flex-shrink-0 w-[calc((100vw-90vw)/2)] md:w-[calc((100vw-500px)/2-20px)] md:hidden"></div>
                        <div className="flex-shrink-0 w-[calc((100vw-500px)/2-20px)] hidden md:block"></div>

                        {/* Achievement Cards */}
                        {achievementCards.map((card, index) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, x: 50 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="flex-shrink-0 w-[90vw] max-w-[500px] md:w-[500px] snap-center"
                                style={{ aspectRatio: '500/281' }}
                            >
                                <div className={`${card.bgStyle} rounded-2xl p-6 md:p-8 relative overflow-hidden group h-full`}>
                                        <div className={`absolute top-0 right-0 p-4 ${
                                            card.bgStyle.includes('gradient') ? 'opacity-20 group-hover:opacity-40' : 'opacity-10 group-hover:opacity-20'
                                        } transition-opacity`}>
                                            <span className="text-6xl">{card.icon}</span>
                                        </div>
                                        <div className="relative z-10">
                                            <div className={`inline-block px-3 py-0.5 ${card.labelStyle} rounded-full text-xs font-bold mb-4`}>
                                                {card.category}
                                            </div>
                                            <h3 className={`text-xl md:text-2xl font-bold mb-3 break-keep ${
                                                card.bgStyle.includes('gradient') ? 'text-white' : 'text-white'
                                            }`}>
                                                {card.title}
                                            </h3>
                                            <p className={`text-sm md:text-base leading-relaxed mb-5 break-keep ${
                                                card.bgStyle.includes('gradient') ? 'text-white/80' : 'text-gray-400'
                                            }`}>
                                                {card.description}
                                            </p>
                                            {card.id === 4 && card.links && (
                                                <div className="flex flex-wrap gap-3 mb-4">
                                                    {card.links.map((link, linkIndex) => (
                                                        <a
                                                            key={linkIndex}
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-gray-400 hover:text-gray-200 text-xs md:text-sm underline transition-colors"
                                                        >
                                                            {link.name}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                    card.bgStyle.includes('gradient') ? 'bg-white/20' : 'bg-white/10'
                                                }`}>
                                                    <span className="text-white font-bold text-lg">{card.number}</span>
                                                </div>
                                                <span className="text-white font-medium text-sm md:text-base break-keep">{card.subtitle}</span>
                                            </div>
                                            {card.id !== 4 && card.links && (
                                                <div className="flex flex-wrap gap-3 mt-4">
                                                    {card.links.map((link, linkIndex) => (
                                                        <a
                                                            key={linkIndex}
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-gray-400 hover:text-gray-200 text-xs md:text-sm underline transition-colors"
                                                        >
                                                            {link.name}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                        ))}

                        {/* Right padding for mobile */}
                        <div className="flex-shrink-0 w-[calc((100vw-90vw)/2)] md:w-[calc((100vw-500px)/2-20px)] md:hidden"></div>
                        <div className="flex-shrink-0 w-[calc((100vw-500px)/2-20px)] hidden md:block"></div>
                    </div>

                    {/* Dot Navigation */}
                    <div className="flex justify-center space-x-2 mt-6">
                        {achievementCards.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    currentIndex === index ? 'bg-brand w-8' : 'bg-white/20 w-1.5 hover:bg-white/40'
                                }`}
                                aria-label={`Go to card ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

