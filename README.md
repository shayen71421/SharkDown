# SharkDown 🦈

**Write like Word. Publish like Markdown.**

A visual-first, Markdown-native editor for developers, maintainers, and technical writers. Compose in a rich WYSIWYG editor — push straight to GitHub as commits and pull requests.

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
- **OAuth 2.0 sign-in** with server-side session store (in-memory for dev, swappable to Redis/Vercel KV)
- **Dashboard**: browse your GitHub repositories with search and pagination
- **README editor**: load any repo's README.md, edit visually, save changes back to GitHub
- **Branch selector**: switch between branches to view and edit different versions
- **Commit dialog**: commit README changes with a message, optionally to a new branch
- **Pull requests**: create a branch, commit changes, and open a PR — all from within the editor
- **Image upload**: upload PNG/JPEG/WebP/GIF images directly to your repo
- GitHub access token stored server-side in session store — never exposed to the client
- All errors sanitized — raw GitHub API errors never reach the client
- In-memory rate limiting per endpoint (30 req/min reads, 10 req/min writes)
- 10s timeout on reads, 30s timeout on writes — fails fast instead of hanging

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
- npm
- A GitHub OAuth App (for GitHub integration)

### Setup

1. **Clone and install:**
   ```bash
   git clone <repo-url>
   cd SharkDown
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your GitHub OAuth credentials:
   ```
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your_client_id
   ```

   Create an OAuth App at https://github.com/settings/developers:
   - Homepage URL: `http://localhost:3000`
   - Callback URL: `http://localhost:3000/api/auth/callback`

3. **Start developing:**
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

### Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack HMR |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Editor** | TipTap + ProseMirror |
| **Markdown** | `marked` (parser), `turndown` (serializer) |
| **State** | Zustand with persistence |
| **Auth** | GitHub OAuth 2.0, server-side session store (UUID cookie) |
| **Styling** | Tailwind CSS v4, shadcn/ui, Radix UI |
| **Fonts** | Inter, Space Grotesk, JetBrains Mono |
| **Icons** | Lucide React |
| **Forms** | React Hook Form + Zod |
| **Deploy** | Vercel (Next.js native) |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── callback/route.ts   # GitHub OAuth callback
│   │   │   └── logout/route.ts     # Session deletion
│   │   └── github/route.ts         # Single API gateway for all GitHub actions
│   ├── dashboard/page.tsx          # Repo browser (auth required)
│   ├── editor/page.tsx             # Standalone editor
│   ├── login/page.tsx              # GitHub sign-in
│   ├── repo/[owner]/[repo]/page.tsx  # Repo README editor (auth required)
│   ├── sitemap.xml/route.ts        # XML sitemap
│   ├── globals.css                 # Tailwind v4 + Midnight Indigo theme
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing page
│   └── providers.tsx               # QueryClient + ThemeProvider
├── components/
│   ├── editor/                     # MarkdownEditor, EditorToolbar
│   ├── github/                     # GithubToolbar, CommitDialog, PRDialog
│   ├── ui/                         # 45+ shadcn/ui components
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── github/
│   │   ├── auth.server.ts          # OAuth exchange, session create/get/delete
│   │   └── api.server.ts           # GitHub REST client + rate limiter + fetch timeout
│   ├── api.client.ts               # Shared client-side fetch wrapper
│   ├── session-store.ts            # In-memory session store (swap for Redis in prod)
│   ├── store.ts                    # Zustand stores
│   ├── markdown.ts                 # md↔html conversion
│   └── cookie.ts                   # Client-side cookie reader
├── hooks/
│   └── use-mobile.ts
└── middleware.ts
```

---

## Architecture

SharkDown uses **Next.js 16 App Router** for a seamless full-stack experience:

- **Single API gateway** (`/api/github`): a POST-only Route Handler dispatches to server-only GitHub functions by `action` field — no individual REST endpoints per operation.
- **Auth callback** (`/api/auth/callback`): GitHub OAuth code exchange, session creation, cookie set via `cookies()` from `next/headers`.
- **Zustand stores** persist editor content (`sharkdown-doc`) and GitHub session (`sharkdown-github`) to localStorage.
- **GitHub API calls** go through server-only modules (`api.server.ts`) — the OAuth token never reaches the browser. All fetches have AbortController timeouts (10s reads, 30s writes).
- **Session architecture**: a random UUID is stored in a non-HttpOnly cookie (`sd_session`). The UUID is a lookup key for the server-side session store, which holds the GitHub access token. Since the UUID alone grants no access without the store, it's safe in a non-HttpOnly cookie.
- **Rate limiting**: in-memory per-function rate limiter (30 req/min for reads, 10 req/min for writes).
- **Error sanitization**: all GitHub API errors are mapped to generic, user-friendly messages; raw status codes and error details are never exposed.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID (server-only) |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret (server-only) |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID` | Public client ID (shipped to browser) |

---

## Phase Roadmap

- ✅ **Phase 1** — Core editor: TipTap, markdown round-trip, formatting, tables, task lists, code blocks, three view modes
- ✅ **Phase 2** — GitHub integration: OAuth, repo browser, README editor, commit, PR, image upload
- 🔜 **Phase 3** — Collaboration, multi-file editing, offline support, API docs generation
