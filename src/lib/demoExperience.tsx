"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { canonicalCandidates } from "./demoData";
import {
  type ActionExecutionState,
  type ActionIntent,
  buildActionDefinition,
  buildActionPreview,
  createInitialActionExecutionState,
  executeActionTransition,
} from "./actionExecution";

export type CandidateInteractionState = {
  prepared: boolean;
  feedbackRequested: boolean;
  scheduled: boolean;
  completed: boolean;
  assignedRecruiter: string;
  salaryAligned: boolean;
  offerRisk: "high" | "reduced";
  priorityResolved: boolean;
  feedbackState: "missing" | "requested" | "complete";
  finalFeedbackDeadline: string | null;
  lastUpdatedAt: string;
};

export type DashboardBriefingType = "absence" | "cover" | "morning" | "weekly" | "endOfDay";

export type DashboardCoverMode = {
  enabled: boolean;
  coverActorId: string;
  originalOwnerId: string;
};

export type DashboardBriefingPacketMeta = {
  title: string;
  generatedAt: string;
  priorityId: string | null;
};

export type DashboardState = {
  lastViewedAt: string;
  activeScenarioId: string;
  catchUpCompleted: boolean;
  coverMode: DashboardCoverMode;
  briefingDismissedSections: string[];
  prioritySelection: string | null;
  estimatedCatchUpMinutes: number;
  activeBriefingType: DashboardBriefingType;
  briefingPacketsByType: Partial<Record<DashboardBriefingType, DashboardBriefingPacketMeta>>;
};

export type GuidedDemoTarget =
  | "executive-briefing"
  | "decision-kpis"
  | "ai-insights"
  | "priority-1"
  | "action-preview"
  | "candidate-profile"
  | "copilot-workspace"
  | null;

export type GuidedDemoSceneId =
  | "scene-1"
  | "scene-2"
  | "scene-3"
  | "scene-4"
  | "scene-5"
  | "scene-6"
  | "scene-7";

export type GuidedDemoScene = {
  id: GuidedDemoSceneId;
  target: GuidedDemoTarget;
  route: string;
  durationMs: number;
};

export const GUIDED_DEMO_SCENES: GuidedDemoScene[] = [
  { id: "scene-1", target: "executive-briefing", route: "/", durationMs: 13_000 },
  { id: "scene-2", target: "decision-kpis", route: "/", durationMs: 11_000 },
  { id: "scene-3", target: "ai-insights", route: "/", durationMs: 11_000 },
  { id: "scene-4", target: "priority-1", route: "/", durationMs: 14_000 },
  { id: "scene-5", target: "candidate-profile", route: "/candidate-profile", durationMs: 12_000 },
  { id: "scene-6", target: "copilot-workspace", route: "/copilot?candidate=maya-chen&mode=guided", durationMs: 12_000 },
  { id: "scene-7", target: null, route: "/", durationMs: 17_000 },
];

export type GuidedDemoState = {
  entryVisible: boolean;
  running: boolean;
  status: "idle" | "running" | "completed" | "skipped";
  sceneIndex: number;
  sceneStartedAt: string | null;
  actionPreviewOpened: boolean;
};

export type DemoExperienceState = {
  storySteps: string[];
  candidates: Record<string, CandidateInteractionState>;
  lastAction: string | null;
  lastCandidateId: string | null;
  dashboard: DashboardState;
  actionExecution: ActionExecutionState;
  guidedDemo: GuidedDemoState;
};

type DemoExperienceContextValue = {
  state: DemoExperienceState;
  togglePrepared: (candidateId: string) => void;
  requestFeedback: (candidateId: string) => void;
  scheduleInterview: (candidateId: string) => void;
  completeInterview: (candidateId: string) => void;
  reassignCandidate: (candidateId: string, recruiter: string) => void;
  addStoryStep: (step: string) => void;
  setActiveBriefingType: (briefingType: DashboardBriefingType) => void;
  setCoverMode: (enabled: boolean, coverActorId?: string) => void;
  completeCatchUp: () => void;
  setDashboardBriefingMeta: (payload: {
    briefingType: DashboardBriefingType;
    title: string;
    prioritySelection: string | null;
    estimatedCatchUpMinutes: number;
    scenarioId: string;
  }) => void;
  openActionIntent: (intent: ActionIntent) => void;
  confirmActionExecution: () => void;
  dismissActionSurface: () => void;
  startGuidedDemo: () => void;
  skipGuidedDemo: () => void;
  replayGuidedDemo: () => void;
  finishGuidedDemo: () => void;
  markGuidedDemoActionPreviewOpened: () => void;
  resetDemo: () => void;
};

