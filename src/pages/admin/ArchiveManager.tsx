import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Archive, 
  ExternalLink, 
  History, 
  FileText,
  Clock,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAllStaticArticles, useStaticArticleVersions } from "@/hooks/useStaticArticleVersions";
import { format } from "date-fns";

function ArticleVersionHistory({ slug }: { slug: string }) {
  const { data: versions = [], isLoading } = useStaticArticleVersions(slug);
  const navigate = useNavigate();

  if (isLoading) {
    return <Skeleton className="h-20 w-full" />;
  }

  return (
    <div className="pl-8 pb-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Version</TableHead>
            <TableHead>Change Summary</TableHead>
            <TableHead className="w-40">Archived</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {versions.map((version) => (
            <TableRow key={version.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-mono">v{version.version_number}</span>
                  {version.is_current && (
                    <Badge variant="default" className="text-xs">Current</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {version.change_summary || "Initial version"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(version.archived_at), "MMM d, yyyy h:mm a")}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (version.is_current) {
                      navigate(`/admin/knowledge/article/${slug}`);
                    } else {
                      navigate(`/admin/knowledge/article/${slug}-v${version.version_number}`);
                    }
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function ArchiveManager() {
  const { data: articles = [], isLoading } = useAllStaticArticles();
  const [expandedSlugs, setExpandedSlugs] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const toggleExpanded = (slug: string) => {
    setExpandedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const formatSlugToTitle = (slug: string) => {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Archive className="h-8 w-8 text-primary" />
            Static Article Archive Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage archived versions of beautifully formatted static articles
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Static Articles
          </CardTitle>
          <CardDescription>
            These articles use custom React components for beautiful formatting. 
            When refreshed, previous versions are archived and accessible via version URLs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {articles.map((article) => (
                <Collapsible
                  key={article.slug}
                  open={expandedSlugs.has(article.slug)}
                  onOpenChange={() => toggleExpanded(article.slug)}
                >
                  <div className="border rounded-lg">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <ChevronRight
                            className={`h-5 w-5 text-muted-foreground transition-transform ${
                              expandedSlugs.has(article.slug) ? "rotate-90" : ""
                            }`}
                          />
                          <div>
                            <h3 className="font-medium">
                              {formatSlugToTitle(article.slug)}
                            </h3>
                            <p className="text-sm text-muted-foreground font-mono">
                              /admin/knowledge/article/{article.slug}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="gap-1">
                            <History className="h-3 w-3" />
                            v{article.version_number}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {format(new Date(article.archived_at), "MMM d, yyyy")}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/knowledge/article/${article.slug}`);
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ArticleVersionHistory slug={article.slug} />
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How Archiving Works</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          <ol className="space-y-2">
            <li>
              <strong>Request a refresh:</strong> Tell the AI "Refresh the [Article Name] article - [what changed]"
            </li>
            <li>
              <strong>AI archives current:</strong> The current version is copied to the archive folder with a version suffix
            </li>
            <li>
              <strong>Database updated:</strong> A new version record is created tracking the change
            </li>
            <li>
              <strong>Article updated:</strong> The main article file is updated with your requested changes
            </li>
            <li>
              <strong>Access archived versions:</strong> Use the version dropdown on any article, or visit URLs like <code>/admin/knowledge/article/product-importing-v1</code>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
