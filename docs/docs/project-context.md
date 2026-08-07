# PROJECT CONTEXT

Project name:
TalentFlow AI

Status:
Active development / portfolio demo

---

# 1. Product Vision

TalentFlow AI is an AI-assisted recruitment workspace designed to help recruitment teams centralize candidate information, prioritize actions, coordinate interviews and make clearer hiring decisions.

The public version is a portfolio demonstration using coherent simulated data.

The architecture should remain compatible with a future live AI/API mode.

---

# 2. Business Problem

Recruitment teams often manage:

- candidate information
- interviews
- notes
- feedback
- emails
- decisions
- follow-up actions

across multiple disconnected tools.

This creates:

- fragmented information
- unnecessary context switching
- slow decision making
- inconsistent follow-up
- missing feedback
- poor visibility on priorities

---

# 3. Core Users

Primary users:

- Recruiters
- Talent Acquisition Managers
- Hiring Managers

Secondary users:

- Team Leads
- HR Operations
- Interviewers

---

# 4. Main User Goals

Users need to:

- understand what requires attention
- see candidate progression
- prioritize candidates
- prepare interviews
- collect feedback
- compare candidates
- decide next actions
- communicate clearly with candidates

---

# 5. MVP Scope

Current baseline:

- Dashboard
- Candidate pipeline
- Candidate profile
- Interviews
- Team
- AI Copilot simulation
- FR / EN localization
- Coherent demo data
- Responsive experience

Final public portfolio MVP (recommended):

A recruiter or hiring manager should be able to navigate TalentFlow independently for the first time and understand the product within a few minutes without verbal explanation.

Must Have:

- Clear end-to-end recruiting story from overview to action
- Consistent candidate data across dashboard, pipeline, profile, interviews, team and Copilot
- Strong interview and team coordination surfaces
- Functional FR / EN localization with no broken or mixed-language UI
- Simulated Copilot that produces recruiter-ready recommendations, evidence and next steps
- Guided Demo and Reset Demo flows that make the experience self-explanatory
- Clear onboarding that explains the product is a fictional demo experience with simulated AI
- Responsive experience on desktop, tablet and mobile
- Clear primary actions and empty/error states on each core screen

Should Have:

- More realistic interaction patterns such as rescheduling, sending briefs and updating follow-ups
- More polished onboarding and transition states between screens
- Better visual clarity around urgency, confidence and candidate prioritization

Could Have:

- Live AI API switch architecture
- Additional analytics and workflow depth
- More immersive demo storytelling and richer scenario branching

Out of Scope:

- Real authentication
- Production database
- Real integrations with external recruiting tools
- Live candidate data ingestion
- Complex multi-tenant or enterprise workflow administration

Current gaps to close before public launch:

- Cross-page data consistency still needs to be tightened around Maya Chen and the core recruiting narrative
- The guided demo and reset experience should feel more deliberate and less manual
- Some interactions still feel static and should better reflect real recruiter behavior
- Copilot output should feel more concrete and decision-oriented for recruiter use

---

# 6. Product Principles

Follow:

docs/product-operating-system.md

Key principles:

- business problem first
- simplicity over feature accumulation
- one primary job per screen
- AI only where it creates real value
- coherent workflows
- MVP before complexity
- build for adoption
- design for iteration

---

# 7. Demo Story

Primary guided demo:

Dashboard
↓
Pipeline
↓
Maya Chen profile
↓
Copilot
↓
Interview preparation
↓
Team coordination

The demo should demonstrate:

- visibility over hiring priorities
- clear candidate prioritization
- evidence-based evaluation
- interview preparation and follow-up planning
- AI-assisted decision support
- a smooth recruiting workflow that feels credible and understandable in under a few minutes

The product should tell a simple story:

A recruiter sees the pipeline, understands the candidate context, uses AI to prepare next steps, and aligns the team around a decision.

---

# 8. Core Demo Candidate

Name:
Maya Chen

Role:
Senior Product Designer

Match Score:
96%

Priority:
High

Current Stage:
Final Interview

Hiring Probability:
82%

Interview Focus:

- leadership
- product strategy
- design systems
- ambiguous requirements

Main Risks:

- limited enterprise experience
- salary expectations above target range

All pages must remain consistent with this data.

---

# 9. Technical Context

Current stack:

