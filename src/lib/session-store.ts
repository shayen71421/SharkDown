import process from "node:process";
import { kv } from "@vercel/kv";

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

const SESSION_TTL_SEC = 7 * 24 * 60 * 60;

/* ───── Vercel KV (Redis) — production ───── */

class KvStore implements SessionStore {
  async create(data: Omit<SessionData, "createdAt" | "expiresAt">): Promise<string> {
    const sessionId = crypto.randomUUID();
    const now = Date.now();
    await kv.set(sessionId, {
      ...data,
      createdAt: now,
      expiresAt: now + SESSION_TTL_SEC * 1000,
    }, { ex: SESSION_TTL_SEC });
    return sessionId;
  }

  async get(sessionId: string): Promise<SessionData | null> {
    const data = await kv.get<SessionData>(sessionId);
    if (!data) return null;
    if (Date.now() > data.expiresAt) {
      await kv.del(sessionId);
      return null;
    }
    return data;
  }

  async delete(sessionId: string): Promise<void> {
    await kv.del(sessionId);
  }
}

/* ───── In-memory implementation (dev) ───── */

class InMemoryStore implements SessionStore {
  private store = new Map<string, SessionData>();

  async create(data: Omit<SessionData, "createdAt" | "expiresAt">): Promise<string> {
    const sessionId = crypto.randomUUID();
    const now = Date.now();
    this.store.set(sessionId, {
      ...data,
      createdAt: now,
      expiresAt: now + SESSION_TTL_SEC * 1000,
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

/* ───── Factory — auto-detect Vercel KV vs in-memory ───── */

export function createSessionStore(): SessionStore {
  if (process.env.KV_URL) {
    return new KvStore();
  }
  return new InMemoryStore();
}

export const sessionStore = createSessionStore();
