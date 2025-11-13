import { useState, useMemo } from "react";
import { useCategories, useTags, useAllTags } from "@/hooks/useTags";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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
  
  const { data: categories } = useCategories();
  const { data: allTags } = useAllTags();
  const { data: tags } = useTags(selectedCategory || "");

  // Auto-select first category
  if (categories && categories.length > 0 && !selectedCategory) {
    setSelectedCategory(categories[0].category_key);
  }

  // Global search - flat results
  const globalSearchResults = useMemo(() => {
    if (!globalSearchTerm || !allTags) return null;
    const searchLower = globalSearchTerm.toLowerCase();
    return allTags.filter((tag: any) => 
      (tag.display_name?.toLowerCase() || '').includes(searchLower) || 
      (tag.tag_key?.toLowerCase() || '').includes(searchLower)
    );
  }, [globalSearchTerm, allTags]);
  
  const totalGlobalResults = globalSearchResults?.length || 0;

  // Local search
  const filteredTags = useMemo(() => {
    if (!tags) return [];
    if (!localSearchTerm) return tags;
    const searchLower = localSearchTerm.toLowerCase();
    return tags.filter(tag => 
      (tag.display_name?.toLowerCase() || '').includes(searchLower) || 
      (tag.tag_key?.toLowerCase() || '').includes(searchLower)
    );
  }, [tags, localSearchTerm]);

  const sortedTags = useMemo(() => {
    return [...filteredTags].sort((a, b) => 
      (a.display_name || '').localeCompare(b.display_name || '')
    );
  }, [filteredTags]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    return Object.keys(CATEGORY_GROUPS).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
  });

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const totalCategories = categories?.length || 0;
  const totalTags = tags?.length || 0;
  const activeTags = tags?.length || 0;
  const mostUsedTag = tags?.reduce((prev, current) => 
    (current.usage_count > (prev?.usage_count || 0)) ? current : prev, tags[0]);

  const selectedCategoryData2 = categories?.find(c => c.category_key === selectedCategory);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tag Management</h1>
          <p className="text-muted-foreground mt-1">Manage your taxonomy categories and tags</p>
        </div>
        <Button onClick={() => setCreateCategoryOpen(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Manage Categories
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
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
            <div className="text-2xl font-bold">{activeTags}</div>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 h-[calc(100vh-20rem)] flex flex-col border rounded-lg bg-card">
          <div className="p-3 border-b">
            <h2 className="font-semibold text-lg mb-2">Categories</h2>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search all tags..." value={globalSearchTerm} onChange={(e) => setGlobalSearchTerm(e.target.value)} className="pl-8" />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-1 space-y-0.5">
              {Object.entries(CATEGORY_GROUPS).map(([groupName, group]) => (
                <Collapsible key={groupName} open={openGroups[groupName]} onOpenChange={() => toggleGroup(groupName)}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between text-sm font-bold text-primary hover:text-primary hover:bg-primary/10 py-2">
                      <div className="flex items-center gap-2">
                        <group.icon className="h-4 w-4" />
                        <span className="uppercase tracking-wide">{groupName}</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${openGroups[groupName] ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-0 mt-0">
                    {group.categories.map((categoryKey) => {
                      const category = categories?.find(c => c.category_key === categoryKey);
                      if (!category) return null;
                      return (
                        <Button key={categoryKey} variant={selectedCategory === categoryKey ? "secondary" : "ghost"} className="w-full justify-start text-sm pl-8 py-1.5 h-auto" onClick={() => { setSelectedCategory(categoryKey); setGlobalSearchTerm(""); setLocalSearchTerm(""); }}>
                          <span className="truncate">{category.display_name}</span>
                        </Button>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-2 border-t">
            <Button variant="outline" onClick={() => setCreateCategoryOpen(true)} className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </Button>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          {globalSearchTerm ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Search Results for "{globalSearchTerm}"</h2>
                <Badge variant="secondary">{totalGlobalResults} tag{totalGlobalResults !== 1 ? 's' : ''} found</Badge>
              </div>
              
              {globalSearchResults && globalSearchResults.length > 0 ? (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[25%]">Tag Name</TableHead>
                            <TableHead className="w-[23%]">Category</TableHead>
                            <TableHead className="w-[25%]">Key</TableHead>
                            <TableHead className="w-[10%] text-right">Usage</TableHead>
                            <TableHead className="w-[17%] text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {globalSearchResults.map((tag: any) => (
                            <TableRow key={tag.id} className="cursor-pointer hover:bg-muted/50 h-10" onClick={() => { setSelectedTag(tag); setEditTagOpen(true); }}>
                              <TableCell className="font-medium py-1.5">{tag.display_name}</TableCell>
                              <TableCell className="py-1.5">
                                <Badge variant="outline" className="text-xs">{tag.category?.display_name || 'Unknown'}</Badge>
                              </TableCell>
                              <TableCell className="font-mono text-sm py-1.5">{tag.tag_key}</TableCell>
                              <TableCell className="text-right py-1.5">{tag.usage_count}</TableCell>
                              <TableCell className="text-right py-1.5">
                                <div className="flex items-center justify-end gap-1">
                                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedTag(tag); setEditTagOpen(true); }}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedTag(tag); setDeleteTagOpen(true); }}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No tags found matching "{globalSearchTerm}"
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            selectedCategory && selectedCategoryData2 && (
              <div className="space-y-4 w-full">
                  <Card>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-2xl">{selectedCategoryData2.display_name}</CardTitle>
                          <Badge variant="secondary" className="text-sm">
                            {sortedTags.length} tag{sortedTags.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => {
                            setSelectedCategoryData(selectedCategoryData2);
                            setEditCategoryOpen(true);
                          }}>
                            <Settings className="h-4 w-4 mr-2" />
                            Edit Category
                          </Button>
                          <Button size="sm" onClick={() => setCreateTagOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Tag
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle>Tags</CardTitle>
                        <div className="relative w-64">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search tags..." value={localSearchTerm} onChange={e => setLocalSearchTerm(e.target.value)} className="pl-8" />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-0">
                      {sortedTags.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[25%]">Tag Name</TableHead>
                                <TableHead className="w-[23%]">Category</TableHead>
                                <TableHead className="w-[25%]">Key</TableHead>
                                <TableHead className="w-[10%] text-right">Usage</TableHead>
                                <TableHead className="w-[17%] text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sortedTags.map(tag => (
                                <TableRow key={tag.id} className="cursor-pointer hover:bg-muted/50 h-10" onClick={() => {
                                  setSelectedTag(tag);
                                  setEditTagOpen(true);
                                }}>
                                  <TableCell className="font-medium py-1.5">{tag.display_name}</TableCell>
                                  <TableCell className="py-1.5">
                                    <Badge variant="outline" className="text-xs">{selectedCategoryData2?.display_name}</Badge>
                                  </TableCell>
                                  <TableCell className="font-mono text-sm py-1.5">{tag.tag_key}</TableCell>
                                  <TableCell className="text-right py-1.5">{tag.usage_count}</TableCell>
                                  <TableCell className="text-right py-1.5">
                                    <div className="flex items-center justify-end gap-1">
                                      <Button variant="ghost" size="sm" onClick={e => {
                                        e.stopPropagation();
                                        setSelectedTag(tag);
                                        setEditTagOpen(true);
                                      }}>
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm" onClick={e => {
                                        e.stopPropagation();
                                        setSelectedTag(tag);
                                        setDeleteTagOpen(true);
                                      }}>
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="py-8 text-center text-muted-foreground">
                          {localSearchTerm ? `No tags found matching "${localSearchTerm}"` : 'No tags in this category yet'}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
            )
          )}
        </div>
      </div>

      <CreateTagDialog
        open={createTagOpen} 
        onOpenChange={setCreateTagOpen} 
        categoryKey={selectedCategoryData2?.category_key || ''} 
        categoryName={selectedCategoryData2?.display_name || ''} 
      />
      <EditTagDialog open={editTagOpen} onOpenChange={setEditTagOpen} tag={selectedTag} />
      <DeleteTagDialog open={deleteTagOpen} onOpenChange={setDeleteTagOpen} tag={selectedTag} />
      <CreateCategoryDialog open={createCategoryOpen} onOpenChange={setCreateCategoryOpen} />
      <EditCategoryDialog open={editCategoryOpen} onOpenChange={setEditCategoryOpen} category={selectedCategoryData} />
    </div>
  );
}