- Next.js App Router
- React
- TypeScript
- GitHub
- Cloudflare / Webflow Cloud deployment
- simulated data
- simulated Copilot via a server route boundary

## 9.1 Executive architecture summary

The architecture for the final public demo should prioritize clarity, consistency and maintainability over feature depth. The product should feel complete to a first-time recruiter without requiring explanation, while still remaining easy to evolve toward a future live-AI experience.

The recommended architecture is a thin, polished frontend with a single shared demo-data layer, a simple client-side state model, and one secure server-side Copilot boundary. This keeps the public demo deterministic and low-risk while preserving a clean path to a real LLM provider later.

## 9.2 Recommended architecture

Recommended structure:

- A presentation layer for Dashboard, Pipeline, Candidate Profile, Interviews, Team and Copilot.
- A shared demo-data model used consistently by all pages.
- A lightweight state layer for UI state such as filters, selected candidate, active view, toast state, modal state and guided-demo progress.
- One server-side Copilot endpoint that handles request validation, provider selection, response shaping and security checks.
- A simple environment-based switch between demo mode and future live mode.

This approach keeps the architecture easy to reason about, avoids duplicated logic and supports future provider changes without redesigning the UI.

## 9.3 Shared demo-data strategy

The architecture must use one single source of truth for the demo narrative.

Shared entities:

- candidates
- recruiter names
- roles
- match scores
- interview status
- priorities
- pipeline stages
- Copilot context

Recommended approach:

- Keep a canonical demo dataset in one shared module or data service.
- All pages should read from that same source rather than maintaining page-local copies.
- The data should be typed and versioned so that changes remain coherent across Dashboard, Pipeline, Candidate Profile, Interviews, Team and Copilot.
- Copilot context should be derived from the same data model rather than built independently per view.

This is the most important architectural decision for public demo consistency.

## 9.4 State-management strategy

Recommended state model:

- Global UI state for navigation, language selection, demo mode and guided-tour state.
- Page-level state for local interactions such as filter panels, selected interview cards, expanded panels and modal visibility.
- Derived state for values that are calculated from the shared demo data, such as candidate priority views, interview summaries and Copilot-ready context.

Preferred pattern:

- Keep state simple and local where possible.
- Avoid overcomplicated global state for a small portfolio product.
- Prefer explicit props and shared hooks over distributed state duplication.

## 9.5 Guided Demo architecture

The guided demo should be a lightweight, optional flow that enhances understanding without blocking navigation.

Recommended behavior:

- The user can start the tour voluntarily from a visible entry point.
- The current step is visually highlighted.
- The user can skip, exit or continue at any time.
- The flow should not block regular navigation or prevent exploration.
- The tour should support EN and FR content through the same localization system.
- The tour should be implemented using a simple step-based controller with no external paid dependency.

Recommended flow:

Dashboard
→ Pipeline
→ Maya Chen
→ Copilot
→ Interview

The guided demo should be driven by a small step registry and a shared progress state.

## 9.6 Reset Demo architecture

Reset must restore the full demo experience to a known baseline.

Reset should restore:

- filters
- local UI state
- demo interactions
- prepared interview states
- feedback request states
- Copilot demo context
- guided-tour state

Recommended approach:

- Keep a single reset handler that rehydrates the base demo state from the canonical demo-data source.
- Reset should be deterministic and predictable.
- The same reset path should be used by both manual reset and onboarding restart actions.

## 9.7 Copilot simulation / live architecture

The architecture should separate the public demo experience from the future live AI path.

Public demo mode:

- DEMO_MODE=true
- deterministic simulated responses
- no paid API dependency
- fully safe for public exploration

Future live mode:

- DEMO_MODE=false
- real LLM provider selected server-side
- no client-side API keys
- no public exposure of secrets

Recommended interface and flow:

- Frontend sends a normalized request contract to a single server-side Copilot endpoint.
- The server endpoint selects the provider based on configuration.
- The response is normalized into a stable UI contract before rendering.

Recommended contract:

- userMessage
- selectedAction
- language
- candidateContext

Recommended prompt-context structure:

- candidate profile summary
- current stage and priority
- role and recruiting context
- known risks
- current language
- selected action intent

The public version must remain free of paid API dependence.

## 9.8 Localization strategy

Localization should be treated as a first-class architecture concern.

Recommended approach:

