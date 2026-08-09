export type ExecutionLanguage = "en" | "fr";

export type ActionRiskLevel = "low" | "medium" | "high";
export type ConfirmationLevel = "none" | "lightweight" | "full";
export type ActionChannel = "inApp" | "email" | "copilot" | "workflow";
export type ExecutionStatus = "idle" | "previewed" | "confirmed" | "executing" | "completed" | "failed";

export type ActionId =
  | "validate-maya-salary"
  | "request-emma-feedback"
  | "reassign-candidate"
  | "mark-candidate-prepared";

export type ActionScreen = "dashboard" | "pipeline" | "candidate-profile" | "interviews" | "team" | "copilot";

export type ActionMessage = {
  recipient: string;
  channel: ActionChannel;
  sender: string;
  subject?: string;
  body: string[];
};

export type ActionStateTransition = {
  label: string;
  before: string;
  after: string;
};

export type ActionEffect = {
  label: string;
  detail: string;
};

export type ActionDefinition = {
  id: ActionId;
  title: string;
  description: string;
  target: string;
  targetId: string;
  owner: string;
  recipient: string;
  channel: ActionChannel;
  riskLevel: ActionRiskLevel;
  confirmationLevel: ConfirmationLevel;
  messagePreview?: ActionMessage;
  stateTransitions: ActionStateTransition[];
  affectedScreens: ActionScreen[];
  kpiChanges: string[];
  priorityChanges: string[];
  expectedImpact: string[];
  recommendedNextAction: string;
  status: ExecutionStatus;
};

export type ActionPreview = {
  actionId: ActionId;
  action: string;
  target: string;
  owner: string;
  recipient: string;
  channel: ActionChannel;
  messagePreview?: ActionMessage;
  currentState: ActionStateTransition[];
  stateAfterExecution: ActionStateTransition[];
  affectedScreens: ActionScreen[];
  kpiChanges: string[];
  priorityChanges: string[];
  expectedImpact: string[];
  confirmationLevel: ConfirmationLevel;
  confirmationCta: string;
};

export type ActionResult = {
  actionId: ActionId;
  action: string;
  completedItems: string[];
  notified: string;
  updatedState: ActionStateTransition[];
  affectedScreens: ActionScreen[];
  kpiChanges: string[];
  priorityChanges: string[];
  recommendedNextAction: string;
};

export type ActionHistoryEntry = {
  id: string;
  actionId: ActionId;
  action: string;
  target: string;
  owner: string;
  timestamp: string;
  before: string[];
  after: string[];
  result: string;
};

export type ExecutionSummary = {
  actionId: ActionId;
  action: string;
  target: string;
  timestamp: string;
  nextAction: string;
};

export type ActionExecutionState = {
  activeActionId: ActionId | null;
  activeLanguage: ExecutionLanguage;
  activeDefinition: ActionDefinition | null;
  activePreview: ActionPreview | null;
  pendingConfirmation: boolean;
  executionQueue: ActionId[];
  lastExecutionResult: ActionResult | null;
  actionHistory: ActionHistoryEntry[];
  lastExecutionSummary: ExecutionSummary | null;
};

export type EngineCandidateState = {
  prepared: boolean;
  feedbackRequested: boolean;
  scheduled: boolean;
  completed: boolean;
  assignedRecruiter: string;
  salaryAligned: boolean;
  offerRisk: "high" | "reduced";
  priorityResolved: boolean;
  feedbackState: "missing" | "requested" | "complete";
  finalFeedbackDeadline: string | null;
  lastUpdatedAt: string;
};

export type EngineState = {
  candidates: Record<string, EngineCandidateState>;
  dashboardPrioritySelection: string | null;
};

export type ActionIntent = {
  actionId: ActionId;
  language: ExecutionLanguage;
  candidateId?: string;
  owner?: string;
  recipient?: string;
  newOwner?: string;
  interviewLabel?: string;
};

export type ActionExecutionOutput = {
  candidateUpdates: Record<string, Partial<EngineCandidateState>>;
  dashboardPrioritySelection: string | null;
  storyStep: string;
  lastAction: string;
  result: ActionResult;
  historyEntry: ActionHistoryEntry;
  summary: ExecutionSummary;
};

const REFERENCE_TIME = "2026-08-09T09:00:00.000Z";

