"use client";

import Link from "next/link";
import { Github as GithubIcon } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/50 bg-surface/20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-10 md:flex-row md:justify-between">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="SharkDown" className="h-6 w-6 rounded object-cover" />
            <span className="font-display font-semibold text-foreground">SharkDown</span>
          </Link>
          <span className="text-border">·</span>
          <span>Visual Markdown Editor for GitHub</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a
            href="https://github.com/shayen71421/SharkDown"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <GithubIcon className="h-4 w-4" /> GitHub
          </a>
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#demo" className="transition-colors hover:text-foreground">
            Demo
          </a>
          <span className="text-border">·</span>
          <span className="text-xs">
            &copy; {new Date().getFullYear()} SharkDown
          </span>
        </div>
      </div>
    </footer>
  );
}
