# Beta privacy notes

TalentFlow is a public portfolio demo using simulated recruitment data.

For the beta:
- Product analytics are collected with PostHog EU Cloud.
- Free-text feedback is not sent to PostHog.
- Session recording masks form inputs and user Copilot messages.
- Contact details are optional and used only when a tester chooses to provide them.
- Feedback delivery should use a server-side email credential, never a browser-exposed secret.
