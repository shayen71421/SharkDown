"use client";

import { LandingHeader } from "@/components/landing/landing-header";
import { HeroSection } from "@/components/landing/hero-section";
import { ProblemSolution } from "@/components/landing/problem-solution";
import { FeaturesSection } from "@/components/landing/features-section";
import { LiveDemo } from "@/components/landing/live-demo";
import { CTASection } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <LandingHeader />
      <HeroSection />
      <ProblemSolution />
      <FeaturesSection />
      <LiveDemo />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
