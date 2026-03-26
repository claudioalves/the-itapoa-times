import { client } from '../sanity.client'
import type { Article, Category, LocalBanner } from '@/types'

// Exclui rascunhos do agente (IDs começando com "drafts.")
const PUBLISHED = `!(_id in path("drafts.**"))`

const articleFields = `
  _id,
  title,
  slug,
  featured,
  publishedAt,
  excerpt,
  seoTitle,
  seoDescription,
  mainImage { ..., alt },
  category->{ _id, title, slug },
  author->{ _id, name, slug }
`

export async function getFeaturedArticle(): Promise<Article | null> {
  return client.fetch(
    `*[_type == "article" && featured == true && ${PUBLISHED}] | order(publishedAt desc) [0] { ${articleFields} }`,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getLatestArticles(limit = 6): Promise<Article[]> {
  return client.fetch(
    `*[_type == "article" && ${PUBLISHED}] | order(publishedAt desc) [0...$limit] { ${articleFields} }`,
    { limit },
    { next: { revalidate: 60 } }
  )
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return client.fetch(
    `*[_type == "article" && slug.current == $slug && ${PUBLISHED}][0] {
      ${articleFields},
      body
    }`,
    { slug },
    { next: { revalidate: 30 } }
  )
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  return client.fetch(
    `*[_type == "article" && category->slug.current == $categorySlug && ${PUBLISHED}] | order(publishedAt desc) { ${articleFields} }`,
    { categorySlug },
    { next: { revalidate: 60 } }
  )
}

export async function getAllCategories(): Promise<Category[]> {
  const all = await client.fetch<Category[]>(
    `*[_type == "category"] | order(title asc) { _id, title, slug, description }`,
    {},
    { next: { revalidate: 3600 } }
  )
  // Deduplicar por slug caso o seed tenha rodado mais de uma vez
  const seen = new Set<string>()
  return all.filter((cat) => {
    if (seen.has(cat.slug.current)) return false
    seen.add(cat.slug.current)
    return true
  })
}

export async function getAllArticleSlugs(): Promise<Array<{ slug: { current: string }; category: { slug: { current: string } } }>> {
  return client.fetch(
    `*[_type == "article" && ${PUBLISHED}] { slug, category->{ slug } }`,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getLocalBanner(placement: string): Promise<LocalBanner | null> {
  return client.fetch(
    `*[_type == "localBanner" && placement == $placement && active == true][0]`,
    { placement },
    { next: { revalidate: 60 } }
  )
}
