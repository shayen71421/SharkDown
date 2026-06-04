import process from "node:process";

const GH_API = "https://api.github.com";

/* ───── Simple in-memory rate limiter ───── */
const buckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string, limit: number, windowMs: number): void {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  bucket.count++;
  if (bucket.count > limit) {
    throw new Error("Too many requests. Please slow down.");
  }
}

function headers(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "SharkDown",
  };
}

async function ghFetch(url: string, options: RequestInit = {}, timeoutMs = 10_000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (e: any) {
    if (e.name === "AbortError") {
      throw new Error("GitHub API request timed out. Please try again.");
    }
    throw new Error("Network error while contacting GitHub. Please check your connection.");
  } finally {
    clearTimeout(timeout);
  }
}

function sanitizeError(context: string, status: number): Error {
  if (status === 401 || status === 403) {
    return new Error("Unable to authenticate. Please sign in again.");
  }
  if (status === 404) {
    return new Error("The requested resource was not found.");
  }
  return new Error(`Unable to ${context}. Please try again.`);
}

export interface RepoInfo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  default_branch: string;
  html_url: string;
  owner: { login: string; avatar_url: string };
  updated_at: string;
}

export async function getRepo(token: string, owner: string, repo: string): Promise<RepoInfo> {
  checkRateLimit("getRepo", 30, 60_000);
  const url = `${GH_API}/repos/${owner}/${repo}`;
  const res = await ghFetch(url, { headers: headers(token) });
  if (!res.ok) throw sanitizeError("load repository", res.status);
  return (await res.json()) as RepoInfo;
}

export interface Branch {
  name: string;
  commit: { sha: string; url: string };
}

export async function listBranches(token: string, owner: string, repo: string): Promise<Branch[]> {
  checkRateLimit("listBranches", 30, 60_000);
  const url = `${GH_API}/repos/${owner}/${repo}/branches?per_page=100`;
  const res = await ghFetch(url, { headers: headers(token) });
  if (!res.ok) throw sanitizeError("load branches", res.status);
  return (await res.json()) as Branch[];
}

export interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  default_branch: string;
  html_url: string;
  owner: { login: string; avatar_url: string };
  updated_at: string;
}

export async function listRepositories(
  token: string,
  page = 1,
  search?: string,
): Promise<{ repos: Repo[]; total: number }> {
  checkRateLimit("listRepos", 30, 60_000);
  const perPage = 30;
  let url = `${GH_API}/user/repos?per_page=${perPage}&page=${page}&sort=updated&type=all`;

  if (search) {
    url = `${GH_API}/search/repositories?q=${encodeURIComponent(`${search} user:@me`)}&per_page=${perPage}&page=${page}&sort=updated`;
    const res = await ghFetch(url, { headers: headers(token) });
    if (!res.ok) throw sanitizeError("load repositories", res.status);
    const data = (await res.json()) as { items: Repo[]; total_count: number };
    return { repos: data.items, total: data.total_count };
  }

  const res = await ghFetch(url, { headers: headers(token) });
  if (!res.ok) throw sanitizeError("load repositories", res.status);

  const repos = (await res.json()) as Repo[];
  const linkHeader = res.headers.get("link") ?? "";
  const total = linkHeader ? 999 : repos.length;
  return { repos, total };
}

export interface ReadmeResult {
  content: string;
  sha: string;
  path: string;
  exists: boolean;
}

export async function getReadme(
  token: string,
  owner: string,
  repo: string,
  branch?: string,
): Promise<ReadmeResult> {
  checkRateLimit("getReadme", 30, 60_000);
  const ref = branch ? `?ref=${encodeURIComponent(branch)}` : "";
  const url = `${GH_API}/repos/${owner}/${repo}/readme${ref}`;

  const res = await ghFetch(url, { headers: headers(token) });

  if (res.status === 404) {
    return { content: "", sha: "", path: "README.md", exists: false };
  }
  if (!res.ok) {
    throw sanitizeError("load README", res.status);
  }

  const data = (await res.json()) as { content: string; sha: string; path: string };
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  return { content: decoded, sha: data.sha, path: data.path, exists: true };
}

