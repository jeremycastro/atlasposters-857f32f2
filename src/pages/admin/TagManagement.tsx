import { useState, useMemo } from "react";
import { useCategories, useTags } from "@/hooks/useTags";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, TrendingUp, Settings, Palette, Briefcase, Award, Calendar, Wrench } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateTagDialog } from "@/components/tags/CreateTagDialog";
import { EditTagDialog } from "@/components/tags/EditTagDialog";
import { DeleteTagDialog } from "@/components/tags/DeleteTagDialog";
import { CreateCategoryDialog } from "@/components/tags/CreateCategoryDialog";
import { EditCategoryDialog } from "@/components/tags/EditCategoryDialog";
import type { Tag, Category } from "@/hooks/useTags";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

const CATEGORY_GROUPS = {
  'Core Artwork': {
    icon: Palette,
    categories: ['artistic_style', 'subject_matter', 'color_palette', 'mood_emotion', 'art_medium']
  },
  'Commercial Application': {
    icon: Briefcase,
    categories: ['room_type', 'commercial_use', 'product_compatibility', 'size_category', 'orientation', 'target_market']
  },
  'Brand & Licensing': {
    icon: Award,
    categories: ['brand_personality', 'target_demographic', 'brand_values', 'industry_focus', 'geographic_style']
  },
  'Seasonal & Occasion': {
    icon: Calendar,
    categories: ['season', 'holiday', 'occasion']
  },
  'Technical & Production': {
    icon: Wrench,
    categories: ['print_quality', 'material', 'finish', 'frame_style']
  }
};

