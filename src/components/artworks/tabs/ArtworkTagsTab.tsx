import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEntityTags, useCategories, useTags, useAllTags, useTagEntity, useRemoveTag } from "@/hooks/useTags";
import { TagPill } from "@/components/tags/TagPill";
import { Search, Plus, Check, Palette, Briefcase, Award, Calendar, Wrench, ChevronDown, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CreateTagDialog } from "@/components/tags/CreateTagDialog";
import { AITagSuggestions } from "@/components/tags/AITagSuggestions";

interface ArtworkTagsTabProps {
  artworkId: string;
}

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

export function ArtworkTagsTab({ artworkId }: ArtworkTagsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const [createTagOpen, setCreateTagOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Core Artwork': true,
    'Commercial Application': false,
    'Brand & Licensing': false,
    'Seasonal & Occasion': false,
    'Technical & Production': false
  });
  const [currentTagsOpen, setCurrentTagsOpen] = useState(true);

  // Fetch artwork tags
  const {
    data: artworkTags,
    refetch: refetchArtworkTags
  } = useEntityTags('artwork', artworkId);
  
  const { data: categories } = useCategories();
  const { data: availableTags } = useTags(selectedCategory || "");
  const { data: allTags } = useAllTags();
  const tagEntity = useTagEntity();
  const removeTag = useRemoveTag();

  // Auto-select first category
  if (categories && categories.length > 0 && !selectedCategory) {
    setSelectedCategory(categories[0].category_key);
  }

  // Group current tags by category
  const tagsByCategory = artworkTags?.reduce((acc, tag) => {
    if (!acc[tag.category_name]) {
      acc[tag.category_name] = [];
    }
    acc[tag.category_name].push(tag);
    return acc;
  }, {} as Record<string, typeof artworkTags>);

  // Get currently applied tag IDs
  const appliedTagIds = new Set(artworkTags?.map(t => t.tag_id) || []);

  // Filter available tags by local search term (within category)
  const filteredAvailableTags = useMemo(() => {
    if (!availableTags) return [];
    if (!localSearchTerm) return availableTags;
    const searchLower = localSearchTerm.toLowerCase();
    return availableTags.filter(tag => 
      tag.display_name.toLowerCase().includes(searchLower) || 
      tag.tag_key.toLowerCase().includes(searchLower)
    );
  }, [availableTags, localSearchTerm]);

  // Global search results (across all tags)
  const globalSearchResults = useMemo(() => {
    if (!allTags || !globalSearchTerm) return [];
    const searchLower = globalSearchTerm.toLowerCase();
    return allTags.filter(tag => 
      tag.display_name.toLowerCase().includes(searchLower) || 
      tag.tag_key.toLowerCase().includes(searchLower)
    );
  }, [allTags, globalSearchTerm]);

  const handleAddTag = async (tagId: string) => {
    try {
      await tagEntity.mutateAsync({
        entityType: 'artwork',
        entityId: artworkId,
        tagId
      });
      await refetchArtworkTags();
      toast.success("Tag added successfully");
    } catch (error) {
      console.error('Error adding tag:', error);
      toast.error("Failed to add tag");
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    try {
      await removeTag.mutateAsync({
        entityType: 'artwork',
        entityId: artworkId,
        tagId
      });
      await refetchArtworkTags();
      toast.success("Tag removed successfully");
    } catch (error) {
      console.error('Error removing tag:', error);
      toast.error("Failed to remove tag");
    }
  };

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const selectedCategoryData = categories?.find(c => c.category_key === selectedCategory);

  return (
    <div className="space-y-4">
      {/* AI Tag Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>AI Tag Suggestions</CardTitle>
          <CardDescription>Get intelligent tag recommendations based on artwork content</CardDescription>
        </CardHeader>
        <CardContent>
          <AITagSuggestions
            entityType="artwork"
            entityId={artworkId}
          />
        </CardContent>
      </Card>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
        {/* Sidebar - Category Navigation */}
        <aside className="lg:col-span-1 flex flex-col border rounded-lg bg-card">
          <div className="p-6 space-y-4">
            <div className="pb-4 border-b">
              <h3 className="text-base font-semibold">Browse Categories</h3>
            </div>
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
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {Object.entries(CATEGORY_GROUPS).map(([groupName, groupData]) => {
                const Icon = groupData.icon;
                const groupCategories = categories?.filter(cat => 
                  groupData.categories.includes(cat.category_key)
                );
                
                return (
                  <Collapsible
                    key={groupName}
                    open={openGroups[groupName]}
                    onOpenChange={() => toggleGroup(groupName)}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-md transition-colors">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{groupName}</span>
                      </div>
                      <ChevronDown 
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform",
                          openGroups[groupName] && "transform rotate-180"
                        )} 
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-6 mt-1 space-y-0.5">
                        {groupCategories?.map(category => (
                          <Button
                            key={category.category_key}
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              selectedCategory === category.category_key && "bg-muted text-primary font-medium"
                            )}
                            onClick={() => {
                              setSelectedCategory(category.category_key);
                              setGlobalSearchTerm("");
                              setLocalSearchTerm("");
                            }}
                          >
                            <span className="truncate">{category.display_name}</span>
                          </Button>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-4 flex flex-col h-full">
          {/* Browse & Add Tags */}
          <Card className="flex-1 flex flex-col overflow-hidden">
            {globalSearchTerm ? (
              // Global Search Results View
              <>
                <CardHeader className="pb-4 space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Search Results for "{globalSearchTerm}"
                      </CardTitle>
                    </div>
                    <Badge variant="secondary">
                      {globalSearchResults.length} tag{globalSearchResults.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  {globalSearchResults.length > 0 ? (
                    <div className="space-y-4">
                      {/* Group results by category */}
                      {Object.entries(
                        globalSearchResults.reduce((acc, tag) => {
                          const categoryName = tag.category?.display_name || 'Uncategorized';
                          if (!acc[categoryName]) acc[categoryName] = [];
                          acc[categoryName].push(tag);
                          return acc;
                        }, {} as Record<string, typeof globalSearchResults>)
                      ).map(([categoryName, tags]) => (
                        <div key={categoryName} className="space-y-2">
                          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                            {categoryName}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {tags.map(tag => {
                              const isApplied = appliedTagIds.has(tag.id);
                              return (
                                <Button
                                  key={tag.id}
                                  variant={isApplied ? "default" : "outline"}
                                  size="sm"
                                  className={cn(
                                    "justify-between gap-2",
                                    isApplied && "bg-primary text-primary-foreground"
                                  )}
                                  onClick={() => isApplied ? handleRemoveTag(tag.id) : handleAddTag(tag.id)}
                                >
                                  <span className="truncate">{tag.display_name}</span>
                                  <div className="flex items-center gap-1 shrink-0">
                                    {isApplied && <Check className="h-3 w-3" />}
                                    {!isApplied && <Plus className="h-3 w-3" />}
                                  </div>
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No tags found matching "{globalSearchTerm}"</p>
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              // Category-Specific View
              <>
                <CardHeader className="pb-4 space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <CardTitle className="text-base font-semibold">
                        {selectedCategoryData?.display_name || 'Select a Category'}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {filteredAvailableTags.length} tags
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => setCreateTagOpen(true)}
                        disabled={!selectedCategory}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        New
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tags..."
                      value={localSearchTerm}
                      onChange={(e) => setLocalSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  {selectedCategory ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {filteredAvailableTags.map(tag => {
                        const isApplied = appliedTagIds.has(tag.id);
                        return (
                          <Button
                            key={tag.id}
                            variant={isApplied ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "justify-between gap-2",
                              isApplied && "bg-primary text-primary-foreground"
                            )}
                            onClick={() => isApplied ? handleRemoveTag(tag.id) : handleAddTag(tag.id)}
                          >
                            <span className="truncate">{tag.display_name}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              {isApplied && <Check className="h-3 w-3" />}
                              {!isApplied && <Plus className="h-3 w-3" />}
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Palette className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>Select a category from the sidebar to browse tags</p>
                    </div>
                  )}
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Current Artwork Tags */}
      {artworkTags && artworkTags.length > 0 && (
        <Collapsible open={currentTagsOpen} onOpenChange={setCurrentTagsOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Current Artwork Tags</CardTitle>
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform",
                      currentTagsOpen && "rotate-180"
                    )} 
                  />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(tagsByCategory || {}).map(([categoryName, tags]) => (
                    <div key={categoryName} className="space-y-1">
                      <div className="text-xs text-muted-foreground font-medium">
                        {categoryName}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {tags.map(tag => (
                          <TagPill
                            key={tag.tag_id}
                            tag={{
                              display_name: tag.tag_name,
                              category_name: tag.category_name,
                              source: tag.source
                            }}
                            onRemove={() => handleRemoveTag(tag.tag_id)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      <CreateTagDialog
        open={createTagOpen}
        onOpenChange={setCreateTagOpen}
        categoryKey={selectedCategory || ""}
        categoryName={selectedCategoryData?.display_name || ""}
      />
    </div>
  );
}
