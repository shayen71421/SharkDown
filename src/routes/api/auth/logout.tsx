import { createFileRoute } from "@tanstack/react-router";
import { SESSION_COOKIE } from "@/lib/github/auth.server";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async () => {
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/",
            "Set-Cookie": `${SESSION_COOKIE}=; Path=/; SameSite=Lax; Max-Age=0; HttpOnly`,
          },
        });
      },
    },
  },
});
