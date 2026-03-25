export interface Category {
  _id: string
  title: string
  slug: { current: string }
  description?: string
}

export interface Author {
  _id: string
  name: string
  slug: { current: string }
  bio?: string
  avatar?: SanityImage
}

export interface SanityImage {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  hotspot?: { x: number; y: number; height: number; width: number }
  alt?: string
}

export interface PortableTextBlock {
  _type: 'block' | 'image'
  _key: string
  style?: string
  children?: Array<{ _type: string; _key: string; text: string; marks?: string[] }>
  markDefs?: Array<{ _key: string; _type: string; href?: string }>
  asset?: SanityImage['asset']
  alt?: string
  caption?: string
}

export interface Article {
  _id: string
  title: string
  slug: { current: string }
  featured: boolean
  category: Category
  author?: Author
  publishedAt: string
  mainImage?: SanityImage & { alt: string }
  excerpt: string
  body: PortableTextBlock[]
  seoTitle?: string
  seoDescription?: string
}

export interface LocalBanner {
  _id: string
  title: string
  image: SanityImage
  altText: string
  linkUrl: string
  placement: 'sidebar' | 'header'
  active: boolean
}
