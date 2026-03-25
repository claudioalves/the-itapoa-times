import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { urlFor } from '../../../sanity/sanity.image'
import type { PortableTextBlock } from '@/types'

interface ArticleBodyProps {
  body: PortableTextBlock[]
}

const components = {
  types: {
    image: ({ value }: { value: { asset: { _ref: string }; alt?: string; caption?: string } }) => (
      <figure className="my-8 -mx-0">
        <div className="relative aspect-video w-full overflow-hidden bg-border">
          <Image
            src={urlFor(value).width(900).height(506).fit('crop').url()}
            alt={value.alt ?? ''}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
        {value.caption && (
          <figcaption className="text-xs text-muted mt-2 text-center italic">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-base text-ink leading-[1.8] mb-5">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-serif text-2xl font-bold text-ink mt-10 mb-4 leading-tight tracking-tight">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-serif text-xl font-bold text-ink mt-8 mb-3 leading-tight tracking-tight">{children}</h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-red pl-5 my-6 font-serif text-lg italic text-ink/80">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-ink">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    link: ({ children, value }: { children?: React.ReactNode; value?: { href: string } }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-red underline underline-offset-2 hover:text-ink transition-colors duration-150"
      >
        {children}
      </a>
    ),
  },
}

export default function ArticleBody({ body }: ArticleBodyProps) {
  const paragraphBlocks = body.filter((b) => b._type === 'block' && b.style === 'normal')

  if (paragraphBlocks.length <= 3) {
    return (
      <div className="prose-custom">
        <PortableText value={body} components={components} />
      </div>
    )
  }

  // Split: first 3 paragraphs, then ad, then rest
  const adIndex = body.findIndex((b, i) => {
    const normalBlocks = body.slice(0, i + 1).filter((bb) => bb._type === 'block' && bb.style === 'normal')
    return normalBlocks.length === 3
  })

  const firstPart = body.slice(0, adIndex + 1)
  const secondPart = body.slice(adIndex + 1)

  return (
    <div className="prose-custom">
      <PortableText value={firstPart} components={components} />

      {/* Ad slot placeholder — substituído pelo AdSense na FASE 2 */}
      <div className="my-8 border border-dashed border-border bg-[#F5F4F0] h-24 flex items-center justify-center text-xs text-muted uppercase tracking-widest">
        Anúncio
      </div>

      <PortableText value={secondPart} components={components} />
    </div>
  )
}
