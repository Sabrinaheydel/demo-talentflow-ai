type PriorityActionsProps = {
  language: "en" | "fr";
};

export function PriorityActions({ language }: PriorityActionsProps) {
  return (
    <div className="priority-list">
      <div className="priority-item">
        <div>
          <p className="priority-item__title">
            {language === "en" ? "Schedule final interviews" : "Planifier les entretiens finaux"}
          </p>
          <p className="priority-item__meta">
            {language === "en" ? "4 candidates ready for decision" : "4 candidats prêts pour décision"}
          </p>
        </div>
        <button type="button" className="btn btn--primary">
          {language === "en" ? "Review" : "Examiner"}
        </button>
      </div>
      <div className="priority-item">
        <div>
          <p className="priority-item__title">
            {language === "en" ? "Approve compensation bands" : "Approuver les grilles salariales"}
          </p>
          <p className="priority-item__meta">
            {language === "en" ? "2 roles need benchmark review" : "2 postes nécessitent une comparaison de marché"}
          </p>
        </div>
        <button type="button" className="btn btn--secondary">
          {language === "en" ? "Open" : "Ouvrir"}
        </button>
      </div>
    </div>
  );
}
