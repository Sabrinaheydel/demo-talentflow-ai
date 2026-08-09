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

## 5.1 Dashboard Product Intelligence Sprint

Sprint goal:

Transform the Dashboard into an AI-powered executive briefing that lets a recruiter or temporary cover understand what changed, what is at risk, and what to do first in under 30 seconds.

1. Current Dashboard problems

- The hero is friendly but generic and does not summarize recent operational change.
- KPI tiles are mostly static totals and trends with limited decision value.
- Insights and actions are useful in intent but not explicit enough on urgency, owner and deadline.
- The page requires scanning multiple cards before a user can identify the top priority.

2. User / job-to-be-done

- As a returning recruiter, replacement recruiter or manager cover, I need an instant operational briefing so I can resume control and make the next correct decision without reconstructing activity manually.

3. Revised Dashboard information hierarchy

- Layer 1: Executive Briefing (since last visit summary + one recommended priority).
- Layer 2: Decision KPI strip (state of flow, blocked work, pending decisions, workload shifts).
- Layer 3: Critical changes and risks (candidate stage movements, pending feedback, offers at risk, interviews completed).
- Layer 4: Action queue (explicit next best actions with owner and due time).
- Layer 5: Supporting analytics (funnel and broader performance context).

4. Hero / Executive Briefing concept

- Keep the human greeting as a secondary line, not the primary message.
- Primary hero title should communicate change, for example: "Since your last visit: 5 important changes".
- Hero body should include:
   - what happened
   - what changed materially
   - what matters now
   - one clear recommended first action
- Add timestamp context for absence catch-up (for example: "Last active: 3 days ago").

5. KPI strategy

Replace static vanity metrics with decision KPIs:

- Active candidates in decision window
- Candidates moved stage since last visit
- Pending feedback older than 24h
- Offers at risk (deadline or confidence drop)
- Interviews completed awaiting decision
- Recruiter workload change (overloaded vs balanced)

Each KPI must include:

- current value
- delta versus last visit or last 7 days
- short implication label (On track, Watch, At risk)

6. AI insight strategy

Each insight card must answer:

- what happened
- why it matters
- urgency level
- recommended action

Insight format:

- Signal
- Impact
- Urgency
- Recommended action
- Suggested owner

7. Priority action strategy

- Replace vague actions (Review, Open) with explicit decisions.
- Every action should start with a verb and include outcome framing.
- Example structure: "Decide on Maya Chen offer before Thursday 17:00".
- Show expected impact and due time for each action.

8. Returning-user / absence briefing concept

- Trigger absence mode after configurable inactivity (for demo: 48h+).
- Show compact catch-up briefing with:
   - top changes since last visit
   - new blockers
   - new risks
   - actions completed by teammates
   - outstanding decisions
- Provide a one-click "Start catch-up" flow that guides users through top 3 priorities.
- Allow "cover mode" for managers or teammates taking over temporarily.

9. What to keep

- Clear card-based visual structure.
- Existing sections that support operational context: funnel, interviews, recent candidates.
- Human greeting tone and demo disclosure.

10. What to remove

- Hero metrics that do not drive decisions (for example weekly performance multipliers without clear action implications).
- Generic insight phrasing that lacks urgency and owner.
- Any priority button that does not describe a specific operational decision.

11. What to add

- Since-last-visit timeline summary.
- Critical change feed (stage changes, completed interviews, offer updates).
- Risk queue (blocked candidates, overdue feedback, at-risk offers).
- Workload change monitor by recruiter.
- Single recommended priority with rationale.

12. MVP scope

Must Have:

- Executive Briefing hero with since-last-visit summary
- Decision-oriented KPI strip
- Actionable AI insights with urgency and recommendation
- Explicit priority action list with deadlines and owner context
- Absence catch-up mode for returning users

Should Have:

- Cover mode for temporary takeover
- Personalization by recruiter role context

Could Have:

- Natural-language drill-down from each insight
- Weekly narrative digest view

13. Out of scope