export async function getFile(
  token: string,
  owner: string,
  repo: string,
  path: string,
  branch?: string,
): Promise<{ content: string; sha: string } | null> {
  checkRateLimit("getFile", 30, 60_000);
  const ref = branch ? `?ref=${encodeURIComponent(branch)}` : "";
  const url = `${GH_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}${ref}`;

  const res = await ghFetch(url, { headers: headers(token) });
  if (res.status === 404) return null;
  if (!res.ok) throw sanitizeError("access file", res.status);

  const data = (await res.json()) as { content: string; sha: string };
  return { content: Buffer.from(data.content, "base64").toString("utf-8"), sha: data.sha };
}

export interface SaveResult {
  sha: string;
  commit: { sha: string; html_url: string };
}

export async function saveReadme(
  token: string,
  owner: string,
  repo: string,
  content: string,
  message: string,
  sha: string,
  branch?: string,
): Promise<SaveResult> {
  checkRateLimit("saveReadme", 10, 60_000);
  const url = `${GH_API}/repos/${owner}/${repo}/contents/README.md`;
  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(content, "utf-8").toString("base64"),
  };
  if (sha) body.sha = sha;
  if (branch) body.branch = branch;

  const res = await ghFetch(url, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(body),
  }, 30_000);

  if (!res.ok) {
    throw sanitizeError("save file", res.status);
  }

  const data = (await res.json()) as SaveResult;
  return data;
}

export async function uploadImage(
  token: string,
  owner: string,
  repo: string,
  imageData: string,
  filename: string,
  message: string,
  branch?: string,
): Promise<{ path: string; url: string }> {
  checkRateLimit("uploadImage", 10, 60_000);
  const path = `public/${filename}`;
  const url = `${GH_API}/repos/${owner}/${repo}/contents/${path}`;

  const body: Record<string, unknown> = {
    message,
    content: imageData,
  };
  if (branch) body.branch = branch;

  const res = await ghFetch(url, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(body),
  }, 30_000);

  if (!res.ok) {
    throw sanitizeError("upload image", res.status);
  }

  return { path, url: `${owner}/${repo}/main/${path}` };
}

export interface BranchResult {
  name: string;
  commit: { sha: string; url: string };
}

export async function createBranch(
  token: string,
  owner: string,
  repo: string,
  baseBranch: string,
  newBranch: string,
): Promise<BranchResult> {
  checkRateLimit("createBranch", 10, 60_000);
  // Get the SHA of the base branch
  const refUrl = `${GH_API}/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(baseBranch)}`;
  const refRes = await ghFetch(refUrl, { headers: headers(token) });
  if (!refRes.ok) throw sanitizeError("create branch", refRes.status);
  const refData = (await refRes.json()) as { object: { sha: string } };

  // Create the new branch
  const createUrl = `${GH_API}/repos/${owner}/${repo}/git/refs`;
  const createRes = await ghFetch(createUrl, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({
      ref: `refs/heads/${newBranch}`,
      sha: refData.object.sha,
    }),
  }, 30_000);

  if (!createRes.ok) {
    throw sanitizeError("create branch", createRes.status);
  }

  return (await createRes.json()) as BranchResult;
}

export interface PrResult {
  html_url: string;
  number: number;
  title: string;
}

export async function createPullRequest(
  token: string,
  owner: string,
  repo: string,
  title: string,
  body: string,
  head: string,
  base: string,
): Promise<PrResult> {
  checkRateLimit("createPullRequest", 10, 60_000);
  const url = `${GH_API}/repos/${owner}/${repo}/pulls`;

  const res = await ghFetch(url, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ title, body, head, base }),
  }, 30_000);

  if (!res.ok) {
    throw sanitizeError("create pull request", res.status);
  }

  return (await res.json()) as PrResult;
}
