"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "fr";

type LanguageContextValue = {
  language: Language;
  setLanguage: (value: Language) => void;
  hydrated: boolean;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const translations = {
  en: {
    dashboard: "Dashboard",
    pipeline: "Pipeline",
    candidates: "Candidates",
    copilot: "Copilot",
    interviews: "Interviews",
    team: "Team",
    demoLabel: "Demo data",
    loading: "Loading demo experience…",
  },
  fr: {
    dashboard: "Tableau de bord",
    pipeline: "Pipeline",
    candidates: "Candidats",
    copilot: "Copilot",
    interviews: "Entretiens",
    team: "Équipe",
    demoLabel: "Données de démo",
    loading: "Chargement de l’expérience de démo…",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
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
    document.documentElement.lang = language;
  }, [hydrated, language]);

  const value = useMemo(
    () => ({ language, setLanguage, hydrated }),
    [language, hydrated],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
