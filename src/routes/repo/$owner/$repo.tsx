import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  ArrowLeft,
  Save,
  Github,
  RefreshCw,
  ExternalLink,
  GitBranch,
  GitPullRequest,
  FileText,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast, Toaster } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { ThemeToggle } from "@/components/theme-toggle";
import { GithubToolbar } from "@/components/github/github-toolbar";
import { CommitDialog } from "@/components/github/commit-dialog";
import { PRDialog } from "@/components/github/pr-dialog";
import { useDoc, useGithubStore, type ViewMode } from "@/lib/store";
import { getSessionJwt } from "@/lib/cookie";
import {
  getSession,
  getReadme,
  saveReadme,
  uploadImage,
  createBranch,
  createPullRequest,
} from "@/lib/github/functions.server";

export const Route = createFileRoute("/repo/$owner/$repo")({
  head: ({ params }) => ({
    meta: [{ title: `${params.owner}/${params.repo} — SharkDown` }],
  }),
  component: RepoEditorPage,
});

function RepoEditorPage() {
  const { owner, repo } = useParams({ from: Route.id });
  const navigate = useNavigate();
  const { title, markdown, view, setTitle, setMarkdown, setView } = useDoc();
  const { user, jwt } = useGithubStore();
  const [editor, setEditor] = useState<Editor | null>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readmeSha, setReadmeSha] = useState("");
  const [readmeExists, setReadmeExists] = useState(false);
  const [currentBranch, setCurrentBranch] = useState("main");
  const [lastCommitSha, setLastCommitSha] = useState("");
  const [showCommit, setShowCommit] = useState(false);
  const [showPR, setShowPR] = useState(false);
  const [creatingPr, setCreatingPr] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [prResult, setPrResult] = useState<{ html_url: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Check session
  useEffect(() => {
    const token = getSessionJwt();
    if (!token) {
      navigate({ to: "/login" });
      return;
    }
    useGithubStore.getState().setJwt(token);
    getSession({ data: { jwt: token } }).then((session) => {
      if (!session.user) {
        navigate({ to: "/login" });
        return;
      }
      useGithubStore.getState().setUser(session.user);
    });
  }, []);

  // Reset editor state when view switches away from visual/split
  useEffect(() => {
    if (view !== "visual" && view !== "split") {
      setEditor(null);
      setEditorReady(false);
    }
  }, [view]);

  // Load README
  useEffect(() => {
    if (!user || !jwt) return;
    setLoading(true);
    setError(null);

    getReadme({ data: { jwt: jwt!, owner, repo } })
      .then((result) => {
        setMarkdown(result.content);
        setTitle(`${owner}/${repo} README`);
        setReadmeSha(result.sha);
        setReadmeExists(result.exists);
      })
      .catch((err) => {
        console.error("Failed to load README:", err);
        setError(err.message ?? "Failed to load README");
      })
      .finally(() => setLoading(false));
  }, [owner, repo, user, jwt]);

  // Create README (when none exists)
  const handleCreateReadme = () => {
    const defaultContent = `# ${owner}/${repo}\n\n`;
    setMarkdown(defaultContent);
    setReadmeSha("");
    setReadmeExists(true);
    setTitle(`${owner}/${repo} README`);
    toast.success("New README ready. Save it to GitHub when you're done.");
  };

  // Save README to GitHub
  const handleSave = async (message: string, branch?: string) => {
    setSaving(true);
    try {
      const result = await saveReadme({
        data: {
          jwt: jwt!,
          owner,
          repo,
          content: markdown,
          message,
          sha: readmeSha,
          branch,
        },
      });
      setReadmeSha(result.sha);
      setLastCommitSha(result.commit.sha);
      toast.success("Saved to GitHub!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save";
      toast.error(msg);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Image upload
  const handleImageUpload = async (file: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Unsupported image type. Use PNG, JPEG, WebP, or GIF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image too large. Maximum 10MB.");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "png";
      const filename = `image-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      const result = await uploadImage({
        data: {
          jwt: jwt!,
          owner,
          repo,
          image: base64,
          filename,
          branch: currentBranch,
        },
      });

      const mdLink = `![${filename}](${result.path})`;
      if (editor) {
        editor.chain().focus().insertContent(mdLink).run();
      } else {
        setMarkdown(markdown + `\n${mdLink}\n`);
      }
      toast.success("Image uploaded to repository!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  // Create pull request
  const handleCreatePR = async (title: string, description: string, branchName: string) => {
    setCreatingPr(true);
    try {
      // 1. Create branch
      await createBranch({
        data: {
          jwt: jwt!,
          owner,
          repo,
          baseBranch: currentBranch,
          newBranch: branchName,
        },
      });

      // 2. Save README to the new branch
      await saveReadme({
        data: {
          jwt: jwt!,
          owner,
          repo,
          content: markdown,
          message: title,
          sha: readmeSha,
          branch: branchName,
        },
      });

      // 3. Create PR
      const pr = await createPullRequest({
        data: {
          jwt: jwt!,
          owner,
          repo,
          title,
          body: description,
          head: branchName,
          base: currentBranch,
        },
      });

      setPrResult(pr);
      toast.success("Pull request created!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create PR";
      toast.error(msg);
      throw err;
    } finally {
      setCreatingPr(false);
    }
  };

  // Trigger file picker for image
  const triggerImageUpload = () => {
    fileRef.current?.click();
  };

  // Word/char count
  const count = editor?.storage.characterCount;
  const chars = count?.characters() ?? markdown.length;
  const words = count?.words() ?? markdown.split(/\s+/).filter(Boolean).length;

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--surface-elevated)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          },
        }}
      />

      {/* Top bar */}
      <header className="z-30 flex items-center gap-2 border-b border-border bg-surface/80 px-4 py-2.5 backdrop-blur-md">
        <Button asChild variant="ghost" size="icon" className="h-9 w-9 shrink-0">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-5" />

        <GithubToolbar
          owner={owner}
          repo={repo}
          branch={currentBranch}
          readmeExists={readmeExists}
          saving={saving}
          onSave={() => setShowCommit(true)}
          onRefresh={() => {
            setLoading(true);
            getReadme({ data: { jwt: jwt!, owner, repo } })
              .then((r) => {
                setMarkdown(r.content);
                setReadmeSha(r.sha);
                setReadmeExists(r.exists);
              })
              .finally(() => setLoading(false));
          }}
          onCreatePR={() => setShowPR(true)}
        />

        <div className="flex items-center gap-1.5">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImageUpload(f);
              e.target.value = "";
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={triggerImageUpload}
            disabled={uploading}
            className="gap-1.5"
            title="Upload image"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
            <span className="hidden md:inline">Image</span>
          </Button>
        </div>

        <Tabs
          value={view}
          onValueChange={(v) => setView(v as ViewMode)}
          className="hidden sm:block"
        >
          <TabsList className="h-9 bg-surface-elevated">
            <TabsTrigger value="visual" className="gap-1.5 text-xs">
              Visual
            </TabsTrigger>
            <TabsTrigger value="split" className="gap-1.5 text-xs">
              Split
            </TabsTrigger>
            <TabsTrigger value="markdown" className="gap-1.5 text-xs">
              Markdown
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <ThemeToggle />
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading README...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="max-w-md text-center">
              <AlertCircle className="mx-auto mb-3 h-10 w-10 text-destructive" />
              <h2 className="text-lg font-semibold text-foreground">Failed to load README</h2>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  getReadme({ data: { jwt: jwt!, owner, repo } })
                    .then((r) => {
                      setMarkdown(r.content);
                      setReadmeSha(r.sha);
                      setReadmeExists(r.exists);
                    })
                    .catch((e) => setError(e.message))
                    .finally(() => setLoading(false));
                }}
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Retry
              </Button>
            </div>
          </div>
        ) : !readmeExists ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="max-w-md text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
              <h2 className="text-xl font-semibold">No README yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                This repository doesn't have a README.md file. Create one now and start editing
                visually.
              </p>
              <Button size="lg" className="mt-6 rounded-full" onClick={handleCreateReadme}>
                Create README.md
              </Button>
            </div>
          </div>
        ) : (
          <>
            {(view === "visual" || view === "split") && (
              <div className="flex min-w-0 flex-1 flex-col">
                {editorReady && editor && <EditorToolbar editor={editor} />}
                <div className="flex-1 overflow-auto">
                  <div className="mx-auto max-w-3xl">
                    <MarkdownEditor
                      markdown={markdown}
                      onChange={setMarkdown}
                      onReady={(e) => {
                        setEditor(e);
                        setEditorReady(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {view === "split" && <Separator orientation="vertical" className="h-auto" />}
            {(view === "markdown" || view === "split") && (
              <div className="flex min-w-0 flex-1 flex-col bg-[oklch(0.1_0.025_265)] dark:bg-[oklch(0.1_0.025_265)]">
                <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5 text-xs text-muted-foreground">
                  <span className="font-mono">markdown</span>
                </div>
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  spellCheck={false}
                  className="min-h-0 flex-1 resize-none border-0 bg-transparent p-6 font-mono text-sm leading-relaxed text-[oklch(0.92_0.01_260)] outline-none"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Status bar */}
      {readmeExists && !loading && (
        <footer className="flex items-center justify-between border-t border-border bg-surface/80 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
          <div className="flex items-center gap-4">
            <span>{words.toLocaleString()} words</span>
            <span>{chars.toLocaleString()} characters</span>
          </div>
          <div className="flex items-center gap-3">
            {lastCommitSha && (
              <span className="hidden sm:inline font-mono">#{lastCommitSha.slice(0, 7)}</span>
            )}
            <a
              href={`https://github.com/${owner}/${repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              <ExternalLink className="h-3 w-3" />
              Open on GitHub
            </a>
          </div>
        </footer>
      )}

      {/* Dialogs */}
      <CommitDialog
        open={showCommit}
        onOpenChange={setShowCommit}
        onSave={handleSave}
        saving={saving}
      />

      <PRDialog
        open={showPR}
        onOpenChange={setShowPR}
        onCreatePR={handleCreatePR}
        creating={creatingPr}
        result={prResult}
      />
    </div>
  );
}
