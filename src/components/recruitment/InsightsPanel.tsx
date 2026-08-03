type InsightsPanelProps = {
  language: "en" | "fr";
};

const recommendations = [
  {
    titleEn: "Counter-offer risk",
    titleFr: "Risque de contre-offre",
    subtitleEn: "Candidate: Lucas Martin",
    subtitleFr: "Candidat : Lucas Martin",
    bodyEn: "Offer acceptance is 94%. Recommended action: schedule interview within 24h.",
    bodyFr: "La probabilité d’acceptation est de 94 %. Action recommandée : programmer un entretien dans les 24 h.",
    confidence: "94%",
  },
  {
    titleEn: "Strong referral signal",
    titleFr: "Signal de recommandation fort",
    subtitleEn: "Priority: shortlist for final loop",
    subtitleFr: "Priorité : présélection pour la boucle finale",
    bodyEn: "The profile matches the role with high confidence and low drop-off risk.",
    bodyFr: "Le profil correspond au poste avec une forte confiance et un faible risque d’abandon.",
    confidence: "91%",
  },
  {
    titleEn: "Delayed decision",
    titleFr: "Décision tardive",
    subtitleEn: "Action: send comp benchmark today",
    subtitleFr: "Action : envoyer la référence salariale aujourd’hui",
    bodyEn: "Two offers need a decision before Thursday to protect momentum.",
    bodyFr: "Deux offres doivent être décidées avant jeudi pour préserver l’élan.",
    confidence: "88%",
  },
];

export function InsightsPanel({ language }: InsightsPanelProps) {
  return (
    <div className="insights-panel">
      {recommendations.map((item) => (
        <div key={item.titleEn} className="recommendation-card">
          <div className="recommendation-card__top">
            <div>
              <p className="recommendation-card__title">
                {language === "en" ? item.titleEn : item.titleFr}
              </p>
              <p className="recommendation-card__subtitle">
                {language === "en" ? item.subtitleEn : item.subtitleFr}
              </p>
            </div>
            <span className="recommendation-card__confidence">{item.confidence}</span>
          </div>
          <p className="recommendation-card__body">
            {language === "en" ? item.bodyEn : item.bodyFr}
          </p>
        </div>
      ))}
    </div>
  );
}
