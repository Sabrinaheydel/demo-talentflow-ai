"use client";

import { useEffect, useState } from "react";
import { BriefingPacket } from "../../lib/dashboardBriefing";
import { DashboardBriefingType } from "../../lib/demoExperience";

type ExecutiveBriefingProps = {
  language: "en" | "fr";
  packet: BriefingPacket;
  activeBriefingType: DashboardBriefingType;
  onBriefingTypeChange: (type: DashboardBriefingType) => void;
  onPrimaryAction: () => void;
};

const briefingModes: Array<{ id: DashboardBriefingType; en: string; fr: string; enabled: boolean }> = [
  { id: "absence", en: "Absence Brief", fr: "Brief absence", enabled: true },
  { id: "cover", en: "Cover Brief", fr: "Brief relais", enabled: true },
  { id: "morning", en: "Morning Brief", fr: "Brief matin", enabled: false },
  { id: "weekly", en: "Weekly Brief", fr: "Brief hebdo", enabled: false },
  { id: "endOfDay", en: "End-of-day Brief", fr: "Brief fin de journee", enabled: false },
];

export function ExecutiveBriefing({
  language,
  packet,
  activeBriefingType,
  onBriefingTypeChange,
  onPrimaryAction,
}: ExecutiveBriefingProps) {
  const [catchUpStatus, setCatchUpStatus] = useState<"idle" | "running" | "complete">("idle");
  const priorityQueueProcessed = packet.priorityOne.id === "all-priorities-processed";
  const effectiveCatchUpStatus = priorityQueueProcessed ? "complete" : catchUpStatus;

  useEffect(() => {
    setCatchUpStatus("idle");
  }, [activeBriefingType]);

  const handlePrimaryAction = () => {
    if (priorityQueueProcessed || catchUpStatus !== "idle") return;

    setCatchUpStatus("running");
    onPrimaryAction();

    window.setTimeout(() => {
      setCatchUpStatus("complete");
    }, 700);
  };

  const catchUpLabel = priorityQueueProcessed
    ? (language === "en" ? "Priority actions processed ✓" : "Actions prioritaires traitées ✓")
    : effectiveCatchUpStatus === "running"
      ? (language === "en" ? "Synchronizing context..." : "Synchronisation du contexte...")
      : effectiveCatchUpStatus === "complete"
        ? (language === "en" ? "Catch-up complete ✓" : "Rattrapage terminé ✓")
        : packet.primaryCta;

  return (
    <section className="briefing-hero" data-guided-target="executive-briefing">
      <div className="briefing-hero__header">
        <div>
          <p className="eyebrow">{language === "en" ? "Executive briefing" : "Briefing exécutif"}</p>
          <h2 className="briefing-hero__title">{packet.title}</h2>
          <p className="briefing-hero__greeting">{packet.greeting}</p>
          <p className="briefing-hero__summary">{packet.summary}</p>
          <p className="demo-disclaimer">{packet.audienceContext}</p>
        </div>

        <div className="briefing-meta-stack">
          <div className="metric-pill">
            <span>{language === "en" ? "Time window" : "Fenêtre"}</span>
            <strong>{packet.timeWindow}</strong>
          </div>
          <div className="metric-pill">
            <span>{language === "en" ? "Estimated catch-up" : "Rattrapage estimé"}</span>
            <strong>
              {priorityQueueProcessed
                ? (language === "en" ? "Priority queue synchronized" : "File de priorités synchronisée")
                : effectiveCatchUpStatus === "complete"
                  ? (language === "en" ? "Context synchronized" : "Contexte synchronisé")
                  : packet.estimatedCatchUpTime}
            </strong>
          </div>
          <button
            type="button"
            className={`btn ${effectiveCatchUpStatus === "complete" ? "btn--secondary" : "btn--primary"}`}
            onClick={handlePrimaryAction}
            disabled={priorityQueueProcessed || catchUpStatus !== "idle"}
            aria-live="polite"
          >
            {catchUpLabel}
          </button>

          {effectiveCatchUpStatus === "complete" ? (
            <div
              className="metric-pill"
              role="status"
              aria-live="polite"
              style={{ background: "#ecfdf5", borderColor: "#a7f3d0" }}
            >
              <span style={{ color: "#047857" }}>
                {priorityQueueProcessed
                  ? (language === "en" ? "Operational state updated" : "État opérationnel actualisé")
                  : (language === "en" ? "Next best action ready" : "Prochaine action prioritaire prête")}
              </span>
              <strong style={{ color: "#065f46" }}>
                {priorityQueueProcessed
                  ? (language === "en" ? "Priority queue processed" : "File de priorités traitée")
                  : (language === "en" ? "Priority 1 identified" : "Priorité 1 identifiée")}
              </strong>
              <p style={{ margin: "7px 0 0", color: "#047857", fontSize: "0.82rem", lineHeight: 1.45 }}>
                {packet.priorityOne.recommendedAction}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="briefing-mode-switch" role="tablist" aria-label={language === "en" ? "Briefing modes" : "Modes de briefing"}>
        {briefingModes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className={`briefing-mode-pill ${activeBriefingType === mode.id ? "is-active" : ""}`}
            onClick={() => mode.enabled && onBriefingTypeChange(mode.id)}
            disabled={!mode.enabled}
            title={!mode.enabled ? (language === "en" ? "Available in the next product iteration." : "Disponible dans la prochaine itération produit.") : undefined}
          >
            {language === "en" ? mode.en : mode.fr}
          </button>
        ))}
      </div>

      <div className="briefing-layer-grid">
        <article className="briefing-layer-card">
          <h3>{packet.whatChangedTitle}</h3>
          <ul>
            {packet.keyChanges.map((change) => (
              <li key={change}>{change}</li>
            ))}
          </ul>
        </article>

        <article className="briefing-layer-card briefing-layer-card--risk">
          <h3>{packet.needsAttentionTitle}</h3>
          <ul>
            {packet.risks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </article>

        <article className="briefing-layer-card briefing-layer-card--priority">
          <h3>{packet.whatToDoNowTitle}</h3>
          <p className="briefing-priority-title">{packet.priorityOne.title}</p>
          <p className="briefing-priority-deadline">{packet.priorityOne.deadline}</p>
          <p className="briefing-priority-owner">
            {language === "en" ? "Owner" : "Responsable"}: {packet.priorityOne.owner}
          </p>
          <ul>
            {packet.priorityOne.whyNow.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          <p className="briefing-priority-action">{packet.priorityOne.recommendedAction}</p>
        </article>
      </div>
    </section>
  );
}