const DemoExperienceContext = createContext<DemoExperienceContextValue | undefined>(undefined);

const STORAGE_KEY = "talentflow-demo-state-v2";

function createInitialDashboardState(): DashboardState {
  return {
    lastViewedAt: "2026-08-03T09:00:00.000Z",
    activeScenarioId: "absence-6d",
    catchUpCompleted: false,
    coverMode: {
      enabled: false,
      coverActorId: "thomas-lee",
      originalOwnerId: "sarah-martin",
    },
    briefingDismissedSections: [],
    prioritySelection: null,
    estimatedCatchUpMinutes: 2,
    activeBriefingType: "absence",
    briefingPacketsByType: {},
  };
}

function createInitialGuidedDemoState(): GuidedDemoState {
  return {
    entryVisible: true,
    running: false,
    status: "idle",
    sceneIndex: 0,
    sceneStartedAt: null,
    actionPreviewOpened: false,
  };
}

function createDefaultCandidateState(candidateId: string): CandidateInteractionState {
  const candidate = canonicalCandidates.find((item) => item.id === candidateId);
  const recruiter = candidate?.recruiters[0] ?? "Sarah Martin";
  const baseFeedback = candidate?.feedback[0]?.status ?? "missing";

  return {
    prepared: false,
    feedbackRequested: false,
    scheduled: false,
    completed: false,
    assignedRecruiter: recruiter,
    salaryAligned: false,
    offerRisk: candidateId === "maya-chen" ? "high" : "reduced",
    priorityResolved: false,
    feedbackState: baseFeedback === "complete" ? "complete" : baseFeedback === "pending" ? "requested" : "missing",
    finalFeedbackDeadline: null,
    lastUpdatedAt: "2026-08-09 09:00 UTC",
  };
}

function createInitialState(): DemoExperienceState {
  return {
    storySteps: [],
    candidates: Object.fromEntries(canonicalCandidates.map((candidate) => [candidate.id, createDefaultCandidateState(candidate.id)])),
    lastAction: null,
    lastCandidateId: null,
    dashboard: createInitialDashboardState(),
    actionExecution: createInitialActionExecutionState(),
    guidedDemo: createInitialGuidedDemoState(),
  };
}

function buildStateWithDefaults(state?: Partial<DemoExperienceState>): DemoExperienceState {
  const base = createInitialState();
  return {
    ...base,
    ...state,
    candidates: {
      ...base.candidates,
      ...(state?.candidates ?? {}),
    },
    dashboard: {
      ...base.dashboard,
      ...(state?.dashboard ?? {}),
      coverMode: {
        ...base.dashboard.coverMode,
        ...(state?.dashboard?.coverMode ?? {}),
      },
      briefingPacketsByType: {
        ...base.dashboard.briefingPacketsByType,
        ...(state?.dashboard?.briefingPacketsByType ?? {}),
      },
    },
    actionExecution: {
      ...base.actionExecution,
      ...(state?.actionExecution ?? {}),
      actionHistory: state?.actionExecution?.actionHistory ?? base.actionExecution.actionHistory,
      executionQueue: state?.actionExecution?.executionQueue ?? base.actionExecution.executionQueue,
    },
    guidedDemo: {
      ...base.guidedDemo,
      ...(state?.guidedDemo ?? {}),
    },
  };
}

function readStoredState(): DemoExperienceState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoExperienceState;
    return buildStateWithDefaults(parsed);
  } catch {
    return null;
  }
}

