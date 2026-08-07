"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "../ui/Badge";
import { Icon } from "../ui/Icon";
import { getCanonicalCandidateById } from "../../lib/demoData";

type Language = "en" | "fr";

type Message = {
  id: number;
  author: "user" | "ai";
  text: string;
};

type CopilotResponse = {
  recommendation: string;
  evidence: string;
  risks: string;
  suggestedNextStep: string;
  confidenceScore: number;
  reviewNote: string;
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
  { key: "summarize", en: "Summarize candidate", fr: "Résumer le candidat" },
  { key: "compare", en: "Compare candidates", fr: "Comparer les candidats" },
  { key: "questions", en: "Generate interview questions", fr: "Générer des questions d’entretien" },
  { key: "email", en: "Draft candidate email", fr: "Rédiger un email candidat" },
  { key: "risks", en: "Detect hiring risks", fr: "Détecter les risques d’embauche" },
  { key: "action", en: "Recommend next action", fr: "Recommander la prochaine action" },
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
  const normalized = `${message} ${fallback}`.toLowerCase();
  if (/(summarize|summary|overview|profile)/.test(normalized)) return "summarize";
  if (/(compare|versus|vs|difference|differ)/.test(normalized)) return "compare";
  if (/(question|questions|interview)/.test(normalized)) return "questions";
  if (/(email|message|contact|write)/.test(normalized)) return "email";
  if (/(risk|risks|concern|warning|problem)/.test(normalized)) return "risks";
  if (/(next|recommend|action|plan|schedule)/.test(normalized)) return "action";
  return "action";
}

