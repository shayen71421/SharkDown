"use client";

import { X, Check, PenLine, GitCommit, FileCode } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

const problems = [
  {
    icon: PenLine,
    text: "Raw Markdown is painful to write and preview",
  },
  {
    icon: GitCommit,
    text: "Editing READMEs requires context-switching to the browser",
  },
  {
    icon: FileCode,
    text: "AI-generated Markdown is messy and inconsistent",
  },
];

const solutions = [
  {
    icon: PenLine,
    text: "Visual WYSIWYG editor — no Markdown syntax needed",
  },
  {
    icon: GitCommit,
    text: "Commit directly to GitHub from the editor",
  },
  {
    icon: FileCode,
    text: "Pristine GitHub Flavored Markdown export every time",
  },
];

export function ProblemSolution() {
  const { ref, inView } = useInView();

  return (
    <section id="features" ref={ref} className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <div
        className={`text-center transition-all duration-700 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground">
          Why SharkDown
        </div>
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Documentation shouldn&apos;t be this hard
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          The gap between writing and publishing is full of friction. SharkDown eliminates it.
        </p>
      </div>

      <div
        className={`mt-12 grid gap-6 md:grid-cols-2 transition-all duration-700 delay-150 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Problem column */}
        <div className="rounded-2xl border border-border/60 bg-surface/30 p-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
            <X className="h-3 w-3" /> The problem
          </div>
          <ul className="mt-6 space-y-4">
            {problems.map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <item.icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm text-muted-foreground">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Solution column */}
        <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary-glow">
            <Check className="h-3 w-3" /> SharkDown
          </div>
          <ul className="mt-6 space-y-4">
            {solutions.map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary-glow">
                  <item.icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
