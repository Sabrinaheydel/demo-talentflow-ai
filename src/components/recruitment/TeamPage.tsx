"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "../ui/Badge";
import { canonicalCandidates } from "../../lib/demoData";
import { useDemoExperience } from "../../lib/demoExperience";

type TeamStatus = "Busy" | "Available" | "In meetings";
type AvailabilityFilter = "all" | "available" | "busy" | "in-meetings";
type WorkloadBand = "all" | "under70" | "70to90" | "over90";
type PendingFeedbackBand = "all" | "low" | "high";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  title: string;
  workload: number;
  interviewsToday: number;
  assignedCandidates: number;
  pendingFeedback: number;
  status: TeamStatus;
  candidateIds: string[];
};

const teamMembers: TeamMember[] = [
  {
    id: "sarah-martin",
    name: "Sarah Martin",
    role: "Talent Acquisition Lead",
    title: "Talent Acquisition Lead",
    workload: 92,
    interviewsToday: 2,
    assignedCandidates: 8,
    pendingFeedback: 1,
    status: "Busy",
    candidateIds: ["maya-chen", "lucas-martin", "emma-laurent", "noah-williams"],
  },
  {
    id: "thomas-lee",
    name: "Thomas Lee",
    role: "Senior Recruiter",
    title: "Senior Recruiter",
    workload: 74,
    interviewsToday: 1,
    assignedCandidates: 6,
    pendingFeedback: 0,
    status: "Available",
    candidateIds: ["maya-chen", "lucas-martin"],
  },
  {
    id: "david-klein",
    name: "David Klein",
    role: "Hiring Manager",
    title: "Hiring Manager",
    workload: 81,
    interviewsToday: 2,
    assignedCandidates: 5,
    pendingFeedback: 2,
    status: "In meetings",
    candidateIds: ["emma-laurent", "noah-williams"],
  },
  {
    id: "emily-carter",
    name: "Emily Carter",
    role: "Recruiter",
    title: "Recruiter",
    workload: 65,
    interviewsToday: 0,
    assignedCandidates: 5,
    pendingFeedback: 2,
    status: "Available",
    candidateIds: ["lucas-martin", "noah-williams"],
  },
];

