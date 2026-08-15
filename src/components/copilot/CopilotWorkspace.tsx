"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "../ui/Badge";
import { Icon } from "../ui/Icon";
import { canonicalCandidates, getCanonicalCandidateById } from "../../lib/demoData";
import { useDemoExperience } from "../../lib/demoExperience";

type Language = "en" | "fr";
type Severity = "high" | "medium" | "low";
type IntentKey =
  | "summarize"
  | "compare"
  | "questions"
  | "email"
  | "risks"
  | "action"
  | "match"
  | "strengths"
  | "compensation"
  | "timing"
  | "unknown";

type Message = {
  id: number;
  author: "user" | "ai";
  text: string;
};

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
  explainability?: {
    label: string;
    score: string;
    note: string;
    factors: { label: string; score: string; explanation: string }[];
  };
  insight?: {
    heading: string;
    bullets: string[];
    recommendation: string;
  };
};

const promptPresets = [
  { key: "summarize", en: "Executive Summary", fr: "Synthèse exécutive" },
  { key: "compare", en: "Compare Candidates", fr: "Comparer les candidats" },
  { key: "questions", en: "Interview Guide", fr: "Guide d’entretien" },
  { key: "email", en: "Suggested Email", fr: "Email suggéré" },
  { key: "risks", en: "Hiring Risk Assessment", fr: "Évaluation des risques d’embauche" },
  { key: "action", en: "Next Best Action", fr: "Prochaine meilleure action" },
] as const;

type PresetIntent = (typeof promptPresets)[number]["key"];

const maya = getCanonicalCandidateById("maya-chen");
const candidateContext = {
  ...maya,
  role: maya.role,
  match: `${maya.match}%`,
  probability: `${maya.probability}%`,
  stage: maya.stage,
  skills: ["Product strategy", "Design systems", "Leadership", "Cross-functional alignment"],
  risks: ["Limited enterprise experience", "Compensation expectations", "Start timing"],
};

