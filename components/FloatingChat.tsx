'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function FloatingChat() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Show button after scrolling down a bit
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50"
        >
            <a
                href="https://pf.kakao.com/_GJgxin/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#FEE500] text-[#191919] px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold"
            >
                {/* KakaoTalk Logo SVG */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3C6.48 3 2 6.48 2 10.76C2 13.63 3.93 16.13 6.78 17.47C6.63 17.98 6.13 19.78 6.09 19.93C6.09 19.93 6.06 20.07 6.16 20.14C6.26 20.21 6.38 20.17 6.43 20.14C6.68 20.02 9.54 18.06 10.63 17.3C11.08 17.36 11.53 17.39 12 17.39C17.52 17.39 22 13.91 22 9.63C22 5.35 17.52 3 12 3Z" />
                </svg>
                <span>문의하기</span>
            </a>
        </motion.div>
    )
}
