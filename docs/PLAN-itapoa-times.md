# PLAN — The Itapoá Times

> Portal de notícias digital para Itapoá, SC.
> Stack: Next.js 15 + Sanity CMS v3 + Vercel + Tailwind CSS + TypeScript

---

## 1. Overview

**O que é:**
The Itapoá Times é um portal de notícias digital voltado para Itapoá, SC — município litorâneo com ~20 mil habitantes no litoral norte catarinense, com perfil turístico e sem mídia local consolidada. O portal cobre as principais categorias de interesse local: Cidade, Política, Porto, Turismo, Segurança, Meio Ambiente, Esporte e Serviços.

**Por que existe:**
Há um vácuo de informação jornalística organizada e confiável na cidade. O portal preenche essa lacuna com cobertura local qualificada, SEO forte para capturar tráfego orgânico regional e nacional, e uma operação leve o suficiente para ser gerenciada por um jornalista solo ou uma pequena redação sem perfil técnico.

**Modelo de negócio:**
- Receita primária: Google AdSense (3 slots estratégicos — grid da homepage, corpo do artigo, sidebar desktop)
- Receita secundária: banners de anunciantes locais gerenciados diretamente pelo painel Sanity, sem necessidade de deploy

**Quem opera:**
Jornalista solo ou redação pequena. Todo o fluxo editorial ocorre no Sanity Studio — interface intuitiva, sem necessidade de acesso ao código.

**Domínio sugerido:** `itapoatimes.com.br`

---

## 2. Project Type

**WEB** — Next.js web application (App Router, SSG + ISR on-demand via webhooks Sanity).

**Agent primário de implementação:** `frontend-specialist`

Justificativa: trata-se de um projeto web público com foco em UI, performance, SEO e renderização híbrida. O `frontend-specialist` é o agente correto para projetos WEB; `mobile-developer` não se aplica aqui.

---

## 3. Success Criteria

| ID    | Critério mensurável                                                                 | Método de verificação                                                     |
|-------|-------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| SC-01 | LCP < 2s medido pelo Lighthouse (Performance score >= 90)                           | `lighthouse http://localhost:3000 --only-categories=performance`          |
| SC-02 | Artigo publicado no Sanity aparece no portal em <= 30 segundos via webhook ISR      | Publicar artigo no Studio, medir tempo até a página retornar novo conteúdo|
| SC-03 | JSON-LD Schema.org `NewsArticle` válido em todas as páginas de artigo               | Google Rich Results Test + validação manual do HTML renderizado           |
| SC-04 | Tags Open Graph e Twitter Card corretas em todas as rotas públicas                  | `opengraph.xyz` ou `metatags.io` + inspeção do `<head>` renderizado       |
| SC-05 | Sitemap dinâmico acessível em `/sitemap.xml` e listando todos os artigos publicados | `curl https://itapoatimes.com.br/sitemap.xml` + validação XML             |
| SC-06 | AdSense nos 3 slots renderizados sem quebrar layout em 375px, 768px e 1280px        | Inspeção visual + DevTools responsive mode nos 3 breakpoints              |
| SC-07 | Banner local trocável via Sanity sem necessidade de novo deploy                     | Trocar imagem/URL no Studio, aguardar ISR <= 30s, verificar no portal     |
| SC-08 | `npm run build` conclui sem erros TypeScript (`tsc --noEmit` clean)                 | Rodar `npm run build` e `npx tsc --noEmit` no CI                         |
| SC-09 | Robots.txt acessível em `/robots.txt` com diretivas corretas                        | `curl https://itapoatimes.com.br/robots.txt`                              |
| SC-10 | Todas as páginas retornam HTTP 200; 404 personalizado para rotas inexistentes        | Smoke test com lista de URLs + teste de rota inexistente                  |
| SC-11 | Score Lighthouse Accessibility >= 90                                                | `lighthouse --only-categories=accessibility`                              |
| SC-12 | CI/CD Vercel dispara build automaticamente a cada push na branch `main`             | Fazer push e verificar dashboard Vercel                                   |

---

## 4. Tech Stack

