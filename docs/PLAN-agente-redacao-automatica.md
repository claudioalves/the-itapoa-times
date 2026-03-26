# PLAN: Agente de Redação Automática
**Projeto:** The Itapoá Times
**Data:** 2026-03-25
**Arquivo:** docs/PLAN-agente-redacao-automatica.md

---

## Objetivo

Criar um agente autônomo que roda diariamente via GitHub Actions, monitora sites de notícias regionais, escreve de 1 a 3 matérias sobre Itapoá usando Claude API, verifica duplicatas e publica como rascunho no Sanity para revisão editorial.

---

## Fluxo do Agente

```
GitHub Actions (cron: 7h todo dia)
         ↓
TASK-1: Scraping dos sites concorrentes
         ↓
TASK-2: Filtrar notícias relevantes sobre Itapoá
         ↓
TASK-3: Verificar duplicatas contra Sanity
         ↓
TASK-4: Selecionar 1-3 pautas novas
         ↓
TASK-5: Escrever matéria completa com Claude API
         ↓
TASK-6: Gerar imagem com Hugging Face FLUX
         ↓
TASK-7: Publicar como RASCUNHO no Sanity
         ↓
TASK-8: (opcional) Notificar por email/Slack
```

---

## Fontes Monitoradas

| Site | URL | Método |
|------|-----|--------|
| NSC Total | nsctotal.com.br | RSS / scraping |
| A Notícia | an.com.br | RSS / scraping |
| G1 SC | g1.globo.com/sc | RSS |
| Diário Catarinense | diariocatarinense.com.br | RSS |
| Gazeta de Joinville | gazetadejoinville.com.br | scraping |
| Prefeitura Itapoá | pmitapoa.sc.gov.br | scraping |
| Porto Itapoá | portoitapoa.com.br | scraping |

---

## Detalhamento das Tasks

### TASK-1: Script principal do agente
**Arquivo:** `scripts/agent-writer.mjs`
**Responsabilidade:** Orquestrar todas as etapas
**Input:** Nenhum (roda autônomo)
**Output:** Log de execução + artigos publicados

### TASK-2: Módulo de scraping
**Arquivo:** `scripts/lib/scraper.mjs`
**Responsabilidade:** Buscar manchetes dos sites concorrentes
**Técnica:** Fetch + cheerio para parsear HTML / RSS XML
**Filtro:** Apenas notícias que contenham "Itapoá" ou termos regionais
**Dependência:** `npm install cheerio`

### TASK-3: Módulo de verificação de duplicatas
**Arquivo:** `scripts/lib/duplicate-checker.mjs`
**Responsabilidade:** Comparar pauta nova com artigos existentes no Sanity
**Técnica:** Buscar títulos dos últimos 30 dias no Sanity → comparar similaridade por palavras-chave
**Threshold:** Rejeitar se >60% das palavras principais coincidirem

### TASK-4: Módulo de redação com Claude API
**Arquivo:** `scripts/lib/writer.mjs`
**Responsabilidade:** Escrever matéria completa em estilo jornalístico
**Model:** `claude-opus-4-6` (melhor qualidade para jornalismo)
**Prompt:** Inclui estilo editorial do The Itapoá Times, tom local, sem sensacionalismo
**Output:** título, slug, excerpt, body (Portable Text), seoTitle, seoDescription
**Dependência:** `npm install @anthropic-ai/sdk`

### TASK-5: Módulo de geração de imagem
**Arquivo:** Reutilizar lógica de `scripts/generate-image.mjs`
**Responsabilidade:** Gerar foto jornalística para cada matéria
**API:** Hugging Face FLUX.1-schnell (já configurado)

### TASK-6: Módulo de publicação no Sanity
**Arquivo:** `scripts/lib/publisher.mjs`
**Responsabilidade:** Criar documento no Sanity com status RASCUNHO
**Campo de controle:** `draft: true` / não marcar `featured`
**Resultado:** Aparece no Sanity Studio para revisão antes de publicar

### TASK-7: GitHub Actions workflow
**Arquivo:** `.github/workflows/agent-writer.yml`
**Schedule:** `cron: '0 10 * * *'` (7h horário de Brasília = 10h UTC)
**Secrets necessários:**
- `ANTHROPIC_API_KEY`
- `HF_TOKEN`
- `SANITY_API_TOKEN`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

---

## Variáveis de Ambiente Necessárias

| Variável | Onde adicionar |
|----------|---------------|
| `ANTHROPIC_API_KEY` | `.env.local` + GitHub Secrets + Vercel |
| `HF_TOKEN` | Já existe |
| `SANITY_API_TOKEN` | Já existe |

---

## Estrutura de Arquivos

```
scripts/
├── agent-writer.mjs          ← orquestrador principal
└── lib/
    ├── scraper.mjs            ← busca notícias nos sites
    ├── duplicate-checker.mjs  ← verifica duplicatas
    ├── writer.mjs             ← escreve com Claude API
    └── publisher.mjs          ← publica no Sanity

.github/
└── workflows/
    └── agent-writer.yml       ← GitHub Actions cron job
```

---

## Controle Editorial

- Artigos gerados entram como **rascunho** no Sanity Studio
- Editor recebe o artigo na fila, revisa e clica em **Publicar**
- Alternativa futura: publicar direto com notificação por email

---

## Dependências Novas

```bash
npm install cheerio @anthropic-ai/sdk
```

---

## Pré-requisitos

- [ ] Criar conta na Anthropic e obter API key (`console.anthropic.com`)
- [ ] Adicionar `ANTHROPIC_API_KEY` no `.env.local`
- [ ] Adicionar `ANTHROPIC_API_KEY` nos GitHub Secrets do repositório
- [ ] Verificar que o repositório está no GitHub (já está)

---

## Verificação Final

- [ ] Script roda localmente sem erros
- [ ] Artigo aparece como rascunho no Sanity Studio
- [ ] Imagem gerada e associada ao artigo
- [ ] GitHub Actions executa no horário correto
- [ ] Duplicatas são rejeitadas corretamente
- [ ] TypeScript sem erros (`npx tsc --noEmit`)

---

## Estimativa de Custo

| Serviço | Custo estimado |
|---------|---------------|
| Claude API (1-3 artigos/dia) | ~$0,10–0,30/dia |
| Hugging Face FLUX | Grátis |
| GitHub Actions | Grátis (plano free) |
| **Total mensal** | **~$3–9/mês** |
