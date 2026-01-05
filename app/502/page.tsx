import Link from 'next/link'

export default function BadGateway() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                {/* 고양이 이미지 */}
                <div className="relative w-64 h-64 mx-auto mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full blur-3xl opacity-50"></div>
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* 고양이 이모지 */}
                        <div className="text-9xl animate-bounce">😺</div>
                    </div>
                </div>

                {/* 502 텍스트 */}
                <h1 className="text-9xl font-black text-yellow-600 mb-4">502</h1>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    서버에 연결할 수 없어요!
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    고양이가 서버를 만지고 있어요... 🐾
                    <br />
                    잠시 후 다시 시도해주세요.
                </p>

                {/* 버튼들 */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-4 bg-yellow-600 text-white rounded-xl font-bold hover:bg-yellow-700 transition-all transform hover:scale-105 shadow-lg shadow-yellow-600/30"
                    >
                        🔄 새로고침
                    </button>
                    <Link
                        href="/"
                        className="px-8 py-4 bg-white text-yellow-600 border-2 border-yellow-600 rounded-xl font-bold hover:bg-yellow-50 transition-all transform hover:scale-105"
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
