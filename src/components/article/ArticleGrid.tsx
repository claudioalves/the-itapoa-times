import ArticleCard from './ArticleCard'
import type { Article } from '@/types'

interface ArticleGridProps {
  articles: Article[]
  injectAdAfter?: number
  adSlot?: React.ReactNode
}

export default function ArticleGrid({ articles, injectAdAfter, adSlot }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
      {articles.map((article, index) => (
        <>
          <div
            key={article._id}
            className="p-6 border-b border-border md:border-r md:last:border-r-0 lg:[&:nth-child(3n)]:border-r-0"
          >
            <ArticleCard article={article} />
          </div>

          {/* Ad injection after N-th card */}
          {injectAdAfter && adSlot && index === injectAdAfter - 1 && (
            <div
              key={`ad-${index}`}
              className="col-span-1 md:col-span-2 lg:col-span-3 p-6 border-b border-border flex items-center justify-center bg-[#F5F4F0]"
            >
              {adSlot}
            </div>
          )}
        </>
      ))}
    </div>
  )
}
