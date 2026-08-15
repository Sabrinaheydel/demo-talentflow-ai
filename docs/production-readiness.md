# TalentFlow AI — Production Readiness

## Purpose

TalentFlow is a public portfolio demo of an AI-assisted recruitment workspace. Production readiness for this repository means the demo is reliable, observable, understandable, safe to publish, and easy to maintain.

It does **not** mean TalentFlow is currently a production ATS handling real candidate data.

## Current product mode

- Public portfolio demonstration
- Deterministic simulated recruitment data
- Deterministic simulated Copilot responses
- No real authentication
- No production database
- No external ATS integration
- No live candidate data
- No outbound email delivery
- No live LLM provider required for the current demo

These boundaries are intentional and should remain visible in product copy and technical documentation.

## Architecture

```text
Browser
  ↓
Next.js App Router
  ↓
Shared demo data + client-side demo state
  ↓
Server-side /api/copilot boundary
  ↓
Deterministic simulated Copilot response

Deployment
  GitHub → Webflow Cloud / OpenNext / Cloudflare
```

## Repository and release discipline

- `main` is the deployable baseline.
- Meaningful changes should be developed on a branch and reviewed through a pull request.
- The build check must pass before merging.
- Production deployment should not be triggered from experimental branches unless intentionally previewing a change.
- Avoid direct edits to `main` for structural or cross-screen product work.

## Environment variables

### Current demo

No secret environment variable is required for the deterministic Copilot.

### PostHog

When the dedicated TalentFlow PostHog project is created, configure:

```bash
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

The PostHog project token is intended for client-side analytics. Personal API keys and other privileged credentials must never be exposed through `NEXT_PUBLIC_*` variables.

### Future live AI mode

A future provider key must be server-only and must not be added until live AI mode is intentionally implemented. The current codebase must not imply that a live provider is active when responses are simulated.

## Observability plan

### Phase 1 — PostHog

Use a dedicated **TalentFlow** PostHog project rather than mixing demo telemetry with Agency website or Radar analytics.

Initial objectives:

- page views and navigation paths
- feature usage and important interactions
- guided demo starts/completions
- language switching
- Copilot usage
- action-preview and action-confirmation usage
- client-side exception tracking
- session replay for UX debugging, subject to privacy settings

### Phase 2 — Error quality

Once PostHog is active:

- confirm unhandled browser exceptions are captured
- review recurring issues
- add source maps if minified stack traces are not actionable
- set sensible billing/usage limits
- avoid capturing unnecessary console noise

### Phase 3 — Optional Sentry

Add Sentry only if PostHog error tracking is insufficient for the debugging depth required. Avoid duplicating monitoring tools without a clear need.

## Privacy and demo-data rules

- Keep all candidate identities and data fictional/simulated.
- Never add real candidate PII to the public repository or telemetry.
- Do not capture sensitive free-text content unnecessarily in analytics.
- Review session replay masking before public promotion.
- Keep all secrets out of client-side bundles and source control.

## Public-launch checklist

### Product

- [ ] Core demo story works end to end
- [ ] Maya Chen narrative is consistent across screens
- [ ] EN/FR UI contains no mixed-language states
- [ ] Guided Demo and Reset Demo are reliable
- [ ] High-impact actions show preview before execution
- [ ] Action results expose visible state changes
- [ ] Demo disclosure is clear

### Quality

- [ ] `npm ci` succeeds
- [ ] `npm run build` succeeds
- [ ] No critical console errors
- [ ] Desktop, tablet, and mobile reviewed
- [ ] Loading, empty, success, and error states reviewed
- [ ] Navigation and deep links work

### Observability

- [ ] Dedicated TalentFlow PostHog project exists
- [ ] PostHog variables configured in Webflow Cloud
- [ ] Page views arrive in PostHog
- [ ] Important product events are defined intentionally
- [ ] Error tracking verified
- [ ] Session replay privacy settings reviewed

### Repository

- [ ] README reflects the actual product mode
- [ ] No secrets committed
- [ ] CI build check passes
- [ ] Pull request summarizes architecture and product impact
- [ ] Duplicate/obsolete repository removed or archived

## Definition of ready

TalentFlow is ready for portfolio publication when a first-time visitor can understand the product independently, complete the guided story without broken states, and the repository can build from a clean install while analytics and error monitoring provide enough visibility to diagnose failures.
