'use client'

import { motion } from 'framer-motion'
import { UserIcon, Cog6ToothIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function WorkspaceMy() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-black mb-2">마이페이지</h1>
                <p className="text-gray-500">개인 프로필 및 서비스 설정을 관리합니다.</p>
            </header>

            <div className="space-y-6">
                {/* Profile Card */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <UserIcon className="w-12 h-12" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-black mb-1">팀코드브릿지 멘토</h2>
                        <p className="text-gray-400 text-sm">mentor@teamcodebridge.dev</p>
                        <div className="mt-4 flex gap-2">
                            <span className="px-3 py-1 bg-primary-50 text-primary-600 text-[10px] font-bold rounded-full uppercase">Active</span>
                            <span className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-full uppercase">26 Season</span>
                        </div>
                    </div>
                </div>

                {/* Settings List */}
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    {[
                        { name: '알림 설정', icon: BellIcon, desc: '업무 및 피드백 알림 수신 설정' },
                        { name: '보안 및 로그인', icon: ShieldCheckIcon, desc: '비밀번호 변경 및 2단계 인증' },
                        { name: '서비스 설정', icon: Cog6ToothIcon, desc: '워크스페이스 테마 및 언어 설정' },
                    ].map((item, i) => (
                        <button key={i} className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl text-gray-500">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-black text-sm">{item.name}</h4>
                                    <p className="text-xs text-gray-400">{item.desc}</p>
                                </div>
                            </div>
                            <span className="text-gray-300">→</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
