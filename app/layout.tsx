import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

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
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
        <script async defer src="https://apis.google.com/js/api.js"></script>
        <script async defer src="https://accounts.google.com/gsi/client"></script>
      </head>
      <body style={{ fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

