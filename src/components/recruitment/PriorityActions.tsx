"use client";

import { useState } from "react";
import { useDemoExperience } from "../../lib/demoExperience";
import { BriefingAction } from "../../lib/dashboardBriefing";

type PriorityActionsProps = {
  language: "en" | "fr";
  actions: BriefingAction[];
};

export function PriorityActions({ language, actions }: PriorityActionsProps) {
  const { addStoryStep } = useDemoExperience();
  const [toast, setToast] = useState<string | null>(null);
  const [modal, setModal] = useState<{ title: string; description: string; confirmLabel: string; message: string } | null>(null);

  return (
    <>
      <div className="priority-list">
        {actions.map((action, index) => (
          <div key={action.id} className="priority-item priority-item--actionable">
            <div>
              <p className="priority-item__title">{action.title}</p>
              <p className="priority-item__meta">
                {action.candidate} - {action.deadline}
              </p>
              <p className="priority-item__impact">{action.impact}</p>
              <p className="priority-item__owner">
                {language === "en" ? "Owner" : "Owner"}: {action.owner}
              </p>
              <span className={`badge ${action.urgency === "high" ? "badge--danger" : action.urgency === "medium" ? "badge--warning" : "badge--success"}`}>
                {action.urgency === "high"
                  ? language === "en" ? "High urgency" : "Urgence elevee"
                  : action.urgency === "medium"
                    ? language === "en" ? "Medium urgency" : "Urgence moyenne"
                    : language === "en" ? "Low urgency" : "Urgence faible"}
              </span>
            </div>
            <button
              type="button"
              className={index === 0 ? "btn btn--primary" : "btn btn--secondary"}
              onClick={() => setModal({
                title: action.title,
                description: language === "en"
                  ? `Action target: ${action.candidate}. Expected impact: ${action.impact}`
                  : `Cible de l'action : ${action.candidate}. Impact attendu : ${action.impact}`,
                confirmLabel: language === "en" ? "Run action" : "Executer l'action",
                message: action.confirmMessage,
              })}
            >
              {language === "en" ? "Run action" : "Executer"}
            </button>
            </div>
        ))}
        </div>
      {modal ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h4>{modal.title}</h4>
            <p>{modal.description}</p>
            <div className="modal-actions">
              <button type="button" className="btn btn--secondary" onClick={() => setModal(null)}>
                {language === "en" ? "Cancel" : "Annuler"}
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  addStoryStep(modal.message);
                  setToast(modal.message);
                  setModal(null);
                }}
              >
                {modal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {toast ? <div className="toast" role="status">{toast}</div> : null}
    </>
  );
}
