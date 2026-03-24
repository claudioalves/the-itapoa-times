# The Itapoá Times — Project Plan

---

## 1. Overview

**The Itapoá Times** é um portal de notícias local voltado para a cidade de Itapoá, SC (litoral norte catarinense, ~20 mil habitantes, perfil turístico). O município carece de mídia local consolidada; o portal nasce para preencher essa lacuna, oferecendo cobertura jornalística independente para moradores e turistas.

**Modelo de negócio:** receita via Google AdSense (3 slots de display) combinada com banners de anunciantes locais vendidos diretamente, gerenciados sem necessidade de deploy pelo painel do Sanity CMS.

**Operação:** jornalista solo ou pequena redação sem perfil técnico — o CMS deve ser intuitivo e toda publicação/atualização deve refletir no site em segundos via webhook ISR.

**Domínio sugerido:** itapoatimes.com.br

---

## 2. Project Type

**WEB** — Next.js web application (App Router, SSG + ISR)

Agent primário de implementação: **frontend-specialist**

---

## 3. Success Criteria

| ID    | Critério                                                                                       | Como medir                                                           |
|-------|------------------------------------------------------------------------------------------------|----------------------------------------------------------------------|
| SC-01 | Homepage carrega em < 2 s (LCP) em conexão 4G                                                  | Lighthouse / PageSpeed Insights score >= 90 em Performance           |
| SC-02 | Artigo publicado no Sanity aparece no site em <= 30 s após salvar                              | Testar webhook: salvar artigo e verificar URL no browser             |
| SC-03 | Todas as páginas de artigo têm JSON-LD NewsArticle válido                                       | Google Rich Results Test em 3 artigos distintos                      |
| SC-04 | Open Graph correto em homepage, listagem e artigo                                               | opengraph.xyz ou compartilhamento real no WhatsApp/Facebook          |
| SC-05 | Sitemap dinâmico acessível em /sitemap.xml com todos os artigos publicados                     | Acessar URL + validar no Google Search Console                       |
| SC-06 | AdSense renderiza nos 3 slots sem quebrar layout em mobile e desktop                           | Inspeção visual em viewport 375px e 1280px                           |
| SC-07 | Banner de anunciante local trocável via Sanity sem novo deploy                                  | Trocar imagem/URL no CMS e verificar atualização no site             |
| SC-08 | Jornalista consegue publicar artigo completo sem assistência técnica                            | Teste com usuário real no Sanity Studio                              |
| SC-09 | Deploy automático via GitHub → Vercel sem intervenção manual                                   | Push no main e verificar build + URL de produção                     |
| SC-10 | Score de Acessibilidade Lighthouse >= 85                                                        | Lighthouse audit na homepage e em 1 artigo                           |
| SC-11 | `npm run build` conclui sem erros TypeScript                                                   | Terminal local + Vercel build logs                                   |
| SC-12 | 8 categorias iniciais navegáveis com páginas de listagem geradas estaticamente                  | Navegar por cada categoria na URL de produção                        |

---

## 4. Tech Stack

| Tecnologia           | Versão          | Justificativa                                                                                   |
|----------------------|-----------------|-------------------------------------------------------------------------------------------------|
| Next.js              | 15 (App Router) | SSG + ISR nativos, generateMetadata, generateStaticParams, Server Components                    |
| TypeScript           | 5.x             | Tipagem estática para GROQ queries e schemas, reduz bugs em produção                            |
| Tailwind CSS         | 3.x             | Utilitário, sem build extra, responsive utilities nativas, ideal para times pequenos             |
| Sanity CMS           | v3 (free tier)  | Painel intuitivo para não-técnicos, CDN de imagens embutido, GROQ, Portable Text                |
| @sanity/image-url    | latest          | Transformação de imagens via CDN (resize, blur placeholder, WebP automático)                    |
| @portabletext/react  | latest          | Renderização do corpo do artigo (Portable Text → React)                                         |
| next-sanity          | latest          | Cliente GROQ tipado + webhook helpers                                                           |
| next/script          | nativo          | Carregamento assíncrono do script AdSense sem bloquear LCP                                      |
| Vercel               | Hobby tier      | Deploy automático via GitHub, edge network global, suporte nativo a Next.js ISR                 |
| Google AdSense       | —               | Monetização display; 3 slots: homepage grid, artigo inline, sidebar desktop                    |
| Schema.org / JSON-LD | —               | NewsArticle markup para SEO editorial e Google News                                             |

