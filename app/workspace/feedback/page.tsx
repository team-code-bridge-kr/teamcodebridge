'use client'

import { motion } from 'framer-motion'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

export default function WorkspaceFeedback() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-black mb-2">피드백</h1>
                <p className="text-gray-500">멘티들의 프로젝트에 대한 피드백을 관리하고 소통합니다.</p>
            </header>

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-6">
                        <ChatBubbleLeftRightIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black text-black mb-2">도착한 피드백이 없습니다.</h3>
                    <p className="text-gray-400 font-light max-w-sm">
                        멘티들이 프로젝트 결과물을 제출하면 <br />
                        이곳에서 피드백을 작성할 수 있습니다.
                    </p>
                </div>
            </div>
        </div>
    )
}