- Real-time external ATS synchronization
- Predictive model retraining workflows
- New backend architecture or infra changes
- Non-dashboard module redesign during this sprint

14. Acceptance criteria

- A returning recruiter can state the top priority in under 30 seconds.
- The dashboard clearly shows what changed since last visit.
- At least one critical risk and one blocker are explicitly surfaced when present.
- Priority actions are explicit, time-bound and decision-oriented.
- Catch-up mode supports both original owner and temporary cover user.

15. Definition of Done for this sprint

- Dashboard no longer reads as static analytics; it behaves as a decision-support briefing.
- Hero, KPIs, insights and actions are coherent around "what changed" and "what to do next".
- Keep/change/remove/add decisions are reflected in the page information hierarchy.
- Demo data remains deterministic, coherent and bilingual (EN/FR).
- The experience is understandable by a first-time or returning recruiter without verbal guidance.

Decision log (Dashboard positioning):

- Previous decision: Dashboard positioned primarily as a visual analytics overview.
- New decision: Dashboard positioned as an executive operational briefing and next-action surface.
- Reason: Recruiters returning after absence need situational awareness and immediate decision clarity, not static reporting.
- Impact: Hero, KPIs, insight cards and action design now prioritize change detection, risk signaling and clear first action.

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

## 9.15 Dashboard Executive Briefing Architecture

This section translates the approved Dashboard Product Intelligence vision into implementation architecture while preserving demo constraints:

- deterministic behavior
- demo-safe execution
- bilingual EN/FR
- fully local simulation
- no additional backend dependency
- strict coherence with shared demo dataset

### 1. Recommended architecture

Recommended composition for Dashboard:

- Dashboard presentation layer with three explicit briefing layers:
   - WHAT CHANGED
   - WHAT NEEDS ATTENTION
   - WHAT TO DO NOW
- A reusable Briefing Engine that builds all briefing modes from one shared contract and one rendering system.
- A local dashboard-intelligence derivation layer that computes briefing artifacts from canonical demo data and demo state.
- A deterministic scenario layer (absence, normal return, cover mode) used to simulate "since last visit" without external events.
- Reuse existing shared state and reset orchestration; no new backend service.

Briefing Engine target modes:

- Absence Brief
- Morning Brief
- Weekly Brief
- Cover Brief
- End-of-Day Brief (future)

MVP implementation scope for this sprint:

- Fully implement Absence Brief (Since your last visit)
- Fully implement Cover Brief
- Prepare architecture contracts for Morning Brief and Weekly Brief without full mode implementation

Single engine rule:

- No duplicated hard-coded briefing components per mode.
- Each mode varies only by time window, audience context and prioritization profile.

Reusable briefing contract (all modes):

- briefingType
- title
- timeWindow
- summary
- keyChanges
- risks
- priorityOne
- recommendedActions
- estimatedCatchUpTime
- audienceContext

### 2. Shared data-model updates

Extend the canonical shared model with architecture-level entities:

- activityEvents: deterministic event stream (stage changed, interview completed, feedback requested/received, offer updated)
- decisionItems: explicit decisions with due date, owner, urgency and candidate link
- riskFlags: structured risk/blocker signals with severity and source
- recruiterLoadSnapshots: workload snapshots by recruiter for delta comparison
- visitContext: lastActiveAt, scenarioId, activeActorId, activeMode (owner or cover)
- briefingTemplates: localized template references by briefingType
- briefingProfiles: rule presets by briefingType (time window, ranking weights, inclusion thresholds)

All Dashboard signals must be derived from these typed entities, not hard-coded per component.

### 3. Demo-state updates

Add dashboard-specific state slices to the shared demo state:

- dashboard.lastViewedAt
- dashboard.activeScenarioId
- dashboard.catchUpCompleted
- dashboard.coverMode: { enabled, coverActorId, originalOwnerId }
- dashboard.briefingDismissedSections
- dashboard.prioritySelection: deterministic ID of Priority #1 recommendation
- dashboard.estimatedCatchUpMinutes
- dashboard.activeBriefingType
- dashboard.briefingPacketsByType