export function createInitialActionExecutionState(): ActionExecutionState {
  return {
    activeActionId: null,
    activeLanguage: "en",
    activeDefinition: null,
    activePreview: null,
    pendingConfirmation: false,
    executionQueue: [],
    lastExecutionResult: null,
    actionHistory: [],
    lastExecutionSummary: null,
  };
}

function formatTimestamp(language: ExecutionLanguage, historyLength: number): string {
  const base = new Date(REFERENCE_TIME);
  base.setMinutes(base.getMinutes() + historyLength * 3);
  if (language === "fr") {
    return `${base.toISOString().slice(0, 10)} ${base.toISOString().slice(11, 16)} UTC`;
  }
  return `${base.toISOString().slice(0, 10)} ${base.toISOString().slice(11, 16)} UTC`;
}

function getCandidateIdForIntent(intent: ActionIntent): string {
  if (intent.actionId === "validate-maya-salary") return "maya-chen";
  if (intent.actionId === "request-emma-feedback") return "emma-laurent";
  return intent.candidateId ?? "maya-chen";
}

function resolveRecruiterName(candidateId: string, state: EngineState): string {
  return state.candidates[candidateId]?.assignedRecruiter ?? "Sarah Martin";
}

function mapChannelLabel(channel: ActionChannel, language: ExecutionLanguage): string {
  if (channel === "email") return language === "en" ? "Email" : "Email";
  if (channel === "copilot") return "Copilot";
  if (channel === "workflow") return language === "en" ? "Workflow" : "Workflow";
  return language === "en" ? "In app" : "Dans l'application";
}

function buildSalaryDefinition(language: ExecutionLanguage, state: EngineState): ActionDefinition {
  const maya = state.candidates["maya-chen"];
  const owner = resolveRecruiterName("maya-chen", state);
  const subject = language === "en"
    ? "Compensation alignment confirmation for your offer"
    : "Confirmation d'alignement de remuneration pour votre offre";

  return {
    id: "validate-maya-salary",
    title: language === "en" ? "Validate Maya salary alignment" : "Valider l'alignement salarial de Maya",
    description: language === "en"
      ? "Confirm salary alignment before sending the final offer decision."
      : "Confirmer l'alignement salarial avant la decision finale d'offre.",
    target: "Maya Chen",
    targetId: "maya-chen",
    owner,
    recipient: "Maya Chen",
    channel: "email",
    riskLevel: "high",
    confirmationLevel: "full",
    messagePreview: {
      recipient: "maya.chen@example.com",
      channel: "email",
      sender: owner,
      subject,
      body: language === "en"
        ? [
            "Hi Maya,",
            "We have completed salary alignment and validated the final package boundaries.",
            "You will receive the final offer confirmation after executive sign-off today.",
            "Best regards,",
            `${owner} - Talent Acquisition`,
          ]
        : [
            "Bonjour Maya,",
            "Nous avons finalise l'alignement salarial et valide les bornes du package final.",
            "Vous recevrez la confirmation finale d'offre apres validation executive aujourd'hui.",
            "Bien a vous,",
            `${owner} - Talent Acquisition`,
          ],
    },
    stateTransitions: [
      {
        label: language === "en" ? "Salary alignment" : "Alignement salarial",
        before: maya?.salaryAligned ? (language === "en" ? "Complete" : "Termine") : (language === "en" ? "Pending" : "En attente"),
        after: language === "en" ? "Complete" : "Termine",
      },
      {
        label: language === "en" ? "Offer risk" : "Risque offre",
        before: maya?.offerRisk === "reduced" ? (language === "en" ? "Reduced" : "Reduit") : (language === "en" ? "High" : "Eleve"),
        after: language === "en" ? "Reduced" : "Reduit",
      },
      {
        label: language === "en" ? "Priority #1" : "Priorite #1",
        before: maya?.priorityResolved ? (language === "en" ? "Resolved" : "Resolue") : (language === "en" ? "Open" : "Ouverte"),
        after: language === "en" ? "Resolved" : "Resolue",
      },
    ],
    affectedScreens: ["dashboard", "pipeline", "candidate-profile"],
    kpiChanges: language === "en"
      ? ["Offers at risk updated", "Decision queue pressure reduced"]
      : ["Offres a risque mises a jour", "Pression de file de decision reduite"],
    priorityChanges: language === "en"
      ? ["Maya offer priority marked as resolved"]
      : ["Priorite offre Maya marquee comme resolue"],
    expectedImpact: language === "en"
      ? ["Protects offer momentum", "Reduces counter-offer risk"]
      : ["Protege la dynamique d'offre", "Reduit le risque de contre-offre"],
    recommendedNextAction: language === "en" ? "Prepare final offer" : "Preparer l'offre finale",
    status: "previewed",
  };
}

