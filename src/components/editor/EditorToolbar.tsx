import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Highlighter,
  Superscript as SupIcon,
  Subscript as SubIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Code2,
  Table as TableIcon,
  Undo2,
  Redo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Props {
  editor: Editor | null;
}

function Btn({
  active,
  onClick,
  title,
  children,
  disabled,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        "h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/60",
        active && "bg-accent text-foreground",
      )}
    >
      {children}
    </Button>
  );
}

export function EditorToolbar({ editor }: Props) {
  if (!editor || !editor.isEditable) {
    return <div className="h-12 border-b border-border bg-surface/60" />;
  }

  const setLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL", prev ?? "https://");
    if (url === null) return;
    const trimmed = url.trim();
    if (trimmed === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    const { empty } = editor.state.selection;
    if (empty) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${trimmed.replace(/"/g, "&quot;")}">${trimmed}</a>`)
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (!url) return;
    const trimmed = url.trim();
    if (!trimmed) return;
    editor
      .chain()
      .focus()
      .insertContent(`<img src="${trimmed.replace(/"/g, "&quot;")}">`)
      .run();
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-0.5 border-b border-border bg-surface/80 px-3 py-1.5 backdrop-blur-md">
      <Btn
        title="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo2 className="h-4 w-4" />
      </Btn>
      <Btn
        title="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo2 className="h-4 w-4" />
      </Btn>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <Btn
        title="Heading 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </Btn>
      <Btn
        title="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Btn>
      <Btn
        title="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </Btn>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <Btn
        title="Bold (⌘B)"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Btn>
      <Btn
        title="Italic (⌘I)"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Btn>
      <Btn
        title="Underline (⌘U)"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Btn>
      <Btn
        title="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Btn>
      <Btn
        title="Inline code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </Btn>
      <Btn
        title="Highlight"
        active={editor.isActive("highlight")}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter className="h-4 w-4" />
      </Btn>
      <Btn
        title="Superscript"
        active={editor.isActive("superscript")}
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
      >
        <SupIcon className="h-4 w-4" />
      </Btn>
      <Btn
        title="Subscript"
        active={editor.isActive("subscript")}
        onClick={() => editor.chain().focus().toggleSubscript().run()}
      >
        <SubIcon className="h-4 w-4" />
      </Btn>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <Btn
        title="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Btn>
      <Btn
        title="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Btn>
      <Btn
        title="Task list"
        active={editor.isActive("taskList")}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
      >
        <ListChecks className="h-4 w-4" />
      </Btn>
      <Btn
        title="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </Btn>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <Btn
        title="Align left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="h-4 w-4" />
      </Btn>
      <Btn
        title="Align center"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="h-4 w-4" />
      </Btn>
      <Btn
        title="Align right"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="h-4 w-4" />
      </Btn>
      <Btn
        title="Justify"
        active={editor.isActive({ textAlign: "justify" })}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <AlignJustify className="h-4 w-4" />
      </Btn>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <Btn title="Link" active={editor.isActive("link")} onClick={setLink}>
        <LinkIcon className="h-4 w-4" />
      </Btn>
      <Btn title="Image" onClick={addImage}>
        <ImageIcon className="h-4 w-4" />
      </Btn>
      <Btn
        title="Code block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code2 className="h-4 w-4" />
      </Btn>
      <Btn title="Table" onClick={addTable}>
        <TableIcon className="h-4 w-4" />
      </Btn>
      <Btn title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="h-4 w-4" />
      </Btn>
    </div>
  );
}
