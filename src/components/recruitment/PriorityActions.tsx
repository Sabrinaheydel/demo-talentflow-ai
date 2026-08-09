"use client";

import { useState } from "react";
import { useDemoExperience } from "../../lib/demoExperience";
import { BriefingAction } from "../../lib/dashboardBriefing";

type PriorityActionsProps = {
  language: "en" | "fr";
  actions: BriefingAction[];
};

export function PriorityActions({ language, actions }: PriorityActionsProps) {
  const { state, addStoryStep, openActionIntent } = useDemoExperience();
  const [toast, setToast] = useState<string | null>(null);

  const mayaSalaryDone = state.candidates["maya-chen"]?.salaryAligned;
  const emmaFeedbackDone = state.candidates["emma-laurent"]?.feedbackRequested;

  return (
    <>
      <div className="priority-list">
        {actions.map((action, index) => (
          <div
            key={action.id}
            className="priority-item priority-item--actionable"
            data-guided-target={index === 0 ? "priority-1" : undefined}
          >
            <div>
              <p className="priority-item__title">{action.title}</p>
              <p className="priority-item__meta">
                {action.candidate} - {action.deadline}
              </p>
              <p className="priority-item__impact">
                {action.id === "action-maya-offer" && mayaSalaryDone
                  ? (language === "en" ? "Salary aligned. Offer risk reduced." : "Salaire aligne. Risque offre reduit.")
                  : action.id === "action-emma-feedback" && emmaFeedbackDone
                    ? (language === "en" ? "Feedback request sent with deadline tracking." : "Demande de feedback envoyee avec suivi d'echeance.")
                    : action.impact}
              </p>
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
              disabled={(action.id === "action-maya-offer" && mayaSalaryDone) || (action.id === "action-emma-feedback" && emmaFeedbackDone)}
              onClick={() => {
                if (action.id === "action-maya-offer") {
                  openActionIntent({ actionId: "validate-maya-salary", language });
                  return;
                }
                if (action.id === "action-emma-feedback") {
                  openActionIntent({ actionId: "request-emma-feedback", language });
                  return;
                }

                addStoryStep(action.confirmMessage);
                setToast(action.confirmMessage);
              }}
            >
              {(action.id === "action-maya-offer" && mayaSalaryDone) || (action.id === "action-emma-feedback" && emmaFeedbackDone)
                ? (language === "en" ? "Completed" : "Termine")
                : language === "en" ? "Run action" : "Executer"}
            </button>
            </div>
        ))}
        </div>
      {toast ? <div className="toast" role="status">{toast}</div> : null}
    </>
  );
}
