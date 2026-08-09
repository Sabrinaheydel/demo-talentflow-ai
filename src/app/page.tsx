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
import { ExecutiveBriefing } from "../components/dashboard/ExecutiveBriefing";
import { buildBriefingPacket } from "../lib/dashboardBriefing";
import { useDemoExperience } from "../lib/demoExperience";

export default function Home() {
  const [language, setLanguage] = useState<"en" | "fr">("en");
  const [hydrated, setHydrated] = useState(false);
  const {
    state,
    addStoryStep,
    setActiveBriefingType,
    setCoverMode,
    completeCatchUp,
    setDashboardBriefingMeta,
  } = useDemoExperience();

  const briefingPacket = buildBriefingPacket(state.dashboard.activeBriefingType, state, language);

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

  useEffect(() => {
    setDashboardBriefingMeta({
      briefingType: briefingPacket.briefingType,
      title: briefingPacket.title,
      prioritySelection: briefingPacket.priorityOne.id,
      estimatedCatchUpMinutes: briefingPacket.estimatedCatchUpMinutes,
      scenarioId: briefingPacket.scenarioId,
    });
  }, [
    briefingPacket.briefingType,
    briefingPacket.estimatedCatchUpMinutes,
    briefingPacket.priorityOne.id,
    briefingPacket.scenarioId,
    briefingPacket.title,
    setDashboardBriefingMeta,
  ]);

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
          <ExecutiveBriefing
            language={language}
            packet={briefingPacket}
            activeBriefingType={state.dashboard.activeBriefingType}
            onBriefingTypeChange={(nextType) => {
              setActiveBriefingType(nextType);
              setCoverMode(nextType === "cover");
            }}
            onPrimaryAction={() => {
              completeCatchUp();
              addStoryStep(language === "en" ? "Executive catch-up launched" : "Rattrapage executif demarre");
            }}
          />

          <StatsGrid language={language} kpis={briefingPacket.kpis} />

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
              title={language === "en" ? "AI decision insights" : "Insights IA de décision"}
              description={language === "en" ? "Signal, impact, urgency and owner" : "Signal, impact, urgence et responsable"}
            >
              <InsightsPanel language={language} insights={briefingPacket.insights} />
            </Card>

            <Card
              title={language === "en" ? "Priority actions" : "Actions prioritaires"}
              description={language === "en" ? "Explicit actions with owner, urgency and impact" : "Actions explicites avec responsable, urgence et impact"}
            >
              <PriorityActions language={language} actions={briefingPacket.recommendedActions} />
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
