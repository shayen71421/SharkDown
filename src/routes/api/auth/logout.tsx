import { createFileRoute } from "@tanstack/react-router";
import { SESSION_COOKIE, deleteSession } from "@/lib/github/auth.server";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const cookie = request.headers.get("cookie") ?? "";
        const match = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
        const sessionId = match ? decodeURIComponent(match[1]) : null;
        if (sessionId) await deleteSession(sessionId);

        return new Response(null, {
          status: 302,
          headers: {
            Location: "/",
            "Set-Cookie": `${SESSION_COOKIE}=; Path=/; SameSite=Lax; Max-Age=0`,
          },
        });
      },
    },
  },
});
