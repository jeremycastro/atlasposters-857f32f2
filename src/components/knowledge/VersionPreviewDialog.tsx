import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { KnowledgeArticleVersion } from "@/hooks/useKnowledgeBase";
import { format } from "date-fns";
import { Calendar, RotateCcw, User, X } from "lucide-react";

interface VersionPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  version: KnowledgeArticleVersion | null;
  articleTitle?: string;
  isCurrentVersion?: boolean;
  onRestore?: () => void;
}

export function VersionPreviewDialog({
  open,
  onOpenChange,
  version,
  articleTitle,
  isCurrentVersion,
  onRestore,
}: VersionPreviewDialogProps) {
  if (!version) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Version {version.version_number}</Badge>
                {isCurrentVersion && (
                  <Badge variant="default">Current</Badge>
                )}
              </div>
              <DialogTitle className="text-xl">
                {articleTitle || "Article Preview"}
              </DialogTitle>
              {version.change_summary && (
                <p className="text-sm text-muted-foreground">
                  {version.change_summary}
                </p>
              )}
            </div>
          </div>
          
          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(version.created_at), "MMM d, yyyy 'at' h:mm a")}</span>
            </div>
            {version.author?.full_name && (
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{version.author.full_name}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="py-4">
            <MarkdownRenderer content={version.content_markdown} />
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
          {!isCurrentVersion && onRestore && (
            <Button onClick={onRestore}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restore This Version
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
