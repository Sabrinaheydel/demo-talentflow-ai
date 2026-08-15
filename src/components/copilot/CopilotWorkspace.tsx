"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "../ui/Badge";
import { Icon } from "../ui/Icon";
import {
  canonicalCandidates,
  getCanonicalCandidateById,
  type CanonicalCandidateProfile,
} from "../../lib/demoData";
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
      role: string;
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

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function clampScore(value: number) {
  return Math.max(70, Math.min(99, Math.round(value)));
}

function candidateEmail(candidate: CanonicalCandidateProfile) {
  return `${normalizeText(candidate.name).replace(/[^a-z0-9]+/g, ".")}@example.com`;
}

function findMentionedCandidates(message: string) {
  const normalized = normalizeText(message);
  const byName = canonicalCandidates.filter((candidate) => {
    const fullName = normalizeText(candidate.name);
    const [firstName, lastName] = fullName.split(" ");
    return normalized.includes(fullName)
      || Boolean(firstName && new RegExp(`\\b${firstName}\\b`).test(normalized))
      || Boolean(lastName && new RegExp(`\\b${lastName}\\b`).test(normalized));
  });

  if (byName.length > 0) return byName;

  const scoreCandidate = canonicalCandidates.find((candidate) =>
    new RegExp(`\\b${candidate.match}\\s*%?\\b`).test(normalized),
  );

  return scoreCandidate ? [scoreCandidate] : [];
}

