import { useState } from "react";
import { Icon } from "../ui/Icon";
import { translations, useLanguage } from "../../lib/i18n";
import { useDemoExperience } from "../../lib/demoExperience";

type TopHeaderProps = {
  language: "en" | "fr";
  currentLanguage: "en" | "fr";
  onLanguageChange: (value: "en" | "fr") => void;
};

export function TopHeader({
  language,
  currentLanguage,
  onLanguageChange,
}: TopHeaderProps) {
  const { setLanguage } = useLanguage();
  const { state, resetDemo, replayGuidedDemo } = useDemoExperience();
  const [toast, setToast] = useState<string | null>(null);
  const [modal, setModal] = useState<{ title: string; description: string; confirmLabel: string; message: string } | null>(null);
  const copy = translations[language];

  const handleLanguageChange = (value: "en" | "fr") => {
    onLanguageChange(value);
    setLanguage(value);
  };

  return (
    <header className="top-header">
      <div className="top-header__intro">
        <p className="eyebrow">
          {language === "en" ? "Executive overview" : "Vue d’ensemble exécutive"}
        </p>
        <h1>{language === "en" ? "TalentFlow recruitment HQ" : "Quartier général RH TalentFlow"}</h1>
        <p className="public-beta-badge">
          <span className="public-beta-badge__dot" aria-hidden="true" />
          {language === "en"
            ? "Public beta · Simulated recruitment data"
            : "Bêta publique · Données de recrutement simulées"}
        </p>
      </div>

      <div className="top-header__actions">
        <button type="button" className="icon-button icon-button--soft" aria-label={copy.notifications}>
          <Icon name="bell" size={16} />
          <span className="badge-dot" />
        </button>
        <div className="language-switch" role="tablist" aria-label={copy.languageSwitch}>
          <button
            type="button"
            className={currentLanguage === "en" ? "is-active" : ""}
            onClick={() => handleLanguageChange("en")}
          >
            EN
          </button>
          <button
            type="button"
            className={currentLanguage === "fr" ? "is-active" : ""}
            onClick={() => handleLanguageChange("fr")}
          >
            FR
          </button>
        </div>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={replayGuidedDemo}
        >
          {state.guidedDemo.running
            ? (language === "en" ? "Restart guided demo" : "Redémarrer la démo guidée")
            : (language === "en" ? "Replay guided demo" : "Rejouer la démo guidée")}
        </button>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => setModal({
            title: copy.exportReport,
            description: language === "en"
              ? "This demo action packages the current hiring snapshot into a polished report for stakeholders."
              : "Cette action de démonstration prépare un rapport soigné du snapshot actuel pour les parties prenantes.",
            confirmLabel: copy.exportReport,
            message: language === "en" ? "Report exported for demo review" : "Rapport exporté pour la démo",
          })}
        >
          {copy.exportReport}
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            resetDemo();
            setToast(language === "en" ? "Demo reset to the baseline story" : "Démo réinitialisée au scénario de base");
          }}
        >
          {copy.resetDemo}
        </button>
      </div>

      {modal ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h4>{modal.title}</h4>
            <p>{modal.description}</p>
            <div className="modal-actions">
              <button type="button" className="btn btn--secondary" onClick={() => setModal(null)}>
                {copy.cancel}
              </button>
              <button type="button" className="btn btn--primary" onClick={() => { setToast(modal.message); setModal(null); }}>
                {modal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? <div className="toast" role="status">{toast}</div> : null}
    </header>
  );
}
