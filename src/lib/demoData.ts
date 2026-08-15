export type InterviewStatus = "Ready" | "Preparation needed" | "Feedback pending" | "Complete";
export type InterviewPriority = "High" | "Medium";

export type InterviewCandidate = {
  id: string;
  name: string;
  role: string;
  date: string;
  time: string;
  stage: string;
  interviewers: string[];
  status: InterviewStatus;
  priority: InterviewPriority;
  match: number;
  probability: number;
  focusAreas: string[];
  risks: string[];
  questions: string[];
  feedback: {
    interviewer: string;
    received: number;
    expected: number;
    status: "complete" | "pending" | "missing";
  }[];
  scorecard: {
    communication: number;
    roleExpertise: number;
    problemSolving: number;
    collaboration: number;
    cultureFit: number;
  };
  recommendation: {
    en: string;
    fr: string;
  };
  notes: {
    en: string;
    fr: string;
  };
};

export type CanonicalCandidateProfile = {
  id: string;
  name: string;
  role: string;
  match: number;
  probability: number;
  priority: InterviewPriority;
  stage: string;
  interviewStatus: InterviewStatus;
  interviewDate: string;
  interviewTime: string;
  recruiters: string[];
  focusAreas: string[];
  risks: string[];
  questions: string[];
  feedback: InterviewCandidate["feedback"];
  scorecard: InterviewCandidate["scorecard"];
  recommendation: InterviewCandidate["recommendation"];
  notes: InterviewCandidate["notes"];
};

