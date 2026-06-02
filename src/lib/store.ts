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
