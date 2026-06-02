import { marked } from "marked";
import TurndownService from "turndown";

// Configure turndown with GFM-ish defaults
const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "*",
  strongDelimiter: "**",
  linkStyle: "inlined",
});

// strikethrough
turndown.addRule("strikethrough", {
  filter: ["del", "s", "strike" as keyof HTMLElementTagNameMap],
  replacement: (content) => `~~${content}~~`,
});

// underline -> not standard MD, preserve as <u> tag (markdown allows raw HTML)
turndown.addRule("underline", {
  filter: ["u"],
  replacement: (content) => `<u>${content}</u>`,
});

// highlight -> ==text==
turndown.addRule("highlight", {
  filter: ["mark"],
  replacement: (content) => `==${content}==`,
});

// sup/sub
turndown.addRule("superscript", {
  filter: ["sup"],
  replacement: (content) => `^${content}^`,
});
turndown.addRule("subscript", {
  filter: ["sub"],
  replacement: (content) => `~${content}~`,
});

// Task list items
turndown.addRule("taskListItems", {
  filter: (node) =>
    node.nodeName === "LI" &&
    (node as HTMLElement).getAttribute("data-type") === "taskItem",
  replacement: (_content, node) => {
    const el = node as HTMLElement;
    const checked = el.getAttribute("data-checked") === "true";
    const inner = (el.textContent ?? "").trim();
    return `- [${checked ? "x" : " "}] ${inner}\n`;
  },
});

// Tables (GFM)
turndown.addRule("tableCell", {
  filter: ["th", "td"],
  replacement: (content) => ` ${content.trim().replace(/\n/g, " ")} |`,
});
turndown.addRule("tableRow", {
  filter: "tr",
  replacement: (content, node) => {
    const row = `|${content}\n`;
    const isHeader =
      node.parentNode?.nodeName === "THEAD" ||
      (node.firstChild && (node.firstChild as HTMLElement).nodeName === "TH");
    if (isHeader) {
      const cellCount = (node as HTMLElement).childNodes.length;
      const sep = `|${" --- |".repeat(cellCount)}\n`;
      return row + sep;
    }
    return row;
  },
});
turndown.addRule("table", {
  filter: "table",
  replacement: (content) => `\n${content}\n`,
});

// Fenced code with language
turndown.addRule("fencedCode", {
  filter: (node) =>
    node.nodeName === "PRE" &&
    !!node.firstChild &&
    node.firstChild.nodeName === "CODE",
  replacement: (_content, node) => {
    const code = (node as HTMLElement).firstChild as HTMLElement;
    const className = code.getAttribute("class") ?? "";
    const lang = /language-(\S+)/.exec(className)?.[1] ?? "";
    const text = code.textContent ?? "";
    return `\n\`\`\`${lang}\n${text.replace(/\n$/, "")}\n\`\`\`\n`;
  },
});

marked.setOptions({ gfm: true, breaks: false });

// extension for ==highlight==
marked.use({
  extensions: [
    {
      name: "highlight",
      level: "inline",
      start(src: string) {
        return src.match(/==/)?.index;
      },
      tokenizer(src: string) {
        const m = /^==([^=]+)==/.exec(src);
        if (m) return { type: "highlight", raw: m[0], text: m[1] };
      },
      renderer(token) {
        return `<mark>${(token as unknown as { text: string }).text}</mark>`;
      },
    },
  ],
});

export function markdownToHtml(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

export function htmlToMarkdown(html: string): string {
  return turndown.turndown(html).replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
