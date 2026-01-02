'use client'

import { useState } from 'react'
import { ShieldCheckIcon, ArrowLeftIcon, KeyIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function SecuritySettings() {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

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
                        <ShieldCheckIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-black text-black">보안 및 로그인</h1>
                </div>
                <p className="text-gray-500">비밀번호 변경 및 2단계 인증 설정을 관리합니다.</p>
            </header>

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-black mb-1">로그인 방법</h2>
                    <p className="text-sm text-gray-500">현재 Google 계정으로 로그인 중입니다</p>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <KeyIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <span className="font-medium text-gray-900">Google OAuth</span>
                                <p className="text-sm text-gray-500">Google 계정으로 로그인</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                            활성화됨
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-black mb-1">2단계 인증</h2>
                    <p className="text-sm text-gray-500">추가 보안을 위한 2단계 인증 설정</p>
                </div>
                <div className="p-6">
                    <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <DevicePhoneMobileIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <span className="font-medium text-gray-900">2단계 인증 활성화</span>
                                <p className="text-sm text-gray-500 mt-1">로그인 시 추가 인증 단계를 요구합니다</p>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={twoFactorEnabled}
                            onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                    </label>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-black mb-1">활성 세션</h2>
                    <p className="text-sm text-gray-500">현재 로그인된 기기 및 세션 관리</p>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="font-medium text-gray-900">현재 세션</span>
                            <p className="text-sm text-gray-500 mt-1">이 기기에서 로그인 중</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                            활성
                        </span>
                    </div>
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

