import { getAllCategories, getFeaturedArticle, getLatestArticles } from '../../../sanity/lib/queries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ArticleHero from '@/components/article/ArticleHero'
import ArticleGrid from '@/components/article/ArticleGrid'

export const revalidate = 60

export default async function NewsPage() {
  const [categories, featured, latest] = await Promise.all([
    getAllCategories(),
    getFeaturedArticle(),
    getLatestArticles(6),
  ])

  const nonFeatured = latest.filter((a) => a._id !== featured?._id)

  return (
    <>
      <Header categories={categories} />

      <main>
        {/* Hero */}
        {featured && <ArticleHero article={featured} />}

        {/* Latest news */}
        <section>
          <div className="flex items-center gap-4 px-6 md:px-12 pt-8 pb-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              Últimas Notícias
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <ArticleGrid articles={nonFeatured} />
        </section>
      </main>

      <Footer categories={categories} />
    </>
  )
}
