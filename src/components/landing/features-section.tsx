"use client";

import {
  PenTool,
  Github,
  Image,
  FileDown,
  Type,
  GitBranch,
  Upload,
  FileCode,
} from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

const featureGroups = [
  {
    title: "Visual Editing",
    description: "Write like Word. No Markdown syntax required.",
    icon: PenTool,
    items: [
      { icon: Type, text: "Rich WYSIWYG powered by TipTap / ProseMirror" },
      { icon: FileCode, text: "Headings, bold, italic, lists, tables, code blocks" },
      { icon: GitBranch, text: "Three modes: Visual, Split, and Raw Markdown" },
    ],
  },
  {
    title: "GitHub Integration",
    description: "Edit any repo README without leaving the editor.",
    icon: Github,
    items: [
      { icon: Github, text: "Browse repos, switch branches, edit README.md" },
      { icon: GitBranch, text: "Commit changes and create pull requests" },
      { icon: PenTool, text: "OAuth 2.0 sign-in — token stored server-side" },
    ],
  },
  {
    title: "Smart Image Handling",
    description: "Paste an image. It uploads and inserts automatically.",
    icon: Image,
    items: [
      { icon: Upload, text: "Drag-and-drop or paste images directly into the editor" },
      { icon: Github, text: "Auto-uploads PNG, JPEG, WebP, and GIF to your repo" },
      { icon: Image, text: "Markdown image syntax inserted automatically" },
    ],
  },
  {
    title: "Markdown Export Engine",
    description: "Lossless round-trip. What you see is what you merge.",
    icon: FileDown,
    items: [
      { icon: FileCode, text: "GitHub Flavored Markdown — tables, tasks, footnotes" },
      { icon: FileDown, text: "Export .md files or copy to clipboard" },
      { icon: PenTool, text: "Import any .md, edit visually, export clean diffs" },
    ],
  },
];

export function FeaturesSection() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div
        className={`text-center transition-all duration-700 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground">
          Everything you need
        </div>
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          A complete doc workflow
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          From blank page to merged PR — without leaving your editor.
        </p>
      </div>

      <div
        className={`mt-12 grid gap-5 md:grid-cols-2 transition-all duration-700 delay-150 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {featureGroups.map((group) => (
          <div
            key={group.title}
            className="group rounded-2xl border border-border bg-surface p-7 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-glow ring-1 ring-primary/20">
              <group.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-semibold tracking-tight">{group.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
            <ul className="mt-5 space-y-2.5">
              {group.items.map((item) => (
                <li key={item.text} className="flex items-start gap-2.5 text-sm">
                  <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
