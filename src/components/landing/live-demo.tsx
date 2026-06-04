"use client";

import { useState } from "react";
import { Eye, Code2, Github } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

export function LiveDemo() {
  const { ref, inView } = useInView();
  const [tab, setTab] = useState<"visual" | "markdown">("visual");

  return (
    <section
      id="demo"
      ref={ref}
      className="mx-auto max-w-5xl px-6 py-24 md:py-32"
    >
      <div
        className={`text-center transition-all duration-700 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground">
          Live preview
        </div>
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          See it in action
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          A real SharkDown editor session. Write visually, see the raw Markdown side by side.
        </p>
      </div>

      <div
        className={`mt-12 transition-all duration-700 delay-150 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-primary/5">
          {/* Window chrome */}
          <div className="flex items-center gap-3 border-b border-border bg-surface-elevated/30 px-5 py-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTab("visual")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  tab === "visual"
                    ? "bg-primary/15 text-primary-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Visual
              </button>
              <button
                onClick={() => setTab("markdown")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  tab === "markdown"
                    ? "bg-primary/15 text-primary-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                Markdown
              </button>
            </div>

            <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
              <Github className="h-3.5 w-3.5" />
              shayen71421 / SharkDown
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {tab === "visual" ? (
              <>
                <div className="space-y-4 border-border p-7 md:border-r">
                  <h2 className="font-display text-2xl font-bold tracking-tight">
                    Getting Started
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    SharkDown lets you write documentation visually. No Markdown knowledge
                    required — just type, format, and push.
                  </p>
                  <h3 className="font-display text-lg font-semibold">Quick start</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/15 text-[11px] font-medium text-primary-glow">
                        1
                      </span>
                      Sign in with GitHub
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/15 text-[11px] font-medium text-primary-glow">
                        2
                      </span>
                      Select a repository from your dashboard
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/15 text-[11px] font-medium text-primary-glow">
                        3
                      </span>
                      Edit your README visually — or start a new doc
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/15 text-[11px] font-medium text-primary-glow">
                        4
                      </span>
                      Commit with a message, or create a PR
                    </li>
                  </ol>
                </div>
                <div className="bg-[oklch(0.1_0.025_265)] p-7 font-mono text-xs leading-relaxed">
                  <div className="text-[oklch(0.55_0.03_260)]"># Getting Started</div>
                  <div className="mt-2 text-[oklch(0.85_0.01_260)]">
                    SharkDown lets you write documentation visually.
                  </div>
                  <div className="mt-4 text-[oklch(0.55_0.03_260)]">## Quick Start</div>
                  <div className="mt-1 flex items-center gap-2 text-[oklch(0.55_0.03_260)]">
                    <span>1.</span>
                    <span className="text-[oklch(0.85_0.01_260)]">Sign in with GitHub</span>
                  </div>
                  <div className="flex items-center gap-2 text-[oklch(0.55_0.03_260)]">
                    <span>2.</span>
                    <span className="text-[oklch(0.85_0.01_260)]">
                      Select a repository from your dashboard
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[oklch(0.55_0.03_260)]">
                    <span>3.</span>
                    <span className="text-[oklch(0.85_0.01_260)]">
                      Edit your README visually
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[oklch(0.55_0.03_260)]">
                    <span>4.</span>
                    <span className="text-[oklch(0.85_0.01_260)]">
                      Commit with a message, or create a PR
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <span className="inline-block rounded bg-[oklch(0.66_0.20_208)]/20 px-1.5 py-0.5 text-[oklch(0.78_0.16_210)]">
                      visual-editor
                    </span>
                    <span className="inline-block rounded bg-[oklch(0.66_0.20_208)]/20 px-1.5 py-0.5 text-[oklch(0.78_0.16_210)]">
                      github
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-[oklch(0.1_0.025_265)] p-7 font-mono text-xs leading-relaxed">
                  <div className="text-[oklch(0.55_0.03_260)]"># Getting Started</div>
                  <div className="mt-2 text-[oklch(0.85_0.01_260)]">
                    SharkDown lets you write documentation visually.
                  </div>
                  <div className="mt-4 text-[oklch(0.55_0.03_260)]">## Quick Start</div>
                  <div className="mt-1 flex items-center gap-2 text-[oklch(0.55_0.03_260)]">
                    <span>1.</span>
                    <span className="text-[oklch(0.85_0.01_260)]">Sign in with GitHub</span>
                  </div>
                  <div className="flex items-center gap-2 text-[oklch(0.55_0.03_260)]">
                    <span>2.</span>
                    <span className="text-[oklch(0.85_0.01_260)]">
                      Select a repository from your dashboard
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[oklch(0.55_0.03_260)]">
                    <span>3.</span>
                    <span className="text-[oklch(0.85_0.01_260)]">
                      Edit your README visually
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[oklch(0.55_0.03_260)]">
                    <span>4.</span>
                    <span className="text-[oklch(0.85_0.01_260)]">
                      Commit with a message, or create a PR
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <span className="inline-block rounded bg-[oklch(0.66_0.20_208)]/20 px-1.5 py-0.5 text-[oklch(0.78_0.16_210)]">
                      visual-editor
                    </span>
                    <span className="inline-block rounded bg-[oklch(0.66_0.20_208)]/20 px-1.5 py-0.5 text-[oklch(0.78_0.16_210)]">
                      github
                    </span>
                  </div>
                </div>
                <div className="border-border border-t p-7 md:border-l md:border-t-0">
                  <h2 className="font-display text-2xl font-bold tracking-tight">
                    Getting Started
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    SharkDown lets you write documentation visually. No Markdown knowledge
                    required — just type, format, and push.
                  </p>
                  <h3 className="font-display mt-6 text-lg font-semibold">Quick start</h3>
                  <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/15 text-[11px] font-medium text-primary-glow">
                        1
                      </span>
                      Sign in with GitHub
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/15 text-[11px] font-medium text-primary-glow">
                        2
                      </span>
                      Select a repository from your dashboard
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/15 text-[11px] font-medium text-primary-glow">
                        3
                      </span>
                      Edit your README visually — or start a new doc
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/15 text-[11px] font-medium text-primary-glow">
                        4
                      </span>
                      Commit with a message, or create a PR
                    </li>
                  </ol>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
