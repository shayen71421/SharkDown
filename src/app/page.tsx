"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  FileDown,
  FileUp,
  Github,
  Wand2,
  Eye,
  Table2,
  ListChecks,
  Code2,
  Quote,
  GitFork,
  ImagePlus,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useGithubStore } from "@/lib/store";

const features = [
  {
    icon: Wand2,
    title: "Visual first",
    body: "A modern WYSIWYG built on TipTap. Type like Word, ship like Markdown.",
  },
  {
    icon: Code2,
    title: "Code-block ready",
    body: "Syntax highlighting for 15+ languages with language selector and copy button.",
  },
  {
    icon: Table2,
    title: "Real tables",
    body: "Add, remove, resize columns. Round-trips to clean GFM Markdown.",
  },
  {
    icon: Github,
    title: "GitHub native",
    body: "Sign in with GitHub, browse your repos, and edit any README visually.",
  },
  {
    icon: GitFork,
    title: "Commit & PR",
    body: "Push changes, create branches, and open pull requests — without leaving the editor.",
  },
  {
    icon: ImagePlus,
    title: "Image hosting",
    body: "Upload images directly to your repo. No external service needed.",
  },
  {
    icon: Eye,
    title: "Split preview",
    body: "Toggle visual, Markdown, or side-by-side — see the source any time.",
  },
  {
    icon: ListChecks,
    title: "Task lists",
    body: "Checklists, nested lists, and todo blocks that survive export.",
  },
  {
    icon: Quote,
    title: "Lossless round-trip",
    body: "Import any .md file, edit visually, export Markdown that still diffs cleanly.",
  },
];

export default function Landing() {
  const { user } = useGithubStore();
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 35%, transparent), transparent)",
          filter: "blur(20px)",
        }}
      />

      <header className="mx-auto flex max-w-6xl items-center px-6 py-5">
        <div className="flex flex-1">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <Logo />
            <span className="font-display text-lg font-bold tracking-tight">SharkDown</span>
          </Link>
        </div>
        <nav className="absolute left-1/2 -translate-x-1/2 hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#roadmap" className="hover:text-foreground">
            Roadmap
          </a>
          {user ? (
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="hover:text-foreground">
                Sign in
              </Link>
              <Link href="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
            </>
          )}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="rounded-full">
            <Link href="/editor">
              Open editor <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 rounded-full">
                  <img src={user.avatar_url} alt={user.login} className="h-5 w-5 rounded-full" />
                  <span className="max-w-24 truncate">{user.name ?? user.login}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" });
                    useGithubStore.getState().reset();
                    window.location.reload();
                  }}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link href="/login">
                <Github className="mr-1 h-4 w-4" /> Sign in
              </Link>
            </Button>
          )}
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 pb-16 pt-12 text-center md:pt-20">
        <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          Write like Word
          <br />
          Publish like Markdown
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
          SharkDown is a visual-first, Markdown-native editor for developers, maintainers, and
          technical writers. Compose in a rich editor — push straight to GitHub as commits and pull
          requests.
        </p>
        <div className="mt-9 flex items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full px-6">
            <Link href="/editor">
              Start writing <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-6">
            <a href="#features">See features</a>
          </Button>
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl border border-border bg-surface text-left glow-shadow">
          <div className="flex items-center gap-1.5 border-b border-border bg-surface-elevated/60 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
            <span className="ml-3 text-xs text-muted-foreground">README.md — SharkDown</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="space-y-4 border-border p-8 md:border-r">
              <h2 className="font-display text-2xl font-bold">Hello, document</h2>
              <p className="text-sm text-muted-foreground">
                A friendly editor with <span className="font-semibold text-foreground">bold</span>,{" "}
                <em>italics</em>, and{" "}
                <code className="rounded bg-secondary px-1.5 py-0.5 text-xs text-primary-glow">
                  inline code
                </code>
                .
              </p>
              <ul className="space-y-1.5 text-sm">
                <li className="flex items-center gap-2">
                  <span className="grid h-4 w-4 place-items-center rounded border border-primary bg-primary/20 text-[10px] text-primary-glow">✓</span>
                  Tables & checklists
                </li>
                <li className="flex items-center gap-2">
                  <span className="grid h-4 w-4 place-items-center rounded border border-primary bg-primary/20 text-[10px] text-primary-glow">✓</span>
                  Code blocks with syntax highlighting
                </li>
                <li className="flex items-center gap-2">
                  <span className="grid h-4 w-4 place-items-center rounded border border-primary bg-primary/20 text-[10px] text-primary-glow">✓</span>
                  Browse & edit GitHub repos
                </li>
                <li className="flex items-center gap-2">
                  <span className="grid h-4 w-4 place-items-center rounded border border-primary bg-primary/20 text-[10px] text-primary-glow">✓</span>
                  Commit & open pull requests
                </li>
              </ul>
            </div>
            <div className="bg-[oklch(0.1_0.025_265)] p-8 font-mono text-xs leading-relaxed text-[oklch(0.85_0.01_260)]">
              <div className="text-[oklch(0.55_0.03_260)]"># Hello, document</div>
              <div className="mt-2">A friendly editor with **bold**, *italics*, and `inline code`.</div>
              <div className="mt-4">- [x] Tables & checklists</div>
              <div>- [x] Code blocks with syntax highlighting</div>
              <div>- [x] Browse & edit GitHub repos</div>
              <div>- [x] Commit & open pull requests</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Edit locally. Ship to GitHub.
          </h2>
          <p className="mt-4 text-muted-foreground">A rich editor, full GitHub workflow — no terminal required.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-surface p-6 transition hover:border-primary/40 hover:bg-surface-elevated"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary-glow">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-8">
            <FileUp className="mb-4 h-6 w-6 text-primary-glow" />
            <h3 className="font-display text-xl font-bold">Drop in any .md</h3>
            <p className="mt-2 text-sm text-muted-foreground">Paste Markdown, upload a file, or open a README.</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-8">
            <FileDown className="mb-4 h-6 w-6 text-primary-glow" />
            <h3 className="font-display text-xl font-bold">Export pristine</h3>
            <p className="mt-2 text-sm text-muted-foreground">Copy to clipboard or download .md. GFM-compatible.</p>
          </div>
        </div>
      </section>

      <section id="roadmap" className="mx-auto max-w-3xl px-6 pb-24 text-center">
        <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground">
          <Github className="h-3.5 w-3.5" /> Phase 2 — Live now
        </div>
        <h2 className="font-display text-3xl font-bold">Ship docs from your editor.</h2>
        <p className="mt-3 text-muted-foreground">
          Sign in with GitHub, browse your repos, edit README files visually, commit and open pull requests.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/login">
              <Github className="mr-2 h-4 w-4" /> Sign in with GitHub
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border bg-surface/40 py-6 text-center text-xs text-muted-foreground">
        Built with TipTap, marked, and a lot of fins. © {new Date().getFullYear()} SharkDown.
      </footer>
    </div>
  );
}

function Logo() {
  return <img src="/logo.png" alt="SharkDown" className="h-8 w-8 rounded-lg object-cover" />;
}
