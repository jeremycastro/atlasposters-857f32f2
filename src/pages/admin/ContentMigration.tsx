import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { knowledgeArticles } from "@/types/knowledge";
import {
  articleMarkdownContent,
  articleCategoryMap,
  articleIconMap,
} from "@/data/knowledgeMigrationContent";
import { useKnowledgeCategories, useKnowledgeArticles } from "@/hooks/useKnowledgeBase";
import { useCreateArticle } from "@/hooks/useKnowledgeMutations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Database,
  FileText,
  Loader2,
  Play,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

interface MigrationStatus {
  id: string;
  status: "pending" | "migrating" | "success" | "error" | "exists";
  message?: string;
}

export default function ContentMigration() {
  const { data: categories = [] } = useKnowledgeCategories();
  const { data: existingArticles = [], refetch: refetchArticles } = useKnowledgeArticles();
  const createArticle = useCreateArticle();
  
  const [migrationStatuses, setMigrationStatuses] = useState<Record<string, MigrationStatus>>({});
  const [isMigratingAll, setIsMigratingAll] = useState(false);
  const [confirmMigrateAll, setConfirmMigrateAll] = useState(false);

  // Check which articles already exist
  useEffect(() => {
    const checkExisting = () => {
      const statuses: Record<string, MigrationStatus> = {};
      
      knowledgeArticles.forEach(article => {
        const exists = existingArticles.some(ea => ea.slug === article.id);
        statuses[article.id] = {
          id: article.id,
          status: exists ? "exists" : "pending",
          message: exists ? "Already migrated" : "Ready to migrate",
        };
      });
      
      setMigrationStatuses(statuses);
    };
    
    checkExisting();
  }, [existingArticles]);

  const getCategoryId = (articleId: string) => {
    const categoryKey = articleCategoryMap[articleId];
    return categories.find(c => c.category_key === categoryKey)?.id;
  };

  const migrateArticle = async (articleId: string) => {
    const article = knowledgeArticles.find(a => a.id === articleId);
    if (!article) return;

    const content = articleMarkdownContent[articleId];
    if (!content) {
      setMigrationStatuses(prev => ({
        ...prev,
        [articleId]: {
          id: articleId,
          status: "error",
          message: "No markdown content found",
        },
      }));
      return;
    }

    const categoryId = getCategoryId(articleId);
    if (!categoryId) {
      setMigrationStatuses(prev => ({
        ...prev,
        [articleId]: {
          id: articleId,
          status: "error",
          message: "Category not found",
        },
      }));
      return;
    }

    setMigrationStatuses(prev => ({
      ...prev,
      [articleId]: {
        id: articleId,
        status: "migrating",
        message: "Migrating...",
      },
    }));

    try {
      await createArticle.mutateAsync({
        category_id: categoryId,
        slug: articleId,
        title: article.title,
        description: article.description,
        icon: articleIconMap[articleId] || article.icon,
        tags: article.tags,
        is_published: true,
        initial_content: content,
        change_summary: "Initial migration from static content",
      });

      setMigrationStatuses(prev => ({
        ...prev,
        [articleId]: {
          id: articleId,
          status: "success",
          message: "Migration complete",
        },
      }));
    } catch (error) {
      console.error("Migration error:", error);
      setMigrationStatuses(prev => ({
        ...prev,
        [articleId]: {
          id: articleId,
          status: "error",
          message: error instanceof Error ? error.message : "Migration failed",
        },
      }));
    }
  };

  const migrateAll = async () => {
    setIsMigratingAll(true);
    setConfirmMigrateAll(false);
    
    const pendingArticles = knowledgeArticles.filter(
      a => migrationStatuses[a.id]?.status === "pending"
    );

    for (const article of pendingArticles) {
      await migrateArticle(article.id);
      // Small delay between migrations
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsMigratingAll(false);
    refetchArticles();
    toast.success(`Migration complete! ${pendingArticles.length} articles migrated.`);
  };

  const getStatusIcon = (status: MigrationStatus["status"]) => {
    switch (status) {
      case "exists":
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "migrating":
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: MigrationStatus["status"]) => {
    switch (status) {
      case "exists":
        return <Badge variant="outline" className="bg-blue-500/10">Already Migrated</Badge>;
      case "success":
        return <Badge className="bg-green-600">Migrated</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "migrating":
        return <Badge variant="secondary">Migrating...</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const pendingCount = Object.values(migrationStatuses).filter(s => s.status === "pending").length;
  const successCount = Object.values(migrationStatuses).filter(s => s.status === "success" || s.status === "exists").length;
  const errorCount = Object.values(migrationStatuses).filter(s => s.status === "error").length;
  const progress = Math.round((successCount / knowledgeArticles.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <Link to="/admin/knowledge">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Knowledge Base
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Content Migration</h1>
          </div>
          <p className="text-muted-foreground">
            Migrate static knowledge articles to the database-backed versioning system
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Migration Progress</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchArticles()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={() => setConfirmMigrateAll(true)}
                disabled={pendingCount === 0 || isMigratingAll}
              >
                {isMigratingAll ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Migrating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Migrate All ({pendingCount})
                  </>
                )}
              </Button>
            </div>
          </div>

          <Progress value={progress} className="h-2 mb-4" />

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Migrated: {successCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground" />
              <span>Pending: {pendingCount}</span>
            </div>
            {errorCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>Errors: {errorCount}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Articles Table */}
        <Card>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Article</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {knowledgeArticles.map(article => {
                  const status = migrationStatuses[article.id];
                  const hasContent = !!articleMarkdownContent[article.id];
                  
                  return (
                    <TableRow key={article.id}>
                      <TableCell>
                        {getStatusIcon(status?.status || "pending")}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{article.title}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {article.description}
                          </p>
                          {!hasContent && (
                            <p className="text-xs text-amber-500 mt-1">
                              ⚠ No markdown content defined
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{article.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getStatusBadge(status?.status || "pending")}
                          {status?.message && status.status === "error" && (
                            <p className="text-xs text-red-500">{status.message}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {status?.status === "pending" && hasContent && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => migrateArticle(article.id)}
                            disabled={isMigratingAll}
                          >
                            Migrate
                          </Button>
                        )}
                        {status?.status === "exists" && (
                          <Link to={`/admin/knowledge/article/${article.id}`}>
                            <Button size="sm" variant="ghost">
                              View
                            </Button>
                          </Link>
                        )}
                        {status?.status === "success" && (
                          <Link to={`/admin/knowledge/article/${article.id}`}>
                            <Button size="sm" variant="ghost">
                              View
                            </Button>
                          </Link>
                        )}
                        {status?.status === "error" && hasContent && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => migrateArticle(article.id)}
                            disabled={isMigratingAll}
                          >
                            Retry
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>

        {/* Instructions */}
        <Card className="p-6 mt-6">
          <h3 className="font-semibold mb-3">Migration Instructions</h3>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Review the articles above - each has been converted to markdown format</li>
            <li>Click "Migrate" on individual articles or "Migrate All" to batch process</li>
            <li>Migrated articles will be accessible at <code className="bg-muted px-1 rounded">/admin/knowledge/article/[slug]</code></li>
            <li>After migration, articles support full versioning with history and restore</li>
            <li>The original static routes will continue to work until removed</li>
          </ol>
        </Card>

        {/* Confirm Dialog */}
        <AlertDialog open={confirmMigrateAll} onOpenChange={setConfirmMigrateAll}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Migrate All Articles?</AlertDialogTitle>
              <AlertDialogDescription>
                This will migrate {pendingCount} articles to the database. Each article will be created with version 1 containing the converted markdown content.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={migrateAll}>
                Migrate {pendingCount} Articles
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