| Tecnologia              | Versão        | Justificativa                                                                                      |
|-------------------------|---------------|----------------------------------------------------------------------------------------------------|
| Next.js                 | 15 (App Router) | SSG + ISR on-demand, Server Components nativos, otimização de imagem built-in, routing file-based |
| TypeScript              | 5.x           | Tipagem estrita, autocomplete no editor, previne bugs em schemas e queries                         |
| Tailwind CSS            | 3.x           | Utility-first, bundle mínimo via PurgeCSS, responsivo por convenção, sem CSS customizado complexo  |
| Sanity CMS              | v3 (Studio v3) | Painel intuitivo para não-técnicos, GROQ poderoso, CDN de imagens com hotspot, tier gratuito       |
| @sanity/image-url       | latest        | Geração de URLs otimizadas para imagens Sanity com crop/hotspot                                    |
| @portabletext/react     | latest        | Renderização do campo `body` (Portable Text) em React com customização de blocos                   |
| next-sanity             | latest        | Integração oficial Next.js ↔ Sanity: client, live preview, revalidação                             |
| Vercel                  | Hobby tier    | CI/CD automático via GitHub, CDN global, suporte nativo a Next.js ISR, HTTPS automático            |
| Google AdSense          | Script async  | Monetização por display ads; 3 slots posicionados estrategicamente                                 |
| Schema.org / JSON-LD    | NewsArticle   | Rich results no Google News e busca orgânica; estruturado via `<script type="application/ld+json">`|

---

## 5. File Structure

```
the-itapoa-times/
│
├── .env.local                          # Variáveis de ambiente locais (nunca commitar)
├── .env.example                        # Template de variáveis para onboarding
├── .gitignore
├── next.config.ts                      # Configuração Next.js: domínios de imagem, rewrites, env
├── tailwind.config.ts                  # Tema customizado: fontes, cores, breakpoints
├── tsconfig.json
├── package.json
│
├── sanity/                             # Tudo relativo ao Sanity CMS
│   ├── sanity.config.ts                # Configuração do Sanity Studio (dataset, plugins, schema)
│   ├── sanity.cli.ts                   # Config do CLI Sanity para deploy do Studio
│   ├── client.ts                       # sanityClient configurado com apiVersion e useCdn
│   ├── image.ts                        # Helper urlFor() usando @sanity/image-url
│   ├── queries.ts                      # Todas as GROQ queries exportadas como constantes
│   └── schemas/
│       ├── index.ts                    # Exporta todos os schemas para o sanity.config.ts
│       ├── article.ts                  # Schema do documento article (campos obrigatórios)
│       ├── category.ts                 # Schema do documento category (title, slug, description)
│       ├── author.ts                   # Schema do documento author (name, slug, bio, image)
│       └── localBanner.ts             # Schema do documento localBanner (image, url, alt, active)
│
├── src/
│   ├── app/                            # App Router do Next.js 15
│   │   ├── layout.tsx                  # Root layout: <html>, <head>, AdSense script, fontes
│   │   ├── page.tsx                    # Homepage: featured articles + grid + Slot 1 AdSense
│   │   ├── not-found.tsx               # Página 404 customizada
│   │   ├── sitemap.ts                  # Sitemap dinâmico gerado via GROQ (todos os artigos)
│   │   ├── robots.ts                   # robots.txt gerado programaticamente
│   │   │
│   │   ├── [category]/
│   │   │   ├── page.tsx                # Listagem de artigos por categoria
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Página do artigo: body + JSON-LD + OG + Slot 2 + Slot 3
│   │   │
│   │   ├── api/
│   │   │   └── revalidate/
│   │   │       └── route.ts            # Webhook handler: valida secret, chama revalidatePath/Tag
│   │   │
│   │   └── studio/
│   │       └── [[...tool]]/
│   │           └── page.tsx            # Sanity Studio embutido na rota /studio
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx              # Logo, nav principal, menu mobile (hamburger)
│   │   │   ├── Footer.tsx              # Links, categorias, créditos, CNPJ/contato
│   │   │   └── MobileMenu.tsx          # Drawer de navegação mobile
│   │   │
│   │   ├── article/
│   │   │   ├── ArticleCard.tsx         # Card de artigo: imagem, categoria, título, excerpt, data
│   │   │   ├── ArticleGrid.tsx         # Grid responsivo de ArticleCards com injeção do Slot 1
│   │   │   ├── ArticleBody.tsx         # Renderiza Portable Text com estilos tipográficos
│   │   │   ├── ArticleMeta.tsx         # Autor, data publicação, categoria (dentro do artigo)
│   │   │   ├── FeaturedArticle.tsx     # Destaque hero na homepage
│   │   │   └── JsonLdArticle.tsx       # Injeta <script> JSON-LD NewsArticle
│   │   │
│   │   ├── ads/
│   │   │   ├── AdSenseSlot.tsx         # Componente base: aceita slotId, formato, className
│   │   │   ├── AdSlot1Grid.tsx         # Wrapper Slot 1 — inserido no ArticleGrid após 3º card
│   │   │   ├── AdSlot2Article.tsx      # Wrapper Slot 2 — inserido no ArticleBody após 3º parágrafo
│   │   │   ├── AdSlot3Sidebar.tsx      # Wrapper Slot 3 — sidebar 300x600, hidden em mobile/tablet
│   │   │   └── LocalBanner.tsx         # Banner de anunciante local — dados via Sanity + ISR
│   │   │
│   │   └── ui/
│   │       ├── CategoryBadge.tsx       # Badge colorido por categoria
│   │       ├── DateFormatter.tsx       # Formata datas em pt-BR
│   │       ├── ImageWithFallback.tsx   # next/image com fallback para og-default.jpg
│   │       └── Breadcrumb.tsx          # Breadcrumb semântico para artigos e categorias
│   │
│   ├── types/
│   │   └── index.ts                    # Interfaces TypeScript: Article, Category, Author, LocalBanner
│   │
│   └── lib/
│       └── metadata.ts                 # Helpers para gerar Metadata (OG, Twitter Card) por página
│
└── public/
    ├── logo.svg                        # Logotipo do portal (SVG otimizado)
    ├── favicon.ico                     # Favicon 32x32
    ├── apple-touch-icon.png            # Apple touch icon 180x180
    └── og-default.jpg                  # Imagem OG padrão para páginas sem imagem própria
```

