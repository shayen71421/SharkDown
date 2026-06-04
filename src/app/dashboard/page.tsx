"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Github,
  LogOut,
  Search,
  BookOpen,
  GitFork,
  Lock,
  Globe,
  ArrowRight,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { useGithubStore, type RepoInfo } from "@/lib/store";
import { getSessionId } from "@/lib/cookie";

async function callApi(action: string, data: any) {
  const res = await fetch("/api/github", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...data }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Request failed");
  return json;
}

export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    repos,
    repoPage,
    repoSearch,
    repoTotal,
    loading,
    setUser,
    setRepos,
    setRepoPage,
    setRepoSearch,
    setLoading,
  } = useGithubStore();
  const [searchInput, setSearchInput] = useState(repoSearch);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionId = getSessionId();

  useEffect(() => {
    if (!sessionId) {
      router.push("/login");
      return;
    }
    callApi("checkSession", { sessionId }).then((res) => {
      if (!res.user) {
        router.push("/login");
        return;
      }
      setUser(res.user);
    });
  }, []);

  useEffect(() => {
    if (!user || !sessionId) return;
    setLoading(true);
    setError(null);
    callApi("listRepositories", { sessionId, page: repoPage, search: repoSearch || undefined })
      .then((result) => {
        setRepos(result.repos, result.total);
      })
      .catch((err) => {
        console.error("Failed to load repos:", err);
        setError(err.message ?? "Failed to load repositories");
      })
      .finally(() => setLoading(false));
  }, [user, sessionId, repoPage, repoSearch]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setRepoSearch(value);
      setRepoPage(1);
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    useGithubStore.getState().reset();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center gap-3 border-b border-border bg-surface/80 px-4 py-2.5 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-bold shadow-lg shadow-primary/20">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path d="M3 14c4-7 14-7 18 0-3-2-6-2-9 1-3-3-6-3-9-1z" fill="currentColor" />
            </svg>
          </div>
          <span className="font-display text-sm font-bold tracking-tight hidden sm:inline">SharkDown</span>
        </Link>

        <Separator orientation="vertical" className="h-5" />

        <div className="flex flex-1 items-center gap-3">
          <img src={user.avatar_url} alt={user.login} className="h-7 w-7 rounded-full border border-border" />
          <span className="text-sm font-medium">{user.name ?? user.login}</span>
        </div>

        <ThemeToggle />

        <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-muted-foreground">
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Sign out</span>
        </Button>
      </header>

      <div className="mx-auto max-w-5xl px-4 pt-8 pb-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Repositories</h1>
          <a href={`https://github.com/${user.login}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <Github className="h-4 w-4" />{user.login}
          </a>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={searchInput} onChange={(e) => handleSearch(e.target.value)} placeholder="Search your repositories..." className="h-10 pl-9" />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-md rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-center">
            <AlertCircle className="mx-auto mb-2 h-6 w-6 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setRepoPage(1)}>Try again</Button>
          </div>
        )}

        {!loading && !error && repos.length === 0 && (
          <div className="py-16 text-center">
            <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              {repoSearch ? "No repositories match your search." : "No repositories found. Create one on GitHub first."}
            </p>
          </div>
        )}

        {!loading && repos.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
          </div>
        )}

        {repos.length > 0 && repoTotal > repos.length && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled={repoPage <= 1} onClick={() => setRepoPage(repoPage - 1)}>Previous</Button>
            <span className="text-xs text-muted-foreground">Page {repoPage}</span>
            <Button variant="outline" size="sm" disabled={repos.length < 30} onClick={() => setRepoPage(repoPage + 1)}>Next</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function RepoCard({ repo }: { repo: RepoInfo }) {
  return (
    <Link
      href={`/repo/${repo.owner.login}/${repo.name}`}
      className="group rounded-xl border border-border bg-surface p-5 transition hover:border-primary/30 hover:bg-surface-elevated block"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-semibold group-hover:text-primary-glow transition-colors">{repo.name}</h3>
          {repo.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{repo.description}</p>}
        </div>
        {repo.private ? <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" /> : <Globe className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />}
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{repo.default_branch}</Badge>
        <span className="flex items-center gap-1"><GitFork className="h-3 w-3" />{repo.owner.login}</span>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs text-primary-glow opacity-0 transition group-hover:opacity-100">
        <FileText className="h-3 w-3" />Edit README<ArrowRight className="h-3 w-3" />
      </div>
    </Link>
  );
}
