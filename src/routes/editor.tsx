import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  ArrowLeft,
  Download,
  Upload,
  Copy,
  Check,
  Columns2,
  Eye,
  Pencil,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast, Toaster } from "sonner";

import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useDoc, type ViewMode } from "@/lib/store";

export const Route = createFileRoute("/editor")({
  head: () => ({
    meta: [
      { title: "Editor — SharkDown" },
      {
        name: "description",
        content:
          "Compose Markdown visually with SharkDown's TipTap-powered editor.",
      },
    ],
  }),
  component: EditorPage,
});

function EditorPage() {
  const { title, markdown, view, setTitle, setMarkdown, setView } = useDoc();
  const [editor, setEditor] = useState<Editor | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // tiny "saved" indicator off zustand persistence
  useEffect(() => {
    const t = setTimeout(() => setSavedAt(new Date()), 600);
    return () => clearTimeout(t);
  }, [markdown, title]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    toast.success("Markdown copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safe = title.trim().replace(/[^\w\-]+/g, "-").toLowerCase() || "document";
    a.href = url;
    a.download = `${safe}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded .md file");
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setMarkdown(text);
      const base = file.name.replace(/\.md$/i, "");
      if (base) setTitle(base);
      toast.success(`Imported ${file.name}`);
    };
    reader.readAsText(file);
  };

  const count = editor?.storage.characterCount;
  const chars = count?.characters() ?? markdown.length;
  const words = count?.words() ?? markdown.split(/\s+/).filter(Boolean).length;

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
        <Button asChild variant="ghost" size="icon" className="h-9 w-9">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-6" />

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-8 max-w-md border-transparent bg-transparent px-2 font-display text-base font-semibold shadow-none focus-visible:border-border focus-visible:bg-surface-elevated focus-visible:ring-0"
            placeholder="Untitled document"
          />
          {savedAt && (
            <span className="hidden text-xs text-muted-foreground md:inline">
              Saved {savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>

        <Tabs
          value={view}
          onValueChange={(v) => setView(v as ViewMode)}
          className="hidden sm:block"
        >
          <TabsList className="h-9 bg-surface-elevated">
            <TabsTrigger value="visual" className="gap-1.5 text-xs">
              <Pencil className="h-3.5 w-3.5" /> Visual
            </TabsTrigger>
            <TabsTrigger value="split" className="gap-1.5 text-xs">
              <Columns2 className="h-3.5 w-3.5" /> Split
            </TabsTrigger>
            <TabsTrigger value="markdown" className="gap-1.5 text-xs">
              <Eye className="h-3.5 w-3.5" /> Markdown
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Separator orientation="vertical" className="h-6" />

        <input
          ref={fileRef}
          type="file"
          accept=".md,.markdown,text/markdown,text/plain"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
            e.target.value = "";
          }}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileRef.current?.click()}
          className="gap-1.5"
          title="Import Markdown"
        >
          <Upload className="h-4 w-4" />
          <span className="hidden md:inline">Import</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="gap-1.5"
          title="Copy Markdown"
        >
          {copied ? (
            <Check className="h-4 w-4 text-success" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="hidden md:inline">Copy</span>
        </Button>
        <Button
          size="sm"
          onClick={handleDownload}
          className="gap-1.5"
          title="Download .md"
        >
          <Download className="h-4 w-4" />
          <span className="hidden md:inline">Export</span>
        </Button>
        <ThemeToggle />
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {(view === "visual" || view === "split") && (
          <div className="flex min-w-0 flex-1 flex-col">
            <EditorToolbar editor={editor} />
            <div className="flex-1 overflow-auto">
              <div className="mx-auto max-w-3xl">
                <MarkdownEditor
                  markdown={markdown}
                  onChange={setMarkdown}
                  onReady={setEditor}
                />
              </div>
            </div>
          </div>
        )}
        {view === "split" && (
          <Separator orientation="vertical" className="h-auto" />
        )}
        {(view === "markdown" || view === "split") && (
          <div className="flex min-w-0 flex-1 flex-col bg-[oklch(0.1_0.025_265)] dark:bg-[oklch(0.1_0.025_265)]">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5 text-xs text-muted-foreground">
              <span className="font-mono">markdown</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 rounded px-2 py-0.5 hover:bg-white/5"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-success" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                copy
              </button>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              spellCheck={false}
              className="min-h-0 flex-1 resize-none border-0 bg-transparent p-6 font-mono text-sm leading-relaxed text-[oklch(0.92_0.01_260)] outline-none"
            />
          </div>
        )}
      </div>

      {/* Status bar */}
      <footer className="flex items-center justify-between border-t border-border bg-surface/80 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
        <div className="flex items-center gap-4">
          <span>{words.toLocaleString()} words</span>
          <span>{chars.toLocaleString()} characters</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">
            ⌘B bold · ⌘I italic · / commands
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Autosaved locally
          </span>
        </div>
      </footer>
    </div>
  );
}
