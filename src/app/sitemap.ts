import type { MetadataRoute } from 'next'
import { getAllArticleSlugs, getAllCategories } from '../../sanity/lib/queries'

const BASE_URL = 'https://itapoatimes.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, categories] = await Promise.all([
    getAllArticleSlugs(),
    getAllCategories(),
  ])

  const articleUrls: MetadataRoute.Sitemap = slugs.map((item) => ({
    url: `${BASE_URL}/${item.category.slug.current}/${item.slug.current}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/${cat.slug.current}`,
    changeFrequency: 'daily',
    priority: 0.6,
  }))

  return [
    {
      url: BASE_URL,
      changeFrequency: 'hourly',
      priority: 1,
    },
    ...categoryUrls,
    ...articleUrls,
  ]
}
