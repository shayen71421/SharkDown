import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ViewMode = "visual" | "split" | "markdown";

interface DocState {
  title: string;
  markdown: string;
  view: ViewMode;
  setTitle: (t: string) => void;
  setMarkdown: (m: string) => void;
  setView: (v: ViewMode) => void;
  reset: () => void;
}

const STARTER = `# Welcome to SharkDown 🦈

**Write like Word. Publish like Markdown.**

Start typing or use the toolbar above to format your document. Press \`/\` for quick block commands.

## Features

- Visual editing — no syntax required
- ==Round-trip== Markdown import and export
- Tables, task lists, code blocks, callouts
- *Dark* by default, light when you want it

> "The fastest way to write technical docs without ever touching a backtick."

### Try a checklist

- [x] Install SharkDown
- [ ] Write your first doc
- [ ] Export to Markdown

### Or some code

\`\`\`ts
function greet(name: string) {
  return \`Hello, \${name}!\`;
}
\`\`\`

| Feature | Status |
| --- | --- |
| Editor | Ready |
| Markdown IO | Ready |
| GitHub sync | Coming soon |
`;

export const useDoc = create<DocState>()(
  persist(
    (set) => ({
      title: "Untitled document",
      markdown: STARTER,
      view: "visual",
      setTitle: (title) => set({ title }),
      setMarkdown: (markdown) => set({ markdown }),
      setView: (view) => set({ view }),
      reset: () => set({ title: "Untitled document", markdown: STARTER }),
    }),
    { name: "sharkdown-doc" },
  ),
);

/* ───── GitHub store ───── */

export interface GithubUser {
  id: number;
  login: string;
  avatar_url: string;
  name: string | null;
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

interface GithubState {
  user: GithubUser | null;
  jwt: string | null;
  repos: RepoInfo[];
  repoPage: number;
  repoSearch: string;
  repoTotal: number;
  loading: boolean;
  setUser: (user: GithubUser | null) => void;
  setJwt: (jwt: string | null) => void;
  setRepos: (repos: RepoInfo[], total: number) => void;
  setRepoPage: (page: number) => void;
  setRepoSearch: (search: string) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useGithubStore = create<GithubState>()(
  persist(
    (set) => ({
      user: null,
      jwt: null,
      repos: [],
      repoPage: 1,
      repoSearch: "",
      repoTotal: 0,
      loading: false,
      setUser: (user) => set({ user }),
      setJwt: (jwt) => set({ jwt }),
      setRepos: (repos, total) => set({ repos, repoTotal: total }),
      setRepoPage: (repoPage) => set({ repoPage }),
      setRepoSearch: (repoSearch) => set({ repoSearch }),
      setLoading: (loading) => set({ loading }),
      reset: () =>
        set({ user: null, jwt: null, repos: [], repoPage: 1, repoSearch: "", repoTotal: 0 }),
    }),
    { name: "sharkdown-github", partialize: (state) => ({ user: state.user }) },
  ),
);
