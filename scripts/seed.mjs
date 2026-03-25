import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'o64so9y2',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skvz1198Sf6dQ8BiAam9Tv6VQYOowhiVl3TLXt6uzr3EARAiNDowhZa4NSin7khCO2Xd9bluA9UT7KJj5XhhBHaxTOavU8OiDJHIWaYNkjYX1ykF1by9kfdQjLTMHR1YYC7pm47OpQfbCuBYLwCP7nPy86Bv0HKoGJWIjnUqAwJzazdaFyjC',
  useCdn: false,
})

// ─── CATEGORIAS ───────────────────────────────────────────
const categories = [
  { title: 'Cidade',        slug: 'cidade',        description: 'Notícias gerais de Itapoá' },
  { title: 'Política',      slug: 'politica',      description: 'Câmara, prefeitura e poder público' },
  { title: 'Porto',         slug: 'porto',         description: 'Porto Itapoá e logística' },
  { title: 'Turismo',       slug: 'turismo',       description: 'Praias, temporada e atrações' },
  { title: 'Segurança',     slug: 'seguranca',     description: 'Polícia, bombeiros e emergências' },
  { title: 'Meio Ambiente', slug: 'meio-ambiente', description: 'Natureza, mar e sustentabilidade' },
  { title: 'Esporte',       slug: 'esporte',       description: 'Esportes e competições locais' },
  { title: 'Serviços',      slug: 'servicos',      description: 'Saúde, educação e utilidade pública' },
]

// ─── AUTOR ────────────────────────────────────────────────
const author = {
  _type: 'author',
  name: 'Redação',
  slug: { _type: 'slug', current: 'redacao' },
  bio: 'Equipe editorial do The Itapoá Times.',
}