---

## 6. Task Breakdown

### FASE 0 — Fundação (P0)

> Objetivo: ambiente funcional com Sanity conectado ao Next.js e dados de seed disponíveis para desenvolvimento.

---

**TASK-001**
- **Nome:** Scaffold Next.js 15 com TypeScript e Tailwind CSS
- **Agent:** frontend-specialist
- **Skill:** react-best-practices
- **Priority:** P0
- **Dependencies:** nenhuma
- **INPUT:** decisão de stack (Next.js 15, TypeScript 5, Tailwind 3)
- **OUTPUT:** repositório inicializado com `create-next-app@latest`, App Router, TypeScript strict, Tailwind configurado, `tailwind.config.ts` com tema base
- **VERIFY:** `npm run dev` sobe sem erros; `npx tsc --noEmit` limpo; Tailwind aplica estilos em `app/page.tsx`

---

**TASK-002**
- **Nome:** Configurar Sanity Studio v3 e schemas principais
- **Agent:** frontend-specialist
- **Skill:** react-best-practices
- **Priority:** P0
- **Dependencies:** TASK-001
- **INPUT:** campos do schema `article` definidos no plano; categorias, author, localBanner listados
- **OUTPUT:** `sanity/schemas/` com `article.ts`, `category.ts`, `author.ts`, `localBanner.ts`; `sanity/sanity.config.ts` funcional; rota `/studio` embutida no Next.js
- **VERIFY:** `http://localhost:3000/studio` abre o Sanity Studio; todos os campos do schema `article` estão presentes e validados

---

**TASK-003**
- **Nome:** Configurar variáveis de ambiente e `next.config.ts`
- **Agent:** frontend-specialist
- **Skill:** react-best-practices
- **Priority:** P0
- **Dependencies:** TASK-002
- **INPUT:** Project ID e dataset do Sanity; SANITY_API_TOKEN; SANITY_WEBHOOK_SECRET; domínio de imagens CDN Sanity
- **OUTPUT:** `.env.example` com todas as variáveis; `.env.local` preenchido localmente; `next.config.ts` com `images.remotePatterns` para `cdn.sanity.io`; `sanity/client.ts` e `sanity/image.ts` implementados
- **VERIFY:** `sanityClient.fetch('*[_type == "article"][0]')` retorna dado sem erro no Node REPL

---

**TASK-004**
- **Nome:** Seed de dados iniciais no Sanity
- **Agent:** frontend-specialist
- **Skill:** react-best-practices
- **Priority:** P0
- **Dependencies:** TASK-003
- **INPUT:** lista de 8 categorias; 1 autor; 5 artigos de exemplo com todos os campos preenchidos; 1 banner local ativo
- **OUTPUT:** Sanity dataset populado via Studio (inserção manual) ou script de seed via `@sanity/client`
- **VERIFY:** GROQ `*[_type == "article"]{title, slug, category->}` retorna 5 artigos no Vision do Studio

---

### FASE 1 — Core Editorial (P1)

> Objetivo: fluxo editorial completo — homepage, listagem por categoria, página de artigo — funcionando com dados reais do Sanity.

---

