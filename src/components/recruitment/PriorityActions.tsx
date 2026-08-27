"use client";

import { useState } from "react";
import { useDemoExperience } from "../../lib/demoExperience";
import { BriefingAction } from "../../lib/dashboardBriefing";
import { getCompletedActionImpact, isBriefingActionCompleted } from "../../lib/dashboardExecutionState";

type PriorityActionsProps = {
  language: "en" | "fr";
  actions: BriefingAction[];
};

export function PriorityActions({ language, actions }: PriorityActionsProps) {
  const { state, addStoryStep, openActionIntent } = useDemoExperience();
  const [toast, setToast] = useState<string | null>(null);

  return (
    <>
      <div className="priority-list">
        {actions.map((action, index) => {
          const completed = isBriefingActionCompleted(action.id, state);
          const completedImpact = getCompletedActionImpact(action, state, language);

          return (
            <div
              key={action.id}
              className={`priority-item priority-item--actionable ${completed ? "is-complete" : ""}`}
              data-guided-target={index === 0 ? "priority-1" : undefined}
            >
              <div>
                <p className="priority-item__title">{action.title}</p>
                <p className="priority-item__meta">
                  {action.candidate} - {action.deadline}
                </p>
                <p className="priority-item__impact">
                  {completedImpact ?? action.impact}
                </p>
                <p className="priority-item__owner">
                  {language === "en" ? "Owner" : "Responsable"}: {action.owner}
                </p>
                <span className={`badge ${completed ? "badge--success" : action.urgency === "high" ? "badge--danger" : action.urgency === "medium" ? "badge--warning" : "badge--success"}`}>
                  {completed
                    ? (language === "en" ? "Processed" : "Traitée")
                    : action.urgency === "high"
                      ? language === "en" ? "High urgency" : "Urgence élevée"
                      : action.urgency === "medium"
                        ? language === "en" ? "Medium urgency" : "Urgence moyenne"
                        : language === "en" ? "Low urgency" : "Urgence faible"}
                </span>
              </div>
              <button
                type="button"
                className={completed ? "btn btn--secondary" : index === 0 ? "btn btn--primary" : "btn btn--secondary"}
                disabled={completed}
                onClick={() => {
                  if (action.id === "action-maya-offer") {
                    openActionIntent({ actionId: "validate-maya-salary", language });
                    return;
                  }
                  if (action.id === "action-emma-feedback") {
                    openActionIntent({ actionId: "request-emma-feedback", language });
                    return;
                  }

                  if (action.id === "action-lucas-review") {
                    openActionIntent({
                      actionId: "request-candidate-feedback",
                      language,
                      candidateId: "lucas-martin",
                      owner: state.candidates["lucas-martin"]?.assignedRecruiter ?? "Thomas Lee",
                      recipient: "Thomas Lee",
                    });
                    return;
                  }

                  if (action.id === "action-noah-interview") {
                    openActionIntent({
                      actionId: "mark-candidate-prepared",
                      language,
                      candidateId: "noah-williams",
                      owner: state.candidates["noah-williams"]?.assignedRecruiter ?? "David Klein",
                      interviewLabel: language === "en" ? "Tomorrow 16:00" : "Demain 16:00",
                    });
                    return;
                  }

                  if (action.id === "cover-emma-feedback") {
                    openActionIntent({
                      actionId: "request-emma-feedback",
                      language,
                      owner: state.candidates["emma-laurent"]?.assignedRecruiter ?? "Sarah Martin",
                      recipient: "David Klein",
                    });
                    return;
                  }

                  if (action.id === "cover-maya-offer") {
                    openActionIntent({ actionId: "validate-maya-salary", language });
                    return;
                  }

                  if (action.id === "cover-lucas-feedback") {
                    openActionIntent({
                      actionId: "request-candidate-feedback",
                      language,
                      candidateId: "lucas-martin",
                      owner: state.candidates["lucas-martin"]?.assignedRecruiter ?? "Thomas Lee",
                      recipient: "Thomas Lee",
                    });
                    return;
                  }

                  addStoryStep(action.confirmMessage);
                  setToast(action.confirmMessage);
                }}
              >
                {completed
                  ? (language === "en" ? "Completed" : "Terminée")
                  : language === "en" ? "Run action" : "Exécuter l'action"}
              </button>
            </div>
          );
        })}
      </div>
      {toast ? <div className="toast" role="status">{toast}</div> : null}
    </>
  );
}
