"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { TopHeader } from "../components/layout/TopHeader";
import { Card } from "../components/ui/Card";
import { StatsGrid } from "../components/dashboard/StatsGrid";
import { FunnelChart } from "../components/dashboard/FunnelChart";
import { RecentCandidatesTable } from "../components/dashboard/RecentCandidatesTable";
import { UpcomingInterviews } from "../components/dashboard/UpcomingInterviews";
import { InsightsPanel } from "../components/recruitment/InsightsPanel";
import { PriorityActions } from "../components/recruitment/PriorityActions";
import Link from "next/link";
import { translations } from "../lib/i18n";

export default function Home() {
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

  return (
    <div className="app-shell">
      <Sidebar language={language} activeItem="dashboard" />

      <div className="main-panel">
        <TopHeader
          language={language}
          currentLanguage={language}
          onLanguageChange={setLanguage}
        />

        <main className="main-content">
          <section className="hero-panel">
            <div className="hero-panel__content">
              <p className="eyebrow">
                {language === "en" ? "AI hiring command center" : "Centre de commande RH IA"}
              </p>
              <h2>
                {language === "en"
                  ? "Good morning, Sabrina"
                  : "Bonjour, Sabrina"}
              </h2>
              <p className="hero-panel__text">
                {language === "en"
                  ? "You are pacing ahead of plan with a strong shortlist and faster time-to-offer."
                  : "Vous êtes en avance sur le plan avec une shortlist solide et un délai d’offre plus rapide."}
              </p>
              <p className="demo-disclaimer">
                {language === "en"
                  ? "Demo note: candidate data and AI outputs are simulated for product presentation."
                  : "Note de démo : les données candidats et les sorties IA sont simulées pour la présentation du produit."}
              </p>
              <div className="candidate-summary__chips" style={{ marginTop: "14px" }}>
                <span className="demo-pill">{translations[language].demoLabel}</span>
                <Link href="/candidate-profile" className="btn btn--primary">
                  {language === "en" ? "Open AI candidate profile" : "Ouvrir le profil IA du candidat"}
                </Link>
              </div>
            </div>
            <div className="hero-metrics">
              <div className="metric-pill">
                <span>{language === "en" ? "AI Confidence Score" : "Score de confiance IA"}</span>
                <strong>94%</strong>
              </div>
              <div className="metric-pill">
                <span>{language === "en" ? "Hiring Velocity" : "Vitesse d’embauche"}</span>
                <strong>+18%</strong>
              </div>
              <div className="metric-pill">
                <span>{language === "en" ? "Weekly Performance" : "Performance hebdo"}</span>
                <strong>7.2x</strong>
              </div>
              <div className="metric-pill">
                <span>{language === "en" ? "Last sync" : "Dernière sync"}</span>
                <strong>2 min ago</strong>
              </div>
            </div>
          </section>

          <StatsGrid language={language} />

          <div className="content-grid">
            <Card
              title={language === "en" ? "Hiring funnel" : "Entonnoir de recrutement"}
              description={language === "en" ? "Conversion from application to hire" : "Conversion des candidatures jusqu’au recrutement"}
            >
              <FunnelChart language={language} />
            </Card>

            <Card
              title={language === "en" ? "Upcoming interviews" : "Entretiens à venir"}
              description={language === "en" ? "Your next priorities" : "Vos prochaines priorités"}
            >
              <UpcomingInterviews language={language} />
            </Card>

            <Card
              title={language === "en" ? "Recent candidates" : "Candidats récents"}
              description={language === "en" ? "Latest high-potential profiles" : "Derniers profils à fort potentiel"}
            >
              <RecentCandidatesTable language={language} />
            </Card>

            <Card
              title={language === "en" ? "AI insights" : "Résultats IA"}
              description={language === "en" ? "Live hiring intelligence" : "Intelligence de recrutement en direct"}
            >
              <InsightsPanel language={language} />
            </Card>

            <Card
              title={language === "en" ? "Priority actions" : "Actions prioritaires"}
              description={language === "en" ? "The work that needs attention now" : "Les tâches qui demandent une attention immédiate"}
            >
              <PriorityActions language={language} />
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