export default function TagManagement() {
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [createTagOpen, setCreateTagOpen] = useState(false);
  const [editTagOpen, setEditTagOpen] = useState(false);
  const [deleteTagOpen, setDeleteTagOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [selectedCategoryData, setSelectedCategoryData] = useState<Category | null>(null);

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  // Auto-select first category when categories load
  if (categories && categories.length > 0 && !selectedCategory) {
    setSelectedCategory(categories[0].category_key);
  }
  
  const { data: tags, isLoading: tagsLoading } = useTags(selectedCategory || "");

  // Global search across all categories
  const globalSearchResults = useMemo(() => {
    if (!globalSearchTerm || !categories) return null;
    
    const results: { category: Category, matchingTags: Tag[] }[] = [];
    
    categories.forEach((category: any) => {
      const categoryTags = category.tag_definitions || [];
      const matches = categoryTags.filter((tag: Tag) => 
        tag.display_name.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
        tag.tag_key.toLowerCase().includes(globalSearchTerm.toLowerCase())
      );
      
      if (matches.length > 0) {
        results.push({ category, matchingTags: matches });
      }
    });
    
    return results;
  }, [globalSearchTerm, categories]);

  const totalGlobalResults = globalSearchResults?.reduce((sum, r) => sum + r.matchingTags.length, 0) || 0;

  // Local search within selected category
  const filteredTags = tags?.filter(tag =>
    tag.display_name.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
    tag.tag_key.toLowerCase().includes(localSearchTerm.toLowerCase())
  );

  const sortedTags = filteredTags?.sort((a, b) => b.usage_count - a.usage_count);

  const currentCategory = categories?.find(c => c.category_key === selectedCategory);

  const totalTags = categories?.reduce((sum, cat: any) => sum + (cat.tag_definitions?.length || 0), 0) || 0;
  const mostUsedTag = tags?.reduce((max, tag) => tag.usage_count > (max?.usage_count || 0) ? tag : max, tags[0]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="p-4">
            <div className="space-y-2">
              <h2 className="font-semibold text-lg">Categories</h2>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search all tags..."
                  value={globalSearchTerm}
                  onChange={(e) => setGlobalSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <ScrollArea className="flex-1">
              {Object.entries(CATEGORY_GROUPS).map(([groupName, group]) => (
                <SidebarGroup key={groupName}>
                  <SidebarGroupLabel>
                    <group.icon className="h-4 w-4 mr-2" />
                    {groupName}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.categories.map(categoryKey => {
                        const category = categories?.find(c => c.category_key === categoryKey);
                        const tagCount = (category as any)?.tag_definitions?.length || 0;
                        
                        if (!category) return null;
                        
                        return (
                          <SidebarMenuItem key={categoryKey}>
                            <SidebarMenuButton
                              isActive={selectedCategory === categoryKey}
                              onClick={() => {
                                setSelectedCategory(categoryKey);
                                setGlobalSearchTerm("");
                                setLocalSearchTerm("");
                              }}
                            >
                              <span className="flex-1">{category.display_name}</span>
                              <Badge variant="secondary" className="ml-2">
                                {tagCount}
                              </Badge>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </ScrollArea>
          </SidebarContent>
          
          <SidebarFooter className="p-4">
            <Button variant="outline" onClick={() => setCreateCategoryOpen(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Tag Management</h1>
                <p className="text-muted-foreground mt-1">
                  Manage categories, tags, and taxonomy structure
                </p>
              </div>
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
                  <div className="text-2xl font-bold">{totalTags}</div>
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
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    Most Used Tag
                    <TrendingUp className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium">{mostUsedTag?.display_name || "N/A"}</div>
                  <div className="text-xs text-muted-foreground">{mostUsedTag?.usage_count || 0} uses</div>
                </CardContent>
              </Card>
            </div>

            {globalSearchTerm ? (
              // Global search results view
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    Search Results for "{globalSearchTerm}"
                  </h2>
                  <Badge variant="secondary">
                    {totalGlobalResults} tag{totalGlobalResults !== 1 ? 's' : ''} found
                  </Badge>
                </div>
                
                {globalSearchResults && globalSearchResults.length > 0 ? (
                  <div className="space-y-4">
                    {globalSearchResults.map(({ category, matchingTags }) => (
                      <Card key={category.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{category.display_name}</CardTitle>
                          <CardDescription>
                            {matchingTags.length} matching tag{matchingTags.length !== 1 ? 's' : ''}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Tag Name</TableHead>
                                <TableHead>Key</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Usage</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {matchingTags.map((tag) => (
                                <TableRow key={tag.id}>
                                  <TableCell className="font-medium">{tag.display_name}</TableCell>
                                  <TableCell className="font-mono text-sm">{tag.tag_key}</TableCell>
                                  <TableCell>
                                    <Badge variant={tag.tag_type === 'system' ? 'secondary' : 'outline'}>
                                      {tag.tag_type}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">{tag.usage_count}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedTag(tag);
                                          setEditTagOpen(true);
                                        }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedTag(tag);
                                          setDeleteTagOpen(true);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      No tags found matching "{globalSearchTerm}"
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              // Selected category view
              currentCategory && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{currentCategory.display_name}</h2>
                      <p className="text-muted-foreground">{currentCategory.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSelectedCategoryData(currentCategory);
                          setEditCategoryOpen(true);
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Category
                      </Button>
                      <Button onClick={() => setCreateTagOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Tag
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tags in this category..."
                      value={localSearchTerm}
                      onChange={(e) => setLocalSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tag Name</TableHead>
                            <TableHead>Key</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Usage</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tagsLoading ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                Loading tags...
                              </TableCell>
                            </TableRow>
                          ) : sortedTags && sortedTags.length > 0 ? (
                            sortedTags.map((tag) => (
                              <TableRow key={tag.id}>
                                <TableCell className="font-medium">{tag.display_name}</TableCell>
                                <TableCell className="font-mono text-sm">{tag.tag_key}</TableCell>
                                <TableCell>
                                  <Badge variant={tag.tag_type === 'system' ? 'secondary' : 'outline'}>
                                    {tag.tag_type}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">{tag.usage_count}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedTag(tag);
                                        setEditTagOpen(true);
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedTag(tag);
                                        setDeleteTagOpen(true);
                                      }}
                                      disabled={tag.usage_count > 0}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                {localSearchTerm ? 'No matching tags found' : 'No tags in this category yet'}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )
            )}
          </div>
        </main>
      </div>

      {/* Dialogs */}
      <CreateTagDialog
        open={createTagOpen}
        onOpenChange={setCreateTagOpen}
        categoryKey={selectedCategory || ""}
        categoryName={currentCategory?.display_name || ""}
      />
      
      <EditTagDialog
        open={editTagOpen}
        onOpenChange={setEditTagOpen}
        tag={selectedTag}
      />
      
      <DeleteTagDialog
        open={deleteTagOpen}
        onOpenChange={setDeleteTagOpen}
        tag={selectedTag}
      />
      
      <CreateCategoryDialog
        open={createCategoryOpen}
        onOpenChange={setCreateCategoryOpen}
      />
      
      <EditCategoryDialog
        open={editCategoryOpen}
        onOpenChange={setEditCategoryOpen}
        category={selectedCategoryData}
      />
    </SidebarProvider>
  );
}
