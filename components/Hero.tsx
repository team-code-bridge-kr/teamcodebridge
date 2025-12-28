'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'



const backgroundImages = [
  '/img/main_img_1.jpg',
  '/img/main_img_2.jpg',
  '/img/main_img_3.jpg',
  '/img/main_img_4.jpg',
  '/img/main_img_5.jpg',
]

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center">
      {/* Background Image Slider with Overlay */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={backgroundImages[currentIndex]}
            alt="TeamCodeBridge Activity"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.9, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [null, '-100%'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center relative">
          {/* Subtle glow behind text for readability */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-black/20 blur-[100px] -z-10 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8"
          >
            <span className="text-yellow-400 text-lg">🏆</span>
            <span className="text-white text-sm font-semibold tracking-tight">교육부장관상 수상</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="gradient-text text-base md:text-lg font-bold mb-4 tracking-widest uppercase drop-shadow-md">
              At the Edge of Possibility, IT Education Begins
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] break-keep"
          >
            가능성의 끝에서
            <br />
            <span className="gradient-text">
              IT 교육이 시작되는 곳
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-100 text-base md:text-lg max-w-3xl mx-auto mb-12 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] break-keep"
          >
            대학생들이 직접 운영하는 비영리 IT 교육봉사, 팀코드브릿지!
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <a
              href="#recruit"
              className="bg-brand text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-brand-light transition-all transform hover:scale-105 shadow-2xl shadow-brand/40"
            >
              26 시즌 멘토 신청 →
            </a>
            <a
              href="#about"
              className="bg-white/10 border border-white/30 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all backdrop-blur-md"
            >
              더 알아보기
            </a>
          </motion.div>

          {/* Slider Navigation Dots */}
          <div className="flex justify-center space-x-3">
            {backgroundImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 transition-all duration-300 rounded-full ${currentIndex === index ? 'w-8 bg-brand' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>


    </section>
  )
}
