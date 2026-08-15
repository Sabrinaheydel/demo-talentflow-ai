"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useDemoExperience } from "../../lib/demoExperience";
import { useLanguage } from "../../lib/i18n";
import { trackAnalyticsEvent } from "../../lib/analytics";

type AnalyticsConfig = {
  posthogToken: string | null;
  posthogHost: string;
};

function ProductTelemetryObserver() {
  const { language } = useLanguage();
  const { state } = useDemoExperience();
  const previousLanguage = useRef(language);
  const previousGuidedStatus = useRef(state.guidedDemo.status);
  const previousSceneIndex = useRef(state.guidedDemo.sceneIndex);
  const previousActionPreviewId = useRef<string | null>(state.actionExecution.activeActionId);
  const previousHistoryLength = useRef(state.actionExecution.actionHistory.length);

  useEffect(() => {
    if (previousLanguage.current !== language) {
      trackAnalyticsEvent("language changed", {
        from_language: previousLanguage.current,
        to_language: language,
      });
      previousLanguage.current = language;
    }
  }, [language]);

  useEffect(() => {
    const status = state.guidedDemo.status;
    if (previousGuidedStatus.current !== status) {
      if (status === "running") trackAnalyticsEvent("guided demo started", { language });
      if (status === "completed") trackAnalyticsEvent("guided demo completed", { language });
      if (status === "skipped") trackAnalyticsEvent("guided demo skipped", { language });
      previousGuidedStatus.current = status;
    }
  }, [language, state.guidedDemo.status]);

  useEffect(() => {
    if (!state.guidedDemo.running) return;
    if (previousSceneIndex.current === state.guidedDemo.sceneIndex) return;

    trackAnalyticsEvent("guided demo scene viewed", {
      scene_index: state.guidedDemo.sceneIndex + 1,
      language,
    });
    previousSceneIndex.current = state.guidedDemo.sceneIndex;
  }, [language, state.guidedDemo.running, state.guidedDemo.sceneIndex]);

  useEffect(() => {
    const activeActionId = state.actionExecution.activeActionId;
    if (activeActionId && activeActionId !== previousActionPreviewId.current) {
      trackAnalyticsEvent("action preview opened", {
        action_id: activeActionId,
        language: state.actionExecution.activeLanguage,
      });
    }
    previousActionPreviewId.current = activeActionId;
  }, [state.actionExecution.activeActionId, state.actionExecution.activeLanguage]);

  useEffect(() => {
    const historyLength = state.actionExecution.actionHistory.length;
    if (historyLength <= previousHistoryLength.current) {
      previousHistoryLength.current = historyLength;
      return;
    }

    const latest = state.actionExecution.actionHistory[historyLength - 1];
    if (latest) {
      trackAnalyticsEvent("action completed", {
        action_id: latest.actionId,
        target: latest.target,
      });
    }
    previousHistoryLength.current = historyLength;
  }, [state.actionExecution.actionHistory]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const button = target?.closest("button");
      const copilot = target?.closest(".copilot-shell");
      if (!button || !copilot) return;

      let interactionType = "control";
      if (button.classList.contains("copilot-prompt-pill")) interactionType = "suggested_prompt";
      if (button.classList.contains("copilot-action-item")) interactionType = "ai_action";
      if (button.closest(".copilot-composer") && button.classList.contains("btn--primary")) interactionType = "message_submit";

      trackAnalyticsEvent("copilot used", {
        interaction_type: interactionType,
        language,
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [language]);

  return null;
}

export function PostHogAnalytics() {
  const [config, setConfig] = useState<AnalyticsConfig | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/analytics-config", { cache: "no-store" })
      .then(async (response): Promise<AnalyticsConfig | null> => {
        if (!response.ok) return null;
        return (await response.json()) as AnalyticsConfig;
      })
      .then((value) => {
        if (!cancelled) setConfig(value);
      })
      .catch(() => {
        if (!cancelled) setConfig(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!config?.posthogToken) return null;

  const initScript = `
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog&&window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||(p=t.createElement("script"),p.type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once unregister identify reset get_distinct_id captureException".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init(${JSON.stringify(config.posthogToken)}, {
      api_host: ${JSON.stringify(config.posthogHost)},
      ui_host: "https://eu.posthog.com",
      defaults: "2026-05-30",
      autocapture: {
        css_selector_ignorelist: [".ph-no-autocapture", "[data-ph-no-autocapture]", "[data-sensitive]"]
      },
      capture_exceptions: {
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
        capture_console_errors: false
      },
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: ".copilot-message--user"
      }
    });
  `;

  return (
    <>
      <Script id="posthog-init" strategy="afterInteractive">
        {initScript}
      </Script>
      <ProductTelemetryObserver />
    </>
  );
}
