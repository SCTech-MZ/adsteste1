# SmartTools Hub

> **Simple Tools. Smart Solutions.**

Plataforma de ferramentas online gratuitas, escritas em português e executadas
inteiramente no navegador. Não existe backend, base de dados, autenticação nem
envio de dados para servidores: tudo é processado localmente com HTML5, CSS3 e
JavaScript (ES6+) sem frameworks nem bibliotecas externas.

- Site: `https://www.smarttoolshub.com`
- Contacto: `contacto@smarttoolshub.com`
- Idioma: português (pt-PT), pensado para leitores de todos os países lusófonos

---

## Índice

1. [Ferramentas disponíveis](#ferramentas-disponíveis)
2. [Funcionalidades](#funcionalidades)
3. [Estrutura do projeto](#estrutura-do-projeto)
4. [Como executar localmente](#como-executar-localmente)
5. [Como adicionar uma ferramenta](#como-adicionar-uma-ferramenta)
6. [Temas, acessibilidade e desempenho](#temas-acessibilidade-e-desempenho)
7. [SEO](#seo)
8. [Publicidade e analítica (opcional)](#publicidade-e-analítica-opcional)
9. [Publicação (deploy)](#publicação-deploy)
10. [Convenções de código](#convenções-de-código)
11. [Estado do projeto e roadmap](#estado-do-projeto-e-roadmap)

---

## Ferramentas disponíveis

| Ferramenta | Categoria | Página |
|---|---|---|
| Contador de Palavras e Caracteres | Texto | `ferramentas/contador-de-palavras.html` |
| Calculadora de Porcentagem | Calculadoras | `ferramentas/calculadora-de-porcentagem.html` |
| Formatador e Validador JSON | Programadores | `ferramentas/formatador-json.html` |
| Conversor de Unidades | Conversores | `ferramentas/conversor-de-unidades.html` |
| Calculadora de Idade | Calculadoras | `ferramentas/calculadora-de-idade.html` |

O diretório completo (`tools.html`) inclui ainda entradas marcadas como
**Em breve**, que servem de roadmap público e mantêm a organização por
categorias.

### Detalhes de cada ferramenta

- **Contador de Palavras** — palavras, caracteres (com e sem espaços), frases,
  parágrafos, linhas, tempo estimado de leitura e densidade das palavras mais
  frequentes. Atualização em tempo real com _debounce_.
- **Calculadora de Porcentagem** — quatro modos independentes: percentagem de
  um valor, que percentagem um valor representa, aumento e desconto, e variação
  percentual. Apresenta o cálculo passo a passo.
- **Formatador JSON** — formatação com indentação configurável, minificação,
  validação com deteção de erro (linha e coluna) e cópia rápida. Usa apenas
  `JSON.parse` / `JSON.stringify`, nunca `eval`.
- **Conversor de Unidades** — comprimento, massa, temperatura, área, volume e
  tempo, com fatores exatos e explicação da fórmula (incluindo as conversões de
  temperatura, que não são lineares).
- **Calculadora de Idade** — idade exata em anos, meses e dias segundo o
  calendário real, próximo aniversário, dias restantes e totais acumulados
  (dias, semanas, meses, horas), com validação de datas.

---

## Funcionalidades

- **Sem frameworks.** Apenas HTML semântico, CSS com variáveis e módulos ES.
- **Modo claro e escuro** com deteção da preferência do sistema e persistência
  em `localStorage` (chave `sth-theme`), sem _"flash"_ no carregamento.
- **Navegação responsiva** com cabeçalho fixo, menu _hamburger_ e sobreposição
  em mobile.
- **Pesquisa e filtros** no diretório, com sincronização do filtro no URL
  (`tools.html?categoria=...`) para permitir partilhar resultados.
- **Ícones SVG** embutidos (`assets/js/icons.js`) — sem emojis e sem pedidos
  externos.
- **Privacidade por omissão.** Nenhuma ferramenta transmite o conteúdo
  introduzido.
- **Acessibilidade.** `skip-link`, marcas ARIA, foco visível, navegação por
  teclado, regiões `aria-live` e suporte para `prefers-reduced-motion`.
- **Impressão.** Estilos dedicados para impressão das páginas de ferramenta.

---

## Estrutura do projeto

```
/
├── index.html                     # Página inicial
├── tools.html                     # Diretório de ferramentas (pesquisa + filtros)
├── about.html                     # Sobre Nós
├── contact.html                   # Contacto (formulário validado)
├── privacy-policy.html            # Política de Privacidade
├── terms.html                     # Termos de Utilização
├── 404.html                       # Página de erro
├── robots.txt                     # Diretivas para motores de busca
├── sitemap.xml                    # Mapa do site
├── ferramentas/                   # Uma página por ferramenta
│   ├── contador-de-palavras.html
│   ├── calculadora-de-porcentagem.html
│   ├── formatador-json.html
│   ├── conversor-de-unidades.html
│   └── calculadora-de-idade.html
├── blog/
│   ├── index.html                 # Índice do blog
│   └── posts/                     # Artigos
└── assets/
    ├── css/styles.css             # Sistema de design completo
    ├── img/                       # favicon, logo e imagem Open Graph (SVG)
    └── js/
        ├── icons.js               # Conjunto de ícones SVG + helper icon()
        ├── utils.js               # Utilitários partilhados
        ├── main.js                # Shell: tema, navegação, integrações
        ├── data/tools.js          # Registo de ferramentas (fonte única)
        ├── components/tool-card.js# Renderização de cartões
        ├── pages/                 # Controladores por página
        │   ├── home.js
        │   ├── tools-directory.js
        │   ├── tool-page.js
        │   └── contact.js
        └── tools/                 # Lógica de cada ferramenta
            ├── word-counter.js
            ├── percentage-calculator.js
            ├── json-formatter.js
            ├── unit-converter.js
            └── age-calculator.js
```

### Caminhos relativos e `data-base`

Cada página declara a sua profundidade no atributo `data-base` do `<body>`:

- páginas na raiz e `404.html` → `data-base=""`
- `ferramentas/*` → `data-base="../"`
- `blog/index.html` → `data-base="../"`
- `blog/posts/*` → `data-base="../../"`

Os caminhos no registo de ferramentas são relativos à raiz do projeto (sem
barra inicial) e são resolvidos com `urlFor()` / `resolveUrl()`. Isto permite
hospedar o site tanto na raiz do domínio como numa subpasta, sem alterar
ligações internas.

---

## Como executar localmente

Não existe processo de compilação. Como o projeto usa módulos ES (`<script
type="module">`), deve ser servido por HTTP e não aberto diretamente com
`file://`.

```bash
# Servir a pasta atual na porta 8000
python3 -m http.server 8000
```

Depois abra `http://localhost:8000/`.

Qualquer servidor estático funciona igualmente (Live Server do VS Code,
`npx serve`, `php -S localhost:8000`, Netlify, Vercel, GitHub Pages, etc.).

### Verificação rápida

1. Confirme que não há erros na consola do navegador.
2. Teste cada ferramenta com valores conhecidos.
3. Alterne o tema e navegue em larguras de 320 px a 1440 px.
4. Navegue apenas com o teclado (Tab, Enter, Escape) em todas as páginas.

---

## Como adicionar uma ferramenta

1. **Criar a página** em `ferramentas/<slug>.html`, seguindo a estrutura das
   páginas existentes (`data-base="../"`, três módulos: `main.js`,
   `pages/tool-page.js` e `tools/<nome>.js`).
2. **Criar a lógica** em `assets/js/tools/<nome>.js` e registá-la na página.
3. **Registar a ferramenta** em `assets/js/data/tools.js`: altere a entrada de
   `status: 'soon'` para `status: 'live'` e confirme `url`, `category`, `icon`,
   `keywords` e `order`.
4. **Adicionar ao sitemap** (`sitemap.xml`).
5. **Atualizar** o bloco `<noscript>` de `tools.html` e a lista em `about.html`,
   se aplicável.

Os cartões da página inicial, do diretório, as listas de “recentes”, os filtros
e os “relacionados” são todos gerados a partir do registo — não há HTML
duplicado para manter.

### Diretrizes de cálculo

- Valide sempre os dados de entrada e apresente mensagens claras em português.
- Não arredonde a meio processo: arredonde apenas na apresentação, usando
  `Intl.NumberFormat` com `LOCALE = 'pt-PT'`.
- Para casas decimais, aceite vírgula e ponto com `parseDecimal()`.
- Para datas provenientes de `<input type="date">`, use `parseLocalDate()` para
  evitar desvios de fuso horário.

---

## Temas, acessibilidade e desempenho

- **Design tokens** em `assets/css/styles.css` (`:root` para o tema claro e
  `[data-theme="dark"]` para o escuro). As cores derivam de variáveis, pelo que
  novos componentes herdam automaticamente os dois temas.
- **Foco visível** mantido em todos os controlos; a navegação do teclado segue a
  ordem lógica do documento.
- **`prefers-reduced-motion`** desativa transições e animações.
- **Sem dependências de rede** em runtime: nenhum tipo de letra, ícone ou
  _script_ externo é carregado por omissão.
- **Imagens em SVG**, leves e nítidas em qualquer resolução.

---

## SEO

- Título e `meta description` únicos por página.
- URL canónico por página e etiquetas Open Graph/Twitter.
- Dados estruturados JSON-LD: `WebSite`, `Organization`, `CollectionPage`,
  `SoftwareApplication` (ferramentas), `BlogPosting` (artigos), `AboutPage`,
  `ContactPage` e `FAQPage` onde aplicável.
- `sitemap.xml` e `robots.txt` na raiz (a página `404.html` está excluída da
  indexação).
- HTML semântico (`header`, `nav`, `main`, `article`, `aside`, `footer`) e
  hierarquia de cabeçalhos consistente.

---

## Publicidade e analítica (opcional)

As integrações são **opt-in** e ficam desativadas enquanto os identificadores
estiverem vazios. Configure-os em `assets/js/main.js`:

```js
export const SITE_CONFIG = {
  googleAnalyticsId: '', // ex.: 'G-XXXXXXXXXX'
  adsenseClientId: '',   // ex.: 'ca-pub-0000000000000000'
};
```

- **Analítica**: só é carregada se `googleAnalyticsId` corresponder ao formato
  `G-...`. Nenhum pedido é feito enquanto estiver vazio.
- **AdSense**: os contentores `.ad-slot[data-ad-slot]` estão reservados no HTML
  e só são preenchidos quando `adsenseClientId` é válido. Os espaços ficam
  sempre separados dos controlos e nunca condicionam funcionalidades.

A aprovação em redes publicitárias depende das respetivas políticas e não pode
ser garantida. As páginas de Privacidade e Termos estão incluídas para facilitar
esse processo.

---

## Publicação (deploy)

O site é 100 % estático. Basta publicar a pasta do projeto.

1. Ajuste o domínio em `SITE.baseUrl` (`assets/js/data/tools.js`), no
   `sitemap.xml`, no `robots.txt` e nas etiquetas canónicas/Open Graph.
2. Ative HTTPS (recomendado para a Clipboard API e para SEO).
3. Configure a página `404.html` como documento de erro do alojamento.
4. Se publicar numa subpasta, atualize os valores de `data-base` e os caminhos
   absolutos usados em `404.html`.

### Nota sobre `404.html`

Por funcionar em qualquer profundidade de URL, o `404.html` usa caminhos
absolutos (`/assets/...`). Num alojamento em subpasta, ajuste-os para caminhos
relativos.

---

## Convenções de código

- JavaScript em módulos ES, sem `var`, com `const`/`let` e funções pequenas.
- Sem comentários redundantes: o código deve explicar o “quê”; os comentários
  explicam o “porquê”.
- Nada de `eval`, `innerHTML` com dados do utilizador sem `escapeHtml()`.
- Preferir `textContent` em vez de `innerHTML` para conteúdo dinâmico.
- Texto da interface exclusivamente em português (pt-PT).
- Sem emojis na interface: usar os ícones SVG de `icons.js`.
- Cores sempre através das variáveis CSS, para suportar os dois temas.

---

## Estado do projeto e roadmap

**Versão 1.0** — cinco ferramentas publicadas, blog com cinco artigos, páginas
institucionais e legais, SEO e acessibilidade implementados. Sem backend,
autenticação ou pagamentos.

Planeadas para versões seguintes: conversor de maiúsculas/minúsculas, remoção de
linhas duplicadas, regra de três, IMC, juros simples, bases numéricas, cores,
unidades digitais, Base64, UUID, timestamp, gerador de senhas, comparador de
textos, cronómetro, QR Code, idade gestacional e fusos horários.

Sugestões são bem-vindas através da página de contacto.
