"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";

const experienceTimeline = [
  {
    title: "Senior Staff ML Engineer",
    company: "Northstar Labs",
    period: "2022 — Present",
    summary: "Led the AI recruiting orchestration platform and shipped a real-time ranking engine.",
  },
  {
    title: "Principal Product Engineer",
    company: "SignalForge",
    period: "2019 — 2022",
    summary: "Built multi-signal candidate intelligence surfaces for enterprise hiring teams.",
  },
  {
    title: "Software Engineer",
    company: "Apex Cloud",
    period: "2016 — 2019",
    summary: "Delivered onboarding automation and analytics workflows that improved productivity by 31%.",
  },
];

const skillMatrix = [
  { name: "Machine Learning", score: 95 },
  { name: "Data Storytelling", score: 91 },
  { name: "Product Strategy", score: 88 },
  { name: "Leadership", score: 87 },
  { name: "Hiring Analytics", score: 93 },
];

const recommendations = [
  {
    title: "Advance to executive review",
    body: "Strong cross-functional depth and clear impact on hiring efficiency make this profile a top-tier shortlist candidate.",
    confidence: "96% fit",
  },
  {
    title: "Book a leadership panel",
    body: "The candidate’s product and ML experience makes a leadership conversation particularly valuable.",
    confidence: "92% value",
  },
  {
    title: "Prepare a compensation narrative",
    body: "There is room to anchor the offer around equity and growth opportunities given market positioning.",
    confidence: "89% readiness",
  },
];

const risks = [
  "Extended notice period may compress the start window.",
  "Compensation expectations sit above the current band midpoint.",
  "The candidate has recently completed several interviews and may be evaluating multiple offers.",
];

const questions = [
  "How have you built trust across recruiting, product, and engineering stakeholders?",
  "Which hiring outcomes have you influenced most directly with data-driven systems?",
  "What would your ideal team environment look like in the next 12 months?",
];

const documents = [
  { label: "CV", type: "PDF • 4 pages" },
  { label: "Cover Letter", type: "PDF • 1 page" },
  { label: "Portfolio", type: "Web preview" },
  { label: "LinkedIn", type: "Profile synced" },
];

const activity = [
  { title: "Interview prep shared", body: "AI summary and scorecard published to the hiring team.", time: "13 min ago" },
  { title: "Document review completed", body: "Recruiter team reviewed portfolio and case studies.", time: "42 min ago" },
  { title: "Pipeline movement", body: "Moved from warm intro to executive shortlist.", time: "1 hr ago" },
];

