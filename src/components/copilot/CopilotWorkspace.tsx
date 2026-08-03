"use client";

import { useMemo, useState } from "react";
import { Badge } from "../ui/Badge";
import { Icon } from "../ui/Icon";

type Language = "en" | "fr";

type Message = {
  id: number;
  author: "user" | "ai";
  text: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    author: "ai",
    text: "I’ve reviewed Maya Chen’s profile and can help you prepare a decision-ready follow-up."
  },
  {
    id: 2,
    author: "user",
    text: "Summarize the strongest evidence for moving her forward."
  },
];

const suggestedPrompts = [
  "Summarize candidate",
  "Compare candidates",
  "Generate interview questions",
  "Draft candidate email",
  "Detect hiring risks",
  "Recommend next action",
];

const actionItems = [
  "Summarize candidate",
  "Compare candidates",
  "Generate interview questions",
  "Draft candidate email",
  "Detect hiring risks",
  "Recommend next action",
];

const aiResponseMap: Record<string, string[]> = {
  "Summarize candidate": [
    "Advance Maya Chen to the executive review stage.",
    "Her profile combines strong product and analytics depth with a high confidence match and measurable hiring impact.",
    "The main risk is timing around notice and compensation expectations.",
    "Prepare a follow-up conversation within 48 hours.",
  ],
  "Compare candidates": [
    "Maya Chen outperforms the current shortlist on strategic depth and hiring-system impact.",
    "She is more differentiated than the other finalists in product and analytics alignment.",
    "The main gap is compensation flexibility rather than role fit.",
    "Keep her in the top tier for the next decision loop.",
  ],
  "Generate interview questions": [
    "Ask how she has influenced hiring velocity across cross-functional teams.",
    "Probe her approach to balancing product strategy with measurable adoption.",
    "Clarify what leadership model she prefers in the next chapter of her career.",
    "Close by testing for long-term mission fit and growth appetite.",
  ],
  "Draft candidate email": [
    "Send a concise note expressing interest in the next conversation and highlighting the strong fit.",
    "Reference her product leadership, analytics depth, and the opportunity to shape the team.",
    "Keep the message warm, confident, and a little urgent.",
    "Close with a clear invitation to a follow-up call this week.",
  ],
  "Detect hiring risks": [
    "The highest risk is a compressed notice period and the possibility of multiple competing offers.",
    "Compensation expectations also sit above the current benchmark range.",
    "Mitigation: personalize the narrative around impact, growth, and flexibility.",
    "Monitor signal quality closely over the next two days.",
  ],
  "Recommend next action": [
    "Schedule a leadership panel conversation and prepare a tailored offer narrative.",
    "Use the evidence from her profile and the recent interview signals to create urgency.",
    "Keep compensation conversations grounded in market benchmarks and growth upside.",
    "Flag her as a priority for the next executive hiring review.",
  ],
};

const candidateContext = {
  name: "Maya Chen",
  role: "Senior Product Engineer",
  match: "96%",
  probability: "86%",
  stage: "Interview",
  skills: ["Product strategy", "ML systems", "Analytics", "Leadership"],
  risks: ["Notice period", "Compensation band", "Multiple offers"],
};

export function CopilotWorkspace({ language }: { language: Language }) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [activeAction, setActiveAction] = useState("Summarize candidate");

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
        response: {
          recommendation: "Recommendation",
          evidence: "Evidence",
          risks: "Risks",
          nextStep: "Suggested next step",
          confidence: "Confidence score",
        },
        responseBody: [
          "Advance Maya Chen to the executive review stage with a leadership panel conversation.",
          "Strong evidence includes measurable impact on hiring velocity, high AI match quality, and clear signal depth across product and analytics work.",
          "Main risks are a compressed notice window, compensation expectations above the current band, and potential competing offers.",
          "Schedule a follow-up conversation within two days and prepare an offer narrative around growth and impact.",
        ],
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
        response: {
          recommendation: "Recommandation",
          evidence: "Preuves",
          risks: "Risques",
          nextStep: "Prochaine étape suggérée",
          confidence: "Score de confiance",
        },
        responseBody: [
          "Faites progresser Maya Chen vers l’étape de revue exécutive avec une conversation de panel leadership.",
          "Les preuves solides incluent un impact mesurable sur la vitesse d’embauche, une forte qualité de match IA et un riche signal sur le produit et l’analytique.",
          "Les principaux risques sont une fenêtre de départ courte, des attentes salariales au-dessus de la fourchette actuelle et des offres concurrentes.",
          "Planifiez une conversation de suivi sous deux jours et préparez une narration d’offre autour de la croissance et de l’impact.",
        ],
      };

  const responseCards = useMemo(() => {
    const response = aiResponseMap[activeAction] || aiResponseMap["Summarize candidate"];
    return [
      { title: copy.response.recommendation, body: response[0] },
      { title: copy.response.evidence, body: response[1] },
      { title: copy.response.risks, body: response[2] },
      { title: copy.response.nextStep, body: response[3] },
    ];
  }, [activeAction, copy]);

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
            {suggestedPrompts.map((prompt) => (
              <button key={prompt} type="button" className="copilot-prompt-pill" onClick={() => setDraft(prompt)}>
                {prompt}
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
            <button type="button" className="btn btn--secondary" disabled>
              {copy.attach}
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                if (!draft.trim()) return;
                setMessages((prev) => [
                  ...prev,
                  { id: prev.length + 1, author: "user", text: draft.trim() },
                  { id: prev.length + 2, author: "ai", text: `I’ve prepared a structured response for: ${draft.trim()}` },
                ]);
                setDraft("");
              }}
            >
              {copy.send}
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
            {actionItems.map((item) => (
              <button
                key={item}
                type="button"
                className={`copilot-action-item ${activeAction === item ? "is-active" : ""}`}
                onClick={() => setActiveAction(item)}
              >
                <span>{item}</span>
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
    </div>
  );
}
