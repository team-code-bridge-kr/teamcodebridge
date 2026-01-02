'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

function LoginContent() {
    const [isLoading, setIsLoading] = useState(false)
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (error === 'PendingApproval') {
            setErrorMessage('관리자 승인 대기 중인 계정입니다. 승인 후 이용 가능합니다.')
        } else if (error) {
            setErrorMessage('로그인 중 오류가 발생했습니다.')
        }
    }, [error])

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        try {
            await signIn('google', { callbackUrl: '/workspace' })
        } catch (error) {
            console.error('Login failed:', error)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-12">
                    <img
                        src="/img/TeamCodeBridge_Logo_Black_Web.png"
                        alt="TeamCodeBridge"
                        className="h-12 md:h-16 w-auto object-contain mb-6"
                    />
                    <h1 className="text-3xl font-black text-black tracking-tighter">Workspace</h1>
                    <p className="text-gray-400 mt-2 font-medium">멘토 전용 차세대 업무 시스템</p>
                </div>

                {/* Login Card */}
                <div className="bg-[#fafafa] border border-gray-100 p-10 rounded-[40px] shadow-sm">
                    <div className="mb-8 text-center">
                        <h2 className="text-xl font-bold text-black mb-2">환영합니다!</h2>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            보안을 위해 팀코드브릿지 <br />
                            구글 계정으로 로그인해 주세요.
                        </p>
                    </div>

                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium text-center">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-4 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Google 계정으로 로그인
                            </>
                        )}
                    </button>

                    <p className="mt-8 text-center text-[11px] text-gray-400 leading-relaxed">
                        로그인 시 팀코드브릿지의 <br />
                        <span className="underline cursor-pointer">이용약관</span> 및 <span className="underline cursor-pointer">개인정보처리방침</span>에 동의하게 됩니다.
                    </p>
                </div>

                {/* Footer */}
                <p className="mt-12 text-center text-sm text-gray-300 font-medium">
                    © 2026 TeamCodeBridge. All Rights Reserved.
                </p>
            </motion.div>
        </div>
    )
}

export default function WorkspaceLogin() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="w-6 h-6 border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin" /></div>}>
            <LoginContent />
        </Suspense>
    )
}
