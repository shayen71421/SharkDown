"use client";

import Link from "next/link";
import { ChevronDown, Github } from "lucide-react";
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

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="relative h-8 w-8 overflow-hidden rounded-lg ring-1 ring-border">
        <img src="/logo.png" alt="SharkDown" className="h-full w-full object-cover" />
      </div>
      <span className="font-display text-lg font-bold tracking-tight">SharkDown</span>
    </Link>
  );
}

export function LandingHeader() {
  const { user } = useGithubStore();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-transparent backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
        <Logo />

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#demo" className="transition-colors hover:text-foreground">
            Demo
          </a>
          <a
            href="https://github.com/shayen71421/SharkDown"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-3">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 rounded-full">
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="h-6 w-6 rounded-full ring-1 ring-border"
                  />
                  <span className="hidden max-w-24 truncate sm:inline">{user.name ?? user.login}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
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

          <Button asChild size="sm" className="hidden rounded-full sm:inline-flex">
            <Link href="/editor">Open editor</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
