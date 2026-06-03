import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { verifySession } from "./auth.server";
import * as api from "./api.server";

async function requireToken(jwt: string | null): Promise<string> {
  if (!jwt) throw new Error("Not authenticated");
  const session = await verifySession(jwt);
  if (!session) throw new Error("Session expired or invalid");
  return session.token;
}

const SessionInput = z.object({ jwt: z.string().nullable() });

export const getSession = createServerFn({ method: "POST" })
  .inputValidator(SessionInput)
  .handler(async ({ data }) => {
    try {
      const session = data.jwt ? await verifySession(data.jwt) : null;
      if (!session) return { user: null };
      return { user: session.user };
    } catch {
      return { user: null };
    }
  });

const ListReposInput = z.object({
  jwt: z.string(),
  page: z.number().optional().default(1),
  search: z.string().optional(),
});

export const listRepositories = createServerFn({ method: "POST" })
  .inputValidator(ListReposInput)
  .handler(async ({ data }) => {
    const token = await requireToken(data.jwt);
    return api.listRepositories(token, data.page, data.search);
  });

const GetReadmeInput = z.object({
  jwt: z.string(),
  owner: z.string(),
  repo: z.string(),
  branch: z.string().optional(),
});

export const getReadme = createServerFn({ method: "POST" })
  .inputValidator(GetReadmeInput)
  .handler(async ({ data }) => {
    const token = await requireToken(data.jwt);
    return api.getReadme(token, data.owner, data.repo, data.branch);
  });

const SaveReadmeInput = z.object({
  jwt: z.string(),
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
    const token = await requireToken(data.jwt);
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
  jwt: z.string(),
  owner: z.string(),
  repo: z.string(),
  image: z.string(),
  filename: z.string(),
  branch: z.string().optional(),
});

export const uploadImage = createServerFn({ method: "POST" })
  .inputValidator(UploadImageInput)
  .handler(async ({ data }) => {
    const token = await requireToken(data.jwt);
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
  jwt: z.string(),
  owner: z.string(),
  repo: z.string(),
  baseBranch: z.string(),
  newBranch: z.string(),
});

export const createBranch = createServerFn({ method: "POST" })
  .inputValidator(CreateBranchInput)
  .handler(async ({ data }) => {
    const token = await requireToken(data.jwt);
    return api.createBranch(token, data.owner, data.repo, data.baseBranch, data.newBranch);
  });

const CreatePrInput = z.object({
  jwt: z.string(),
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
    const token = await requireToken(data.jwt);
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

const CheckPermissionsInput = z.object({
  jwt: z.string(),
  owner: z.string(),
  repo: z.string(),
});

export const checkPermissions = createServerFn({ method: "POST" })
  .inputValidator(CheckPermissionsInput)
  .handler(async ({ data }) => {
    const token = await requireToken(data.jwt);
    return api.checkPermissions(token, data.owner, data.repo);
  });
