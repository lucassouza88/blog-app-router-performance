# Blog Next.js: otimização de performance

Exercício de performance front-end: medir, diagnosticar, otimizar e comparar. O projeto base é um blog simples feito com **Next.js 15 (App Router)**, com páginas estáticas geradas em build.

## Descrição do projeto

- **Home (`/`)**: lista os artigos em cards.
- **Artigo (`/artigos/[slug]`)**: página estática de cada artigo, com metadata dinâmica (SEO).
- **Dados**: `data/artigos.json`, lidos por `lib/artigos.ts`.
- **Stack**: Next.js 15.5, React 19, TypeScript. Sem bibliotecas extras, sem imagens de conteúdo e sem JavaScript próprio no cliente.

## Estrutura de pastas

```
app/                 rotas, layout e estilos globais
  artigos/[slug]/    página de cada artigo
data/                artigos.json
lib/                 acesso aos dados
types/               tipos TypeScript
reports/
  antes/             análise estática do código original (PDF)
  depois/            análise estática do código otimizado (PDF)
  lighthouse/
    antes/           relatórios do Lighthouse da versão original
    depois/          relatórios do Lighthouse da versão otimizada
```

## Como rodar

```bash
npm install
npm run build
npm start        # http://localhost:3000
```

> Sempre meça com o build de produção (`npm start`), nunca com `npm run dev`.

## Gargalos identificados (versão original, commit `4c49f84`)

| # | Gargalo | Detalhe |
|---|---------|---------|
| 1 | Arquivos sem uso | `app/page.module.css` (2,7 KB, nunca importado) e 5 SVGs em `public/` (3,3 KB, nenhum referenciado). São sobras do `create-next-app`. |
| 2 | Favicon pesado | 25,9 KB, por causa de um quadro PNG de 256x256 que o navegador não usa na aba. |
| 3 | CSS morto | Classe `.article` em `globals.css` sem uso. |
| 4 | Títulos duplicados | O layout tinha um `<h1>` fixo e a página de artigo tinha outro `<h1>`: dois `h1` na mesma página, o que prejudica SEO e acessibilidade. |
| 5 | `next.config.ts` vazio | Header `X-Powered-By` ativo e nenhuma opção explícita. |

## Melhorias aplicadas

1. **Código morto removido**: `page.module.css`, 5 SVGs de `public/` e a classe `.article`.
2. **Favicon recriado** só com os tamanhos 16, 32 e 48 px (de 25,9 KB para 15,1 KB).
3. **Hierarquia de títulos corrigida**: um único `h1` por página (home: "Artigos", com os cards em `h2`; artigo: o título do artigo).
4. **`next.config.ts`**: `poweredByHeader: false` e `compress: true`.
5. **Minificação de HTML, CSS e JS**: já é feita pelo `next build` em produção, sem etapa manual.

### Técnicas que não se aplicam a este projeto

O projeto não tem imagens de conteúdo, fontes externas nem bibliotecas pesadas. Por isso **conversão para WebP/AVIF, redimensionamento, `loading="lazy"` e troca de bibliotecas não foram aplicados**: não há onde aplicar sem inventar conteúdo. Se o blog ganhar capas nos artigos, o caminho é usar `next/image` (WebP/AVIF automático, `width`/`height` e lazy loading por padrão, `priority` só na imagem do topo).

## Comparativo antes e depois

### 1) Análise estática do código (medido)

Medições feitas sobre os arquivos do repositório. Detalhes nos PDFs de `reports/antes` e `reports/depois`.

| Métrica | Antes | Depois | Variação |
|---------|-------|--------|----------|
| Pasta `public/` | 3,3 KB (5 arquivos) | 0 KB | -3,3 KB |
| Favicon | 25,9 KB | 15,1 KB | -10,8 KB |
| CSS total | 3,3 KB (2 arquivos) | 0,6 KB (1 arquivo) | -2,7 KB |
| Arquivos sem uso | 6 (6,0 KB) | 0 | removidos |
| Fonte versionada (sem lock) | 39,7 KB | 23,1 KB | -16,6 KB |
| `h1` na página de artigo | 2 | 1 | corrigido |
| Header `X-Powered-By` | presente | removido | corrigido |

### 2) Lighthouse (medido)

Mediana de 3 execuções por página, modo Mobile, build de produção (`npm start`) e janela anônima do Chrome, com as mesmas condições nas duas versões. Os relatórios completos estão em `reports/lighthouse/antes` e `reports/lighthouse/depois`.

| Página | Métrica | Antes | Depois |
|--------|---------|-------|--------|
| Home | Performance (nota) | 95 | 97 |
| Home | FCP | 1,0 s | 1,0 s |
| Home | LCP | 1,9 s | 1,9 s |
| Home | TBT | 155 ms | 160 ms |
| Home | CLS | 0 | 0 |
| Home | Speed Index | 1,0 s | 1,0 s |
| Artigo | Performance (nota) | 95 | 97 |
| Artigo | Accessibility | 100 | 100 |
| Artigo | SEO | 100 | 100 |

**Como reproduzir**: `git checkout antes` (versão original, commit `4c49f84`), `npm install`, `npm run build`, `npm start` e rode o Lighthouse. Para o "depois", use `git checkout main` e repita.

### Quais mudanças tiveram mais impacto

- **Performance (95 para 97)**: a diferença de 2 pontos é pequena e fica na faixa de variação entre execuções. FCP, LCP, Speed Index e CLS não mudaram, e o TBT foi de 155 ms para 160 ms, também dentro dessa variação. Não dá para atribuir esse ganho a uma mudança específica. O que pesa no carregamento é o JavaScript do próprio React e do Next (cerca de 102 kB compartilhados), que este exercício não altera.
- **Accessibility e SEO**: já estavam em 100 na versão original e se mantiveram.
- **Arquivos removidos, favicon e `next.config.ts`**: reduziram o repositório e o favicon (de 25,9 KB para 15,1 KB), mas não aparecem como ganho no Lighthouse, porque os arquivos removidos nunca eram carregados pelas páginas.
- **Correção dos títulos (um único `h1` por página)**: melhora a estrutura semântica do HTML, mas o Lighthouse não apontava isso como problema, então não mudou as notas.

## Conclusão

Como o projeto já era enxuto (rotas estáticas, três dependências e sem imagens), o ganho medido no Lighthouse é pequeno e está dentro da variação das medições. Os ganhos concretos estão na limpeza do código e do repositório, documentados na análise estática. O resultado mostra que, em um projeto bem estruturado, o ponto de partida já é bom e as otimizações restantes são de baixo impacto. Para um ganho maior, o próximo passo seria acrescentar imagens com `next/image` (WebP/AVIF e lazy loading) e medir de novo.
