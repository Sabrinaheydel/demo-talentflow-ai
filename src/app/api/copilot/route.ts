import { NextResponse } from "next/server";

export const runtime = "nodejs";

type CandidateContext = {
  name: string;
  role: string;
  match: string;
  probability: string;
  stage: string;
  skills: string[];
  risks: string[];
};

type CopilotRequestBody = {
  userMessage: string;
  candidateContext: CandidateContext;
  language: "en" | "fr";
  selectedAction: string;
};

type CopilotResponse = {
  recommendation: string;
  evidence: string;
  risks: string;
  suggestedNextStep: string;
  confidenceScore: number;
  reviewNote: string;
};

function detectIntent(message: string, fallback: string) {
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

function buildSimulatedResponse(intent: string, language: "en" | "fr", candidateContext: CandidateContext) {
  const contextSummary = `${candidateContext.name} • ${candidateContext.role} • ${candidateContext.match} match • ${candidateContext.probability} hiring probability`;
  const reviewNote = language === "en"
    ? "Demo mode — AI responses are simulated. Review this output with a recruiter before acting."
    : "Mode démo — les réponses IA sont simulées. Vérifiez cette sortie avec un recruteur avant toute action.";

  if (intent === "summarize") {
    return language === "en"
      ? {
          recommendation: `Advance ${candidateContext.name} to the executive review stage.`,
          evidence: `The profile shows strong product leadership, an AI match of ${candidateContext.match}, and a ${candidateContext.probability} hiring probability, which makes the case compelling for the next review loop.`,
          risks: "The main risks remain notice timing and compensation expectations.",
          suggestedNextStep: "Prepare a focused leadership panel conversation within the next two days.",
          confidenceScore: 93,
          reviewNote,
        }
      : {
          recommendation: `Faites progresser ${candidateContext.name} vers l’étape de revue exécutive.`,
          evidence: `Le profil montre un fort leadership produit, un match IA de ${candidateContext.match} et une probabilité d’embauche de ${candidateContext.probability}, ce qui rend le cas convaincant pour la prochaine boucle de revue.`,
          risks: "Les principaux risques restent le timing du départ et les attentes salariales.",
          suggestedNextStep: "Préparez une conversation de panel leadership ciblée dans les deux prochains jours.",
          confidenceScore: 93,
          reviewNote,
        };
  }

  if (intent === "compare") {
    return language === "en"
      ? {
          recommendation: `Keep ${candidateContext.name} in the top tier against the current shortlist.`,
          evidence: `She stands out for strategic depth, hiring systems impact, and clear alignment with the role. ${contextSummary} makes her the most differentiated option in the current group.`,
          risks: "The main gap is compensation flexibility rather than role fit.",
          suggestedNextStep: "Keep her in the executive review queue and prepare a benchmark conversation.",
          confidenceScore: 91,
          reviewNote,
        }
      : {
          recommendation: `Gardez ${candidateContext.name} dans le haut du panier face à la shortlist actuelle.`,
          evidence: `Elle se distingue par sa profondeur stratégique, son impact sur les systèmes RH et son alignement clair avec le poste. ${contextSummary} la rend l’option la plus différenciante du groupe actuel.`,
          risks: "Le principal écart est la flexibilité salariale plutôt que l’adéquation au poste.",
          suggestedNextStep: "Conservez-la dans la file de revue exécutive et préparez une conversation de benchmark.",
          confidenceScore: 91,
          reviewNote,
        };
  }

  if (intent === "questions") {
    return language === "en"
      ? {
          recommendation: "Use the next conversation to test leadership depth and mission fit.",
          evidence: "The profile already signals strong cross-functional leadership and measurable impact in hiring operations.",
          risks: "The remaining uncertainty is around start timing and how the candidate evaluates long-term growth.",
          suggestedNextStep: "Ask three targeted questions about leadership model, stakeholder influence, and growth appetite.",
          confidenceScore: 89,
          reviewNote,
        }
      : {
          recommendation: "Utilisez la prochaine conversation pour tester la profondeur du leadership et l’adéquation à la mission.",
          evidence: "Le profil signale déjà un fort leadership transversale et un impact mesurable sur les opérations RH.",
          risks: "L’incertitude restante porte sur le timing de départ et sur la façon dont le candidat évalue la croissance à long terme.",
          suggestedNextStep: "Posez trois questions ciblées sur le modèle de leadership, l’influence des parties prenantes et l’appétence pour la croissance.",
          confidenceScore: 89,
          reviewNote,
        };
  }

  if (intent === "email") {
    return language === "en"
      ? {
          recommendation: "Draft a warm and confident follow-up note.",
          evidence: "The candidate has a strong story around product, analytics, and hiring impact, so the message should reinforce momentum.",
          risks: "The note should avoid overpromising and stay grounded in the current stage.",
          suggestedNextStep: "Send a concise message inviting a follow-up conversation this week.",
          confidenceScore: 88,
          reviewNote,
        }
      : {
          recommendation: "Rédigez un message de suivi chaleureux et confiant.",
          evidence: "Le candidat a une forte histoire autour du produit, de l’analytique et de l’impact RH, donc le message doit renforcer l’élan.",
          risks: "Le message doit éviter toute surpromesse et rester ancré dans l’étape actuelle.",
          suggestedNextStep: "Envoyez un message concis pour inviter à une conversation de suivi cette semaine.",
          confidenceScore: 88,
          reviewNote,
        };
  }

  if (intent === "risks") {
    return language === "en"
      ? {
          recommendation: "Flag the candidate as high potential but watch timing and compensation carefully.",
          evidence: `The profile is strong, but the risks include a compressed notice window, compensation above the current band midpoint, and possible competing offers.`,
          risks: "These factors could slow the path to decision if they are not handled early.",
          suggestedNextStep: "Create a mitigation plan around flexibility, clarity, and urgency.",
          confidenceScore: 90,
          reviewNote,
        }
      : {
          recommendation: "Marquez le candidat comme haut potentiel mais surveillez attentivement le timing et la rémunération.",
          evidence: "Le profil est solide, mais les risques incluent une fenêtre de départ courte, une rémunération au-dessus du milieu de la fourchette actuelle et de possibles offres concurrentes.",
          risks: "Ces facteurs pourraient ralentir la décision s’ils ne sont pas traités tôt.",
          suggestedNextStep: "Créez un plan d’atténuation autour de la flexibilité, de la clarté et de l’urgence.",
          confidenceScore: 90,
          reviewNote,
        };
  }

  return language === "en"
    ? {
        recommendation: "Keep the next step focused on a recruiter-ready decision plan.",
        evidence: `The available context supports a practical next move around ${candidateContext.stage.toLowerCase()} progression and stakeholder alignment.`,
        risks: "Use the available evidence carefully and avoid assumptions beyond the provided context.",
        suggestedNextStep: "Frame the next action around the candidate’s role fit, timing, and decision urgency.",
        confidenceScore: 87,
        reviewNote,
      }
    : {
        recommendation: "Gardez la prochaine étape centrée sur un plan de décision prêt pour les recruteurs.",
        evidence: `Le contexte disponible soutient un prochain mouvement pratique autour de la progression ${candidateContext.stage.toLowerCase()} et de l’alignement des parties prenantes.`,
        risks: "Utilisez les preuves disponibles avec prudence et évitez les hypothèses au-delà du contexte fourni.",
        suggestedNextStep: "Structurez la prochaine action autour de l’adéquation au poste, du timing et de l’urgence de décision.",
        confidenceScore: 87,
        reviewNote,
      };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CopilotRequestBody;
    const { userMessage, candidateContext, language, selectedAction } = body;

    if (!userMessage?.trim()) {
      return NextResponse.json({ error: language === "fr" ? "Un message est requis." : "A message is required." }, { status: 400 });
    }

    const intent = detectIntent(userMessage, selectedAction);
    const response = buildSimulatedResponse(intent, language, candidateContext);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Copilot API error", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
