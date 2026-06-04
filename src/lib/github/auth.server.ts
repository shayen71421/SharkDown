import process from "node:process";
import { sessionStore } from "../session-store";

export interface GithubUser {
  id: number;
  login: string;
  avatar_url: string;
  name: string | null;
}

export function getAuthUrl(redirectUri: string): string {
  const clientId = process.env.GITHUB_CLIENT_ID ?? "";
  const scopes = "repo,read:user";
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes,
  });
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function exchangeCode(code: string): Promise<string> {
  const clientId = process.env.GITHUB_CLIENT_ID ?? "";
  const clientSecret = process.env.GITHUB_CLIENT_SECRET ?? "";

  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });

  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.status}`);
  }

  const body = (await res.json()) as { access_token?: string; error_description?: string };
  if (!body.access_token) {
    throw new Error(body.error_description ?? "No access token returned");
  }
  return body.access_token;
}

export async function getGithubUser(token: string): Promise<GithubUser> {
  const res = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch user: ${res.status}`);
  }
  const data = (await res.json()) as GithubUser;
  return data;
}

export async function createSession(githubToken: string, user: GithubUser): Promise<string> {
  const sessionId = await sessionStore.create({ githubToken, user });
  return sessionId;
}

export async function getSession(sessionId: string) {
  const data = await sessionStore.get(sessionId);
  if (!data) return null;
  return { githubToken: data.githubToken, user: data.user };
}

export async function deleteSession(sessionId: string): Promise<void> {
  await sessionStore.delete(sessionId);
}

export const SESSION_COOKIE = "sd_session";
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60;
