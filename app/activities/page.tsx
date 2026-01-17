import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import NaverBlogArticles from '@/components/NaverBlogArticles'

export const metadata = {
    title: '팀코드브릿지 활동 | 대학생들이 직접 운영하는 비영리 IT 교육봉사',
    description: '대학생들이 직접 운영하는 비영리 IT 교육봉사, 팀코드브릿지!',
}


export default function ActivitiesPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navigation variant="light" />

            {/* Naver Blog Articles Section */}
            <section className="pt-24 py-16 bg-white">
                <NaverBlogArticles />
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-gray-50 mt-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        함께 성장할 준비가 되셨나요?
                    </h2>
                    <a
                        href="/#recruit"
                        className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                    >
                        지원하기 →
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    )
}
