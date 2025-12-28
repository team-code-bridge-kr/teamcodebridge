import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AboutContent from '@/components/AboutContent'

export const metadata = {
    title: '팀코드브릿지 소개 | 대학생들이 직접 운영하는 비영리 IT 교육봉사',
    description: '대학생들이 직접 운영하는 비영리 IT 교육봉사, 팀코드브릿지!',
}

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navigation variant="light" />
            <AboutContent />
            <Footer variant="light" />
        </main>
    )
}
