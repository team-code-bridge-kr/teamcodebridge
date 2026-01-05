'use client'

import { ArrowLeftIcon, MegaphoneIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import AdminAnnouncementManagement from '../../AdminAnnouncementManagement'

export default function AdminAnnouncementsPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
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
                        <MegaphoneIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-black text-black">공지사항 관리</h1>
                </div>
                <p className="text-gray-500">공지사항을 작성하고 관리합니다.</p>
            </header>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <AdminAnnouncementManagement />
            </div>
        </div>
    )
}

