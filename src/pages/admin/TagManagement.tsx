import { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { useCategories, useTags } from "@/hooks/useTags";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, TrendingUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TagManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: tags, isLoading: tagsLoading } = useTags(selectedCategory || "");

  const filteredTags = tags?.filter(tag =>
    tag.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.tag_key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTags = filteredTags?.sort((a, b) => b.usage_count - a.usage_count);

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tag Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage categories, tags, and taxonomy structure
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {categories?.reduce((sum, cat: any) => sum + (cat.tag_definitions?.length || 0), 0) || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Active Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tags?.filter(t => t.usage_count > 0).length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Most Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">
                  {sortedTags?.[0]?.display_name || "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedCategory || ""} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5">
            {categories?.slice(0, 5).map((category) => (
              <TabsTrigger key={category.id} value={category.category_key}>
                {category.display_name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categoriesLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading categories...</div>
          ) : (
            categories?.map((category) => (
              <TabsContent key={category.id} value={category.category_key} className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{category.display_name}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Tag
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search tags..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>

                    <ScrollArea className="h-[400px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tag Name</TableHead>
                            <TableHead>Key</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Usage</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tagsLoading ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center text-muted-foreground">
                                Loading tags...
                              </TableCell>
                            </TableRow>
                          ) : sortedTags && sortedTags.length > 0 ? (
                            sortedTags.map((tag) => (
                              <TableRow key={tag.id}>
                                <TableCell className="font-medium">{tag.display_name}</TableCell>
                                <TableCell className="font-mono text-xs text-muted-foreground">
                                  {tag.tag_key}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={tag.tag_type === 'system' ? 'default' : 'secondary'}>
                                    {tag.tag_type}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{tag.usage_count}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-1">
                                    <Button size="sm" variant="ghost">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center text-muted-foreground">
                                No tags found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            ))
          )}
        </Tabs>
      </div>
  );
}