State remains local and deterministic, persisted only through existing demo-state mechanisms.

### 4. "Since your last visit" simulation strategy

Simulation should be rule-based:

- Determine elapsed time from dashboard.lastViewedAt.
- Select a deterministic scenario pack (for example: 48h absence, 5-day absence, cover takeover).
- Materialize pre-defined activityEvents in a fixed order.
- Compute deltas against previous snapshot to produce "what changed" summary.

No randomization and no live clocks beyond relative elapsed-time formatting.

Briefing Engine simulation behavior:

- The engine receives briefingType and audienceContext.
- The engine resolves briefingProfiles[briefingType].
- The same derivation pipeline produces one normalized briefing packet.
- Rendering components consume normalized packet fields only.

This guarantees that adding Morning Brief or Weekly Brief reuses the same data and UI contract.

### 5. Catch-up Mode architecture

Catch-up Mode is a deterministic guided briefing state:

- Entry condition: elapsed inactivity threshold reached (default demo threshold: 48h).
- Output artifact: compact briefing packet with:
   - key changes
   - new risks/blockers
   - pending decisions
   - top 3 actions
- Completion rule: user finishes or dismisses top-priority walkthrough, setting dashboard.catchUpCompleted=true.

Catch-up mode should be re-openable without data drift.

Catch-up mode must internally consume Briefing Engine packets rather than a page-specific hard-coded payload.

### 6. Cover Mode architecture

Cover Mode models temporary ownership substitution:

- User selects cover actor context (manager or teammate).
- Derived recommendations re-rank by cross-recruiter impact, not just original owner context.
- Decision items show both original owner and temporary owner fields.
- Mode is reversible and resettable through shared demo reset.

Cover Mode does not duplicate data; it applies a context lens over the same shared dataset.

Cover Brief must be generated through briefingType="cover" with the same packet contract used by Absence Brief.

### 7. KPI derivation strategy

Decision-oriented KPI values are derived, never manually entered:

- activeDecisionWindow = candidates requiring decision within configured SLA
- movedSinceLastVisit = count of stage-change events since lastViewedAt
- pendingFeedbackOver24h = feedback requests without response beyond threshold
- offersAtRisk = offers with deadline proximity or confidence-drop flag
- interviewsAwaitingDecision = completed interviews with no decision record
- workloadDelta = recruiter load variance between snapshots

Each KPI outputs value, delta, and status label (on-track/watch/at-risk).

### 8. AI insight generation strategy (deterministic)

Insights are generated by deterministic templates from event + risk + KPI intersections:

- Input: activityEvents, riskFlags, decisionItems, workload deltas, language
- Rule engine: rank by severity, deadline proximity, and decision impact
- Output contract:
   - signal
   - whyItMatters
   - urgency
   - recommendedAction
   - suggestedOwner

No probabilistic generation is required for dashboard insight cards in demo mode.

### 9. Priority recommendation strategy

Priority #1 recommendation should be first-class and deterministic.

Ranking formula (deterministic weighted score):

- riskSeverityWeight
- deadlineProximityWeight
- candidateStrategicWeight
- dependencyBlockWeight
- workloadReliefWeight

Top scored decisionItem becomes prioritySelection, with rationale trace for explainability.

Prioritization profiles by briefing type:

- absence: emphasize accumulated change and unresolved blockers
- cover: emphasize handoff risk and cross-recruiter workload impact
- morning (future): emphasize near-term deadlines for the day
- weekly (future): emphasize strategic milestones and trend risk

### 10. Cross-screen consistency rules

Consistency rules across Dashboard, Pipeline, Candidate Profile, Interviews, Team and Copilot:

- Stage, priority, probability and owner values must resolve from the same canonical entity IDs.
- Dashboard events must reference candidate IDs already used by other screens.
- Priority #1 candidate context must match profile/interview/team narratives.
- Copilot context must consume the same decisionItems and riskFlags.
- No page may override shared derived values with page-local constants.

### 11. State transitions

Core transition graph:

- Normal mode -> Absence detected -> Catch-up mode active
- Catch-up mode active -> Catch-up completed
- Catch-up completed -> Ongoing monitoring mode
- Any mode -> Cover mode enabled
- Cover mode enabled -> Cover mode disabled
- Ongoing monitoring mode -> Morning Brief (future)
- Ongoing monitoring mode -> Weekly Brief (future)
- Any mode -> Reset demo baseline

Transitions must be explicit and reversible, with no hidden side effects.

### 12. Demo reset implications

Reset must now additionally restore:

- dashboard.lastViewedAt baseline
- scenario selection
- catch-up completion state
- cover mode state
- prioritySelection
- estimatedCatchUpMinutes
- derived briefing packet cache

Reset output must return the same deterministic first-run briefing every time.

### 13. Localization implications

New architecture copy domains to localize centrally:

- briefing layer headers (WHAT CHANGED / WHAT NEEDS ATTENTION / WHAT TO DO NOW)
- catch-up and cover mode states
- urgency labels
- rationale templates for Priority #1
- estimated catch-up-time sentence patterns
- briefing-mode titles and subtitles by briefingType
- audience-context labels (owner, temporary cover)

All generated strings must use translation keys and shared formatting rules.

### 14. Architecture risks

- Derived-signal drift if event taxonomy is inconsistent across modules.
- Priority score opacity if ranking rationale is not exposed.
- Cover mode confusion if owner vs temporary owner labels are ambiguous.
- Reset regression if dashboard-specific state is not fully included.
- Localization fragmentation if template strings are embedded in components.
- Briefing drift if modes are implemented as separate UI components instead of the shared packet renderer.

### 15. Architecture acceptance criteria

- Dashboard can always produce deterministic briefing layers from shared data + state.
- "Since last visit" summary is reproducible for the same scenario/time window.
- Catch-up and cover modes can be toggled and reset without inconsistencies.
- KPI, insight and priority outputs remain coherent with Pipeline/Profile/Interviews/Team/Copilot.
- EN/FR content for new briefing constructs is fully served from centralized localization.
- Absence Brief and Cover Brief use the same briefing engine contract and renderer with no duplicated hard-coded briefing component.
- Morning Brief and Weekly Brief can be added by configuration (briefingProfile + templates) without refactoring the derivation pipeline.

### 16. Architecture Definition of Done (Dashboard sprint)

- Three-layer briefing architecture is implemented as a reusable derived-state contract.
- Priority #1 recommendation is stored as a first-class derived state artifact with rationale.
- Estimated catch-up time is computed and persisted as a first-class dashboard state artifact.
- Demo reset deterministically restores all Dashboard intelligence states.
- Cross-screen data consistency checks pass for all shared entities referenced by Dashboard.
- Briefing Engine supports multiple briefing types through one normalized packet schema.
- Absence Brief and Cover Brief are fully implemented on top of the shared engine.
- Morning and Weekly briefing architecture paths are defined and integration-ready without refactor.

### First-class concept decision: Estimated catch-up time

Decision: YES, introduce as first-class architecture concept.

Rationale:

- It sets clear user expectation for effort recovery.
- It improves adoption of catch-up mode by reducing uncertainty.

Integration with shared demo state:

- Compute from deterministic count/weight of unread decisionItems + riskFlags + stage changes.
- Persist as dashboard.estimatedCatchUpMinutes.
- Recompute on scenario change, cover-mode toggle and reset.

### First-class concept decision: Priority #1 recommendation

Decision: YES, introduce as first-class architecture concept.

Rationale:

- The dashboard must converge to one clear first decision.
- It enforces decision-support behavior over static analytics display.

Integration with shared demo state:

- Persist deterministic selected item as dashboard.prioritySelection.
- Store rationale trace metadata for explainability and bilingual rendering.
- Expose same selected decision to Copilot and linked screens for narrative consistency.

Decision log (Dashboard architecture):