- Store UI copy in a centralized translation layer rather than in component-level hard-coded strings.
- Ensure all core screens use the same translation keys for shared labels and status values.
- Prevent mixed FR/EN content by enforcing one language source per view.
- Keep date, time and status formatting consistent across all pages.
- Use the same copy model for guided-demo steps, toast messages, empty states and Copilot responses.

## 9.9 Deployment strategy

The public demo should be deployed as a simple, stable web application with minimal operational complexity.

Recommended deployment structure:

- Next.js application deployed through the existing Cloudflare / Webflow-compatible hosting path.
- Environment-based configuration for demo mode and future live-mode toggles.
- Static or server-rendered shell plus dynamic route content.
- No secret material in frontend configuration.

Recommended public-demo behavior:

- clear demo disclaimer
- deterministic content
- no accidental live API execution
- no private credentials exposed
- safe defaults for public users

## 9.10 Security considerations

- Keep all provider credentials and API keys server-side only.
- Never expose secrets in environment variables bundled into the frontend.
- Validate and constrain Copilot requests on the server.
- Use environment flags to prevent live provider calls in public demo mode.
- Keep the public experience read-only and safe by default.

## 9.11 Cost implications

- The public portfolio demo should not require a paid API.
- The architecture should support future live AI only through an explicit opt-in configuration.
- Any real LLM integration should be gated behind secure server-side configuration and monitored usage limits.

## 9.12 Risks

- Data drift across screens if the shared dataset is not treated as a single source of truth.
- Guided demo complexity if the flow is implemented as ad hoc navigation logic.
- Reset behavior becoming inconsistent if UI state is not fully centralized.
- Copilot behavior becoming hard to maintain if simulation and live mode are mixed together in the frontend.
- Localization regressions if copy remains scattered across components.

## 9.13 Recommended implementation order for the AI Product Builder

1. Establish the shared demo-data layer and typed data contract.
2. Standardize state handling for common UI concerns and demo resets.
3. Implement the guided-demo controller and step-based navigation.
4. Wire Copilot through the single server-side boundary in demo mode.
5. Add localization infrastructure and replace hard-coded strings.
6. Validate demo readiness across desktop, tablet and mobile.
7. Prepare deployment configuration and demo-safe environment flags.

## 9.14 Architecture Definition of Done

The architecture is complete when:

- the same demo data is coherent across all core screens
- the guided demo works in EN and FR without blocking normal navigation
- reset restores the full demo to a known starting state
- Copilot is deterministic in demo mode and cleanly separable from future live mode
- localization is centralized and consistent
- deployment is safe, predictable and free from exposed secrets
- the public demo can be understood and explored without technical support

---

# 10. Demo Mode

Public mode:

DEMO_MODE=true

Characteristics:

- simulated AI
- fictional data
- stable behavior
- no API cost
- safe public exploration

Future private/live mode:

DEMO_MODE=false

Characteristics:

- real LLM API
- limited usage
- controlled access
- interview/demo use

---

# 11. UX Expectations

The product should feel:

- premium
- minimal
- modern SaaS
- clear
- fast
- trustworthy

Design inspiration:

- Linear
- Ashby
- Notion
- Stripe
- Vercel

Avoid:

- visual clutter
- unnecessary animations
- feature overload
- inconsistent components
- unclear calls to action

---

# 12. Current Roadmap

1. Finalize core cross-page data consistency across dashboard, pipeline, profile, interviews, team and Copilot
2. Strengthen interview and team workflow clarity
3. Complete FR/EN localization and remove mixed or incomplete text
4. Improve buttons, states, transitions and CTA clarity
5. Make Copilot outputs more recruiter-ready and action-oriented
6. Add onboarding, Guided Demo and Reset Demo experiences
7. Run desktop, tablet and mobile QA for the full public demo flow
8. Prepare public deployment and demo script
9. Add simulation/API switch architecture for future live AI compatibility
10. Optionally introduce a live AI API in a later phase

---

# 13. Known Limitations

Current version:

- AI is simulated
- data is fictional
- no real authentication
- no production database
- some interactions remain intentionally demo-oriented

These limitations must never be hidden in recruiter-facing material.

They should be framed clearly as intentional demo architecture choices, and the product should still feel complete, trustworthy and understandable even with those constraints.

---

# 14. Implementation Status

## Interaction & Product Behavior sprint

