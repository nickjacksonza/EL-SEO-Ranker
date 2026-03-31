# EL-SEO-Ranker

**Stack:** React 18, TypeScript, Vite, Gemini API  
**Live:** https://projects.slash301.com/EL-SEO-Ranker/  
**Local:** `npm run dev` → http://localhost:5173  
**Env:** `GEMINI_API_KEY` in `.env.local`

## What it is
WordPress + Elementor + Rank Math SEO page builder tool. Helps structure and optimise content for SEO — generating page sections, keyword placement, and Rank Math-compatible content recommendations. Gemini-powered.

## Structure
- `App.tsx` — main shell
- `MainContent.tsx` — primary content area
- `components/` — 14 tsx files (likely: keyword inputs, content sections, scoring display, export)
- `constants.ts` / `types.ts` — SEO config and types

## State
Solid scope and utility. One of the more complex React projects. Targets a real workflow pain point (WP + Elementor + SEO toolchain is clunky). 14 components suggests meaningful feature depth.

## What needs work / next directions
- Check if Rank Math schema output is implemented end-to-end
- Actual content export to clipboard/file for pasting into WP
- Could integrate direct WP REST API push
- Mobile use case unlikely — desktop-only workflow tool is fine
