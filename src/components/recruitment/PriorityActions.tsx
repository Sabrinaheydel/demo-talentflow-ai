"use client";

import { useState } from "react";
import { useDemoExperience } from "../../lib/demoExperience";

type PriorityActionsProps = {
  language: "en" | "fr";
};

export function PriorityActions({ language }: PriorityActionsProps) {
  const { addStoryStep } = useDemoExperience();
  const [toast, setToast] = useState<string | null>(null);
  const [modal, setModal] = useState<{ title: string; description: string; confirmLabel: string; message: string } | null>(null);

  return (
    <>
      <div className="priority-list">
        <div className="priority-item">
        <div>
          <p className="priority-item__title">
            {language === "en" ? "Schedule final interviews" : "Planifier les entretiens finaux"}
          </p>
          <p className="priority-item__meta">
            {language === "en" ? "4 candidates ready for decision" : "4 candidats prêts pour décision"}
          </p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setModal({
            title: language === "en" ? "Review candidate" : "Examiner le candidat",
            description: language === "en"
              ? "This action opens a decision-ready review card for the hiring team."
              : "Cette action ouvre une fiche prête à décider pour l’équipe de recrutement.",
            confirmLabel: language === "en" ? "Review" : "Examiner",
            message: language === "en" ? "Review flow opened" : "Flux d’examen ouvert",
          })}
        >
          {language === "en" ? "Review" : "Examiner"}
        </button>
      </div>
      <div className="priority-item">
        <div>
          <p className="priority-item__title">
            {language === "en" ? "Approve compensation bands" : "Approuver les grilles salariales"}
          </p>
          <p className="priority-item__meta">
            {language === "en" ? "2 roles need benchmark review" : "2 postes nécessitent une comparaison de marché"}
          </p>
        </div>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => setModal({
            title: language === "en" ? "Open benchmark review" : "Ouvrir la revue de benchmark",
            description: language === "en"
              ? "The demo opens the compensation and role-fit context for the selected hiring action."
              : "La démo ouvre le contexte de rémunération et d’adéquation au poste pour l’action de recrutement sélectionnée.",
            confirmLabel: language === "en" ? "Open" : "Ouvrir",
            message: language === "en" ? "Benchmark workspace opened" : "Espace de benchmark ouvert",
          })}
        >
          {language === "en" ? "Open" : "Ouvrir"}
        </button>
        </div>
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
              <button type="button" className="btn btn--primary" onClick={() => { addStoryStep(modal.message); setToast(modal.message); setModal(null); }}>
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
