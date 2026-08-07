"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { TopHeader } from "../../components/layout/TopHeader";
import { InterviewsPage } from "../../components/recruitment/InterviewsPage";

export default function InterviewsRoutePage() {
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
      <Sidebar language={language} activeItem="interviews" />
      <div className="main-panel">
        <TopHeader language={language} currentLanguage={language} onLanguageChange={setLanguage} />
        <main className="main-content">
          <InterviewsPage language={language} />
        </main>
      </div>
    </div>
  );
}
