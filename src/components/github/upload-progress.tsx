import { Loader2, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  progress: number;
  filename: string;
}

export function UploadProgress({ open, onOpenChange, progress, filename }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <ImageIcon className="h-4 w-4 text-primary-glow" />
            Uploading image
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <p className="text-xs text-muted-foreground truncate">{filename}</p>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {progress < 100 ? "Committing to repository..." : "Complete!"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
