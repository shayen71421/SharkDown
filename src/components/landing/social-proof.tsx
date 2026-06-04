"use client";

import { Github, Shield, Globe } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

export function SocialProof() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="border-y border-border/50 bg-surface/30 py-8">
      <div
        className={`mx-auto flex max-w-7xl flex-wrap items-center justify-end gap-x-10 gap-y-4 px-6 transition-all duration-700 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5">
            <Github className="h-4 w-4" />
            <span className="font-medium text-foreground">Open Source</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4 text-success" />
          <span>Enterprise-grade auth (OAuth)</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="h-4 w-4 text-primary-glow" />
          <span>Built for developers</span>
        </div>
      </div>
    </section>
  );
}
