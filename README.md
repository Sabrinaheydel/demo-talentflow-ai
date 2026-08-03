# TalentFlow AI Dash

TalentFlow is a premium bilingual recruitment demo built with Next.js, OpenNext, and Webflow Cloud. It showcases an AI-assisted hiring workspace with a dashboard, candidate profile, recruitment pipeline, and copilot experience for modern recruiting teams.

> Demo disclaimer: candidate profiles, pipeline activity, and AI outputs shown in this experience are simulated for product presentation and demo purposes.

## Routes

- `/` — executive dashboard overview
- `/pipeline` — interactive Kanban-style recruitment pipeline
- `/candidate-profile` — premium candidate profile experience
- `/copilot` — AI recruitment copilot workspace

## Architecture

- Next.js App Router for the UI shell and route structure
- React components for reusable dashboard, pipeline, and copilot experiences
- Local lightweight language state for EN/FR switching without extra i18n dependencies
- OpenNext + Cloudflare/Wrangler configuration for Webflow Cloud deployment compatibility

## Project structure

```text
src/
  app/
    page.tsx
    pipeline/page.tsx
    candidate-profile/page.tsx
    copilot/page.tsx
  components/
    dashboard/
    layout/
    recruitment/
    copilot/
    ui/
  lib/
    i18n.tsx
next.config.ts
open-next.config.ts
package.json
webflow.json
wrangler.json
```

## Local development

```bash
npm install
npm run dev
```

The app will be available at http://localhost:3000.

## Build

```bash
npm run build
```

## Deployment notes

- The project is configured for Webflow Cloud using the existing Next.js + OpenNext + Wrangler setup.
- The current deployment target is the repository’s main branch.
- No deployment has been executed from this session.
- Keep the existing visual design intact when making changes for production.
