/**
 * Scraper de notícias dos sites concorrentes
 * Busca via RSS (prioritário) ou scraping HTML com cheerio
 */

import * as cheerio from 'cheerio'

const KEYWORDS = ['itapoá', 'itapoa', 'porto itapoá', 'porto itapoa', 'barra do saí', 'barra do sai']

const SOURCES = [
  {
    name: 'G1 SC',
    rss: 'https://g1.globo.com/rss/g1/sc/',
  },
  {
    name: 'NSC Total',
    rss: 'https://www.nsctotal.com.br/rss',
  },
  {
    name: 'A Notícia',
    rss: 'https://www.an.com.br/rss',
  },
  {
    name: 'Diário Catarinense',
    rss: 'https://www.diariocatarinense.com.br/rss',
  },
  {
    name: 'Prefeitura Itapoá',
    url: 'https://www.pmitapoa.sc.gov.br/noticias',
    scrape: true,
  },
  {
    name: 'Porto Itapoá',
    url: 'https://www.portoitapoa.com.br/noticias',
    scrape: true,
  },
]

function isRelevant(text) {
  const lower = text.toLowerCase()
  return KEYWORDS.some((kw) => lower.includes(kw))
}

async function fetchRSS(source) {
  try {
    const res = await fetch(source.rss, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ItapoaTimesBot/1.0)' },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return []
    const xml = await res.text()
    const $ = cheerio.load(xml, { xmlMode: true })
    const items = []

    $('item').each((_, el) => {
      const title = $(el).find('title').first().text().trim()
      const link = $(el).find('link').first().text().trim() || $(el).find('link').attr('href') || ''
      const description = $(el).find('description').first().text().trim()
      const pubDate = $(el).find('pubDate').first().text().trim()

      const combined = `${title} ${description}`
      if (isRelevant(combined)) {
        items.push({ title, link, description, pubDate, source: source.name })
      }
    })

    return items
  } catch {
    return []
  }
}

async function scrapeHTML(source) {
  try {
    const res = await fetch(source.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ItapoaTimesBot/1.0)' },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return []
    const html = await res.text()
    const $ = cheerio.load(html)
    const items = []

    // Seletores genéricos para títulos de notícias
    $('h2 a, h3 a, .titulo a, .noticia-titulo a, article a').each((_, el) => {
      const title = $(el).text().trim()
      const href = $(el).attr('href') || ''
      const link = href.startsWith('http') ? href : `${new URL(source.url).origin}${href}`

      if (title.length > 20 && isRelevant(title)) {
        items.push({ title, link, description: '', pubDate: '', source: source.name })
      }
    })

    return items
  } catch {
    return []
  }
}

export async function fetchAllNews() {
  console.log('  Buscando notícias nos sites concorrentes...')
  const results = await Promise.allSettled(
    SOURCES.map((source) => (source.scrape ? scrapeHTML(source) : fetchRSS(source)))
  )

  const all = []
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      console.log(`  [${SOURCES[i].name}] ${r.value.length} notícia(s) relevante(s)`)
      all.push(...r.value)
    } else {
      console.log(`  [${SOURCES[i].name}] Falha ao buscar`)
    }
  })

  // Remover duplicatas pelo título
  const seen = new Set()
  return all.filter((item) => {
    const key = item.title.toLowerCase().slice(0, 50)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
