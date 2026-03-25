/**
 * Geração em lote de imagens para todos os artigos sem imagem
 *
 * Uso:
 *   node scripts/generate-all-images.mjs
 *
 * Flags:
 *   --force    Regenera imagens mesmo em artigos que já têm foto
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FORCE = process.argv.includes('--force')

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
    console.error('Arquivo .env.local não encontrado')
    process.exit(1)
  }
}

loadEnv()

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'o64so9y2'
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const SANITY_TOKEN = process.env.SANITY_API_TOKEN

const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: SANITY_TOKEN,
  useCdn: false,
})

const HF_TOKEN = process.env.HF_TOKEN
if (!HF_TOKEN) {
  console.error('❌ HF_TOKEN não encontrado no .env.local')
  console.error('   Crie um token grátis em: huggingface.co → Settings → Access Tokens')
  process.exit(1)
}

function buildPrompt(title, excerpt) {
  const context = excerpt ? ` ${excerpt}` : ''
  return `photorealistic press photo, photojournalism, documentary photography, ${title}.${context} Itapoa Santa Catarina Brazil coastal town, natural lighting, sharp focus, DSLR camera, Reuters AP style, no text, no watermark, no illustration, no drawing, no cartoon`
}

async function generateImage(title, excerpt) {
  const prompt = buildPrompt(title, excerpt)
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
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Hugging Face API error ${response.status}: ${text}`)
  }
  return Buffer.from(await response.arrayBuffer())
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function generateAndUpload(article, index, total) {
  const prefix = `[${index}/${total}] "${article.title}"`

  try {
    console.log(`\n${prefix}`)
    console.log('  🎨 Gerando imagem...')
    const buffer = await generateImage(article.title, article.excerpt)

    console.log('  ⬆️  Enviando para o Sanity...')
    const asset = await sanity.assets.upload('image', buffer, {
      filename: `${article.slug.current}-${Date.now()}.jpg`,
      contentType: 'image/jpeg',
    })

    await sanity
      .patch(article._id)
      .set({
        mainImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
          alt: article.title,
        },
      })
      .commit()

    console.log(`  ✅ Concluído`)
    return { success: true }
  } catch (err) {
    console.error(`  ❌ Erro: ${err.message}`)
    return { success: false, error: err.message }
  }
}

async function main() {
  console.log(`\n🗞️  The Itapoá Times — Geração em Lote de Imagens`)
  console.log(`   ${FORCE ? '⚠️  Modo --force: regenerando todas as imagens' : 'Apenas artigos sem imagem'}\n`)

  const query = FORCE
    ? `*[_type == "article"] | order(publishedAt desc) { _id, title, slug, excerpt, mainImage }`
    : `*[_type == "article" && !defined(mainImage)] | order(publishedAt desc) { _id, title, slug, excerpt }`

  const articles = await sanity.fetch(query)

  if (articles.length === 0) {
    console.log('✅ Todos os artigos já têm imagem!')
    return
  }

  console.log(`📰 ${articles.length} artigo(s) para processar\n`)
  console.log('─'.repeat(50))

  const results = []
  for (let i = 0; i < articles.length; i++) {
    const result = await generateAndUpload(articles[i], i + 1, articles.length)
    results.push(result)

    // Pausa entre requisições para não sobrecarregar a API
    if (i < articles.length - 1) {
      console.log('  ⏳ Aguardando 3s...')
      await sleep(3000)
    }
  }

  const succeeded = results.filter((r) => r.success).length
  const failed = results.filter((r) => !r.success).length

  console.log('\n' + '─'.repeat(50))
  console.log(`\n📊 Resultado final:`)
  console.log(`   ✅ ${succeeded} imagem(ns) gerada(s) com sucesso`)
  if (failed > 0) console.log(`   ❌ ${failed} falha(s)`)
  console.log()
}

main().catch((err) => {
  console.error('❌ Erro fatal:', err.message)
  process.exit(1)
})