export const canonicalCandidates: CanonicalCandidateProfile[] = [
  {
    id: "maya-chen",
    name: "Maya Chen",
    role: "Senior Product Designer",
    match: 96,
    probability: 82,
    priority: "High",
    stage: "Final Interview",
    interviewStatus: "Ready",
    interviewDate: "Today",
    interviewTime: "10:30",
    recruiters: ["Sarah Martin", "Thomas Lee"],
    focusAreas: [
      "Leadership in cross-functional teams",
      "Product strategy",
      "Design systems",
      "Handling ambiguous requirements",
    ],
    risks: [
      "Limited enterprise experience",
      "Salary expectations above target range",
    ],
    questions: [
      "Tell us about a time you aligned several teams around a product decision.",
      "How do you prioritise when user needs and business constraints conflict?",
      "Describe a design-system decision you would challenge and why.",
      "How do you work with incomplete or ambiguous requirements?",
    ],
    feedback: [
      { interviewer: "Sarah Martin", received: 1, expected: 2, status: "complete" },
      { interviewer: "Thomas Lee", received: 1, expected: 2, status: "complete" },
    ],
    scorecard: {
      communication: 5,
      roleExpertise: 5,
      problemSolving: 4,
      collaboration: 5,
      cultureFit: 4,
    },
    recommendation: {
      en: "Strong hire",
      fr: "Recrutement fortement recommandé",
    },
    notes: {
      en: "Excellent strategic thinking and strong communication. Validate enterprise experience and compensation expectations.",
      fr: "Très bonne vision stratégique et excellente communication. À valider : expérience en environnement entreprise et attentes salariales.",
    },
  },
  {
    id: "lucas-martin",
    name: "Lucas Martin",
    role: "Frontend Engineer",
    match: 91,
    probability: 76,
    priority: "Medium",
    stage: "Technical Interview",
    interviewStatus: "Preparation needed",
    interviewDate: "Today",
    interviewTime: "14:00",
    recruiters: ["Sarah Martin"],
    focusAreas: ["System design", "Frontend architecture", "Performance"],
    risks: ["Potential role mismatch", "Limited product context"],
    questions: [
      "How do you keep a UI system maintainable at scale?",
      "Tell us about a trade-off you made between speed and quality.",
    ],
    feedback: [
      { interviewer: "Sarah Martin", received: 1, expected: 2, status: "pending" },
    ],
    scorecard: {
      communication: 4,
      roleExpertise: 4,
      problemSolving: 4,
      collaboration: 4,
      cultureFit: 3,
    },
    recommendation: {
      en: "Continue with technical validation",
      fr: "Poursuivre la validation technique",
    },
    notes: {
      en: "Solid technical depth, but tighten the product narrative before final review.",
      fr: "Bonne profondeur technique, mais renforcer le récit produit avant la revue finale.",
    },
  },
  {
    id: "emma-laurent",
    name: "Emma Laurent",
    role: "Customer Success Manager",
    match: 94,
    probability: 79,
    priority: "High",
    stage: "Hiring Manager Interview",
    interviewStatus: "Feedback pending",
    interviewDate: "Tomorrow",
    interviewTime: "09:30",
    recruiters: ["Sarah Martin"],
    focusAreas: ["Customer empathy", "Cross-functional leadership", "Escalation handling"],
    risks: ["Transitioning from SMB to enterprise", "Compensation expectations"],
    questions: [
      "How do you manage tough stakeholder conversations?",
      "Describe a time you drove adoption in a complex implementation.",
    ],
    feedback: [
      { interviewer: "David Klein", received: 0, expected: 2, status: "missing" },
    ],
    scorecard: {
      communication: 5,
      roleExpertise: 4,
      problemSolving: 4,
      collaboration: 5,
      cultureFit: 4,
    },
    recommendation: {
      en: "Promising profile with one more validation loop",
      fr: "Profil prometteur avec une boucle de validation supplémentaire",
    },
    notes: {
      en: "Excellent stakeholder instinct; confirm the enterprise readiness story before close.",
      fr: "Excellent instinct stakeholder ; confirmer la narration de préparation entreprise avant clôture.",
    },
  },
  {
    id: "noah-williams",
    name: "Noah Williams",
    role: "Product Manager",
    match: 88,
    probability: 74,
    priority: "Medium",
    stage: "Culture Interview",
    interviewStatus: "Ready",
    interviewDate: "Tomorrow",
    interviewTime: "16:00",
    recruiters: ["Sarah Martin", "David Klein"],
    focusAreas: ["Product thinking", "Cross-functional alignment", "Leadership"],
    risks: ["Potentially over-indexing on strategy", "Start-date flexibility"],
    questions: [
      "How do you balance user needs with commercial constraints?",
      "Describe a cross-functional conflict you resolved effectively.",
    ],
    feedback: [
      { interviewer: "Sarah Martin", received: 2, expected: 2, status: "complete" },
      { interviewer: "David Klein", received: 1, expected: 2, status: "pending" },
    ],
    scorecard: {
      communication: 4,
      roleExpertise: 4,
      problemSolving: 4,
      collaboration: 5,
      cultureFit: 4,
    },
    recommendation: {
      en: "Keep in review for the next decision loop",
      fr: "Conserver en revue pour la boucle de décision suivante",
    },
    notes: {
      en: "Strong leadership narrative, but confirm the role fit around product execution depth.",
      fr: "Narratif de leadership solide, mais confirmer l’adéquation au poste autour de la profondeur d’exécution produit.",
    },
  },
];

export const interviewCandidates: InterviewCandidate[] = canonicalCandidates.map((candidate) => ({
  id: candidate.id,
  name: candidate.name,
  role: candidate.role,
  date: candidate.interviewDate,
  time: candidate.interviewTime,
  stage: candidate.stage,
  interviewers: candidate.recruiters,
  status: candidate.interviewStatus,
  priority: candidate.priority,
  match: candidate.match,
  probability: candidate.probability,
  focusAreas: candidate.focusAreas,
  risks: candidate.risks,
  questions: candidate.questions,
  feedback: candidate.feedback,
  scorecard: candidate.scorecard,
  recommendation: candidate.recommendation,
  notes: candidate.notes,
}));

export function getCanonicalCandidateById(id: string) {
  return canonicalCandidates.find((candidate) => candidate.id === id) ?? canonicalCandidates[0];
}

export function getInterviewCandidateById(id: string) {
  return interviewCandidates.find((candidate) => candidate.id === id) ?? interviewCandidates[0];
}