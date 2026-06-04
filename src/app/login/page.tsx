"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <>
      <div className="mx-auto max-w-sm text-center">
        <div className="mb-8 flex justify-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-lg shadow-primary/30">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
              <path d="M3 14c4-7 14-7 18 0-3-2-6-2-9 1-3-3-6-3-9-1z" fill="currentColor" />
            </svg>
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold tracking-tight">
          Welcome to <span className="text-gradient">SharkDown</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Sign in with GitHub to browse repositories, edit README files visually, and publish changes.
        </p>

        {error && (
          <div className="mx-auto mt-6 max-w-xs rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-xs text-destructive">
            {error === "github_auth_failed"
              ? "GitHub authorization was cancelled or denied."
              : "Something went wrong during sign in. Please try again."}
          </div>
        )}

        <div className="mt-8 space-y-3">
          <Button asChild size="lg" className="w-full gap-2 rounded-full">
            <a
              href={`https://github.com/login/oauth/authorize?${new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ?? "",
                redirect_uri: `${origin}/api/auth/callback`,
                scope: "repo,read:user",
              })}`}
            >
              <Github className="h-5 w-5" />
              Sign in with GitHub
            </a>
          </Button>

          <Button asChild variant="outline" size="sm" className="w-full rounded-full">
            <Link href="/">
              Back to home <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Requires <span className="font-semibold text-foreground">repo</span> and{" "}
          <span className="font-semibold text-foreground">read:user</span> scopes. We never store your data on our servers.
        </p>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
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

      <div className="absolute right-6 top-5">
        <ThemeToggle />
      </div>

      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
