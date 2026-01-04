import { privacyContent } from '@/lib/terms-content'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata = {
    title: '개인정보처리방침 | TeamCodeBridge',
    description: 'TeamCodeBridge 워크스페이스 서비스 개인정보처리방침',
}

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navigation variant="light" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">개인정보처리방침</h1>
                    <div className="prose prose-lg max-w-none">
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                            {privacyContent}
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            최종 수정일: 2026년 1월 1일
                        </p>
                    </div>
                </div>
            </div>
            <Footer variant="light" />
        </main>
    )
}

