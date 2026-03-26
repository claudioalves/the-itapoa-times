/**
 * Scraper de notícias via Google News RSS
 * Busca por termos relacionados a Itapoá e região
 */

import * as cheerio from 'cheerio'

// Buscas no Google News — cada query retorna RSS com notícias relevantes
const QUERIES = [
  { q: 'Itapoá SC', name: 'Google News: Itapoá SC' },
  { q: 'Porto Itapoá', name: 'Google News: Porto Itapoá' },
  { q: 'Itapoá Santa Catarina', name: 'Google News: Itapoá Santa Catarina' },
  { q: 'litoral norte SC Itapoá', name: 'Google News: Litoral Norte' },
]

const MAX_AGE_DAYS = 5

function isRecent(pubDate) {
  if (!pubDate) return true // sem data, aceita
  const date = new Date(pubDate)
  if (isNaN(date.getTime())) return true // data inválida, aceita
  const diffMs = Date.now() - date.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays <= MAX_AGE_DAYS
}

function buildGoogleNewsURL(query) {
  const encoded = encodeURIComponent(query)
  return `https://news.google.com/rss/search?q=${encoded}&hl=pt-BR&gl=BR&ceid=BR:pt-419`
}

async function fetchGoogleNewsRSS(query) {
  const url = buildGoogleNewsURL(query.q)
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
    })

    if (!res.ok) {
      console.log(`  [${query.name}] HTTP ${res.status}`)
      return []
    }

    const xml = await res.text()
    const $ = cheerio.load(xml, { xmlMode: true })
    const items = []

    $('item').each((_, el) => {
      const title = $(el).find('title').first().text()
        .replace(/<[^>]+>/g, '').trim()
      const link = $(el).find('link').first().text().trim()
      const description = $(el).find('description').first().text()
        .replace(/<[^>]+>/g, '').trim()
      const pubDate = $(el).find('pubDate').first().text().trim()
      const sourceName = $(el).find('source').first().text().trim() || query.name

      if (title && title.length > 15 && isRecent(pubDate)) {
        items.push({ title, link, description, pubDate, source: sourceName })
      }
    })

    return items
  } catch (err) {
    console.log(`  [${query.name}] Erro: ${err.message}`)
    return []
  }
}

export async function fetchAllNews() {
  console.log('  Buscando notícias via Google News RSS...')

  const results = await Promise.allSettled(QUERIES.map(fetchGoogleNewsRSS))

  const all = []
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      console.log(`  [${QUERIES[i].name}] ${r.value.length} notícia(s)`)
      all.push(...r.value)
    }
  })

  // Remover duplicatas pelo título
  const seen = new Set()
  return all.filter((item) => {
    const key = item.title.toLowerCase().slice(0, 60)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
