"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { TopHeader } from "../../components/layout/TopHeader";
import { TeamPage } from "../../components/recruitment/TeamPage";

export default function TeamRoutePage() {
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
      <Sidebar language={language} activeItem="team" />
      <div className="main-panel">
        <TopHeader language={language} currentLanguage={language} onLanguageChange={setLanguage} />
        <main className="main-content">
          <TeamPage language={language} />
        </main>
      </div>
    </div>
  );
}