Status:
- Implemented core demo-safe interactions across the main recruiting workflow

Files modified:
- src/app/layout.tsx
- src/lib/demoExperience.tsx
- src/app/page.tsx
- src/app/candidate-profile/page.tsx
- src/components/recruitment/InterviewsPage.tsx
- src/components/recruitment/TeamPage.tsx
- src/components/copilot/CopilotWorkspace.tsx
- src/app/globals.css
- src/lib/demoData.ts

Interactions completed:
- Added a shared demo-experience state layer so actions now affect multiple screens coherently
- Enabled schedule, prepare, feedback-request and completion actions to update the recruiting story immediately
- Wired candidate-profile actions to reflect interview preparation, feedback requests and completion state
- Made the Interviews workspace update its visible state and feed the shared demo narrative
- Made the Team module react to assignment, preparation and feedback actions with visible demo feedback
- Added visible story-state indicators on Dashboard and Candidate Profile so the demo flow feels active and deterministic
- Kept the experience demo-safe by avoiding any real backend or external system calls

Build status:
- Production build validated successfully after the interaction sprint work

Remaining technical limitations:
- The experience remains intentionally demo-only and uses simulated data
- The shared demo-state layer is client-side only and is designed for portfolio demonstration rather than persistence or production workflows
- Some interactions remain lightweight by design to keep the product understandable and deterministic

Demo-only behavior:
- All primary recruiting interactions now produce visible feedback, local state updates and coherent cross-screen changes without real integrations

---

# 15. QA Review — Interviews Module

## Executive QA Summary

The /interviews experience now reads as a coherent recruiter-facing demo surface. The prior candidate-data blocker has been resolved through the shared demo-data layer, the detail/preparation panel follows the selected candidate, and the schedule modal now provides clear close and keyboard support. The remaining work is limited to minor polish rather than core product correctness.

## Review verdict

- First-time recruiter: Clear and understandable, with a credible interview-preparation flow.
- Product Manager: Strong demo narrative with clear decision support and no obvious cross-page contradiction.
- UX reviewer: Good information hierarchy and CTA clarity; only a small localization polish remains.
- QA tester: Core interactions work, including modal dismissal and candidate switching.
- Product Builder recruiter: Credible for the portfolio demo and safe to move forward with the Team experience.

## Findings

### 1. RESOLVED — Candidate data is now coherent across the product
- Status: Resolved
- Evidence: Maya Chen now uses a consistent role, stage and probability story across Dashboard, Pipeline, Candidate Profile, Interviews and Copilot through the shared demo-data layer.
- Related candidates: Lucas Martin, Emma Laurent and Noah Williams are represented with coherent roles, stages, priorities and interview context in the shared data model and referenced surfaces.
- Severity: RESOLVED

### 2. RESOLVED — The detail panel now follows the selected candidate
- Status: Resolved
- Evidence: The preparation and detail content is driven by the selected candidate rather than remaining hard-coded to Maya Chen.
- Severity: RESOLVED

### 3. LOW — Minor localization polish remains
- Problem: A small FR copy detail in the Interviews module still feels slightly less polished than the rest of the experience.
- Why it matters: It is minor in product impact, but it remains visible in a public demo and should be cleaned up for full polish.
- Exact location: src/components/recruitment/InterviewsPage.tsx
- Severity: LOW

### 4. LOW — Modal interaction polish remains optional
- Problem: The modal now supports Escape dismissal, a clear close affordance and keyboard focus, but a stricter focus trap could further elevate the experience.
- Why it matters: This is a refinement rather than a blocker, and the current experience is already functional and accessible enough for demo use.
- Exact location: src/components/recruitment/InterviewsPage.tsx
- Severity: LOW

## Portfolio evaluation

- Product Thinking: 8.5/10
- Business Understanding: 8.5/10
- UX reasoning: 8.5/10
- MVP thinking: 8.5/10
- AI-assisted development: 8/10
- Product discovery: 7.5/10
- Product delivery: 8.5/10

## QA conclusion

Yes, this Interviews module is now strong enough to support the next phase of the portfolio demo. The previous data-consistency blocker is resolved, the experience is coherent for a first-time recruiter, and it is safe to move past Interviews and begin the Team experience.

## Single most important improvement

Polish the remaining FR copy detail in the Interviews module so the page feels fully premium and fully localized.

