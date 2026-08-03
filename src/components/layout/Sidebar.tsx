import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../ui/Icon";

type SidebarProps = {
  language: "en" | "fr";
  activeItem: string;
};

const navItems = {
  en: [
    { id: "dashboard", label: "Dashboard", icon: "grid" as const },
    { id: "pipeline", label: "Pipeline", icon: "briefcase" as const },
    { id: "copilot", label: "Copilot", icon: "spark" as const },
    { id: "interviews", label: "Interviews", icon: "calendar" as const },
    { id: "team", label: "Team", icon: "users" as const },
  ],
  fr: [
    { id: "dashboard", label: "Tableau de bord", icon: "grid" as const },
    { id: "pipeline", label: "Pipeline", icon: "briefcase" as const },
    { id: "copilot", label: "Copilot", icon: "spark" as const },
    { id: "interviews", label: "Entretiens", icon: "calendar" as const },
    { id: "team", label: "Équipe", icon: "users" as const },
  ],
};

export function Sidebar({ language, activeItem }: SidebarProps) {
  const items = navItems[language];
  const pathname = usePathname();
  const activePath = pathname || "/";

  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-mark">TF</div>
        <div>
          <p className="brand-name">TalentFlow</p>
          <p className="brand-subtitle">AI Recruitment</p>
        </div>
      </div>

      <div className="workspace-card">
        <div className="workspace-card__title-row">
          <span className="workspace-card__dot" />
          <span>{language === "en" ? "Northstar Labs" : "Northstar Labs"}</span>
        </div>
        <p>{language === "en" ? "Growth hiring workspace" : "Espace de recrutement croissance"}</p>
      </div>

      <nav className="sidebar-nav" aria-label="Sidebar navigation">
        {items.map((item) => {
          const href = item.id === "dashboard" ? "/" : `/${item.id}`;
          const isActive = activePath === href || (item.id === "dashboard" && activePath === "/");

          return (
            <Link
              key={item.id}
              href={href}
              className={`sidebar-nav__item ${isActive ? "is-active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-panel">
          <p className="panel-title">{language === "en" ? "AI match rate" : "Taux de correspondance IA"}</p>
          <div className="panel-metric">94.2%</div>
          <p className="panel-text">
            {language === "en"
              ? "Strong alignment across the current pipeline."
              : "Un fort alignement sur le pipeline actuel."}
          </p>
        </div>

        <div className="sidebar-user">
          <div className="avatar avatar--sm">SH</div>
          <div>
            <p>Sabrina H.</p>
            <span>{language === "en" ? "Head of Talent" : "Responsable RH"}</span>
          </div>
          <button type="button" className="icon-button" aria-label="Settings">
            <Icon name="settings" size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
