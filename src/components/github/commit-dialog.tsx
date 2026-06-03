import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (message: string, branch?: string) => Promise<void>;
  saving: boolean;
}

export function CommitDialog({ open, onOpenChange, onSave, saving }: Props) {
  const [message, setMessage] = useState("Update README.md");
  const [branch, setBranch] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await onSave(message.trim(), branch.trim() || undefined);
      onOpenChange(false);
      setMessage("Update README.md");
      setBranch("");
    } catch {
      // error handled by parent
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Commit changes</DialogTitle>
          <DialogDescription>Save your changes to the README.md file on GitHub.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Commit message</label>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Update README.md"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Branch{" "}
              <span className="text-muted-foreground font-normal">
                (optional — defaults to current)
              </span>
            </label>
            <Input
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="leave empty to use current branch"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!message.trim() || saving} className="gap-1.5">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {saving ? "Saving..." : "Commit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
