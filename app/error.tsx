'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // 에러를 로깅 서비스에 전송할 수 있습니다
        console.error('Error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                {/* 고양이 이미지 */}
                <div className="relative w-64 h-64 mx-auto mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-200 to-orange-300 rounded-full blur-3xl opacity-50"></div>
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* 고양이 이모지 */}
                        <div className="text-9xl animate-pulse">😿</div>
                    </div>
                </div>

                {/* 500 텍스트 */}
                <h1 className="text-9xl font-black text-red-600 mb-4">500</h1>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    문제가 발생했어요!
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    고양이가 뭔가를 망가뜨렸나봐요... 🐾
                    <br />
                    잠시 후 다시 시도해주세요.
                </p>

                {/* 에러 상세 정보 (개발 환경에서만) */}
                {process.env.NODE_ENV === 'development' && error.message && (
                    <div className="mb-8 p-4 bg-red-100 border border-red-300 rounded-lg text-left">
                        <p className="text-sm text-red-800 font-mono break-all">
                            {error.message}
                        </p>
                    </div>
                )}

                {/* 버튼들 */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={reset}
                        className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg shadow-red-600/30"
                    >
                        🔄 다시 시도
                    </button>
                    <Link
                        href="/"
                        className="px-8 py-4 bg-white text-red-600 border-2 border-red-600 rounded-xl font-bold hover:bg-red-50 transition-all transform hover:scale-105"
                    >
                        🏠 홈으로 가기
                    </Link>
                </div>

                {/* 장식 요소 */}
                <div className="mt-16 flex justify-center gap-4 text-4xl opacity-30">
                    <span className="animate-pulse">🐾</span>
                    <span className="animate-pulse delay-75">🐾</span>
                    <span className="animate-pulse delay-150">🐾</span>
                </div>
            </div>
        </div>
    )
}
