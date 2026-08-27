"use client";

import { FormEvent, useState } from "react";
import { trackAnalyticsEvent } from "../../lib/analytics";
import { useLanguage } from "../../lib/i18n";

const copy = {
  en: {
    button: "Give feedback",
    title: "Help improve TalentFlow",
    intro: "This is a public portfolio demo with simulated data. Your feedback helps improve the product experience.",
    rating: "How clear and useful did TalentFlow feel?",
    comment: "What worked well, felt unclear, or should be improved?",
    commentPlaceholder: "Share your feedback...",
    name: "Name (optional)",
    email: "Email (optional)",
    contact: "I agree to be contacted about this feedback.",
    privacy: "Free-text feedback is sent directly to Agence 360 Digital and is not added to product analytics.",
    cancel: "Cancel",
    submit: "Send feedback",
    sending: "Sending...",
    success: "Thank you. Your feedback has been sent.",
    error: "The message could not be sent. Please try again.",
    close: "Close feedback",
  },
  fr: {
    button: "Envoyer votre avis",
    title: "Aidez-moi à améliorer TalentFlow",
    intro: "TalentFlow est une démo portfolio publique utilisant des données simulées. Votre avis m’aide à améliorer l’expérience produit.",
    rating: "TalentFlow vous a-t-il semblé clair et utile ?",
    comment: "Qu’est-ce qui fonctionne bien, manque de clarté ou devrait être amélioré ?",
    commentPlaceholder: "Partagez votre avis...",
    name: "Nom (facultatif)",
    email: "E-mail (facultatif)",
    contact: "J’accepte d’être recontacté(e) au sujet de cet avis.",
    privacy: "Le texte libre est envoyé directement à Agence 360 Digital et n’est pas ajouté aux analytics produit.",
    cancel: "Annuler",
    submit: "Envoyer mon avis",
    sending: "Envoi...",
    success: "Merci. Votre avis a bien été envoyé.",
    error: "Le message n’a pas pu être envoyé. Veuillez réessayer.",
    close: "Fermer le formulaire d’avis",
  },
} as const;

function getApiPath(path: string) {
  const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
  const normalizedBasePath = configuredBasePath === "/" ? "" : configuredBasePath.replace(/\/$/, "");
  return `${normalizedBasePath}${path}`;
}

export function FeedbackLauncher() {
  const { language } = useLanguage();
  const text = copy[language];
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactConsent, setContactConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  function openFeedback() {
    setOpen(true);
    setStatus("idle");
    trackAnalyticsEvent("feedback opened", { language });
  }

  function closeFeedback() {
    if (status === "sending") return;
    setOpen(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rating || comment.trim().length < 3) return;

    setStatus("sending");

    try {
      const response = await fetch(getApiPath("/api/feedback"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
          name: name.trim(),
          email: email.trim(),
          contactConsent,
          language,
          page: window.location.pathname,
        }),
      });

      if (!response.ok) throw new Error("feedback_request_failed");

      trackAnalyticsEvent("feedback submitted", {
        rating,
        language,
        has_contact: Boolean(email.trim()),
        contact_consent: contactConsent,
      });

      setStatus("success");
      setComment("");
      setName("");
      setEmail("");
      setContactConsent(false);
    } catch {
      setStatus("error");
      trackAnalyticsEvent("feedback failed", { language });
    }
  }

  return (
    <>
      <button type="button" className="feedback-launcher" onClick={openFeedback}>
        <span aria-hidden="true">✦</span>
        <span>{text.button}</span>
      </button>

      {open ? (
        <div className="feedback-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeFeedback();
        }}>
          <section className="feedback-dialog" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
            <button type="button" className="feedback-close" onClick={closeFeedback} aria-label={text.close}>
              ×
            </button>

            <div className="feedback-demo-badge">Portfolio demo · Simulated data</div>
            <h2 id="feedback-title">{text.title}</h2>
            <p className="feedback-intro">{text.intro}</p>

            {status === "success" ? (
              <div className="feedback-success" role="status">
                <strong>{text.success}</strong>
                <button type="button" className="button button--primary" onClick={closeFeedback}>
                  OK
                </button>
              </div>
            ) : (
              <form className="feedback-form" onSubmit={handleSubmit}>
                <fieldset>
                  <legend>{text.rating}</legend>
                  <div className="feedback-rating" aria-label={text.rating}>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={rating === value ? "is-selected" : ""}
                        onClick={() => setRating(value)}
                        aria-pressed={rating === value}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label>
                  <span>{text.comment}</span>
                  <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder={text.commentPlaceholder}
                    minLength={3}
                    maxLength={2500}
                    rows={5}
                    required
                  />
                </label>

                <div className="feedback-contact-grid">
                  <label>
                    <span>{text.name}</span>
                    <input value={name} onChange={(event) => setName(event.target.value)} maxLength={120} autoComplete="name" />
                  </label>
                  <label>
                    <span>{text.email}</span>
                    <input value={email} onChange={(event) => setEmail(event.target.value)} maxLength={180} type="email" autoComplete="email" />
                  </label>
                </div>

                <label className="feedback-consent">
                  <input
                    type="checkbox"
                    checked={contactConsent}
                    onChange={(event) => setContactConsent(event.target.checked)}
                    disabled={!email.trim()}
                  />
                  <span>{text.contact}</span>
                </label>

                <p className="feedback-privacy">{text.privacy}</p>
                {status === "error" ? <p className="feedback-error" role="alert">{text.error}</p> : null}

                <div className="feedback-actions">
                  <button type="button" className="button" onClick={closeFeedback}>{text.cancel}</button>
                  <button type="submit" className="button button--primary" disabled={!rating || comment.trim().length < 3 || status === "sending"}>
                    {status === "sending" ? text.sending : text.submit}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}
