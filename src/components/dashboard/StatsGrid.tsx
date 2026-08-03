import { Icon } from "../ui/Icon";

type StatsGridProps = {
  language: "en" | "fr";
};

const stats = [
  {
    key: "candidates",
    value: "128",
    trend: "+12%",
    spark: [4, 6, 5, 7, 8, 7],
    labelEn: "Candidates",
    labelFr: "Candidats",
    icon: "users" as const,
  },
  {
    key: "interviews",
    value: "24",
    trend: "+8%",
    spark: [3, 4, 3, 5, 6, 5],
    labelEn: "Interviews",
    labelFr: "Entretiens",
    icon: "calendar" as const,
  },
  {
    key: "offers",
    value: "9",
    trend: "+3%",
    spark: [2, 3, 3, 4, 4, 5],
    labelEn: "Offers",
    labelFr: "Offres",
    icon: "briefcase" as const,
  },
  {
    key: "hires",
    value: "4",
    trend: "+15%",
    spark: [1, 2, 2, 3, 3, 4],
    labelEn: "Hires",
    labelFr: "Recrutements",
    icon: "spark" as const,
  },
  {
    key: "jobs",
    value: "7",
    trend: "-4%",
    spark: [4, 4, 3, 3, 2, 2],
    labelEn: "Open jobs",
    labelFr: "Postes ouverts",
    icon: "trend" as const,
  },
  {
    key: "review",
    value: "18",
    trend: "+6%",
    spark: [2, 3, 3, 4, 5, 4],
    labelEn: "To review",
    labelFr: "À revoir",
    icon: "arrow" as const,
  },
];

export function StatsGrid({ language }: StatsGridProps) {
  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <div key={stat.key} className="stat-card stat-card--hover">
          <div className="stat-card__top">
            <div className="stat-icon">
              <Icon name={stat.icon} size={16} />
            </div>
            <span className={`trend-badge ${stat.trend.startsWith("-") ? "trend-badge--down" : "trend-badge--up"}`}>
              {stat.trend}
            </span>
          </div>
          <p className="stat-card__value">{stat.value}</p>
          <p className="stat-card__label">{language === "en" ? stat.labelEn : stat.labelFr}</p>
          <div className="sparkline" aria-hidden="true">
            {stat.spark.map((point, index) => (
              <span key={`${stat.key}-${index}`} style={{ height: `${point * 8}px` }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
