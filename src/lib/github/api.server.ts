import process from "node:process";

const GH_API = "https://api.github.com";

function headers(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "SharkDown",
  };
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
  const perPage = 30;
  let url = `${GH_API}/user/repos?per_page=${perPage}&page=${page}&sort=updated&type=all`;

  if (search) {
    url = `${GH_API}/search/repositories?q=${encodeURIComponent(`${search} user:@me`)}&per_page=${perPage}&page=${page}&sort=updated`;
    const res = await fetch(url, { headers: headers(token) });
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data = (await res.json()) as { items: Repo[]; total_count: number };
    return { repos: data.items, total: data.total_count };
  }

  const res = await fetch(url, { headers: headers(token) });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

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
  const ref = branch ? `?ref=${encodeURIComponent(branch)}` : "";
  const url = `${GH_API}/repos/${owner}/${repo}/readme${ref}`;

  const res = await fetch(url, { headers: headers(token) });

  if (res.status === 404) {
    return { content: "", sha: "", path: "README.md", exists: false };
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch README: ${res.status} ${res.statusText}`);
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
  const ref = branch ? `?ref=${encodeURIComponent(branch)}` : "";
  const url = `${GH_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}${ref}`;

  const res = await fetch(url, { headers: headers(token) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

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
  const url = `${GH_API}/repos/${owner}/${repo}/contents/README.md`;
  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(content, "utf-8").toString("base64"),
  };
  if (sha) body.sha = sha;
  if (branch) body.branch = branch;

  const res = await fetch(url, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? `Failed to save: ${res.status} ${res.statusText}`);
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
  const path = `public/${filename}`;
  const url = `${GH_API}/repos/${owner}/${repo}/contents/${path}`;

  const body: Record<string, unknown> = {
    message,
    content: imageData,
  };
  if (branch) body.branch = branch;

  const res = await fetch(url, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? `Failed to upload image: ${res.status}`);
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
  // Get the SHA of the base branch
  const refUrl = `${GH_API}/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(baseBranch)}`;
  const refRes = await fetch(refUrl, { headers: headers(token) });
  if (!refRes.ok) throw new Error(`Failed to get base branch ref: ${refRes.status}`);
  const refData = (await refRes.json()) as { object: { sha: string } };

  // Create the new branch
  const createUrl = `${GH_API}/repos/${owner}/${repo}/git/refs`;
  const createRes = await fetch(createUrl, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({
      ref: `refs/heads/${newBranch}`,
      sha: refData.object.sha,
    }),
  });

  if (!createRes.ok) {
    const err = (await createRes.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? `Failed to create branch: ${createRes.status}`);
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
  const url = `${GH_API}/repos/${owner}/${repo}/pulls`;

  const res = await fetch(url, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ title, body, head, base }),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? `Failed to create PR: ${res.status}`);
  }

  return (await res.json()) as PrResult;
}

export interface RepoPermission {
  admin: boolean;
  push: boolean;
  pull: boolean;
}

export async function checkPermissions(
  token: string,
  owner: string,
  repo: string,
): Promise<RepoPermission> {
  const url = `${GH_API}/repos/${owner}/${repo}`;
  const res = await fetch(url, { headers: headers(token) });
  if (!res.ok) throw new Error(`Failed to check permissions: ${res.status}`);

  const data = (await res.json()) as { permissions: RepoPermission };
  return data.permissions;
}
