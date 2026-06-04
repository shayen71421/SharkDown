import process from "node:process";
import IORedis from "ioredis";

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

/* ───── Redis (works with Vercel KV + Official Redis for Vercel) ───── */

class RedisStore implements SessionStore {
  private redis: IORedis;

  constructor() {
    const url = redisUrl();
    this.redis = new IORedis(url, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
    });
  }

  async create(data: Omit<SessionData, "createdAt" | "expiresAt">): Promise<string> {
    const sessionId = crypto.randomUUID();
    const now = Date.now();
    await this.redis.setex(sessionId, SESSION_TTL_SEC, JSON.stringify({
      ...data,
      createdAt: now,
      expiresAt: now + SESSION_TTL_SEC * 1000,
    }));
    return sessionId;
  }

  async get(sessionId: string): Promise<SessionData | null> {
    const raw = await this.redis.get(sessionId);
    if (!raw) return null;
    const data: SessionData = JSON.parse(raw);
    if (Date.now() > data.expiresAt) {
      await this.redis.del(sessionId);
      return null;
    }
    return data;
  }

  async delete(sessionId: string): Promise<void> {
    await this.redis.del(sessionId);
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

/* ───── helper: scan env for prefixed redis/kv vars ───── */

function findEnv(suffix: string): string | undefined {
  for (const key of Object.keys(process.env)) {
    if (key.endsWith(suffix)) return process.env[key];
  }
}

function redisUrl(): string {
  return findEnv("KV_URL") || findEnv("REDIS_URL") || "";
}

function hasRedis(): boolean {
  return !!redisUrl();
}

/* ───── Factory — auto-detect Redis vs in-memory ───── */

export function createSessionStore(): SessionStore {
  if (hasRedis()) {
    return new RedisStore();
  }
  return new InMemoryStore();
}

export const sessionStore = createSessionStore();
