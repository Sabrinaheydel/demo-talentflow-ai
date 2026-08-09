"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { canonicalCandidates } from "./demoData";

export type CandidateInteractionState = {
  prepared: boolean;
  feedbackRequested: boolean;
  scheduled: boolean;
  completed: boolean;
  assignedRecruiter: string;
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

export type DemoExperienceState = {
  storySteps: string[];
  candidates: Record<string, CandidateInteractionState>;
  lastAction: string | null;
  lastCandidateId: string | null;
  dashboard: DashboardState;
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

function createDefaultCandidateState(candidateId: string): CandidateInteractionState {
  const candidate = canonicalCandidates.find((item) => item.id === candidateId);
  const recruiter = candidate?.recruiters[0] ?? "Sarah Martin";

  return {
    prepared: false,
    feedbackRequested: false,
    scheduled: false,
    completed: false,
    assignedRecruiter: recruiter,
  };
}

function createInitialState(): DemoExperienceState {
  return {
    storySteps: [],
    candidates: Object.fromEntries(canonicalCandidates.map((candidate) => [candidate.id, createDefaultCandidateState(candidate.id)])),
    lastAction: null,
    lastCandidateId: null,
    dashboard: createInitialDashboardState(),
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
  const [state, setState] = useState<DemoExperienceState>(() => readStoredState() ?? createInitialState());

  useEffect(() => {
    writeStoredState(state);
  }, [state]);

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
