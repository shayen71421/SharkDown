import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCode, getGithubUser, createSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/github/auth.server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/login?error=github_auth_failed", req.url));
  }

  try {
    const token = await exchangeCode(code);
    const user = await getGithubUser(token);
    const sessionId = await createSession(token, user);

    const response = NextResponse.redirect(new URL("/dashboard", req.url));
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, sessionId, {
      path: "/",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
    });
    return response;
  } catch (e) {
    console.error("OAuth callback error:", e);
    return NextResponse.redirect(new URL("/login?error=exchange_failed", req.url));
  }
}
