import { NextResponse } from 'next/server'

interface Story {
  id: string
  title: string
  date: string
  category: string
  image: string
  url?: string
}

// Notion API를 사용하는 경우
async function fetchFromNotion(): Promise<Story[]> {
  const NOTION_API_KEY = process.env.NOTION_API_KEY
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    return []
  }

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sorts: [{ property: 'Date', direction: 'descending' }],
          page_size: 10,
        }),
      }
    )

    const data = await response.json()
    
    return data.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Title?.title?.[0]?.plain_text || '',
      date: page.properties.Date?.date?.start || '',
      category: page.properties.Category?.select?.name || '기타',
      image: page.properties.Image?.files?.[0]?.file?.url || '/api/placeholder/400/250',
      url: page.properties.URL?.url || '',
    }))
  } catch (error) {
    console.error('Notion API Error:', error)
    return []
  }
}

// RSS 피드를 사용하는 경우
async function fetchFromRSS(rssUrl: string): Promise<Story[]> {
  try {
    // CORS 프록시를 통해 RSS 피드 가져오기
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
    const response = await fetch(proxyUrl)
    const data = await response.json()

    return data.items.slice(0, 10).map((item: any, index: number) => ({
      id: `rss-${index}`,
      title: item.title,
      date: new Date(item.pubDate).toLocaleDateString('ko-KR'),
      category: '블로그',
      image: item.enclosure?.link || item.thumbnail || '/api/placeholder/400/250',
      url: item.link,
    }))
  } catch (error) {
    console.error('RSS Feed Error:', error)
    return []
  }
}

// GitHub Markdown 파일에서 가져오기
async function fetchFromGitHub(): Promise<Story[]> {
  const GITHUB_REPO = process.env.GITHUB_REPO // 예: "username/repo"
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN

  if (!GITHUB_REPO) {
    return []
  }

  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    }
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`
    }

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/stories`,
      { headers }
    )

    const files = await response.json()
    
    const stories: Story[] = []
    
    for (const file of files.slice(0, 10)) {
      if (file.name.endsWith('.md')) {
        const fileResponse = await fetch(file.download_url, { headers })
        const content = await fileResponse.text()
        
        // Front matter 파싱
        const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
        if (frontMatterMatch) {
          const frontMatter = frontMatterMatch[1]
          const titleMatch = frontMatter.match(/title:\s*(.+)/)
          const dateMatch = frontMatter.match(/date:\s*(.+)/)
          const categoryMatch = frontMatter.match(/category:\s*(.+)/)
          
          stories.push({
            id: file.sha,
            title: titleMatch?.[1] || file.name,
            date: dateMatch?.[1] || new Date().toLocaleDateString('ko-KR'),
            category: categoryMatch?.[1] || '기타',
            image: '/api/placeholder/400/250',
          })
        }
      }
    }
    
    return stories
  } catch (error) {
    console.error('GitHub API Error:', error)
    return []
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const source = searchParams.get('source') || 'notion' // 'notion', 'rss', 'github'

  let stories: Story[] = []

  try {
    switch (source) {
      case 'notion':
        stories = await fetchFromNotion()
        break
      case 'rss':
        const rssUrl = process.env.RSS_FEED_URL || searchParams.get('rss_url')
        if (rssUrl) {
          stories = await fetchFromRSS(rssUrl)
        }
        break
      case 'github':
        stories = await fetchFromGitHub()
        break
      default:
        stories = []
    }

    return NextResponse.json({ stories }, { 
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error fetching stories:', error)
    return NextResponse.json({ stories: [] }, { status: 500 })
  }
}

