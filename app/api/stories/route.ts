import { NextResponse } from 'next/server'

// 간단한 RSS XML 파싱 함수
function parseRSSXML(xmlText: string): { items: any[] } | null {
  try {
    const items: any[] = []
    
    // <item> 태그 찾기 (matchAll 대신 정규식 사용)
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi
    let match: RegExpExecArray | null
    
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[1]
      
      const titleMatch = itemContent.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
      const linkMatch = itemContent.match(/<link[^>]*>([\s\S]*?)<\/link>/i)
      const pubDateMatch = itemContent.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)
      const descriptionMatch = itemContent.match(/<description[^>]*>([\s\S]*?)<\/description>/i)
      const enclosureMatch = itemContent.match(/<enclosure[^>]+url="([^"]+)"/i)
      const thumbnailMatch = itemContent.match(/<thumbnail[^>]*>([\s\S]*?)<\/thumbnail>/i)
      
      // description 추출 (CDATA 제거)
      let descriptionText = ''
      if (descriptionMatch) {
        descriptionText = descriptionMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim()
      }
      
      // description 내부의 img 태그에서 이미지 추출 (CDATA 제거 전/후 모두 확인)
      let imageFromDescription: string | null = null
      if (descriptionMatch) {
        // CDATA를 포함한 원본에서 먼저 찾기
        const rawDescription = descriptionMatch[1]
        const imgMatchInRaw = rawDescription.match(/<img[^>]+src="([^"]+)"/i)
        if (imgMatchInRaw && imgMatchInRaw[1]) {
          imageFromDescription = imgMatchInRaw[1]
        } else {
          // CDATA 제거 후에도 찾기
          const imgMatchInProcessed = descriptionText.match(/<img[^>]+src="([^"]+)"/i)
          if (imgMatchInProcessed && imgMatchInProcessed[1]) {
            imageFromDescription = imgMatchInProcessed[1]
          }
        }
      }
      
      if (titleMatch) {
        items.push({
          title: titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim(),
          link: linkMatch ? linkMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim() : '',
          pubDate: pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString(),
          description: descriptionText,
          enclosure: enclosureMatch ? { link: enclosureMatch[1] } : null,
          thumbnail: thumbnailMatch ? thumbnailMatch[1].trim() : null,
          imageFromDescription: imageFromDescription, // description에서 추출한 이미지 저장
          content: itemContent
        })
      }
    }
    
    return items.length > 0 ? { items } : null
  } catch (error) {
    console.error('XML Parsing Error:', error)
    return null
  }
}

interface Story {
  id: string
  title: string
  date: string
  category: string
  image: string
  description?: string
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
    // 네이버 블로그의 경우 여러 URL 형식 시도
    let rssData: any = null
    let lastError: Error | null = null

    // 네이버 블로그 RSS URL 변형 시도
    const naverBlogMatch = rssUrl.match(/blog\.naver\.com\/([^\/\?]+)/)
    const alternativeUrls = naverBlogMatch ? [
      `https://blog.naver.com/${naverBlogMatch[1]}?fromRss=true&trackingCode=rss`,
      `https://blog.rss.naver.com/${naverBlogMatch[1]}.xml`,
      `https://blog.naver.com/${naverBlogMatch[1]}/rss`,
      rssUrl
    ] : [rssUrl]

    // 여러 URL 형식 시도
    for (const url of alternativeUrls) {
      try {
        // 먼저 rss2json 사용 시도
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`
        const proxyResponse = await fetch(proxyUrl, {
          next: { revalidate: 3600 } // 1시간 캐시
        })
        
        if (proxyResponse.ok) {
          const proxyData = await proxyResponse.json()
          if (proxyData.status === 'ok' && proxyData.items && proxyData.items.length > 0) {
            rssData = proxyData
            break
          }
        }
      } catch (err) {
        lastError = err as Error
        // 계속 다음 URL 시도
      }

      // 직접 RSS XML 파싱 시도 (서버 사이드에서는 CORS 없음)
      try {
        const directResponse = await fetch(url, {
          next: { revalidate: 3600 },
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)'
          }
        })
        
        if (directResponse.ok) {
          const xmlText = await directResponse.text()
          // 간단한 XML 파싱 (실제로는 xml2js 같은 라이브러리 사용 권장)
          rssData = parseRSSXML(xmlText)
          if (rssData && rssData.items && rssData.items.length > 0) {
            break
          }
        }
      } catch (err) {
        lastError = err as Error
        // 계속 시도
      }
    }

    if (!rssData || !rssData.items || rssData.items.length === 0) {
      console.error('RSS Feed Error: Unable to fetch from any URL format', lastError)
      return []
    }

    return rssData.items.slice(0, 10).map((item: any, index: number) => {
      // 이미지 추출 (우선순위: parseRSSXML에서 추출한 imageFromDescription > description 내 img > content 내 img > enclosure > thumbnail)
      let image: string | null = null
      
      // 1. parseRSSXML에서 이미 추출한 이미지 (최우선 - CDATA 처리 완료된 상태)
      if (item.imageFromDescription) {
        image = item.imageFromDescription
      }
      // 2. description 내부의 img 태그에서 이미지 추출 (Naver Blog 형식)
      else if (item.description) {
        const descImgMatch = item.description.match(/<img[^>]+src="([^"]+)"/i)
        if (descImgMatch && descImgMatch[1]) {
          image = descImgMatch[1]
        }
      }
      // 3. content 내부에서도 찾기
      else if (item.content) {
        const contentImgMatch = item.content.match(/<img[^>]+src="([^"]+)"/i)
        if (contentImgMatch && contentImgMatch[1]) {
          image = contentImgMatch[1]
        }
      }
      // 4. enclosure나 thumbnail 사용
      if (!image) {
        image = item.enclosure?.link || item.thumbnail || null
      }
      
      image = image || '/api/placeholder/400/250'
      
      // HTML 태그 제거 및 설명 추출 (이미지 태그 제외한 텍스트만)
      const description = item.description
        ? item.description
            .replace(/<img[^>]*>/gi, '') // 이미지 태그 먼저 제거
            .replace(/<[^>]*>/g, '') // 나머지 HTML 태그 제거
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .substring(0, 150)
            .trim()
        : ''

      return {
        id: `rss-${index}`,
        title: item.title,
        date: new Date(item.pubDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }), // 예: Sep 22, 2025
        category: item.categories?.[0] || '블로그',
        image,
        description,
        url: item.link,
      }
    })
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

