interface FooterProps {
  variant?: 'light' | 'dark'
}

export default function Footer({ variant = 'light' }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const isDark = variant === 'dark'

  const footerSections = [
    {
      title: '서비스',
      links: [
        { name: '팀코드브릿지 소개', href: '/about' },
        { name: '프로젝트', href: '/projects' },
        { name: '활동 사례', href: '/activities' },
      ],
    },
    {
      title: '지원하기',
      links: [
        { name: '26 시즌 멘토', href: '/#recruit' },
        { name: '스쿨어택 신청', href: '/#recruit' },
        { name: '파트너십 문의', href: 'mailto:support@teamcodebridge.dev' },
      ],
    },
    {
      title: '고객지원',
      links: [
        { name: '자주 묻는 질문', href: '#' },
        { name: '공지사항', href: '#' },
        { name: '문의하기', href: 'mailto:support@teamcodebridge.dev' },
      ],
    },
    {
      title: '법적 고지',
      links: [
        { name: '이용약관', href: '/terms' },
        { name: '개인정보처리방침', href: '/privacy' },
      ],
    },
    {
      title: '소셜',
      links: [
        { name: '인스타그램', href: 'https://www.instagram.com/teamcodebridge' },
        { name: '카카오톡 채널', href: 'https://pf.kakao.com/_GJgxin/' },
        { name: '깃허브', href: 'https://github.com/team-code-bridge-kr' },
      ],
    },
  ]

  return (
    <footer className={`${isDark ? 'bg-black border-white/10' : 'bg-white border-gray-100'} border-t`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Top section: Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 md:mb-16">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className={`text-sm font-bold mb-4 uppercase tracking-wider ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className={`text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section: Organization Info */}
        <div className={`pt-8 border-t ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>팀코드브릿지</h3>
              <div className={`text-xs md:text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <p>대표 : 장원준 | 등록번호 : 405-82-74718</p>
                <p>주소 : 인천 남동구 남동서로236번길 30 222-J373호</p>
                <p>이메일 : support@teamcodebridge.dev</p>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              <div className={`flex flex-wrap gap-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <a href="/terms" className={`hover:underline ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                  이용약관
                </a>
                <span>|</span>
                <a href="/privacy" className={`hover:underline ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                  개인정보처리방침
                </a>
              </div>
              <p className="text-gray-400 text-xs">
                © {currentYear} TeamCodeBridge. All Rights Reserved.
              </p>
              <p className={`${isDark ? 'text-white/40' : 'text-gray-900'} font-bold text-xs tracking-wider`}>
                At the Edge of Possibility, IT Education Begins
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