function buildFeedbackDefinition(language: ExecutionLanguage, state: EngineState): ActionDefinition {
  const emma = state.candidates["emma-laurent"];
  const owner = resolveRecruiterName("emma-laurent", state);
  const subject = language === "en"
    ? "Final interview feedback request - Emma Laurent"
    : "Demande de feedback final - Emma Laurent";

  return {
    id: "request-emma-feedback",
    title: language === "en" ? "Request Emma final feedback" : "Demander le feedback final d'Emma",
    description: language === "en"
      ? "Request missing manager feedback to unblock final decision readiness."
      : "Demander le feedback manager manquant pour debloquer la decision finale.",
    target: "Emma Laurent",
    targetId: "emma-laurent",
    owner,
    recipient: "David Klein",
    channel: "email",
    riskLevel: "high",
    confirmationLevel: "full",
    messagePreview: {
      recipient: "david.klein@example.com",
      channel: "email",
      sender: owner,
      subject,
      body: language === "en"
        ? [
            "Hi David,",
            "Can you share final feedback for Emma Laurent before 15:00 today?",
            "This is required to close interview review and confirm offer readiness.",
            "Thanks,",
            `${owner} - Talent Acquisition`,
          ]
        : [
            "Bonjour David,",
            "Peux-tu partager le feedback final pour Emma Laurent avant 15:00 aujourd'hui ?",
            "Ce retour est requis pour clore la revue d'entretien et confirmer la preparation d'offre.",
            "Merci,",
            `${owner} - Talent Acquisition`,
          ],
    },
    stateTransitions: [
      {
        label: language === "en" ? "Feedback request" : "Demande de feedback",
        before: emma?.feedbackRequested ? (language === "en" ? "Already sent" : "Deja envoyee") : (language === "en" ? "Not sent" : "Non envoyee"),
        after: language === "en" ? "Sent" : "Envoyee",
      },
      {
        label: language === "en" ? "Feedback status" : "Statut feedback",
        before: emma?.feedbackState === "requested"
          ? (language === "en" ? "Requested" : "Demandee")
          : emma?.feedbackState === "complete"
            ? (language === "en" ? "Complete" : "Termine")
            : (language === "en" ? "Missing" : "Manquant"),
        after: language === "en" ? "Requested - due today 15:00" : "Demande - echeance aujourd'hui 15:00",
      },
    ],
    affectedScreens: ["dashboard", "interviews", "team"],
    kpiChanges: language === "en"
      ? ["Feedback overdue tracker refreshed"]
      : ["Suivi des feedbacks en retard actualise"],
    priorityChanges: language === "en"
      ? ["Emma decision blocker is now actively tracked"]
      : ["Le bloqueur de decision Emma est maintenant suivi"],
    expectedImpact: language === "en"
      ? ["Unblocks offer readiness", "Improves interview decision cadence"]
      : ["Debloque la preparation d'offre", "Ameliore la cadence de decision entretien"],
    recommendedNextAction: language === "en" ? "Review Emma decision packet at 16:00" : "Revoir le dossier de decision Emma a 16:00",
    status: "previewed",
  };
}

