/**
 * Publica artigos como RASCUNHO no Sanity
 * O editor revisa e publica manualmente no Studio
 */

import { createClient } from '@sanity/client'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'o64so9y2',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

let cachedRefs = null

async function getRefs() {
  if (cachedRefs) return cachedRefs

  const [author, categories] = await Promise.all([
    sanity.fetch(`*[_type == "author" && slug.current == "redacao"][0] { _id }`),
    sanity.fetch(`*[_type == "category"] { _id, slug }`),
  ])

  cachedRefs = {
    authorId: author?._id ?? null,
    categories: Object.fromEntries(categories.map((c) => [c.slug.current, c._id])),
  }

  return cachedRefs
}

export async function publishDraft(article, imageAssetId) {
  const { authorId, categories } = await getRefs()

  const categoryId = categories[article.category]
  if (!categoryId) throw new Error(`Categoria não encontrada: ${article.category}`)

  // Prefixo "drafts." = rascunho no Sanity Studio
  const draftId = `drafts.agent-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  const doc = {
    _id: draftId,
    _type: 'article',
    title: article.title,
    slug: { _type: 'slug', current: article.slug },
    featured: false,
    publishedAt: new Date().toISOString(),
    excerpt: article.excerpt,
    body: article.body,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    category: { _type: 'reference', _ref: categoryId },
    ...(authorId && { author: { _type: 'reference', _ref: authorId } }),
    ...(imageAssetId && {
      mainImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: imageAssetId },
        alt: article.title,
      },
    }),
  }

  await sanity.createOrReplace(doc)
  return draftId
}