// ─── ARTIGOS ──────────────────────────────────────────────
const articles = [
  {
    title: 'Porto Itapoá lidera ranking nacional de satisfação pelo décimo ano consecutivo',
    slug: 'porto-itapoa-lider-ranking-satisfacao-decimo-ano',
    categorySlug: 'porto',
    featured: true,
    publishedAt: '2026-03-24T09:14:00Z',
    excerpt: 'Terminal catarinense consolida posição de liderança em satisfação de clientes e anuncia novo marco: 2 milhões de litros de água reutilizados em suas operações.',
    body: [
      { _type: 'block', _key: 'b1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'Nenhum terminal portuário do Brasil repete o feito dez vezes seguidas. O Porto Itapoá sim. O resultado, divulgado nesta segunda-feira, consolida o terminal localizado no Litoral Norte catarinense como referência de eficiência operacional e relacionamento com armadores, importadores e exportadores.' }] },
      { _type: 'block', _key: 'b2', style: 'normal', children: [{ _type: 'span', _key: 's2', text: 'Não é sorte. É cultura. Cada colaborador aqui sabe que o cliente é o motivo de tudo existir, disse um representante do terminal em nota oficial divulgada nesta manhã.' }] },
      { _type: 'block', _key: 'b3', style: 'normal', children: [{ _type: 'span', _key: 's3', text: 'O porto movimenta hoje uma fatia expressiva do comércio exterior do Sul do Brasil, com rotas diretas para Europa, Ásia e América do Norte. Para Itapoá, isso significa empregos, impostos e o desafio permanente de uma cidade pequena que opera infraestrutura de escala continental.' }] },
      { _type: 'block', _key: 'b4', style: 'h2', children: [{ _type: 'span', _key: 's4', text: 'A água que não vai ao ralo' }] },
      { _type: 'block', _key: 'b5', style: 'normal', children: [{ _type: 'span', _key: 's5', text: 'Na última semana, o porto informou ter atingido a marca de 2 milhões de litros de água reutilizados por meio de tecnologia de tratamento e reaproveitamento instalada internamente. O volume equivale a cerca de 800 piscinas olímpicas.' }] },
      { _type: 'block', _key: 'b6', style: 'normal', children: [{ _type: 'span', _key: 's6', text: 'A iniciativa reduz a captação de água potável e posiciona o terminal dentro das metas ESG que armadoras internacionais exigem cada vez mais de seus parceiros logísticos.' }] },
    ],
    seoTitle: 'Porto Itapoá é líder em satisfação pelo 10º ano seguido',
    seoDescription: 'Terminal portuário de Itapoá, SC, conquista pelo décimo ano consecutivo o 1º lugar no ranking nacional de satisfação de clientes.',
  },
  {
    title: 'Baleia jubarte é encontrada encalhada na Praia Barra do Saí',
    slug: 'baleia-jubarte-encalhada-praia-barra-do-sai',
    categorySlug: 'meio-ambiente',
    featured: false,
    publishedAt: '2026-03-22T14:30:00Z',
    excerpt: 'Uma baleia jubarte foi localizada na praia Barra do Saí. A equipe técnica municipal realizou o atendimento da ocorrência no litoral de Itapoá.',
    body: [
      { _type: 'block', _key: 'b1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'Moradores e turistas encontraram neste sábado uma baleia jubarte morta na Praia Barra do Saí, em Itapoá. O animal, de espécie protegida, chamou atenção para o estado de conservação do litoral catarinense.' }] },
      { _type: 'block', _key: 'b2', style: 'normal', children: [{ _type: 'span', _key: 's2', text: 'A equipe técnica da prefeitura foi acionada rapidamente para o atendimento da ocorrência. Segundo os técnicos, o animal aparentemente já estava morto antes de encalhar, e não há sinais de interferência humana direta.' }] },
      { _type: 'block', _key: 'b3', style: 'normal', children: [{ _type: 'span', _key: 's3', text: 'A jubarte é uma das maiores baleias do mundo, podendo chegar a 16 metros de comprimento e 30 toneladas. A espécie é conhecida pelos saltos espetaculares e pelas canções dos machos durante a reprodução.' }] },
      { _type: 'block', _key: 'b4', style: 'normal', children: [{ _type: 'span', _key: 's4', text: 'O caso ocorre no mesmo período em que o Instituto do Meio Ambiente de Santa Catarina divulgou relatório positivo: a maioria dos pontos do litoral catarinense encerrou o verão próprios para banho, incluindo praias de Itapoá.' }] },
      { _type: 'block', _key: 'b5', style: 'normal', children: [{ _type: 'span', _key: 's5', text: 'A prefeitura orienta que a população não toque no animal e mantenha distância segura enquanto as equipes técnicas concluem os procedimentos de remoção.' }] },
    ],
    seoTitle: 'Baleia jubarte encalha em Itapoá',
    seoDescription: 'Baleia jubarte é encontrada morta na Praia Barra do Saí, em Itapoá, SC. Equipes da prefeitura realizam atendimento.',
  },
  {
    title: 'Câmara de Vereadores homenageia mulheres destaque do município',
    slug: 'camara-vereadores-homenageia-mulheres-destaque',
    categorySlug: 'cidade',
    featured: false,
    publishedAt: '2026-03-21T18:00:00Z',
    excerpt: 'A Câmara de Vereadores realizou sessão solene para homenagear mulheres que contribuíram significativamente para o desenvolvimento de Itapoá.',
    body: [
      { _type: 'block', _key: 'b1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'Em sessão solene realizada na última sexta-feira, a Câmara Municipal de Vereadores de Itapoá homenageou mulheres que se destacaram na área social, econômica e cultural do município ao longo do último ano.' }] },
      { _type: 'block', _key: 'b2', style: 'normal', children: [{ _type: 'span', _key: 's2', text: 'As homenageadas receberam moções de aplausos e reconhecimento público por suas contribuições em áreas como educação, saúde, empreendedorismo e voluntariado comunitário.' }] },
      { _type: 'block', _key: 'b3', style: 'normal', children: [{ _type: 'span', _key: 's3', text: 'A cerimônia, realizada em alusão ao Mês das Mulheres, contou com a presença de familiares, autoridades locais e membros da comunidade. O presidente da Câmara destacou a importância de reconhecer publicamente o trabalho dessas mulheres.' }] },
      { _type: 'block', _key: 'b4', style: 'normal', children: [{ _type: 'span', _key: 's4', text: 'Itapoá tem hoje diversas mulheres em posições de liderança na administração pública, no comércio e nas organizações comunitárias, refletindo uma transformação cultural importante no município.' }] },
    ],
    seoTitle: 'Câmara homenageia mulheres destaque de Itapoá',
    seoDescription: 'Sessão solene na Câmara de Vereadores de Itapoá homenageia mulheres que se destacaram no município.',
  },
  {
    title: 'Deputado Zé Trovão reúne poder público e caminhoneiros para resolver trânsito em Itapoá',
    slug: 'ze-trovao-reuniao-transito-caminhoneiros-itapoa',
    categorySlug: 'politica',
    featured: false,
    publishedAt: '2026-03-21T11:00:00Z',
    excerpt: 'Deputado federal esteve em Itapoá para ouvir demandas do poder público e da categoria de transportadores sobre o caos no trânsito de carretas.',
    body: [
      { _type: 'block', _key: 'b1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'O deputado federal Zé Trovão esteve em Itapoá na última sexta-feira para articular uma reunião entre representantes do poder público municipal e caminhoneiros que atuam na região do porto.' }] },
      { _type: 'block', _key: 'b2', style: 'normal', children: [{ _type: 'span', _key: 's2', text: 'O encontro teve como pauta principal o caos logístico que se repete nas vias de acesso ao Porto Itapoá. A cidade sofre com o trânsito pesado de carretas que disputam espaço com moradores e turistas nas vias urbanas.' }] },
      { _type: 'block', _key: 'b3', style: 'normal', children: [{ _type: 'span', _key: 's3', text: 'Durante a reunião, foram levantadas propostas como a criação de vias alternativas, restrição de horários para circulação de veículos pesados no centro e melhoria da sinalização nas rotas de acesso.' }] },
      { _type: 'block', _key: 'b4', style: 'normal', children: [{ _type: 'span', _key: 's4', text: 'A reunião não produziu soluções imediatas, mas colocou o problema na agenda política estadual, o que representa um avanço para quem vive o congestionamento diariamente.' }] },
      { _type: 'block', _key: 'b5', style: 'normal', children: [{ _type: 'span', _key: 's5', text: 'O deputado sinalizou que vai encaminhar pedido formal ao DNIT e ao governo estadual para estudo de alternativas viárias na região.' }] },
    ],
    seoTitle: 'Zé Trovão debate trânsito de carretas em Itapoá',
    seoDescription: 'Deputado federal articula reunião em Itapoá para resolver problema do trânsito pesado nas vias de acesso ao porto.',
  },
  {
    title: 'Litoral de SC encerra verão com maioria das praias próprias para banho',
    slug: 'litoral-sc-encerra-verao-praias-proprias-banho',
    categorySlug: 'turismo',
    featured: false,
    publishedAt: '2026-03-20T10:00:00Z',
    excerpt: 'Relatório do IMA aponta melhora nas condições de balneabilidade enquanto caso envolvendo carcaça de baleia chama atenção do litoral norte.',
    body: [
      { _type: 'block', _key: 'b1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'O litoral de Santa Catarina encerrou a temporada de verão 2025-2026 com a maioria dos pontos monitorados classificados como próprios para banho, segundo relatório divulgado pelo Instituto do Meio Ambiente (IMA).' }] },
      { _type: 'block', _key: 'b2', style: 'normal', children: [{ _type: 'span', _key: 's2', text: 'As praias de Itapoá estiveram entre as monitoradas pelo instituto, e os resultados foram considerados satisfatórios ao longo da maior parte da temporada.' }] },
      { _type: 'block', _key: 'b3', style: 'normal', children: [{ _type: 'span', _key: 's3', text: 'Para o turismo local, os dados são positivos. Itapoá recebe visitantes principalmente nas temporadas de verão e inverno, e a qualidade das praias é um dos principais atrativos da cidade.' }] },
      { _type: 'block', _key: 'b4', style: 'normal', children: [{ _type: 'span', _key: 's4', text: 'O monitoramento de balneabilidade é realizado semanalmente pelo IMA em dezenas de pontos do litoral catarinense. As informações são disponibilizadas ao público no site do instituto.' }] },
    ],
    seoTitle: 'Praias de SC encerram verão em boa condição para banho',
    seoDescription: 'IMA divulga relatório positivo sobre balneabilidade do litoral de Santa Catarina ao final da temporada de verão.',
  },
  {
    title: 'Homem morre após afogamento registrado no domingo em Itapoá',
    slug: 'homem-morre-apos-afogamento-itapoa',
    categorySlug: 'seguranca',
    featured: false,
    publishedAt: '2026-03-19T16:00:00Z',
    excerpt: 'Um homem de 46 anos, natural de Curitiba, faleceu em decorrência de afogamento registrado no domingo nas praias de Itapoá.',
    body: [
      { _type: 'block', _key: 'b1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'Um homem de 46 anos, natural de Curitiba (PR), faleceu nesta segunda-feira em decorrência de afogamento registrado no domingo em uma das praias de Itapoá.' }] },
      { _type: 'block', _key: 'b2', style: 'normal', children: [{ _type: 'span', _key: 's2', text: 'A vítima foi socorrida por banhistas e equipes do Corpo de Bombeiros, que realizaram manobras de reanimação no local. Ela foi encaminhada ao hospital em estado grave e não resistiu.' }] },
      { _type: 'block', _key: 'b3', style: 'normal', children: [{ _type: 'span', _key: 's3', text: 'O Corpo de Bombeiros reforça os alertas sobre os riscos do mar, especialmente fora dos postos de guarda-vidas e em condições de ondas fortes. Nunca entre no mar sozinho e respeite as bandeiras de sinalização.' }] },
      { _type: 'block', _key: 'b4', style: 'normal', children: [{ _type: 'span', _key: 's4', text: 'Em caso de emergência na praia, ligue imediatamente para o Corpo de Bombeiros pelo número 193.' }] },
    ],
    seoTitle: 'Afogamento causa morte em Itapoá',
    seoDescription: 'Homem de 46 anos falece após afogamento nas praias de Itapoá, SC. Bombeiros reforçam alertas de segurança.',
  },
]

async function seed() {
  console.log('🌱 Iniciando seed do CMS...\n')

  // 1. Criar categorias
  console.log('📁 Criando categorias...')
  const categoryIds = {}
  for (const cat of categories) {
    const doc = await client.createOrReplace({
      _id: `category-${cat.slug}`,
      _type: 'category',
      title: cat.title,
      slug: { _type: 'slug', current: cat.slug },
      description: cat.description,
    })
    categoryIds[cat.slug] = doc._id
    console.log(`  ✓ ${cat.title}`)
  }

  // 2. Criar autor
  console.log('\n👤 Criando autor...')
  const authorDoc = await client.createOrReplace({
    _id: 'author-redacao',
    ...author,
  })
  console.log(`  ✓ ${authorDoc.name}`)

  // 3. Criar artigos
  console.log('\n📰 Criando artigos...')
  for (const article of articles) {
    const doc = await client.createOrReplace({
      _id: `article-${article.slug}`,
      _type: 'article',
      title: article.title,
      slug: { _type: 'slug', current: article.slug },
      featured: article.featured,
      category: { _type: 'reference', _ref: categoryIds[article.categorySlug] },
      author: { _type: 'reference', _ref: authorDoc._id },
      publishedAt: article.publishedAt,
      excerpt: article.excerpt,
      body: article.body.map(block => ({ ...block, markDefs: [] })),
      seoTitle: article.seoTitle,
      seoDescription: article.seoDescription,
    })
    console.log(`  ✓ ${doc.title}`)
  }

  console.log('\n✅ Seed concluído!')
  console.log(`   ${categories.length} categorias`)
  console.log(`   1 autor`)
  console.log(`   ${articles.length} artigos`)
}

seed().catch(console.error)
