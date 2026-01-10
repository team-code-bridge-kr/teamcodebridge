'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
    HomeIcon,
    BriefcaseIcon,
    ChatBubbleLeftRightIcon,
    EnvelopeIcon,
    UserIcon,
    UsersIcon,
    ChevronLeftIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    Bars3Icon,
    ShieldCheckIcon,
    ClockIcon,
    BookOpenIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    ChartBarIcon,
    FolderIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingChat from './FloatingChat'

interface MenuItem {
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    subItems?: MenuItem[]
}

const menuItems: MenuItem[] = [
    { name: '홈', href: '/workspace', icon: HomeIcon },
    {
        name: '업무',
        href: '/workspace/work',
        icon: BriefcaseIcon,
        subItems: [
            { name: 'SaaS', href: '/workspace/work', icon: BriefcaseIcon },
            { name: '🐙 크라켄 뷰', href: '/workspace/kraken', icon: BriefcaseIcon },
            { name: '회의 일정', href: '/workspace/meetings', icon: ClockIcon },
            { name: '커리큘럼', href: '/workspace/curriculum', icon: BookOpenIcon },
            { name: '교재관리', href: '/workspace/materials', icon: DocumentTextIcon },
            { name: '수업관리', href: '/workspace/classes', icon: AcademicCapIcon },
            { name: '만족도조사 관리', href: '/workspace/surveys', icon: ChartBarIcon },
            { name: '자료실', href: '/workspace/resources', icon: FolderIcon },
        ],
    },
    { name: '인사', href: '/workspace/hr', icon: UsersIcon },
    { name: '피드백', href: '/workspace/feedback', icon: ChatBubbleLeftRightIcon },
    { name: '팀메일', href: '/workspace/mail', icon: EnvelopeIcon },
    { name: 'MY', href: '/workspace/my', icon: UserIcon },
]

