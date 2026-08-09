import { BriefingInsight } from "../../lib/dashboardBriefing";

type InsightsPanelProps = {
  language: "en" | "fr";
  insights: BriefingInsight[];
};

export function InsightsPanel({ language, insights }: InsightsPanelProps) {
  return (
    <div className="insights-panel" data-guided-target="ai-insights">
      {insights.map((item) => (
        <div key={item.id} className="recommendation-card">
          <div className="recommendation-card__top">
            <div>
              <p className="recommendation-card__title">{item.signal}</p>
              <p className="recommendation-card__subtitle">{item.impact}</p>
            </div>
            <span className={`severity-pill ${item.urgency === "high" ? "severity-pill--high" : item.urgency === "medium" ? "severity-pill--medium" : "severity-pill--low"}`}>
              {item.urgency === "high"
                ? language === "en" ? "High urgency" : "Urgence elevee"
                : item.urgency === "medium"
                  ? language === "en" ? "Medium urgency" : "Urgence moyenne"
                  : language === "en" ? "Low urgency" : "Urgence faible"}
            </span>
          </div>
          <p className="recommendation-card__body">
            <strong>{language === "en" ? "Action:" : "Action :"}</strong> {item.recommendedAction}
          </p>
          <p className="recommendation-card__owner">
            <strong>{language === "en" ? "Owner:" : "Responsable :"}</strong> {item.suggestedOwner}
          </p>
          <div className="recommendation-card__meta-grid">
            <span className="badge badge--neutral">{language === "en" ? "Signal" : "Signal"}</span>
            <span className="badge badge--primary">{language === "en" ? "Impact" : "Impact"}</span>
            <span className="badge badge--warning">{language === "en" ? "Urgency" : "Urgence"}</span>
            <span className="badge badge--success">{language === "en" ? "Next action" : "Action suivante"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