export function TeamPage({ language }: { language: "en" | "fr" }) {
  const router = useRouter();
  const { state, reassignCandidate, togglePrepared, requestFeedback } = useDemoExperience();
  const [toast, setToast] = useState<string | null>(null);
  const [recruiterFilter, setRecruiterFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>("all");
  const [workloadFilter, setWorkloadFilter] = useState<WorkloadBand>("all");
  const [feedbackFilter, setFeedbackFilter] = useState<PendingFeedbackBand>("all");

  const copy = language === "en"
    ? {
        title: "Team",
        subtitle: "Coordinate recruiters and hiring managers across every hiring process.",
        demoLabel: "Demo data",
        primaryAction: "Assign candidate",
        secondaryAction: "View workload",
        tertiaryAction: "Request feedback",
        openInterview: "Open interview",
        askCopilot: "Ask Copilot",
        recruiterLabel: "Recruiter",
        roleLabel: "Role",
        availabilityLabel: "Availability",
        workloadLabel: "Workload",
        pendingFeedbackLabel: "Pending feedback",
        kpis: [
          { label: "Recruiters", value: "4" },
          { label: "Candidates assigned", value: "24" },
          { label: "Feedback pending", value: "5" },
          { label: "Average workload", value: "83%" },
        ],
        membersTitle: "Team members",
        workloadTitle: "Team workload",
        workloadBody: "Use the workload view to spot overload and keep interviews moving.",
        assignedTitle: "Assigned candidates",
        collaborationTitle: "Recent collaboration",
        activity: [
          "Thomas submitted interview feedback for Maya Chen.",
          "Sarah assigned Emma Laurent to David Klein.",
          "Interview scheduled with Noah Williams.",
          "Feedback requested from Emily Carter.",
        ],
        filters: {
          recruiter: "Recruiter",
          role: "Role",
          availability: "Availability",
          workload: "Workload",
          pendingFeedback: "Pending feedback",
          all: "All",
          available: "Available",
          busy: "Busy",
          inMeetings: "In meetings",
          under70: "Under 70%",
          between: "70–90%",
          over90: "Over 90%",
          low: "Low",
          high: "High",
        },
        metrics: {
          interviewsToday: "Interviews today",
          assignedCandidates: "Assigned candidates",
          pendingFeedback: "Pending feedback",
          currentStatus: "Current status",
          workload: "Workload",
        },
        actions: {
          assign: "Assignment flow simulated for the next handoff.",
          workload: "Workload view updated for the current team mix.",
          feedback: "Feedback reminder sent to the selected recruiter.",
          interview: "Opened the interview workspace.",
          copilot: "Opened Copilot with a team context.",
        },
      }
    : {
        title: "Équipe",
        subtitle: "Coordonnez recruteurs et managers tout au long du recrutement.",
        demoLabel: "Données de démo",
        primaryAction: "Assigner un candidat",
        secondaryAction: "Voir la charge",
        tertiaryAction: "Demander un feedback",
        openInterview: "Ouvrir l’entretien",
        askCopilot: "Demander au Copilot",
        recruiterLabel: "Recruteur",
        roleLabel: "Rôle",
        availabilityLabel: "Disponibilité",
        workloadLabel: "Charge",
        pendingFeedbackLabel: "Feedbacks en attente",
        kpis: [
          { label: "Recruteurs", value: "4" },
          { label: "Candidats assignés", value: "24" },
          { label: "Feedbacks en attente", value: "5" },
          { label: "Charge moyenne", value: "83%" },
        ],
        membersTitle: "Membres de l’équipe",
        workloadTitle: "Charge de travail",
        workloadBody: "Utilisez cette vue pour repérer la surcharge et maintenir les entretiens à flot.",
        assignedTitle: "Candidats assignés",
        collaborationTitle: "Collaboration récente",
        activity: [
          "Thomas a soumis un feedback d’entretien pour Maya Chen.",
          "Sarah a assigné Emma Laurent à David Klein.",
          "Un entretien a été planifié avec Noah Williams.",
          "Un feedback a été demandé à Emily Carter.",
        ],
        filters: {
          recruiter: "Recruteur",
          role: "Rôle",
          availability: "Disponibilité",
          workload: "Charge",
          pendingFeedback: "Feedbacks en attente",
          all: "Tous",
          available: "Disponible",
          busy: "Occupé",
          inMeetings: "En réunion",
          under70: "Moins de 70%",
          between: "70–90%",
          over90: "Plus de 90%",
          low: "Faible",
          high: "Élevé",
        },
        metrics: {
          interviewsToday: "Entretiens aujourd’hui",
          assignedCandidates: "Candidats assignés",
          pendingFeedback: "Feedbacks en attente",
          currentStatus: "Statut actuel",
          workload: "Charge",
        },
        actions: {
          assign: "Le flux d’assignation est simulé pour la prochaine main courante.",
          workload: "La vue de charge a été mise à jour pour le mix actuel de l’équipe.",
          feedback: "Un rappel de feedback a été envoyé au recruteur sélectionné.",
          interview: "L’espace d’entretien a été ouvert.",
          copilot: "Le Copilot a été ouvert avec un contexte équipe.",
        },
      };

  const visibleMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesRecruiter = recruiterFilter === "all" || member.name === recruiterFilter;
      const matchesRole = roleFilter === "all" || member.role === roleFilter;
      const matchesAvailability = availabilityFilter === "all"
        || (availabilityFilter === "available" && member.status === "Available")
        || (availabilityFilter === "busy" && member.status === "Busy")
        || (availabilityFilter === "in-meetings" && member.status === "In meetings");
      const matchesWorkload = workloadFilter === "all"
        || (workloadFilter === "under70" && member.workload < 70)
        || (workloadFilter === "70to90" && member.workload >= 70 && member.workload <= 90)
        || (workloadFilter === "over90" && member.workload > 90);
      const matchesFeedback = feedbackFilter === "all"
        || (feedbackFilter === "low" && member.pendingFeedback <= 1)
        || (feedbackFilter === "high" && member.pendingFeedback > 1);

      return matchesRecruiter && matchesRole && matchesAvailability && matchesWorkload && matchesFeedback;
    });
  }, [availabilityFilter, feedbackFilter, recruiterFilter, roleFilter, workloadFilter]);

  const recruiterOptions = ["all", ...teamMembers.map((member) => member.name)];
  const roleOptions = ["all", ...teamMembers.map((member) => member.role)];

  const statusTone = (workload: number) => (workload > 90 ? "danger" : workload >= 70 ? "warning" : "success");
  const workloadBand = (workload: number) => (workload > 90 ? "over90" : workload >= 70 ? "70to90" : "under70");

  return (
    <div className="team-shell">
      <section className="section-card">
        <div className="section-card__header">
          <div>
            <h3>{copy.title}</h3>
            <p>{copy.subtitle}</p>
          </div>
          <div className="candidate-summary__chips">
            <span className="demo-pill">{copy.demoLabel}</span>
          </div>
        </div>

        <div className="team-kpi-grid">
          {copy.kpis.map((item) => (
            <div key={item.label} className="detail-card">
              <p>{item.label}</p>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        <div className="team-actions">
          <button type="button" className="btn btn--primary" onClick={() => {
            reassignCandidate("maya-chen", "David Klein");
            setToast(copy.actions.assign);
          }}>{copy.primaryAction}</button>
          <button type="button" className="btn btn--secondary" onClick={() => {
            togglePrepared("maya-chen");
            setToast(copy.actions.workload);
          }}>{copy.secondaryAction}</button>
          <button type="button" className="btn btn--secondary" onClick={() => {
            requestFeedback("maya-chen");
            setToast(copy.actions.feedback);
          }}>{copy.tertiaryAction}</button>
          <button type="button" className="btn btn--ghost" onClick={() => router.push("/interviews")}>{copy.openInterview}</button>
          <button type="button" className="btn btn--ghost" onClick={() => router.push("/copilot?context=team&mode=team-review")}>{copy.askCopilot}</button>
        </div>

        <div className="team-filter-grid">
          <label className="pipeline-toolbar__field">
            <span>{copy.filters.recruiter}</span>
            <select value={recruiterFilter} onChange={(event) => setRecruiterFilter(event.target.value)}>
              <option value="all">{copy.filters.all}</option>
              {recruiterOptions.slice(1).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="pipeline-toolbar__field">
            <span>{copy.filters.role}</span>
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
              <option value="all">{copy.filters.all}</option>
              {roleOptions.slice(1).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="pipeline-toolbar__field">
            <span>{copy.filters.availability}</span>
            <select value={availabilityFilter} onChange={(event) => setAvailabilityFilter(event.target.value as AvailabilityFilter)}>
              <option value="all">{copy.filters.all}</option>
              <option value="available">{copy.filters.available}</option>
              <option value="busy">{copy.filters.busy}</option>
              <option value="in-meetings">{copy.filters.inMeetings}</option>
            </select>
          </label>

          <label className="pipeline-toolbar__field">
            <span>{copy.filters.workload}</span>
            <select value={workloadFilter} onChange={(event) => setWorkloadFilter(event.target.value as WorkloadBand)}>
              <option value="all">{copy.filters.all}</option>
              <option value="under70">{copy.filters.under70}</option>
              <option value="70to90">{copy.filters.between}</option>
              <option value="over90">{copy.filters.over90}</option>
            </select>
          </label>

          <label className="pipeline-toolbar__field">
            <span>{copy.filters.pendingFeedback}</span>
            <select value={feedbackFilter} onChange={(event) => setFeedbackFilter(event.target.value as PendingFeedbackBand)}>
              <option value="all">{copy.filters.all}</option>
              <option value="low">{copy.filters.low}</option>
              <option value="high">{copy.filters.high}</option>
            </select>
          </label>
        </div>

        <div className="team-grid">
          {visibleMembers.length === 0 ? (
            <div className="pipeline-empty-state" style={{ gridColumn: "1 / -1" }}>
              <h3>{language === "en" ? "No team members match this view" : "Aucun membre d’équipe ne correspond à cette vue"}</h3>
              <p>{language === "en" ? "Use a broader filter selection to surface the current team mix again." : "Utilisez une sélection de filtres plus large pour retrouver le mix actuel de l’équipe."}</p>
            </div>
          ) : null}
          {visibleMembers.map((member) => (
            <article key={member.id} className="team-card">
              <div className="team-card__top">
                <div className="avatar">{member.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
                <div>
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                </div>
              </div>

              <div className="team-card__badges">
                <Badge label={member.status} tone={member.status === "Available" ? "success" : member.status === "Busy" ? "warning" : "neutral"} />
                <Badge label={`${member.workload}%`} tone={statusTone(member.workload)} />
              </div>

              <div className="team-card__metrics">
                <div>
                  <span>{copy.metrics.interviewsToday}</span>
                  <strong>{member.interviewsToday}</strong>
                </div>
                <div>
                  <span>{copy.metrics.assignedCandidates}</span>
                  <strong>{member.assignedCandidates}</strong>
                </div>
                <div>
                  <span>{copy.metrics.pendingFeedback}</span>
                  <strong>{member.pendingFeedback}</strong>
                </div>
                <div>
                  <span>{copy.metrics.currentStatus}</span>
                  <strong>{member.status}</strong>
                </div>
              </div>

              <div className="team-card__workload" aria-label={`${member.name} workload ${member.workload}%`}>
                <div className="team-card__workload-label">
                  <span>{copy.metrics.workload}</span>
                  <strong>{member.workload}%</strong>
                </div>
                <div className={`workload-bar workload-bar--${workloadBand(member.workload)}`}>
                  <span style={{ width: `${member.workload}%` }} />
                </div>
              </div>

              <div className="team-card__assigned">
                <div className="team-card__assigned-header">
                  <h5>{copy.assignedTitle}</h5>
                </div>
                <ul>
                  {member.candidateIds.map((candidateId) => {
                    const candidate = canonicalCandidates.find((item) => item.id === candidateId);
                    if (!candidate) return null;
                    return (
                      <li key={candidate.id}>
                        <Link href="/candidate-profile">
                          <strong>{candidate.name}</strong>
                          <span>{candidate.stage}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="team-card__actions">
                <button type="button" className="btn btn--secondary" onClick={() => {
                  reassignCandidate("maya-chen", member.name);
                  setToast(`${member.name} • ${copy.actions.feedback}`);
                }}>{copy.tertiaryAction}</button>
                <button type="button" className="btn btn--ghost" onClick={() => router.push("/interviews")}>{copy.openInterview}</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__header">
          <h3>{copy.workloadTitle}</h3>
          <p>{copy.workloadBody}</p>
        </div>
        <div className="detail-grid">
          <div className="detail-card">
            <p>{language === "en" ? "Top bottleneck" : "Goulot d’étranglement principal"}</p>
            <strong>{language === "en" ? "Feedback turnaround" : "Temps de retour des feedbacks"}</strong>
          </div>
          <div className="detail-card">
            <p>{language === "en" ? "Most urgent handoff" : "Transfert le plus urgent"}</p>
            <strong>{language === "en" ? "Maya Chen final interview" : "Entretien final de Maya Chen"}</strong>
          </div>
          <div className="detail-card">
            <p>{language === "en" ? "Recruiter needing coverage" : "Recruteur ayant besoin d’aide"}</p>
            <strong>{language === "en" ? "Emily Carter" : "Emily Carter"}</strong>
          </div>
          <div className="detail-card">
            <p>{language === "en" ? "Active owner" : "Responsable actif"}</p>
            <strong>{language === "en" ? "Sarah Martin" : "Sarah Martin"}</strong>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__header">
          <h3>{copy.collaborationTitle}</h3>
        </div>
        <div className="team-activity-list">
          {copy.activity.map((item) => (
            <div key={item} className="team-activity-item">
              <span>•</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      {toast ? <div className="toast" role="status">{toast}</div> : null}
    </div>
  );
}
