import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '팀코드브릿지 | 대학생들이 직접 운영하는 비영리 IT 교육봉사',
  description: '대학생들이 직접 운영하는 비영리 IT 교육봉사, 팀코드브릿지! 미래 인재를 위한 실전적인 IT 교육과 멘토링을 제공합니다.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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

