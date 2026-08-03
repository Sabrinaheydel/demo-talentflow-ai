"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "../ui/Badge";
import { Icon } from "../ui/Icon";

type CandidateStatus = "Applied" | "Screening" | "Interview" | "Offer" | "Hired";

type Candidate = {
  id: number;
  name: string;
  role: string;
  match: number;
  status: CandidateStatus;
  recruiter: string;
  activity: string;
  priority: "Urgent" | "Medium" | "Watch";
  urgent?: boolean;
  location: string;
};

const candidateSeed: Candidate[] = [
  {
    id: 1,
    name: "Maya Chen",
    role: "Senior Product Engineer",
    match: 96,
    status: "Interview",
    recruiter: "Nina Patel",
    activity: "Portfolio reviewed • 2h ago",
    priority: "Urgent",
    urgent: true,
    location: "New York, US",
  },
  {
    id: 2,
    name: "Daniel Ortiz",
    role: "Principal ML Engineer",
    match: 92,
    status: "Screening",
    recruiter: "Amira Cole",
    activity: "Screening call booked • 4h ago",
    priority: "Medium",
    location: "Austin, US",
  },
  {
    id: 3,
    name: "Priya Shah",
    role: "Staff Data Scientist",
    match: 89,
    status: "Applied",
    recruiter: "Liam Brooks",
    activity: "Application received • Today",
    priority: "Watch",
    location: "London, UK",
  },
  {
    id: 4,
    name: "Noah Bennett",
    role: "Engineering Manager",
    match: 94,
    status: "Offer",
    recruiter: "Sage Chen",
    activity: "Compensation review • 1d ago",
    priority: "Urgent",
    urgent: true,
    location: "Remote • Canada",
  },
  {
    id: 5,
    name: "Elena Morales",
    role: "Senior Frontend Engineer",
    match: 87,
    status: "Hired",
    recruiter: "Mina Torres",
    activity: "Offer accepted • 2d ago",
    priority: "Medium",
    location: "Barcelona, ES",
  },
  {
    id: 6,
    name: "Jules Carter",
    role: "Head of Product Analytics",
    match: 90,
    status: "Interview",
    recruiter: "Ravi Singh",
    activity: "Panel prep shared • 3h ago",
    priority: "Medium",
    location: "Chicago, US",
  },
];

const statuses: CandidateStatus[] = ["Applied", "Screening", "Interview", "Offer", "Hired"];

type PipelineBoardProps = {
  language: "en" | "fr";
};

