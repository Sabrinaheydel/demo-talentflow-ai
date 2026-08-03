"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { TopHeader } from "../../components/layout/TopHeader";
import { PipelineBoard } from "../../components/recruitment/PipelineBoard";

export default function PipelinePage() {
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
      <Sidebar language={language} activeItem="pipeline" />

      <div className="main-panel">
        <TopHeader
          language={language}
          currentLanguage={language}
          onLanguageChange={setLanguage}
        />

        <main className="main-content">
          <PipelineBoard language={language} />
        </main>
      </div>
    </div>
  );
}
