'use client'

import { motion } from 'framer-motion'
import {
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    BellIcon
} from '@heroicons/react/24/outline'

const stats = [
    { name: '진행 중인 프로젝트', value: '12', icon: ClockIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: '대기 중인 피드백', value: '5', icon: BellIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
    { name: '이번 주 완료 업무', value: '28', icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-50' },
    { name: '예정된 멘토링', value: '3', icon: CalendarIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
]

export default function WorkspaceHome() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-black text-black mb-2">안녕하세요, 멘토님! 👋</h1>
                    <p className="text-gray-500">오늘도 TeamCodeBridge와 함께 미래를 만들어가요.</p>
                </motion.div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-gray-400">{stat.name}</span>
                        </div>
                        <div className="text-3xl font-black text-black">{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-black text-black mb-6">최근 업무 현황</h2>
                        <div className="space-y-4">
                            {[
                                { title: '26 시즌 멘토 가이드라인 업데이트', time: '2시간 전', status: '완료', type: '공지' },
                                { title: '고려대학교 프로젝트 피드백 제출', time: '5시간 전', status: '진행중', type: '업무' },
                                { title: '신규 멘토 온보딩 세션 준비', time: '어제', status: '대기', type: '미팅' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-primary-600" />
                                        <div>
                                            <h4 className="font-bold text-black text-sm">{item.title}</h4>
                                            <span className="text-xs text-gray-400">{item.time} • {item.type}</span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${item.status === '완료' ? 'bg-green-50 text-green-600' :
                                            item.status === '진행중' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Links / Calendar Mini */}
                <div className="space-y-6">
                    <div className="bg-primary-600 p-8 rounded-[32px] text-white shadow-xl shadow-primary-600/20">
                        <h2 className="text-xl font-black mb-4">팀코드브릿지 소식</h2>
                        <p className="text-primary-100 text-sm font-light leading-relaxed mb-6">
                            26 시즌 멘토 모집이 시작되었습니다. <br />
                            주변의 인재들에게 많은 추천 부탁드립니다!
                        </p>
                        <button className="w-full py-3 bg-white text-primary-600 rounded-xl font-bold text-sm hover:bg-primary-50 transition-colors">
                            공지사항 전체보기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