function getInitialMessages(language: Language): Message[] {
  return [
    {
      id: 1,
      author: "ai",
      text: language === "en"
        ? "I’ve reviewed Maya Chen’s profile. Ask me about her fit, risks, strengths, interview, compensation, timing or next steps."
        : "J’ai examiné le profil de Maya Chen. Vous pouvez m’interroger sur son adéquation, ses risques, ses forces, l’entretien, la rémunération, le timing ou les prochaines étapes.",
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

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detectFreeformIntent(message: string): IntentKey {
  const normalized = normalizeText(message);

  if (/(96|match|score|scoring|note|calcul|calcule|obtenu|resultat|pourquoi.*%|how.*match)/.test(normalized)) return "match";
  if (/(risk|risks|concern|warning|problem|risque|risques|alerte|probleme|faiblesse|weakness)/.test(normalized)) return "risks";
  if (/(strength|strengths|strong point|best evidence|point fort|points forts|forces|atout|atouts)/.test(normalized)) return "strengths";
  if (/(salary|compensation|package|remuneration|salaire|fourchette|pay)/.test(normalized)) return "compensation";
  if (/(timing|availability|available|notice|start date|date de debut|disponibilite|preavis|demarrage)/.test(normalized)) return "timing";
  if (/(compare|versus|\bvs\b|difference|differ|comparer|comparaison)/.test(normalized)) return "compare";
  if (/(interview|entretien|question|questions|guide)/.test(normalized)) return "questions";
  if (/(email|mail|message|write|ecrire|rediger|contact)/.test(normalized)) return "email";
  if (/(next|recommend|action|plan|schedule|prochaine|recommand|planifier|ensuite|faire maintenant)/.test(normalized)) return "action";
  if (/(summarize|summary|overview|profile|resume|resumer|synthese|brief|profil)/.test(normalized)) return "summarize";

  return "unknown";
}

function buildSimulatedResponse(intent: IntentKey, language: Language): CopilotResponse {
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
    ? "Demo mode — responses and scores are simulated from the visible demo dataset, not produced by a live AI model."
    : "Mode démo — les réponses et scores sont simulés à partir des données visibles de la démo, pas produits par un modèle IA en direct.";

  if (intent === "match") {
    return language === "en"
      ? {
          intent,
          title: "Role match explainability",
          brief: "The 96% role match is a simulated, explainable demo score built from four visible signal groups.",
          confidenceScore: 96,
          reviewNote,
          explainability: {
            label: "Simulated role match",
            score: "96%",
            note: "This is a deterministic portfolio-demo score, not a production ML prediction.",
            factors: [
              { label: "Skills & role alignment", score: "98%", explanation: "Strong overlap with product strategy, design systems and senior product-design scope." },
              { label: "Leadership & collaboration", score: "96%", explanation: "Consistent cross-functional leadership and stakeholder-alignment signals." },
              { label: "Panel evidence", score: "95%", explanation: "Strong communication, collaboration and role-expertise scorecard signals." },
              { label: "Context & experience", score: "94%", explanation: "Very strong fit, reduced slightly by limited enterprise-scale exposure." },
            ],
          },
        }
      : {
          intent,
          title: "Explicabilité du match rôle",
          brief: "Le match rôle de 96 % est un score de démonstration simulé et explicable, construit à partir de quatre groupes de signaux visibles.",
          confidenceScore: 96,
          reviewNote,
          explainability: {
            label: "Match rôle simulé",
            score: "96%",
            note: "Il s’agit d’un score déterministe pour la démo portfolio, pas d’une prédiction ML de production.",
            factors: [
              { label: "Compétences & rôle", score: "98%", explanation: "Très fort recouvrement avec stratégie produit, design systems et périmètre Senior Product Designer." },
              { label: "Leadership & collaboration", score: "96%", explanation: "Signaux cohérents de leadership cross-fonctionnel et d’alignement des parties prenantes." },
              { label: "Retours panel", score: "95%", explanation: "Signaux élevés en communication, collaboration et expertise du rôle." },
              { label: "Contexte & expérience", score: "94%", explanation: "Très bonne adéquation, légèrement réduite par une exposition enterprise encore à valider." },
            ],
          },
        };
  }

  if (intent === "strengths") {
    return language === "en"
      ? {
          intent,
          title: "Candidate strengths",
          brief: "Maya’s strongest signals are strategic product thinking, cross-functional leadership and design-system ownership.",
          confidenceScore: 92,
          reviewNote,
          insight: {
            heading: "Strongest evidence",
            bullets: [
              "96% simulated role match with especially strong skills alignment.",
              "Scorecard shows top-tier communication, collaboration and role expertise.",
              "Evidence of product strategy ownership in ambiguous environments.",
              "Leadership signal is consistent across the visible panel data.",
            ],
            recommendation: "Keep Maya on the primary final-review path while validating enterprise-scale exposure.",
          },
        }
      : {
          intent,
          title: "Points forts du profil",
          brief: "Les signaux les plus forts de Maya sont la stratégie produit, le leadership cross-fonctionnel et la maîtrise des design systems.",
          confidenceScore: 92,
          reviewNote,
          insight: {
            heading: "Éléments les plus convaincants",
            bullets: [
              "96 % de match rôle simulé avec un alignement compétences particulièrement élevé.",
              "Scorecard très fort en communication, collaboration et expertise du rôle.",
              "Capacité démontrée à porter la stratégie produit dans des contextes ambigus.",
              "Signal de leadership cohérent dans les données panel visibles.",
            ],
            recommendation: "Maintenir Maya sur la trajectoire de revue finale principale tout en validant son exposition à l’échelle enterprise.",
          },
        };
  }

  if (intent === "compensation") {
    return language === "en"
      ? {
          intent,
          title: "Compensation signal",
          brief: "Compensation is the highest commercial risk in the current demo scenario, but it is not a blocker yet.",
          confidenceScore: 88,
          reviewNote,
          insight: {
            heading: "What the demo data supports",
            bullets: [
              "Compensation expectations are above the current midpoint.",
              "No accepted or rejected package is recorded in the demo data.",
              "The risk is timing: late package alignment could weaken offer acceptance probability.",
            ],
            recommendation: "Validate range boundaries and flexibility before the final executive decision.",
          },
        }
      : {
          intent,
          title: "Signal rémunération",
          brief: "La rémunération est le principal risque commercial du scénario de démo, mais ce n’est pas encore un blocage.",
          confidenceScore: 88,
          reviewNote,
          insight: {
            heading: "Ce que les données de démo permettent d’affirmer",
            bullets: [
              "Les attentes de rémunération sont au-dessus du milieu de fourchette actuel.",
              "Aucun package accepté ou refusé n’est enregistré dans les données de démo.",
              "Le risque porte surtout sur le timing : un cadrage trop tardif peut fragiliser l’acceptation de l’offre.",
            ],
            recommendation: "Valider rapidement les bornes de fourchette et les marges de flexibilité avant la décision exécutive finale.",
          },
        };
  }

  if (intent === "timing") {
    return language === "en"
      ? {
          intent,
          title: "Availability & timing",
          brief: "Timing remains a medium risk because the target start date has not been fully validated in the demo scenario.",
          confidenceScore: 86,
          reviewNote,
          insight: {
            heading: "Timing signal",
            bullets: [
              "Start timing is listed as a current risk in the candidate context.",
              "The demo does not contain a confirmed notice-period date.",
              "Decision latency also increases the risk of losing candidate momentum.",
            ],
            recommendation: "Confirm realistic availability during the next recruiter touchpoint and align onboarding dependencies.",
          },
        }
      : {
          intent,
          title: "Disponibilité & timing",
          brief: "Le timing reste un risque moyen car la date de démarrage cible n’est pas encore totalement validée dans le scénario de démo.",
          confidenceScore: 86,
          reviewNote,
          insight: {
            heading: "Signal timing",
            bullets: [
              "Le timing de démarrage figure parmi les risques actuels du contexte candidat.",
              "La démo ne contient pas de date de préavis confirmée.",
              "Une décision trop lente augmente aussi le risque de perdre le momentum candidat.",
            ],
            recommendation: "Confirmer la disponibilité réaliste au prochain échange recruteur et aligner les dépendances d’onboarding.",
          },
        };
  }

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
              "96% simulated role match with consistent panel evidence.",
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
              "96 % de match rôle simulé avec des signaux panel cohérents.",
              "Capacité démontrée à piloter la stratégie produit dans l’ambiguïté.",
            ],
            watchouts: [
              "Attentes de rémunération au-dessus du milieu de fourchette.",
              "Exposition enterprise à confirmer en dernier tour.",
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
          brief: "Use this guide to validate enterprise-scale readiness in one focused conversation.",
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
            close: "End by aligning on first-90-day priorities and readiness to discuss start timing.",
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
                question: "Qu’est-ce qui a changé dans votre approche design quand la complexité est passée de l’équipe à l’organisation ?",
                listenFor: "Vision systémique, jugement de gouvernance et conduite du changement.",
                redFlag: "Exemples trop tactiques sans contraintes enterprise.",
              },
              {
                theme: "Exécution dans l’ambiguïté",
                question: "Comment avancez-vous lorsque les exigences business sont incomplètes et le délai fixe ?",
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
              "Pouvez-vous partager vos disponibilités pour une session de 45 minutes dans les deux prochains jours ouvrés ?",
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
          brief: "Overall risk remains manageable if compensation and timing are handled in parallel.",
          confidenceScore: 90,
          reviewNote,
          hiringRiskAssessment: {
            overallRisk: "medium",
            summary: "No blocker identified. The main risk cluster is commercial alignment rather than role capability.",
            items: [
              {
                title: "Compensation alignment",
                severity: "high",
                impact: "Could delay acceptance if package framing is introduced too late.",
                mitigation: "Share range boundaries in the next touchpoint and prepare flexibility options.",
                owner: "TA Lead",
              },
              {
                title: "Enterprise exposure",
                severity: "medium",
                impact: "Creates a remaining validation gap before final executive decision.",
                mitigation: "Use the final interview to test organizational-scale examples and governance judgment.",
                owner: "Hiring Manager",
              },
              {
                title: "Start timing",
                severity: "medium",
                impact: "May push the target start date beyond the preferred onboarding window.",
                mitigation: "Validate realistic availability now and sequence onboarding dependencies.",
                owner: "Recruiter",
              },
            ],
          },
        }
      : {
          intent,
          title: "Évaluation des risques d’embauche",
          brief: "Le risque global reste maîtrisable si la rémunération et le timing sont traités en parallèle.",
          confidenceScore: 90,
          reviewNote,
          hiringRiskAssessment: {
            overallRisk: "medium",
            summary: "Aucun blocage majeur identifié. Le risque principal concerne l’alignement commercial plutôt que la capacité à tenir le rôle.",
            items: [
              {
                title: "Alignement rémunération",
                severity: "high",
                impact: "Peut retarder l’acceptation si le cadrage package arrive trop tard.",
                mitigation: "Partager les bornes de fourchette au prochain échange et préparer des options de flexibilité.",
                owner: "TA Lead",
              },
              {
                title: "Exposition enterprise",
                severity: "medium",
                impact: "Laisse un dernier point à valider avant la décision exécutive finale.",
                mitigation: "Utiliser l’entretien final pour tester les exemples à l’échelle organisationnelle et le jugement de gouvernance.",
                owner: "Hiring Manager",
              },
              {
                title: "Timing de démarrage",
                severity: "medium",
                impact: "Peut décaler la date de démarrage cible au-delà de la fenêtre d’onboarding souhaitée.",
                mitigation: "Valider maintenant la disponibilité réaliste et séquencer les dépendances d’intégration.",
                owner: "Recruiter",
              },
            ],
          },
        };
  }

  if (intent === "action") {
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
                expectedOutcome: "Remove timing ambiguity before executive call.",
              },
              {
                owner: "Hiring Manager",
                deadline: "Tomorrow, 12:00",
                action: "Run final executive interview with an enterprise-readiness lens.",
                expectedOutcome: "Close the remaining signal gap on organizational scope.",
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
          brief: "La vitesse de décision devient prioritaire. Il faut passer de l’évaluation à l’engagement.",
          confidenceScore: 87,
          reviewNote,
          nextBestAction: {
            decision: "Avancer avec un plan de décision contrôlé sur 72 heures.",
            timeline: [
              {
                owner: "Recruiter",
                deadline: "Aujourd’hui, 17:00",
                action: "Confirmer la disponibilité de Maya et ses attentes de rémunération.",
                expectedOutcome: "Lever les ambiguïtés de timing avant l’échange exécutif.",
              },
              {
                owner: "Hiring Manager",
                deadline: "Demain, 12:00",
                action: "Mener l’entretien exécutif final avec un angle préparation enterprise.",
                expectedOutcome: "Clore le dernier écart de signal sur le périmètre organisationnel.",
              },
              {
                owner: "TA Lead",
                deadline: "Sous 48 h après entretien final",
                action: "Émettre le brief de décision et la recommandation d’offre.",
                expectedOutcome: "Préserver le momentum candidat et réduire le risque de perte.",
              },
            ],
          },
        };
  }

  return language === "en"
    ? {
        intent: "unknown",
        title: "Demo scope",
        brief: "I don’t have enough structured demo data to answer that precisely without inventing information.",
        confidenceScore: 100,
        reviewNote,
        insight: {
          heading: "What I can answer reliably",
          bullets: [
            "Role match and how the simulated 96% score is composed.",
            "Strengths, risks, compensation and availability signals.",
            "Candidate comparison and interview preparation.",
            "Recruiter email and next-best-action planning.",
          ],
          recommendation: "Ask a question within one of these areas to keep the portfolio demo deterministic and evidence-based.",
        },
      }
    : {
        intent: "unknown",
        title: "Périmètre de la démo",
        brief: "Je n’ai pas assez de données structurées dans cette démo pour répondre précisément sans inventer d’information.",
        confidenceScore: 100,
        reviewNote,
        insight: {
          heading: "Ce à quoi je peux répondre de façon fiable",
          bullets: [
            "Le match rôle et la composition du score simulé de 96 %.",
            "Les forces, risques, signaux de rémunération et de disponibilité.",
            "La comparaison candidats et la préparation d’entretien.",
            "La rédaction d’un email recruteur et le plan de prochaine action.",
          ],
          recommendation: "Posez une question dans l’un de ces domaines pour garder une démo portfolio déterministe et fondée sur les données visibles.",
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

function getConversationReply(response: CopilotResponse, language: Language) {
  if (response.intent === "match" && response.explainability) {
    return language === "en"
      ? `The ${response.explainability.score} score is simulated from four visible signal groups: skills, leadership, panel evidence and context. The strongest factor is skills & role alignment at 98%; enterprise exposure is the main deduction.`
      : `Le score de ${response.explainability.score} est simulé à partir de quatre groupes de signaux visibles : compétences, leadership, retours panel et contexte. Le facteur le plus fort est l’alignement compétences/rôle à 98 % ; l’exposition enterprise est la principale réduction.`;
  }
  if (response.intent === "risks" && response.hiringRiskAssessment) {
    return language === "en"
      ? "I see three current risks: compensation alignment is the highest, followed by enterprise exposure and start timing. None is a blocker yet. I would validate compensation and availability before the final executive decision."
      : "J’identifie trois risques actuels : l’alignement de rémunération est le plus élevé, puis l’exposition enterprise et le timing de démarrage. Aucun n’est bloquant à ce stade. Je validerais rémunération et disponibilité avant la décision exécutive finale.";
  }
  if (response.intent === "strengths" && response.insight) {
    return language === "en"
      ? "Maya’s strongest evidence is strategic product thinking, cross-functional leadership, design-system ownership and consistently strong panel signals."
      : "Les éléments les plus convaincants chez Maya sont la stratégie produit, le leadership cross-fonctionnel, la maîtrise des design systems et des signaux panel constamment élevés.";
  }
  if (response.intent === "compensation") {
    return language === "en"
      ? "Compensation is the highest commercial risk in the demo, but there is no recorded refusal or blocker. The right next step is to align range boundaries before the final decision."
      : "La rémunération est le principal risque commercial de la démo, mais aucun refus ni blocage n’est enregistré. La bonne prochaine étape est d’aligner les bornes de fourchette avant la décision finale.";
  }
  if (response.intent === "timing") {
    return language === "en"
      ? "Availability remains a medium risk because the demo does not contain a confirmed notice-period date. I would validate realistic start timing at the next recruiter touchpoint."
      : "La disponibilité reste un risque moyen car la démo ne contient pas de date de préavis confirmée. Je validerais le timing de démarrage réaliste au prochain échange recruteur.";
  }
  if (response.intent === "unknown") return response.brief;
  return `${response.brief} ${language === "en" ? "I’ve also prepared the structured detail in the decision panel." : "J’ai également préparé le détail structuré dans le panneau de décision."}`;
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
  const [activeAction, setActiveAction] = useState<PresetIntent>("summarize");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [modal, setModal] = useState<{ title: string; description: string; confirmLabel: string; message: string } | null>(null);
  const [latestResponse, setLatestResponse] = useState<CopilotResponse | null>(null);

  useEffect(() => {
    if (initialContext?.context === "team") {
      setToast(language === "en" ? "Team context loaded for recruiter coordination." : "Contexte équipe chargé pour la coordination recruteur.");
      return;
    }
    if (initialContext?.mode === "interview-prep" && initialContext?.candidateId === "maya-chen") {
      setToast(language === "en" ? "Interview-preparation context loaded for Maya Chen." : "Contexte de préparation d’entretien chargé pour Maya Chen.");
    }
  }, [initialContext?.candidateId, initialContext?.context, initialContext?.mode, language]);

  useEffect(() => {
    setMessages(getInitialMessages(language));
    setDraft("");
    setActiveAction("summarize");
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
        demoNotice: "Demo mode — AI responses are simulated from visible demo data.",
        loading: "Thinking…",
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
        demoNotice: "Mode démo — les réponses IA sont simulées à partir des données visibles.",
        loading: "Réflexion…",
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
        executionTitle: "Dernière exécution partagée",
        executionEmpty: "Aucune action exécutée pour le moment.",
        recentHistory: "Historique récent",
      };

  const responseIntent = useMemo(() => latestResponse?.intent ?? null, [latestResponse?.intent]);

  const askCopilot = async (message: string, forcedIntent?: IntentKey) => {
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setMessages((prev) => [...prev, { id: prev.length + 1, author: "user", text: message.trim() }]);

    await new Promise((resolve) => setTimeout(resolve, 650));

    const selectedIntent = forcedIntent ?? detectFreeformIntent(message);
    const parsed = buildSimulatedResponse(selectedIntent, language);
    setLatestResponse(parsed);
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, author: "ai", text: getConversationReply(parsed, language) },
    ]);
    setLoading(false);
  };

  const renderDecisionOutput = () => {
    if (!latestResponse) {
      return (
        <div className="copilot-empty-output">
          <strong>{language === "en" ? "No output generated yet" : "Aucune sortie générée"}</strong>
          <p>{language === "en" ? "Choose an AI action or ask a free-form question." : "Choisissez une action IA ou posez une question libre."}</p>
        </div>
      );
    }

    if (latestResponse.explainability) {
      return (
        <div className="copilot-artifact copilot-artifact--summary">
          <div className="artifact-header">
            <h4>{latestResponse.title}</h4>
            <span className="artifact-confidence">{latestResponse.explainability.score}</span>
          </div>
          <p className="artifact-brief">{latestResponse.brief}</p>
          <div className="artifact-callout">{latestResponse.explainability.label}: {latestResponse.explainability.score}</div>
          <div className="risk-list">
            {latestResponse.explainability.factors.map((factor) => (
              <article key={factor.label} className="risk-card">
                <div className="risk-card__top">
                  <strong>{factor.label}</strong>
                  <span className="artifact-confidence">{factor.score}</span>
                </div>
                <p>{factor.explanation}</p>
              </article>
            ))}
          </div>
          <p className="artifact-footer">{latestResponse.explainability.note}</p>
        </div>
      );
    }

    if (latestResponse.insight) {
      return (
        <div className="copilot-artifact copilot-artifact--summary">
          <div className="artifact-header">
            <h4>{latestResponse.title}</h4>
            <span className="artifact-confidence">{copy.confidence}: {latestResponse.confidenceScore}%</span>
          </div>
          <p className="artifact-brief">{latestResponse.brief}</p>
          <div className="artifact-block">
            <p className="copilot-context-label">{latestResponse.insight.heading}</p>
            <ul className="artifact-list">
              {latestResponse.insight.bullets.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <p className="artifact-footer"><strong>{copy.recommendation}:</strong> {latestResponse.insight.recommendation}</p>
        </div>
      );
    }

    if (latestResponse.intent === "summarize" && latestResponse.executiveSummary) {
      return (
        <div className="copilot-artifact copilot-artifact--summary">
          <div className="artifact-header"><h4>{latestResponse.title}</h4><span className="artifact-confidence">{copy.confidence}: {latestResponse.confidenceScore}%</span></div>
          <p className="artifact-brief">{latestResponse.brief}</p>
          <div className="artifact-callout">{latestResponse.executiveSummary.decision}</div>
          <div className="artifact-columns">
            <div><p className="copilot-context-label">{language === "en" ? "Strengths" : "Forces"}</p><ul className="artifact-list">{latestResponse.executiveSummary.strengths.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><p className="copilot-context-label">{language === "en" ? "Watchouts" : "Points de vigilance"}</p><ul className="artifact-list artifact-list--watch">{latestResponse.executiveSummary.watchouts.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </div>
          <p className="artifact-footer"><strong>{copy.recommendation}:</strong> {latestResponse.executiveSummary.recommendation}</p>
        </div>
      );
    }

    if (latestResponse.intent === "compare" && latestResponse.candidateComparison) {
      return (
        <div className="copilot-artifact copilot-artifact--compare">
          <div className="artifact-header"><h4>{latestResponse.title}</h4><span className="artifact-confidence">{copy.benchmarkRole}: {latestResponse.candidateComparison.benchmarkRole}</span></div>
          <p className="artifact-brief">{latestResponse.brief}</p>
          <div className="comparison-table-wrap"><table className="comparison-table"><thead><tr><th>{language === "en" ? "Candidate" : "Candidat"}</th><th>{language === "en" ? "Stage" : "Étape"}</th><th>Match</th><th>{language === "en" ? "Probability" : "Probabilité"}</th><th>{language === "en" ? "Differentiator" : "Différenciateur"}</th><th>{copy.risk}</th></tr></thead><tbody>
            {latestResponse.candidateComparison.rows.map((row) => <tr key={row.candidate}><td>{row.candidate}</td><td>{row.stage}</td><td>{row.match}</td><td>{row.probability}</td><td>{row.differentiator}</td><td><span className={`severity-pill severity-pill--${row.riskLevel}`}>{getSeverityLabel(row.riskLevel, language)}</span></td></tr>)}
          </tbody></table></div>
          <p className="artifact-footer"><strong>{copy.recommendation}:</strong> {latestResponse.candidateComparison.recommendation}</p>
        </div>
      );
    }

    if (latestResponse.intent === "questions" && latestResponse.interviewGuide) {
      return (
        <div className="copilot-artifact copilot-artifact--interview">
          <div className="artifact-header"><h4>{latestResponse.title}</h4><span className="artifact-confidence">{copy.confidence}: {latestResponse.confidenceScore}%</span></div>
          <p className="artifact-brief">{latestResponse.brief}</p>
          <div className="artifact-block"><p className="copilot-context-label">{copy.objective}</p><p>{latestResponse.interviewGuide.objective}</p></div>
          <div className="artifact-block artifact-block--soft"><p className="copilot-context-label">{language === "en" ? "Opening script" : "Script d’ouverture"}</p><p>{latestResponse.interviewGuide.opener}</p></div>
          <div className="guide-list">{latestResponse.interviewGuide.sections.map((section) => <article key={section.theme} className="guide-card"><p className="guide-card__theme">{section.theme}</p><p><strong>{copy.interviewQuestion}:</strong> {section.question}</p><p><strong>{copy.listenFor}:</strong> {section.listenFor}</p><p><strong>{copy.redFlag}:</strong> {section.redFlag}</p></article>)}</div>
          <p className="artifact-footer">{latestResponse.interviewGuide.close}</p>
        </div>
      );
    }

    if (latestResponse.intent === "email" && latestResponse.suggestedEmail) {
      return (
        <div className="copilot-artifact copilot-artifact--email">
          <div className="artifact-header"><h4>{latestResponse.title}</h4><span className="artifact-confidence">{copy.tone}: {latestResponse.suggestedEmail.tone}</span></div>
          <p className="artifact-brief">{latestResponse.brief}</p>
          <div className="email-meta"><p><strong>{copy.to}:</strong> {latestResponse.suggestedEmail.to}</p><p><strong>{copy.subject}:</strong> {latestResponse.suggestedEmail.subject}</p></div>
          <div className="email-body">{latestResponse.suggestedEmail.body.map((line) => <p key={line}>{line}</p>)}</div>
        </div>
      );
    }

    if (latestResponse.intent === "risks" && latestResponse.hiringRiskAssessment) {
      return (
        <div className="copilot-artifact copilot-artifact--risk">
          <div className="artifact-header"><h4>{latestResponse.title}</h4><span className={`severity-pill severity-pill--${latestResponse.hiringRiskAssessment.overallRisk}`}>{copy.overallRisk}: {getSeverityLabel(latestResponse.hiringRiskAssessment.overallRisk, language)}</span></div>
          <p className="artifact-brief">{latestResponse.brief}</p><p className="artifact-footer">{latestResponse.hiringRiskAssessment.summary}</p>
          <div className="risk-list">{latestResponse.hiringRiskAssessment.items.map((item) => <article key={item.title} className="risk-card"><div className="risk-card__top"><strong>{item.title}</strong><span className={`severity-pill severity-pill--${item.severity}`}>{getSeverityLabel(item.severity, language)}</span></div><p><strong>Impact:</strong> {item.impact}</p><p><strong>Mitigation:</strong> {item.mitigation}</p><p><strong>{copy.owner}:</strong> {item.owner}</p></article>)}</div>
        </div>
      );
    }

    if (latestResponse.nextBestAction) {
      return (
        <div className="copilot-artifact copilot-artifact--plan">
          <div className="artifact-header"><h4>{latestResponse.title}</h4><span className="artifact-confidence">{copy.confidence}: {latestResponse.confidenceScore}%</span></div>
          <p className="artifact-brief">{latestResponse.brief}</p><div className="artifact-callout">{latestResponse.nextBestAction.decision}</div>
          <div className="plan-list">{latestResponse.nextBestAction.timeline.map((item) => <article key={`${item.owner}-${item.deadline}`} className="plan-item"><div className="plan-item__head"><strong>{item.action}</strong><span>{item.deadline}</span></div><p><strong>{copy.owner}:</strong> {item.owner}</p><p><strong>{copy.outcome}:</strong> {item.expectedOutcome}</p></article>)}</div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="copilot-shell" data-guided-target="copilot-workspace">
      <section className="copilot-chat-panel">
        <div className="copilot-panel__header">
          <div><p className="eyebrow">{copy.title}</p><h2>{copy.subtitle}</h2></div>
          <div className="candidate-summary__chips"><Badge label={language === "en" ? "Interactive Demo" : "Simulation interactive"} tone="success" /><span className="demo-pill">{language === "en" ? "Demo data" : "Données de démo"}</span></div>
        </div>

        <div className="copilot-chat-history">
          <div className="copilot-section-title">{copy.history}</div>
          {messages.map((message) => <div key={message.id} className={`copilot-message ${message.author === "ai" ? "copilot-message--ai" : "copilot-message--user"}`}><div className="copilot-message__bubble">{message.text}</div></div>)}
        </div>

        <div className="copilot-suggested-prompts">
          <div className="copilot-section-title">{copy.prompts}</div>
          <div className="copilot-prompt-list">
            {promptPresets.map((prompt) => <button key={prompt.key} type="button" className="copilot-prompt-pill" onClick={() => { const label = language === "en" ? prompt.en : prompt.fr; setDraft(label); setActiveAction(prompt.key); void askCopilot(label, prompt.key); }}>{language === "en" ? prompt.en : prompt.fr}</button>)}
          </div>
        </div>

        <div className="copilot-composer">
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={copy.composer} rows={4} />
          <div className="copilot-composer__actions">
            <button type="button" className="btn btn--secondary" onClick={() => setModal({ title: copy.attach, description: language === "en" ? "This demo action attaches a CV and surfaces the relevant candidate context for the next step." : "Cette action de démonstration joint un CV et affiche le contexte candidat pertinent pour l’étape suivante.", confirmLabel: language === "en" ? "Attach" : "Joindre", message: language === "en" ? "CV attached to the workspace" : "CV joint au workspace" })}>{copy.attach}</button>
            <button type="button" className="btn btn--secondary" onClick={() => { setMessages(getInitialMessages(language)); setLatestResponse(null); setDraft(""); setError(null); setToast(language === "en" ? "Conversation reset" : "Conversation réinitialisée"); }}>{copy.reset}</button>
            <button type="button" className="btn btn--primary" onClick={() => { if (!draft.trim()) return; const message = draft.trim(); setDraft(""); void askCopilot(message); }} disabled={loading}>{loading ? copy.loading : copy.send}</button>
          </div>
        </div>
      </section>

      <aside className="copilot-side-panel">
        <section className="section-card copilot-side-card">
          <div className="section-card__header"><h3>{copy.actions}</h3><p>High-velocity recruiting workflows</p></div>
          <div className="copilot-action-list">
            {promptPresets.map((item) => <button key={item.key} type="button" className={`copilot-action-item ${activeAction === item.key ? "is-active" : ""}`} onClick={() => { const label = language === "en" ? item.en : item.fr; setActiveAction(item.key); void askCopilot(label, item.key); }} disabled={loading}><span>{language === "en" ? item.en : item.fr}</span><Icon name="arrow" size={14} /></button>)}
          </div>
        </section>

        <section className="section-card copilot-side-card">
          <div className="section-card__header"><h3>{copy.context}</h3><p>{candidateContext.role}</p></div>
          <div className="copilot-context-grid">
            <div><p className="copilot-context-label">{language === "en" ? "Selected candidate" : "Candidat sélectionné"}</p><strong>{candidateContext.name}</strong></div>
            <div><p className="copilot-context-label">{language === "en" ? "AI match" : "Match IA"}</p><strong>{candidateContext.match}</strong></div>
            <div><p className="copilot-context-label">{language === "en" ? "Hiring probability" : "Probabilité d’embauche"}</p><strong>{candidateContext.probability}</strong></div>
            <div><p className="copilot-context-label">{language === "en" ? "Current stage" : "Étape actuelle"}</p><strong>{candidateContext.stage}</strong></div>
          </div>
          <div className="copilot-pill-list">{candidateContext.skills.map((skill) => <Badge key={skill} label={skill} tone="primary" />)}</div>
          <div className="copilot-risks"><p className="copilot-context-label">{language === "en" ? "Main risks" : "Principaux risques"}</p><ul>{candidateContext.risks.map((risk) => <li key={risk}>{risk}</li>)}</ul></div>
        </section>

        <section className="section-card copilot-side-card">
          <div className="section-card__header"><h3>{copy.executionTitle}</h3><p>{copy.recentHistory}</p></div>
          {state.actionExecution.lastExecutionSummary ? <div className="copilot-empty-output"><strong>{state.actionExecution.lastExecutionSummary.action}</strong><p>{state.actionExecution.lastExecutionSummary.target}</p><p>{state.actionExecution.lastExecutionSummary.timestamp}</p><p><strong>{language === "en" ? "Next action" : "Prochaine action"}:</strong> {state.actionExecution.lastExecutionSummary.nextAction}</p></div> : <div className="copilot-empty-output"><p>{copy.executionEmpty}</p></div>}
          {state.actionExecution.actionHistory.length > 0 ? <ul className="artifact-list" aria-label={copy.recentHistory}>{state.actionExecution.actionHistory.slice(-3).reverse().map((entry) => <li key={entry.id}>{entry.timestamp} - {entry.action}</li>)}</ul> : null}
        </section>

        <section className="section-card copilot-side-card">
          <div className="section-card__header"><h3>{copy.responseTitle}</h3><p>{language === "en" ? "Action-specific recruiter artifact" : "Livrable recruteur spécifique à l’action"}</p></div>
          <p className="demo-disclaimer" style={{ marginBottom: "10px" }}>{copy.demoNotice}</p>
          {loading ? <div className="copilot-empty-output"><strong>{copy.loading}</strong><p>{language === "en" ? "Generating a structured output…" : "Génération d’une sortie structurée…"}</p></div> : renderDecisionOutput()}
          {responseIntent ? <p className="copilot-review-note">{latestResponse?.reviewNote}</p> : null}
        </section>
      </aside>

      {error ? <div className="toast" role="alert">{error}</div> : null}
      {modal ? <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="modal-card"><h4>{modal.title}</h4><p>{modal.description}</p><div className="modal-actions"><button type="button" className="btn btn--secondary" onClick={() => setModal(null)}>{language === "en" ? "Cancel" : "Annuler"}</button><button type="button" className="btn btn--primary" onClick={() => { setToast(modal.message); setModal(null); }}>{modal.confirmLabel}</button></div></div></div> : null}
      {toast ? <div className="toast" role="status">{toast}</div> : null}
    </div>
  );
}
