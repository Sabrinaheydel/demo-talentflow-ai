import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./mobile-beta.css";
import "./feedback.css";
import "./demo-interactions.css";
import { LanguageProvider } from "../lib/i18n";
import { DemoExperienceProvider } from "../lib/demoExperience";
import { ActionExecutionSurface } from "../components/actions/ActionExecutionSurface";
import { GuidedDemoOverlay } from "../components/demo/GuidedDemoOverlay";
import { DemoInteractionGuard } from "../components/demo/DemoInteractionGuard";
import { PostHogAnalytics } from "../components/analytics/PostHogAnalytics";
import { FeedbackLauncher } from "../components/feedback/FeedbackLauncher";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TalentFlow | AI Recruitment Dashboard Demo",
  description: "Bilingual portfolio demo of an AI-assisted recruitment workspace with simulated candidate data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <LanguageProvider>
          <DemoExperienceProvider>
            {children}
            <ActionExecutionSurface />
            <GuidedDemoOverlay />
            <DemoInteractionGuard />
            <FeedbackLauncher />
            <PostHogAnalytics />
          </DemoExperienceProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
