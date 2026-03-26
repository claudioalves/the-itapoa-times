/**
 * Agente de Redação Automática — The Itapoá Times
 *
 * Roda diariamente via GitHub Actions às 7h (Brasília)
 * Busca notícias, escreve matérias com Claude, gera imagens e publica rascunhos no Sanity
 *
 * Uso local (para testar):
 *   node scripts/agent-writer.mjs
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@sanity/client'
import { fetchAllNews } from './lib/scraper.mjs'
import { isDuplicate } from './lib/duplicate-checker.mjs'
import { writeArticle } from './lib/writer.mjs'
import { publishDraft } from './lib/publisher.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Carrega .env.local em ambiente local
function loadEnv() {
  const envPath = resolve(__dirname, '../.env.local')
  try {
    const content = readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIndex = trimmed.indexOf('=')
      if (eqIndex === -1) continue
      const key = trimmed.slice(0, eqIndex).trim()
      const value = trimmed.slice(eqIndex + 1).trim()
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    // Em produção (GitHub Actions) as vars vêm de Secrets — ok ignorar
  }
}

loadEnv()

// Validar variáveis obrigatórias
const required = ['ANTHROPIC_API_KEY', 'SANITY_API_TOKEN', 'HF_TOKEN']
for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Variável de ambiente faltando: ${key}`)
    process.exit(1)
  }
}

const MAX_ARTICLES = 3

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'o64so9y2',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function generateImage(title, excerpt) {
  const HF_TOKEN = process.env.HF_TOKEN
  const context = excerpt ? ` ${excerpt}` : ''
  const prompt = `photorealistic press photo, photojournalism, documentary photography, ${title}.${context} Itapoa Santa Catarina Brazil coastal town, natural lighting, sharp focus, DSLR camera, Reuters AP style, no text, no watermark, no illustration, no drawing, no cartoon`

  const response = await fetch(
    'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { width: 1280, height: 720 },
      }),
    }
  )

  if (!response.ok) throw new Error(`HF API error ${response.status}`)
  return Buffer.from(await response.arrayBuffer())
}

async function uploadImage(buffer, slug) {
  const asset = await sanity.assets.upload('image', buffer, {
    filename: `agent-${slug}-${Date.now()}.jpg`,
    contentType: 'image/jpeg',
  })
  return asset._id
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function main() {
  console.log('\n🗞️  The Itapoá Times — Agente de Redação')
  console.log(`   ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}\n`)

  // 1. Buscar notícias nos sites concorrentes
  console.log('📡 ETAPA 1: Buscando pautas...')
  const news = await fetchAllNews()
  console.log(`   ${news.length} notícia(s) relevante(s) encontrada(s)\n`)

  if (news.length === 0) {
    console.log('   Nenhuma pauta nova hoje. Encerrando.')
    return
  }

  // 2. Filtrar duplicatas e selecionar pautas
  console.log('🔍 ETAPA 2: Verificando duplicatas...')
  const candidates = []
  for (const item of news) {
    if (candidates.length >= MAX_ARTICLES) break
    const dup = await isDuplicate(item.title)
    if (!dup) {
      candidates.push(item)
      console.log(`   ✅ Nova pauta: "${item.title}"`)
    }
  }

  if (candidates.length === 0) {
    console.log('   Todas as pautas já foram cobertas. Encerrando.')
    return
  }

  console.log(`\n   ${candidates.length} pauta(s) selecionada(s)\n`)

  // 3. Escrever, gerar imagem e publicar cada matéria
  const results = []
  for (let i = 0; i < candidates.length; i++) {
    const source = candidates[i]
    console.log(`✍️  MATÉRIA ${i + 1}/${candidates.length}: "${source.title}"`)

    try {
      // Escrever com Claude
      console.log('   Redigindo com Claude...')
      const article = await writeArticle(source)
      console.log(`   Título: "${article.title}"`)
      console.log(`   Categoria: ${article.category}`)

      // Gerar imagem
      console.log('   Gerando imagem...')
      const imageBuffer = await generateImage(article.title, article.excerpt)
      const imageAssetId = await uploadImage(imageBuffer, article.slug)
      console.log(`   Imagem: ${imageAssetId}`)

      // Publicar rascunho
      console.log('   Publicando rascunho no Sanity...')
      const draftId = await publishDraft(article, imageAssetId)
      console.log(`   Rascunho criado: ${draftId}`)

      results.push({ success: true, title: article.title })
    } catch (err) {
      console.error(`   ❌ Erro: ${err.message}`)
      results.push({ success: false, error: err.message })
    }

    if (i < candidates.length - 1) {
      console.log('   Aguardando 5s...\n')
      await sleep(5000)
    }
  }

  // Resumo
  const ok = results.filter((r) => r.success).length
  const fail = results.filter((r) => !r.success).length
  console.log('\n' + '─'.repeat(50))
  console.log(`\n📊 Resumo:`)
  console.log(`   ✅ ${ok} matéria(s) criada(s) como rascunho no Sanity Studio`)
  if (fail > 0) console.log(`   ❌ ${fail} falha(s)`)
  console.log('\n   Acesse o Sanity Studio para revisar e publicar.\n')
}

main().catch((err) => {
  console.error('❌ Erro fatal:', err.message)
  process.exit(1)
})
