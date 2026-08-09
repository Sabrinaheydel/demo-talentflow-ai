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
  finalSubtitle: string;
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
    finalTitle: "TalentFlow",
    finalSubtitle: "Built with an AI Product Operating System.",
    finalCta: "Explore freely",
    scenes: {
      "scene-1": {
        lines: [
          "Imagine returning after one week away.",
          "Instead of searching everywhere,",
          "TalentFlow immediately explains what changed,",
          "what is at risk,",
          "and where to start.",
        ],
      },
      "scene-2": {
        lines: [
          "These are not reporting metrics.",
          "They are decision metrics.",
          "Every KPI answers whether action is required.",
        ],
      },
      "scene-3": {
        lines: [
          "The AI does not simply summarize.",
          "It explains WHY",
          "and WHAT TO DO NEXT.",
        ],
      },
      "scene-4": {
        lines: [
          "Every important action is transparent.",
          "Before executing, you know exactly",
          "who will be notified,",
          "what message will be sent,",
          "what data will change,",
          "and what happens next.",
        ],
      },
      "scene-5": {
        lines: [
          "Every screen shares the same product state.",
          "No conflicting information.",
        ],
      },
      "scene-6": {
        lines: [
          "The AI suggests.",
          "The execution engine remains deterministic.",
          "Humans stay in control.",
        ],
      },
      "scene-7": {
        lines: [],
      },
    },
    chain: [
      "Business Problem",
      "Product Strategy",
      "Architecture",
      "Implementation",
      "QA",
      "Release",
      "Continuous Iteration",
    ],
  },
  fr: {
    openingTitle: "Bienvenue dans TalentFlow",
    openingSubtitle: "Une demonstration Product Builder.",
    openingDuration: "Duree : 90 secondes",
    startCta: "Demarrer la demo guidee",
    skip: "Passer",
    replay: "Rejouer la demo guidee",
    progressLabel: "Demonstration guidee",
    finalTitle: "TalentFlow",
    finalSubtitle: "Construit avec un AI Product Operating System.",
    finalCta: "Explorer librement",
    scenes: {
      "scene-1": {
        lines: [
          "Imaginez revenir apres une semaine d'absence.",
          "Au lieu de chercher partout,",
          "TalentFlow explique immediatement ce qui a change,",
          "ce qui est a risque,",
          "et par ou commencer.",
        ],
      },
      "scene-2": {
        lines: [
          "Ce ne sont pas des metriques de reporting.",
          "Ce sont des metriques de decision.",
          "Chaque KPI indique si une action est necessaire.",
        ],
      },
      "scene-3": {
        lines: [
          "L'IA ne fait pas qu'un resume.",
          "Elle explique POURQUOI",
          "et QUOI FAIRE ENSUITE.",
        ],
      },
      "scene-4": {
        lines: [
          "Chaque action importante est transparente.",
          "Avant execution, vous savez exactement",
          "qui sera notifie,",
          "quel message sera envoye,",
          "quelles donnees vont changer,",
          "et ce qui se passe ensuite.",
        ],
      },
      "scene-5": {
        lines: [
          "Chaque ecran partage le meme etat produit.",
          "Aucune information contradictoire.",
        ],
      },
      "scene-6": {
        lines: [
          "L'IA suggere.",
          "Le moteur d'execution reste deterministe.",
          "Les humains gardent le controle.",
        ],
      },
      "scene-7": {
        lines: [],
      },
    },
    chain: [
      "Probleme business",
      "Strategie produit",
      "Architecture",
      "Implementation",
      "QA",
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
              <p>{copy.finalSubtitle}</p>
              <div className="guided-demo-chain" aria-label={copy.finalSubtitle}>
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
          <div className="guided-demo-narration" role="status" aria-live="polite">
            <p className="guided-demo-narration__label">{copy.progressLabel}</p>
            <div className="guided-demo-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
              <span style={{ width: `${progress}%` }} />
            </div>
            <div className="guided-demo-lines">
              {copy.scenes[currentScene.id].lines.map((line) => (
                <p key={line}>{line}</p>
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
