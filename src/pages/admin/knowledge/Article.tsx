import { useState, lazy, Suspense } from "react";
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
  StaticArticleVersionDropdown,
  ArchivedVersionBanner,
} from "@/components/knowledge";
import {
  useKnowledgeArticle,
  useArticleVersions,
  KnowledgeArticleVersion,
} from "@/hooks/useKnowledgeBase";
import { useRestoreVersion } from "@/hooks/useKnowledgeMutations";
import { 
  parseVersionedSlug, 
  useStaticArticleVersion,
  useCurrentStaticVersion 
} from "@/hooks/useStaticArticleVersions";
import { getArchivedComponent } from "./archive";
import { ArrowLeft, History, PanelRightOpen } from "lucide-react";
import { toast } from "sonner";

// Map of slugs to their custom React components (beautifully formatted)
const staticArticleComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  "sku-methodology": lazy(() => import("../SKUMethodology")),
  "partner-management": lazy(() => import("./PartnerManagement")),
  "brand-assets": lazy(() => import("./BrandAssets")),
  "task-management": lazy(() => import("./TaskManagement")),
  "artwork-catalog": lazy(() => import("./ArtworkCatalog")),
  "admin-brand-guide": lazy(() => import("./AdminBrandGuide")),
  "brand-story": lazy(() => import("./BrandStory")),
  "prodigi-api": lazy(() => import("./ProdigiAPI")),
  "product-importing": lazy(() => import("./ProductImporting")),
  "readymades-framing": lazy(() => import("./ReadymadesFraming")),
};

function ArticleLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-6 w-96 mb-8" />
        <Skeleton className="h-64 w-full mb-4" />
        <Skeleton className="h-48 w-full" />
      </main>
    </div>
  );
}

// Wrapper component for static articles that adds version dropdown
function StaticArticleWrapper({
  children,
  slug,
  currentVersion,
}: {
  children: React.ReactNode;
  slug: string;
  currentVersion: number | null;
}) {
  const { data: versionData } = useStaticArticleVersion(
    slug,
    currentVersion || undefined
  );

  return (
    <div className="relative">
      {/* Version dropdown positioned at top */}
      <div className="absolute top-4 right-4 z-10">
        <StaticArticleVersionDropdown slug={slug} currentVersion={currentVersion} />
      </div>
      
      {/* Archived version banner if viewing old version */}
      {currentVersion !== null && versionData && !versionData.is_current && (
        <div className="container mx-auto px-4 pt-4 max-w-5xl">
          <ArchivedVersionBanner
            slug={slug}
            versionNumber={versionData.version_number}
            archivedAt={versionData.archived_at}
            changeSummary={versionData.change_summary}
          />
        </div>
      )}
      
      {children}
    </div>
  );
}

export default function KnowledgeArticlePage() {
  const { slug: rawSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Parse versioned slug (e.g., "product-importing-v1" -> { baseSlug: "product-importing", version: 1 })
  const { baseSlug, version: requestedVersion } = rawSlug 
    ? parseVersionedSlug(rawSlug) 
    : { baseSlug: "", version: null };

  // Check if this article has a custom React component
  const StaticComponent = baseSlug ? staticArticleComponents[baseSlug] : null;
  
  // For archived versions, check if we have the component
  const ArchivedComponent = requestedVersion !== null && baseSlug
    ? getArchivedComponent(baseSlug, requestedVersion)
    : null;

  // Get current version number for comparison
  const { data: currentVersionNumber } = useCurrentStaticVersion(baseSlug);

  // Data fetching (only needed for markdown articles)
  const { data: article, isLoading: articleLoading } = useKnowledgeArticle(
    StaticComponent ? undefined : baseSlug
  );
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

  // If requesting a specific archived version that exists
  if (ArchivedComponent && requestedVersion !== null) {
    return (
      <StaticArticleWrapper slug={baseSlug} currentVersion={requestedVersion}>
        <Suspense fallback={<ArticleLoadingSkeleton />}>
          <ArchivedComponent />
        </Suspense>
      </StaticArticleWrapper>
    );
  }

  // If requesting an archived version that doesn't exist yet (no archive file created)
  if (requestedVersion !== null && StaticComponent && !ArchivedComponent) {
    // Check if this version is actually the current version
    if (requestedVersion === currentVersionNumber) {
      // Redirect to the canonical URL without version suffix
      return (
        <StaticArticleWrapper slug={baseSlug} currentVersion={null}>
          <Suspense fallback={<ArticleLoadingSkeleton />}>
            <StaticComponent />
          </Suspense>
        </StaticArticleWrapper>
      );
    }
    
    // Version requested but not available
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-2xl font-bold mb-2">Archived Version Not Found</h2>
          <p className="text-muted-foreground mb-4">
            Version {requestedVersion} of "{baseSlug}" hasn't been archived yet, or doesn't exist.
          </p>
          <Button onClick={() => navigate(`/admin/knowledge/article/${baseSlug}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            View Current Version
          </Button>
        </div>
      </div>
    );
  }

  // If there's a static component for this slug, render it with beautiful formatting
  if (StaticComponent) {
    return (
      <StaticArticleWrapper slug={baseSlug} currentVersion={null}>
        <Suspense fallback={<ArticleLoadingSkeleton />}>
          <StaticComponent />
        </Suspense>
      </StaticArticleWrapper>
    );
  }

  // Fall back to database-driven markdown content
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

  const currentMdVersionNumber = article.current_version?.version_number || 0;

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
        currentVersionNumber={currentMdVersionNumber}
        onConfirm={handleConfirmRestore}
        isRestoring={restoreMutation.isPending}
      />
    </div>
  );
}