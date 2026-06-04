"use client";

import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/use-in-view";

export function CTASection() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/50 py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-[0.03]" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 15%, transparent), transparent)",
          filter: "blur(80px)",
        }}
      />

      <div
        className={`mx-auto max-w-3xl px-6 text-center transition-all duration-700 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
          Start building better documentation
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Join developers who write docs visually, commit instantly, and ship to GitHub without
          the friction.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
    </section>
  );
}
