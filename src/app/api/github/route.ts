import { NextRequest, NextResponse } from "next/server";
import * as auth from "@/lib/github/auth.server";
import * as api from "@/lib/github/api.server";

async function requireToken(sessionId: string): Promise<string> {
  const session = await auth.getSession(sessionId);
  if (!session) throw new Error("Session expired or invalid");
  return session.githubToken;
}

const handlers: Record<string, (body: any) => Promise<any>> = {
  async checkSession({ sessionId }) {
    if (!sessionId) return { user: null };
    const session = await auth.getSession(sessionId);
    return { user: session?.user ?? null };
  },

  async listRepositories({ sessionId, page, search }) {
    const token = await requireToken(sessionId);
    return api.listRepositories(token, page ?? 1, search);
  },

  async getRepo({ sessionId, owner, repo }) {
    const token = await requireToken(sessionId);
    return api.getRepo(token, owner, repo);
  },

  async listBranches({ sessionId, owner, repo }) {
    const token = await requireToken(sessionId);
    return api.listBranches(token, owner, repo);
  },

  async getReadme({ sessionId, owner, repo, branch }) {
    const token = await requireToken(sessionId);
    return api.getReadme(token, owner, repo, branch);
  },

  async saveReadme({ sessionId, owner, repo, content, message, sha, branch }) {
    const token = await requireToken(sessionId);
    return api.saveReadme(token, owner, repo, content, message, sha, branch);
  },

  async uploadImage({ sessionId, owner, repo, image, filename, branch }) {
    const token = await requireToken(sessionId);
    return api.uploadImage(token, owner, repo, image, filename, `Add ${filename}`, branch);
  },

  async createBranch({ sessionId, owner, repo, baseBranch, newBranch }) {
    const token = await requireToken(sessionId);
    return api.createBranch(token, owner, repo, baseBranch, newBranch);
  },

  async createPullRequest({ sessionId, owner, repo, title, body, head, base }) {
    const token = await requireToken(sessionId);
    return api.createPullRequest(token, owner, repo, title, body, head, base);
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    if (!action || !(action in handlers)) {
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
    const result = await handlers[action](body);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
  }
}