export default function CandidateProfilePage() {
  const [language, setLanguage] = useState<"en" | "fr">("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("talentflow-language");
    if (stored === "en" || stored === "fr") {
      setLanguage(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("talentflow-language", language);
  }, [hydrated, language]);

  const copy = language === "en"
    ? {
        eyebrow: "Phase 3 • Talent intelligence",
        title: "Candidate AI Profile",
        subtitle: "Premium, recruiter-ready view of a top-priority opportunity",
        overview: "Overview",
        currentRole: "Current role",
        location: "Location",
        salary: "Salary expectation",
        availability: "Availability",
        match: "AI Match Score",
        aiSummary: "AI Summary",
        summaryText:
          "A rare blend of product, machine learning, and hiring systems expertise. This candidate has a strong record of turning fragmented recruiting data into clear decision frameworks and measurable improvements in speed-to-hire.",
        experience: "Experience Timeline",
        skills: "Skills radar",
        probability: "Hiring probability",
        notes: "Interview notes",
        recommendations: "AI Recommendations",
        risks: "Risks",
        questions: "Suggested interview questions",
        documents: "Documents",
        activity: "Activity Timeline",
        profileAction: "Schedule screen",
        exportAction: "Export notes",
        availabilityText: "Available in 3 weeks",
        summaryBadge: "Recruiter ready",
        locationValue: "Remote • New York, US",
        salaryValue: "$210k — $240k",
        roleValue: "Senior Product Engineer",
        name: "Maya Chen",
        probabilityValue: "86%",
        probabilityLabel: "High confidence",
        notesList: [
          "Excellent communicator with strong executive presence.",
          "Demonstrated measurable impact on hiring velocity and interview quality.",
          "Needs a clear narrative around team leadership expectations.",
        ],
      }
    : {
        eyebrow: "Phase 3 • Intelligence talent",
        title: "Profil IA du candidat",
        subtitle: "Vue premium, prête pour les recruteurs, d’une opportunité prioritaire",
        overview: "Aperçu",
        currentRole: "Poste actuel",
        location: "Localisation",
        salary: "Attentes salariales",
        availability: "Disponibilité",
        match: "Score de matching IA",
        aiSummary: "Résumé IA",
        summaryText:
          "Un mélange rare d’expertise produit, machine learning et systèmes RH. Ce candidat a déjà transformé des données de recrutement fragmentées en cadres de décision clairs, avec des gains mesurables sur la rapidité d’embauche.",
        experience: "Chronologie d’expérience",
        skills: "Radar des compétences",
        probability: "Probabilité d’embauche",
        notes: "Notes d’entretien",
        recommendations: "Recommandations IA",
        risks: "Risques",
        questions: "Questions d’entretien suggérées",
        documents: "Documents",
        activity: "Chronologie d’activité",
        profileAction: "Planifier un entretien",
        exportAction: "Exporter les notes",
        availabilityText: "Disponible dans 3 semaines",
        summaryBadge: "Prêt recruteur",
        locationValue: "Télétravail • New York, États-Unis",
        salaryValue: "210k$ — 240k$",
        roleValue: "Ingénieure produit senior",
        name: "Maya Chen",
        probabilityValue: "86%",
        probabilityLabel: "Haute confiance",
        notesList: [
          "Excellente communicante avec une forte présence auprès des dirigeants.",
          "Impact mesurable sur la vitesse d’embauche et la qualité des entretiens.",
          "Besoin d’un récit clair sur les attentes de leadership d’équipe.",
        ],
      };

  return (
    <div className="app-shell">
      <Sidebar language={language} activeItem="pipeline" />

      <div className="main-panel">
        <header className="top-header">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
            <p className="hero-panel__text">{copy.subtitle}</p>
          </div>

          <div className="top-header__actions">
            <div className="language-switch" role="tablist" aria-label="Language switch">
              <button
                type="button"
                className={language === "en" ? "is-active" : ""}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
              <button
                type="button"
                className={language === "fr" ? "is-active" : ""}
                onClick={() => setLanguage("fr")}
              >
                FR
              </button>
            </div>
            <button type="button" className="btn btn--secondary">
              {copy.exportAction}
            </button>
            <button type="button" className="btn btn--primary">
              {copy.profileAction}
            </button>
          </div>
        </header>

        <main className="main-content">
          <section className="candidate-hero">
            <div className="candidate-hero__identity">
              <div className="candidate-avatar">MC</div>
              <div>
                <div className="candidate-hero__row">
                  <h2>{copy.name}</h2>
                  <Badge label={copy.summaryBadge} tone="primary" />
                </div>
                <p className="candidate-hero__role">{copy.roleValue}</p>
                <div className="candidate-hero__meta">
                  <span>{copy.locationValue}</span>
                  <span>{copy.salaryValue}</span>
                  <span>{copy.availabilityText}</span>
                </div>
              </div>
            </div>

            <div className="candidate-hero__insights">
              <div className="candidate-score-card">
                <p>{copy.match}</p>
                <strong>96%</strong>
              </div>
              <div className="candidate-score-card candidate-score-card--soft">
                <p>{copy.probability}</p>
                <strong>{copy.probabilityValue}</strong>
              </div>
            </div>
          </section>

          <div className="content-grid">
            <Card title={copy.aiSummary} description={copy.overview}>
              <div className="candidate-summary-card">
                <p>{copy.summaryText}</p>
                <div className="candidate-summary__chips">
                  <Badge label="AI-powered" tone="success" />
                  <Badge label="Leadership-ready" tone="warning" />
                  <Badge label="High signal" tone="neutral" />
                </div>
              </div>
            </Card>

            <Card title={copy.skills} description="Signal strength across the role profile">
              <div className="skill-list">
                {skillMatrix.map((skill) => (
                  <div key={skill.name} className="skill-row">
                    <div className="skill-row__meta">
                      <strong>{skill.name}</strong>
                      <span>{skill.score}%</span>
                    </div>
                    <div className="skill-bar-track">
                      <div className="skill-bar-fill" style={{ width: `${skill.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="content-grid">
            <Card title={copy.experience} description="Career progression and leadership context">
              <div className="timeline-list">
                {experienceTimeline.map((item) => (
                  <div key={item.title} className="timeline-item">
                    <div className="timeline-item__marker" />
                    <div>
                      <div className="timeline-item__top">
                        <strong>{item.title}</strong>
                        <span>{item.period}</span>
                      </div>
                      <p className="timeline-item__company">{item.company}</p>
                      <p className="timeline-item__body">{item.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title={copy.probability} description="Current confidence from the hiring model">
              <div className="probability-card">
                <div className="probability-card__value">{copy.probabilityValue}</div>
                <p>{copy.probabilityLabel}</p>
                <div className="probability-meter">
                  <div className="probability-meter__fill" style={{ width: "86%" }} />
                </div>
                <div className="probability-card__meta">
                  <span>Strong hiring intent</span>
                  <span>Fast-moving shortlist</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="content-grid">
            <Card title={copy.notes} description="Signals surfaced during recent conversations">
              <ul className="bullet-list">
                {copy.notesList.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </Card>

            <Card title={copy.recommendations} description="AI-recommended next moves">
              <div className="stack-list">
                {recommendations.map((item) => (
                  <div key={item.title} className="recommendation-card">
                    <div className="recommendation-card__top">
                      <div>
                        <h4 className="recommendation-card__title">{item.title}</h4>
                        <p className="recommendation-card__subtitle">{item.body}</p>
                      </div>
                      <span className="recommendation-card__confidence">{item.confidence}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="content-grid">
            <Card title={copy.risks} description="Potential blockers to address early">
              <ul className="bullet-list bullet-list--warning">
                {risks.map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </Card>

            <Card title={copy.questions} description="Conversation starters for the next interview">
              <ul className="bullet-list bullet-list--accent">
                {questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="content-grid">
            <Card title={copy.documents} description="Material readiness and source links">
              <div className="document-list">
                {documents.map((document) => (
                  <div key={document.label} className="document-card">
                    <div>
                      <strong>{document.label}</strong>
                      <p>{document.type}</p>
                    </div>
                    <button type="button" className="btn btn--ghost">
                      Open
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            <Card title={copy.activity} description="The latest recruiting signals on this profile">
              <div className="timeline-list timeline-list--compact">
                {activity.map((item) => (
                  <div key={item.title} className="timeline-item">
                    <div className="timeline-item__marker" />
                    <div>
                      <div className="timeline-item__top">
                        <strong>{item.title}</strong>
                        <span>{item.time}</span>
                      </div>
                      <p className="timeline-item__body">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
