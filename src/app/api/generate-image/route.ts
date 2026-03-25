/**
 * Webhook endpoint para geração automática de imagens
 * Acionado pelo Sanity quando um artigo é publicado
 *
 * Configurar no Sanity:
 *   Settings → API → Webhooks → Create
 *   URL: https://seu-site.vercel.app/api/generate-image
 *   Filter: _type == "article"
 *   Trigger on: Create, Update
 *   HTTP Headers: Authorization: Bearer {REVALIDATE_SECRET}
 */

import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI, Modality } from '@google/genai'
import { createClient } from '@sanity/client'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'o64so9y2',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

function buildPrompt(title: string, excerpt?: string) {
  return `Photorealistic news photograph for a Brazilian local newspaper article.

Article title: "${title}"
${excerpt ? `Context: "${excerpt}"` : ''}

Requirements:
- Photojournalism style, documentary photography
- Realistic, sharp focus, natural lighting
- Professional quality, like a Reuters or AP photo
- Setting: coastal city of Itapoá, Santa Catarina, southern Brazil (Atlantic Ocean, beaches, small-town infrastructure, local commerce, fishing boats)
- No illustrations, no cartoons, no drawings, no digital art, no CGI
- No text, no logos, no watermarks
- Horizontal composition (landscape orientation)
- Shot on DSLR camera`
}

export async function POST(request: NextRequest) {
  // Verificar autorização
  const authHeader = request.headers.get('authorization')
  const secret = process.env.REVALIDATE_SECRET
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const articleId: string = body._id

    if (!articleId) {
      return NextResponse.json({ error: 'Missing article _id' }, { status: 400 })
    }

    // Buscar artigo
    const article = await sanity.fetch<{
      _id: string
      title: string
      slug: { current: string }
      excerpt: string
      mainImage?: { asset?: { _ref: string } }
    }>(
      `*[_id == $id][0] { _id, title, slug, excerpt, mainImage }`,
      { id: articleId }
    )

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Só gerar se não tiver imagem ainda
    if (article.mainImage?.asset?._ref) {
      return NextResponse.json({ skipped: true, reason: 'Article already has an image' })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

    // Gerar imagem
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-preview-image-generation',
      contents: buildPrompt(article.title, article.excerpt),
      config: {
        responseModalities: [Modality.IMAGE],
      },
    })

    const parts = response.candidates?.[0]?.content?.parts ?? []
    const imagePart = parts.find((p: { inlineData?: { data?: string; mimeType?: string } }) => p.inlineData?.data)
    if (!imagePart?.inlineData?.data) {
      return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
    }

    const imageBytes = imagePart.inlineData.data
    const mimeType = imagePart.inlineData.mimeType ?? 'image/png'
    const ext = mimeType === 'image/jpeg' ? 'jpg' : 'png'

    // Upload para Sanity
    const buffer = Buffer.from(imageBytes, 'base64')
    const asset = await sanity.assets.upload('image', buffer, {
      filename: `${article.slug.current}-${Date.now()}.${ext}`,
      contentType: mimeType,
    })

    // Atualizar artigo
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

    return NextResponse.json({
      success: true,
      articleId: article._id,
      imageAssetId: asset._id,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[generate-image]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
