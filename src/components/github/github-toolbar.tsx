import {
  ExternalLink,
  GitBranch,
  Save,
  GitPullRequest,
  RefreshCw,
  Github,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Props {
  owner: string;
  repo: string;
  branch: string;
  readmeExists: boolean;
  saving: boolean;
  onSave: () => void;
  onRefresh: () => void;
  onCreatePR: () => void;
}

export function GithubToolbar({
  owner,
  repo,
  branch,
  readmeExists,
  saving,
  onSave,
  onRefresh,
  onCreatePR,
}: Props) {
  return (
    <div className="flex flex-1 items-center gap-2 min-w-0">
      <div className="flex items-center gap-1.5 min-w-0">
        <Github className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate text-sm font-medium">
          {owner}/{repo}
        </span>
      </div>

      <span className="hidden sm:inline-flex items-center gap-1 rounded-md border border-border bg-surface-elevated px-2 py-0.5 text-xs text-muted-foreground">
        <GitBranch className="h-3 w-3" />
        {branch}
      </span>

      <Separator orientation="vertical" className="h-5 mx-1 hidden sm:block" />

      <div className="hidden sm:flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          disabled={!readmeExists || saving}
          className="gap-1.5 h-8 text-xs"
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Save
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onCreatePR}
          disabled={!readmeExists}
          className="gap-1.5 h-8 text-xs"
        >
          <GitPullRequest className="h-3.5 w-3.5" />
          PR
        </Button>

        <Button variant="ghost" size="sm" onClick={onRefresh} className="gap-1.5 h-8 text-xs">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      <a
        href={`https://github.com/${owner}/${repo}`}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-auto hidden lg:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ExternalLink className="h-3 w-3" />
        Open on GitHub
      </a>
    </div>
  );
}
