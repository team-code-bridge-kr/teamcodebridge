'use client'

import { useState } from 'react'
import { BellIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function NotificationsSettings() {
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [taskNotifications, setTaskNotifications] = useState(true)
    const [messageNotifications, setMessageNotifications] = useState(true)
    const [feedbackNotifications, setFeedbackNotifications] = useState(false)

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
                        <BellIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-black text-black">알림 설정</h1>
                </div>
                <p className="text-gray-500">업무 및 피드백 알림 수신 설정을 관리합니다.</p>
            </header>

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-black mb-1">이메일 알림</h2>
                    <p className="text-sm text-gray-500">이메일을 통한 알림 수신 여부</p>
                </div>
                <div className="p-6">
                    <label className="flex items-center justify-between cursor-pointer">
                        <div>
                            <span className="font-medium text-gray-900">이메일 알림 받기</span>
                            <p className="text-sm text-gray-500 mt-1">모든 알림을 이메일로 받습니다</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.target.checked)}
                            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                    </label>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-black mb-1">알림 유형</h2>
                    <p className="text-sm text-gray-500">각 알림 유형별 수신 설정</p>
                </div>
                <div className="divide-y divide-gray-100">
                    <label className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div>
                            <span className="font-medium text-gray-900">업무 알림</span>
                            <p className="text-sm text-gray-500 mt-1">새로운 업무 할당 및 업무 상태 변경 알림</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={taskNotifications}
                            onChange={(e) => setTaskNotifications(e.target.checked)}
                            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                    </label>
                    <label className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div>
                            <span className="font-medium text-gray-900">메시지 알림</span>
                            <p className="text-sm text-gray-500 mt-1">새로운 채팅 메시지 알림</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={messageNotifications}
                            onChange={(e) => setMessageNotifications(e.target.checked)}
                            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                    </label>
                    <label className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div>
                            <span className="font-medium text-gray-900">피드백 알림</span>
                            <p className="text-sm text-gray-500 mt-1">피드백 요청 및 응답 알림</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={feedbackNotifications}
                            onChange={(e) => setFeedbackNotifications(e.target.checked)}
                            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                    </label>
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