---

## 5. File Structure

```
the-itapoa-times/
├── .env.local                           # SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN,
│                                        # REVALIDATE_SECRET, NEXT_PUBLIC_ADSENSE_ID
├── .env.example                         # Template de variáveis (sem valores reais)
├── next.config.ts                       # images.remotePatterns para CDN Sanity, revalidate defaults
├── tailwind.config.ts
├── tsconfig.json
├── package.json
│
├── sanity/                              # Configuração Sanity Studio (embedded no Next.js)
│   ├── sanity.config.ts                 # Configuração principal do Studio
│   ├── sanity.client.ts                 # createClient com token de leitura (server-side)
│   ├── sanity.image.ts                  # Builder de URLs de imagem via @sanity/image-url
│   ├── schemas/
│   │   ├── index.ts                     # Re-exporta todos os schemas
│   │   ├── article.ts                   # title, slug(auto), category(ref), author(ref),
│   │   │                                # publishedAt, mainImage(hotspot), excerpt(max 200),
│   │   │                                # body(Portable Text), seoTitle, seoDescription, featured
│   │   ├── category.ts                  # title, slug, description, color
│   │   ├── author.ts                    # name, slug, bio, avatar
│   │   └── localBanner.ts              # title, imageUrl, linkUrl, altText, active, placement
│   └── lib/
│       └── queries.ts                   # Todas as GROQ queries tipadas
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # Root layout: <html>, AdSense <Script>, Google Fonts
│   │   ├── page.tsx                     # Homepage: hero featured + grid + sidebar
│   │   ├── not-found.tsx                # Página 404 customizada
│   │   ├── sitemap.ts                   # Sitemap dinâmico (todos artigos + categorias)
│   │   ├── robots.ts                    # robots.txt dinâmico
│   │   │
│   │   ├── [category]/
│   │   │   ├── page.tsx                 # Listagem de artigos por categoria + generateMetadata
│   │   │   └── [slug]/
│   │   │       └── page.tsx             # Artigo completo + JSON-LD + generateMetadata
│   │   │                                # + generateStaticParams
│   │   ├── api/
│   │   │   └── revalidate/
│   │   │       └── route.ts             # Webhook endpoint: HMAC verify + revalidatePath/Tag
│   │   │
│   │   └── studio/
│   │       └── [[...tool]]/
│   │           └── page.tsx             # Sanity Studio embutido em /studio
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx               # Logo + nav categorias desktop + menu hamburguer mobile
│   │   │   └── Footer.tsx               # Links, copyright, créditos
│   │   │
│   │   ├── article/
│   │   │   ├── ArticleCard.tsx          # Card: imagem, categoria, título, excerpt, data
│   │   │   ├── ArticleGrid.tsx          # Grid responsivo + injeção AdSenseSlot após 3º card
│   │   │   ├── ArticleBody.tsx          # Portable Text renderer + injeção ad após 3º parágrafo
│   │   │   └── ArticleHero.tsx          # Destaque principal da homepage (imagem full-width)
│   │   │
│   │   ├── ads/
│   │   │   ├── AdSenseSlot.tsx          # Componente base: data-ad-slot prop, 'use client'
│   │   │   └── LocalBannerAd.tsx        # Banner anunciante local via CMS (imagem + link)
│   │   │
│   │   └── ui/
│   │       ├── Sidebar.tsx              # Wrapper sidebar desktop (lg: only), banner 300x600
│   │       └── CategoryBadge.tsx        # Pill de categoria colorida
│   │
│   └── types/
│       └── index.ts                     # Article, Category, Author, LocalBanner interfaces
│
└── public/
    ├── logo.svg                         # Logo The Itapoá Times
    ├── favicon.ico
    └── og-default.jpg                   # Imagem OG padrão (fallback para páginas sem imagem)
```

---

## 6. Task Breakdown

### FASE 0 — Fundação (P0)

---

