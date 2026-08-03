import Link from "next/link";

type RecentCandidatesTableProps = {
  language: "en" | "fr";
};

const candidates = [
  {
    name: "Maya Chen",
    role: "Senior Product Designer",
    initials: "MC",
    stage: "Interview",
    stageFr: "Entretien",
    aiScore: "96",
    probability: "91%",
    recruiter: "Nadia",
    activity: "2h ago",
    status: "strong" as const,
  },
  {
    name: "Luca Martin",
    role: "Frontend Engineer",
    initials: "LM",
    stage: "Offer pending",
    stageFr: "Offre en attente",
    aiScore: "94",
    probability: "88%",
    recruiter: "Owen",
    activity: "4h ago",
    status: "review" as const,
  },
  {
    name: "Amina Diallo",
    role: "Revenue Operations Lead",
    initials: "AD",
    stage: "Screening",
    stageFr: "Pré-sélection",
    aiScore: "92",
    probability: "84%",
    recruiter: "Sara",
    activity: "Today",
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
          {candidates.map((candidate) => (
            <tr key={candidate.name}>
              <td>
                <Link href={candidate.name === "Maya Chen" ? "/candidate-profile" : "#"} className="candidate-cell candidate-link">
                  <div className="avatar">{candidate.initials}</div>
                  <div>
                    <p>{candidate.name}</p>
                    <span>{candidate.role}</span>
                  </div>
                </Link>
              </td>
              <td>
                <span className={`status-pill status-pill--${candidate.status}`}>
                  {language === "en" ? candidate.stage : candidate.stageFr}
                </span>
              </td>
              <td>{candidate.aiScore}/100</td>
              <td>{candidate.probability}</td>
              <td>{candidate.recruiter}</td>
              <td>{candidate.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