**TASK-101**
- **Nome:** Implementar GROQ queries e tipos TypeScript
- **Agent:** frontend-specialist
- **Skill:** react-best-practices
- **Priority:** P1
- **Dependencies:** TASK-004
- **INPUT:** schemas do Sanity; campos necessários por página
- **OUTPUT:** `sanity/queries.ts` com queries exportadas: `allArticlesQuery`, `featuredArticlesQuery`, `articleBySlugQuery`, `articlesByCategoryQuery`, `allCategoriesQuery`, `localBannerQuery`; `src/types/index.ts` com interfaces `Article`, `Category`, `Author`, `LocalBanner` correspondendo aos retornos GROQ
- **VERIFY:** Cada query executada no Sanity Vision retorna shape esperado; tipos TypeScript compilam sem erros

---

**TASK-102**
- **Nome:** Implementar Header com navegação e menu mobile
- **Agent:** frontend-specialist
- **Skill:** frontend-design
- **Priority:** P1
- **Dependencies:** TASK-101
- **INPUT:** lista de categorias; logotipo; paleta de cores do portal
- **OUTPUT:** `Header.tsx` com logo, links de categorias, busca (placeholder); `MobileMenu.tsx` com drawer hamburger funcional; responsivo de 375px a 1280px+
- **VERIFY:** Menu mobile abre/fecha em 375px; links de categorias navegam para `/{category-slug}`; sem purple/violet nas cores

---

**TASK-103**
- **Nome:** Implementar Footer
- **Agent:** frontend-specialist
- **Skill:** frontend-design
- **Priority:** P1
- **Dependencies:** TASK-102
- **INPUT:** categorias; informações de contato/CNPJ placeholder
- **OUTPUT:** `Footer.tsx` com links de categorias, seção "Sobre", contato, créditos editoriais
- **VERIFY:** Renderiza corretamente em 375px e 1280px; links funcionam; sem layout quebrado

---

**TASK-104**
- **Nome:** Implementar ArticleCard e ArticleGrid
- **Agent:** frontend-specialist
- **Skill:** frontend-design
- **Priority:** P1
- **Dependencies:** TASK-101
- **INPUT:** tipo `Article`; design de card (imagem hotspot, badge de categoria, título, excerpt, data)
- **OUTPUT:** `ArticleCard.tsx` com `next/image` otimizado, `CategoryBadge`, `DateFormatter`; `ArticleGrid.tsx` com grid responsivo (1 col mobile, 2 col tablet, 3 col desktop); componentes UI auxiliares (`CategoryBadge.tsx`, `DateFormatter.tsx`, `ImageWithFallback.tsx`)
- **VERIFY:** Grid renderiza 6 cards; imagens com hotspot correto via `urlFor().url()`; responsivo nos 3 breakpoints

---

**TASK-105**
- **Nome:** Implementar Homepage (`app/page.tsx`)
- **Agent:** frontend-specialist
- **Skill:** frontend-design
- **Priority:** P1
- **Dependencies:** TASK-104
- **INPUT:** queries `featuredArticlesQuery`, `allArticlesQuery`; `FeaturedArticle` componente; `ArticleGrid`
- **OUTPUT:** `app/page.tsx` com Server Component; `FeaturedArticle.tsx` como hero; grid de artigos recentes; fetch via `sanityClient` com revalidação por tag; metadata básica
- **VERIFY:** Homepage carrega com dados reais do Sanity; featured article aparece em destaque; grid exibe artigos ordenados por `publishedAt desc`

---

**TASK-106**
- **Nome:** Implementar ArticleBody com Portable Text
- **Agent:** frontend-specialist
- **Skill:** frontend-design
- **Priority:** P1
- **Dependencies:** TASK-101
- **INPUT:** tipo `body` (Portable Text); `@portabletext/react`; estilos tipográficos
- **OUTPUT:** `ArticleBody.tsx` com customização de blocos (h2, h3, blockquote, imagens inline com caption, links externos); `ArticleMeta.tsx` com autor, data, categoria; estilos Tailwind Typography (prose)
- **VERIFY:** Artigo de seed com todos os tipos de bloco renderiza sem erros; imagens inline com next/image; links externos com `target="_blank" rel="noopener"`

---

**TASK-107**
- **Nome:** Implementar página de artigo (`[category]/[slug]/page.tsx`)
- **Agent:** frontend-specialist
- **Skill:** frontend-design
- **Priority:** P1
- **Dependencies:** TASK-106
- **INPUT:** query `articleBySlugQuery`; `ArticleBody`, `ArticleMeta`, `Breadcrumb`, `FeaturedArticle` (imagem principal); `generateStaticParams`
- **OUTPUT:** `app/[category]/[slug]/page.tsx` com `generateStaticParams` para SSG; layout duas colunas em desktop (conteúdo + sidebar); `Breadcrumb.tsx`; revalidação por tag Sanity
- **VERIFY:** URL `/cidade/nome-do-artigo` resolve para artigo correto; `generateStaticParams` gera paths para todos os artigos do seed; 404 para slug inexistente

