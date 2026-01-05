'use client'

import { useState, useEffect } from 'react'
import { Cog6ToothIcon, ArrowLeftIcon, PaintBrushIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function GeneralSettings() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light')
    const [language, setLanguage] = useState('ko')
    const [isSaving, setIsSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState('')

    // 초기 테마 불러오기
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | null
            if (savedTheme) {
                setTheme(savedTheme)
                applyTheme(savedTheme)
            } else {
                // 기본값: 시스템 설정 확인
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                applyTheme(prefersDark ? 'dark' : 'light')
            }
        }
    }, [])

    // 테마 적용 함수
    const applyTheme = (selectedTheme: 'light' | 'dark' | 'auto') => {
        if (typeof window === 'undefined') return
        
        const root = document.documentElement
        if (selectedTheme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            root.classList.toggle('dark', prefersDark)
        } else {
            root.classList.toggle('dark', selectedTheme === 'dark')
        }
    }

    // 테마 변경 핸들러
    const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
        setTheme(newTheme)
        applyTheme(newTheme)
    }

    // 저장하기
    const handleSave = async () => {
        setIsSaving(true)
        setSaveMessage('')
        
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem('theme', theme)
                localStorage.setItem('language', language)
                setSaveMessage('저장되었습니다!')
                setTimeout(() => setSaveMessage(''), 3000)
            }
        } catch (error) {
            console.error('Failed to save settings:', error)
            setSaveMessage('저장에 실패했습니다.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Link 
                href="/workspace/my"
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="text-sm font-medium">마이페이지로 돌아가기</span>
            </Link>

            <header className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-primary-50 rounded-xl">
                        <Cog6ToothIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-black text-black">서비스 설정</h1>
                </div>
                <p className="text-gray-500">워크스페이스 테마 및 언어 설정을 관리합니다.</p>
            </header>

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <PaintBrushIcon className="w-5 h-5 text-gray-600" />
                        <h2 className="text-lg font-bold text-black">테마 설정</h2>
                    </div>
                    <p className="text-sm text-gray-500">워크스페이스의 색상 테마를 선택합니다</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                        {(['light', 'dark', 'auto'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => handleThemeChange(t)}
                                className={`p-4 rounded-xl border-2 transition-all ${
                                    theme === t
                                        ? 'border-primary-600 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className={`text-sm font-bold mb-1 ${
                                    theme === t ? 'text-primary-600' : 'text-gray-900'
                                }`}>
                                    {t === 'light' ? '라이트' : t === 'dark' ? '다크' : '자동'}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {t === 'light' ? '밝은 테마' : t === 'dark' ? '어두운 테마' : '시스템 설정 따름'}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <GlobeAltIcon className="w-5 h-5 text-gray-600" />
                        <h2 className="text-lg font-bold text-black">언어 설정</h2>
                    </div>
                    <p className="text-sm text-gray-500">인터페이스 언어를 선택합니다</p>
                </div>
                <div className="p-6">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="ko">한국어</option>
                        <option value="en">English</option>
                    </select>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-4">
                {saveMessage && (
                    <span className={`text-sm font-medium ${
                        saveMessage.includes('실패') ? 'text-red-600' : 'text-green-600'
                    }`}>
                        {saveMessage}
                    </span>
                )}
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? '저장 중...' : '저장하기'}
                </button>
            </div>
        </div>
    )
}

