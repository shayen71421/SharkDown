import { Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  loading?: boolean;
}

export function GithubLoginButton({ loading }: Props) {
  const authUrl =
    import.meta.env.VITE_GITHUB_AUTH_URL ??
    `https://github.com/login/oauth/authorize?${new URLSearchParams({
      client_id: import.meta.env.VITE_GITHUB_CLIENT_ID ?? "",
      redirect_uri: `${window.location.origin}/api/auth/callback`,
      scope: "repo,read:user",
    })}`;

  return (
    <Button asChild size="lg" className="w-full gap-2 rounded-full" disabled={loading}>
      <a href={authUrl}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Github className="h-5 w-5" />}
        Sign in with GitHub
      </a>
    </Button>
  );
}