**TASK-001**
- **Nome:** Scaffold Next.js 15 + TypeScript + Tailwind CSS
- **Agent:** frontend-specialist
- **Skill:** nextjs-scaffold
- **Priority:** P0
- **Dependencies:** nenhuma
- **INPUT:** Requisitos do projeto (este plano)
- **OUTPUT:** Repositório inicializado com `create-next-app`, TypeScript, Tailwind, estrutura de pastas `src/app/`, `src/components/`, `src/types/`, `.env.example`
- **VERIFY:** `npm run dev` roda sem erros; homepage padrão acessível em localhost:3000; `npm run build` conclui sem erros TypeScript

---

**TASK-002**
- **Nome:** Configurar Sanity Studio v3 embutido no Next.js
- **Agent:** frontend-specialist
- **Skill:** sanity-cms-setup
- **Priority:** P0
- **Dependencies:** TASK-001
- **INPUT:** Credenciais Sanity (project ID, dataset), estrutura de schemas definida neste plano
- **OUTPUT:** `sanity/sanity.config.ts`, `sanity/sanity.client.ts`, `sanity/sanity.image.ts`; schemas criados para `article`, `category`, `author`, `localBanner`; rota `src/app/studio/[[...tool]]/page.tsx` funcional
- **VERIFY:** Acessar `/studio` em localhost, ver painel Sanity; schemas aparecem no sidebar; campo slug gera automaticamente a partir do título

---

