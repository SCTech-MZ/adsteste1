/**
 * SmartTools Hub - Tools registry (single source of truth).
 *
 * Every tool card, filter chip, "recently added" list and "related tools"
 * block is generated from this file. To publish a new tool:
 *   1. create the page under /ferramentas/
 *   2. add an entry below with `status: 'live'` and the final `url`
 *   3. add the URL to /sitemap.xml
 *
 * Paths in `url` are relative to the project root (no leading slash) so the
 * site keeps working when hosted in a sub-directory. Components resolve them
 * with `resolveUrl()` using the `data-base` attribute of <body>.
 */

export const SITE = {
  name: 'SmartTools Hub',
  slogan: 'Simple Tools. Smart Solutions.',
  baseUrl: 'https://www.smarttoolshub.com',
  email: 'contacto@smarttoolshub.com',
};

export const CATEGORIES = [
  {
    id: 'texto',
    name: 'Ferramentas de Texto',
    short: 'Texto',
    icon: 'texto',
    description: 'Conte, transforme e organize palavras, frases e documentos diretamente no navegador.',
  },
  {
    id: 'calculadoras',
    name: 'Calculadoras',
    short: 'Calculadoras',
    icon: 'calculadora',
    description: 'Cálculos do dia a dia com resultados precisos, fórmulas explicadas e validação de dados.',
  },
  {
    id: 'conversores',
    name: 'Conversores',
    short: 'Conversores',
    icon: 'conversor',
    description: 'Converta unidades de medida, formatos e valores com fórmulas claras e resultados imediatos.',
  },
  {
    id: 'programadores',
    name: 'Ferramentas para Programadores',
    short: 'Programadores',
    icon: 'codigo',
    description: 'Utilitários para desenvolvimento: formatação de dados, codificação e geração de identificadores.',
  },
  {
    id: 'produtividade',
    name: 'Produtividade',
    short: 'Produtividade',
    icon: 'produtividade',
    description: 'Ferramentas que ajudam a organizar tarefas, gerar credenciais seguras e ganhar tempo.',
  },
  {
    id: 'praticas',
    name: 'Ferramentas Práticas',
    short: 'Práticas',
    icon: 'praticas',
    description: 'Soluções rápidas para situações concretas do dia a dia, sem instalações nem registos.',
  },
];

