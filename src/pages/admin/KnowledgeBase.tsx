import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Filter, Calendar, ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { knowledgeArticles, KnowledgeCategory } from "@/types/knowledge";
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

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(knowledgeArticles.map(a => a.category)));
    return ["all", ...cats];
  }, []);

  // Filter articles based on search and category
  const filteredArticles = useMemo(() => {
    return knowledgeArticles.filter(article => {
      const matchesSearch = 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = 
        selectedCategory === "all" || article.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Group articles by category
  const groupedArticles = useMemo(() => {
    const grouped: Record<KnowledgeCategory, typeof knowledgeArticles> = {} as any;
    
    filteredArticles.forEach(article => {
      if (!grouped[article.category]) {
        grouped[article.category] = [];
      }
      grouped[article.category].push(article);
    });
    
    return grouped;
  }, [filteredArticles]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Knowledge Base</h1>
          </div>
          <p className="text-muted-foreground">
            Comprehensive documentation for Atlas methodologies, workflows, and best practices
          </p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="p-6 mb-8">
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
                {categories.slice(1).map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            Showing {filteredArticles.length} of {knowledgeArticles.length} articles
          </p>
        </div>

        {/* Articles Table - Grouped by Category */}
        {Object.entries(groupedArticles).map(([category, articles]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">{category}</h2>
            
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Icon</TableHead>
                    <TableHead className="min-w-[200px]">Title</TableHead>
                    <TableHead className="hidden lg:table-cell">Description</TableHead>
                    <TableHead className="hidden md:table-cell w-[200px]">Tags</TableHead>
                    <TableHead className="w-[120px]">Updated</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map(article => {
                    const IconComponent = (LucideIcons as any)[article.icon] || LucideIcons.BookOpen;
                    
                    return (
                      <TableRow 
                        key={article.id}
                        className="cursor-pointer hover:bg-muted/50 h-16"
                        onClick={() => window.location.href = article.route}
                      >
                        <TableCell className="py-3">
                          <div className="p-2 bg-primary/10 rounded-lg w-fit">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <span className="font-semibold">{article.title}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell py-3">
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {article.description}
                          </p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell py-3">
                          <div className="flex flex-wrap gap-1">
                            {article.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                                {tag}
                              </Badge>
                            ))}
                            {article.tags.length > 2 && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                +{article.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                            <Calendar className="h-3 w-3 mr-1" />
                            {article.lastUpdated}
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
          </div>
        ))}

        {/* No Results */}
        {filteredArticles.length === 0 && (
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
            <strong>Knowledge Base v0.4.0</strong> - Documentation continuously updated to reflect current methodologies and best practices
          </p>
        </div>
      </main>
    </div>
  );
};

export default KnowledgeBase;
