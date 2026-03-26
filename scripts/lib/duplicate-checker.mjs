/**
 * Verifica se uma pauta já foi publicada no Sanity
 * Compara por sobreposição de palavras-chave (threshold 60%)
 */

import { createClient } from '@sanity/client'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'o64so9y2',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Palavras irrelevantes para comparação
const STOPWORDS = new Set([
  'de', 'da', 'do', 'das', 'dos', 'em', 'no', 'na', 'nos', 'nas',
  'e', 'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas',
  'para', 'por', 'com', 'que', 'se', 'ao', 'à', 'às', 'aos',
  'é', 'são', 'foi', 'será', 'mais', 'já', 'após', 'sobre',
])

function extractKeywords(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w))
}

function similarity(titleA, titleB) {
  const kwA = new Set(extractKeywords(titleA))
  const kwB = new Set(extractKeywords(titleB))
  if (kwA.size === 0) return 0
  const intersection = [...kwA].filter((w) => kwB.has(w))
  return intersection.length / kwA.size
}

let cachedTitles = null

async function getRecentTitles() {
  if (cachedTitles) return cachedTitles

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const articles = await sanity.fetch(
    `*[_type == "article" && publishedAt > $since] { title }`,
    { since: thirtyDaysAgo }
  )

  cachedTitles = articles.map((a) => a.title)
  console.log(`  Verificando contra ${cachedTitles.length} artigo(s) dos últimos 30 dias`)
  return cachedTitles
}

export async function isDuplicate(candidateTitle, threshold = 0.6) {
  const recentTitles = await getRecentTitles()
  for (const existing of recentTitles) {
    const score = similarity(candidateTitle, existing)
    if (score >= threshold) {
      console.log(`  Duplicata detectada (${Math.round(score * 100)}%): "${existing}"`)
      return true
    }
  }
  return false
}