**TASK-003**
- **Nome:** Configurar variáveis de ambiente e next.config.ts
- **Agent:** frontend-specialist
- **Skill:** nextjs-config
- **Priority:** P0
- **Dependencies:** TASK-001, TASK-002
- **INPUT:** Lista de env vars: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN`, `REVALIDATE_SECRET`, `NEXT_PUBLIC_ADSENSE_ID`
- **OUTPUT:** `.env.local` preenchido (local), `.env.example` com placeholders; `next.config.ts` com `images.remotePatterns` para `cdn.sanity.io`
- **VERIFY:** `process.env.SANITY_PROJECT_ID` acessível em Server Component; next/image carrega imagem do CDN Sanity sem erro 400; build não vaza secrets no bundle client

---

**TASK-004**
- **Nome:** Popular CMS com dados iniciais (categorias, autores, artigos de teste)
- **Agent:** frontend-specialist
- **Skill:** sanity-seed-data
- **Priority:** P0
- **Dependencies:** TASK-002, TASK-003
- **INPUT:** 8 categorias: Cidade, Política, Porto, Turismo, Segurança, Meio Ambiente, Esporte, Serviços; 1 autor; mínimo 6 artigos de teste (pelo menos 1 `featured: true`, distribuídos em 3+ categorias, cada um com 5+ parágrafos de corpo)
- **OUTPUT:** Dados inseridos via Sanity Studio; artigos com corpo Portable Text real, mainImage com hotspot, excerpt, seoTitle, seoDescription preenchidos
- **VERIFY:** GROQ query `*[_type == "article"] | order(publishedAt desc)` retorna >= 6 resultados no Vision do Sanity; `*[_type == "category"]` retorna 8

---

### FASE 1 — Core Editorial (P1)

---

**TASK-101**
- **Nome:** Implementar GROQ queries tipadas e tipos TypeScript
- **Agent:** frontend-specialist
- **Skill:** sanity-groq-queries
- **Priority:** P1
- **Dependencies:** TASK-002, TASK-004
- **INPUT:** Schemas Sanity criados na TASK-002; dados seed da TASK-004
- **OUTPUT:**
  - `src/types/index.ts`: interfaces `Article`, `Category`, `Author`, `LocalBanner`, `PortableTextBlock`
  - `sanity/lib/queries.ts`: funções `getFeaturedArticles()`, `getLatestArticles(limit)`, `getArticleBySlug(category, slug)`, `getArticlesByCategory(categorySlug)`, `getAllCategories()`, `getLocalBanner(placement)`, `getAllArticleSlugs()`
- **VERIFY:** Cada query retorna dados tipados sem `any`; TypeScript não emite erros (`tsc --noEmit`); `getArticleBySlug` retorna artigo com `category` e `author` populados (não apenas referências)

---

**TASK-102**
- **Nome:** Implementar Header (logo + nav + menu mobile)
- **Agent:** frontend-specialist
- **Skill:** nextjs-components
- **Priority:** P1
- **Dependencies:** TASK-101
- **INPUT:** Lista de categorias via `getAllCategories()`; logo text "The Itapoá Times"
- **OUTPUT:** `src/components/layout/Header.tsx` — nav desktop com links `/{category.slug}`, hamburguer mobile com menu drawer animado, logo linkado para `/`; usa `'use client'` apenas no sub-componente de toggle mobile
- **VERIFY:** Renderiza em 375px e 1280px sem overflow; links de categoria funcionam; menu mobile abre e fecha

---

**TASK-103**
- **Nome:** Implementar Footer
- **Agent:** frontend-specialist
- **Skill:** nextjs-components
- **Priority:** P1
- **Dependencies:** TASK-001
- **INPUT:** Nome do portal, ano atual, links básicos (categorias, contato, anuncie)
- **OUTPUT:** `src/components/layout/Footer.tsx` — copyright, créditos editoriais, links de navegação
- **VERIFY:** Renderiza sem erros; aparece ao final de todas as páginas; sem layout shift

---

**TASK-104**
- **Nome:** Implementar ArticleCard e ArticleGrid
- **Agent:** frontend-specialist
- **Skill:** nextjs-components
- **Priority:** P1
- **Dependencies:** TASK-101
- **INPUT:** Tipo `Article`; layout de grid: 3 colunas desktop, 2 tablet, 1 mobile
- **OUTPUT:**
  - `ArticleCard.tsx`: imagem (next/image + blur placeholder via Sanity CDN), CategoryBadge, título, excerpt truncado, data formatada em pt-BR, link para `/{category.slug}/{article.slug}`
  - `ArticleGrid.tsx`: grid responsivo; aceita prop `injectAdAfter?: number` para inserir `<AdSenseSlot>` após N-ésimo card
- **VERIFY:** Grid renderiza 6 cards; AdSenseSlot aparece após 3º card quando `injectAdAfter={3}`; sem CLS; acessível (alt text, semântica HTML)

---

**TASK-105**
- **Nome:** Implementar Homepage
- **Agent:** frontend-specialist
- **Skill:** nextjs-page
- **Priority:** P1
- **Dependencies:** TASK-102, TASK-103, TASK-104
- **INPUT:** Queries `getFeaturedArticles()` e `getLatestArticles()`; componentes Header, Footer, ArticleGrid, Sidebar, ArticleHero
- **OUTPUT:** `src/app/page.tsx` — Server Component com `revalidate = 60`; ArticleHero para artigo featured; ArticleGrid para últimas notícias; Sidebar com LocalBannerAd visível apenas em `lg:`
- **VERIFY:** Homepage renderiza com dados reais do CMS; hero exibe artigo featured; sidebar invisível em mobile; sem `use client` no page.tsx

---

**TASK-106**
- **Nome:** Implementar ArticleBody (Portable Text + ad inline)
- **Agent:** frontend-specialist
- **Skill:** nextjs-components
- **Priority:** P1
- **Dependencies:** TASK-101
- **INPUT:** Campo `body` (Portable Text) do schema `article`; regra: injetar `<AdSenseSlot>` após 3º bloco de parágrafo
- **OUTPUT:** `src/components/article/ArticleBody.tsx` — usa `@portabletext/react`; custom components para imagens inline (next/image), negrito, itálico, links externos (`rel="noopener noreferrer"`); injeta ad no índice 3; guard clause para artigos com menos de 3 parágrafos
- **VERIFY:** Artigo com 6 parágrafos exibe ad após o 3º; artigo com 2 parágrafos não exibe ad; imagens inline renderizam com next/image

---

**TASK-107**
- **Nome:** Implementar página de artigo `/[category]/[slug]`
- **Agent:** frontend-specialist
- **Skill:** nextjs-dynamic-routes
- **Priority:** P1
- **Dependencies:** TASK-105, TASK-106
- **INPUT:** `getArticleBySlug()`, `getAllArticleSlugs()` para `generateStaticParams`; tipo `Article`
- **OUTPUT:** `src/app/[category]/[slug]/page.tsx` — `generateStaticParams` + `generateMetadata` (title, description, og:title, og:description, og:image via Sanity CDN 1200x630, og:type "article", twitter:card "summary_large_image"); ArticleHero, ArticleBody, autor, data; `revalidate = 30`; retorna `notFound()` para slugs inexistentes
- **VERIFY:** URL `/{category.slug}/{article.slug}` carrega artigo correto; `<title>` e `og:image` presentes no `<head>`; 404 para URL inválida

---

**TASK-108**
- **Nome:** Implementar página de listagem por categoria `/[category]`
- **Agent:** frontend-specialist
- **Skill:** nextjs-dynamic-routes
- **Priority:** P1
- **Dependencies:** TASK-004, TASK-104
- **INPUT:** `getArticlesByCategory()`, `getAllCategories()` para `generateStaticParams`
- **OUTPUT:** `src/app/[category]/page.tsx` — `generateStaticParams` para 8 categorias; título e descrição da categoria; ArticleGrid com todos artigos; `generateMetadata` com nome da categoria
- **VERIFY:** `/turismo` lista apenas artigos da categoria Turismo; título da página inclui "Turismo — The Itapoá Times"; 404 para categoria inexistente

---

### FASE 2 — Monetização (P1/P2)

---

**TASK-201**
- **Nome:** Integrar Google AdSense — script global e componente base
- **Agent:** frontend-specialist
- **Skill:** adsense-integration
- **Priority:** P1
- **Dependencies:** TASK-001
- **INPUT:** `NEXT_PUBLIC_ADSENSE_ID` (ca-pub-XXXXXXXX)
- **OUTPUT:**
  - `src/app/layout.tsx` com `<Script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" async strategy="afterInteractive" data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID} />`
  - `src/components/ads/AdSenseSlot.tsx` — `'use client'`; aceita props `slot`, `format`, `className`; chama `(adsbygoogle = window.adsbygoogle || []).push({})` em `useEffect`
