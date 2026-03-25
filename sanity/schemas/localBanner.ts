import { defineField, defineType } from 'sanity'

export const localBannerSchema = defineType({
  name: 'localBanner',
  title: 'Banner de Anunciante Local',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nome do Anunciante',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Imagem do Banner',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'altText',
      title: 'Texto Alternativo',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'linkUrl',
      title: 'URL de Destino',
      type: 'url',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'placement',
      title: 'Posição',
      type: 'string',
      options: {
        list: [
          { title: 'Sidebar (300×600)', value: 'sidebar' },
          { title: 'Header (728×90)', value: 'header' },
        ],
        layout: 'radio',
      },
      initialValue: 'sidebar',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'active',
      title: 'Ativo',
      type: 'boolean',
      initialValue: true,
      description: 'Desativar para voltar ao AdSense automaticamente',
    }),
  ],
  preview: {
    select: { title: 'title', active: 'active', media: 'image' },
    prepare({ title, active, media }) {
      return {
        title,
        subtitle: active ? '✅ Ativo' : '⏸ Inativo',
        media,
      }
    },
  },
})