export const TOOLS = [
  /* ------------------------------ Live tools ----------------------------- */
  {
    id: 'contador-de-palavras',
    name: 'Contador de Palavras e Caracteres',
    shortName: 'Contador de Palavras',
    description: 'Conte palavras, caracteres, linhas e tempo estimado de leitura em tempo real.',
    category: 'texto',
    icon: 'texto',
    url: 'ferramentas/contador-de-palavras.html',
    status: 'live',
    featured: true,
    order: 60,
    keywords: ['contar palavras', 'caracteres', 'texto', 'linhas', 'leitura', 'word count', 'redação'],
  },
  {
    id: 'calculadora-de-porcentagem',
    name: 'Calculadora de Porcentagem',
    shortName: 'Calculadora de Porcentagem',
    description: 'Calcule percentagens, aumentos, descontos e variações com explicação passo a passo.',
    category: 'calculadoras',
    icon: 'percentagem',
    url: 'ferramentas/calculadora-de-porcentagem.html',
    status: 'live',
    featured: true,
    order: 55,
    keywords: ['percentagem', 'porcentagem', 'desconto', 'aumento', 'variação', 'percent', '%', 'matemática'],
  },
  {
    id: 'formatador-json',
    name: 'Formatador e Validador JSON',
    shortName: 'Formatador JSON',
    description: 'Formate, minifique e valide JSON com mensagens de erro claras e cópia rápida.',
    category: 'programadores',
    icon: 'codigo',
    url: 'ferramentas/formatador-json.html',
    status: 'live',
    featured: true,
    order: 50,
    keywords: ['json', 'formatar', 'validar', 'minificar', 'beautify', 'parse', 'api', 'desenvolvedor'],
  },
  {
    id: 'conversor-de-unidades',
    name: 'Conversor de Unidades',
    shortName: 'Conversor de Unidades',
    description: 'Converta comprimento, peso, temperatura e tempo entre várias unidades.',
    category: 'conversores',
    icon: 'conversor',
    url: 'ferramentas/conversor-de-unidades.html',
    status: 'live',
    featured: true,
    order: 45,
    keywords: ['conversor', 'unidades', 'metros', 'quilómetros', 'peso', 'temperatura', 'celsius', 'fahrenheit'],
  },
  {
    id: 'calculadora-de-idade',
    name: 'Calculadora de Idade',
    shortName: 'Calculadora de Idade',
    description: 'Descubra a sua idade exata em anos, meses e dias e o tempo até ao próximo aniversário.',
    category: 'calculadoras',
    icon: 'calendario',
    url: 'ferramentas/calculadora-de-idade.html',
    status: 'live',
    featured: true,
    order: 40,
    keywords: ['idade', 'aniversário', 'anos', 'meses', 'dias', 'data de nascimento', 'idade exata'],
  },

  /* ---------------------------- Upcoming tools --------------------------- */
  {
    id: 'conversor-de-maiusculas',
    name: 'Conversor de Maiúsculas e Minúsculas',
    shortName: 'Maiúsculas e Minúsculas',
    description: 'Transforme texto em maiúsculas, minúsculas ou formato de título.',
    category: 'texto',
    icon: 'maiusculas',
    url: 'ferramentas/conversor-de-maiusculas.html',
    status: 'soon',
    order: 20,
    keywords: ['maiúsculas', 'minúsculas', 'capitalizar', 'texto'],
  },
  {
    id: 'removedor-de-duplicados',
    name: 'Removedor de Linhas Duplicadas',
    shortName: 'Linhas Duplicadas',
    description: 'Remova linhas repetidas e espaços extra de listas e ficheiros de texto.',
    category: 'texto',
    icon: 'tabela',
    url: 'ferramentas/removedor-de-duplicados.html',
    status: 'soon',
    order: 19,
    keywords: ['duplicados', 'linhas', 'lista', 'limpar texto'],
  },
  {
    id: 'calculadora-regra-de-tres',
    name: 'Calculadora de Regra de Três',
    shortName: 'Regra de Três',
    description: 'Resolva regras de três simples e compostas com o passo a passo.',
    category: 'calculadoras',
    icon: 'percentagem',
    url: 'ferramentas/calculadora-regra-de-tres.html',
    status: 'soon',
    order: 18,
    keywords: ['regra de três', 'proporção', 'matemática'],
  },
  {
    id: 'calculadora-de-imc',
    name: 'Calculadora de IMC',
    shortName: 'Calculadora de IMC',
    description: 'Calcule o índice de massa corporal a partir do peso e da altura.',
    category: 'calculadoras',
    icon: 'saude',
    url: 'ferramentas/calculadora-de-imc.html',
    status: 'soon',
    order: 17,
    keywords: ['imc', 'massa corporal', 'saúde', 'peso', 'altura'],
  },
  {
    id: 'calculadora-de-juros',
    name: 'Calculadora de Juros Simples',
    shortName: 'Juros Simples',
    description: 'Estime juros simples e montante final a partir de capital, taxa e prazo.',
    category: 'calculadoras',
    icon: 'financas',
    url: 'ferramentas/calculadora-de-juros.html',
    status: 'soon',
    order: 16,
    keywords: ['juros', 'finanças', 'investimento', 'capital', 'taxa'],
  },
  {
    id: 'conversor-de-bases',
    name: 'Conversor de Bases Numéricas',
    shortName: 'Bases Numéricas',
    description: 'Converta números entre binário, octal, decimal e hexadecimal.',
    category: 'conversores',
    icon: 'hash',
    url: 'ferramentas/conversor-de-bases.html',
    status: 'soon',
    order: 15,
    keywords: ['binário', 'hexadecimal', 'octal', 'decimal', 'bases'],
  },
  {
    id: 'conversor-de-cores',
    name: 'Conversor de Cores',
    shortName: 'Conversor de Cores',
    description: 'Converta cores entre HEX, RGB e HSL e pré-visualize o resultado.',
    category: 'conversores',
    icon: 'cor',
    url: 'ferramentas/conversor-de-cores.html',
    status: 'soon',
    order: 14,
    keywords: ['cor', 'hex', 'rgb', 'hsl', 'design'],
  },
  {
    id: 'conversor-de-ficheiros',
    name: 'Conversor de Unidades Digitais',
    shortName: 'Unidades Digitais',
    description: 'Converta bytes, kilobytes, megabytes, gigabytes e terabytes.',
    category: 'conversores',
    icon: 'caixa',
    url: 'ferramentas/conversor-de-ficheiros.html',
    status: 'soon',
    order: 13,
    keywords: ['bytes', 'mb', 'gb', 'armazenamento', 'digital'],
  },
  {
    id: 'base64',
    name: 'Codificador Base64',
    shortName: 'Base64',
    description: 'Codifique e descodifique texto em Base64 sem enviar dados para servidores.',
    category: 'programadores',
    icon: 'codigo',
    url: 'ferramentas/base64.html',
    status: 'soon',
    order: 12,
    keywords: ['base64', 'codificar', 'descodificar', 'encode', 'decode'],
  },
  {
    id: 'gerador-de-uuid',
    name: 'Gerador de UUID',
    shortName: 'Gerador de UUID',
    description: 'Gere identificadores únicos (UUID v4) para bases de dados e APIs.',
    category: 'programadores',
    icon: 'hash',
    url: 'ferramentas/gerador-de-uuid.html',
    status: 'soon',
    order: 11,
    keywords: ['uuid', 'guid', 'identificador', 'aleatório'],
  },
  {
    id: 'timestamp',
    name: 'Conversor de Timestamp',
    shortName: 'Timestamp',
    description: 'Converta datas para Unix timestamp e vice-versa em vários fusos.',
    category: 'programadores',
    icon: 'relogio',
    url: 'ferramentas/timestamp.html',
    status: 'soon',
    order: 10,
    keywords: ['timestamp', 'unix', 'epoch', 'data', 'hora'],
  },
  {
    id: 'gerador-de-senhas',
    name: 'Gerador de Senhas Seguras',
    shortName: 'Gerador de Senhas',
    description: 'Crie senhas fortes e aleatórias com controlo de comprimento e símbolos.',
    category: 'produtividade',
    icon: 'seguranca',
    url: 'ferramentas/gerador-de-senhas.html',
    status: 'soon',
    order: 9,
    keywords: ['senha', 'password', 'segurança', 'aleatória', 'gerador'],
  },
  {
    id: 'comparador-de-textos',
    name: 'Comparador de Textos',
    shortName: 'Comparador de Textos',
    description: 'Compare dois textos e destaque as diferenças linha a linha.',
    category: 'produtividade',
    icon: 'documento',
    url: 'ferramentas/comparador-de-textos.html',
    status: 'soon',
    order: 8,
    keywords: ['diff', 'comparar', 'texto', 'diferenças'],
  },
  {
    id: 'cronometro',
    name: 'Cronómetro e Temporizador',
    shortName: 'Cronómetro',
    description: 'Meça intervalos de tempo ou conte decrescente para uma tarefa.',
    category: 'produtividade',
    icon: 'relogio',
    url: 'ferramentas/cronometro.html',
    status: 'soon',
    order: 7,
    keywords: ['cronómetro', 'temporizador', 'timer', 'tempo', 'produtividade'],
  },
  {
    id: 'gerador-de-qrcode',
    name: 'Gerador de QR Code',
    shortName: 'QR Code',
    description: 'Crie códigos QR a partir de textos e ligações para partilhar rapidamente.',
    category: 'praticas',
    icon: 'qrcode',
    url: 'ferramentas/gerador-de-qrcode.html',
    status: 'soon',
    order: 6,
    keywords: ['qr code', 'código', 'link', 'partilhar'],
  },
  {
    id: 'calculadora-gestacional',
    name: 'Calculadora de Idade Gestacional',
    shortName: 'Idade Gestacional',
    description: 'Estime a idade gestacional e a data provável do parto.',
    category: 'praticas',
    icon: 'calendario',
    url: 'ferramentas/calculadora-gestacional.html',
    status: 'soon',
    order: 5,
    keywords: ['gestação', 'gravidez', 'semanas', 'parto'],
  },
  {
    id: 'fuso-horario',
    name: 'Conversor de Fuso Horário',
    shortName: 'Fuso Horário',
    description: 'Compare horas entre cidades e planeie reuniões em diferentes fusos.',
    category: 'praticas',
    icon: 'mundo',
    url: 'ferramentas/fuso-horario.html',
    status: 'soon',
    order: 4,
    keywords: ['fuso horário', 'timezone', 'hora mundial', 'reunião'],
  },
];