- **VERIFY:** Script AdSense presente no HTML final; `<ins class="adsbygoogle">` renderiza com atributos corretos; sem erros de console em desenvolvimento

---

**TASK-202**
- **Nome:** Slot 1 AdSense — após 3º card no grid da homepage
- **Agent:** frontend-specialist
- **Skill:** adsense-integration
- **Priority:** P1
- **Dependencies:** TASK-201, TASK-105
- **INPUT:** `ArticleGrid` com prop `injectAdAfter={3}`; slot ID do AdSense para homepage
- **OUTPUT:** `<AdSenseSlot>` renderizado entre o 3º e 4º card via `ArticleGrid`; formato `fluid` ou `rectangle`
- **VERIFY:** Inspeção DOM confirma `<ins class="adsbygoogle">` entre cards 3 e 4; layout não quebra em mobile (375px) nem desktop (1280px)

---

**TASK-203**
- **Nome:** Slot 2 AdSense — após 3º parágrafo no corpo do artigo
- **Agent:** frontend-specialist
- **Skill:** adsense-integration
- **Priority:** P1
- **Dependencies:** TASK-201, TASK-106
- **INPUT:** `ArticleBody` com lógica de injeção no índice 3; slot ID para artigo
- **OUTPUT:** `<AdSenseSlot>` injetado após bloco de índice 3 no Portable Text; formato `in-article`
- **VERIFY:** Artigo com 6+ parágrafos mostra ad após parágrafo 3; artigo com 2 parágrafos não mostra ad (guard clause ativa)

---

**TASK-204**
- **Nome:** Slot 3 AdSense — sidebar vertical 300x600 (desktop only)
- **Agent:** frontend-specialist
- **Skill:** adsense-integration
- **Priority:** P2
- **Dependencies:** TASK-201, TASK-105
- **INPUT:** `Sidebar` componente (`lg:` breakpoint); slot ID para sidebar
- **OUTPUT:** `src/components/ui/Sidebar.tsx` com `<AdSenseSlot>` 300x600 visível apenas em `lg:flex`, `hidden` em mobile
- **VERIFY:** Sidebar ad visível em 1280px; `display: none` em 375px; não conflita com LocalBannerAd