## Demo-readiness score

8.5/10

## Release recommendation

READY WITH MINOR FIXES

---

# 15.1 QA Review — Team Module

## Executive QA Summary

The Team module is now a credible operational layer for the portfolio demo. It helps a first-time recruiting manager quickly see recruiter workload, pending feedback and the people attached to key candidates, and it fits naturally into the existing TalentFlow story. The strongest parts are the workload framing, the recruiter-card structure and the use of the shared candidate dataset. The main gap is that the experience still feels slightly more like a team directory than a decision-support command center, and one key navigation path does not yet preserve the selected candidate context.

## Review verdict

- First-time recruiting manager: Mostly clear and useful, but ownership and the next action are not yet obvious enough at first glance.
- Product Manager: Strong demo narrative and good operational framing, but the page would be more persuasive with stronger “attention needed” signals.
- UX reviewer: Clean structure and good responsive behavior; the page would benefit from clearer visual prioritization of overload and bottlenecks.
- QA tester: Filters, buttons and navigation work as expected, but the candidate links and reassign workflow are not yet fully decision-ready.
- Product Builder recruiter: Good portfolio proof that the product can support team coordination, but still slightly too static for a fully polished recruiter workflow.

## Product logic review

### 1. HIGH — Ownership is visible, but not yet obvious enough for fast operational decisions
- Problem: The Team page shows recruiter cards and assigned candidates, but a first-time manager still has to inspect several cards to understand who owns what and where attention is needed.
- Why it matters: The sprint goal is to help a manager understand workload, ownership and required actions in under two minutes. The current structure is useful, but it still requires too much scanning.
- Exact location: src/components/recruitment/TeamPage.tsx
- Recommended fix: Add a more explicit “needs attention” summary, such as a visible overloaded recruiter callout and a compact ownership/priority signal near the top of the page.
- Severity: HIGH

### 2. HIGH — Assigned candidate links do not preserve the selected candidate context
- Problem: Clicking an assigned candidate from the Team cards sends the user to the generic candidate profile route without carrying the specific candidate identity.
- Why it matters: This breaks the expected handoff experience and weakens the sense that the Team page is actively connected to the rest of the recruiting workflow.
- Exact location: src/components/recruitment/TeamPage.tsx, src/app/candidate-profile/page.tsx
- Recommended fix: Route each assigned candidate to the appropriate candidate profile context, or support a candidate parameter on the profile route.
- Severity: HIGH

### 3. MEDIUM — The page does not yet expose a clear reassign action for candidate ownership
- Problem: The Team page includes assign and feedback actions, but it does not provide a visible reassign action for ownership changes.
- Why it matters: Reassigning ownership is a core operational decision in a recruiting manager workflow, and its absence makes the page feel more like a directory than a coordination tool.
- Exact location: src/components/recruitment/TeamPage.tsx
- Recommended fix: Add a visible reassign action on each recruiter card or assigned-candidate row, even if it remains simulated in demo mode.
- Severity: MEDIUM

### 4. LOW — The workload story is useful, but the bottleneck signal could be stronger
- Problem: The page shows workload bars and a workload summary section, but the most urgent bottleneck is still communicated as a static detail card rather than a prominent decision cue.
- Why it matters: A modern recruiting SaaS should make operational risk feel obvious without requiring interpretation.
- Exact location: src/components/recruitment/TeamPage.tsx
- Recommended fix: Highlight the highest-risk recruiter, missing feedback queue, or urgent handoff more prominently in the header or a dedicated alert strip.
- Severity: LOW

## Functional QA review

### 5. MEDIUM — Demo actions are present but still feel more illustrative than operational
- Problem: The primary buttons trigger visible toast-state messages, but they do not yet change any visible team state or create a meaningful handoff experience.
- Why it matters: The page should feel like a working operating surface, not simply a collection of buttons with feedback popups.
- Exact location: src/components/recruitment/TeamPage.tsx
- Recommended fix: Make the demo actions visibly update the selected recruiter’s state, workload badge or pending-feedback count in a deterministic way.
- Severity: MEDIUM

## Data consistency review

