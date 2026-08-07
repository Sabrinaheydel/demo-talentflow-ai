import Link from "next/link";
import { canonicalCandidates } from "../../lib/demoData";

type RecentCandidatesTableProps = {
  language: "en" | "fr";
};

const recentCandidates = [
  {
    candidateId: "maya-chen",
    stage: "Interview",
    stageFr: "Entretien",
    status: "strong" as const,
  },
  {
    candidateId: "lucas-martin",
    stage: "Technical interview",
    stageFr: "Entretien technique",
    status: "review" as const,
  },
  {
    candidateId: "emma-laurent",
    stage: "Hiring manager interview",
    stageFr: "Entretien avec le manager",
    status: "watch" as const,
  },
];

export function RecentCandidatesTable({ language }: RecentCandidatesTableProps) {
  return (
    <div className="table-shell">
      <table>
        <thead>
          <tr>
            <th>{language === "en" ? "Candidate" : "Candidat"}</th>
            <th>{language === "en" ? "Status" : "Statut"}</th>
            <th>{language === "en" ? "AI score" : "Score IA"}</th>
            <th>{language === "en" ? "Probability" : "Probabilité"}</th>
            <th>{language === "en" ? "Recruiter" : "Recruteur"}</th>
            <th>{language === "en" ? "Activity" : "Activité"}</th>
          </tr>
        </thead>
        <tbody>
          {recentCandidates.map((candidate) => {
            const canonical = canonicalCandidates.find((item) => item.id === candidate.candidateId);
            if (!canonical) return null;

            return (
              <tr key={canonical.id}>
                <td>
                  <Link href={canonical.id === "maya-chen" ? "/candidate-profile" : "#"} className="candidate-cell candidate-link">
                    <div className="avatar">{canonical.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
                    <div>
                      <p>{canonical.name}</p>
                      <span>{canonical.role}</span>
                    </div>
                  </Link>
                </td>
                <td>
                  <span className={`status-pill status-pill--${candidate.status}`}>
                    {language === "en" ? candidate.stage : candidate.stageFr}
                  </span>
                </td>
                <td>{canonical.match}/100</td>
                <td>{`${canonical.probability}%`}</td>
                <td>{canonical.recruiters.join(" + ")}</td>
                <td>{canonical.interviewDate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
