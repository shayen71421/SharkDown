import process from "node:process";

export interface SessionData {
  githubToken: string;
  user: { id: number; login: string; avatar_url: string; name: string | null };
  createdAt: number;
  expiresAt: number;
}

export interface SessionStore {
  create(data: Omit<SessionData, "createdAt" | "expiresAt">): Promise<string>;
  get(sessionId: string): Promise<SessionData | null>;
  delete(sessionId: string): Promise<void>;
}

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/* ───── In-memory implementation (dev) ───── */

class InMemoryStore implements SessionStore {
  private store = new Map<string, SessionData>();

  async create(data: Omit<SessionData, "createdAt" | "expiresAt">): Promise<string> {
    const sessionId = crypto.randomUUID();
    const now = Date.now();
    this.store.set(sessionId, {
      ...data,
      createdAt: now,
      expiresAt: now + SESSION_TTL_MS,
    });
    return sessionId;
  }

  async get(sessionId: string): Promise<SessionData | null> {
    const data = this.store.get(sessionId);
    if (!data) return null;
    if (Date.now() > data.expiresAt) {
      this.store.delete(sessionId);
      return null;
    }
    return data;
  }

  async delete(sessionId: string): Promise<void> {
    this.store.delete(sessionId);
  }
}

/* ───── Production stub — swap in Redis/Vercel KV ───── */

export function createSessionStore(): SessionStore {
  return new InMemoryStore();
}

export const sessionStore = createSessionStore();
