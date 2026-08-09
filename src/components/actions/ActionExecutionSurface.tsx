"use client";

import { useEffect, useRef } from "react";
import { useDemoExperience } from "../../lib/demoExperience";
import { useLanguage } from "../../lib/i18n";

function screenLabel(screen: string, language: "en" | "fr") {
  if (screen === "dashboard") return language === "en" ? "Dashboard" : "Dashboard";
  if (screen === "pipeline") return language === "en" ? "Pipeline" : "Pipeline";
  if (screen === "candidate-profile") return language === "en" ? "Candidate Profile" : "Profil candidat";
  if (screen === "interviews") return language === "en" ? "Interviews" : "Entretiens";
  if (screen === "team") return language === "en" ? "Team" : "Equipe";
  if (screen === "copilot") return "Copilot";
  return screen;
}

function channelLabel(channel: string, language: "en" | "fr") {
  if (channel === "email") return "Email";
  if (channel === "workflow") return language === "en" ? "Workflow" : "Workflow";
  if (channel === "copilot") return "Copilot";
  return language === "en" ? "In app" : "Dans l'application";
}

export function ActionExecutionSurface() {
  const { language } = useLanguage();
  const { state, confirmActionExecution, dismissActionSurface } = useDemoExperience();
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const preview = state.actionExecution.activePreview;
  const result = state.actionExecution.lastExecutionResult;
  const show = Boolean(preview || result);

  useEffect(() => {
    if (!show) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismissActionSurface();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [dismissActionSurface, show]);

  if (!show) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={dismissActionSurface}>
      <div
        className="modal-card action-surface"
        data-guided-target="action-preview"
        role="dialog"
        aria-modal="true"
        aria-labelledby="action-surface-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="interview-actions" style={{ justifyContent: "space-between", marginTop: 0 }}>
          <p className="eyebrow" style={{ margin: 0 }}>
            {preview
              ? (language === "en" ? "Action preview" : "Apercu de l'action")
              : (language === "en" ? "Action completed" : "Action terminee")}
          </p>
          <button
            ref={closeRef}
            type="button"
            className="btn btn--ghost"
            aria-label={language === "en" ? "Close action surface" : "Fermer la vue action"}
            onClick={dismissActionSurface}
          >
            x
          </button>
        </div>

        {preview ? (
          <>
            <h4 id="action-surface-title" style={{ marginBottom: "4px" }}>{preview.action}</h4>
            <p>{preview.target}</p>

            <div className="action-surface-grid" aria-label={language === "en" ? "Action context" : "Contexte action"}>
              <div className="detail-card"><p>{language === "en" ? "Owner" : "Responsable"}</p><strong>{preview.owner}</strong></div>
              <div className="detail-card"><p>{language === "en" ? "Recipient" : "Destinataire"}</p><strong>{preview.recipient}</strong></div>
              <div className="detail-card"><p>{language === "en" ? "Channel" : "Canal"}</p><strong>{channelLabel(preview.channel, language)}</strong></div>
              <div className="detail-card"><p>{language === "en" ? "Confirmation" : "Confirmation"}</p><strong>{preview.confirmationLevel}</strong></div>
            </div>

            {preview.messagePreview ? (
              <div className="action-surface-block">
                <h5>{language === "en" ? "Message preview" : "Apercu message"}</h5>
                <p><strong>{language === "en" ? "Sender" : "Expediteur"}:</strong> {preview.messagePreview.sender}</p>
                <p><strong>{language === "en" ? "Recipient" : "Destinataire"}:</strong> {preview.messagePreview.recipient}</p>
                {preview.messagePreview.subject ? <p><strong>{language === "en" ? "Subject" : "Objet"}:</strong> {preview.messagePreview.subject}</p> : null}
                <div className="action-message-preview">
                  {preview.messagePreview.body.map((line) => <p key={line}>{line}</p>)}
                </div>
              </div>
            ) : null}

            <div className="action-surface-block">
              <h5>{language === "en" ? "TalentFlow will update" : "TalentFlow mettra a jour"}</h5>
              <ul className="bullet-list">
                {preview.currentState.map((item) => (
                  <li key={item.label}>{item.label}: {item.before} {"->"} {item.after}</li>
                ))}
              </ul>
            </div>

            <div className="action-surface-block">
              <h5>{language === "en" ? "Affected screens" : "Ecrans impactes"}</h5>
              <p>{preview.affectedScreens.map((item) => screenLabel(item, language)).join(" - ")}</p>
              <ul className="bullet-list">
                {preview.kpiChanges.map((item) => <li key={item}>{item}</li>)}
                {preview.priorityChanges.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn--secondary" onClick={dismissActionSurface}>
                {language === "en" ? "Cancel" : "Annuler"}
              </button>
              <button type="button" className="btn btn--primary" onClick={confirmActionExecution}>
                {preview.confirmationCta}
              </button>
            </div>
          </>
        ) : null}

        {result ? (
          <>
            <h4 id="action-surface-title" style={{ marginBottom: "4px" }}>{result.action}</h4>
            <p>{language === "en" ? "Execution summary" : "Resume d'execution"}</p>
            <div className="action-surface-block">
              <ul className="bullet-list">
                {result.completedItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="action-surface-block">
              <h5>{language === "en" ? "Before / After" : "Avant / Apres"}</h5>
              <ul className="bullet-list">
                {result.updatedState.map((item) => (
                  <li key={item.label}>{item.label}: {item.before} {"->"} {item.after}</li>
                ))}
              </ul>
            </div>
            <div className="action-surface-block">
              <h5>{language === "en" ? "Affected screens" : "Ecrans impactes"}</h5>
              <p>{result.affectedScreens.map((item) => screenLabel(item, language)).join(" - ")}</p>
              <p><strong>{language === "en" ? "Next recommended action" : "Prochaine action recommandee"}:</strong> {result.recommendedNextAction}</p>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn--primary" onClick={dismissActionSurface}>
                {language === "en" ? "Close" : "Fermer"}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
