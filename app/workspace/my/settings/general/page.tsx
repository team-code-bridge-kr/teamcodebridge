'use client'

import { useState } from 'react'
import { Cog6ToothIcon, ArrowLeftIcon, PaintBrushIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function GeneralSettings() {
    const [theme, setTheme] = useState('light')
    const [language, setLanguage] = useState('ko')

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
                        {['light', 'dark', 'auto'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                className={`p-4 rounded-xl border-2 transition-all ${
                                    theme === t
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="text-sm font-medium text-gray-900 capitalize mb-1">
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

            <div className="mt-6 flex justify-end">
                <button className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium">
                    저장하기
                </button>
            </div>
        </div>
    )
}

