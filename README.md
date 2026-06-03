# SharkDown 🦈

**Write like Word. Publish like Markdown.**

A visual-first, Markdown-native editor for developers, maintainers, and technical writers. Compose in a rich WYSIWYG editor — export pristine, standards-compliant Markdown every time. With built-in GitHub integration for browsing repos, editing READMEs, and opening pull requests.

---

## Features

### Visual Markdown Editor
- Full WYSIWYG editor powered by **TipTap** (ProseMirror)
- **Lossless round-trip**: `marked` for Markdown → HTML, `turndown` with custom GFM rules for HTML → Markdown
- Three view modes: **Visual**, **Split** (side-by-side), and **Raw Markdown**
- Rich formatting toolbar: headings, bold/italic/underline/strikethrough, inline code, highlights, superscript/subscript
- Lists: bullet, numbered, task/checklist (nested)
- Tables: insert, resize, add/remove rows and columns
- Code blocks with syntax highlighting for 15+ languages (via `lowlight`)
- Blockquotes, horizontal rules, typographic replacements
- Keyboard shortcuts (⌘B bold, ⌘I italic, ⌘U underline, etc.)
- Image insertion by URL
- Undo/redo history

### GitHub Integration
- **OAuth 2.0 sign-in** with JWT session cookies (30-day expiry)
- **Dashboard**: browse your GitHub repositories with search and pagination
- **README editor**: load any repo's README.md, edit visually, save changes back to GitHub
- **Commit dialog**: commit README changes with a message, optionally to a new branch
- **Pull requests**: create a branch, commit changes, and open a PR — all from within the editor
- **Image upload**: upload PNG/JPEG/WebP/GIF images directly to your repo's root
- GitHub access token encrypted in an HS256 JWT — never exposed to the client

### Theme & UI
- Dark-by-default with Light and System modes via `next-themes`
- **Midnight Indigo** color palette using OKLCH
- 45+ shadcn/ui components built on Radix UI primitives
- Responsive layout with mobile-aware navigation
- Toast notifications via `sonner`

---

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm
- A GitHub OAuth App (for GitHub integration)

### Setup

1. **Clone and install:**
   ```bash
   git clone <repo-url>
   cd SharkDown
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your GitHub OAuth credentials and an auth secret:
   ```
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   AUTH_SECRET=a-random-string-at-least-32-characters-long
   ```

   Create an OAuth App at https://github.com/settings/developers:
   - Homepage URL: `http://localhost:4321`
   - Callback URL: `http://localhost:4321/api/auth/callback`

3. **Start developing:**
   ```bash
   pnpm dev
   ```

4. Open http://localhost:4321

### Scripts
| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with HMR |
| `pnpm build` | Production build |
| `pnpm build:dev` | Dev-mode build |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format with Prettier |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | TanStack Start (SSR, file-based routing, server functions) |
| **Editor** | TipTap + ProseMirror |
| **Markdown** | `marked` (parser), `turndown` (serializer) |
| **State** | Zustand with persistence |
| **Auth** | GitHub OAuth 2.0, `jose` (JWT HS256) |
| **Styling** | Tailwind CSS v4, shadcn/ui, Radix UI |
| **Fonts** | Inter, Space Grotesk, JetBrains Mono |
| **Icons** | Lucide React |
| **Forms** | React Hook Form + Zod |
| **Deploy** | Nitro / Cloudflare Workers |

---

## Project Structure

```
src/
├── components/
│   ├── editor/          # MarkdownEditor, EditorToolbar
│   ├── github/          # GithubToolbar, CommitDialog, PRDialog, etc.
│   ├── ui/              # 45+ shadcn/ui components
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── routes/
│   ├── __root.tsx       # Root shell, error/404 boundaries
│   ├── index.tsx        # Landing page
│   ├── editor.tsx       # Standalone editor
│   ├── login.tsx        # GitHub sign-in
│   ├── dashboard.tsx    # Repo browser (auth required)
│   └── repo/$owner/$repo.tsx  # Repo README editor (auth required)
├── lib/
│   ├── github/
│   │   ├── auth.server.ts      # OAuth, JWT create/verify
│   │   ├── api.server.ts       # GitHub REST client
│   │   └── functions.server.ts # TanStack server functions
│   ├── store.ts         # Zustand stores
│   ├── markdown.ts      # md↔html conversion
│   └── cookie.ts        # Client-side cookie reader
├── hooks/               # use-mobile
├── router.tsx           # TanStack Router setup
├── server.ts            # SSR entry
└── start.ts             # TanStack Start instance
```

---

## Architecture

SharkDown uses **TanStack Start** for a seamless full-stack experience:

- **Server functions** (`createServerFn`) call server-only code (GitHub API, JWT verification) from the client without writing REST endpoints.
- **Zustand stores** persist editor content (`sharkdown-doc`) and GitHub session (`sharkdown-github`) to localStorage.
- GitHub API calls go through server-only modules (`api.server.ts`) — the OAuth token never reaches the browser.
- Session is an encrypted HS256 JWT stored in a cookie (`sd_session`), verified server-side on every server function call.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |
| `AUTH_SECRET` | Encryption key for JWT (32+ characters) |
| `VITE_GITHUB_CLIENT_ID` | Public client ID (shipped to browser) |

---

## Phase Roadmap

- ✅ **Phase 1** — Core editor: TipTap, markdown round-trip, formatting, tables, task lists, code blocks, three view modes
- ✅ **Phase 2** — GitHub integration: OAuth, repo browser, README editor, commit, PR, image upload
- 🔜 **Phase 3** — Collaboration, multi-file editing, offline support, API docs generation
