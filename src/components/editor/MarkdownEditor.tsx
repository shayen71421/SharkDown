import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import { useEffect, useRef } from "react";
import { markdownToHtml, htmlToMarkdown } from "@/lib/markdown";

const lowlight = createLowlight(common);

export function buildExtensions() {
  return [
    StarterKit.configure({
      codeBlock: false,
      link: false,
    }),
    Underline,
    Highlight,
    Superscript,
    Subscript,
    Typography,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
    }),
    Image.configure({ inline: false, allowBase64: true }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    CodeBlockLowlight.configure({ lowlight, defaultLanguage: "plaintext" }),
    Placeholder.configure({
      placeholder: "Type / for commands, or just start writing…",
    }),
    CharacterCount,
  ];
}

interface Props {
  markdown: string;
  onChange: (markdown: string) => void;
  onReady?: (editor: Editor) => void;
}

export function MarkdownEditor({ markdown, onChange, onReady }: Props) {
  const lastEmitted = useRef(markdown);

  const editor = useEditor({
    extensions: buildExtensions(),
    content: markdownToHtml(markdown),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose-invert max-w-none focus:outline-none px-10 py-12 min-h-[60vh]",
      },
    },
    onUpdate: ({ editor }) => {
      const md = htmlToMarkdown(editor.getHTML());
      lastEmitted.current = md;
      onChange(md);
    },
  });

  useEffect(() => {
    if (editor && onReady) onReady(editor);
  }, [editor, onReady]);

  // External markdown changes (e.g. import)
  useEffect(() => {
    if (!editor) return;
    if (markdown === lastEmitted.current) return;
    const html = markdownToHtml(markdown);
    editor.commands.setContent(html, { emitUpdate: false });
    lastEmitted.current = markdown;
  }, [editor, markdown]);

  return <EditorContent editor={editor} className="h-full" />;
}
