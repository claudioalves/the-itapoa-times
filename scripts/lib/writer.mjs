/**
 * Redator automático usando Claude API
 * Escreve matérias completas em estilo jornalístico local
 */

import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const CATEGORIES = [
  'cidade', 'politica', 'porto', 'turismo',
  'seguranca', 'meio-ambiente', 'esporte', 'servicos',
]

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

function textToPortableText(paragraphs) {
  return paragraphs.map((text, i) => ({
    _type: 'block',
    _key: `p${i}`,
    style: 'normal',
    children: [{ _type: 'span', _key: `s${i}`, text, marks: [] }],
    markDefs: [],
  }))
}

export async function writeArticle(source) {
  const prompt = `Você é um jornalista local do The Itapoá Times, portal de notícias de Itapoá, SC.

Com base nesta pauta de um site concorrente, escreva uma matéria ORIGINAL para o The Itapoá Times.

PAUTA DE REFERÊNCIA:
Título original: ${source.title}
Fonte: ${source.source}
Descrição: ${source.description || '(sem descrição)'}

INSTRUÇÕES:
- Escreva de forma ORIGINAL, não copie o texto da fonte
- Tom: local, factual, próximo da comunidade de Itapoá
- Sem sensacionalismo, sem clickbait
- Foco em como o fato impacta os moradores de Itapoá e região
- Use linguagem simples e acessível
- Corpo da matéria: 4 a 6 parágrafos

Responda SOMENTE com um JSON válido neste formato exato:
{
  "title": "título da matéria (max 100 chars)",
  "category": "uma das categorias: ${CATEGORIES.join(', ')}",
  "excerpt": "resumo em 1-2 frases (max 200 chars)",
  "paragraphs": ["parágrafo 1", "parágrafo 2", "parágrafo 3", "parágrafo 4"],
  "seoTitle": "título SEO (max 60 chars)",
  "seoDescription": "descrição SEO (max 160 chars)"
}`

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = message.content[0].text.trim()
  const json = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '')
  const data = JSON.parse(json)

  // Validar categoria
  const category = CATEGORIES.includes(data.category) ? data.category : 'cidade'

  return {
    title: data.title,
    slug: slugify(data.title),
    category,
    excerpt: data.excerpt,
    body: textToPortableText(data.paragraphs),
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
  }
}