export default function WorkspaceLayoutClient({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session } = useSession()
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(true)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [expandedMenu, setExpandedMenu] = useState<string | null>(() => {
        // 현재 경로에 따라 초기 확장 상태 설정
        if (pathname?.startsWith('/workspace/work') || pathname?.startsWith('/workspace/meetings')) {
            return '업무'
        }
        return null
    })

    // 로그인 페이지에서는 사이드바를 보여주지 않음
    if (pathname === '/workspace/login') {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen bg-white flex">
            {/* Sidebar for Desktop - Fixed */}
            <aside
                onMouseEnter={() => setIsCollapsed(false)}
                onMouseLeave={() => setIsCollapsed(true)}
                className={`hidden md:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-gray-100 transition-all duration-300 ease-in-out z-40 ${isCollapsed ? 'w-20' : 'w-64'}`}
            >
                <div className="p-6 flex items-center justify-between">
                    {!isCollapsed && (
                        <Link href="/" className="flex items-center gap-3">
                            <img
                                src="/img/TeamCodeBridge_Logo_Black_Web.png"
                                alt="TeamCodeBridge"
                                className="h-8 w-auto object-contain"
                            />
                            <span className="font-black text-xl tracking-tighter text-black">Workspace</span>
                        </Link>
                    )}
                    {isCollapsed && (
                        <Link href="/" className="mx-auto">
                            <img
                                src="/img/TeamCodeBridge_Logo_Black_Web.png"
                                alt="TCB"
                                className="w-10 h-10 object-contain"
                            />
                        </Link>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (item.subItems?.some(sub => pathname === sub.href))
                        const isExpanded = expandedMenu === item.name
                        const hasSubItems = item.subItems && item.subItems.length > 0

                        return (
                            <div key={item.name}>
                                <div className="flex items-center">
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group flex-1 ${isActive
                                            ? 'bg-primary-50 text-primary-600'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <item.icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-900'}`} />
                                        {!isCollapsed && <span className="font-bold text-sm flex-1">{item.name}</span>}
                                        {isActive && !isCollapsed && !hasSubItems && (
                                            <motion.div
                                                layoutId="activeNav"
                                                className="ml-auto w-1.5 h-1.5 bg-primary-600 rounded-full"
                                            />
                                        )}
                                    </Link>
                                    {hasSubItems && !isCollapsed && (
                                        <button
                                            onClick={() => setExpandedMenu(isExpanded ? null : item.name)}
                                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                            aria-label="서브메뉴 토글"
                                        >
                                            <ChevronDownIcon
                                                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                    )}
                                </div>
                                {hasSubItems && !isCollapsed && (
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="pl-4 mt-1 space-y-1"
                                            >
                                                {item.subItems?.map((subItem) => {
                                                    const isSubActive = pathname === subItem.href
                                                    return (
                                                        <Link
                                                            key={subItem.name}
                                                            href={subItem.href}
                                                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${isSubActive
                                                                ? 'bg-primary-50 text-primary-600'
                                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                                                }`}
                                                        >
                                                            <subItem.icon className={`w-5 h-5 shrink-0 ${isSubActive ? 'text-primary-600' : 'text-gray-400'}`} />
                                                            <span className="font-bold text-sm">{subItem.name}</span>
                                                            {isSubActive && (
                                                                <motion.div
                                                                    layoutId="activeSubNav"
                                                                    className="ml-auto w-1.5 h-1.5 bg-primary-600 rounded-full"
                                                                />
                                                            )}
                                                        </Link>
                                                    )
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}
                            </div>
                        )
                    })}
                </nav>

                {/* User Profile Section */}
                <div className="px-4 py-4 border-t border-gray-50">
                    <div className={`flex items-center gap-3 p-2 rounded-2xl transition-colors ${!isCollapsed ? 'hover:bg-gray-50' : ''}`}>
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt={session.user.name || ''} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <UserIcon className="w-6 h-6" />
                                </div>
                            )}
                        </div>
                        {!isCollapsed && (
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-black truncate">{session?.user?.name || '멘토'}</p>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/workspace/login' })}
                                    className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    로그아웃
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-4 py-4">
                    {!isCollapsed ? (
                        <div className="bg-[#fafafa] border border-gray-100 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldCheckIcon className="w-4 h-4 text-primary-600" />
                                <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">Mentor Only</p>
                            </div>
                            <p className="text-[11px] text-gray-500 font-medium leading-tight">
                                멘토 전용 업무 공간입니다. <br />
                                보안에 유의해 주세요.
                            </p>
                        </div>
                    ) : (
                        <div className="w-10 h-10 bg-[#fafafa] rounded-xl flex items-center justify-center mx-auto text-gray-400">
                            <ShieldCheckIcon className="w-5 h-5" />
                        </div>
                    )}
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-xs">TCB</span>
                    </div>
                    <span className="font-black text-lg tracking-tighter text-black">Workspace</span>
                </Link>
                <button onClick={() => setIsMobileOpen(true)}>
                    <Bars3Icon className="w-6 h-6 text-gray-600" />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] md:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-72 bg-white z-[70] md:hidden flex flex-col"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-black text-xs">TCB</span>
                                    </div>
                                    <span className="font-black text-lg tracking-tighter text-black">Workspace</span>
                                </div>
                                <button onClick={() => setIsMobileOpen(false)} className="text-gray-400">
                                    <ChevronLeftIcon className="w-6 h-6" />
                                </button>
                            </div>
                            <nav className="flex-1 p-6 space-y-2">
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.href || (item.subItems?.some(sub => pathname === sub.href))
                                    const isExpanded = expandedMenu === item.name
                                    const hasSubItems = item.subItems && item.subItems.length > 0

                                    return (
                                        <div key={item.name}>
                                            <div className="flex items-center">
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setIsMobileOpen(false)}
                                                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all flex-1 ${isActive
                                                        ? 'bg-primary-50 text-primary-600'
                                                        : 'text-gray-500'
                                                        }`}
                                                >
                                                    <item.icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                                                    <span className="font-bold text-base flex-1">{item.name}</span>
                                                    {isActive && !hasSubItems && (
                                                        <motion.div
                                                            layoutId="mobileActiveNav"
                                                            className="ml-auto w-2 h-2 bg-primary-600 rounded-full"
                                                        />
                                                    )}
                                                </Link>
                                                {hasSubItems && (
                                                    <button
                                                        onClick={() => setExpandedMenu(isExpanded ? null : item.name)}
                                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                        aria-label="서브메뉴 토글"
                                                    >
                                                        <ChevronDownIcon
                                                            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                            {hasSubItems && (
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="pl-4 mt-1 space-y-1"
                                                        >
                                                            {item.subItems?.map((subItem) => {
                                                                const isSubActive = pathname === subItem.href
                                                                return (
                                                                    <Link
                                                                        key={subItem.name}
                                                                        href={subItem.href}
                                                                        onClick={() => setIsMobileOpen(false)}
                                                                        className={`flex items-center gap-4 px-5 py-3 rounded-xl transition-all ${isSubActive
                                                                            ? 'bg-primary-50 text-primary-600'
                                                                            : 'text-gray-500'
                                                                            }`}
                                                                    >
                                                                        <subItem.icon className={`w-5 h-5 shrink-0 ${isSubActive ? 'text-primary-600' : 'text-gray-400'}`} />
                                                                        <span className="font-bold text-sm">{subItem.name}</span>
                                                                        {isSubActive && (
                                                                            <motion.div
                                                                                layoutId="mobileActiveSubNav"
                                                                                className="ml-auto w-1.5 h-1.5 bg-primary-600 rounded-full"
                                                                            />
                                                                        )}
                                                                    </Link>
                                                                )
                                                            })}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            )}
                                        </div>
                                    )
                                })}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className={`flex-1 flex flex-col min-w-0 overflow-hidden pt-16 md:pt-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} transition-all duration-300`}>
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>

            <FloatingChat />
        </div>
    )
}
