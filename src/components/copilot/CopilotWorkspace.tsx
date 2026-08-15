"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "../ui/Badge";
import { Icon } from "../ui/Icon";
import { canonicalCandidates, getCanonicalCandidateById } from "../../lib/demoData";
import { useDemoExperience } from "../../lib/demoExperience";

type Language = "en" | "fr";

type Message = {
  id: number;
  author: "user" | "ai";
  text: string;
};

type Severity = "high" | "medium" | "low";

type CopilotResponse = {
  intent: IntentKey;
  title: string;
  brief: string;
  confidenceScore: number;
  reviewNote: string;
  executiveSummary?: {
    decision: string;
    strengths: string[];
    watchouts: string[];
    recommendation: string;
  };
  candidateComparison?: {
    benchmarkRole: string;
    rows: {
      candidate: string;
      stage: string;
      match: string;
      probability: string;
      differentiator: string;
      riskLevel: Severity;
    }[];
    recommendation: string;
  };
  interviewGuide?: {
    objective: string;
    opener: string;
    sections: {
      theme: string;
      question: string;
      listenFor: string;
      redFlag: string;
    }[];
    close: string;
  };
  suggestedEmail?: {
    to: string;
    subject: string;
    body: string[];
    tone: string;
  };
  hiringRiskAssessment?: {
    overallRisk: Severity;
    summary: string;
    items: {
      title: string;
      severity: Severity;
      impact: string;
      mitigation: string;
      owner: string;
    }[];
  };
  nextBestAction?: {
    decision: string;
    timeline: {
      owner: string;
      deadline: string;
      action: string;
      expectedOutcome: string;
    }[];
  };
};

function getInitialMessages(language: Language): Message[] {
  return [
    {
      id: 1,
      author: "ai",
      text: language === "en"
        ? "I’ve reviewed Maya Chen’s profile and can help you prepare a decision-ready follow-up."
        : "J’ai examiné le profil de Maya Chen et je peux vous aider à préparer un suivi prêt pour la décision.",
    },
    {
      id: 2,
      author: "user",
      text: language === "en"
        ? "Summarize the strongest evidence for moving her forward."
        : "Résumez les meilleurs éléments pour la faire avancer.",
    },
  ];
}

const promptPresets = [
  { key: "summarize", en: "Executive Summary", fr: "Synthèse exécutive" },
  { key: "compare", en: "Compare Candidates", fr: "Comparer les candidats" },
  { key: "questions", en: "Interview Guide", fr: "Guide d’entretien" },
  { key: "email", en: "Suggested Email", fr: "Email suggéré" },
  { key: "risks", en: "Hiring Risk Assessment", fr: "Évaluation des risques d’embauche" },
  { key: "action", en: "Next Best Action", fr: "Prochaine meilleure action" },
] as const;

const candidateContext = {
  ...getCanonicalCandidateById("maya-chen"),
  role: getCanonicalCandidateById("maya-chen").role,
  match: `${getCanonicalCandidateById("maya-chen").match}%`,
  probability: `${getCanonicalCandidateById("maya-chen").probability}%`,
  stage: getCanonicalCandidateById("maya-chen").stage,
  skills: ["Product strategy", "Design systems", "Leadership", "Cross-functional alignment"],
  risks: ["Limited enterprise experience", "Compensation expectations", "Start timing"],
};

type IntentKey = (typeof promptPresets)[number]["key"];