function detectFreeformIntent(message: string): IntentKey {
  const normalized = normalizeText(message);

  if (/(match|score|scoring|note|calcul|calcule|obtenu|resultat|pourquoi.*%|how.*match|pourquoi.*match)/.test(normalized)) return "match";
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

function getInitialMessages(language: Language, candidate: CanonicalCandidateProfile): Message[] {
  return [
    {
      id: 1,
      author: "ai",
      text: language === "en"
        ? `I’ve loaded ${candidate.name}’s profile. Ask me about fit, risks, strengths, interview preparation, compensation, timing or next steps. You can also mention another demo candidate by name.`
        : `J’ai chargé le profil de ${candidate.name}. Vous pouvez m’interroger sur l’adéquation, les risques, les forces, la préparation d’entretien, la rémunération, le timing ou les prochaines étapes. Vous pouvez aussi citer un autre candidat de la démo par son nom.`,
    },
    {
      id: 2,
      author: "user",
      text: language === "en"
        ? `Summarize the strongest evidence for ${candidate.name}.`
        : `Résumez les meilleurs éléments pour ${candidate.name}.`,
    },
  ];
}

function getStrengthBullets(candidate: CanonicalCandidateProfile, language: Language) {
  const topFocus = candidate.focusAreas.slice(0, 3);
  const scorecardAverage = Math.round(
    (candidate.scorecard.communication
      + candidate.scorecard.roleExpertise
      + candidate.scorecard.problemSolving
      + candidate.scorecard.collaboration
      + candidate.scorecard.cultureFit) / 5,
  );

  return language === "en"
    ? [
        `${candidate.match}% simulated role match for the portfolio demo.`,
        `Strongest focus signals: ${topFocus.join(", ")}.`,
        `Average visible scorecard signal: ${scorecardAverage}/5.`,
        candidate.notes.en,
      ]
    : [
        `${candidate.match} % de match rôle simulé pour la démo portfolio.`,
        `Signaux de focus principaux : ${topFocus.join(", ")}.`,
        `Signal moyen visible de la scorecard : ${scorecardAverage}/5.`,
        candidate.notes.fr,
      ];
}

function getMatchFactors(candidate: CanonicalCandidateProfile, language: Language) {
  const collaborationSignal = clampScore(
    ((candidate.scorecard.communication + candidate.scorecard.collaboration) / 10) * 100,
  );
  const panelSignal = clampScore(
    ((candidate.scorecard.communication
      + candidate.scorecard.roleExpertise
      + candidate.scorecard.problemSolving
      + candidate.scorecard.collaboration
      + candidate.scorecard.cultureFit) / 25) * 100,
  );
  const skillsSignal = clampScore(candidate.match + 2);
  const contextSignal = clampScore(candidate.match - 2);

  if (language === "en") {
    return [
      { label: "Skills & role alignment", score: `${skillsSignal}%`, explanation: `Built from visible focus areas for the ${candidate.role} demo profile.` },
      { label: "Leadership & collaboration", score: `${collaborationSignal}%`, explanation: "Derived from the visible communication and collaboration scorecard signals." },
      { label: "Panel evidence", score: `${panelSignal}%`, explanation: "Summarizes the five visible scorecard dimensions in the demo dataset." },
      { label: "Context & experience", score: `${contextSignal}%`, explanation: candidate.risks[0] ? `Reduced by the visible watchout: ${candidate.risks[0]}.` : "No major context penalty is recorded in the demo dataset." },
    ];
  }

  return [
    { label: "Compétences & rôle", score: `${skillsSignal}%`, explanation: `Construit à partir des domaines de focus visibles du profil de démo ${candidate.role}.` },
    { label: "Leadership & collaboration", score: `${collaborationSignal}%`, explanation: "Dérivé des signaux visibles de communication et de collaboration dans la scorecard." },
    { label: "Retours panel", score: `${panelSignal}%`, explanation: "Synthétise les cinq dimensions visibles de la scorecard dans les données de démo." },
    { label: "Contexte & expérience", score: `${contextSignal}%`, explanation: candidate.risks[0] ? `Réduit par le point de vigilance visible : ${candidate.risks[0]}.` : "Aucune pénalité de contexte majeure n’est enregistrée dans les données de démo." },
  ];
}

function buildSimulatedResponse(
  intent: IntentKey,
  language: Language,
  candidate: CanonicalCandidateProfile,
  comparisonCandidates: CanonicalCandidateProfile[] = canonicalCandidates,
): CopilotResponse {
  const reviewNote = language === "en"
    ? "Demo mode — responses and scores are simulated from the visible demo dataset, not produced by a live AI model."
    : "Mode démo — les réponses et scores sont simulés à partir des données visibles de la démo, pas produits par un modèle IA en direct.";

  if (intent === "match") {
    return {
      intent,
      title: language === "en" ? "Role match explainability" : "Explicabilité du match rôle",
      brief: language === "en"
        ? `${candidate.name} has a simulated ${candidate.match}% role match. The score is decomposed into four visible signal groups for explainability.`
        : `${candidate.name} a un match rôle simulé de ${candidate.match} %. Le score est décomposé en quatre groupes de signaux visibles pour l’explicabilité.`,
      confidenceScore: candidate.match,
      reviewNote,
      explainability: {
        label: language === "en" ? "Simulated role match" : "Match rôle simulé",
        score: `${candidate.match}%`,
        note: language === "en"
          ? "This is a deterministic portfolio-demo score, not a production ML prediction."
          : "Il s’agit d’un score déterministe pour la démo portfolio, pas d’une prédiction ML de production.",
        factors: getMatchFactors(candidate, language),
      },
    };
  }

  if (intent === "strengths") {
    return {
      intent,
      title: language === "en" ? `${candidate.name} — strengths` : `${candidate.name} — points forts`,
      brief: language === "en"
        ? `${candidate.name} shows the strongest evidence around ${candidate.focusAreas.slice(0, 2).join(" and ")}.`
        : `${candidate.name} présente les signaux les plus convaincants autour de ${candidate.focusAreas.slice(0, 2).join(" et ")}.`,
      confidenceScore: clampScore(candidate.match - 2),
      reviewNote,
      insight: {
        heading: language === "en" ? "Strongest evidence" : "Éléments les plus convaincants",
        bullets: getStrengthBullets(candidate, language),
        recommendation: candidate.recommendation[language],
      },
    };
  }

  if (intent === "compensation") {
    const compensationRisk = candidate.risks.find((risk) => /(salary|compensation|remuneration|salaire)/.test(normalizeText(risk)));
    return {
      intent,
      title: language === "en" ? `${candidate.name} — compensation signal` : `${candidate.name} — signal rémunération`,
      brief: compensationRisk
        ? language === "en"
          ? `A compensation-related watchout is recorded for ${candidate.name}: ${compensationRisk}.`
          : `Un point de vigilance lié à la rémunération est enregistré pour ${candidate.name} : ${compensationRisk}.`
        : language === "en"
          ? `No compensation-specific risk is recorded for ${candidate.name} in the demo dataset.`
          : `Aucun risque spécifique de rémunération n’est enregistré pour ${candidate.name} dans les données de démo.`,
      confidenceScore: 100,
      reviewNote,
      insight: {
        heading: language === "en" ? "What the demo data supports" : "Ce que les données de démo permettent d’affirmer",
        bullets: compensationRisk
          ? language === "en"
            ? [compensationRisk, "No accepted or rejected package is recorded in the demo data.", "The demo does not invent a salary amount or package range."]
            : [compensationRisk, "Aucun package accepté ou refusé n’est enregistré dans les données de démo.", "La démo n’invente ni montant de salaire ni fourchette de package."]
          : language === "en"
            ? ["No compensation-specific watchout is recorded.", "No accepted or rejected package is recorded.", "A recruiter should validate compensation before relying on it for a decision."]
            : ["Aucun point de vigilance spécifique de rémunération n’est enregistré.", "Aucun package accepté ou refusé n’est enregistré.", "Un recruteur doit valider la rémunération avant de l’utiliser dans une décision."],
        recommendation: language === "en"
          ? "Validate compensation directly before the final offer decision."
          : "Valider directement la rémunération avant la décision finale d’offre.",
      },
    };
  }

  if (intent === "timing") {
    const timingRisk = candidate.risks.find((risk) => /(timing|start|availability|notice|date|disponibilite|preavis|demarrage)/.test(normalizeText(risk)));
    return {
      intent,
      title: language === "en" ? `${candidate.name} — availability & timing` : `${candidate.name} — disponibilité & timing`,
      brief: timingRisk
        ? language === "en"
          ? `A timing-related watchout is recorded for ${candidate.name}: ${timingRisk}.`
          : `Un point de vigilance lié au timing est enregistré pour ${candidate.name} : ${timingRisk}.`
        : language === "en"
          ? `No specific start-date risk is recorded for ${candidate.name} in the demo dataset.`
          : `Aucun risque spécifique de date de démarrage n’est enregistré pour ${candidate.name} dans les données de démo.`,
      confidenceScore: 100,
      reviewNote,
      insight: {
        heading: language === "en" ? "Timing signal" : "Signal timing",
        bullets: language === "en"
          ? [timingRisk ?? "No explicit timing watchout is recorded.", `Current demo stage: ${candidate.stage}.`, `Scheduled interview window: ${candidate.interviewDate}, ${candidate.interviewTime}.`]
          : [timingRisk ?? "Aucun point de vigilance timing explicite n’est enregistré.", `Étape actuelle de démo : ${candidate.stage}.`, `Fenêtre d’entretien prévue : ${candidate.interviewDate}, ${candidate.interviewTime}.`],
        recommendation: language === "en"
          ? "Confirm real availability during the next recruiter touchpoint."
          : "Confirmer la disponibilité réelle au prochain échange recruteur.",
      },
    };
  }

  if (intent === "summarize") {
    const strengths = getStrengthBullets(candidate, language).slice(0, 3);
    const watchouts = candidate.risks.length > 0
      ? candidate.risks.slice(0, 3)
      : [language === "en" ? "No major watchout recorded in the demo data." : "Aucun point de vigilance majeur enregistré dans les données de démo."];
    return {
      intent,
      title: language === "en" ? `${candidate.name} — executive briefing` : `${candidate.name} — briefing exécutif`,
      brief: language === "en"
        ? `${candidate.name} is currently at ${candidate.stage} with a simulated ${candidate.match}% role match and ${candidate.probability}% hiring probability.`
        : `${candidate.name} est actuellement à l’étape ${candidate.stage}, avec un match rôle simulé de ${candidate.match} % et une probabilité d’embauche de ${candidate.probability} %.`,
      confidenceScore: clampScore(candidate.match - 3),
      reviewNote,
      executiveSummary: {
        decision: candidate.recommendation[language],
        strengths,
        watchouts,
        recommendation: candidate.notes[language],
      },
    };
  }

  if (intent === "compare") {
    const rows = comparisonCandidates
      .slice()
      .sort((a, b) => b.match - a.match)
      .map((item) => ({
        candidate: item.name,
        role: item.role,
        stage: item.stage,
        match: `${item.match}%`,
        probability: `${item.probability}%`,
        differentiator: item.focusAreas[0] ?? (language === "en" ? "Role fit" : "Adéquation au poste"),
        riskLevel: (item.priority === "High" ? "medium" : "low") as Severity,
      }));
    const names = rows.map((row) => row.candidate).join(", ");
    return {
      intent,
      title: language === "en" ? "Candidate comparison" : "Comparaison candidats",
      brief: language === "en"
        ? `Comparison generated for ${names}. These demo candidates target different roles, so the scores should be read as profile-specific signals rather than a single-role ranking.`
        : `Comparaison générée pour ${names}. Ces candidats de démo ciblent des rôles différents : les scores doivent donc être lus comme des signaux propres à chaque profil, pas comme un classement sur un même poste.`,
      confidenceScore: 100,
      reviewNote,
      candidateComparison: {
        benchmarkRole: language === "en" ? "Profile-specific demo signals" : "Signaux de démo propres à chaque profil",
        rows,
        recommendation: language === "en"
          ? "Use the comparison to inspect signal quality, stage and risk profile, not to rank candidates across different jobs."
          : "Utiliser la comparaison pour examiner la qualité des signaux, l’étape et le profil de risque, pas pour classer des candidats sur des métiers différents.",
      },
    };
  }

  if (intent === "questions") {
    const questions = candidate.questions.slice(0, 3);
    const sections = questions.map((question, index) => ({
      theme: candidate.focusAreas[index] ?? (language === "en" ? "Role validation" : "Validation du rôle"),
      question,
      listenFor: language === "en"
        ? `Evidence tied to ${candidate.focusAreas[index] ?? candidate.focusAreas[0] ?? "role readiness"}.`
        : `Des preuves liées à ${candidate.focusAreas[index] ?? candidate.focusAreas[0] ?? "la préparation au rôle"}.`,
      redFlag: language === "en"
        ? "Generic answer without a concrete example, ownership or measurable outcome."
        : "Réponse générique sans exemple concret, ownership ni résultat mesurable.",
    }));
    return {
      intent,
      title: language === "en" ? `${candidate.name} — interview guide` : `${candidate.name} — guide d’entretien`,
      brief: language === "en"
        ? `Interview guide based on the visible focus areas and questions for ${candidate.name}.`
        : `Guide d’entretien basé sur les domaines de focus et les questions visibles pour ${candidate.name}.`,
      confidenceScore: 100,
      reviewNote,
      interviewGuide: {
        objective: language === "en"
          ? `Validate the remaining role-fit and risk signals for ${candidate.name}.`
          : `Valider les derniers signaux d’adéquation au rôle et de risque pour ${candidate.name}.`,
        opener: language === "en"
          ? `Thanks ${candidate.name.split(" ")[0]}, we’ll focus on the key signals still needed for the ${candidate.role} decision.`
          : `Merci ${candidate.name.split(" ")[0]}, nous allons cibler les signaux clés encore nécessaires pour la décision ${candidate.role}.`,
        sections,
        close: language === "en"
          ? "Close by confirming remaining questions, timing and ownership for the next decision step."
          : "Clore en confirmant les questions restantes, le timing et le responsable de la prochaine étape de décision.",
      },
    };
  }

  if (intent === "email") {
    const firstName = candidate.name.split(" ")[0];
    return {
      intent,
      title: language === "en" ? `${candidate.name} — suggested recruiter email` : `${candidate.name} — email recruteur suggéré`,
      brief: language === "en"
        ? `Draft aligned with ${candidate.name}’s current demo stage.`
        : `Brouillon aligné sur l’étape actuelle de démo de ${candidate.name}.`,
      confidenceScore: 100,
      reviewNote,
      suggestedEmail: {
        to: candidateEmail(candidate),
        subject: language === "en"
          ? `Next step for the ${candidate.role} process`
          : `Prochaine étape du process ${candidate.role}`,
        body: language === "en"
          ? [
              `Hi ${firstName},`,
              "Thank you again for your conversations with the team.",
              `We would like to continue the ${candidate.role} process and align on the next step after ${candidate.stage}.`,
              "Could you share your availability for the next discussion?",
              "Best regards,",
              `${candidate.recruiters[0] ?? "Talent Acquisition"}`,
            ]
          : [
              `Bonjour ${firstName},`,
              "Merci encore pour vos échanges avec l’équipe.",
              `Nous souhaitons poursuivre le process ${candidate.role} et aligner la prochaine étape après ${candidate.stage}.`,
              "Pouvez-vous partager vos disponibilités pour le prochain échange ?",
              "Bien à vous,",
              `${candidate.recruiters[0] ?? "Talent Acquisition"}`,
            ],
        tone: language === "en" ? "Warm, direct, decision-oriented" : "Chaleureux, direct, orienté décision",
      },
    };
  }

  if (intent === "risks") {
    const riskItems = (candidate.risks.length > 0 ? candidate.risks : [language === "en" ? "No major risk recorded" : "Aucun risque majeur enregistré"])
      .slice(0, 3)
      .map((risk, index) => ({
        title: risk,
        severity: (index === 0 && candidate.priority === "High" ? "high" : "medium") as Severity,
        impact: language === "en"
          ? "This signal could slow or weaken the decision if it is not explicitly validated."
          : "Ce signal peut ralentir ou fragiliser la décision s’il n’est pas validé explicitement.",
        mitigation: language === "en"
          ? "Validate the point in the next recruiter or hiring-manager touchpoint and record the outcome."
          : "Valider ce point au prochain échange recruteur ou hiring manager et consigner le résultat.",
        owner: candidate.recruiters[0] ?? "Recruiter",
      }));
    return {
      intent,
      title: language === "en" ? `${candidate.name} — hiring risk assessment` : `${candidate.name} — évaluation des risques d’embauche`,
      brief: language === "en"
        ? `${candidate.name} has ${candidate.risks.length} explicit risk signal${candidate.risks.length === 1 ? "" : "s"} in the visible demo dataset.`
        : `${candidate.name} présente ${candidate.risks.length} signal${candidate.risks.length > 1 ? "aux" : ""} de risque explicite${candidate.risks.length > 1 ? "s" : ""} dans les données visibles de la démo.`,
      confidenceScore: 100,
      reviewNote,
      hiringRiskAssessment: {
        overallRisk: candidate.priority === "High" ? "medium" : "low",
        summary: candidate.notes[language],
        items: riskItems,
      },
    };
  }

  if (intent === "action") {
    const recruiter = candidate.recruiters[0] ?? "Recruiter";
    return {
      intent,
      title: language === "en" ? `${candidate.name} — next best action` : `${candidate.name} — prochaine meilleure action`,
      brief: language === "en"
        ? `Next actions are based on ${candidate.name}’s stage (${candidate.stage}), interview status and visible risk signals.`
        : `Les prochaines actions sont basées sur l’étape de ${candidate.name} (${candidate.stage}), son statut d’entretien et les signaux de risque visibles.`,
      confidenceScore: 100,
      reviewNote,
      nextBestAction: {
        decision: candidate.recommendation[language],
        timeline: [
          {
            owner: recruiter,
            deadline: language === "en" ? "Next recruiter touchpoint" : "Prochain échange recruteur",
            action: language === "en"
              ? `Validate the highest-priority watchout for ${candidate.name}.`
              : `Valider le point de vigilance prioritaire pour ${candidate.name}.`,
            expectedOutcome: language === "en" ? "Reduce decision uncertainty." : "Réduire l’incertitude de décision.",
          },
          {
            owner: candidate.recruiters[1] ?? "Hiring Manager",
            deadline: `${candidate.interviewDate}, ${candidate.interviewTime}`,
            action: language === "en"
              ? `Run or prepare the ${candidate.stage} step with the visible focus areas.`
              : `Mener ou préparer l’étape ${candidate.stage} avec les domaines de focus visibles.`,
            expectedOutcome: language === "en" ? "Close the remaining signal gap." : "Clore le dernier écart de signal.",
          },
          {
            owner: recruiter,
            deadline: language === "en" ? "After the next interview" : "Après le prochain entretien",
            action: language === "en" ? "Update the decision brief and recommendation." : "Mettre à jour le brief de décision et la recommandation.",
            expectedOutcome: language === "en" ? "Keep the process decision-ready." : "Maintenir le process prêt pour la décision.",
          },
        ],
      },
    };
  }

  return {
    intent: "unknown",
    title: language === "en" ? "Demo scope" : "Périmètre de la démo",
    brief: language === "en"
      ? `I don’t have enough structured demo data to answer that precisely for ${candidate.name} without inventing information.`
      : `Je n’ai pas assez de données structurées dans cette démo pour répondre précisément à cette question sur ${candidate.name} sans inventer d’information.`,
    confidenceScore: 100,
    reviewNote,
    insight: {
      heading: language === "en" ? "What I can answer reliably" : "Ce à quoi je peux répondre de façon fiable",
      bullets: language === "en"
        ? ["Role match and score explainability.", "Strengths, risks, compensation and timing signals.", "Interview preparation and recruiter email.", "Candidate comparison and next-best-action planning."]
        : ["Le match rôle et l’explicabilité du score.", "Les forces, risques, signaux de rémunération et de timing.", "La préparation d’entretien et l’email recruteur.", "La comparaison candidats et le plan de prochaine action."],
      recommendation: language === "en"
        ? "Ask within one of these areas, or mention Maya, Lucas, Emma or Noah by name."
        : "Posez une question dans l’un de ces domaines, ou citez Maya, Lucas, Emma ou Noah par leur nom.",
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

function getConversationReply(response: CopilotResponse, language: Language, candidate: CanonicalCandidateProfile) {
  if (response.intent === "match" && response.explainability) {
    const strongest = response.explainability.factors[0];
    return language === "en"
      ? `${candidate.name} has a simulated ${response.explainability.score} role match. The strongest visible factor is ${strongest.label.toLowerCase()} at ${strongest.score}. I’ve decomposed the score in the decision panel.`
      : `${candidate.name} a un match rôle simulé de ${response.explainability.score}. Le facteur visible le plus fort est ${strongest.label.toLowerCase()} à ${strongest.score}. J’ai décomposé le score dans le panneau de décision.`;
  }
  if (response.intent === "risks" && response.hiringRiskAssessment) {
    const titles = response.hiringRiskAssessment.items.map((item) => item.title).join(", ");
    return language === "en"
      ? `For ${candidate.name}, the visible risk signals are: ${titles}. I’ve added impact and mitigation in the decision panel.`
      : `Pour ${candidate.name}, les signaux de risque visibles sont : ${titles}. J’ai ajouté l’impact et la mitigation dans le panneau de décision.`;
  }
  if (response.intent === "strengths" && response.insight) {
    return language === "en"
      ? `${candidate.name}’s strongest visible signals are ${candidate.focusAreas.slice(0, 3).join(", ")}. I’ve summarized the supporting evidence in the decision panel.`
      : `Les signaux visibles les plus forts de ${candidate.name} sont ${candidate.focusAreas.slice(0, 3).join(", ")}. J’ai résumé les éléments de preuve dans le panneau de décision.`;
  }
  if (response.intent === "compensation" || response.intent === "timing" || response.intent === "unknown") {
    return response.brief;
  }
  return language === "en"
    ? `${response.brief} I’ve also prepared the structured detail in the decision panel.`
    : `${response.brief} J’ai également préparé le détail structuré dans le panneau de décision.`;
}

export function CopilotWorkspace({
  language,
  initialContext,
}: {
  language: Language;
  initialContext?: { candidateId?: string; mode?: string; context?: string };
}) {
  const { state } = useDemoExperience();
  const initialCandidate = getCanonicalCandidateById(initialContext?.candidateId ?? "maya-chen");
  const [activeCandidateId, setActiveCandidateId] = useState(initialCandidate.id);
  const activeCandidate = useMemo(() => getCanonicalCandidateById(activeCandidateId), [activeCandidateId]);
  const [messages, setMessages] = useState<Message[]>(() => getInitialMessages(language, initialCandidate));
  const [draft, setDraft] = useState(() => {
    if (initialContext?.mode === "interview-prep") {
      return language === "en"
        ? `Prepare ${initialCandidate.name} for the next interview.`
        : `Préparer ${initialCandidate.name} pour le prochain entretien.`;
    }
    if (initialContext?.mode === "follow-up") {
      return language === "en"
        ? `Ask a follow-up question about ${initialCandidate.name}.`
        : `Poser une question de suivi sur ${initialCandidate.name}.`;
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
    if (!initialContext?.candidateId) return;
    const nextCandidate = getCanonicalCandidateById(initialContext.candidateId);
    setActiveCandidateId(nextCandidate.id);
  }, [initialContext?.candidateId]);

  useEffect(() => {
    if (initialContext?.context === "team") {
      setToast(language === "en" ? "Team context loaded for recruiter coordination." : "Contexte équipe chargé pour la coordination recruteur.");
      return;
    }
    if (initialContext?.mode === "interview-prep") {
      setToast(language === "en"
        ? `Interview-preparation context loaded for ${activeCandidate.name}.`
        : `Contexte de préparation d’entretien chargé pour ${activeCandidate.name}.`);
    }
  }, [activeCandidate.name, initialContext?.context, initialContext?.mode, language]);

  useEffect(() => {
    setMessages(getInitialMessages(language, activeCandidate));
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
        benchmarkRole: "Comparison basis",
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
        benchmarkRole: "Base de comparaison",
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

    const mentionedCandidates = findMentionedCandidates(message);
    const targetCandidate = mentionedCandidates[0] ?? activeCandidate;
    if (mentionedCandidates.length === 1 && targetCandidate.id !== activeCandidate.id) {
      setActiveCandidateId(targetCandidate.id);
    }

    const selectedIntent = forcedIntent ?? detectFreeformIntent(message);
    const comparisonCandidates = selectedIntent === "compare" && mentionedCandidates.length >= 2
      ? mentionedCandidates
      : canonicalCandidates;
    const parsed = buildSimulatedResponse(selectedIntent, language, targetCandidate, comparisonCandidates);
    setLatestResponse(parsed);
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, author: "ai", text: getConversationReply(parsed, language, targetCandidate) },
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
          <div className="artifact-header"><h4>{latestResponse.title}</h4><span className="artifact-confidence">{latestResponse.explainability.score}</span></div>
          <p className="artifact-brief">{latestResponse.brief}</p>
          <div className="artifact-callout">{latestResponse.explainability.label}: {latestResponse.explainability.score}</div>
          <div className="risk-list">{latestResponse.explainability.factors.map((factor) => <article key={factor.label} className="risk-card"><div className="risk-card__top"><strong>{factor.label}</strong><span className="artifact-confidence">{factor.score}</span></div><p>{factor.explanation}</p></article>)}</div>
          <p className="artifact-footer">{latestResponse.explainability.note}</p>
        </div>
      );
    }

    if (latestResponse.insight) {
      return (
        <div className="copilot-artifact copilot-artifact--summary">
          <div className="artifact-header"><h4>{latestResponse.title}</h4><span className="artifact-confidence">{copy.confidence}: {latestResponse.confidenceScore}%</span></div>
          <p className="artifact-brief">{latestResponse.brief}</p>
          <div className="artifact-block"><p className="copilot-context-label">{latestResponse.insight.heading}</p><ul className="artifact-list">{latestResponse.insight.bullets.map((item) => <li key={item}>{item}</li>)}</ul></div>
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
          <div className="comparison-table-wrap"><table className="comparison-table"><thead><tr><th>{language === "en" ? "Candidate" : "Candidat"}</th><th>{language === "en" ? "Role" : "Rôle"}</th><th>{language === "en" ? "Stage" : "Étape"}</th><th>Match</th><th>{language === "en" ? "Probability" : "Probabilité"}</th><th>{language === "en" ? "Differentiator" : "Différenciateur"}</th><th>{copy.risk}</th></tr></thead><tbody>
            {latestResponse.candidateComparison.rows.map((row) => <tr key={row.candidate}><td>{row.candidate}</td><td>{row.role}</td><td>{row.stage}</td><td>{row.match}</td><td>{row.probability}</td><td>{row.differentiator}</td><td><span className={`severity-pill severity-pill--${row.riskLevel}`}>{getSeverityLabel(row.riskLevel, language)}</span></td></tr>)}
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
            <button type="button" className="btn btn--secondary" onClick={() => { setMessages(getInitialMessages(language, activeCandidate)); setLatestResponse(null); setDraft(""); setError(null); setToast(language === "en" ? "Conversation reset" : "Conversation réinitialisée"); }}>{copy.reset}</button>
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
          <div className="section-card__header"><h3>{copy.context}</h3><p>{activeCandidate.role}</p></div>
          <div className="copilot-context-grid">
            <div><p className="copilot-context-label">{language === "en" ? "Selected candidate" : "Candidat sélectionné"}</p><strong>{activeCandidate.name}</strong></div>
            <div><p className="copilot-context-label">{language === "en" ? "AI match" : "Match IA"}</p><strong>{activeCandidate.match}%</strong></div>
            <div><p className="copilot-context-label">{language === "en" ? "Hiring probability" : "Probabilité d’embauche"}</p><strong>{activeCandidate.probability}%</strong></div>
            <div><p className="copilot-context-label">{language === "en" ? "Current stage" : "Étape actuelle"}</p><strong>{activeCandidate.stage}</strong></div>
          </div>
          <div className="copilot-pill-list">{activeCandidate.focusAreas.map((skill) => <Badge key={skill} label={skill} tone="primary" />)}</div>
          <div className="copilot-risks"><p className="copilot-context-label">{language === "en" ? "Main risks" : "Principaux risques"}</p><ul>{activeCandidate.risks.map((risk) => <li key={risk}>{risk}</li>)}</ul></div>
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
