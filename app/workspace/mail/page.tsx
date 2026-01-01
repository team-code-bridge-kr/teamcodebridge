'use client'

import { motion } from 'framer-motion'
import { EnvelopeIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

export default function WorkspaceMail() {
    return (
        <div className="h-full flex flex-col">
            {/* Header for Mail Section */}
            <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                        <EnvelopeIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-black">팀메일</h1>
                        <p className="text-xs text-gray-400">@teamcodebridge.dev 전용 메일 서비스</p>
                    </div>
                </div>
                <a
                    href="https://mail.teamcodebridge.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-primary-600 transition-colors"
                >
                    새 창에서 열기
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </a>
            </div>

            {/* Iframe Container */}
            <div className="flex-1 bg-gray-50 relative">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <iframe
                        src="https://mail.teamcodebridge.dev"
                        className="w-full h-full border-none shadow-inner"
                        title="TeamCodeBridge Mail"
                        allow="camera; microphone; fullscreen; display-capture; autoplay; autofocus"
                    />
                </motion.div>

                {/* Fallback / Loading Overlay (Hidden once loaded) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 bg-white">
                    <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mb-4" />
                    <p className="text-gray-400 font-medium">메일 서버에 연결 중입니다...</p>
                </div>
            </div>
        </div>
    )
}
