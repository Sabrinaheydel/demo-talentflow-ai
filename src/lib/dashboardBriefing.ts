import { canonicalCandidates } from "./demoData";
import { DemoExperienceState, DashboardBriefingType } from "./demoExperience";

export type BriefingLanguage = "en" | "fr";

export type BriefingStatus = "on-track" | "watch" | "at-risk";
export type BriefingUrgency = "low" | "medium" | "high";

export type BriefingKpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  meaning: string;
  status: BriefingStatus;
  action?: string;
};

export type BriefingInsight = {
  id: string;
  signal: string;
  impact: string;
  urgency: BriefingUrgency;
  recommendedAction: string;
  suggestedOwner: string;
};

export type BriefingAction = {
  id: string;
  title: string;
  candidate: string;
  deadline: string;
  urgency: BriefingUrgency;
  impact: string;
  owner: string;
  confirmMessage: string;
};

export type BriefingPriority = {
  id: string;
  candidateId: string;
  title: string;
  whyNow: string[];
  recommendedAction: string;
  deadline: string;
  owner: string;
};

export type BriefingPacket = {
  briefingType: DashboardBriefingType;
  scenarioId: string;
  title: string;
  greeting: string;
  timeWindow: string;
  summary: string;
  keyChanges: string[];
  risks: string[];
  priorityOne: BriefingPriority;
  recommendedActions: BriefingAction[];
  estimatedCatchUpTime: string;
  estimatedCatchUpMinutes: number;
  audienceContext: string;
  whatChangedTitle: string;
  needsAttentionTitle: string;
  whatToDoNowTitle: string;
  primaryCta: string;
  kpis: BriefingKpi[];
  insights: BriefingInsight[];
};

const REFERENCE_NOW = new Date("2026-08-09T09:00:00.000Z");

