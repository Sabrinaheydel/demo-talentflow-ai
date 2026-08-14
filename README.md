# TalentFlow AI Dash

TalentFlow is a premium bilingual recruitment product demo built with Next.js, TypeScript, OpenNext, and Webflow Cloud. It demonstrates an AI-assisted hiring workspace designed around recruiter situational awareness, candidate prioritization, interview coordination, transparent actions, and decision support.

> **Portfolio demo:** candidate profiles, recruitment activity, product state, and Copilot outputs are simulated. TalentFlow does not currently process real candidate data or call a live AI provider.

## Product story

A recruiter can:

1. understand what changed and what needs attention from the dashboard
2. inspect the recruitment pipeline
3. review candidate evidence and risk
4. use the simulated Copilot to prepare the next decision
5. coordinate interviews and team actions
6. see explicit previews and visible results for meaningful actions

The primary demo narrative centers on Maya Chen and should remain consistent across the product.

## Core routes

- `/` — executive operational briefing
- `/pipeline` — recruitment pipeline
- `/candidate-profile` — candidate decision workspace
- `/copilot` — simulated AI recruitment Copilot
- `/interviews` — interview coordination
- `/team` — team and ownership context

## Architecture

- Next.js App Router
- React 19 + TypeScript
- shared deterministic demo data and lightweight client-side demo state
- server-side `/api/copilot` boundary returning deterministic simulated recommendations
- EN/FR localization
- OpenNext + Cloudflare/Wrangler configuration
- Webflow Cloud deployment
- GitHub for source control and review

The current public-demo architecture intentionally favors deterministic behavior, clarity, and maintainability over production ATS complexity.

## Repository structure

```text
src/
  app/
    api/copilot/route.ts
    page.tsx
    pipeline/
    candidate-profile/
    copilot/
    interviews/
    team/
  components/
  lib/
docs/
  docs/project-context.md
  product-operating-system.md
  production-readiness.md
.github/
  agents/
  workflows/quality.yml
next.config.ts
open-next.config.ts
webflow.json
wrangler.json
```

## Local development

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The deterministic demo currently requires **no secret API key**.

The app is available locally at `http://localhost:3000`.

## Build

```bash
npm run build
```

Pull requests and pushes to `main` run a clean-install + build quality gate through GitHub Actions.

## Observability

TalentFlow is being prepared for a dedicated PostHog project so product analytics, UX debugging, session replay, and client-side error tracking remain separated from other Agence 360 properties.

When that project is created, configure the variables documented in `.env.example` and `docs/production-readiness.md`.

## Deployment

- Deployment target: Webflow Cloud
- Runtime compatibility: OpenNext / Cloudflare
- Main deployable branch: `main`
- Structural work should be developed through branches and pull requests before merge

No production deployment is triggered by the production-readiness documentation changes themselves.

## Product and engineering documentation

- `docs/docs/project-context.md` — product vision, demo story, scope, decision logs, and sprint context
- `docs/product-operating-system.md` — product principles and operating rules
- `docs/production-readiness.md` — launch, repository, privacy, observability, and quality checklist

## Safety boundaries

TalentFlow is currently a portfolio demonstration, not a production applicant tracking system. Real authentication, production candidate databases, external ATS integrations, outbound communications, and live AI execution remain out of scope unless explicitly introduced in a future architecture phase.
