import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  KnowledgeArticleViewer,
  VersionHistoryPanel,
  VersionPreviewDialog,
  RestoreVersionDialog,
} from "@/components/knowledge";
import {
  useKnowledgeArticle,
  useArticleVersions,
  KnowledgeArticleVersion,
} from "@/hooks/useKnowledgeBase";
import { useRestoreVersion } from "@/hooks/useKnowledgeMutations";
import { ArrowLeft, History, PanelRightOpen } from "lucide-react";
import { toast } from "sonner";

export default function KnowledgeArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Data fetching
  const { data: article, isLoading: articleLoading } = useKnowledgeArticle(slug);
  const { data: versions = [], isLoading: versionsLoading } = useArticleVersions(article?.id);

  // State for dialogs
  const [previewVersion, setPreviewVersion] = useState<KnowledgeArticleVersion | null>(null);
  const [restoreVersion, setRestoreVersion] = useState<KnowledgeArticleVersion | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Mutations
  const restoreMutation = useRestoreVersion();

  const handlePreviewVersion = (version: KnowledgeArticleVersion) => {
    setPreviewVersion(version);
  };

  const handleRestoreVersion = (version: KnowledgeArticleVersion) => {
    setRestoreVersion(version);
  };

  const handleConfirmRestore = () => {
    if (!restoreVersion) return;

    restoreMutation.mutate(restoreVersion.id, {
      onSuccess: () => {
        setRestoreVersion(null);
        toast.success(`Restored to version ${restoreVersion.version_number}`);
      },
    });
  };

  const handleEdit = () => {
    // TODO: Navigate to editor when implemented
    toast.info("Editor coming in Phase 5");
  };

  if (articleLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <div className="space-y-4 mt-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-2xl font-bold mb-2">Article Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/admin/knowledge")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Knowledge Base
          </Button>
        </div>
      </div>
    );
  }

  const currentVersionNumber = article.current_version?.version_number || 0;

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-4xl">
          {/* Back button */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/knowledge")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Knowledge Base
            </Button>

            {/* Mobile history trigger */}
            <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Version History</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <VersionHistoryPanel
                    versions={versions}
                    currentVersionId={article.current_version_id}
                    isLoading={versionsLoading}
                    onPreviewVersion={handlePreviewVersion}
                    onRestoreVersion={handleRestoreVersion}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Article viewer */}
          <KnowledgeArticleViewer
            article={article}
            showVersionBadge={true}
            onEdit={handleEdit}
            onViewHistory={() => setHistoryOpen(true)}
          />
        </div>
      </div>

      {/* Desktop sidebar for version history */}
      <div className="hidden lg:block w-80 border-l bg-muted/30 overflow-auto">
        <div className="p-4 sticky top-0 bg-muted/30 border-b">
          <div className="flex items-center gap-2 text-sm font-medium">
            <PanelRightOpen className="w-4 h-4" />
            Version History
          </div>
        </div>
        <div className="p-4">
          <VersionHistoryPanel
            versions={versions}
            currentVersionId={article.current_version_id}
            isLoading={versionsLoading}
            onPreviewVersion={handlePreviewVersion}
            onRestoreVersion={handleRestoreVersion}
          />
        </div>
      </div>

      {/* Preview dialog */}
      <VersionPreviewDialog
        open={!!previewVersion}
        onOpenChange={(open) => !open && setPreviewVersion(null)}
        version={previewVersion}
        articleTitle={article.title}
        isCurrentVersion={previewVersion?.id === article.current_version_id}
        onRestore={() => {
          if (previewVersion) {
            setPreviewVersion(null);
            handleRestoreVersion(previewVersion);
          }
        }}
      />

      {/* Restore confirmation dialog */}
      <RestoreVersionDialog
        open={!!restoreVersion}
        onOpenChange={(open) => !open && setRestoreVersion(null)}
        version={restoreVersion}
        articleTitle={article.title}
        currentVersionNumber={currentVersionNumber}
        onConfirm={handleConfirmRestore}
        isRestoring={restoreMutation.isPending}
      />
    </div>
  );
}