---

**TASK-205**
- **Nome:** Banner de anunciante local via Sanity CMS
- **Agent:** frontend-specialist
- **Skill:** sanity-cms-setup
- **Priority:** P2
- **Dependencies:** TASK-101, TASK-204
- **INPUT:** Schema `localBanner` (imageUrl, linkUrl, altText, active, placement); query `getLocalBanner('sidebar')`
- **OUTPUT:** `src/components/ads/LocalBannerAd.tsx` — Server Component; busca banner ativo do CMS; renderiza next/image linkado; fallback para `<AdSenseSlot>` quando `active: false`
- **VERIFY:** Trocar imagem do banner no Sanity Studio → ISR atualiza site sem novo deploy; banner desativado mostra fallback AdSense

---

### FASE 3 — SEO e Performance (P2/P3)

---

**TASK-301**
- **Nome:** JSON-LD NewsArticle em páginas de artigo
- **Agent:** frontend-specialist
- **Skill:** seo-schema
- **Priority:** P2
- **Dependencies:** TASK-107
- **INPUT:** Campos do artigo: title, publishedAt, author, mainImage, excerpt, URL canônica; publisher: "The Itapoá Times"
- **OUTPUT:** `<script type="application/ld+json">` injetado no `<head>` via `generateMetadata` em `src/app/[category]/[slug]/page.tsx` com schema `NewsArticle` completo: `headline`, `image`, `author` (`@type: Person`), `publisher` (`@type: Organization` com logo), `datePublished`, `dateModified`, `description`, `url`
- **VERIFY:** Google Rich Results Test valida NewsArticle sem erros críticos em URL de artigo de teste

---

**TASK-302**
- **Nome:** Open Graph e Twitter Card em todas as páginas
- **Agent:** frontend-specialist
- **Skill:** seo-metatags
- **Priority:** P2
- **Dependencies:** TASK-107, TASK-108
- **INPUT:** `generateMetadata` em homepage, listagem e artigo; imagem OG via `@sanity/image-url` (1200x630)
- **OUTPUT:** Tags `og:title`, `og:description`, `og:image`, `og:type`, `twitter:card: "summary_large_image"`, `twitter:image` em todas as páginas; template de título `%s | The Itapoá Times` em layout.tsx; fallback para `og-default.jpg` quando artigo sem imagem
- **VERIFY:** Compartilhar URL de artigo no WhatsApp exibe preview com imagem, título e descrição corretos; `og:image` tem dimensões >= 1200x630

---

**TASK-303**
- **Nome:** Sitemap dinâmico e robots.ts
- **Agent:** frontend-specialist
- **Skill:** nextjs-seo
- **Priority:** P2
- **Dependencies:** TASK-101
- **INPUT:** `getAllArticleSlugs()` + `getAllCategories()`; URL base `https://itapoatimes.com.br`
- **OUTPUT:**
  - `src/app/sitemap.ts` — exporta array `MetadataRoute.Sitemap` com homepage, todas as categorias, todos os artigos; `lastModified = publishedAt`; `changeFrequency: 'daily'` para homepage, `'weekly'` para artigos
  - `src/app/robots.ts` — `Allow: /`, `Disallow: /studio`, `Disallow: /api`, `Sitemap: https://itapoatimes.com.br/sitemap.xml`
- **VERIFY:** `/sitemap.xml` acessível e contém URLs dos 6+ artigos de seed; `/robots.txt` bloqueia `/studio` e `/api`; submissível ao Google Search Console

---

**TASK-304**
- **Nome:** Webhook Sanity → Vercel para ISR on-demand
- **Agent:** frontend-specialist
- **Skill:** nextjs-api-routes
- **Priority:** P3
- **Dependencies:** TASK-003, TASK-107
- **INPUT:** `REVALIDATE_SECRET`; Sanity webhook configurado para disparar em `create`/`update`/`delete` de `article`
- **OUTPUT:** `src/app/api/revalidate/route.ts` — POST handler: verifica assinatura HMAC-SHA256 do Sanity via `crypto.timingSafeEqual`; em caso de sucesso chama `revalidatePath('/')`, `revalidatePath('/[category]', 'layout')`, `revalidateTag('articles')`; retorna `200 OK` ou `401 Unauthorized`
- **VERIFY:** Publicar artigo no Sanity → site atualiza em <= 30s; requisição com secret errado retorna 401; logs Vercel Functions mostram execução bem-sucedida