---

**TASK-108**
- **Nome:** Implementar página de listagem por categoria (`[category]/page.tsx`)
- **Agent:** frontend-specialist
- **Skill:** frontend-design
- **Priority:** P1
- **Dependencies:** TASK-104
- **INPUT:** query `articlesByCategoryQuery`; `ArticleGrid`; `generateStaticParams` para categorias
- **OUTPUT:** `app/[category]/page.tsx` com título da categoria, descrição, grid de artigos filtrados; `generateStaticParams` para todas as 8 categorias
- **VERIFY:** `/cidade` lista apenas artigos da categoria "Cidade"; `/turismo` lista apenas artigos de "Turismo"; layout responsivo correto

---

### FASE 2 — Monetização (P1/P2)

> Objetivo: AdSense funcional nos 3 slots e banner local trocável via CMS.

---

**TASK-201**
- **Nome:** Implementar AdSense script e componente base `AdSenseSlot`
- **Agent:** frontend-specialist
- **Skill:** frontend-design
- **Priority:** P1
- **Dependencies:** TASK-105
- **INPUT:** Publisher ID do AdSense; decisão de 3 slots
- **OUTPUT:** script AdSense async no `app/layout.tsx` (depois de `</body>` ou via `next/script strategy="afterInteractive"`); `AdSenseSlot.tsx` com `data-ad-client`, `data-ad-slot`, `data-ad-format`, suporte a `className`
- **VERIFY:** Script AdSense carregado no DOM (inspecionar Network); sem erros de console; não bloqueia LCP

---

**TASK-202**
- **Nome:** Slot 1 — AdSense no grid da homepage (após 3º card)
- **Agent:** frontend-specialist
- **Skill:** frontend-design
- **Priority:** P1
- **Dependencies:** TASK-201, TASK-105
- **INPUT:** `ArticleGrid.tsx`; `AdSlot1Grid.tsx`; posição após índice 2 (0-based)
- **OUTPUT:** `AdSlot1Grid.tsx` wrapping `AdSenseSlot`; `ArticleGrid.tsx` modificado para injetar `AdSlot1Grid` entre o 3º e 4º card; responsivo (full-width em mobile, span 3 cols em desktop)
- **VERIFY:** Slot aparece visualmente após o 3º card; não quebra o grid em 375px, 768px, 1280px; inspecionar elemento `ins.adsbygoogle`

---

**TASK-203**
- **Nome:** Slot 2 — AdSense no corpo do artigo (após 3º parágrafo)
- **Agent:** frontend-specialist
- **Skill:** frontend-design
- **Priority:** P1
- **Dependencies:** TASK-201, TASK-107
- **INPUT:** `ArticleBody.tsx`; `AdSlot2Article.tsx`; lógica de injeção no bloco Portable Text
- **OUTPUT:** `AdSlot2Article.tsx`; modificação em `ArticleBody.tsx` para injetar o slot após o 3º bloco de tipo `block` (parágrafo normal); sem injeção em artigos com menos de 3 parágrafos
- **VERIFY:** Slot aparece após 3º parágrafo em artigo longo; artigo curto (< 3 parágrafos) não injeta; sem quebra de layout

---

**TASK-204**
- **Nome:** Slot 3 — AdSense sidebar vertical (desktop only)
- **Agent:** frontend-specialist
- **Skill:** frontend-design
- **Priority:** P2
- **Dependencies:** TASK-201, TASK-107
- **INPUT:** `AdSlot3Sidebar.tsx`; layout duas colunas da página de artigo; breakpoint `lg:`
- **OUTPUT:** `AdSlot3Sidebar.tsx` com formato 300x600 (`data-ad-format="vertical"`); visível apenas em `lg:` breakpoint (`hidden lg:block`); sticky no sidebar da página de artigo
- **VERIFY:** Slot visível em 1280px; oculto em 375px e 768px; sticky funciona ao scrollar o artigo

---

