import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TeamCodeBridge | 가능성의 끝에서 IT 교육의 시작!',
  description: '연합 봉사 동아리로, 멘토링·IT공모전·해커톤 경험을 바탕으로 초/중/고등학생 대상 AI·코딩 기초부터 실습, 미니 해커톤까지 체계적 멘토링과 진로 탐색 지원을 제공합니다.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}