function buildReassignDefinition(intent: ActionIntent, language: ExecutionLanguage, state: EngineState): ActionDefinition {
  const candidateId = getCandidateIdForIntent(intent);
  const candidateName = candidateId === "emma-laurent" ? "Emma Laurent" : candidateId === "noah-williams" ? "Noah Williams" : candidateId === "lucas-martin" ? "Lucas Martin" : "Maya Chen";
  const currentOwner = resolveRecruiterName(candidateId, state);
  const nextOwner = intent.newOwner ?? "David Klein";

  return {
    id: "reassign-candidate",
    title: language === "en" ? "Reassign candidate" : "Reassigner le candidat",
    description: language === "en"
      ? "Transfer candidate ownership to rebalance workload and accelerate decision flow."
      : "Transferer la responsabilite candidat pour reequilibrer la charge et accelerer la decision.",
    target: candidateName,
    targetId: candidateId,
    owner: intent.owner ?? currentOwner,
    recipient: nextOwner,
    channel: "workflow",
    riskLevel: "high",
    confirmationLevel: "full",
    messagePreview: {
      recipient: nextOwner,
      channel: "workflow",
      sender: intent.owner ?? currentOwner,
      body: language === "en"
        ? [
            `${nextOwner}, candidate ownership for ${candidateName} is being transferred to you.`,
            "Please review open interview and feedback items before end of day.",
          ]
        : [
            `${nextOwner}, la responsabilite du candidat ${candidateName} vous est transferee.`,
            "Merci de revoir les items entretien et feedback ouverts avant la fin de journee.",
          ],
    },
    stateTransitions: [
      {
        label: language === "en" ? "Current owner" : "Responsable actuel",
        before: currentOwner,
        after: nextOwner,
      },
      {
        label: language === "en" ? "Workload effect" : "Effet charge",
        before: language === "en" ? `${currentOwner} overloaded` : `${currentOwner} surcharge`,
        after: language === "en" ? `Coverage shared with ${nextOwner}` : `Relais partage avec ${nextOwner}`,
      },
    ],
    affectedScreens: ["team", "pipeline", "candidate-profile"],
    kpiChanges: language === "en"
      ? ["Recruiter workload distribution updated"]
      : ["Distribution de charge recruteur mise a jour"],
    priorityChanges: language === "en"
      ? ["Candidate ownership lane refreshed"]
      : ["Attribution de responsable candidat mise a jour"],
    expectedImpact: language === "en"
      ? ["Reduces ownership bottleneck", "Keeps pipeline movement stable"]
      : ["Reduit le goulot de responsabilite", "Maintient la progression pipeline"],
    recommendedNextAction: language === "en" ? "Open interview workspace for handoff" : "Ouvrir l'espace entretien pour le relais",
    status: "previewed",
  };
}

function buildPreparedDefinition(intent: ActionIntent, language: ExecutionLanguage, state: EngineState): ActionDefinition {
  const candidateId = getCandidateIdForIntent(intent);
  const candidateName = candidateId === "emma-laurent" ? "Emma Laurent" : candidateId === "noah-williams" ? "Noah Williams" : candidateId === "lucas-martin" ? "Lucas Martin" : "Maya Chen";
  const current = state.candidates[candidateId];

  return {
    id: "mark-candidate-prepared",
    title: language === "en" ? "Mark candidate as prepared" : "Marquer le candidat comme prepare",
    description: language === "en"
      ? "Confirm interview preparation status before session kickoff."
      : "Confirmer le statut de preparation d'entretien avant la session.",
    target: candidateName,
    targetId: candidateId,
    owner: intent.owner ?? resolveRecruiterName(candidateId, state),
    recipient: candidateName,
    channel: "inApp",
    riskLevel: "medium",
    confirmationLevel: "lightweight",
    stateTransitions: [
      {
        label: language === "en" ? "Interview prep" : "Preparation entretien",
        before: current?.prepared ? (language === "en" ? "Prepared" : "Prepare") : (language === "en" ? "Not prepared" : "Non prepare"),
        after: language === "en" ? "Prepared" : "Prepare",
      },
      {
        label: language === "en" ? "Interview" : "Entretien",
        before: intent.interviewLabel ?? (language === "en" ? "Upcoming" : "A venir"),
        after: language === "en" ? "Preparation complete" : "Preparation terminee",
      },
    ],
    affectedScreens: ["interviews", "dashboard"],
    kpiChanges: language === "en"
      ? ["Prep due today tracker updated"]
      : ["Suivi de preparation du jour mis a jour"],
    priorityChanges: language === "en"
      ? ["Interview readiness improved"]
      : ["Preparation d'entretien amelioree"],
    expectedImpact: language === "en"
      ? ["Reduces interview risk", "Improves panel readiness"]
      : ["Reduit le risque entretien", "Ameliore la preparation panel"],
    recommendedNextAction: language === "en" ? "Open interview guide" : "Ouvrir le guide d'entretien",
    status: "previewed",
  };
}

export function buildActionDefinition(intent: ActionIntent, state: EngineState): ActionDefinition | null {
  if (intent.actionId === "validate-maya-salary") {
    return buildSalaryDefinition(intent.language, state);
  }
  if (intent.actionId === "request-emma-feedback") {
    return buildFeedbackDefinition(intent.language, state);
  }
  if (intent.actionId === "reassign-candidate") {
    return buildReassignDefinition(intent, intent.language, state);
  }
  if (intent.actionId === "mark-candidate-prepared") {
    return buildPreparedDefinition(intent, intent.language, state);
  }
  return null;
}

