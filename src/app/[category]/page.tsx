import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllCategories, getArticlesByCategory } from '../../../sanity/lib/queries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ArticleGrid from '@/components/article/ArticleGrid'

export const revalidate = 60

interface Params {
  category: string
}

export async function generateStaticParams(): Promise<Params[]> {
  const categories = await getAllCategories()
  return categories.map((cat) => ({ category: cat.slug.current }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { category: categorySlug } = await params
  const categories = await getAllCategories()
  const category = categories.find((c) => c.slug.current === categorySlug)
  if (!category) return {}

  return {
    title: category.title,
    description: category.description ?? `Notícias de ${category.title} em Itapoá, SC`,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { category: categorySlug } = await params
  const [categories, articles] = await Promise.all([
    getAllCategories(),
    getArticlesByCategory(categorySlug),
  ])

  const category = categories.find((c) => c.slug.current === categorySlug)
  if (!category) notFound()

  return (
    <>
      <Header categories={categories} />

      <main>
        {/* Category header */}
        <div className="px-6 md:px-12 pt-10 pb-0 border-b border-border">
          <div className="flex items-center gap-4 pb-6">
            <div className="w-1 h-8 bg-red flex-shrink-0" />
            <div>
              <h1 className="font-serif text-3xl font-black text-ink tracking-tight leading-none">
                {category.title}
              </h1>
              {category.description && (
                <p className="text-sm text-muted mt-1">{category.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Articles */}
        {articles.length > 0 ? (
          <ArticleGrid articles={articles} />
        ) : (
          <div className="px-6 md:px-12 py-20 text-center text-muted">
            <p className="font-serif text-xl">Nenhuma notícia encontrada nesta categoria.</p>
          </div>
        )}
      </main>

      <Footer categories={categories} />
    </>
  )
}
