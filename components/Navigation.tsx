'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: '팀코드브릿지 소개', href: '/about' },
    { name: '프로젝트', href: '/projects' },
    { name: '활동', href: '/activities' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-black/90 backdrop-blur-md border-b border-white/10'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-bold text-white">
              TeamCodeBridge
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white font-medium transition-colors text-sm tracking-wide"
              >
                {item.name}
              </a>
            ))}
            <a
              href="#recruit"
              className="bg-gradient-to-r from-brand to-brand-dark text-white px-6 py-2.5 rounded-full font-medium hover:from-brand-light hover:to-brand transition-all text-sm shadow-lg shadow-brand/20"
            >
              26 시즌 신청
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="메뉴"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
              <span
                className={`block h-0.5 w-6 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
              />
              <span
                className={`block h-0.5 w-6 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''
                  }`}
              />
              <span
                className={`block h-0.5 w-6 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-gray-300 hover:text-white font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#recruit"
                className="block bg-gradient-to-r from-brand to-brand-dark text-white px-6 py-3 rounded-full font-medium text-center mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                26 시즌 신청
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
