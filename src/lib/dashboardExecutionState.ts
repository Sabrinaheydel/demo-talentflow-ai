import type { BriefingAction, BriefingInsight, BriefingKpi, BriefingPacket } from "./dashboardBriefing";
import type { DemoExperienceState } from "./demoExperience";

export type DashboardExecutionLanguage = "en" | "fr";

export function isBriefingActionCompleted(actionId: string, state: DemoExperienceState): boolean {
  const maya = state.candidates["maya-chen"];
  const emma = state.candidates["emma-laurent"];
  const lucas = state.candidates["lucas-martin"];
  const noah = state.candidates["noah-williams"];

  if (actionId === "action-maya-offer" || actionId === "cover-maya-offer") {
    return Boolean(maya?.salaryAligned && maya?.priorityResolved);
  }

  if (actionId === "action-emma-feedback" || actionId === "cover-emma-feedback") {
    return Boolean(emma?.feedbackRequested);
  }

  if (actionId === "action-lucas-review" || actionId === "cover-lucas-feedback") {
    return Boolean(lucas?.feedbackRequested);
  }

  if (actionId === "action-noah-interview") {
    return Boolean(noah?.prepared);
  }

  return false;
}

export function getCompletedActionImpact(
  action: BriefingAction,
  state: DemoExperienceState,
  language: DashboardExecutionLanguage,
): string | null {
  if (!isBriefingActionCompleted(action.id, state)) return null;

  if (action.id === "action-maya-offer" || action.id === "cover-maya-offer") {
    return language === "en"
      ? "Salary aligned. Offer risk reduced."
      : "Salaire aligné. Risque d'offre réduit.";
  }

  if (action.id === "action-emma-feedback" || action.id === "cover-emma-feedback") {
    return language === "en"
      ? "Manager feedback request sent and deadline tracking activated."
      : "Demande de feedback manager envoyée et suivi d'échéance activé.";
  }

  if (action.id === "action-lucas-review" || action.id === "cover-lucas-feedback") {
    return language === "en"
      ? "Technical feedback follow-up sent and blocker tracking updated."
      : "Relance du feedback technique envoyée et suivi du blocage actualisé.";
  }

  if (action.id === "action-noah-interview") {
    return language === "en"
      ? "Culture interview preparation completed."
      : "Préparation de l'entretien culture terminée.";
  }

  return language === "en" ? "Action completed." : "Action traitée.";
}

function updateNumericKpi(
  kpi: BriefingKpi,
  value: number,
  language: DashboardExecutionLanguage,
  completeAtZero = true,
): BriefingKpi {
  const safeValue = Math.max(0, value);
  const isClear = completeAtZero && safeValue === 0;

  return {
    ...kpi,
    value: String(safeValue),
    delta: safeValue === 0 ? "0" : kpi.delta,
    status: isClear ? "on-track" : safeValue <= 1 ? "watch" : kpi.status,
    meaning: isClear
      ? language === "en"
        ? "No open item remains for this signal in the current demo state."
        : "Aucun élément ouvert ne reste pour ce signal dans l'état actuel de la démo."
      : kpi.meaning,
  };
}

function updateKpis(
  packet: BriefingPacket,
  state: DemoExperienceState,
  language: DashboardExecutionLanguage,
): BriefingKpi[] {
  const mayaDone = Boolean(state.candidates["maya-chen"]?.salaryAligned);
  const emmaDone = Boolean(state.candidates["emma-laurent"]?.feedbackRequested);
  const lucasDone = Boolean(state.candidates["lucas-martin"]?.feedbackRequested);

  return packet.kpis.map((kpi) => {
    if (kpi.id === "offers-risk") {
      return updateNumericKpi(kpi, 2 - (mayaDone ? 1 : 0), language, false);
    }

    if (kpi.id === "feedback-overdue") {
      return updateNumericKpi(kpi, 3 - (emmaDone ? 1 : 0) - (lucasDone ? 1 : 0), language, false);
    }

    if (kpi.id === "awaiting-decision") {
      return updateNumericKpi(kpi, 6 - (mayaDone ? 1 : 0), language, false);
    }

    if (kpi.id === "interviews-without-decision") {
      return updateNumericKpi(kpi, 4 - (mayaDone ? 1 : 0), language, false);
    }

    if (kpi.id === "cover-urgent-decisions") {
      return updateNumericKpi(kpi, 3 - (mayaDone ? 1 : 0) - (emmaDone ? 1 : 0), language);
    }

    if (kpi.id === "cover-feedback-overdue") {
      return updateNumericKpi(kpi, 2 - (emmaDone ? 1 : 0) - (lucasDone ? 1 : 0), language);
    }

    if (kpi.id === "cover-offers-risk") {
      return updateNumericKpi(kpi, 1 - (mayaDone ? 1 : 0), language);
    }

    return kpi;
  });
}

