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

### 2) Lighthouse (a preencher com a medição no Chrome)

Preencha com a mediana de 3 execuções, no mesmo ambiente nas duas medições (build de produção, janela anônima, Mobile). Salve os relatórios em `reports/lighthouse/antes` e `reports/lighthouse/depois`.

| Página | Métrica | Antes | Depois |
|--------|---------|-------|--------|
| Home | Performance (nota) | _preencher_ | _preencher_ |
| Home | FCP | _preencher_ | _preencher_ |
| Home | LCP | _preencher_ | _preencher_ |
| Home | TBT | _preencher_ | _preencher_ |
| Home | CLS | _preencher_ | _preencher_ |
| Home | Speed Index | _preencher_ | _preencher_ |
| Artigo | Performance (nota) | _preencher_ | _preencher_ |
| Artigo | Accessibility / SEO | _preencher_ | _preencher_ |

**Como medir "antes"**: faça `git checkout 4c49f84`, rode `npm install`, `npm run build`, `npm start` e gere o relatório. **Para o "depois"**: volte para esta branch e repita os mesmos passos.

Para o "depois", cole aqui os prints dos relatórios e comente quais mudanças tiveram maior impacto.

## Conclusão

Como o projeto já era enxuto (rotas estáticas, três dependências e sem imagens), o ganho é pequeno em bytes e vem principalmente da limpeza, do favicon e da correção semântica dos títulos. O resultado mostra que, em um projeto bem estruturado, o ponto de partida já é bom e as otimizações restantes são de baixo impacto.
