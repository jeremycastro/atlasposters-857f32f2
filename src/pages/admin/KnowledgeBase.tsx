import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Search, Filter, Calendar, ArrowRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useKnowledgeArticles, useKnowledgeCategories } from "@/hooks/useKnowledgeBase";
import { knowledgeArticles as staticArticles } from "@/types/knowledge";
import { changelogData } from "@/pages/admin/Changelog";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SortField = "title" | "category" | "lastUpdated";
type SortDirection = "asc" | "desc";

// Static article slugs that have custom React components
const staticArticleSlugs = new Set([
  "sku-methodology",
  "partner-management", 
  "brand-assets",
  "task-management",
  "artwork-catalog",
  "admin-brand-guide",
  "brand-story",
  "prodigi-api",
  "product-importing",
  "readymades-framing",
  "mobile-view-methodology",
]);

interface UnifiedArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  lastUpdated: string;
  tags: string[];
  isStatic: boolean;
  isPublished: boolean;
}

const KnowledgeBase = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const { data: dbArticles = [], isLoading: articlesLoading } = useKnowledgeArticles();
  const { data: categories = [], isLoading: categoriesLoading } = useKnowledgeCategories();

  const isLoading = articlesLoading || categoriesLoading;

  // Merge static articles with database articles, preferring static for display
  const allArticles = useMemo((): UnifiedArticle[] => {
    const dbArticleSlugs = new Set(dbArticles.map(a => a.slug));
    
    // Convert static articles to unified format
    const staticUnified: UnifiedArticle[] = staticArticles.map(article => ({
      id: article.id,
      slug: article.id,
      title: article.title,
      description: article.description,
      category: article.category,
      icon: article.icon,
      lastUpdated: article.lastUpdated,
      tags: article.tags,
      isStatic: true,
      isPublished: true,
    }));

    // Add any DB articles that don't have static versions
    const dbOnlyArticles: UnifiedArticle[] = dbArticles
      .filter(a => !staticArticleSlugs.has(a.slug))
      .map(article => ({
        id: article.id,
        slug: article.slug,
        title: article.title,
        description: article.description || "",
        category: article.category?.display_name || "Uncategorized",
        icon: article.icon || "BookOpen",
        lastUpdated: article.updated_at,
        tags: article.tags || [],
        isStatic: false,
        isPublished: article.is_published,
      }));

    return [...staticUnified, ...dbOnlyArticles];
  }, [dbArticles]);

  // Get unique categories
  const categoryOptions = useMemo(() => {
    const cats = Array.from(new Set(allArticles.map(a => a.category)));
    return ["all", ...cats];
  }, [allArticles]);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let filtered = allArticles.filter(article => {
      const matchesSearch = 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = 
        selectedCategory === "all" || article.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort articles
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === "title") {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === "category") {
        comparison = a.category.localeCompare(b.category);
      } else if (sortField === "lastUpdated") {
        comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [allArticles, searchQuery, selectedCategory, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    return sortDirection === "asc" 
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const handleArticleClick = (article: UnifiedArticle) => {
    // Always use the new article route - it handles both static and DB articles
    navigate(`/admin/knowledge/article/${article.slug}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 max-w-[1600px]">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Card className="p-6 mb-6">
            <Skeleton className="h-10 w-full mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-28" />
            </div>
          </Card>
          <Card>
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-[1600px]">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Knowledge Base</h1>
            </div>
            <Button variant="outline" onClick={() => navigate("/admin/knowledge/migrate")}>
              <Filter className="w-4 h-4 mr-2" />
              Content Migration
            </Button>
          </div>
          <p className="text-muted-foreground">
            Comprehensive documentation for Atlas methodologies, workflows, and best practices
          </p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search Row */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles, tags, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryOptions.slice(1).map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className="h-8"
              >
                All Categories
              </Button>
              {categoryOptions.slice(1).map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="h-8"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchQuery}
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="ml-auto"
              >
                Clear all
              </Button>
            </div>
          )}
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredArticles.length} of {allArticles.length} articles
          </p>
        </div>

        {/* Articles Table - Sortable */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Icon</TableHead>
                <TableHead 
                  className="min-w-[200px] cursor-pointer select-none"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center">
                    Title
                    <SortIcon field="title" />
                  </div>
                </TableHead>
                <TableHead 
                  className="hidden md:table-cell cursor-pointer select-none min-w-[200px] whitespace-nowrap"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center">
                    Category
                    <SortIcon field="category" />
                  </div>
                </TableHead>
                <TableHead className="hidden lg:table-cell">Description</TableHead>
                <TableHead 
                  className="w-[120px] cursor-pointer select-none"
                  onClick={() => handleSort("lastUpdated")}
                >
                  <div className="flex items-center">
                    Updated
                    <SortIcon field="lastUpdated" />
                  </div>
                </TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.map(article => {
                const IconComponent = (LucideIcons as any)[article.icon] || LucideIcons.BookOpen;
                
                return (
                  <TableRow 
                    key={article.id}
                    className="cursor-pointer hover:bg-muted/50 h-16"
                    onClick={() => handleArticleClick(article)}
                  >
                    <TableCell className="py-3">
                      <div className="p-2 bg-primary/10 rounded-lg w-fit">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="font-semibold">{article.title}</span>
                      {!article.isPublished && (
                        <Badge variant="outline" className="ml-2 text-xs">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell py-3 whitespace-nowrap">
                      <Badge variant="outline" className="whitespace-nowrap">
                        {article.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell py-3">
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {article.description}
                      </p>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(article.lastUpdated), "yyyy-MM-dd")}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        {/* No Results */}
        {filteredArticles.length === 0 && !isLoading && (
          <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            >
              Clear filters
            </Button>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-12 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Knowledge Base v{changelogData[0].version}</strong> - Documentation continuously updated to reflect current methodologies and best practices
          </p>
        </div>
      </main>
    </div>
  );
};

export default KnowledgeBase;
