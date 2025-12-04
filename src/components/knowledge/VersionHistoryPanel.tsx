import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { KnowledgeArticleVersion } from "@/hooks/useKnowledgeBase";
import { format, formatDistanceToNow } from "date-fns";
import { 
  ChevronRight, 
  Clock, 
  Eye, 
  History, 
  RotateCcw, 
  User 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VersionHistoryPanelProps {
  versions: KnowledgeArticleVersion[];
  currentVersionId?: string | null;
  isLoading?: boolean;
  onPreviewVersion: (version: KnowledgeArticleVersion) => void;
  onRestoreVersion: (version: KnowledgeArticleVersion) => void;
  className?: string;
}

export function VersionHistoryPanel({
  versions,
  currentVersionId,
  isLoading,
  onPreviewVersion,
  onRestoreVersion,
  className,
}: VersionHistoryPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (isLoading) {
    return <VersionHistorySkeleton />;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between px-3 py-2 h-auto"
        >
          <div className="flex items-center gap-2">
            <History className="w-4 h-4" />
            <span className="font-medium">Version History</span>
            <Badge variant="secondary" className="text-xs">
              {versions.length}
            </Badge>
          </div>
          <ChevronRight 
            className={cn(
              "w-4 h-4 transition-transform",
              isOpen && "rotate-90"
            )} 
          />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <ScrollArea className="h-[400px] mt-2">
          <div className="space-y-1 pr-4">
            {versions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No version history</p>
              </div>
            ) : (
              versions.map((version, index) => (
                <VersionItem
                  key={version.id}
                  version={version}
                  isCurrent={version.id === currentVersionId}
                  isLatest={index === 0}
                  onPreview={() => onPreviewVersion(version)}
                  onRestore={() => onRestoreVersion(version)}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface VersionItemProps {
  version: KnowledgeArticleVersion;
  isCurrent: boolean;
  isLatest: boolean;
  onPreview: () => void;
  onRestore: () => void;
}

function VersionItem({ 
  version, 
  isCurrent, 
  isLatest,
  onPreview, 
  onRestore 
}: VersionItemProps) {
  return (
    <div 
      className={cn(
        "p-3 rounded-lg border transition-colors",
        isCurrent 
          ? "bg-primary/5 border-primary/20" 
          : "bg-card hover:bg-muted/50"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">
              Version {version.version_number}
            </span>
            {isCurrent && (
              <Badge variant="default" className="text-xs">
                Current
              </Badge>
            )}
            {isLatest && !isCurrent && (
              <Badge variant="outline" className="text-xs">
                Latest
              </Badge>
            )}
          </div>
          
          {version.change_summary && (
            <p className="text-sm text-muted-foreground truncate">
              {version.change_summary}
            </p>
          )}
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
            </span>
            {version.author?.full_name && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {version.author.full_name}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onPreview}
            title="Preview this version"
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>
          {!isCurrent && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onRestore}
              title="Restore this version"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function VersionHistorySkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-3 py-2">
        <Skeleton className="w-4 h-4" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-5 w-8" />
      </div>
      <div className="space-y-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-3 rounded-lg border">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
