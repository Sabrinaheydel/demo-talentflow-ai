# Feedback delivery

The beta feedback form posts to `/api/feedback`.

Required runtime variables:
- `RESEND_API_KEY`
- `FEEDBACK_FROM_EMAIL`
- `FEEDBACK_TO_EMAIL=sabrina.heydel@agence360digital.fr`

The message body is delivered by the server-side route. Free-text feedback is intentionally excluded from PostHog analytics.