### 6. LOW — Team data is broadly aligned, but the team layer is still a separate local model rather than a fully shared team-data source
- Problem: The Team module uses the shared candidate dataset for candidate references, but recruiter ownership and team-level state are still defined locally within the Team page.
- Why it matters: This is acceptable for the demo, but it is slightly less scalable and could drift from the wider product story if the team model grows.
- Exact location: src/components/recruitment/TeamPage.tsx, src/lib/demoData.ts
- Recommended fix: Move shared team ownership and recruiter assignments into the same typed demo-data layer used by Dashboard, Pipeline, Candidate Profile, Interviews and Copilot.
- Severity: LOW

## Localization review

- EN and FR copy are both present and consistent for the visible Team UI.
- No obvious mixed-language UI was found in the Team module.
- The current language state remains consistent with the rest of the app.

## Responsive review

- Desktop and tablet layouts are readable and well structured.
- Mobile stacking is functional and avoids obvious overflow.
- The filter row compresses reasonably well and the cards stack cleanly.

## Accessibility review

- Semantic sectioning and heading structure are present.
- Buttons are keyboard reachable and use standard semantic button elements.
- Visible focus treatment is inherited from the app’s existing button styles.
- The main remaining accessibility improvement would be stronger labeling and emphasis around the operational alerts.

## Technical review

- Build status: confirmed successful via npm run build.
- No obvious secrets or API usage surfaced in the Team module.
- The interactions remain deterministic and demo-safe, which is appropriate for the portfolio context.
- No immediate runtime regressions were observed on /team or the directly related shared navigation paths.

## Demo-readiness review

- Can a recruiter understand Team without explanation? Mostly yes, but the ownership and action logic would benefit from stronger visual cues.
- Is the workload / ownership story obvious within 30 seconds? Mostly yes, but not yet at the level of a polished product demo.
- Does the module demonstrate Product Thinking rather than just UI design? Yes, the operational framing is present and credible.
- Does it feel credible as part of a modern recruiting SaaS? Yes, with minor polish.

## Portfolio evaluation

- Product Thinking: 8/10
- Business Understanding: 8.5/10
- UX reasoning: 8/10
- MVP thinking: 8.5/10
- AI-assisted development: 8/10
- Product discovery: 7.5/10
- Product delivery: 8/10

## Would this Team module strengthen Sabrina’s application for a Product Builder role?

Yes. It demonstrates clear product framing, a recruiter-oriented workflow and good use of shared demo data. The remaining improvements are around decision clarity and the strength of the operational handoff experience rather than the overall concept.

## Sprint Goal achieved

PARTIALLY

## Business value delivered

The Team module now gives a recruiting manager a credible overview of workload, ownership and pending coordination signals within the demo experience.

## Main learning

The module is strongest when it translates recruiter coordination into obvious “who needs attention now” signals rather than simply listing people and assignments.

## Recommendation for next sprint

Make the Team page more explicitly decision-driven by surfacing overload, missing feedback and candidate handoff needs as the primary story, and ensure every candidate action navigates to the correct candidate context.

## Release recommendation

READY WITH MINOR FIXES

All agents must use this file as shared project context.

## Product Strategist

Reads:
- product-operating-system.md
- project-context.md

Updates:
- business problem
- users
- MVP
- product decisions
- roadmap

## Solution Architect

Reads:
- product-operating-system.md
- project-context.md

Updates:
- technical architecture
- integrations
- security decisions
- infrastructure decisions
- costs
- scalability recommendations

## AI Product Builder

Reads:
- product-operating-system.md
- project-context.md

Updates:
- implementation status
- completed features
- technical limitations
- build status

## QA & Product Reviewer

Reads:
- product-operating-system.md
- project-context.md

Updates:
- QA findings
- known issues
- demo readiness
- release recommendation

## Demo & Portfolio Designer

Reads:
- product-operating-system.md
- project-context.md

Updates:
- demo narrative
- screenshots required
- video structure
- portfolio positioning

---

# 17. Decision Logging Rule

When an important decision changes:

Do not silently replace the old decision.

Record:

- previous decision
- new decision
- reason
- impact

This keeps the project history understandable.

---

# 17. Continuous Improvement

Agents should improve the system through real project learnings.

When a recurring lesson appears:

1. Document it in project-context.md
2. Decide whether it is specific to TalentFlow
3. If reusable across projects, promote it into:
   docs/product-operating-system.md
4. If it becomes a repeatable procedure, later convert it into a Skill

Project-specific knowledge stays in project-context.md.

Reusable methodology belongs in product-operating-system.md.