- Previous decision: Dashboard architecture treated the view primarily as static analytics composition.
- New decision: Dashboard architecture uses deterministic briefing derivation with first-class catch-up and priority concepts.
- Reason: Returning and cover users need immediate operational comprehension and one explicit first decision.
- Impact: Shared model, demo state, reset behavior and localization now include briefing intelligence artifacts.

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

1. Deliver Dashboard Product Intelligence sprint (Executive Briefing + since-last-visit logic + priority-first actions)
2. Validate returning-user and temporary-cover catch-up flow end to end
3. Finalize core cross-page data consistency across dashboard, pipeline, profile, interviews, team and Copilot
4. Strengthen interview and team workflow clarity
5. Complete FR/EN localization and remove mixed or incomplete text
6. Improve buttons, states, transitions and CTA clarity
7. Make Copilot outputs more recruiter-ready and action-oriented
8. Add onboarding, Guided Demo and Reset Demo experiences
9. Run desktop, tablet and mobile QA for the full public demo flow
10. Prepare public deployment and demo script
11. Add simulation/API switch architecture for future live AI compatibility
12. Optionally introduce a live AI API in a later phase

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

## Dashboard Executive Briefing sprint

Status:
- Implemented deterministic Dashboard Intelligence MVP with reusable briefing engine

Files modified:
- src/app/page.tsx
- src/app/globals.css
- src/components/dashboard/ExecutiveBriefing.tsx
- src/components/dashboard/StatsGrid.tsx
- src/components/recruitment/InsightsPanel.tsx
- src/components/recruitment/PriorityActions.tsx
- src/lib/dashboardBriefing.ts
- src/lib/demoExperience.tsx

Implementation completed:
- Implemented a reusable briefing engine contract and renderer path supporting:
   - Absence Brief (implemented)
   - Cover Brief (implemented)
   - Morning Brief (architecture-ready placeholder)
   - Weekly Brief (architecture-ready placeholder)
   - End-of-Day Brief (architecture-ready placeholder)
- Replaced static dashboard hero emphasis with an executive briefing surface focused on:
   - WHAT CHANGED
   - WHAT NEEDS ATTENTION
   - WHAT TO DO NOW
- Added deterministic briefing packet model including:
   - title
   - time window
   - summary
   - key changes
   - risks
   - priority #1
   - recommended actions
   - estimated catch-up time
   - audience context
- Added shared demo state fields for Dashboard Intelligence:
   - dashboard.activeBriefingType
   - dashboard.estimatedCatchUpMinutes
   - dashboard.prioritySelection
   - dashboard.briefingPacketsByType
   - plus cover/catch-up orchestration metadata
- Implemented Absence Brief scenario with deterministic catch-up narrative and explicit first action
- Implemented Cover Brief scenario with adjusted audience/owner context and handoff-oriented prioritization
- Reframed KPI cards into decision-oriented operational indicators with:
   - current value
   - delta
   - operational meaning
   - risk status
   - optional action hint
- Replaced generic insight cards with deterministic actionable insight structure:
   - signal
   - impact
   - urgency
   - recommended action
   - suggested owner
- Replaced vague CTA patterns in priority actions with explicit action verbs, owner, deadline and impact
- Preserved fully local deterministic behavior with no paid AI API and no added backend dependency

Build status:
- Pending validation in this sprint step (run required after implementation)

Current known limitations:
- Morning Brief and Weekly Brief are intentionally architecture-ready but not fully activated in UI flow
- End-of-Day Brief remains contract-ready only for a future sprint
- Candidate profile deep-link context for non-Maya priority items is still limited by current profile route behavior

## Copilot Product Polish sprint

Status:
- Implemented deterministic Copilot decision-support outputs with action-specific artifacts

Files modified:
- src/components/copilot/CopilotWorkspace.tsx
- src/app/globals.css

Implementation completed:
- Replaced repetitive generic Copilot responses with six distinct deterministic capabilities:
   - Executive Summary → executive briefing output
   - Compare Candidates → comparison matrix output
   - Interview Guide → structured interview guide output
   - Suggested Email → recruiter-ready email draft output
   - Hiring Risk Assessment → severity-based risk report output
   - Next Best Action → owner/deadline/outcome decision plan output