export function buildActionPreview(definition: ActionDefinition, language: ExecutionLanguage): ActionPreview {
  return {
    actionId: definition.id,
    action: definition.title,
    target: definition.target,
    owner: definition.owner,
    recipient: definition.recipient,
    channel: definition.channel,
    messagePreview: definition.messagePreview,
    currentState: definition.stateTransitions,
    stateAfterExecution: definition.stateTransitions,
    affectedScreens: definition.affectedScreens,
    kpiChanges: definition.kpiChanges,
    priorityChanges: definition.priorityChanges,
    expectedImpact: definition.expectedImpact,
    confirmationLevel: definition.confirmationLevel,
    confirmationCta: language === "en" ? "Confirm and execute" : "Confirmer et executer",
  };
}

function buildCompletedItems(definition: ActionDefinition, language: ExecutionLanguage): string[] {
  const notifiedLabel = language === "en" ? "Message sent to" : "Message envoye a";
  const channelLabel = mapChannelLabel(definition.channel, language);
  const firstLine = definition.messagePreview
    ? `${notifiedLabel} ${definition.recipient} (${channelLabel})`
    : language === "en"
      ? "Action executed in shared workflow"
      : "Action executee dans le workflow partage";

  const updates = definition.stateTransitions.map((item) => `${item.label}: ${item.after}`);
  return [firstLine, ...updates, ...definition.kpiChanges, ...definition.priorityChanges];
}

export function executeActionTransition(
  definition: ActionDefinition,
  state: EngineState,
  language: ExecutionLanguage,
  historyLength: number,
): ActionExecutionOutput {
  const timestamp = formatTimestamp(language, historyLength);
  const target = definition.targetId;

  const candidateUpdates: Record<string, Partial<EngineCandidateState>> = {};
  const current = state.candidates[target];

  if (definition.id === "validate-maya-salary") {
    candidateUpdates["maya-chen"] = {
      salaryAligned: true,
      offerRisk: "reduced",
      priorityResolved: true,
      lastUpdatedAt: timestamp,
    };
  }

  if (definition.id === "request-emma-feedback") {
    candidateUpdates["emma-laurent"] = {
      feedbackRequested: true,
      feedbackState: "requested",
      finalFeedbackDeadline: language === "en" ? "Today 15:00" : "Aujourd'hui 15:00",
      lastUpdatedAt: timestamp,
    };
  }

  if (definition.id === "reassign-candidate") {
    candidateUpdates[target] = {
      assignedRecruiter: definition.recipient,
      lastUpdatedAt: timestamp,
    };
  }

  if (definition.id === "mark-candidate-prepared") {
    candidateUpdates[target] = {
      prepared: true,
      scheduled: true,
      lastUpdatedAt: timestamp,
    };
  }

  const completedItems = buildCompletedItems(definition, language);
  const result: ActionResult = {
    actionId: definition.id,
    action: definition.title,
    completedItems,
    notified: definition.recipient,
    updatedState: definition.stateTransitions,
    affectedScreens: definition.affectedScreens,
    kpiChanges: definition.kpiChanges,
    priorityChanges: definition.priorityChanges,
    recommendedNextAction: definition.recommendedNextAction,
  };

  const historyEntry: ActionHistoryEntry = {
    id: `${definition.id}-${historyLength + 1}`,
    actionId: definition.id,
    action: definition.title,
    target: definition.target,
    owner: definition.owner,
    timestamp,
    before: definition.stateTransitions.map((item) => `${item.label}: ${item.before}`),
    after: definition.stateTransitions.map((item) => `${item.label}: ${item.after}`),
    result: completedItems[0],
  };

  const summary: ExecutionSummary = {
    actionId: definition.id,
    action: definition.title,
    target: definition.target,
    timestamp,
    nextAction: definition.recommendedNextAction,
  };

  const storyStep = language === "en"
    ? `${definition.title} completed for ${definition.target}`
    : `${definition.title} termine pour ${definition.target}`;

  return {
    candidateUpdates,
    dashboardPrioritySelection: definition.id === "validate-maya-salary" ? null : state.dashboardPrioritySelection,
    storyStep,
    lastAction: definition.title,
    result,
    historyEntry,
    summary,
  };
}