function formatSinceLastVisit(lastViewedAt: string, language: BriefingLanguage): string {
  const viewedAt = new Date(lastViewedAt);
  const diffMs = Math.max(REFERENCE_NOW.getTime() - viewedAt.getTime(), 0);
  const diffHours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays >= 1) {
    return language === "en"
      ? `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
      : `il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`;
  }

  return language === "en"
    ? `${diffHours}h ago`
    : `il y a ${diffHours} h`;
}

function getCandidateName(id: string) {
  return canonicalCandidates.find((candidate) => candidate.id === id)?.name ?? id;
}

function buildAbsenceBrief(state: DemoExperienceState, language: BriefingLanguage): BriefingPacket {
  const since = formatSinceLastVisit(state.dashboard.lastViewedAt, language);
  const priorityId = "maya-chen-offer";
  const priorityCandidate = getCandidateName("maya-chen");

  return {
    briefingType: "absence",
    scenarioId: "absence-6d",
    title: language === "en"
      ? `Since your last visit - ${since}`
      : `Depuis votre derniere visite - ${since}`,
    greeting: language === "en" ? "Good morning, Sabrina" : "Bonjour, Sabrina",
    timeWindow: language === "en" ? "Last 6 days" : "6 derniers jours",
    summary: language === "en"
      ? "14 new candidates, 7 interviews completed, 2 offers sent, 3 decisions now waiting."
      : "14 nouveaux candidats, 7 entretiens termines, 2 offres envoyees, 3 decisions en attente.",
    keyChanges: language === "en"
      ? [
          "Maya Chen moved to Final Interview and is now decision-ready.",
          "Emma Laurent is blocked by missing hiring-manager feedback.",
          "Lucas Martin has pending technical feedback for more than 24 hours.",
          "Two offers were drafted and now require salary alignment validation.",
        ]
      : [
          "Maya Chen est passee en entretien final et attend une decision.",
          "Emma Laurent est bloquee par un feedback manager manquant.",
          "Lucas Martin a un feedback technique en attente depuis plus de 24 h.",
          "Deux offres preparees necessitent une validation salariale.",
        ],
    risks: language === "en"
      ? [
          "Counter-offer risk is high for Maya Chen if no decision is made today.",
          "Feedback gap on Emma Laurent can delay offer readiness.",
          "Compensation alignment is unresolved on two active offers.",
        ]
      : [
          "Le risque de contre-offre est eleve pour Maya Chen sans decision aujourd'hui.",
          "Le manque de feedback sur Emma Laurent retarde la decision d'offre.",
          "L'alignement salarial reste ouvert sur deux offres actives.",
        ],
    priorityOne: {
      id: priorityId,
      candidateId: "maya-chen",
      title: language === "en"
        ? `${priorityCandidate} - offer decision`
        : `${priorityCandidate} - decision d'offre`,
      whyNow: language === "en"
        ? [
            "Final interview completed and decision packet is ready.",
            "Counter-offer risk is high if response is delayed.",
            "Candidate has been waiting for 18 hours.",
            "Salary alignment remains unresolved.",
          ]
        : [
            "Entretien final termine et dossier de decision pret.",
            "Risque de contre-offre eleve en cas de delai.",
            "La candidate attend une reponse depuis 18 h.",
            "L'alignement salarial n'est pas finalise.",
          ],
      recommendedAction: language === "en"
        ? "Validate offer package before 17:00."
        : "Valider le package d'offre avant 17:00.",
      deadline: language === "en" ? "Today 17:00" : "Aujourd'hui 17:00",
      owner: "Sarah Martin",
    },
    recommendedActions: [
      {
        id: "action-maya-offer",
        title: language === "en" ? "Validate Maya salary alignment" : "Valider l'alignement salarial de Maya",
        candidate: "Maya Chen",
        deadline: language === "en" ? "Due today 17:00" : "Echeance aujourd'hui 17:00",
        urgency: "high",
        impact: language === "en" ? "Protects acceptance momentum." : "Preserve la dynamique d'acceptation.",
        owner: "Sarah Martin",
        confirmMessage: language === "en"
          ? "Maya alignment review opened"
          : "Revue d'alignement Maya ouverte",
      },
      {
        id: "action-emma-feedback",
        title: language === "en" ? "Request Emma final feedback" : "Demander le feedback final d'Emma",
        candidate: "Emma Laurent",
        deadline: language === "en" ? "Due today 15:00" : "Echeance aujourd'hui 15:00",
        urgency: "high",
        impact: language === "en" ? "Unblocks offer readiness." : "Debloque la preparation de l'offre.",
        owner: "David Klein",
        confirmMessage: language === "en"
          ? "Feedback request sent to hiring manager"
          : "Demande de feedback envoyee au manager",
      },
      {
        id: "action-lucas-review",
        title: language === "en" ? "Close Lucas technical feedback" : "Clore le feedback technique de Lucas",
        candidate: "Lucas Martin",
        deadline: language === "en" ? "Due in 4h" : "Echeance dans 4 h",
        urgency: "medium",
        impact: language === "en" ? "Prevents decision slippage." : "Evite un glissement de decision.",
        owner: "Thomas Lee",
        confirmMessage: language === "en"
          ? "Lucas feedback follow-up opened"
          : "Relance feedback Lucas ouverte",
      },
      {
        id: "action-noah-interview",
        title: language === "en" ? "Prepare Noah culture interview" : "Preparer l'entretien culture de Noah",
        candidate: "Noah Williams",
        deadline: language === "en" ? "Tomorrow 16:00" : "Demain 16:00",
        urgency: "low",
        impact: language === "en" ? "Improves confidence for next loop." : "Renforce la confiance pour la prochaine boucle.",
        owner: "Sarah Martin",
        confirmMessage: language === "en"
          ? "Noah interview prep opened"
          : "Preparation entretien Noah ouverte",
      },
    ],
    estimatedCatchUpTime: language === "en" ? "2 minutes to regain full context" : "2 minutes pour reprendre tout le contexte",
    estimatedCatchUpMinutes: 2,
    audienceContext: language === "en"
      ? "Audience: Primary recruiter view"
      : "Audience : vue recruteur principal",
    whatChangedTitle: language === "en" ? "What changed" : "Ce qui a change",
    needsAttentionTitle: language === "en" ? "What needs attention" : "Ce qui demande attention",
    whatToDoNowTitle: language === "en" ? "What to do now" : "Ce qu'il faut faire maintenant",
    primaryCta: language === "en" ? "Start 2-minute catch-up" : "Demarrer le rattrapage de 2 minutes",
    kpis: [
      {
        id: "awaiting-decision",
        label: language === "en" ? "Candidates awaiting decision" : "Candidats en attente de decision",
        value: "6",
        delta: "+2",
        meaning: language === "en" ? "Decision queue grew during absence." : "La file de decision a augmente pendant l'absence.",
        status: "watch",
        action: language === "en" ? "Review queue" : "Revoir la file",
      },
      {
        id: "feedback-overdue",
        label: language === "en" ? "Feedback overdue" : "Feedback en retard",
        value: "3",
        delta: "+1",
        meaning: language === "en" ? "Interview loop is blocked." : "La boucle d'entretien est bloquee.",
        status: "at-risk",
        action: language === "en" ? "Request now" : "Demander maintenant",
      },
      {
        id: "offers-risk",
        label: language === "en" ? "Offers at risk" : "Offres a risque",
        value: "2",
        delta: "+1",
        meaning: language === "en" ? "Salary alignment still pending." : "Alignement salarial encore en attente.",
        status: "at-risk",
        action: language === "en" ? "Validate alignment" : "Valider l'alignement",
      },
      {
        id: "interviews-without-decision",
        label: language === "en" ? "Completed interviews pending decision" : "Entretiens termines sans decision",
        value: "4",
        delta: "+2",
        meaning: language === "en" ? "Decision latency is rising." : "La latence de decision augmente.",
        status: "watch",
      },
      {
        id: "workload-pressure",
        label: language === "en" ? "Recruiter workload pressure" : "Pression de charge recruteur",
        value: "2 overloaded",
        delta: "+1",
        meaning: language === "en" ? "Handoff support required today." : "Un soutien de relais est requis aujourd'hui.",
        status: "watch",
      },
    ],
    insights: [
      {
        id: "insight-maya",
        signal: language === "en" ? "Maya offer momentum is fragile" : "L'offre de Maya est fragile",
        impact: language === "en"
          ? "Delay beyond today increases counter-offer probability."
          : "Un delai au-dela d'aujourd'hui augmente la probabilite de contre-offre.",
        urgency: "high",
        recommendedAction: language === "en" ? "Finalize offer before 17:00." : "Finaliser l'offre avant 17:00.",
        suggestedOwner: "Sarah Martin",
      },
      {
        id: "insight-emma",
        signal: language === "en" ? "Emma decision is blocked by missing feedback" : "La decision d'Emma est bloquee par un feedback manquant",
        impact: language === "en"
          ? "Without hiring-manager input, offer review cannot start."
          : "Sans retour du manager, la revue d'offre ne peut pas demarrer.",
        urgency: "high",
        recommendedAction: language === "en" ? "Collect final manager feedback today." : "Collecter le feedback manager final aujourd'hui.",
        suggestedOwner: "David Klein",
      },
      {
        id: "insight-lucas",
        signal: language === "en" ? "Lucas technical loop is stalling" : "La boucle technique de Lucas ralentit",
        impact: language === "en"
          ? "Pending feedback is delaying shortlist confidence."
          : "Le feedback en attente retarde la confiance de shortlist.",
        urgency: "medium",
        recommendedAction: language === "en" ? "Trigger technical feedback follow-up." : "Declencher la relance de feedback technique.",
        suggestedOwner: "Thomas Lee",
      },
    ],
  };
}