/** Resolve a root-relative project path against the current page base. */
export function resolveUrl(url, base = '') {
  return base + url;
}

export function getCategory(id) {
  return CATEGORIES.find((category) => category.id === id) || null;
}

export function getTool(id) {
  return TOOLS.find((tool) => tool.id === id) || null;
}

export function liveTools() {
  return TOOLS.filter((tool) => tool.status === 'live');
}

export function featuredTools(limit = 6) {
  return TOOLS.filter((tool) => tool.status === 'live' && tool.featured).slice(0, limit);
}

export function recentTools(limit = 4) {
  return TOOLS.filter((tool) => tool.status === 'live')
    .slice()
    .sort((a, b) => b.order - a.order)
    .slice(0, limit);
}

export function toolsByCategory(categoryId) {
  return TOOLS.filter((tool) => tool.category === categoryId);
}

export function countByCategory(categoryId) {
  return toolsByCategory(categoryId).length;
}

/** Tools of the same category first, then other live tools. */
export function relatedTools(id, limit = 3) {
  const tool = getTool(id);
  if (!tool) return [];
  const sameCategory = TOOLS.filter(
    (item) => item.id !== id && item.category === tool.category && item.status === 'live',
  );
  const others = liveTools().filter(
    (item) => item.id !== id && item.category !== tool.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export default TOOLS;
