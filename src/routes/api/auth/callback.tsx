import { createFileRoute } from "@tanstack/react-router";
import {
  exchangeCode,
  getGithubUser,
  createSession,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/github/auth.server";

export const Route = createFileRoute("/api/auth/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");

        if (error || !code) {
          return new Response(null, {
            status: 302,
            headers: { Location: "/login?error=github_auth_failed" },
          });
        }

        try {
          const token = await exchangeCode(code);
          const user = await getGithubUser(token);
          const jwt = await createSession({ token, user });

          return new Response(null, {
            status: 302,
            headers: {
              Location: "/dashboard",
              "Set-Cookie": `${SESSION_COOKIE}=${jwt}; Path=/; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}`,
            },
          });
        } catch (e) {
          console.error("OAuth callback error:", e);
          return new Response(null, {
            status: 302,
            headers: { Location: "/login?error=exchange_failed" },
          });
        }
      },
    },
  },
});