**TASK-205**
- **Nome:** Banner local de anunciante gerenciado via Sanity
- **Agent:** frontend-specialist
- **Skill:** frontend-design
- **Priority:** P2
- **Dependencies:** TASK-204
- **INPUT:** schema `localBanner`; query `localBannerQuery`; `LocalBanner.tsx`
- **OUTPUT:** `LocalBanner.tsx` que busca banner ativo via Sanity (campo `active: true`), renderiza imagem com link externo, `alt` text e `rel="noopener sponsored"`; posicionado na sidebar da página de artigo, abaixo do Slot 3; revalidação por tag para ISR
- **VERIFY:** Trocar imagem no Studio → após <= 30s o novo banner aparece sem deploy; quando `active: false` o componente não renderiza nada; `rel="sponsored"` presente no `<a>`

---

### FASE 3 — SEO e Performance (P2/P3)

> Objetivo: visibilidade máxima no Google, tempos de carregamento otimizados e ISR funcionando.

---

**TASK-301**
- **Nome:** Implementar JSON-LD NewsArticle em páginas de artigo
- **Agent:** frontend-specialist
- **Skill:** react-best-practices
- **Priority:** P2
- **Dependencies:** TASK-107
- **INPUT:** campos do artigo; spec Schema.org NewsArticle; `JsonLdArticle.tsx`
- **OUTPUT:** `JsonLdArticle.tsx` injetando `<script type="application/ld+json">` com campos: `@type: NewsArticle`, `headline`, `description`, `image`, `author`, `datePublished`, `dateModified`, `publisher` (com `logo`), `mainEntityOfPage`, `articleSection` (categoria)
- **VERIFY:** Google Rich Results Test valida o JSON-LD sem erros; todos os campos obrigatórios presentes; testado em artigo do seed

---

