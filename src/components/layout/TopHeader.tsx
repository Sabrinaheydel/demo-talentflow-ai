import { Icon } from "../ui/Icon";
import { useLanguage } from "../../lib/i18n";

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

  const handleLanguageChange = (value: "en" | "fr") => {
    onLanguageChange(value);
    setLanguage(value);
  };

  return (
    <header className="top-header">
      <div>
        <p className="eyebrow">
          {language === "en" ? "Executive overview" : "Vue d’ensemble exécutive"}
        </p>
        <h1>{language === "en" ? "TalentFlow recruitment HQ" : "Quartier général RH TalentFlow"}</h1>
      </div>

      <div className="top-header__actions">
        <button type="button" className="icon-button icon-button--soft" aria-label="Notifications">
          <Icon name="bell" size={16} />
          <span className="badge-dot" />
        </button>
        <div className="language-switch" role="tablist" aria-label="Language switch">
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
        <button type="button" className="btn btn--secondary" disabled>
          {language === "en" ? "Export report" : "Exporter le rapport"}
        </button>
      </div>
    </header>
  );
}
