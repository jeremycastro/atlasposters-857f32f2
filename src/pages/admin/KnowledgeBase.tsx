import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Filter, Calendar } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { knowledgeArticles, KnowledgeCategory } from "@/types/knowledge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

        {/* Articles Grid - Grouped by Category */}
        {Object.entries(groupedArticles).map(([category, articles]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">{category}</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => {
                const IconComponent = (LucideIcons as any)[article.icon] || LucideIcons.BookOpen;
                
                return (
                  <Link key={article.id} to={article.route}>
                    <Card className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{article.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {article.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground pt-4 border-t">
                        <Calendar className="h-3 w-3 mr-1" />
                        Updated {article.lastUpdated}
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
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
