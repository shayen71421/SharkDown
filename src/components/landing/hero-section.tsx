"use client";

import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/use-in-view";

export function HeroSection() {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 md:pt-36 pb-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-[0.04]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-80 left-0 -z-10 h-[700px] w-[1000px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 20%, transparent), transparent)",
          filter: "blur(60px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-60 right-0 -z-10 h-[500px] w-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 10%, transparent), transparent)",
          filter: "blur(80px)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Left: text + CTAs */}
          <div
            className={`transition-all duration-700 ${
              inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3.5 py-1 text-xs text-muted-foreground">
              <Github className="h-3.5 w-3.5" />
              Open Source
            </div>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Write Markdown like Word.
              <br />
              Push to GitHub instantly.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              SharkDown is a visual editor for GitHub documentation. Compose in a rich WYSIWYG
              editor, export pristine GitHub Flavored Markdown, and commit — all without leaving
              your browser.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Button asChild size="lg" className="h-12 rounded-full px-8 text-base">
                <Link href="/editor">
                  Start Writing <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-full px-8 text-base"
              >
                <a
                  href="https://github.com/shayen71421/SharkDown"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-1.5 h-5 w-5" /> View on GitHub
                </a>
              </Button>
            </div>
          </div>

          {/* Right: editor mockup */}
          <div
            className={`transition-all duration-700 delay-200 ${
              inView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            }`}
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-primary/5">
              {/* Window chrome */}
              <div className="flex items-center gap-2 border-b border-border bg-surface-elevated/40 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                </div>
                <div className="mx-auto flex items-center gap-1.5 rounded-full bg-secondary/50 px-3 py-1 text-[11px] text-muted-foreground">
                  <Github className="h-3 w-3" />
                  <span>shayen71421 / SharkDown</span>
                  <span className="text-border">·</span>
                  <span>README.md</span>
                </div>
                <div className="w-[66px]" />
              </div>

              {/* Split view content */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Visual editor side */}
                <div className="space-y-3 border-border p-6 md:border-r">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-primary/20 text-[10px] text-primary-glow">
                      #
                    </span>
                    <h2 className="font-display text-xl font-bold tracking-tight">
                      SharkDown
                    </h2>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    A visual-first, Markdown-native editor for developers, maintainers, and
                    technical writers. Compose in a rich editor — push straight to GitHub as
                    commits and pull requests.
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="rounded-lg border border-border bg-surface-elevated/30 p-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <span className="grid h-4 w-4 shrink-0 place-items-center rounded border border-primary bg-primary/20 text-[9px] text-primary-glow">
                          ✓
                        </span>
                        Tables & checklists
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-surface-elevated/30 p-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <span className="grid h-4 w-4 shrink-0 place-items-center rounded border border-primary bg-primary/20 text-[9px] text-primary-glow">
                          ✓
                        </span>
                        Code blocks w/ syntax
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-surface-elevated/30 p-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <span className="grid h-4 w-4 shrink-0 place-items-center rounded border border-primary bg-primary/20 text-[9px] text-primary-glow">
                          ✓
                        </span>
                        Browse & edit repos
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-surface-elevated/30 p-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <span className="grid h-4 w-4 shrink-0 place-items-center rounded border border-primary bg-primary/20 text-[9px] text-primary-glow">
                          ✓
                        </span>
                        Commit & PR
                      </div>
                    </div>
                  </div>
                </div>

                {/* Markdown source side */}
                <div className="bg-[oklch(0.1_0.025_265)] p-6 font-mono text-[11px] leading-relaxed">
                  <div className="text-[oklch(0.55_0.03_260)]"># SharkDown</div>
                  <div className="mt-1.5 text-[oklch(0.85_0.01_260)]">
                    A visual-first, Markdown-native editor for developers.
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[oklch(0.55_0.03_260)]">
                    <span>- [x]</span>
                    <span className="text-[oklch(0.85_0.01_260)]">Tables & checklists</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[oklch(0.55_0.03_260)]">
                    <span>- [x]</span>
                    <span className="text-[oklch(0.85_0.01_260)]">Code blocks w/ syntax</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[oklch(0.55_0.03_260)]">
                    <span>- [x]</span>
                    <span className="text-[oklch(0.85_0.01_260)]">Browse & edit repos</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[oklch(0.55_0.03_260)]">
                    <span>- [x]</span>
                    <span className="text-[oklch(0.85_0.01_260)]">Commit & PR</span>
                  </div>
                  <div className="mt-3 h-6 w-20 animate-pulse rounded bg-[oklch(0.85_0.01_260)]/10" />
                </div>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between border-t border-border bg-surface-elevated/20 px-4 py-1.5 text-[11px] text-muted-foreground">
                <span>Visual mode</span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
                  Connected to GitHub
                </span>
                <span>GFM compatible</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
