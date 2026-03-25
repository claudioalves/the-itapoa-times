import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'the-itapoa-times',
  title: 'The Itapoá Times',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'o64so9y2',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('The Itapoá Times')
          .items([
            S.listItem().title('Notícias').schemaType('article').child(
              S.documentTypeList('article').title('Notícias')
            ),
            S.divider(),
            S.listItem().title('Categorias').schemaType('category').child(
              S.documentTypeList('category').title('Categorias')
            ),
            S.listItem().title('Autores').schemaType('author').child(
              S.documentTypeList('author').title('Autores')
            ),
            S.divider(),
            S.listItem().title('Banners de Anunciantes').schemaType('localBanner').child(
              S.documentTypeList('localBanner').title('Banners')
            ),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
})