function buildCoverBrief(state: DemoExperienceState, language: BriefingLanguage): BriefingPacket {
  const priorityId = "emma-laurent-feedback";
  const coverName = state.dashboard.coverMode.coverActorId === "thomas-lee"
    ? "Thomas Lee"
    : "Alex Morgan";

  return {
    briefingType: "cover",
    scenarioId: "cover-handoff",
    title: language === "en"
      ? `Cover brief - taking over Sarah Martin's queue`
      : "Brief de relais - reprise du portefeuille de Sarah Martin",
    greeting: language === "en" ? "Good morning, Sabrina" : "Bonjour, Sabrina",
    timeWindow: language === "en" ? "Coverage window: 48h" : "Fenetre de relais : 48 h",
    summary: language === "en"
      ? "You are covering one recruiter lane: 9 activity updates, 3 urgent decisions, 2 blockers."
      : "Vous couvrez un portefeuille recruteur : 9 mises a jour, 3 decisions urgentes, 2 blocages.",
    keyChanges: language === "en"
      ? [
          "Maya Chen is now at final offer validation stage.",
          "Emma Laurent requires immediate hiring-manager feedback handoff.",
          "Lucas Martin feedback queue has crossed the SLA threshold.",
        ]
      : [
          "Maya Chen est en phase finale de validation d'offre.",
          "Emma Laurent requiert un relais immediat de feedback manager.",
          "La file de feedback de Lucas Martin a depasse le seuil SLA.",
        ],
    risks: language === "en"
      ? [
          "Handoff gap may hide ownership on two urgent decisions.",
          "One overloaded recruiter lane may delay interview follow-through.",
        ]
      : [
          "Un manque de relais peut masquer l'ownership sur deux decisions urgentes.",
          "Une file recruteur surchargee peut retarder les suivis d'entretien.",
        ],
    priorityOne: {
      id: priorityId,
      candidateId: "emma-laurent",
      title: language === "en"
        ? "Emma Laurent - unblock final feedback"
        : "Emma Laurent - debloquer le feedback final",
      whyNow: language === "en"
        ? [
            "Feedback is missing from the hiring manager.",
            "Decision handoff risk is high during temporary coverage.",
            "Offer prep cannot start until this gap is closed.",
          ]
        : [
            "Le feedback du manager est manquant.",
            "Le risque de rupture de relais est eleve pendant la couverture.",
            "La preparation de l'offre ne peut pas demarrer sans ce retour.",
          ],
      recommendedAction: language === "en"
        ? "Secure manager feedback before 15:00."
        : "Securiser le feedback manager avant 15:00.",
      deadline: language === "en" ? "Today 15:00" : "Aujourd'hui 15:00",
      owner: coverName,
    },
    recommendedActions: [
      {
        id: "cover-emma-feedback",
        title: language === "en" ? "Request Emma manager feedback" : "Demander le feedback manager d'Emma",
        candidate: "Emma Laurent",
        deadline: language === "en" ? "Due today 15:00" : "Echeance aujourd'hui 15:00",
        urgency: "high",
        impact: language === "en" ? "Unblocks decision handoff." : "Debloque le relais de decision.",
        owner: coverName,
        confirmMessage: language === "en"
          ? "Emma feedback escalation opened"
          : "Escalade feedback Emma ouverte",
      },
      {
        id: "cover-maya-offer",
        title: language === "en" ? "Validate Maya offer readiness" : "Valider la preparation d'offre de Maya",
        candidate: "Maya Chen",
        deadline: language === "en" ? "Due today 17:00" : "Echeance aujourd'hui 17:00",
        urgency: "high",
        impact: language === "en" ? "Protects close probability." : "Protege la probabilite de closing.",
        owner: coverName,
        confirmMessage: language === "en"
          ? "Maya offer readiness opened"
          : "Preparation offre Maya ouverte",
      },
      {
        id: "cover-lucas-feedback",
        title: language === "en" ? "Close Lucas pending feedback" : "Clore le feedback en attente de Lucas",
        candidate: "Lucas Martin",
        deadline: language === "en" ? "Due in 4h" : "Echeance dans 4 h",
        urgency: "medium",
        impact: language === "en" ? "Restores technical decision flow." : "Retablit le flux de decision technique.",
        owner: "Thomas Lee",
        confirmMessage: language === "en"
          ? "Lucas feedback relay opened"
          : "Relais feedback Lucas ouvert",
      },
    ],
    estimatedCatchUpTime: language === "en" ? "3 minutes to operate safely in cover mode" : "3 minutes pour operer en mode relais",
    estimatedCatchUpMinutes: 3,
    audienceContext: language === "en"
      ? `Audience: ${coverName} temporarily covering Sarah Martin`
      : `Audience : ${coverName} couvre temporairement Sarah Martin`,
    whatChangedTitle: language === "en" ? "What changed" : "Ce qui a change",
    needsAttentionTitle: language === "en" ? "What needs attention" : "Ce qui demande attention",
    whatToDoNowTitle: language === "en" ? "What to do now" : "Ce qu'il faut faire maintenant",
    primaryCta: language === "en" ? "Start cover catch-up" : "Demarrer le rattrapage de relais",
    kpis: [
      {
        id: "cover-urgent-decisions",
        label: language === "en" ? "Urgent decisions in covered lane" : "Decisions urgentes du portefeuille couvre",
        value: "3",
        delta: "+1",
        meaning: language === "en" ? "Handoff risk is concentrated today." : "Le risque de relais est concentre aujourd'hui.",
        status: "at-risk",
      },
      {
        id: "cover-feedback-overdue",
        label: language === "en" ? "Feedback overdue" : "Feedback en retard",
        value: "2",
        delta: "+1",
        meaning: language === "en" ? "Coverage requires escalation." : "La couverture exige une escalade.",
        status: "at-risk",
      },
      {
        id: "cover-offers-risk",
        label: language === "en" ? "Offers at risk" : "Offres a risque",
        value: "1",
        delta: "0",
        meaning: language === "en" ? "Close-ready offer needs final approval." : "Une offre prete a close requiert une approbation finale.",
        status: "watch",
      },
      {
        id: "cover-workload",
        label: language === "en" ? "Workload pressure" : "Pression de charge",
        value: "High",
        delta: "+1 lane",
        meaning: language === "en" ? "One recruiter lane is under temporary takeover." : "Un portefeuille recruteur est en reprise temporaire.",
        status: "watch",
      },
    ],
    insights: [
      {
        id: "cover-insight-handoff",
        signal: language === "en" ? "Handoff risk detected on Emma" : "Risque de relais detecte sur Emma",
        impact: language === "en"
          ? "Missing manager feedback blocks the next decision gate."
          : "Le feedback manager manquant bloque la prochaine etape de decision.",
        urgency: "high",
        recommendedAction: language === "en" ? "Escalate feedback request immediately." : "Escalader la demande de feedback immediatement.",
        suggestedOwner: coverName,
      },
      {
        id: "cover-insight-offer",
        signal: language === "en" ? "Maya offer requires continuity" : "L'offre de Maya exige de la continuite",
        impact: language === "en"
          ? "Transition gaps could reduce acceptance confidence."
          : "Les ruptures de relais peuvent reduire la confiance d'acceptation.",
        urgency: "high",
        recommendedAction: language === "en" ? "Confirm offer narrative before 17:00." : "Confirmer le narratif d'offre avant 17:00.",
        suggestedOwner: coverName,
      },
      {
        id: "cover-insight-workload",
        signal: language === "en" ? "Coverage workload is near threshold" : "La charge de couverture approche le seuil",
        impact: language === "en"
          ? "Additional queue delay can affect interview speed."
          : "Un retard de file supplementaire peut impacter la vitesse d'entretien.",
        urgency: "medium",
        recommendedAction: language === "en" ? "Reprioritize medium actions after urgent decisions." : "Reprioriser les actions moyennes apres les decisions urgentes.",
        suggestedOwner: "Team Lead",
      },
    ],
  };
}