- Introduced a structured Copilot response contract per capability while keeping DEMO_MODE behavior fully deterministic
- Kept shared candidate model usage unchanged by deriving all Copilot context from the canonical demo-data source
- Reduced chat-like verbosity by returning concise in-thread confirmations and rendering full recruiter artifacts in the decision panel
- Added dedicated visual patterns per capability to create clear differences in hierarchy, components and reading flow

Build status:
- Production build validated successfully after Copilot Product Polish changes

Demo-mode constraints preserved:
- No real LLM integration implemented
- No architecture change introduced
- No product strategy or QA sections modified

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

---

# 15.2 QA Review — Dashboard Intelligence MVP

## Executive QA Summary

The Dashboard now behaves as a real decision-support surface instead of a static analytics page. A returning recruiter can quickly identify what changed, what is at risk and which action comes first. The Briefing Engine foundation is solid, deterministic and coherent with shared state. The main gaps are localization completeness, cover-mode operational clarity and stronger visual emphasis for Priority #1 on small screens.

## Review verdict by persona

- Returning recruiter after 6 days: Mostly successful. The absence briefing provides immediate context and clear first actions.
- Recruiting manager in temporary cover: Partially successful. Cover briefing exists and is useful, but actor/context control remains implicit.
- Product Manager: Strong direction and clear product framing around decision latency and risks.
- UX reviewer: Good hierarchy and reduced greeting dominance; Priority #1 prominence can be stronger on compact layouts.
- Product Builder recruiter evaluator: Strong portfolio signal for product thinking and AI-assisted decision framing.

## Verification against sprint goal

- What changed: YES, explicit event-based summary is present.
- What is at risk: YES, risks and urgency are visible in briefing, KPIs and insights.
- What needs attention: YES, explicit actions and risk labels are present.
- What to do first: YES, Priority #1 exists with rationale, owner and deadline.
- Under 30 seconds comprehension: PARTIALLY. Achievable for absence mode; slightly less immediate in cover mode due ownership/context ambiguity.

## Critical issues

- None identified.

## High issues

### 1. HIGH — FR localization is not fully complete and includes mixed-language labels
- Problem: Multiple FR dashboard strings still include English terms (for example "Owner", "owner") and partial untranslated wording.
- Why it matters: Sprint requirements explicitly require complete EN/FR and no mixed-language Dashboard.
- Evidence locations:
   - src/components/recruitment/PriorityActions.tsx
   - src/components/recruitment/InsightsPanel.tsx
   - src/app/page.tsx
- Severity: HIGH

### 2. HIGH — Cover mode context is not explicit enough for a true handoff operator
- Problem: Cover briefing is available, but the user cannot explicitly choose/change cover actor in the Dashboard UI, and the owner lens remains implicit.
- Why it matters: A temporary cover user should quickly understand ownership and responsibility boundaries without prior context.
- Evidence locations:
   - src/components/dashboard/ExecutiveBriefing.tsx
   - src/app/page.tsx
   - src/lib/demoExperience.tsx
- Severity: HIGH

## Medium issues

### 3. MEDIUM — Priority #1 is present but not visually dominant enough in all contexts
- Problem: Priority #1 is in the third layer card with light emphasis; on compact layouts it may require extra scanning before feeling "the" primary decision.
- Why it matters: Sprint intent requires immediate first-action convergence.
- Evidence locations:
   - src/components/dashboard/ExecutiveBriefing.tsx
   - src/app/globals.css
- Severity: MEDIUM

### 4. MEDIUM — Catch-up completion state exists but has limited visible behavioral effect
- Problem: catchUpCompleted is persisted but not clearly reflected in a post-catch-up UI state transition.
- Why it matters: The transition from catch-up to normal monitoring is part of the architecture contract and should be visible for QA clarity.
- Evidence locations:
   - src/lib/demoExperience.tsx
   - src/app/page.tsx
- Severity: MEDIUM

