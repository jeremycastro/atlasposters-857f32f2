import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { 
  KnowledgeArticle, 
  KnowledgeArticleVersion 
} from "@/hooks/useKnowledgeBase";
import { format } from "date-fns";
import { 
  Calendar, 
  Clock, 
  Edit, 
  Eye, 
  History, 
  Tag,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KnowledgeArticleViewerProps {
  article: KnowledgeArticle | null;
  version?: KnowledgeArticleVersion | null;
  isLoading?: boolean;
  showVersionBadge?: boolean;
  onEdit?: () => void;
  onViewHistory?: () => void;
  className?: string;
}

export function KnowledgeArticleViewer({
  article,
  version,
  isLoading,
  showVersionBadge = true,
  onEdit,
  onViewHistory,
  className,
}: KnowledgeArticleViewerProps) {
  if (isLoading) {
    return <ArticleViewerSkeleton />;
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Eye className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg">Article not found</p>
      </div>
    );
  }

  const displayVersion = version || article.current_version;
  const content = displayVersion?.content_markdown || "";

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {article.category && (
                <Badge variant="outline" className="text-xs">
                  {article.category.display_name}
                </Badge>
              )}
              {!article.is_published && (
                <Badge variant="secondary" className="text-xs">
                  Draft
                </Badge>
              )}
              {showVersionBadge && displayVersion && (
                <Badge variant="outline" className="text-xs bg-primary/5">
                  v{displayVersion.version_number}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{article.title}</h1>
            {article.description && (
              <p className="text-muted-foreground text-lg">{article.description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {onViewHistory && (
              <Button variant="outline" size="sm" onClick={onViewHistory}>
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            )}
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          {displayVersion?.created_at && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Updated {format(new Date(displayVersion.created_at), "MMM d, yyyy")}</span>
            </div>
          )}
          {displayVersion?.author?.full_name && (
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{displayVersion.author.full_name}</span>
            </div>
          )}
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              <span>{article.tags.join(", ")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {content ? (
        <MarkdownRenderer content={content} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border rounded-lg bg-muted/20">
          <Clock className="w-8 h-8 mb-2 opacity-50" />
          <p>No content yet</p>
          {onEdit && (
            <Button variant="link" onClick={onEdit} className="mt-2">
              Add content
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function ArticleViewerSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
