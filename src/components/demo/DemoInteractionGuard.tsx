"use client";

import { useEffect, useState } from "react";

type DemoInteractionSurface = {
  title: string;
  eyebrow: string;
  body: string;
  items?: string[];
  primaryLabel: string;
  action?: "close" | "interviews" | "team" | "priority";
};

function getLanguage(): "en" | "fr" {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem("talentflow-language") === "fr" ? "fr" : "en";
}

function highlightAndScroll(selector: string) {
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) return;

  element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  element.classList.add("demo-interaction-highlight");
  window.setTimeout(() => element.classList.remove("demo-interaction-highlight"), 1800);
}

export function DemoInteractionGuard() {
  const [surface, setSurface] = useState<DemoInteractionSurface | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest<HTMLElement>("button, a");
      if (!clickable) return;

      const language = getLanguage();
      const label = (clickable.textContent ?? "").trim().toLowerCase();

      const pipelineCard = target.closest<HTMLAnchorElement>("a.pipeline-card");
      if (pipelineCard?.getAttribute("href") === "#") {
        event.preventDefault();
        const name = pipelineCard.querySelector("h4")?.textContent?.trim() || (language === "fr" ? "Candidat" : "Candidate");
        const role = pipelineCard.querySelector(".pipeline-card__identity p")?.textContent?.trim() || "";
        const match = pipelineCard.querySelector(".badge")?.textContent?.trim();
        const metadata = Array.from(pipelineCard.querySelectorAll(".pipeline-card__meta span"))
          .map((item) => item.textContent?.trim())
          .filter(Boolean) as string[];

        setSurface({
          eyebrow: language === "fr" ? "Aperçu candidat" : "Candidate snapshot",
          title: name,
          body: role,
          items: [
            ...(match ? [language === "fr" ? `Matching visible : ${match}` : `Visible match: ${match}`] : []),
            ...metadata,
            language === "fr"
              ? "Le profil détaillé complet est volontairement réservé au scénario Maya Chen dans cette bêta publique."
              : "The full deep-dive profile is intentionally reserved for the Maya Chen scenario in this public beta.",
          ],
          primaryLabel: language === "fr" ? "Fermer" : "Close",
          action: "close",
        });
        return;
      }

      const documentCard = target.closest<HTMLElement>(".document-card");
      if (documentCard && clickable.tagName === "BUTTON") {
        event.preventDefault();
        const documentName = documentCard.querySelector("strong")?.textContent?.trim() || (language === "fr" ? "Document" : "Document");
        const documentType = documentCard.querySelector("p")?.textContent?.trim() || "";

        setSurface({
          eyebrow: language === "fr" ? "Aperçu sécurisé" : "Safe preview",
          title: documentName,
          body: documentType,
          items: language === "fr"
            ? [
                "Aperçu chargé depuis les données simulées de la démo.",
                "Aucun CV, document candidat ou profil LinkedIn réel n'est stocké dans cette bêta publique.",
              ]
            : [
                "Preview loaded from simulated demo data.",
                "No real CV, candidate document or LinkedIn profile is stored in this public beta.",
              ],
          primaryLabel: language === "fr" ? "Fermer" : "Close",
          action: "close",
        });
        return;
      }

      if (clickable.classList.contains("icon-button--soft") && clickable.querySelector(".badge-dot")) {
        setSurface({
          eyebrow: language === "fr" ? "Centre de notifications" : "Notification center",
          title: language === "fr" ? "3 signaux nécessitent une attention" : "3 signals need attention",
          body: language === "fr"
            ? "TalentFlow regroupe les alertes autour de décisions concrètes plutôt que d'afficher un simple compteur."
            : "TalentFlow groups alerts around concrete decisions instead of showing a passive counter.",
          items: language === "fr"
            ? [
                "Emma Laurent : feedback manager manquant, échéance 15:00.",
                "Maya Chen : validation d'offre à finaliser aujourd'hui.",
                "Lucas Martin : feedback technique au-delà du SLA.",
              ]
            : [
                "Emma Laurent: hiring-manager feedback missing, due 15:00.",
                "Maya Chen: offer validation should be finalized today.",
                "Lucas Martin: technical feedback is beyond SLA.",
              ],
          primaryLabel: language === "fr" ? "Voir la priorité n°1" : "Open priority #1",
          action: "priority",
        });
        return;
      }

      if (label.includes("view calendar") || label.includes("voir le calendrier")) {
        setSurface({
          eyebrow: language === "fr" ? "Calendrier des entretiens" : "Interview calendar",
          title: language === "fr" ? "Planning RH du jour" : "Today's hiring schedule",
          body: language === "fr"
            ? "Une vue synthétique avant de revenir dans la file d'entretiens."
            : "A compact schedule preview before returning to the interview queue.",
          items: language === "fr"
            ? ["09:30 · Entretien panel", "14:00 · Synchronisation RH", "16:30 · Revue d'offre"]
            : ["09:30 · Panel interview", "14:00 · HR synchronization", "16:30 · Offer review"],
          primaryLabel: language === "fr" ? "Voir la file d'entretiens" : "Open interview queue",
          action: "interviews",
        });
        return;
      }

      if (label.includes("view workload") || label.includes("voir la charge")) {
        setSurface({
          eyebrow: language === "fr" ? "Charge équipe" : "Team workload",
          title: language === "fr" ? "Capacité et points de tension" : "Capacity and pressure points",
          body: language === "fr"
            ? "La vue relie charge, candidats assignés et feedbacks en attente pour rendre les arbitrages visibles."
            : "This view connects workload, assigned candidates and pending feedback so staffing trade-offs are visible.",
          items: language === "fr"
            ? ["Sarah Martin : charge élevée", "Thomas Lee : capacité disponible", "David Klein : feedbacks à traiter"]
            : ["Sarah Martin: high workload", "Thomas Lee: available capacity", "David Klein: feedback follow-up needed"],
          primaryLabel: language === "fr" ? "Voir l'équipe" : "Open team view",
          action: "team",
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handlePrimaryAction = () => {
    if (!surface) return;

    if (surface.action === "priority") {
      highlightAndScroll('[data-guided-target="priority-1"]');
    }

    if (surface.action === "interviews") {
      highlightAndScroll(".interview-list-grid");
    }

    if (surface.action === "team") {
      highlightAndScroll(".team-grid");
    }

    setSurface(null);
  };

  if (!surface) return null;

  return (
    <div
      className="demo-interaction-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-interaction-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setSurface(null);
      }}
    >
      <section className="demo-interaction-panel">
        <button
          type="button"
          className="demo-interaction-close"
          onClick={() => setSurface(null)}
          aria-label={getLanguage() === "fr" ? "Fermer" : "Close"}
        >
          ×
        </button>

        <p className="demo-interaction-eyebrow">{surface.eyebrow}</p>
        <h2 id="demo-interaction-title">{surface.title}</h2>
        <p className="demo-interaction-body">{surface.body}</p>

        {surface.items?.length ? (
          <ul className="demo-interaction-list">
            {surface.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        ) : null}

        <div className="demo-interaction-actions">
          <button type="button" className="btn btn--primary" onClick={handlePrimaryAction}>
            {surface.primaryLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
