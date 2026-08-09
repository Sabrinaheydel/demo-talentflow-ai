"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { GUIDED_DEMO_SCENES, type GuidedDemoSceneId, useDemoExperience } from "../../lib/demoExperience";
import { useLanguage } from "../../lib/i18n";

type SceneCopy = {
  lines: string[];
};

type GuidedCopy = {
  openingTitle: string;
  openingSubtitle: string;
  openingDuration: string;
  startCta: string;
  skip: string;
  replay: string;
  progressLabel: string;
  finalTitle: string;
  finalSubtitleLines: string[];
  finalCta: string;
  scenes: Record<GuidedDemoSceneId, SceneCopy>;
  chain: string[];
};

const copyByLanguage: Record<"en" | "fr", GuidedCopy> = {
  en: {
    openingTitle: "Welcome to TalentFlow",
    openingSubtitle: "A Product Builder demonstration.",
    openingDuration: "Duration: 90 seconds",
    startCta: "Start Guided Demo",
    skip: "Skip",
    replay: "Replay guided demo",
    progressLabel: "Guided demonstration",
    finalTitle: "Built with my AI Product Operating System",
    finalSubtitleLines: [
      "I don't ask AI to build products.",
      "I direct an AI Product Team.",
    ],
    finalCta: "Explore freely",
    scenes: {
      "scene-1": {
        lines: [
          "What happened: TalentFlow surfaces every critical change the moment you return.",
        ],
      },
      "scene-2": {
        lines: [
          "Why it matters: each KPI is a decision signal, not a passive report.",
        ],
      },
      "scene-3": {
        lines: [
          "What requires action: the system flags blockers, ownership gaps, and urgency.",
        ],
      },
      "scene-4": {
        lines: [
          "How AI helps: it proposes the next best move with explicit rationale.",
        ],
      },
      "scene-5": {
        lines: [
          "How execution is transparent: preview first, execute second, track impact end-to-end.",
        ],
      },
      "scene-6": {
        lines: [
          "Why every screen is synchronized: one shared state keeps every view aligned in real time.",
        ],
      },
      "scene-7": {
        lines: [],
      },
    },
    chain: [
      "Business Problem",
      "AI Strategist",
      "AI Architect",
      "AI Builder",
      "AI QA",
      "Human Review",
      "Release",
      "Continuous Iteration",
    ],
  },
  fr: {
    openingTitle: "Bienvenue dans TalentFlow",
    openingSubtitle: "Une démonstration de Product Builder.",
    openingDuration: "Durée : 90 secondes",
    startCta: "Démarrer la démo guidée",
    skip: "Passer",
    replay: "Rejouer la démo guidée",
    progressLabel: "Démonstration guidée",
    finalTitle: "Built with my AI Product Operating System",
    finalSubtitleLines: [
      "I don't ask AI to build products.",
      "I direct an AI Product Team.",
    ],
    finalCta: "Explorer librement",
    scenes: {
      "scene-1": {
        lines: [
          "Ce qui s'est passé : TalentFlow affiche immédiatement les changements critiques.",
        ],
      },
      "scene-2": {
        lines: [
          "Pourquoi c'est important : chaque KPI guide une décision concrète.",
        ],
      },
      "scene-3": {
        lines: [
          "Ce qui requiert une action : les blocages et urgences sont priorisés clairement.",
        ],
      },
      "scene-4": {
        lines: [
          "Comment l'IA aide : elle propose la meilleure action suivante avec justification.",
        ],
      },
      "scene-5": {
        lines: [
          "Comment l'exécution reste transparente : aperçu d'abord, exécution ensuite, impact visible.",
        ],
      },
      "scene-6": {
        lines: [
          "Pourquoi tous les écrans sont synchronisés : un état partagé maintient la cohérence.",
        ],
      },
      "scene-7": {
        lines: [],
      },
    },
    chain: [
      "Problème business",
      "AI Strategist",
      "AI Architect",
      "AI Builder",
      "AI QA",
      "Human Review",
      "Release",
      "Iteration continue",
    ],
  },
};

function routeMatches(pathname: string, route: string) {
  if (route === "/") return pathname === "/";
  if (route.startsWith("/copilot")) return pathname === "/copilot";
  return pathname === route;
}

