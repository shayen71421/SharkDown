import { useState } from "react";
import { Loader2, GitPullRequest, ExternalLink, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePR: (title: string, description: string, branchName: string) => Promise<void>;
  creating: boolean;
  result: { html_url: string } | null;
}

export function PRDialog({ open, onOpenChange, onCreatePR, creating, result }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const branchName = `sharkdown-readme-${Date.now()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setError(null);
    try {
      await onCreatePR(title.trim(), description.trim(), branchName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create PR");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after a short delay to avoid visual flash
    setTimeout(() => {
      setTitle("");
      setDescription("");
      setError(null);
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {result ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <DialogTitle>Pull request created!</DialogTitle>
                  <DialogDescription>Your changes are ready for review.</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
              <a
                href={result.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary-glow hover:bg-primary/20 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                View pull request on GitHub
              </a>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GitPullRequest className="h-5 w-5" />
                Create pull request
              </DialogTitle>
              <DialogDescription>
                A new branch <span className="font-mono text-foreground">{branchName}</span> will be
                created with your changes, then a PR will be opened.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">PR title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Update README.md with SharkDown"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your changes..."
                  rows={4}
                />
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error}
                </div>
              )}

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={handleClose} disabled={creating}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!title.trim() || creating} className="gap-1.5">
                  {creating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <GitPullRequest className="h-4 w-4" />
                  )}
                  {creating ? "Creating..." : "Create PR"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