**TASK-302**
- **Nome:** Implementar Open Graph e Twitter Card para todas as rotas
- **Agent:** frontend-specialist
- **Skill:** react-best-practices
- **Priority:** P2
- **Dependencies:** TASK-107, TASK-108
- **INPUT:** API `Metadata` do Next.js 15; `src/lib/metadata.ts`; `og-default.jpg`
- **OUTPUT:** `src/lib/metadata.ts` com helper `generateArticleMetadata(article)` e `generateCategoryMetadata(category)`; cada `page.tsx` chama o helper em `generateMetadata()`; tags OG (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`) e Twitter Card (`summary_large_image`) corretas; `og-default.jpg` como fallback
- **VERIFY:** `metatags.io` ou inspeção do HTML mostra todas as tags; imagem OG customizada por artigo; fallback para `og-default.jpg` quando artigo sem imagem

---

**TASK-303**
- **Nome:** Implementar sitemap dinâmico e robots.ts
- **Agent:** frontend-specialist
- **Skill:** react-best-practices
- **Priority:** P2
- **Dependencies:** TASK-101
- **INPUT:** query GROQ para todos os artigos e categorias; API de sitemap do Next.js 15 (`app/sitemap.ts`); `app/robots.ts`
- **OUTPUT:** `app/sitemap.ts` gerando entradas para homepage, todas as páginas de categoria e todos os artigos publicados com `lastModified: publishedAt`; `app/robots.ts` com `Allow: /`, `Disallow: /studio`, `Sitemap:` apontando para URL de produção
- **VERIFY:** `/sitemap.xml` acessível localmente; XML válido; contém URLs de todos os 5 artigos do seed; `/robots.txt` bloqueia `/studio`

---

**TASK-304**
- **Nome:** Implementar webhook Sanity → Vercel para ISR on-demand
- **Agent:** frontend-specialist
- **Skill:** react-best-practices
- **Priority:** P3
- **Dependencies:** TASK-303
- **INPUT:** `app/api/revalidate/route.ts`; `SANITY_WEBHOOK_SECRET`; `revalidatePath` e `revalidateTag` do Next.js
- **OUTPUT:** `route.ts` que: (1) valida o header `x-webhook-secret` contra `SANITY_WEBHOOK_SECRET`; (2) extrai `slug` e `category` do payload; (3) chama `revalidateTag('articles')` e `revalidatePath('/[category]/[slug]')`; retorna 401 para secret inválido, 200 para sucesso; configuração do webhook no painel Sanity apontando para `https://itapoatimes.com.br/api/revalidate`
- **VERIFY:** Publicar artigo no Studio → página atualizada em <= 30s; requisição com secret errado retorna 401; sem erros no log do Vercel

---

**TASK-305**
- **Nome:** Otimização de imagens e performance
- **Agent:** frontend-specialist
- **Skill:** react-best-practices
- **Priority:** P3
- **Dependencies:** TASK-107, TASK-105
- **INPUT:** uso de `next/image` em todos os componentes; configuração de `sizes`; lazy loading
- **OUTPUT:** todos os `<img>` substituídos por `next/image`; `priority={true}` na imagem hero da homepage e na imagem principal do artigo; `sizes` correto por breakpoint; `placeholder="blur"` com `blurDataURL` via Sanity `asset.metadata.lqip`; fontes carregadas via `next/font`
- **VERIFY:** Lighthouse Performance >= 90; LCP < 2s; sem imagens sem `alt`; zero uso de `<img>` nativo

---

### FASE X — Deploy e Verificação (PX)

> Objetivo: portal em produção, domínio configurado, CI/CD ativo, checklist completo aprovado.

---

**TASK-X01**
- **Nome:** Deploy Vercel + configuração de domínio + HTTPS
- **Agent:** frontend-specialist
- **Skill:** react-best-practices
- **Priority:** PX
- **Dependencies:** TASK-305
- **INPUT:** repositório GitHub; conta Vercel Hobby; domínio `itapoatimes.com.br`; variáveis de ambiente de produção
- **OUTPUT:** projeto importado no Vercel com branch `main` como production; variáveis de ambiente configuradas no dashboard Vercel; domínio `itapoatimes.com.br` apontado via DNS; HTTPS automático ativo; CI/CD disparando a cada push
- **VERIFY:** `https://itapoatimes.com.br` abre o portal; certificado SSL válido; push de teste na branch `main` dispara build automático no Vercel

---

**TASK-X02**
- **Nome:** Checklist final de verificação (todos os critérios SC + VF)
- **Agent:** frontend-specialist
- **Skill:** react-best-practices
- **Priority:** PX
- **Dependencies:** TASK-X01
- **INPUT:** tabela Success Criteria (SC-01 a SC-12); tabela Verification Checklist (VF-01 a VF-20); ferramentas: Lighthouse, Rich Results Test, metatags.io, curl
- **OUTPUT:** todos os itens VF com status PASSED; score Lighthouse >= 90 em Performance e Accessibility; relatório final de verificação
- **VERIFY:** `python .agent/scripts/checklist.py .` retorna sucesso; `python .agent/scripts/verify_all.py . --url https://itapoatimes.com.br` retorna sucesso

---

## 7. Dependency Graph

```
FASE 0 — Fundação
══════════════════════════════════════════════════════════════════

TASK-001 (Scaffold)
    │
    ▼
TASK-002 (Sanity Studio + Schemas)
    │
    ▼
TASK-003 (Env + next.config.ts)
    │
    ▼
TASK-004 (Seed Data)
    │
    └──────────────────────────────────────────┐
                                               │
FASE 1 — Core Editorial                        │
══════════════════════════════════════════════ │ ══════════════
                                               │
                                               ▼
                                          TASK-101 (GROQ Queries + Types)
                                               │
                          ┌────────────────────┼────────────────────┐
                          │                    │                    │
                          ▼                    ▼                    ▼
                     TASK-102             TASK-104             TASK-106
                    (Header)           (ArticleCard         (ArticleBody +
                       │               + Grid)              Portable Text)
                       │                    │                    │
                       ▼                    │                    ▼
                  TASK-103                  │               TASK-107
                  (Footer)                  │         (Página Artigo [slug])
                                            │                    │
                                            ▼                    │
                                       TASK-105                  │
                                      (Homepage)                 │
                                            │                    │
                                            └──────┬─────────────┘
                                                   │
                                                   ▼
                                              TASK-108
                                        (Listagem Categoria)

FASE 2 — Monetização
══════════════════════════════════════════════════════════════════

TASK-105 (Homepage) ──────────────────┐
TASK-107 (Página Artigo) ─────────────┤
                                      ▼
                                 TASK-201 (AdSense Script + Base)
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                  │
                    ▼                 ▼                  ▼
               TASK-202          TASK-203           TASK-204
             (Slot 1 Grid)    (Slot 2 Artigo)    (Slot 3 Sidebar)
                                                       │
                                                       ▼
                                                  TASK-205
                                               (Banner Local)

FASE 3 — SEO e Performance
══════════════════════════════════════════════════════════════════

TASK-107 (Página Artigo) ─────────────────┬──────────────┐
TASK-108 (Listagem Categoria) ────────────┘              │
                          │                              │
                          ▼                              ▼
                     TASK-301                       TASK-302
                  (JSON-LD NewsArticle)          (OG + Twitter Card)

TASK-101 (Queries) ───────────────────────────────────────┐
                                                          ▼
                                                     TASK-303
                                               (Sitemap + robots.ts)
                                                          │
                                                          ▼
                                                     TASK-304
                                                  (Webhook ISR)

TASK-107 + TASK-105 ──────────────────────────────────────┐
                                                          ▼
                                                     TASK-305
                                                (Otimização Imagens)

FASE X — Deploy e Verificação
══════════════════════════════════════════════════════════════════

TASK-305 (última task de implementação)
    │
    ▼
TASK-X01 (Deploy Vercel + Domínio)
    │
    ▼
TASK-X02 (Checklist Final)
```

---

## 8. Phase X: Verification Checklist

| ID    | Item verificável                                                                 | Método de verificação                                                        | Status  |
|-------|----------------------------------------------------------------------------------|------------------------------------------------------------------------------|---------|
| VF-01 | `tsc --noEmit` sem erros                                                         | `npx tsc --noEmit` no terminal                                               | PENDING |
| VF-02 | `npm run build` conclui sem erros                                                | `npm run build` local e no CI Vercel                                         | PENDING |
| VF-03 | Lighthouse Performance >= 90 na homepage                                         | `lighthouse https://itapoatimes.com.br --only-categories=performance`        | PENDING |
| VF-04 | Lighthouse Accessibility >= 90 na homepage                                       | `lighthouse https://itapoatimes.com.br --only-categories=accessibility`      | PENDING |
| VF-05 | LCP < 2.5s na homepage (campo "Largest Contentful Paint")                        | DevTools Performance tab + Lighthouse LCP metric                             | PENDING |
| VF-06 | JSON-LD NewsArticle válido em página de artigo                                   | Google Rich Results Test com URL do artigo de seed                           | PENDING |
| VF-07 | Tags Open Graph corretas na página de artigo                                     | `metatags.io` ou `curl` + grep no HTML                                       | PENDING |
| VF-08 | Tags Open Graph corretas na homepage                                             | `metatags.io` com URL da homepage                                            | PENDING |
| VF-09 | Twitter Card `summary_large_image` presente                                      | Inspeção do `<head>` ou Twitter Card Validator                               | PENDING |
| VF-10 | `/sitemap.xml` acessível e XML válido com todos os artigos                       | `curl https://itapoatimes.com.br/sitemap.xml` + validador XML                | PENDING |
| VF-11 | `/robots.txt` com `Disallow: /studio` e `Sitemap:` correto                       | `curl https://itapoatimes.com.br/robots.txt`                                 | PENDING |
| VF-12 | Webhook ISR: artigo publicado aparece em <= 30s                                  | Publicar artigo no Studio, cronometrar aparição no portal                    | PENDING |
| VF-13 | Webhook retorna 401 para secret inválido                                         | `curl -X POST /api/revalidate -H "x-webhook-secret: errado"`                 | PENDING |
| VF-14 | AdSense Slot 1 presente no DOM após 3º card na homepage                          | DevTools → inspecionar `ins.adsbygoogle` entre o 3º e 4º `.article-card`    | PENDING |
| VF-15 | AdSense Slot 2 presente no DOM após 3º parágrafo no corpo do artigo              | DevTools → inspecionar posição do `ins.adsbygoogle` dentro de `.article-body`| PENDING |
| VF-16 | AdSense Slot 3 visível em 1280px e oculto em 375px                               | DevTools responsive mode nos 2 breakpoints                                   | PENDING |
| VF-17 | Banner local atualiza via ISR sem deploy (campo `active` e troca de imagem)      | Trocar imagem no Studio, aguardar <= 30s, verificar no portal                | PENDING |
| VF-18 | Padrão de URL `/[category]/[slug]` funcionando para todas as 8 categorias        | Acessar 1 artigo por categoria, verificar 200 em cada                        | PENDING |
| VF-19 | Layout responsivo correto em 375px (mobile) — sem overflow horizontal            | DevTools → 375px → rolar todas as páginas; zero scroll horizontal            | PENDING |
| VF-20 | Menu mobile (hamburger) abre e fecha corretamente em 375px                       | DevTools → 375px → clicar hamburger; verificar drawer e fechar               | PENDING |
| VF-21 | HTTPS ativo e certificado SSL válido em produção                                 | Browser + `curl -I https://itapoatimes.com.br` → `HTTP/2 200`               | PENDING |
| VF-22 | CI/CD Vercel dispara build a cada push na branch `main`                          | Push de commit vazio, verificar dashboard Vercel → novo deployment           | PENDING |

---

*Plano gerado em: 2026-03-24*
*Projeto: The Itapoá Times — Portal de Notícias*
*Stack: Next.js 15 + Sanity CMS v3 + Vercel + Tailwind CSS + TypeScript*