export function GuidedDemoOverlay() {
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useLanguage();
  const {
    state,
    openActionIntent,
    startGuidedDemo,
    skipGuidedDemo,
    replayGuidedDemo,
    finishGuidedDemo,
    markGuidedDemoActionPreviewOpened,
  } = useDemoExperience();
  const [mounted, setMounted] = useState(false);
  const highlightedElRef = useRef<HTMLElement | null>(null);
  const sceneHandledRef = useRef<GuidedDemoSceneId | null>(null);

  const copy = copyByLanguage[language];
  const currentScene = state.guidedDemo.running ? GUIDED_DEMO_SCENES[state.guidedDemo.sceneIndex] : null;
  const progress = useMemo(
    () => (state.guidedDemo.running ? ((state.guidedDemo.sceneIndex + 1) / GUIDED_DEMO_SCENES.length) * 100 : 0),
    [state.guidedDemo.running, state.guidedDemo.sceneIndex],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!currentScene) {
      if (highlightedElRef.current) {
        highlightedElRef.current.classList.remove("guided-demo-target--active");
        highlightedElRef.current = null;
      }
      return;
    }

    if (highlightedElRef.current) {
      highlightedElRef.current.classList.remove("guided-demo-target--active");
      highlightedElRef.current = null;
    }

    if (!currentScene.target) return;

    const element = document.querySelector<HTMLElement>(`[data-guided-target=\"${currentScene.target}\"]`);
    if (!element) return;

    element.classList.add("guided-demo-target--active");
    element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    highlightedElRef.current = element;

    return () => {
      if (element.classList.contains("guided-demo-target--active")) {
        element.classList.remove("guided-demo-target--active");
      }
    };
  }, [currentScene]);

  useEffect(() => {
    if (!currentScene) {
      sceneHandledRef.current = null;
      return;
    }

    if (sceneHandledRef.current === currentScene.id) return;
    sceneHandledRef.current = currentScene.id;

    if (!routeMatches(pathname, currentScene.route)) {
      router.replace(currentScene.route);
    }

    if (currentScene.id === "scene-4" && !state.guidedDemo.actionPreviewOpened) {
      openActionIntent({ actionId: "validate-maya-salary", language });
      markGuidedDemoActionPreviewOpened();
    }
  }, [
    currentScene,
    language,
    markGuidedDemoActionPreviewOpened,
    openActionIntent,
    pathname,
    router,
    state.guidedDemo.actionPreviewOpened,
  ]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {!state.guidedDemo.running && state.guidedDemo.entryVisible ? (
        <div className="guided-demo-overlay" role="dialog" aria-modal="true" aria-labelledby="guided-demo-entry-title">
          <div className="guided-demo-entry-card">
            <p className="eyebrow">{copy.progressLabel}</p>
            <h2 id="guided-demo-entry-title">{copy.openingTitle}</h2>
            <p>{copy.openingSubtitle}</p>
            <p className="guided-demo-duration">{copy.openingDuration}</p>
            <div className="guided-demo-actions">
              <button type="button" className="btn btn--primary" onClick={startGuidedDemo}>
                {copy.startCta}
              </button>
              <button type="button" className="btn btn--ghost" onClick={skipGuidedDemo}>
                {copy.skip}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {state.guidedDemo.running && currentScene ? (
        currentScene.id === "scene-7" ? (
          <div className="guided-demo-overlay" role="dialog" aria-modal="true" aria-labelledby="guided-demo-final-title">
            <div className="guided-demo-final-card" data-guided-target="guided-final">
              <h2 id="guided-demo-final-title">{copy.finalTitle}</h2>
              <div className="guided-demo-final-subtitles" aria-label={copy.finalTitle}>
                {copy.finalSubtitleLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="guided-demo-chain" aria-label={copy.finalTitle}>
                {copy.chain.map((item, index) => (
                  <div key={item} className="guided-demo-chain-row">
                    <span>{item}</span>
                    {index < copy.chain.length - 1 ? <span className="guided-demo-chain-arrow">↓</span> : null}
                  </div>
                ))}
              </div>
              <div className="guided-demo-actions">
                <button type="button" className="btn btn--primary" onClick={finishGuidedDemo}>
                  {copy.finalCta}
                </button>
                <button type="button" className="btn btn--ghost" onClick={skipGuidedDemo}>
                  {copy.skip}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div key={currentScene.id} className="guided-demo-narration guided-demo-narration--scene" role="status" aria-live="polite">
            <p className="guided-demo-narration__label">{copy.progressLabel}</p>
            <div className="guided-demo-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
              <span style={{ width: `${progress}%` }} />
            </div>
            <div className="guided-demo-lines">
              {copy.scenes[currentScene.id].lines.map((line, index) => (
                <p key={line} style={{ animationDelay: `${index * 90}ms` }}>{line}</p>
              ))}
            </div>
            <div className="guided-demo-actions">
              <button type="button" className="btn btn--secondary" onClick={replayGuidedDemo}>
                {copy.replay}
              </button>
              <button type="button" className="btn btn--ghost" onClick={skipGuidedDemo}>
                {copy.skip}
              </button>
            </div>
          </div>
        )
      ) : null}
    </>
  );
}