function updateInsights(
  packet: BriefingPacket,
  state: DemoExperienceState,
  language: DashboardExecutionLanguage,
): BriefingInsight[] {
  const mayaDone = Boolean(state.candidates["maya-chen"]?.salaryAligned);
  const emmaDone = Boolean(state.candidates["emma-laurent"]?.feedbackRequested);
  const lucasDone = Boolean(state.candidates["lucas-martin"]?.feedbackRequested);

  const remaining = packet.insights.filter((insight) => {
    if (mayaDone && (insight.id === "insight-maya" || insight.id === "cover-insight-offer")) return false;
    if (emmaDone && (insight.id === "insight-emma" || insight.id === "cover-insight-handoff")) return false;
    if (lucasDone && insight.id === "insight-lucas") return false;
    return true;
  });

  if (remaining.length > 0) return remaining;

  return [
    {
      id: "insight-priority-queue-clear",
      signal: language === "en" ? "Priority queue processed" : "File de priorités traitée",
      impact: language === "en"
        ? "The critical actions in this briefing have been executed in the demo state."
        : "Les actions critiques de ce briefing ont été exécutées dans l'état de la démo.",
      urgency: "low",
      recommendedAction: language === "en"
        ? "Continue monitoring replies, interviews and new decision signals."
        : "Continuer à suivre les réponses, les entretiens et les nouveaux signaux de décision.",
      suggestedOwner: "TalentFlow",
    },
  ];
}

function updateRisks(
  packet: BriefingPacket,
  state: DemoExperienceState,
  language: DashboardExecutionLanguage,
  allCompleted: boolean,
): string[] {
  if (allCompleted) {
    return [
      language === "en"
        ? "No critical action remains in this catch-up. Continue monitoring external replies and scheduled interviews."
        : "Aucune action critique ne reste dans ce rattrapage. Continuer à suivre les réponses externes et les entretiens planifiés.",
    ];
  }

  const mayaDone = Boolean(state.candidates["maya-chen"]?.salaryAligned);
  const emmaDone = Boolean(state.candidates["emma-laurent"]?.feedbackRequested);
  const lucasDone = Boolean(state.candidates["lucas-martin"]?.feedbackRequested);

  return packet.risks.filter((risk) => {
    const normalized = risk.toLowerCase();
    if (mayaDone && (normalized.includes("maya") || normalized.includes("salary") || normalized.includes("salarial"))) return false;
    if (emmaDone && normalized.includes("emma")) return false;
    if (lucasDone && normalized.includes("lucas")) return false;
    return true;
  });
}

function buildStateChanges(
  state: DemoExperienceState,
  language: DashboardExecutionLanguage,
  completedCount: number,
  totalCount: number,
): string[] {
  const changes = [
    language === "en"
      ? `${completedCount} of ${totalCount} priority actions processed in the current demo state.`
      : `${completedCount} action(s) prioritaire(s) sur ${totalCount} traitée(s) dans l'état actuel de la démo.`,
  ];

  if (state.candidates["maya-chen"]?.salaryAligned) {
    changes.push(language === "en" ? "Maya salary alignment is complete." : "L'alignement salarial de Maya est terminé.");
  }
  if (state.candidates["emma-laurent"]?.feedbackRequested) {
    changes.push(language === "en" ? "Emma manager feedback follow-up is now tracked." : "La relance du feedback manager d'Emma est maintenant suivie.");
  }
  if (state.candidates["lucas-martin"]?.feedbackRequested) {
    changes.push(language === "en" ? "Lucas technical feedback follow-up has been sent." : "La relance du feedback technique de Lucas a été envoyée.");
  }
  if (state.candidates["noah-williams"]?.prepared) {
    changes.push(language === "en" ? "Noah interview preparation is complete." : "La préparation de l'entretien de Noah est terminée.");
  }

  return changes.slice(0, 4);
}

