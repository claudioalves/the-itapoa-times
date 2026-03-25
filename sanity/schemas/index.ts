import { articleSchema } from './article'
import { authorSchema } from './author'
import { categorySchema } from './category'
import { localBannerSchema } from './localBanner'

export const schemaTypes = [
  articleSchema,
  categorySchema,
  authorSchema,
  localBannerSchema,
]
