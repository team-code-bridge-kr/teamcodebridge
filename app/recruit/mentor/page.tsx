import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import MentorRecruitContent from '@/components/MentorRecruitContent'

export const metadata = {
    title: '26 시즌 멘토 지원 | TeamCodeBridge',
    description: 'TeamCodeBridge와 함께 IT 교육의 미래를 만들어갈 26 시즌 멘토를 모집합니다.',
}

export default function MentorRecruitPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navigation variant="light" />
            <MentorRecruitContent />
            <Footer variant="light" />
        </main>
    )
}
