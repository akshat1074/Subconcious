export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export function extractTweetId(url: string): string | null {
  const m = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/)
  return m ? m[1] : null
}

export async function fetchLinkMetadata(url: string) {
  try {
    const ctrl = new AbortController()
    const timeout = setTimeout(() => ctrl.abort(), 5000)
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Subconscious/1.0)' },
    })
    clearTimeout(timeout)
    const html = await res.text()
    const getMeta = (name: string): string | null => {
      const m =
        html.match(new RegExp(`<meta[^>]*(?:name|property)=["']${name}["'][^>]*content=["']([^"']+)["']`, 'i')) ||
        html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*(?:name|property)=["']${name}["']`, 'i'))
      return m ? m[1] : null
    }
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    return {
      image: getMeta('og:image') || getMeta('twitter:image'),
      description: getMeta('og:description') || getMeta('description'),
      siteName: getMeta('og:site_name'),
      title: getMeta('og:title') || (titleMatch ? titleMatch[1].trim() : null),
      favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`,
    }
  } catch {
    return { image: null, description: null, siteName: null, title: null, favicon: null }
  }
}

export function buildVectorText(data: {
  title: string; type: string; url?: string | null
  content?: string | null; tags?: string[]; description?: string | null
}): string {
  return [data.title, `type: ${data.type}`, data.url, data.content?.slice(0, 800),
    data.description, data.tags?.length ? `tags: ${data.tags.join(', ')}` : null]
    .filter(Boolean).join(' | ')
}
