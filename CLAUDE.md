# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

PM Toolbox is a Next.js 14 (App Router) static site that displays PMBOK project management tools and provides AI-powered tool recommendations.

### Data Layer

- `data/tools.json` — 39 PM tools, each with: slug, name, processGroup (启动/规划/执行/监控/收尾), knowledgeArea (范围/时间/成本/质量/资源/沟通/风险/采购/干系人/整合), summary, description, steps[], scenarios[], template
- `src/lib/tools.ts` — `Tool` interface and query functions (`getAllTools`, `getToolBySlug`, `searchTools`, `getRelatedTools`, etc.)

### Page Routes (App Router)

| Route | Render | Description |
|-------|--------|-------------|
| `/` | Static | Homepage with hero, feature cards, hot tools |
| `/knowledge` | Static | Matrix view (process group × knowledge area) + search + filters |
| `/knowledge/[slug]` | SSG | Tool detail page (breadcrumb, steps, scenarios, template, related tools) |
| `/ai-recommend` | Static | Chat interface for AI tool recommendations |
| `/api/recommend` | Dynamic (POST) | AI recommendation API endpoint |

### AI Recommendation Flow

`/api/recommend` accepts `{ question: string }` and returns `{ reasoning, tools[] }`.

Priority chain: `DEEPSEEK_API_KEY` → `OPENAI_API_KEY` → `ANTHROPIC_API_KEY` → keyword-based fallback.

The fallback uses Chinese keyword matching against 9 knowledge area keyword sets (风险/范围/时间/成本/质量/资源/沟通/干系人/采购).

### Components

- `Header` — sticky nav with SearchBar, mobile hamburger menu
- `Footer` — simple branding footer
- `SearchBar` — client component, submits to `/knowledge?q=`
- `ToolCard` — link card showing tool name, summary, process group, knowledge area badges
- `MatrixView` — renders tools grouped by process group, each group showing knowledge area columns
- `ChatInterface` — client component, chat UI that POSTs to `/api/recommend` and displays recommended tool cards

### Styling

Tailwind CSS with a custom `primary` color palette (blue: 50–900). The theme is defined in `tailwind.config.ts`.

## Deployment

Deployed on Vercel (account: goldwish1), connected to GitHub repo `goldwish1/pm-toolbox`. Every push to `main` triggers automatic deployment.

Environment variable required for AI recommendations:
- `DEEPSEEK_API_KEY` — DeepSeek API key (model: `deepseek-chat`)

## Design Docs

- Spec: `docs/superpowers/specs/2026-06-12-pm-toolbox-design.md`
- Plan: `docs/superpowers/plans/2026-06-12-pm-toolbox-plan.md`