---

**TASK-305**
- **Nome:** Otimização de imagens (next/image, LCP, blur placeholder)
- **Agent:** frontend-specialist
- **Skill:** nextjs-performance
- **Priority:** P3
- **Dependencies:** TASK-104, TASK-107
- **INPUT:** Todas as imagens via Sanity CDN; LCP = imagem hero da homepage e do artigo
- **OUTPUT:** Todas as `<Image>` com prop `sizes` correto por breakpoint (ex: `"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`); hero images com `priority` prop; `blurDataURL` gerado via Sanity CDN com `?w=20&blur=50&auto=format`; formato WebP automático via CDN
- **VERIFY:** Lighthouse Performance >= 90 na homepage; LCP < 2.5s no PageSpeed Insights; zero imagens sem `alt`

---

### FASE X — Verificação e Deploy (PX)

---

**TASK-X01**
- **Nome:** Deploy Vercel — GitHub CI/CD + domínio customizado + HTTPS
- **Agent:** frontend-specialist
- **Skill:** vercel-deploy
- **Priority:** PX
- **Dependencies:** TASK-301, TASK-302, TASK-303, TASK-304, TASK-305
- **INPUT:** Repositório GitHub; variáveis de ambiente de produção; domínio itapoatimes.com.br
- **OUTPUT:** Projeto criado na Vercel (Hobby tier); variáveis de ambiente configuradas no dashboard; domínio customizado com registros DNS A/CNAME apontando para Vercel; HTTPS automático via Let's Encrypt; deploy automático ativo em push para `main`
- **VERIFY:** `https://itapoatimes.com.br` carrega sem erros; push de commit aciona build automático; cadeado HTTPS válido no browser

---

**TASK-X02**
- **Nome:** Checklist final de qualidade e encerramento
- **Agent:** frontend-specialist
- **Skill:** qa-verification
- **Priority:** PX
- **Dependencies:** TASK-X01
- **INPUT:** Site em produção; checklist VF-01 a VF-20 (seção 8 deste plano)
- **OUTPUT:** Todos os itens do checklist verificados em produção; issues críticos corrigidos; portal liberado para operação
- **VERIFY:** Ver seção 8 — Verification Checklist; todos os itens marcados PASSED

---

## 7. Dependency Graph

```
TASK-001 (Scaffold Next.js + Tailwind + TS)
    │
    ├──► TASK-002 (Sanity Studio + Schemas)
    │        │
    │        └──► TASK-003 (Env + next.config.ts)
    │                   │
    │                   └──► TASK-004 (Seed Data: 8 categorias + 6 artigos)
    │                              │
    │                              └──► TASK-101 (GROQ Queries + Types TS)
    │                                        │
    │                           ┌────────────┼────────────┬─────────────┐
    │                           │            │            │             │
    │                        TASK-102     TASK-104    TASK-108      TASK-205
    │                        (Header)  (ArticleCard   (Listagem     (Banner
    │                           │       + Grid)       Categoria)     Local)
    │                        TASK-103      │                │
    │                        (Footer)   TASK-105        TASK-204
    │                           │       (Homepage)      (Sidebar)
    │                           └────┬───────┘
    │                                │
    │                             TASK-106 (ArticleBody + ad inline)
    │                                │
    │                             TASK-107 (Página Artigo /[category]/[slug])
    │                                │
    │                    ┌───────────┼────────────┐
    │                    │           │            │
    │                 TASK-301    TASK-302     TASK-303
    │                 (JSON-LD)   (OG+TC)   (Sitemap+robots)
    │
    ├──► TASK-201 (AdSense Script + Componente Base)
    │        │
    │        ├──► TASK-202 (Slot 1 — Grid Homepage)
    │        ├──► TASK-203 (Slot 2 — Artigo Inline)
    │        └──► TASK-204 (Slot 3 — Sidebar 300x600)
    │
    └──► TASK-304 (Webhook ISR on-demand)  ──┐
                                              │
         TASK-305 (Image Optimization) ───────┤
                                              │
                                          TASK-X01 (Deploy Vercel)
                                              │
                                          TASK-X02 (Checklist Final)
```

