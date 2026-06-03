import { SESSION_COOKIE } from "./github/auth.server";

export function getSessionJwt(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  return match ? match[1] : null;
}

export function requireSessionJwt(): string {
  const jwt = getSessionJwt();
  if (!jwt) throw new Error("Not authenticated");
  return jwt;
}
