import { Icon } from "../ui/Icon";
import { BriefingKpi } from "../../lib/dashboardBriefing";

type StatsGridProps = {
  language: "en" | "fr";
  kpis: BriefingKpi[];
};

const iconByIndex = ["users", "arrow", "briefcase", "calendar", "trend", "spark"] as const;

export function StatsGrid({ language, kpis }: StatsGridProps) {
  return (
    <div className="stats-grid" data-guided-target="decision-kpis">
      {kpis.map((kpi, index) => (
        <div key={kpi.id} className="stat-card stat-card--hover stat-card--decision">
          <div className="stat-card__top">
            <div className="stat-icon">
              <Icon name={iconByIndex[index % iconByIndex.length]} size={16} />
            </div>
            <span className={`trend-badge ${kpi.status === "at-risk" ? "trend-badge--down" : "trend-badge--up"}`}>
              {kpi.delta}
            </span>
          </div>
          <p className="stat-card__value">{kpi.value}</p>
          <p className="stat-card__label">{kpi.label}</p>
          <p className="stat-card__meta">{kpi.meaning}</p>
          <div className="stat-card__foot">
            <span className={`badge ${kpi.status === "at-risk" ? "badge--danger" : kpi.status === "watch" ? "badge--warning" : "badge--success"}`}>
              {kpi.status === "at-risk"
                ? language === "en" ? "At risk" : "A risque"
                : kpi.status === "watch"
                  ? language === "en" ? "Watch" : "Surveiller"
                  : language === "en" ? "On track" : "Sur la bonne voie"}
            </span>
            {kpi.action ? <span className="stat-card__action">{kpi.action}</span> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