function buildSimulatedResponse(intent: IntentKey, language: Language) {
  const contextSummary = `${candidateContext.name} • ${candidateContext.role} • ${candidateContext.match} match • ${candidateContext.probability} hiring probability`;
  const reviewNote = language === "en"
    ? "Demo mode — AI responses are simulated. Review this output with a recruiter before acting."
    : "Mode démo — les réponses IA sont simulées. Vérifiez cette sortie avec un recruteur avant toute action.";

  if (intent === "summarize") {
    return language === "en"
      ? {
          recommendation: "Advance Maya Chen to the executive review stage.",
          evidence: `The profile shows strong product leadership, an AI match of ${candidateContext.match}, and a ${candidateContext.probability} hiring probability, which makes the case compelling for the next review loop.`,
          risks: "The main risks remain notice timing and compensation expectations.",
          suggestedNextStep: "Prepare a focused leadership panel conversation within the next two days.",
          confidenceScore: 93,
          reviewNote,
        }
      : {
          recommendation: "Faites progresser Maya Chen vers l’étape de revue exécutive.",
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
          recommendation: "Keep Maya Chen in the top tier against the current shortlist.",
          evidence: `She stands out for strategic depth, hiring systems impact, and clear alignment with the role. ${contextSummary} makes her the most differentiated option in the current group.`,
          risks: "The main gap is compensation flexibility rather than role fit.",
          suggestedNextStep: "Keep her in the executive review queue and prepare a benchmark conversation.",
          confidenceScore: 91,
          reviewNote,
        }
      : {
          recommendation: "Gardez Maya Chen dans le haut du panier face à la shortlist actuelle.",
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
          evidence: `The profile already signals strong cross-functional leadership and measurable impact in hiring operations.`,
          risks: "The remaining uncertainty is around start timing and how the candidate evaluates long-term growth.",
          suggestedNextStep: "Ask three targeted questions about leadership model, stakeholder influence, and growth appetite.",
          confidenceScore: 89,
          reviewNote,
        }
      : {
          recommendation: "Utilisez la prochaine conversation pour tester la profondeur du leadership et l’adéquation à la mission.",
          evidence: `Le profil signale déjà un fort leadership transversale et un impact mesurable sur les opérations RH.`,
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
          evidence: `The candidate has a strong story around product, analytics, and hiring impact, so the message should reinforce momentum.`,
          risks: "The note should avoid overpromising and stay grounded in the current stage.",
          suggestedNextStep: "Send a concise message inviting a follow-up conversation this week.",
          confidenceScore: 88,
          reviewNote,
        }
      : {
          recommendation: "Rédigez un message de suivi chaleureux et confiant.",
          evidence: `Le candidat a une forte histoire autour du produit, de l’analytique et de l’impact RH, donc le message doit renforcer l’élan.`,
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
          evidence: `Le profil est solide, mais les risques incluent une fenêtre de départ courte, une rémunération au-dessus du milieu de la fourchette actuelle et de possibles offres concurrentes.`,
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

export function CopilotWorkspace({ language, initialContext }: { language: Language; initialContext?: { candidateId?: string; mode?: string; context?: string } }) {
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
  const [activeAction, setActiveAction] = useState(language === "en" ? "Summarize candidate" : "Résumer le candidat");
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
    setActiveAction(language === "en" ? "Summarize candidate" : "Résumer le candidat");
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
        responseTitle: "Example AI response",
        reset: "Reset conversation",
        demoNotice: "Demo mode — AI responses are simulated.",
        loading: "Thinking…",
        errorPrefix: "The copilot could not generate a response.",
        response: {
          recommendation: "Recommendation",
          evidence: "Evidence",
          risks: "Risks",
          nextStep: "Suggested next step",
          confidence: "Confidence score",
        },
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
        responseTitle: "Exemple de réponse IA",
        reset: "Réinitialiser la conversation",
        demoNotice: "Mode démo — les réponses IA sont simulées.",
        loading: "Réflexion…",
        errorPrefix: "Le copilot n’a pas pu générer de réponse.",
        response: {
          recommendation: "Recommandation",
          evidence: "Preuves",
          risks: "Risques",
          nextStep: "Prochaine étape suggérée",
          confidence: "Score de confiance",
        },
      };

  const responseCards = useMemo(() => {
    if (latestResponse) {
      return [
        { title: copy.response.recommendation, body: latestResponse.recommendation },
        { title: copy.response.evidence, body: latestResponse.evidence },
        { title: copy.response.risks, body: latestResponse.risks },
        { title: copy.response.nextStep, body: latestResponse.suggestedNextStep },
      ];
    }

    return [
      { title: copy.response.recommendation, body: language === "en" ? "Awaiting a new request" : "En attente d’une nouvelle demande" },
      { title: copy.response.evidence, body: language === "en" ? "The current view is grounded in the candidate context on screen." : "La vue actuelle est ancrée dans le contexte candidat affiché à l’écran." },
      { title: copy.response.risks, body: language === "en" ? "No risk summary yet." : "Aucun résumé des risques pour l’instant." },
      { title: copy.response.nextStep, body: language === "en" ? "Select a prompt or send a message to begin." : "Sélectionnez un prompt ou envoyez un message pour commencer." },
    ];
  }, [copy, language, latestResponse]);

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
        text: [
          parsed.recommendation,
          parsed.evidence,
          parsed.risks,
          parsed.suggestedNextStep,
          `${language === "en" ? "Confidence" : "Confiance"}: ${parsed.confidenceScore}%`,
          parsed.reviewNote,
        ].filter(Boolean).join("\n\n"),
      },
    ]);
    setLoading(false);
  };

  return (
    <div className="copilot-shell">
      <section className="copilot-chat-panel">
        <div className="copilot-panel__header">
          <div>
            <p className="eyebrow">{copy.title}</p>
            <h2>{copy.subtitle}</h2>
          </div>
          <div className="candidate-summary__chips">
            <Badge label="Live" tone="success" />
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
            <h3>{copy.responseTitle}</h3>
            <p>{language === "en" ? "Recruiter-ready analysis" : "Analyse prête au recruteur"}</p>
          </div>
          <p className="demo-disclaimer" style={{ marginBottom: "10px" }}>
            {copy.demoNotice}
          </p>
          <div className="copilot-response-grid">
            {responseCards.map((card) => (
              <div key={card.title} className="copilot-response-card">
                <strong>{card.title}</strong>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
          <div className="copilot-confidence">
            <span>{copy.response.confidence}</span>
            <strong>94%</strong>
          </div>
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