export function PipelineBoard({ language }: PipelineBoardProps) {
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("all");
  const [recruiterFilter, setRecruiterFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"match" | "priority" | "activity">("priority");

  const copy = language === "en"
    ? {
        title: "Recruitment pipeline",
        subtitle: "A premium command center for high-signal hiring opportunities.",
        insight: "AI recommendation",
        insightText: "Prioritize Maya Chen and Noah Bennett for this week’s executive review to protect momentum.",
        searchPlaceholder: "Search candidates",
        allJobs: "All roles",
        allRecruiters: "All recruiters",
        sortLabel: "Sort by",
        addCandidate: "Add candidate",
        metrics: [
          { label: "Active pipeline", value: "28" },
          { label: "Urgent interviews", value: "6" },
          { label: "Avg AI match", value: "91%" },
          { label: "Offer velocity", value: "+18%" },
        ],
        columns: [
          { key: "Applied", label: "Applied", hint: "New inbound interest" },
          { key: "Screening", label: "Screening", hint: "Initial qualification" },
          { key: "Interview", label: "Interview", hint: "Multi-step sessions" },
          { key: "Offer", label: "Offer", hint: "Negotiation ready" },
          { key: "Hired", label: "Hired", hint: "Closed successfully" },
        ],
        emptyStateTitle: "No candidates match this view",
        emptyStateBody: "Try broadening the filter or clearing the search to surface more profiles.",
        emptyStateAction: "Reset filters",
        badgeLabels: {
          urgent: "Urgent",
          medium: "Medium",
          watch: "Watch",
        },
      }
    : {
        title: "Pipeline de recrutement",
        subtitle: "Un centre de commande premium pour les opportunités à fort signal.",
        insight: "Recommandation IA",
        insightText: "Priorisez Maya Chen et Noah Bennett pour la revue exécutive de cette semaine afin de préserver l’élan.",
        searchPlaceholder: "Rechercher un candidat",
        allJobs: "Tous les postes",
        allRecruiters: "Tous les recruteurs",
        sortLabel: "Trier par",
        addCandidate: "Ajouter un candidat",
        metrics: [
          { label: "Pipeline active", value: "28" },
          { label: "Entretiens urgents", value: "6" },
          { label: "Match IA moyen", value: "91%" },
          { label: "Vitesse d’offre", value: "+18%" },
        ],
        columns: [
          { key: "Applied", label: "Candidatures", hint: "Nouveaux intérêts" },
          { key: "Screening", label: "Évaluation", hint: "Qualification initiale" },
          { key: "Interview", label: "Entretien", hint: "Étapes multiples" },
          { key: "Offer", label: "Offre", hint: "Prêt à négocier" },
          { key: "Hired", label: "Recruté", hint: "Fermé avec succès" },
        ],
        emptyStateTitle: "Aucun candidat ne correspond à cette vue",
        emptyStateBody: "Essayez d’élargir les filtres ou de supprimer la recherche pour faire apparaître plus de profils.",
        emptyStateAction: "Effacer les filtres",
        badgeLabels: {
          urgent: "Urgent",
          medium: "Moyen",
          watch: "Surveillance",
        },
      };

  const jobs = useMemo(() => Array.from(new Set(candidateSeed.map((candidate) => candidate.role))), []);
  const recruiters = useMemo(() => Array.from(new Set(candidateSeed.map((candidate) => candidate.recruiter))), []);

  const filteredCandidates = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const next = candidateSeed.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(normalizedSearch) ||
        candidate.role.toLowerCase().includes(normalizedSearch) ||
        candidate.location.toLowerCase().includes(normalizedSearch);

      const matchesJob = jobFilter === "all" || candidate.role === jobFilter;
      const matchesRecruiter = recruiterFilter === "all" || candidate.recruiter === recruiterFilter;

      return matchesSearch && matchesJob && matchesRecruiter;
    });

    return next.sort((left, right) => {
      if (sortBy === "match") {
        return right.match - left.match;
      }

      if (sortBy === "activity") {
        return left.activity.localeCompare(right.activity);
      }

      const priorityWeight = { Urgent: 3, Medium: 2, Watch: 1 };
      return (priorityWeight[right.priority] || 0) - (priorityWeight[left.priority] || 0);
    });
  }, [jobFilter, recruiterFilter, search, sortBy]);

  const groupedCandidates = statuses.reduce<Record<CandidateStatus, Candidate[]>>((acc, status) => {
    acc[status] = filteredCandidates.filter((candidate) => candidate.status === status);
    return acc;
  }, {
    Applied: [],
    Screening: [],
    Interview: [],
    Offer: [],
    Hired: [],
  });

  return (
    <div className="pipeline-shell">
      <div className="pipeline-banner">
        <div>
          <p className="eyebrow">{copy.insight}</p>
          <h2>{copy.title}</h2>
          <p className="pipeline-banner__text">{copy.subtitle}</p>
        </div>
        <div className="pipeline-banner__pill">
          <span className="demo-pill">{language === "en" ? "Demo data" : "Données de démo"}</span>
          <Icon name="spark" size={16} />
          <span>{copy.insightText}</span>
        </div>
      </div>

      <section className="pipeline-metrics">
        {copy.metrics.map((metric) => (
          <div key={metric.label} className="pipeline-metric-card">
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </section>

      <section className="pipeline-toolbar">
        <label className="pipeline-toolbar__field">
          <span>{language === "en" ? "Search" : "Recherche"}</span>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={copy.searchPlaceholder}
          />
        </label>

        <label className="pipeline-toolbar__field">
          <span>{language === "en" ? "Job" : "Poste"}</span>
          <select value={jobFilter} onChange={(event) => setJobFilter(event.target.value)}>
            <option value="all">{copy.allJobs}</option>
            {jobs.map((job) => (
              <option key={job} value={job}>
                {job}
              </option>
            ))}
          </select>
        </label>

        <label className="pipeline-toolbar__field">
          <span>{language === "en" ? "Recruiter" : "Recruteur"}</span>
          <select value={recruiterFilter} onChange={(event) => setRecruiterFilter(event.target.value)}>
            <option value="all">{copy.allRecruiters}</option>
            {recruiters.map((recruiter) => (
              <option key={recruiter} value={recruiter}>
                {recruiter}
              </option>
            ))}
          </select>
        </label>

        <label className="pipeline-toolbar__field">
          <span>{copy.sortLabel}</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value as "match" | "priority" | "activity") }>
            <option value="priority">{language === "en" ? "Priority" : "Priorité"}</option>
            <option value="match">{language === "en" ? "AI match" : "Matching IA"}</option>
            <option value="activity">{language === "en" ? "Last activity" : "Dernière activité"}</option>
          </select>
        </label>

        <button type="button" className="btn btn--primary" disabled>
          {copy.addCandidate}
        </button>
      </section>

      {filteredCandidates.length === 0 ? (
        <section className="pipeline-empty-state">
          <div className="pipeline-empty-state__icon">
            <Icon name="spark" size={20} />
          </div>
          <h3>{copy.emptyStateTitle}</h3>
          <p>{copy.emptyStateBody}</p>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => {
              setSearch("");
              setJobFilter("all");
              setRecruiterFilter("all");
            }}
          >
            {copy.emptyStateAction}
          </button>
        </section>
      ) : (
        <section className="pipeline-board">
          {copy.columns.map((column) => {
            const items = groupedCandidates[column.key as CandidateStatus] || [];

            return (
              <div key={column.key} className="pipeline-column">
                <div className="pipeline-column__header">
                  <div>
                    <h3>{column.label}</h3>
                    <p>{column.hint}</p>
                  </div>
                  <span>{items.length}</span>
                </div>

                <div className="pipeline-column__body">
                  {items.length === 0 ? (
                    <div className="pipeline-column__empty">
                      <p>{language === "en" ? "No candidates yet" : "Aucun candidat pour l’instant"}</p>
                    </div>
                  ) : (
                    items.map((candidate) => {
                      const badgeTone = candidate.priority === "Urgent" ? "danger" : candidate.priority === "Medium" ? "warning" : "neutral";
                      const priorityLabel = copy.badgeLabels[candidate.priority.toLowerCase() as "urgent" | "medium" | "watch"];

                      return (
                        <Link
                          key={candidate.id}
                          href={candidate.name === "Maya Chen" ? "/candidate-profile" : "#"}
                          className={`pipeline-card ${candidate.urgent ? "is-urgent" : ""}`}
                          aria-label={`${candidate.name} ${language === "en" ? "candidate card" : "carte de candidat"}`}
                        >
                          <div className="pipeline-card__top">
                            <div className="pipeline-card__identity">
                              <div className="pipeline-card__avatar">{candidate.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
                              <div>
                                <h4>{candidate.name}</h4>
                                <p>{candidate.role}</p>
                              </div>
                            </div>
                            <Badge label={`${candidate.match}%`} tone="primary" />
                          </div>

                          <div className="pipeline-card__meta">
                            <span>{candidate.location}</span>
                            <Badge label={candidate.status} tone="neutral" />
                          </div>

                          <div className="pipeline-card__footer">
                            <div>
                              <p>{language === "en" ? "Recruiter" : "Recruteur"}</p>
                              <strong>{candidate.recruiter}</strong>
                            </div>
                            <div>
                              <p>{language === "en" ? "Last activity" : "Dernière activité"}</p>
                              <strong>{candidate.activity}</strong>
                            </div>
                          </div>

                          <div className="pipeline-card__priority">
                            <span className={`pipeline-card__dot pipeline-card__dot--${candidate.priority.toLowerCase()}`} />
                            <span>{priorityLabel}</span>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
