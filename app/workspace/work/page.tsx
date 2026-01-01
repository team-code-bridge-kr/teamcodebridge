'use client'

import { motion } from 'framer-motion'
import { BriefcaseIcon, PlusIcon } from '@heroicons/react/24/outline'

export default function WorkspaceWork() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black text-black mb-2">업무 관리</h1>
                    <p className="text-gray-500">부서 간 협업 및 프로젝트 진행 상황을 관리합니다.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/20">
                    <PlusIcon className="w-5 h-5" />
                    새 업무 추가
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['할 일', '진행 중', '완료'].map((status, idx) => (
                    <div key={status} className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-black text-gray-400 text-sm uppercase tracking-wider">{status}</h3>
                            <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full">0</span>
                        </div>
                        <div className="bg-gray-100/50 border-2 border-dashed border-gray-200 rounded-[24px] h-64 flex flex-col items-center justify-center text-gray-400">
                            <BriefcaseIcon className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-xs font-medium">업무가 없습니다.</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