### 5. MEDIUM — Cross-screen coherence narrative for cover priorities can still feel indirect
- Problem: Cover Brief prioritization references multi-owner actions, but direct contextual navigation/handoff cues across Team/Profile are still limited.
- Why it matters: Cover users need fast trust that dashboard priorities map cleanly to execution surfaces.
- Evidence locations:
   - src/lib/dashboardBriefing.ts
   - src/app/candidate-profile/page.tsx
   - src/components/recruitment/TeamPage.tsx
- Severity: MEDIUM

## Nice-to-have improvements

- Add explicit post-catch-up "briefing completed" badge/state in hero.
- Add lightweight actor switcher in Cover Brief for manager vs teammate context.
- Increase mobile-first priority prominence by surfacing a compact sticky Priority #1 summary.
- Provide direct deep links from recommended actions to exact execution surfaces.

## Detailed verification notes

### 1. Executive Briefing
- Since your last visit context: clear and immediate.
- What changed discoverability: good, presented in dedicated layer.
- Greeting dominance: corrected; "Bonjour Sabrina" is now secondary.
- Estimated catch-up time: useful and believable in absence mode; acceptable in cover mode.

### 2. Priority #1
- Single dominant priority exists in both Absence and Cover briefs.
- Why-now rationale exists and is specific.
- Action, urgency/deadline and owner are present.
- Maya coherence across screens is broadly consistent with canonical data.

### 3. What Changed
- Presented as event-style changes rather than vanity totals.
- Absence scenario effectively communicates progression during time away.

### 4. What Needs Attention
- Risks and blockers are visible in dedicated layer + insights + KPI risk badges.
- Urgency is understandable via status/urgency labels.

### 5. What To Do Now
- Actions are explicit and operational.
- Vague CTA patterns are replaced by action verbs and outcomes.

### 6. KPIs
- Mostly decision-oriented with value + delta + meaning + status.
- Reduced metric noise vs previous dashboard.

### 7. AI Insights
- Required structure is present: signal, impact, urgency, action, owner.
- Feels decision-support oriented and deterministic.

### 8. Absence Brief
- Pass: a returning recruiter can regain situational awareness quickly.

### 9. Cover Brief
- Partial pass: strategic context is present, but operator ownership clarity can be improved.

### 10. State & Reset
- Briefing type switching: functional.
- Priority/catch-up/cover state: persisted in shared demo state.
- Reset demo: restores baseline including dashboard intelligence state.

### 11. Localization
- Partial pass due to mixed EN/FR labels remaining.

### 12. Responsive
- Desktop: strong hierarchy.
- Tablet: hierarchy preserved.
- Mobile: content remains readable, but Priority #1 salience can improve.

### 13. Cross-screen consistency
- Broadly coherent with shared candidate narrative (especially Maya Chen).
- Remaining limitation: cover-handoff execution cues across Team/Profile remain less direct.

## Portfolio impact scoring (1-10)

- Product Thinking: 9/10
- Business Understanding: 8.5/10
- UX reasoning: 8/10
- Decision-support quality: 8.5/10
- AI product credibility: 8/10
- MVP thinking: 8.5/10
- Demo quality: 8/10
- Portfolio impact: 8.5/10

## Would this materially strengthen Sabrina's Product Builder application?

Yes. This Dashboard demonstrates clear product framing, decision-support logic, deterministic AI-oriented execution, and credible cross-functional thinking for recruiter workflows.

## Sprint review

Sprint Goal achieved:
PARTIALLY

Business value delivered:
The Dashboard now provides a real operational briefing flow for returning users and cover scenarios, with explicit decisions, risks and next actions.

Main learning:
Decision-support quality increases significantly when event summaries, risk visibility and first-action clarity are unified in one hero-level briefing contract.

Recommendation for next sprint:
Complete localization parity, strengthen Cover-mode operator control, and make Priority #1 even more dominant on mobile and tablet.

## Demo-readiness score

8.4/10

## Release recommendation

READY WITH MINOR FIXES

## Single most important improvement before moving on

Finalize full FR localization and remove mixed-language "owner" phrasing across all new Dashboard briefing blocks.

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