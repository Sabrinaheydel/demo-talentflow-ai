"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "../ui/Badge";
import { getInterviewCandidateById, interviewCandidates, type InterviewCandidate } from "../../lib/demoData";
import { useDemoExperience } from "../../lib/demoExperience";

type DemoState = {
  preparedCandidates: string[];
  feedbackRequests: string[];
};

function createInitialDemoState(): DemoState {
  return {
    preparedCandidates: [],
    feedbackRequests: [],
  };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getStatusTone(status: string) {
  if (status === "Ready" || status === "Complete") return "success";
  if (status === "Feedback pending" || status === "Preparation needed") return "warning";
  return "neutral";
}

export function InterviewsPage({ language }: { language: "en" | "fr" }) {
  const router = useRouter();
  const { state, togglePrepared, requestFeedback, scheduleInterview, completeInterview } = useDemoExperience();
  const [activeCandidateId, setActiveCandidateId] = useState("maya-chen");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [recruiterFilter, setRecruiterFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "priority">("date");
  const [demoState, setDemoState] = useState<DemoState>(createInitialDemoState);
  const [toast, setToast] = useState<string | null>(null);
  const [modal, setModal] = useState<{ title: string; description: string; confirmLabel: string; message: string } | null>(null);
  const modalCloseButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!modal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModal(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    modalCloseButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [modal]);

  const copy = language === "en"
    ? {
        title: "Interviews",
        subtitle: "Plan, prepare and follow up on candidate interviews.",
        actions: {
          schedule: "Schedule interview",
          calendar: "View calendar",
        },
        kpis: [
          { label: "Prep due today", value: "3" },
          { label: "Feedback due today", value: "4" },
          { label: "Decision-ready candidates", value: "2" },
          { label: "Follow-up queue", value: "6" },
        ],
        filters: {
          searchPlaceholder: "Search candidate",
          stage: "Interview stage",
          recruiter: "Recruiter",
          status: "Status",
          sort: "Sort by",
          allStages: "All stages",
          allRecruiters: "All recruiters",
          allStatuses: "All statuses",
          sortDate: "Date",
          sortPriority: "Priority",
        },
        upcomingTitle: "Upcoming interviews",
        upcomingSubtitle: "Prioritize preparation, feedback and follow-up actions.",
        candidateLabel: "Candidate",
        roleLabel: "Role",
        dateLabel: "Date / time",
        stageLabel: "Stage",
        interviewerLabel: "Interviewers",
        statusLabel: "Status",
        priorityLabel: "Priority",
        actionLabel: "Action",
        selectAction: "Review",
        profileAction: "View profile",
        preparationTitlePrefix: "Preparation for",
        matchLabel: "Match score",
        probabilityLabel: "Hiring probability",
        focusTitle: "Focus areas",
        risksTitle: "Risks",
        questionsTitle: "Recommended questions",
        askCopilot: "Ask Copilot",
        openProfile: "Open candidate profile",
        markPrepared: "Mark as prepared",
        prepared: "Prepared",
        feedbackTitle: "Feedback tracking",
        feedbackSubtitle: "Track who has responded and what still needs attention.",
        feedbackStatusComplete: "Complete",
        feedbackStatusPending: "Pending",
        feedbackStatusMissing: "Missing",
        requestFeedback: "Request feedback",
        requestedFeedback: "Requested",
        scorecardTitle: "Interview scorecard",
        scorecardSubtitle: "Use the scorecard to support the decision conversation.",
        recommendationTitle: "TalentFlow AI recommendation",
        recommendationBody: "Complete the final interview and validate compensation expectations before moving to offer.",
        askFollowUp: "Ask follow-up",
        modalTitle: "Schedule interview",
        modalBody: "This demo action confirms the interview and updates the upcoming flow without calling an external system.",
        modalConfirm: "Confirm",
        toastSchedule: "Interview scheduled for demo",
        toastCalendar: "Calendar view ready",
        toastPrepared: "Candidate marked as prepared",
        toastFeedback: "Feedback request sent",
        toastLinked: "Opened Copilot for interview prep",
        toastFollowUp: "Follow-up opened in Copilot",
        demoLabel: "Demo data",
        kpiAriaLabel: "Interview KPI summary",
        scorecardLabels: {
          communication: "Communication",
          roleExpertise: "Role expertise",
          problemSolving: "Problem solving",
          collaboration: "Collaboration",
          cultureFit: "Culture fit",
        },
      }
    : {
        title: "Entretiens",
        subtitle: "Planifiez, préparez et suivez les entretiens candidats.",
        actions: {
          schedule: "Planifier un entretien",
          calendar: "Voir le calendrier",
        },
        kpis: [
          { label: "Préparation à finaliser", value: "3" },
          { label: "Feedback à obtenir", value: "4" },
          { label: "Candidats prêts à décider", value: "2" },
          { label: "File de suivi", value: "6" },
        ],
        filters: {
          searchPlaceholder: "Rechercher un candidat",
          stage: "Étape d’entretien",
          recruiter: "Recruteur",
          status: "Statut",
          sort: "Trier par",
          allStages: "Toutes les étapes",
          allRecruiters: "Tous les recruteurs",
          allStatuses: "Tous les statuts",
          sortDate: "Date",
          sortPriority: "Priorité",
        },
        upcomingTitle: "Entretiens à venir",
        upcomingSubtitle: "Priorisez la préparation, les feedbacks et les actions de suivi.",
        candidateLabel: "Candidat",
        roleLabel: "Poste",
        dateLabel: "Date / heure",
        stageLabel: "Étape",
        interviewerLabel: "Interviewers",
        statusLabel: "Statut",
        priorityLabel: "Priorité",
        actionLabel: "Action",
        selectAction: "Examiner",
        profileAction: "Voir le profil",
        preparationTitlePrefix: "Préparation pour",
        matchLabel: "Score de match",
        probabilityLabel: "Probabilité d’embauche",
        focusTitle: "Axes de focus",
        risksTitle: "Risques",
        questionsTitle: "Questions recommandées",
        askCopilot: "Demander au Copilot",
        openProfile: "Voir le profil candidat",
        markPrepared: "Marquer comme préparé",
        prepared: "Préparé",
        feedbackTitle: "Suivi des feedbacks",
        feedbackSubtitle: "Suivez qui a répondu et ce qui doit encore être traité.",
        feedbackStatusComplete: "Terminé",
        feedbackStatusPending: "En attente",
        feedbackStatusMissing: "Manquant",
        requestFeedback: "Demander le feedback",
        requestedFeedback: "Demandé",
        scorecardTitle: "Scorecard d’entretien",
        scorecardSubtitle: "Utilisez la scorecard pour soutenir la conversation de décision.",
        recommendationTitle: "Recommandation TalentFlow AI",
        recommendationBody: "Finalisez l’entretien et validez les attentes salariales avant de passer à l’offre.",
        askFollowUp: "Poser une question",
        modalTitle: "Planifier un entretien",
        modalBody: "Cette action de démo confirme l’entretien et met à jour le flux sans appeler de système externe.",
        modalConfirm: "Confirmer",
        toastSchedule: "Entretien planifié pour la démo",
        toastCalendar: "Vue calendrier prête",
        toastPrepared: "Candidat marqué comme préparé",
        toastFeedback: "Demande de feedback envoyée",
        toastLinked: "Copilot ouvert pour la préparation d’entretien",
        toastFollowUp: "Question de suivi ouverte dans Copilot",
        demoLabel: "Données de démo",
        kpiAriaLabel: "Résumé des KPI d’entretien",
        scorecardLabels: {
          communication: "Communication",
          roleExpertise: "Expertise du poste",
          problemSolving: "Résolution de problèmes",
          collaboration: "Collaboration",
          cultureFit: "Adéquation culturelle",
        },
      };

  const visibleCandidates = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = interviewCandidates.filter((candidate) => {
      const matchesSearch = [candidate.name, candidate.role, candidate.stage, candidate.interviewers.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesStage = stageFilter === "all" || candidate.stage === stageFilter;
      const matchesRecruiter = recruiterFilter === "all" || candidate.interviewers.includes(recruiterFilter);
      const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;

      return matchesSearch && matchesStage && matchesRecruiter && matchesStatus;
    });

    return filtered.sort((left, right) => {
      if (sortBy === "priority") {
        return (right.priority === "High" ? 1 : 0) - (left.priority === "High" ? 1 : 0);
      }

      const dateOrder = { Today: 0, Tomorrow: 1 };
      const leftOrder = dateOrder[left.date as keyof typeof dateOrder] ?? 2;
      const rightOrder = dateOrder[right.date as keyof typeof dateOrder] ?? 2;
      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      return left.time.localeCompare(right.time);
    });
  }, [recruiterFilter, search, sortBy, stageFilter, statusFilter]);

  const selectedCandidate = useMemo(() => {
    const fromList = visibleCandidates.find((candidate) => candidate.id === activeCandidateId);
    return fromList ?? getInterviewCandidateById(activeCandidateId);
  }, [activeCandidateId, visibleCandidates]);

  const isPrepared = state.candidates[selectedCandidate.id]?.prepared ?? false;
  const feedbackRequested = state.candidates[selectedCandidate.id]?.feedbackRequested ?? false;

  const stageOptions = useMemo(() => Array.from(new Set(interviewCandidates.map((candidate) => candidate.stage))), []);
  const recruiterOptions = useMemo(() => Array.from(new Set(interviewCandidates.flatMap((candidate) => candidate.interviewers))), []);
  const statusOptions = useMemo(() => Array.from(new Set(interviewCandidates.map((candidate) => candidate.status))), []);

  const feedbackSummary = feedbackRequested
    ? copy.requestedFeedback
    : selectedCandidate.feedback.some((item) => item.status === "missing")
      ? copy.feedbackStatusMissing
      : selectedCandidate.feedback.some((item) => item.status === "pending")
        ? copy.feedbackStatusPending
        : copy.feedbackStatusComplete;

  return (
    <div className="interviews-shell">
      <section className="section-card interviews-overview">
        <div className="section-card__header">
          <div>
            <h2>{copy.title}</h2>
            <p>{copy.subtitle}</p>
          </div>
          <div className="candidate-summary__chips">
            <span className="demo-pill">{copy.demoLabel}</span>
          </div>
        </div>

        <div className="interviews-toolbar">
          <div className="interviews-actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setModal({
                title: copy.modalTitle,
                description: copy.modalBody,
                confirmLabel: copy.modalConfirm,
                message: copy.toastSchedule,
              })}
            >
              {copy.actions.schedule}
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => {
                setToast(copy.toastCalendar);
              }}
            >
              {copy.actions.calendar}
            </button>
          </div>
        </div>
      </section>

      <section className="interviews-kpi-grid" aria-label={copy.kpiAriaLabel}>
        {copy.kpis.map((item) => (
          <div key={item.label} className="stat-card stat-card--hover">
            <div className="stat-card__top">
              <div className="stat-icon">↗</div>
              <span className="trend-badge trend-badge--up">+12%</span>
            </div>
            <p className="stat-card__value">{item.value}</p>
            <p className="stat-card__label">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="section-card">
        <div className="section-card__header">
          <h3>{copy.upcomingTitle}</h3>
          <p>{copy.upcomingSubtitle}</p>
        </div>

        <div className="interview-toolbar-grid">
          <label className="pipeline-toolbar__field">
            <span>{copy.filters.searchPlaceholder}</span>
            <input
              aria-label={copy.filters.searchPlaceholder}
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={copy.filters.searchPlaceholder}
            />
          </label>

          <label className="pipeline-toolbar__field">
            <span>{copy.filters.stage}</span>
            <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)}>
              <option value="all">{copy.filters.allStages}</option>
              {stageOptions.map((stage) => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </label>

          <label className="pipeline-toolbar__field">
            <span>{copy.filters.recruiter}</span>
            <select value={recruiterFilter} onChange={(event) => setRecruiterFilter(event.target.value)}>
              <option value="all">{copy.filters.allRecruiters}</option>
              {recruiterOptions.map((recruiter) => (
                <option key={recruiter} value={recruiter}>{recruiter}</option>
              ))}
            </select>
          </label>

          <label className="pipeline-toolbar__field">
            <span>{copy.filters.status}</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">{copy.filters.allStatuses}</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>

          <label className="pipeline-toolbar__field">
            <span>{copy.filters.sort}</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value as "date" | "priority") }>
              <option value="date">{copy.filters.sortDate}</option>
              <option value="priority">{copy.filters.sortPriority}</option>
            </select>
          </label>
        </div>

        <div className="interview-list-grid">
          <div className="interview-list-stack">
            {visibleCandidates.length === 0 ? (
              <div className="pipeline-empty-state">
                <h3>{language === "en" ? "No interviews match this view" : "Aucun entretien ne correspond à cette vue"}</h3>
                <p>{language === "en" ? "Try broadening the filters or clearing the search to see the full interview queue." : "Essayez d’élargir les filtres ou d’effacer la recherche pour voir toute la file d’entretiens."}</p>
              </div>
            ) : null}
            {visibleCandidates.map((candidate) => {
              const isActive = selectedCandidate.id === candidate.id;
              return (
                <div key={candidate.id} className={`interview-card ${isActive ? "is-active" : ""}`}>
                  <div className="interview-card__top">
                    <div className="interview-card__identity">
                      <div className="avatar avatar--sm">{getInitials(candidate.name)}</div>
                      <div>
                        <strong>{candidate.name}</strong>
                        <p>{candidate.role}</p>
                      </div>
                    </div>
                    <Badge label={candidate.priority} tone={candidate.priority === "High" ? "warning" : "neutral"} />
                  </div>

                  <div className="interview-card__detail-row">
                    <span>{candidate.date} • {candidate.time}</span>
                    <span>{candidate.stage}</span>
                  </div>

                  <div className="interview-card__detail-row">
                    <span>{candidate.interviewers.join(" + ")}</span>
                    <Badge label={candidate.status} tone={getStatusTone(candidate.status)} />
                  </div>

                  <div className="interview-actions">
                    <button type="button" className="btn btn--secondary" onClick={() => setActiveCandidateId(candidate.id)}>{copy.selectAction}</button>
                    {candidate.id === "maya-chen" ? (
                      <Link href="/candidate-profile" className="btn btn--ghost">{copy.profileAction}</Link>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="interview-detail-panel">
            <div className="section-card interview-detail-card">
              <div className="section-card__header">
                <div>
                  <h3>{selectedCandidate.name}</h3>
                  <p>{selectedCandidate.role}</p>
                </div>
                <div className="candidate-summary__chips">
                  <Badge label={selectedCandidate.priority} tone={selectedCandidate.priority === "High" ? "warning" : "neutral"} />
                  <Badge label={selectedCandidate.status} tone={getStatusTone(selectedCandidate.status)} />
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-card">
                  <p>{copy.dateLabel}</p>
                  <strong>{selectedCandidate.date} • {selectedCandidate.time}</strong>
                </div>
                <div className="detail-card">
                  <p>{copy.stageLabel}</p>
                  <strong>{selectedCandidate.stage}</strong>
                </div>
                <div className="detail-card">
                  <p>{copy.interviewerLabel}</p>
                  <strong>{selectedCandidate.interviewers.join(" + ")}</strong>
                </div>
                <div className="detail-card">
                  <p>{copy.statusLabel}</p>
                  <strong>{selectedCandidate.status}</strong>
                </div>
              </div>

              <div className="detail-list">
                <h4>{`${copy.preparationTitlePrefix} ${selectedCandidate.name}`}</h4>
                <div className="interview-chip-row">
                  <div className="detail-card detail-card--compact">
                    <p>{copy.matchLabel}</p>
                    <strong>{selectedCandidate.match}%</strong>
                  </div>
                  <div className="detail-card detail-card--compact">
                    <p>{copy.probabilityLabel}</p>
                    <strong>{selectedCandidate.probability}%</strong>
                  </div>
                </div>
                <div className="detail-list__section">
                  <h5>{copy.focusTitle}</h5>
                  <ul className="bullet-list">
                    {selectedCandidate.focusAreas.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="detail-list__section">
                  <h5>{copy.risksTitle}</h5>
                  <ul className="bullet-list bullet-list--warning">
                    {selectedCandidate.risks.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="detail-list__section">
                  <h5>{copy.questionsTitle}</h5>
                  <ol className="bullet-list">
                    {selectedCandidate.questions.map((item) => <li key={item}>{item}</li>)}
                  </ol>
                </div>
                <div className="interview-actions">
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => {
                      router.push(`/copilot?candidate=${selectedCandidate.id}&mode=interview-prep`);
                      setToast(copy.toastLinked);
                    }}
                  >
                    {copy.askCopilot}
                  </button>
                  {selectedCandidate.id === "maya-chen" ? (
                    <Link href="/candidate-profile" className="btn btn--secondary">{copy.openProfile}</Link>
                  ) : null}
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => {
                      togglePrepared(selectedCandidate.id);
                      setToast(copy.toastPrepared);
                    }}
                  >
                    {isPrepared ? copy.prepared : copy.markPrepared}
                  </button>
                </div>
              </div>

              <div className="detail-list detail-list--accent">
                <h4>{copy.feedbackTitle}</h4>
                <p>{copy.feedbackSubtitle}</p>
                <div className="feedback-list">
                  {selectedCandidate.feedback.map((entry) => {
                    const rowStatus = feedbackRequested ? copy.requestedFeedback : entry.status === "complete" ? copy.feedbackStatusComplete : entry.status === "pending" ? copy.feedbackStatusPending : copy.feedbackStatusMissing;
                    return (
                      <div key={entry.interviewer} className="feedback-row">
                        <div>
                          <strong>{entry.interviewer}</strong>
                          <p>{entry.received}/{entry.expected} {copy.feedbackStatusComplete.toLowerCase()}</p>
                        </div>
                        <div className="feedback-row__status">
                          <Badge label={rowStatus} tone={rowStatus === copy.feedbackStatusComplete ? "success" : rowStatus === copy.feedbackStatusPending ? "warning" : "neutral"} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="interview-actions">
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => {
                      requestFeedback(selectedCandidate.id);
                      setToast(copy.toastFeedback);
                    }}
                  >
                    {copy.requestFeedback}
                  </button>
                  <span className="demo-pill">{feedbackSummary}</span>
                </div>
              </div>

              <div className="detail-list">
                <h4>{copy.scorecardTitle}</h4>
                <p>{copy.scorecardSubtitle}</p>
                <div className="scorecard-grid">
                  {Object.entries(selectedCandidate.scorecard).map(([key, value]) => (
                    <div key={key} className="scorecard-item">
                      <span>{copy.scorecardLabels[key as keyof typeof copy.scorecardLabels]}</span>
                      <strong>{value}/5</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-list detail-list--accent">
                <h4>{copy.recommendationTitle}</h4>
                <p>{copy.recommendationBody}</p>
                <div className="interview-actions">
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => {
                      completeInterview(selectedCandidate.id);
                      router.push(`/copilot?candidate=${selectedCandidate.id}&mode=follow-up`);
                      setToast(copy.toastFollowUp);
                    }}
                  >
                    {copy.askFollowUp}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {modal ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setModal(null)}>
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="interview-modal-title" onClick={(event) => event.stopPropagation()}>
            <div className="interview-actions" style={{ justifyContent: "flex-end" }}>
              <button ref={modalCloseButtonRef} type="button" className="btn btn--ghost" aria-label={language === "en" ? "Close dialog" : "Fermer la boîte de dialogue"} onClick={() => setModal(null)}>
                ×
              </button>
            </div>
            <h4 id="interview-modal-title">{modal.title}</h4>
            <p>{modal.description}</p>
            <div className="modal-actions">
              <button type="button" className="btn btn--secondary" onClick={() => setModal(null)}>{language === "en" ? "Cancel" : "Annuler"}</button>
              <button type="button" className="btn btn--primary" onClick={() => { scheduleInterview(selectedCandidate.id); setModal(null); setToast(modal.message); }}>{modal.confirmLabel}</button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? <div className="toast" role="status">{toast}</div> : null}
    </div>
  );
}
