type FunnelChartProps = {
  language: "en" | "fr";
};

const stages = [
  { labelEn: "Applied", labelFr: "Candidatures", value: "128", width: "100%" },
  { labelEn: "Screening", labelFr: "Pré-sélection", value: "84", width: "68%" },
  { labelEn: "Interview", labelFr: "Entretien", value: "24", width: "44%" },
  { labelEn: "Offer", labelFr: "Offre", value: "9", width: "24%" },
  { labelEn: "Hired", labelFr: "Recruté", value: "4", width: "12%" },
];

export function FunnelChart({ language }: FunnelChartProps) {
  return (
    <div className="funnel-chart">
      {stages.map((stage) => (
        <div key={stage.labelEn} className="funnel-step">
          <div className="funnel-step__meta">
            <span>{language === "en" ? stage.labelEn : stage.labelFr}</span>
            <strong>{stage.value}</strong>
          </div>
          <div className="funnel-bar-track">
            <div className="funnel-bar-fill" style={{ width: stage.width }} />
          </div>
        </div>
      ))}
    </div>
  );
}