function detectIntent(message: string, fallback: string): IntentKey {
  const normalized = `${message} ${fallback}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (/(summarize|summary|overview|profile|resume|resumer|synthese|brief|profil)/.test(normalized)) return "summarize";
  if (/(compare|versus|vs|difference|differ|comparer|comparaison)/.test(normalized)) return "compare";
  if (/(question|questions|interview|entretien|guide)/.test(normalized)) return "questions";
  if (/(email|message|contact|write|ecrire|rediger|mail)/.test(normalized)) return "email";
  if (/(risk|risks|concern|warning|problem|risque|risques|alerte|probleme)/.test(normalized)) return "risks";
  if (/(next|recommend|action|plan|schedule|prochaine|recommand|planning|planifier)/.test(normalized)) return "action";
  return "action";
}

function buildSimulatedResponse(intent: IntentKey, language: Language) {
  const comparisonRows = canonicalCandidates
    .slice()
    .sort((a, b) => b.match - a.match)
    .slice(0, 4)
    .map((candidate) => ({
      candidate: candidate.name,
      stage: candidate.stage,
      match: `${candidate.match}%`,
      probability: `${candidate.probability}%`,
      differentiator: candidate.focusAreas[0] ?? (language === "en" ? "Role fit" : "Adéquation au poste"),
      riskLevel: (candidate.priority === "High" ? "medium" : "low") as Severity,
    }));

  const reviewNote = language === "en"
    ? "Demo mode — AI responses are simulated. Review this output with a recruiter before acting."
    : "Mode démo — les réponses IA sont simulées. Vérifiez cette sortie avec un recruteur avant toute action.";

  if (intent === "summarize") {
    return language === "en"
      ? {
          intent,
          title: "Executive briefing",
          brief: "Maya Chen remains a high-conviction finalist with clear readiness for executive calibration.",
          confidenceScore: 93,
          reviewNote,
          executiveSummary: {
            decision: "Proceed to final executive review this week.",
            strengths: [
              "Top signal quality across leadership, collaboration and design systems.",
              "96% role match with consistent panel feedback quality.",
              "Clear product strategy ownership in ambiguous environments.",
            ],
            watchouts: [
              "Compensation expectations are above current midpoint.",
              "Enterprise exposure should be validated in final round.",
            ],
            recommendation: "Move forward now and anchor final discussion on enterprise readiness and package flexibility.",
          },
        }
      : {
          intent,
          title: "Briefing exécutif",
          brief: "Maya Chen reste une finaliste à forte conviction avec une préparation crédible pour la revue exécutive.",
          confidenceScore: 93,
          reviewNote,
          executiveSummary: {
            decision: "Passer en revue exécutive finale cette semaine.",
            strengths: [
              "Signaux élevés sur leadership, collaboration et design systems.",
              "96% de match rôle avec des retours panel cohérents.",
              "Capacité démontrée à piloter la stratégie produit dans l’ambiguïté.",
            ],
            watchouts: [
              "Attentes de rémunération au-dessus du milieu de fourchette.",
              "Exposition entreprise à confirmer en dernier tour.",
            ],
            recommendation: "Avancer maintenant et cadrer l’entretien final sur la préparation enterprise et la flexibilité package.",
          },
        };
  }

  if (intent === "compare") {
    return language === "en"
      ? {
          intent,
          title: "Candidate comparison matrix",
          brief: "Maya Chen leads the shortlist on fit and decision readiness.",
          confidenceScore: 91,
          reviewNote,
          candidateComparison: {
            benchmarkRole: candidateContext.role,
            rows: comparisonRows,
            recommendation: "Prioritize Maya Chen as primary offer path and keep Emma Laurent as contingency finalist.",
          },
        }
      : {
          intent,
          title: "Matrice de comparaison candidats",
          brief: "Maya Chen reste en tête de shortlist sur l’adéquation et la maturité de décision.",
          confidenceScore: 91,
          reviewNote,
          candidateComparison: {
            benchmarkRole: candidateContext.role,
            rows: comparisonRows,
            recommendation: "Prioriser Maya Chen comme trajectoire d’offre principale et garder Emma Laurent en finaliste de secours.",
          },
        };
  }

  if (intent === "questions") {
    return language === "en"
      ? {
          intent,
          title: "Structured interview guide",
          brief: "Use this guide to validate enterprise scale readiness in one focused conversation.",
          confidenceScore: 89,
          reviewNote,
          interviewGuide: {
            objective: "Confirm executive-level influence and risk handling before final decision.",
            opener: "Thanks Maya, we will focus on role impact, enterprise context and decision fit.",
            sections: [
              {
                theme: "Leadership signal",
                question: "Describe a moment where you aligned product, engineering and leadership around a difficult trade-off.",
                listenFor: "Decision framing, stakeholder calibration and measurable outcome.",
                redFlag: "Narrative focuses on process only, without ownership or result.",
              },
              {
                theme: "Enterprise readiness",
                question: "What changed in your design approach when complexity moved from team level to organizational scale?",
                listenFor: "System thinking, governance judgment and change management.",
                redFlag: "Examples remain tactical and do not show enterprise constraints.",
              },
              {
                theme: "Execution under ambiguity",
                question: "How do you make progress when business requirements are incomplete and timing is fixed?",
                listenFor: "Prioritization logic, communication cadence and risk management.",
                redFlag: "Relies on external direction with limited independent prioritization.",
              },
            ],
            close: "End by aligning on first-90-day priorities and readiness to start timeline discussion.",
          },
        }
      : {
          intent,
          title: "Guide d’entretien structuré",
          brief: "Utilisez ce guide pour valider la préparation enterprise dans un échange ciblé.",
          confidenceScore: 89,
          reviewNote,
          interviewGuide: {
            objective: "Confirmer l’influence au niveau exécutif et la gestion des risques avant décision finale.",
            opener: "Merci Maya, nous allons cibler l’impact du rôle, le contexte enterprise et l’alignement de décision.",
            sections: [
              {
                theme: "Signal leadership",
                question: "Décrivez un moment où vous avez aligné produit, engineering et direction sur un arbitrage difficile.",
                listenFor: "Cadrage de décision, alignement des parties prenantes et résultat mesurable.",
                redFlag: "Récit centré sur le process sans ownership ni impact.",
              },
              {
                theme: "Préparation enterprise",
                question: "Qu’est-ce qui a changé dans votre approche design quand la complexité est passée de l’équipe à l’organisation?",
                listenFor: "Vision systémique, jugement de gouvernance et conduite du changement.",
                redFlag: "Exemples trop tactiques sans contraintes enterprise.",
              },
              {
                theme: "Exécution dans l’ambiguïté",
                question: "Comment avancez-vous lorsque les exigences business sont incomplètes et le délai fixe?",
                listenFor: "Logique de priorisation, cadence de communication et gestion des risques.",
                redFlag: "Dépendance forte à la direction externe et priorisation limitée.",
              },
            ],
            close: "Clore en alignant les priorités des 90 premiers jours et la discussion sur la disponibilité.",
          },
        };
  }

  if (intent === "email") {
    return language === "en"
      ? {
          intent,
          title: "Suggested recruiter email",
          brief: "Ready-to-send follow-up aligned with current stage and urgency.",
          confidenceScore: 88,
          reviewNote,
          suggestedEmail: {
            to: "maya.chen@example.com",
            subject: "Next step for the Senior Product Designer process",
            body: [
              "Hi Maya,",
              "Thank you again for the quality of your conversations with the team. Your product leadership and collaboration approach stood out clearly.",
              "We would like to invite you to a final executive discussion focused on enterprise design context and first-quarter priorities.",
              "Could you share your availability for a 45-minute session in the next two business days?",
              "Best regards,",
              "Sarah Martin\nTalent Acquisition",
            ],
            tone: "Warm, direct, decision-oriented",
          },
        }
      : {
          intent,
          title: "Email recruteur suggéré",
          brief: "Message prêt à envoyer, aligné sur l’étape actuelle et le niveau d’urgence.",
          confidenceScore: 88,
          reviewNote,
          suggestedEmail: {
            to: "maya.chen@example.com",
            subject: "Prochaine étape du process Senior Product Designer",
            body: [
              "Bonjour Maya,",
              "Merci encore pour la qualité de vos échanges avec l’équipe. Votre leadership produit et votre approche collaborative se sont clairement démarqués.",
              "Nous souhaitons vous proposer un échange exécutif final, centré sur le contexte enterprise design et les priorités du premier trimestre.",
              "Pouvez-vous partager vos disponibilités pour une session de 45 minutes dans les deux prochains jours ouvrés?",
              "Bien à vous,",
              "Sarah Martin\nTalent Acquisition",
            ],
            tone: "Chaleureux, direct, orienté décision",
          },
        };
  }

  if (intent === "risks") {
    return language === "en"
      ? {
          intent,
          title: "Hiring risk assessment",
          brief: "Overall risk remains manageable if compensation and timeline are handled in parallel.",
          confidenceScore: 90,
          reviewNote,
          hiringRiskAssessment: {
            overallRisk: "medium" as Severity,
            summary: "No blocker identified. Main risk cluster is commercial alignment rather than role capability.",
            items: [
              {
                title: "Compensation alignment",
                severity: "high" as Severity,
                impact: "Could delay acceptance if package framing is introduced too late.",
                mitigation: "Share range boundaries in the next touchpoint and prepare non-cash flexibility options.",
                owner: "TA Lead",
              },
              {
                title: "Notice period timing",
                severity: "medium" as Severity,
                impact: "May push target start date beyond project onboarding window.",
                mitigation: "Validate realistic start date now and sequence onboarding dependencies.",
                owner: "Recruiter",
              },
              {
                title: "Competing process risk",
                severity: "medium" as Severity,
                impact: "Decision latency increases risk of losing momentum.",
                mitigation: "Lock executive panel slot and commit decision turnaround within 48h.",
                owner: "Hiring Manager",
              },
            ],
          },
        }
      : {
          intent,
          title: "Évaluation des risques d’embauche",
          brief: "Le risque global reste maîtrisable si la rémunération et le calendrier sont traités en parallèle.",
          confidenceScore: 90,
          reviewNote,
          hiringRiskAssessment: {
            overallRisk: "medium" as Severity,
            summary: "Aucun blocage majeur identifié. Le risque principal concerne l’alignement commercial plutôt que la capacité de rôle.",
            items: [
              {
                title: "Alignement rémunération",
                severity: "high" as Severity,
                impact: "Peut retarder l’acceptation si le cadrage package arrive trop tard.",
                mitigation: "Partager les bornes de fourchette au prochain échange et préparer des options de flexibilité non cash.",
                owner: "TA Lead",
              },
              {
                title: "Calendrier de préavis",
                severity: "medium" as Severity,
                impact: "Peut décaler la date de démarrage cible au-delà de la fenêtre onboarding.",
                mitigation: "Valider la date réaliste maintenant et séquencer les dépendances d’intégration.",
                owner: "Recruiter",
              },
              {
                title: "Risque de process concurrent",
                severity: "medium" as Severity,
                impact: "Une décision tardive augmente le risque de perte de momentum.",
                mitigation: "Bloquer le créneau panel exécutif et confirmer un retour de décision en 48h.",
                owner: "Hiring Manager",
              },
            ],
          },
        };
  }

  return language === "en"
    ? {
        intent,
        title: "Next best action plan",
        brief: "Decision velocity is now the priority. Move from evaluation to commitment steps.",
        confidenceScore: 87,
        reviewNote,
        nextBestAction: {
          decision: "Advance with a controlled 72-hour decision plan.",
          timeline: [
            {
              owner: "Recruiter",
              deadline: "Today, 17:00",
              action: "Confirm Maya’s availability and compensation expectations.",
              expectedOutcome: "Remove timeline ambiguity before executive call.",
            },
            {
              owner: "Hiring Manager",
              deadline: "Tomorrow, 12:00",
              action: "Run final executive interview with enterprise-readiness lens.",
              expectedOutcome: "Close remaining signal gap on organizational scope.",
            },
            {
              owner: "TA Lead",
              deadline: "Within 48h after final interview",
              action: "Issue decision brief and offer recommendation.",
              expectedOutcome: "Maintain candidate momentum and reduce loss risk.",
            },
          ],
        },
      }
    : {
        intent,
        title: "Plan de prochaine meilleure action",
        brief: "La vitesse de décision devient prioritaire. Passer de l’évaluation à l’engagement.",
        confidenceScore: 87,
        reviewNote,
        nextBestAction: {
          decision: "Avancer avec un plan de décision contrôlé sur 72 heures.",
          timeline: [
            {
              owner: "Recruiter",
              deadline: "Aujourd’hui, 17:00",
              action: "Confirmer la disponibilité de Maya et ses attentes de rémunération.",
              expectedOutcome: "Lever les ambiguïtés de calendrier avant l’échange exécutif.",
            },
            {
              owner: "Hiring Manager",
              deadline: "Demain, 12:00",
              action: "Mener l’entretien exécutif final avec un angle préparation enterprise.",
              expectedOutcome: "Clore le dernier écart de signal sur le périmètre organisationnel.",
            },
            {
              owner: "TA Lead",
              deadline: "Sous 48h après entretien final",
              action: "Émettre le brief de décision et la recommandation d’offre.",
              expectedOutcome: "Préserver le momentum candidat et réduire le risque de perte.",
            },
          ],
        },
      };
}

function getSeverityLabel(severity: Severity, language: Language) {
  if (language === "en") {
    if (severity === "high") return "High";
    if (severity === "medium") return "Medium";
    return "Low";
  }
  if (severity === "high") return "Élevé";
  if (severity === "medium") return "Moyen";
  return "Faible";
}

function getResponseHint(intent: IntentKey, language: Language) {
  if (language === "en") {
    if (intent === "summarize") return "Executive summary generated in the decision panel.";
    if (intent === "compare") return "Candidate comparison matrix is ready.";
    if (intent === "questions") return "Structured interview guide prepared.";
    if (intent === "email") return "Suggested recruiter email drafted and ready.";
    if (intent === "risks") return "Hiring risk assessment has been produced.";
    return "Next best action plan is now available.";
  }

  if (intent === "summarize") return "Synthèse exécutive générée dans le panneau de décision.";
  if (intent === "compare") return "Matrice de comparaison candidats prête.";
  if (intent === "questions") return "Guide d’entretien structuré préparé.";
  if (intent === "email") return "Email recruteur suggéré rédigé et prêt.";
  if (intent === "risks") return "Évaluation des risques d’embauche produite.";
  return "Plan de prochaine meilleure action disponible.";
}

export function CopilotWorkspace({ language, initialContext }: { language: Language; initialContext?: { candidateId?: string; mode?: string; context?: string } }) {
  const { state } = useDemoExperience();
  const [messages, setMessages] = useState<Message[]>(() => getInitialMessages(language));
  const [draft, setDraft] = useState(() => {
    if (initialContext?.mode === "interview-prep" && initialContext?.candidateId === "maya-chen") {
      return language === "en" ? "Prepare Maya Chen for the final interview." : "Préparer Maya Chen pour l’entretien final.";
    }
    if (initialContext?.mode === "follow-up" && initialContext?.candidateId === "maya-chen") {
      return language === "en" ? "Ask a follow-up question about Maya Chen." : "Poser une question de suivi sur Maya Chen.";
    }
    return "";
  });
  const [activeAction, setActiveAction] = useState(language === "en" ? "Executive Summary" : "Synthèse exécutive");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [modal, setModal] = useState<{ title: string; description: string; confirmLabel: string; message: string } | null>(null);
  const [latestResponse, setLatestResponse] = useState<CopilotResponse | null>(null);

  useEffect(() => {
    if (initialContext?.context === "team") {
      const notice = language === "en"
        ? "Team context loaded for recruiter coordination."
        : "Contexte équipe chargé pour la coordination recruteur.";
      setToast(notice);
      return;
    }

    if (initialContext?.mode === "interview-prep" && initialContext?.candidateId === "maya-chen") {
      const notice = language === "en"
        ? "Interview-preparation context loaded for Maya Chen."
        : "Contexte de préparation d’entretien chargé pour Maya Chen.";
      setToast(notice);
    }
  }, [initialContext?.candidateId, initialContext?.context, initialContext?.mode, language]);

  useEffect(() => {
    setMessages(getInitialMessages(language));
    setDraft("");
    setActiveAction(language === "en" ? "Executive Summary" : "Synthèse exécutive");
    setLatestResponse(null);
    setError(null);
  }, [language]);

  const copy = language === "en"
    ? {
        title: "AI recruitment copilot",
        subtitle: "Turn candidate signals into recruiter-ready next steps.",
        history: "Conversation history",
        composer: "Message TalentFlow AI",
        attach: "Attach CV",
        send: "Send",
        prompts: "Suggested prompts",
        actions: "AI actions",
        context: "Candidate context",
        responseTitle: "Decision support output",
        reset: "Reset conversation",
        demoNotice: "Demo mode — AI responses are simulated.",
        loading: "Thinking…",
        errorPrefix: "The copilot could not generate a response.",
        confidence: "Confidence score",
        risk: "Risk",
        benchmarkRole: "Benchmark role",
        recommendation: "Recommendation",
        objective: "Objective",
        interviewQuestion: "Interview question",
        listenFor: "Listen for",
        redFlag: "Red flag",
        owner: "Owner",
        deadline: "Deadline",
        outcome: "Expected outcome",
        overallRisk: "Overall risk",
        tone: "Tone",
        to: "To",
        subject: "Subject",
        executionTitle: "Latest shared execution",
        executionEmpty: "No action executed yet.",
        recentHistory: "Recent history",
      }
    : {
        title: "Copilot IA de recrutement",
        subtitle: "Transformez les signaux candidats en prochaines étapes prêtes pour les recruteurs.",
        history: "Historique de conversation",
        composer: "Écrire à TalentFlow AI",
        attach: "Joindre un CV",
        send: "Envoyer",
        prompts: "Prompts suggérés",
        actions: "Actions IA",
        context: "Contexte candidat",
        responseTitle: "Sortie d’aide à la décision",
        reset: "Réinitialiser la conversation",
        demoNotice: "Mode démo — les réponses IA sont simulées.",
        loading: "Réflexion…",
        errorPrefix: "Le copilot n’a pas pu générer de réponse.",
        confidence: "Score de confiance",
        risk: "Risque",
        benchmarkRole: "Rôle de référence",
        recommendation: "Recommandation",
        objective: "Objectif",
        interviewQuestion: "Question d’entretien",
        listenFor: "À observer",
        redFlag: "Alerte",
        owner: "Responsable",
        deadline: "Échéance",
        outcome: "Résultat attendu",
        overallRisk: "Risque global",
        tone: "Ton",
        to: "À",
        subject: "Objet",
        executionTitle: "Derniere execution partagee",
        executionEmpty: "Aucune action executee pour le moment.",
        recentHistory: "Historique recent",
      };

  const responseIntent = useMemo(() => latestResponse?.intent ?? null, [latestResponse?.intent]);

  const askCopilot = async (message: string, action = activeAction) => {
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setMessages((prev) => [...prev, { id: prev.length + 1, author: "user", text: message.trim() }]);

    await new Promise((resolve) => setTimeout(resolve, 900));

    const selectedIntent = detectIntent(message, action);
    const parsed = buildSimulatedResponse(selectedIntent, language);
    setLatestResponse(parsed);
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        author: "ai",
        text: `${parsed.brief} ${getResponseHint(selectedIntent, language)}`,
      },
    ]);
    setLoading(false);
  };

  const renderDecisionOutput = () => {
    if (!latestResponse) {
      return (
        <div className="copilot-empty-output">
          <strong>{language === "en" ? "No output generated yet" : "Aucune sortie générée"}</strong>
          <p>{language === "en" ? "Choose an AI action to generate a recruiter-ready artifact." : "Choisissez une action IA pour générer un livrable recruteur prêt à l’emploi."}</p>
        </div>
      );
    }

    if (latestResponse.intent === "summarize" && latestResponse.executiveSummary) {
      return (
        <div className="copilot-artifact copilot-artifact--summary">
          <div className="artifact-header">
            <h4>{latestResponse.title}</h4>
            <span className="artifact-confidence">{copy.confidence}: {latestResponse.confidenceScore}%</span>
          </div>
          <p className="artifact-brief">{latestResponse.brief}</p>
          <div className="artifact-callout">{latestResponse.executiveSummary.decision}</div>
          <div className="artifact-columns">
            <div>
              <p className="copilot-context-label">{language === "en" ? "Strengths" : "Forces"}</p>
              <ul className="artifact-list">
                {latestResponse.executiveSummary.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="copilot-context-label">{language === "en" ? "Watchouts" : "Points de vigilance"}</p>
              <ul className="artifact-list artifact-list--watch">
                {latestResponse.executiveSummary.watchouts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="artifact-footer"><strong>{copy.recommendation}:</strong> {latestResponse.executiveSummary.recommendation}</p>
        </div>
      );
    }

    if (latestResponse.intent === "compare" && latestResponse.candidateComparison) {
      return (
        <div className="copilot-artifact copilot-artifact--compare">
          <div className="artifact-header">
            <h4>{latestResponse.title}</h4>
            <span className="artifact-confidence">{copy.benchmarkRole}: {latestResponse.candidateComparison.benchmarkRole}</span>
          </div>
          <p className="artifact-brief">{latestResponse.brief}</p>
          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>{language === "en" ? "Candidate" : "Candidat"}</th>
                  <th>{language === "en" ? "Stage" : "Étape"}</th>
                  <th>{language === "en" ? "Match" : "Match"}</th>
                  <th>{language === "en" ? "Probability" : "Probabilité"}</th>
                  <th>{language === "en" ? "Differentiator" : "Différenciateur"}</th>
                  <th>{copy.risk}</th>
                </tr>
              </thead>
              <tbody>
                {latestResponse.candidateComparison.rows.map((row) => (
                  <tr key={row.candidate}>
                    <td>{row.candidate}</td>
                    <td>{row.stage}</td>
                    <td>{row.match}</td>
                    <td>{row.probability}</td>
                    <td>{row.differentiator}</td>
                    <td>
                      <span className={`severity-pill severity-pill--${row.riskLevel}`}>
                        {getSeverityLabel(row.riskLevel, language)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="artifact-footer"><strong>{copy.recommendation}:</strong> {latestResponse.candidateComparison.recommendation}</p>
        </div>
      );
    }

    if (latestResponse.intent === "questions" && latestResponse.interviewGuide) {
      return (
        <div className="copilot-artifact copilot-artifact--interview">
          <div className="artifact-header">
            <h4>{latestResponse.title}</h4>
            <span className="artifact-confidence">{copy.confidence}: {latestResponse.confidenceScore}%</span>
          </div>
          <p className="artifact-brief">{latestResponse.brief}</p>
          <div className="artifact-block">
            <p className="copilot-context-label">{copy.objective}</p>
            <p>{latestResponse.interviewGuide.objective}</p>
          </div>
          <div className="artifact-block artifact-block--soft">
            <p className="copilot-context-label">{language === "en" ? "Opening script" : "Script d’ouverture"}</p>
            <p>{latestResponse.interviewGuide.opener}</p>
          </div>
          <div className="guide-list">
            {latestResponse.interviewGuide.sections.map((section) => (
              <article key={section.theme} className="guide-card">
                <p className="guide-card__theme">{section.theme}</p>
                <p><strong>{copy.interviewQuestion}:</strong> {section.question}</p>
                <p><strong>{copy.listenFor}:</strong> {section.listenFor}</p>
                <p><strong>{copy.redFlag}:</strong> {section.redFlag}</p>
              </article>
            ))}
          </div>
          <p className="artifact-footer">{latestResponse.interviewGuide.close}</p>
        </div>
      );
    }

    if (latestResponse.intent === "email" && latestResponse.suggestedEmail) {
      return (
        <div className="copilot-artifact copilot-artifact--email">
          <div className="artifact-header">
            <h4>{latestResponse.title}</h4>
            <span className="artifact-confidence">{copy.tone}: {latestResponse.suggestedEmail.tone}</span>
          </div>
          <p className="artifact-brief">{latestResponse.brief}</p>
          <div className="email-meta">
            <p><strong>{copy.to}:</strong> {latestResponse.suggestedEmail.to}</p>
            <p><strong>{copy.subject}:</strong> {latestResponse.suggestedEmail.subject}</p>
          </div>
          <div className="email-body">
            {latestResponse.suggestedEmail.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      );
    }

    if (latestResponse.intent === "risks" && latestResponse.hiringRiskAssessment) {
      return (
        <div className="copilot-artifact copilot-artifact--risk">
          <div className="artifact-header">
            <h4>{latestResponse.title}</h4>
            <span className={`severity-pill severity-pill--${latestResponse.hiringRiskAssessment.overallRisk}`}>
              {copy.overallRisk}: {getSeverityLabel(latestResponse.hiringRiskAssessment.overallRisk, language)}
            </span>
          </div>
          <p className="artifact-brief">{latestResponse.brief}</p>
          <p className="artifact-footer">{latestResponse.hiringRiskAssessment.summary}</p>
          <div className="risk-list">
            {latestResponse.hiringRiskAssessment.items.map((item) => (
              <article key={item.title} className="risk-card">
                <div className="risk-card__top">
                  <strong>{item.title}</strong>
                  <span className={`severity-pill severity-pill--${item.severity}`}>{getSeverityLabel(item.severity, language)}</span>
                </div>
                <p><strong>{language === "en" ? "Impact" : "Impact"}:</strong> {item.impact}</p>
                <p><strong>{language === "en" ? "Mitigation" : "Mitigation"}:</strong> {item.mitigation}</p>
                <p><strong>{copy.owner}:</strong> {item.owner}</p>
              </article>
            ))}
          </div>
        </div>
      );
    }

    if (latestResponse.nextBestAction) {
      return (
        <div className="copilot-artifact copilot-artifact--plan">
          <div className="artifact-header">
            <h4>{latestResponse.title}</h4>
            <span className="artifact-confidence">{copy.confidence}: {latestResponse.confidenceScore}%</span>
          </div>
          <p className="artifact-brief">{latestResponse.brief}</p>
          <div className="artifact-callout">{latestResponse.nextBestAction.decision}</div>
          <div className="plan-list">
            {latestResponse.nextBestAction.timeline.map((item) => (
              <article key={`${item.owner}-${item.deadline}`} className="plan-item">
                <div className="plan-item__head">
                  <strong>{item.action}</strong>
                  <span>{item.deadline}</span>
                </div>
                <p><strong>{copy.owner}:</strong> {item.owner}</p>
                <p><strong>{copy.outcome}:</strong> {item.expectedOutcome}</p>
              </article>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="copilot-shell" data-guided-target="copilot-workspace">
      <section className="copilot-chat-panel">
        <div className="copilot-panel__header">
          <div>
            <p className="eyebrow">{copy.title}</p>
            <h2>{copy.subtitle}</h2>
          </div>
          <div className="candidate-summary__chips">
            <Badge label={language === "en" ? "Interactive Demo" : "Simulation interactive"} tone="success" />
            <span className="demo-pill">{language === "en" ? "Demo data" : "Données de démo"}</span>
          </div>
        </div>

        <div className="copilot-chat-history">
          <div className="copilot-section-title">{copy.history}</div>
          {messages.map((message) => (
            <div key={message.id} className={`copilot-message ${message.author === "ai" ? "copilot-message--ai" : "copilot-message--user"}`}>
              <div className="copilot-message__bubble">
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <div className="copilot-suggested-prompts">
          <div className="copilot-section-title">{copy.prompts}</div>
          <div className="copilot-prompt-list">
            {promptPresets.map((prompt) => (
              <button
                key={prompt.key}
                type="button"
                className="copilot-prompt-pill"
                onClick={() => {
                  const label = language === "en" ? prompt.en : prompt.fr;
                  setDraft(label);
                  setActiveAction(label);
                  void askCopilot(label, label);
                }}
              >
                {language === "en" ? prompt.en : prompt.fr}
              </button>
            ))}
          </div>
        </div>

        <div className="copilot-composer">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={copy.composer}
            rows={4}
          />
          <div className="copilot-composer__actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setModal({
                title: copy.attach,
                description: language === "en"
                  ? "This demo action attaches a CV and surfaces the relevant candidate context for the next step."
                  : "Cette action de démonstration joint un CV et affiche le contexte candidat pertinent pour l’étape suivante.",
                confirmLabel: language === "en" ? "Attach" : "Joindre",
                message: language === "en" ? "CV attached to the workspace" : "CV joint au workspace",
              })}
            >
              {copy.attach}
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => {
                setMessages(getInitialMessages(language));
                setLatestResponse(null);
                setDraft("");
                setError(null);
                setToast(language === "en" ? "Conversation reset" : "Conversation réinitialisée");
              }}
            >
              {copy.reset}
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                if (!draft.trim()) return;
                const message = draft.trim();
                setDraft("");
                void askCopilot(message);
              }}
              disabled={loading}
            >
              {loading ? copy.loading : copy.send}
            </button>
          </div>
        </div>
      </section>

      <aside className="copilot-side-panel">
        <section className="section-card copilot-side-card">
          <div className="section-card__header">
            <h3>{copy.actions}</h3>
            <p>High-velocity recruiting workflows</p>
          </div>
          <div className="copilot-action-list">
            {promptPresets.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`copilot-action-item ${activeAction === (language === "en" ? item.en : item.fr) ? "is-active" : ""}`}
                onClick={() => {
                  const label = language === "en" ? item.en : item.fr;
                  setActiveAction(label);
                  void askCopilot(label, label);
                }}
                disabled={loading}
              >
                <span>{language === "en" ? item.en : item.fr}</span>
                <Icon name="arrow" size={14} />
              </button>
            ))}
          </div>
        </section>

        <section className="section-card copilot-side-card">
          <div className="section-card__header">
            <h3>{copy.context}</h3>
            <p>{candidateContext.role}</p>
          </div>
          <div className="copilot-context-grid">
            <div>
              <p className="copilot-context-label">{language === "en" ? "Selected candidate" : "Candidat sélectionné"}</p>
              <strong>{candidateContext.name}</strong>
            </div>
            <div>
              <p className="copilot-context-label">{language === "en" ? "AI match" : "Match IA"}</p>
              <strong>{candidateContext.match}</strong>
            </div>
            <div>
              <p className="copilot-context-label">{language === "en" ? "Hiring probability" : "Probabilité d’embauche"}</p>
              <strong>{candidateContext.probability}</strong>
            </div>
            <div>
              <p className="copilot-context-label">{language === "en" ? "Current stage" : "Étape actuelle"}</p>
              <strong>{candidateContext.stage}</strong>
            </div>
          </div>
          <div className="copilot-pill-list">
            {candidateContext.skills.map((skill) => (
              <Badge key={skill} label={skill} tone="primary" />
            ))}
          </div>
          <div className="copilot-risks">
            <p className="copilot-context-label">{language === "en" ? "Main risks" : "Principaux risques"}</p>
            <ul>
              {candidateContext.risks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section-card copilot-side-card">
          <div className="section-card__header">
            <h3>{copy.executionTitle}</h3>
            <p>{copy.recentHistory}</p>
          </div>
          {state.actionExecution.lastExecutionSummary ? (
            <div className="copilot-empty-output">
              <strong>{state.actionExecution.lastExecutionSummary.action}</strong>
              <p>{state.actionExecution.lastExecutionSummary.target}</p>
              <p>{state.actionExecution.lastExecutionSummary.timestamp}</p>
              <p><strong>{language === "en" ? "Next action" : "Prochaine action"}:</strong> {state.actionExecution.lastExecutionSummary.nextAction}</p>
            </div>
          ) : (
            <div className="copilot-empty-output">
              <p>{copy.executionEmpty}</p>
            </div>
          )}
          {state.actionExecution.actionHistory.length > 0 ? (
            <ul className="artifact-list" aria-label={copy.recentHistory}>
              {state.actionExecution.actionHistory.slice(-3).reverse().map((entry) => (
                <li key={entry.id}>{entry.timestamp} - {entry.action}</li>
              ))}
            </ul>
          ) : null}
        </section>

        <section className="section-card copilot-side-card">
          <div className="section-card__header">
            <h3>{copy.responseTitle}</h3>
            <p>{language === "en" ? "Action-specific recruiter artifact" : "Livrable recruteur spécifique à l’action"}</p>
          </div>
          <p className="demo-disclaimer" style={{ marginBottom: "10px" }}>
            {copy.demoNotice}
          </p>
          {loading ? (
            <div className="copilot-empty-output">
              <strong>{copy.loading}</strong>
              <p>{language === "en" ? "Generating a structured output…" : "Génération d’une sortie structurée…"}</p>
            </div>
          ) : (
            renderDecisionOutput()
          )}
          {responseIntent ? <p className="copilot-review-note">{latestResponse?.reviewNote}</p> : null}
        </section>
      </aside>

      {error ? <div className="toast" role="alert">{error}</div> : null}

      {modal ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h4>{modal.title}</h4>
            <p>{modal.description}</p>
            <div className="modal-actions">
              <button type="button" className="btn btn--secondary" onClick={() => setModal(null)}>
                {language === "en" ? "Cancel" : "Annuler"}
              </button>
              <button type="button" className="btn btn--primary" onClick={() => { setToast(modal.message); setModal(null); }}>
                {modal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? <div className="toast" role="status">{toast}</div> : null}
    </div>
  );
}
