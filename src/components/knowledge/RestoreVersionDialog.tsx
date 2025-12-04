import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { KnowledgeArticleVersion } from "@/hooks/useKnowledgeBase";
import { format } from "date-fns";
import { AlertTriangle, Calendar, RotateCcw, User } from "lucide-react";

interface RestoreVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  version: KnowledgeArticleVersion | null;
  articleTitle?: string;
  currentVersionNumber?: number;
  onConfirm: () => void;
  isRestoring?: boolean;
}

export function RestoreVersionDialog({
  open,
  onOpenChange,
  version,
  articleTitle,
  currentVersionNumber,
  onConfirm,
  isRestoring,
}: RestoreVersionDialogProps) {
  if (!version) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <AlertDialogHeader className="flex-shrink-0">
          <AlertDialogTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-primary" />
            Restore Version {version.version_number}?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                You are about to restore <strong>{articleTitle}</strong> to version {version.version_number}.
              </p>
              
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">This will create a new version</p>
                  <p className="text-amber-600 dark:text-amber-500">
                    The current content (v{currentVersionNumber}) will be preserved in the history. 
                    A new version (v{(currentVersionNumber || 0) + 1}) will be created with the content from v{version.version_number}.
                  </p>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Version info */}
        <div className="space-y-3 py-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Restoring Version {version.version_number}</Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Created {format(new Date(version.created_at), "MMM d, yyyy")}</span>
            </div>
            {version.author?.full_name && (
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{version.author.full_name}</span>
              </div>
            )}
          </div>
          
          {version.change_summary && (
            <p className="text-sm text-muted-foreground italic">
              "{version.change_summary}"
            </p>
          )}
        </div>

        {/* Content preview */}
        <div className="border rounded-lg overflow-hidden flex-1 min-h-0">
          <div className="px-3 py-2 bg-muted border-b text-sm font-medium">
            Content Preview
          </div>
          <ScrollArea className="h-[200px]">
            <div className="p-4">
              <MarkdownRenderer 
                content={version.content_markdown} 
                className="prose-sm"
              />
            </div>
          </ScrollArea>
        </div>

        <AlertDialogFooter className="flex-shrink-0 pt-4">
          <AlertDialogCancel disabled={isRestoring}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isRestoring}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {isRestoring ? "Restoring..." : "Restore Version"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
