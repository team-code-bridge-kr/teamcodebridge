import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                {/* 고양이 이미지 */}
                <div className="relative w-64 h-64 mx-auto mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full blur-3xl opacity-50"></div>
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* 고양이 이모지 또는 이미지 */}
                        <div className="text-9xl animate-bounce">🐱</div>
                    </div>
                </div>

                {/* 404 텍스트 */}
                <h1 className="text-9xl font-black text-primary-600 mb-4">404</h1>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    페이지를 찾을 수 없어요!
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    고양이가 사라진 페이지를 찾고 있어요... 🐾
                    <br />
                    원하시는 페이지가 존재하지 않거나 이동되었을 수 있습니다.
                </p>

                {/* 버튼들 */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/"
                        className="px-8 py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg shadow-primary-600/30"
                    >
                        🏠 홈으로 가기
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="px-8 py-4 bg-white text-primary-600 border-2 border-primary-600 rounded-xl font-bold hover:bg-primary-50 transition-all transform hover:scale-105"
                    >
                        ← 이전 페이지로
                    </button>
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
