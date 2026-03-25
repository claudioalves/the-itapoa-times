/**
 * Gerador de imagens para artigos do The Itapoá Times
 *
 * Uso:
 *   node scripts/generate-image.mjs <slug-do-artigo>
 *
 * Exemplo:
 *   node scripts/generate-image.mjs prefeitura-abre-vagas-concurso
 *
 * O script:
 *  1. Busca o artigo no Sanity pelo slug
 *  2. Gera uma foto realista com Imagen 3 (Google AI)
 *  3. Sobe a imagem para o Sanity CDN
 *  4. Atualiza o campo mainImage do artigo
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local manually (Next.js não carrega isso em scripts Node)
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

if (!SANITY_TOKEN) {
  console.error('❌ SANITY_API_TOKEN não encontrado no .env.local')
  process.exit(1)
}

const slug = process.argv[2]
if (!slug) {
  console.error('❌ Informe o slug do artigo: node scripts/generate-image.mjs <slug>')
  process.exit(1)
}

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
  console.log('🎨 Gerando imagem com Hugging Face FLUX...')
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

async function uploadToSanity(buffer, filename) {
  console.log('⬆️  Enviando imagem para o Sanity...')
  const asset = await sanity.assets.upload('image', buffer, {
    filename,
    contentType: 'image/jpeg',
  })
  return asset
}

async function patchArticle(articleId, assetId, altText) {
  console.log('📝 Atualizando artigo no Sanity...')
  await sanity
    .patch(articleId)
    .set({
      mainImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
        alt: altText,
      },
    })
    .commit()
}

async function main() {
  console.log(`\n🗞️  The Itapoá Times — Gerador de Imagens`)
  console.log(`📰 Artigo: ${slug}\n`)

  // 1. Buscar artigo
  console.log('🔍 Buscando artigo no Sanity...')
  const article = await sanity.fetch(
    `*[_type == "article" && slug.current == $slug][0] {
      _id, title, slug, excerpt, mainImage
    }`,
    { slug }
  )

  if (!article) {
    console.error(`❌ Artigo "${slug}" não encontrado no Sanity`)
    process.exit(1)
  }

  console.log(`✅ Artigo encontrado: "${article.title}"`)

  if (article.mainImage?.asset) {
    console.log('⚠️  Este artigo já tem uma imagem.')
    console.log('   Para substituir, confirme pressionando Enter (Ctrl+C para cancelar)...')
    await new Promise((resolve) => {
      process.stdin.once('data', resolve)
    })
    process.stdin.destroy()
  }

  // 2. Gerar imagem
  const buffer = await generateImage(article.title, article.excerpt)

  // 3. Upload para Sanity
  const filename = `${article.slug.current}-${Date.now()}.jpg`
  const asset = await uploadToSanity(buffer, filename)
  console.log(`✅ Imagem enviada: ${asset._id}`)

  // 4. Atualizar artigo
  await patchArticle(article._id, asset._id, article.title)

  console.log(`\n✅ Concluído! Artigo "${article.title}" atualizado com nova imagem.`)
  console.log(`🌐 Veja em: http://localhost:3000/${article.slug?.current ?? slug}\n`)
}

main().catch((err) => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
