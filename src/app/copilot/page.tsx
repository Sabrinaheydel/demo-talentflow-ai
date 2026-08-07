"use client";

import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { TopHeader } from "../../components/layout/TopHeader";
import { CopilotWorkspace } from "../../components/copilot/CopilotWorkspace";

function readInitialContext() {
  if (typeof window === "undefined") {
    return { candidateId: undefined, mode: undefined };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    candidateId: params.get("candidate") ?? undefined,
    mode: params.get("mode") ?? undefined,
  };
}

export default function CopilotPage() {
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

  const initialContext = useMemo(() => readInitialContext(), []);

  return (
    <div className="app-shell">
      <Sidebar language={language} activeItem="copilot" />

      <div className="main-panel">
        <TopHeader
          language={language}
          currentLanguage={language}
          onLanguageChange={setLanguage}
        />

        <main className="main-content">
          <CopilotWorkspace language={language} initialContext={initialContext} />
        </main>
      </div>
    </div>
  );
}