function buildFutureBriefing(briefingType: DashboardBriefingType, state: DemoExperienceState, language: BriefingLanguage): BriefingPacket {
  const since = formatSinceLastVisit(state.dashboard.lastViewedAt, language);

  return {
    briefingType,
    scenarioId: `${briefingType}-placeholder`,
    title: language === "en" ? "Briefing mode prepared" : "Mode de briefing prepare",
    greeting: language === "en" ? "Good morning, Sabrina" : "Bonjour, Sabrina",
    timeWindow: language === "en" ? `Reference since ${since}` : `Reference depuis ${since}`,
    summary: language === "en"
      ? "This briefing mode is architected and ready for activation in a later sprint."
      : "Ce mode de briefing est architecture et pret pour activation dans un sprint futur.",
    keyChanges: language === "en" ? ["Engine contract already supports this mode."] : ["Le contrat moteur supporte deja ce mode."],
    risks: language === "en" ? ["Mode not active in current MVP."] : ["Mode non actif dans le MVP actuel."],
    priorityOne: {
      id: "placeholder-priority",
      candidateId: "maya-chen",
      title: language === "en" ? "Prepare next briefing mode" : "Preparer le prochain mode de briefing",
      whyNow: language === "en" ? ["Contract and renderer are already shared."] : ["Le contrat et le rendu sont deja mutualises."],
      recommendedAction: language === "en" ? "Activate when sprint scope includes this mode." : "Activer lorsque le scope sprint inclut ce mode.",
      deadline: language === "en" ? "Future sprint" : "Sprint futur",
      owner: "Product Team",
    },
    recommendedActions: [],
    estimatedCatchUpTime: language === "en" ? "Not active in MVP" : "Non actif dans le MVP",
    estimatedCatchUpMinutes: 0,
    audienceContext: language === "en" ? "Audience: Prepared for future" : "Audience : prepare pour le futur",
    whatChangedTitle: language === "en" ? "What changed" : "Ce qui a change",
    needsAttentionTitle: language === "en" ? "What needs attention" : "Ce qui demande attention",
    whatToDoNowTitle: language === "en" ? "What to do now" : "Ce qu'il faut faire maintenant",
    primaryCta: language === "en" ? "Mode not active" : "Mode non actif",
    kpis: [],
    insights: [],
  };
}

export function buildBriefingPacket(briefingType: DashboardBriefingType, state: DemoExperienceState, language: BriefingLanguage): BriefingPacket {
  if (briefingType === "absence") return buildAbsenceBrief(state, language);
  if (briefingType === "cover") return buildCoverBrief(state, language);
  return buildFutureBriefing(briefingType, state, language);
}
