import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSession } from "./auth.server";
import * as api from "./api.server";

async function requireGithubToken(sessionId: string | null): Promise<string> {
  if (!sessionId) throw new Error("Not authenticated");
  const session = await getSession(sessionId);
  if (!session) throw new Error("Session expired or invalid");
  return session.githubToken;
}

const SessionInput = z.object({ sessionId: z.string().nullable() });

export const checkSession = createServerFn({ method: "POST" })
  .inputValidator(SessionInput)
  .handler(async ({ data }) => {
    if (!data.sessionId) return { user: null };
    const session = await getSession(data.sessionId);
    if (!session) return { user: null };
    return { user: session.user };
  });

const ListReposInput = z.object({
  sessionId: z.string(),
  page: z.number().optional().default(1),
  search: z.string().optional(),
});

export const listRepositories = createServerFn({ method: "POST" })
  .inputValidator(ListReposInput)
  .handler(async ({ data }) => {
    const token = await requireGithubToken(data.sessionId);
    return api.listRepositories(token, data.page, data.search);
  });

const GetRepoInput = z.object({
  sessionId: z.string(),
  owner: z.string(),
  repo: z.string(),
});

export const getRepo = createServerFn({ method: "POST" })
  .inputValidator(GetRepoInput)
  .handler(async ({ data }) => {
    const token = await requireGithubToken(data.sessionId);
    return api.getRepo(token, data.owner, data.repo);
  });

const ListBranchesInput = z.object({
  sessionId: z.string(),
  owner: z.string(),
  repo: z.string(),
});

export const listBranches = createServerFn({ method: "POST" })
  .inputValidator(ListBranchesInput)
  .handler(async ({ data }) => {
    const token = await requireGithubToken(data.sessionId);
    return api.listBranches(token, data.owner, data.repo);
  });

const GetReadmeInput = z.object({
  sessionId: z.string(),
  owner: z.string(),
  repo: z.string(),
  branch: z.string().optional(),
});

export const getReadme = createServerFn({ method: "POST" })
  .inputValidator(GetReadmeInput)
  .handler(async ({ data }) => {
    const token = await requireGithubToken(data.sessionId);
    return api.getReadme(token, data.owner, data.repo, data.branch);
  });

const SaveReadmeInput = z.object({
  sessionId: z.string(),
  owner: z.string(),
  repo: z.string(),
  content: z.string(),
  message: z.string(),
  sha: z.string(),
  branch: z.string().optional(),
});

export const saveReadme = createServerFn({ method: "POST" })
  .inputValidator(SaveReadmeInput)
  .handler(async ({ data }) => {
    const token = await requireGithubToken(data.sessionId);
    return api.saveReadme(
      token,
      data.owner,
      data.repo,
      data.content,
      data.message,
      data.sha,
      data.branch,
    );
  });

const UploadImageInput = z.object({
  sessionId: z.string(),
  owner: z.string(),
  repo: z.string(),
  image: z.string(),
  filename: z.string(),
  branch: z.string().optional(),
});

export const uploadImage = createServerFn({ method: "POST" })
  .inputValidator(UploadImageInput)
  .handler(async ({ data }) => {
    const token = await requireGithubToken(data.sessionId);
    const message = `Add ${data.filename}`;
    return api.uploadImage(
      token,
      data.owner,
      data.repo,
      data.image,
      data.filename,
      message,
      data.branch,
    );
  });

const CreateBranchInput = z.object({
  sessionId: z.string(),
  owner: z.string(),
  repo: z.string(),
  baseBranch: z.string(),
  newBranch: z.string(),
});

export const createBranch = createServerFn({ method: "POST" })
  .inputValidator(CreateBranchInput)
  .handler(async ({ data }) => {
    const token = await requireGithubToken(data.sessionId);
    return api.createBranch(token, data.owner, data.repo, data.baseBranch, data.newBranch);
  });

const CreatePrInput = z.object({
  sessionId: z.string(),
  owner: z.string(),
  repo: z.string(),
  title: z.string(),
  body: z.string(),
  head: z.string(),
  base: z.string(),
});

export const createPullRequest = createServerFn({ method: "POST" })
  .inputValidator(CreatePrInput)
  .handler(async ({ data }) => {
    const token = await requireGithubToken(data.sessionId);
    return api.createPullRequest(
      token,
      data.owner,
      data.repo,
      data.title,
      data.body,
      data.head,
      data.base,
    );
  });