function writeStoredState(state: DemoExperienceState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function DemoExperienceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoExperienceState>(() => createInitialState());
  const [storageHydrated, setStorageHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredState();
    if (stored) {
      setState(stored);
    }
    setStorageHydrated(true);
  }, []);

  useEffect(() => {
    if (!state.guidedDemo.running || !state.guidedDemo.sceneStartedAt) return;

    const interval = window.setInterval(() => {
      setState((prev) => {
        if (!prev.guidedDemo.running || !prev.guidedDemo.sceneStartedAt) return prev;

        const scene = GUIDED_DEMO_SCENES[prev.guidedDemo.sceneIndex];
        if (!scene) {
          return {
            ...prev,
            guidedDemo: {
              ...prev.guidedDemo,
              running: false,
              status: "completed",
              sceneStartedAt: null,
              entryVisible: false,
            },
          };
        }

        const elapsed = Date.now() - new Date(prev.guidedDemo.sceneStartedAt).getTime();
        if (elapsed < scene.durationMs) {
          return prev;
        }

        const nextIndex = prev.guidedDemo.sceneIndex + 1;
        if (nextIndex >= GUIDED_DEMO_SCENES.length) {
          return {
            ...prev,
            storySteps: [...prev.storySteps.slice(-4), "Guided demo completed"],
            guidedDemo: {
              ...prev.guidedDemo,
              running: false,
              status: "completed",
              sceneStartedAt: null,
              entryVisible: false,
              actionPreviewOpened: false,
            },
          };
        }

        return {
          ...prev,
          storySteps: [...prev.storySteps.slice(-4), `Guided scene ${nextIndex + 1}`],
          guidedDemo: {
            ...prev.guidedDemo,
            sceneIndex: nextIndex,
            sceneStartedAt: new Date().toISOString(),
          },
        };
      });
    }, 300);

    return () => {
      window.clearInterval(interval);
    };
  }, [state.guidedDemo.running, state.guidedDemo.sceneStartedAt]);

  useEffect(() => {
    if (!storageHydrated) return;
    writeStoredState(state);
  }, [state, storageHydrated]);

  const value = useMemo<DemoExperienceContextValue>(() => ({
    state,
    togglePrepared: (candidateId) => {
      setState((prev) => ({
        ...prev,
        lastAction: `Prepared ${candidateId}`,
        lastCandidateId: candidateId,
        storySteps: [...prev.storySteps.slice(-4), `Prepared ${candidateId}`],
        candidates: {
          ...prev.candidates,
          [candidateId]: {
            ...prev.candidates[candidateId],
            prepared: !prev.candidates[candidateId]?.prepared,
          },
        },
      }));
    },
    requestFeedback: (candidateId) => {
      setState((prev) => ({
        ...prev,
        lastAction: `Feedback requested for ${candidateId}`,
        lastCandidateId: candidateId,
        storySteps: [...prev.storySteps.slice(-4), `Feedback requested for ${candidateId}`],
        candidates: {
          ...prev.candidates,
          [candidateId]: {
            ...prev.candidates[candidateId],
            feedbackRequested: !prev.candidates[candidateId]?.feedbackRequested,
          },
        },
      }));
    },
    scheduleInterview: (candidateId) => {
      setState((prev) => ({
        ...prev,
        lastAction: `Interview scheduled for ${candidateId}`,
        lastCandidateId: candidateId,
        storySteps: [...prev.storySteps.slice(-4), `Interview scheduled for ${candidateId}`],
        candidates: {
          ...prev.candidates,
          [candidateId]: {
            ...prev.candidates[candidateId],
            scheduled: true,
            prepared: true,
          },
        },
      }));
    },
    completeInterview: (candidateId) => {
      setState((prev) => ({
        ...prev,
        lastAction: `Interview completed for ${candidateId}`,
        lastCandidateId: candidateId,
        storySteps: [...prev.storySteps.slice(-4), `Interview completed for ${candidateId}`],
        candidates: {
          ...prev.candidates,
          [candidateId]: {
            ...prev.candidates[candidateId],
            completed: true,
            scheduled: true,
            feedbackRequested: true,
          },
        },
      }));
    },
    reassignCandidate: (candidateId, recruiter) => {
      setState((prev) => ({
        ...prev,
        lastAction: `${candidateId} reassigned to ${recruiter}`,
        lastCandidateId: candidateId,
        storySteps: [...prev.storySteps.slice(-4), `${candidateId} reassigned to ${recruiter}`],
        candidates: {
          ...prev.candidates,
          [candidateId]: {
            ...prev.candidates[candidateId],
            assignedRecruiter: recruiter,
          },
        },
      }));
    },
    addStoryStep: (step) => {
      setState((prev) => ({
        ...prev,
        storySteps: [...prev.storySteps.slice(-4), step],
      }));
    },
    setActiveBriefingType: (briefingType) => {
      setState((prev) => ({
        ...prev,
        dashboard: {
          ...prev.dashboard,
          activeBriefingType: briefingType,
          activeScenarioId: briefingType === "cover" ? "cover-handoff" : prev.dashboard.activeScenarioId,
          coverMode: briefingType === "cover"
            ? { ...prev.dashboard.coverMode, enabled: true }
            : prev.dashboard.coverMode,
        },
      }));
    },
    setCoverMode: (enabled, coverActorId) => {
      setState((prev) => ({
        ...prev,
        dashboard: {
          ...prev.dashboard,
          activeBriefingType: enabled ? "cover" : "absence",
          activeScenarioId: enabled ? "cover-handoff" : "absence-6d",
          coverMode: {
            ...prev.dashboard.coverMode,
            enabled,
            coverActorId: coverActorId ?? prev.dashboard.coverMode.coverActorId,
          },
        },
      }));
    },
    completeCatchUp: () => {
      setState((prev) => ({
        ...prev,
        dashboard: {
          ...prev.dashboard,
          catchUpCompleted: true,
        },
      }));
    },
    setDashboardBriefingMeta: ({ briefingType, title, prioritySelection, estimatedCatchUpMinutes, scenarioId }) => {
      setState((prev) => {
        const previousPacket = prev.dashboard.briefingPacketsByType[briefingType];
        const alreadySynced =
          prev.dashboard.prioritySelection === prioritySelection &&
          prev.dashboard.estimatedCatchUpMinutes === estimatedCatchUpMinutes &&
          prev.dashboard.activeScenarioId === scenarioId &&
          previousPacket?.title === title &&
          previousPacket?.priorityId === prioritySelection;

        if (alreadySynced) {
          return prev;
        }

        return {
          ...prev,
          dashboard: {
            ...prev.dashboard,
            activeScenarioId: scenarioId,
            prioritySelection,
            estimatedCatchUpMinutes,
            briefingPacketsByType: {
              ...prev.dashboard.briefingPacketsByType,
              [briefingType]: {
                title,
                priorityId: prioritySelection,
                generatedAt: "2026-08-09T09:00:00.000Z",
              },
            },
          },
        };
      });
    },
    openActionIntent: (intent) => {
      setState((prev) => {
        const definition = buildActionDefinition(intent, {
          candidates: prev.candidates,
          dashboardPrioritySelection: prev.dashboard.prioritySelection,
        });

        if (!definition) {
          return prev;
        }

        const preview = buildActionPreview(definition, intent.language);

        if (definition.confirmationLevel === "none") {
          const execution = executeActionTransition(
            definition,
            {
              candidates: prev.candidates,
              dashboardPrioritySelection: prev.dashboard.prioritySelection,
            },
            intent.language,
            prev.actionExecution.actionHistory.length,
          );

          const updatedCandidates = { ...prev.candidates };
          Object.entries(execution.candidateUpdates).forEach(([candidateId, patch]) => {
            updatedCandidates[candidateId] = {
              ...updatedCandidates[candidateId],
              ...patch,
            };
          });

          return {
            ...prev,
            candidates: updatedCandidates,
            lastAction: execution.lastAction,
            lastCandidateId: definition.targetId,
            storySteps: [...prev.storySteps.slice(-4), execution.storyStep],
            dashboard: {
              ...prev.dashboard,
              prioritySelection: execution.dashboardPrioritySelection,
            },
            actionExecution: {
              ...prev.actionExecution,
              activeActionId: null,
              activeDefinition: null,
              activePreview: null,
              pendingConfirmation: false,
              executionQueue: [],
              lastExecutionResult: execution.result,
              actionHistory: [...prev.actionExecution.actionHistory, execution.historyEntry],
              lastExecutionSummary: execution.summary,
            },
          };
        }

        return {
          ...prev,
          actionExecution: {
            ...prev.actionExecution,
            activeActionId: definition.id,
            activeLanguage: intent.language,
            activeDefinition: definition,
            activePreview: preview,
            pendingConfirmation: true,
            executionQueue: [definition.id],
            lastExecutionResult: null,
          },
        };
      });
    },
    confirmActionExecution: () => {
      setState((prev) => {
        const definition = prev.actionExecution.activeDefinition;
        if (!definition) {
          return prev;
        }

        const execution = executeActionTransition(
          definition,
          {
            candidates: prev.candidates,
            dashboardPrioritySelection: prev.dashboard.prioritySelection,
          },
          prev.actionExecution.activeLanguage,
          prev.actionExecution.actionHistory.length,
        );

        const updatedCandidates = { ...prev.candidates };
        Object.entries(execution.candidateUpdates).forEach(([candidateId, patch]) => {
          updatedCandidates[candidateId] = {
            ...updatedCandidates[candidateId],
            ...patch,
          };
        });

        return {
          ...prev,
          candidates: updatedCandidates,
          lastAction: execution.lastAction,
          lastCandidateId: definition.targetId,
          storySteps: [...prev.storySteps.slice(-4), execution.storyStep],
          dashboard: {
            ...prev.dashboard,
            prioritySelection: execution.dashboardPrioritySelection,
          },
          actionExecution: {
            ...prev.actionExecution,
            activeActionId: null,
            activeDefinition: null,
            activePreview: null,
            pendingConfirmation: false,
            executionQueue: [],
            lastExecutionResult: execution.result,
            actionHistory: [...prev.actionExecution.actionHistory, execution.historyEntry],
            lastExecutionSummary: execution.summary,
          },
        };
      });
    },
    dismissActionSurface: () => {
      setState((prev) => ({
        ...prev,
        actionExecution: {
          ...prev.actionExecution,
          activeActionId: null,
          activeDefinition: null,
          activePreview: null,
          pendingConfirmation: false,
          executionQueue: [],
          lastExecutionResult: null,
        },
      }));
    },
    startGuidedDemo: () => {
      setState((prev) => ({
        ...prev,
        storySteps: [...prev.storySteps.slice(-4), "Guided demo started"],
        actionExecution: {
          ...prev.actionExecution,
          activeActionId: null,
          activeDefinition: null,
          activePreview: null,
          pendingConfirmation: false,
          executionQueue: [],
          lastExecutionResult: null,
        },
        guidedDemo: {
          entryVisible: false,
          running: true,
          status: "running",
          sceneIndex: 0,
          sceneStartedAt: new Date().toISOString(),
          actionPreviewOpened: false,
        },
      }));
    },
    skipGuidedDemo: () => {
      setState((prev) => ({
        ...prev,
        storySteps: [...prev.storySteps.slice(-4), "Guided demo skipped"],
        actionExecution: {
          ...prev.actionExecution,
          activeActionId: null,
          activeDefinition: null,
          activePreview: null,
          pendingConfirmation: false,
          executionQueue: [],
          lastExecutionResult: null,
        },
        guidedDemo: {
          ...prev.guidedDemo,
          entryVisible: false,
          running: false,
          status: "skipped",
          sceneStartedAt: null,
          actionPreviewOpened: false,
        },
      }));
    },
    replayGuidedDemo: () => {
      setState((prev) => ({
        ...prev,
        storySteps: [...prev.storySteps.slice(-4), "Guided demo replay started"],
        actionExecution: {
          ...prev.actionExecution,
          activeActionId: null,
          activeDefinition: null,
          activePreview: null,
          pendingConfirmation: false,
          executionQueue: [],
          lastExecutionResult: null,
        },
        guidedDemo: {
          entryVisible: false,
          running: true,
          status: "running",
          sceneIndex: 0,
          sceneStartedAt: new Date().toISOString(),
          actionPreviewOpened: false,
        },
      }));
    },
    finishGuidedDemo: () => {
      setState((prev) => ({
        ...prev,
        storySteps: [...prev.storySteps.slice(-4), "Guided demo completed"],
        actionExecution: {
          ...prev.actionExecution,
          activeActionId: null,
          activeDefinition: null,
          activePreview: null,
          pendingConfirmation: false,
          executionQueue: [],
          lastExecutionResult: null,
        },
        guidedDemo: {
          ...prev.guidedDemo,
          running: false,
          status: "completed",
          sceneStartedAt: null,
          entryVisible: false,
          actionPreviewOpened: false,
        },
      }));
    },
    markGuidedDemoActionPreviewOpened: () => {
      setState((prev) => ({
        ...prev,
        guidedDemo: {
          ...prev.guidedDemo,
          actionPreviewOpened: true,
        },
      }));
    },
    resetDemo: () => {
      const resetState = createInitialState();
      setState(resetState);
      writeStoredState(resetState);
    },
  }), [state]);

  return (
    <DemoExperienceContext.Provider value={value}>
      {children}
    </DemoExperienceContext.Provider>
  );
}

export function useDemoExperience() {
  const context = useContext(DemoExperienceContext);
  if (!context) {
    throw new Error("useDemoExperience must be used within a DemoExperienceProvider");
  }
  return context;
}