---

## 8. Phase X: Verification Checklist

Todos os itens abaixo DEVEM estar marcados como PASSED antes de declarar o projeto pronto para operação.

| ID    | Item                                                                                          | Método de Verificação                                                      | Status  |
|-------|-----------------------------------------------------------------------------------------------|----------------------------------------------------------------------------|---------|
| VF-01 | `npm run build` conclui sem erros TypeScript                                                   | Terminal local + Vercel build logs                                         | PENDING |
| VF-02 | `tsc --noEmit` sem erros ou warnings                                                           | Terminal local                                                              | PENDING |
| VF-03 | Lighthouse Performance >= 90 na homepage                                                        | Chrome DevTools modo incógnito, device Mobile                              | PENDING |
| VF-04 | LCP < 2.5s na página de artigo                                                                  | PageSpeed Insights → URL de artigo com imagem hero                         | PENDING |
| VF-05 | Lighthouse SEO >= 90 na homepage e em 1 artigo                                                  | Chrome DevTools / PageSpeed Insights                                       | PENDING |
| VF-06 | Lighthouse Accessibility >= 85 na homepage                                                      | Chrome DevTools / PageSpeed Insights                                       | PENDING |
| VF-07 | JSON-LD NewsArticle válido em 3 artigos distintos                                               | search.google.com/test/rich-results para cada URL                          | PENDING |
| VF-08 | Open Graph correto: imagem 1200x630, título e descrição presentes                               | opengraph.xyz ou compartilhamento real no Facebook/WhatsApp                | PENDING |
| VF-09 | `/sitemap.xml` acessível e contém todos os artigos publicados                                   | Abrir URL + contar entradas; submeter ao Google Search Console             | PENDING |
| VF-10 | `/robots.txt` bloqueia `/studio` e `/api`, permite `/`                                         | Abrir URL; verificar linhas Disallow                                       | PENDING |
| VF-11 | Webhook ISR: artigo publicado aparece no site em <= 30 s                                        | Publicar artigo no Sanity; aguardar; recarregar homepage                   | PENDING |
| VF-12 | Webhook com secret inválido retorna 401                                                          | `curl -X POST /api/revalidate -H "sanity-webhook-signature: wrong"` → 401 | PENDING |
| VF-13 | AdSense slot 1 renderiza entre cards 3 e 4 sem quebrar grid                                     | Inspeção DOM + visual em 375px e 1280px                                    | PENDING |
| VF-14 | AdSense slot 2 renderiza após parágrafo 3 em artigo com 6+ parágrafos                           | Inspeção DOM no corpo do artigo                                            | PENDING |
| VF-15 | AdSense slot 3 (sidebar) visível apenas em desktop (>= 1024px)                                  | Redimensionar janela: visível em 1280px, oculto em 768px                   | PENDING |
| VF-16 | Banner local trocável sem deploy: trocar imagem no Sanity → reflete em <= 60s                   | Editar `localBanner` no Studio; aguardar ISR; verificar visual             | PENDING |
| VF-17 | Todas as URLs de artigo seguem o padrão `/{category.slug}/{article.slug}`                       | Verificar 3 artigos de categorias distintas                                | PENDING |
| VF-18 | Layout responsivo sem scroll horizontal em 375px                                                 | Chrome DevTools, viewport iPhone SE; zero overflow-x                       | PENDING |
| VF-19 | Menu mobile abre e fecha; links de categoria navegam corretamente                                | Teste manual em dispositivo real ou emulado                                | PENDING |
| VF-20 | HTTPS ativo, certificado válido, CI/CD automático em push para `main`                           | Cadeado verde no browser; commit de teste → build na Vercel                | PENDING |

---

*Plano gerado em: 2026-03-24*
*Projeto: The Itapoá Times — Portal de Notícias*
*Stack: Next.js 15 + Sanity CMS v3 + Vercel + Tailwind CSS + TypeScript*