export function applyDashboardExecutionState(
  packet: BriefingPacket,
  state: DemoExperienceState,
  language: DashboardExecutionLanguage,
): BriefingPacket {
  if (packet.recommendedActions.length === 0) return packet;

  const completedActions = packet.recommendedActions.filter((action) => isBriefingActionCompleted(action.id, state));
  if (completedActions.length === 0) return packet;

  const pendingActions = packet.recommendedActions.filter((action) => !isBriefingActionCompleted(action.id, state));
  const allCompleted = pendingActions.length === 0;
  const completedCount = completedActions.length;
  const totalCount = packet.recommendedActions.length;
  const nextAction = pendingActions[0];

  const priorityOne = allCompleted
    ? {
        id: "all-priorities-processed",
        candidateId: "",
        title: language === "en" ? "Priority queue processed" : "File de priorités traitée",
        whyNow: language === "en"
          ? [
              `${completedCount} of ${totalCount} priority actions are completed.`,
              "Critical blockers have been reduced in the shared demo state.",
              "The dashboard is now synchronized with the executed actions.",
            ]
          : [
              `${completedCount} actions prioritaires sur ${totalCount} sont terminées.`,
              "Les blocages critiques ont été réduits dans l'état partagé de la démo.",
              "Le dashboard est maintenant synchronisé avec les actions exécutées.",
            ],
        recommendedAction: language === "en"
          ? "Continue with interview, feedback and decision monitoring."
          : "Continuer avec le suivi des entretiens, feedbacks et décisions.",
        deadline: language === "en" ? "Ongoing monitoring" : "Suivi continu",
        owner: "TalentFlow",
      }
    : {
        id: nextAction.id,
        candidateId: nextAction.candidate.toLowerCase().replace(/\s+/g, "-"),
        title: nextAction.title,
        whyNow: [
          nextAction.impact,
          language === "en"
            ? `${completedCount} of ${totalCount} priority actions are already processed.`
            : `${completedCount} actions prioritaires sur ${totalCount} sont déjà traitées.`,
        ],
        recommendedAction: nextAction.title,
        deadline: nextAction.deadline,
        owner: nextAction.owner,
      };

  return {
    ...packet,
    summary: allCompleted
      ? language === "en"
        ? `All ${totalCount} priority actions in this briefing are processed. The operational state has been synchronized.`
        : `Les ${totalCount} actions prioritaires de ce briefing sont traitées. L'état opérationnel a été synchronisé.`
      : language === "en"
        ? `${completedCount} of ${totalCount} priority actions processed. ${pendingActions.length} remain open.`
        : `${completedCount} actions prioritaires sur ${totalCount} traitées. ${pendingActions.length} restent ouvertes.`,
    keyChanges: buildStateChanges(state, language, completedCount, totalCount),
    risks: updateRisks(packet, state, language, allCompleted),
    priorityOne,
    recommendedActions: packet.recommendedActions.map((action) => ({
      ...action,
      impact: getCompletedActionImpact(action, state, language) ?? action.impact,
    })),
    estimatedCatchUpTime: allCompleted
      ? language === "en" ? "Priority queue synchronized" : "File de priorités synchronisée"
      : packet.estimatedCatchUpTime,
    estimatedCatchUpMinutes: allCompleted ? 0 : packet.estimatedCatchUpMinutes,
    primaryCta: allCompleted
      ? language === "en" ? "Priority actions processed" : "Actions prioritaires traitées"
      : packet.primaryCta,
    kpis: updateKpis(packet, state, language),
    insights: updateInsights(packet, state, language),
  };
}
