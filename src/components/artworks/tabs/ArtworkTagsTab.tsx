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
    <div className="space-y-6">
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

      {/* Manual Tag Management */}
      <Card>
        <CardHeader>
          <CardTitle>Tag Management</CardTitle>
          <CardDescription>Browse and manage tags for this artwork</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
            {/* Sidebar: Category Navigation */}
            <div className="space-y-4">
              {/* Global Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search all tags..."
                  value={globalSearchTerm}
                  onChange={(e) => setGlobalSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Category Groups */}
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {Object.entries(CATEGORY_GROUPS).map(([groupName, group]) => {
                    const Icon = group.icon;
                    const groupCategories = categories?.filter(c => 
                      group.categories.includes(c.category_key)
                    ) || [];

                    return (
                      <Collapsible
                        key={groupName}
                        open={openGroups[groupName]}
                        onOpenChange={() => toggleGroup(groupName)}
                      >
                        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-3 hover:bg-accent">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{groupName}</span>
                          </div>
                          <ChevronDown 
                            className={cn(
                              "h-4 w-4 transition-transform",
                              openGroups[groupName] && "rotate-180"
                            )} 
                          />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-1 space-y-1 pl-2">
                          {groupCategories.map(category => (
                            <Button
                              key={category.category_key}
                              variant={selectedCategory === category.category_key ? "secondary" : "ghost"}
                              size="sm"
                              onClick={() => {
                                setSelectedCategory(category.category_key);
                                setLocalSearchTerm("");
                              }}
                              className="w-full justify-start font-normal"
                            >
                              {category.display_name}
                            </Button>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              </ScrollArea>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCreateTagOpen(true)}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Tag
              </Button>
            </div>

            {/* Main Content: Tag Selection */}
            <div className="space-y-4">
              {globalSearchTerm ? (
                /* Global Search Results */
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Search Results</h3>
                    <p className="text-sm text-muted-foreground">
                      Found {globalSearchResults.length} tag{globalSearchResults.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {globalSearchResults.map(tag => {
                      const isApplied = appliedTagIds.has(tag.id);
                      return (
                        <Button
                          key={tag.id}
                          variant={isApplied ? "default" : "outline"}
                          size="sm"
                          onClick={() => isApplied ? handleRemoveTag(tag.id) : handleAddTag(tag.id)}
                          className="gap-2"
                        >
                          {isApplied && <Check className="h-3 w-3" />}
                          {tag.display_name}
                          <Badge variant="secondary" className="ml-1">
                            {tag.usage_count || 0}
                          </Badge>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ) : selectedCategory ? (
                /* Category-Specific Tags */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedCategoryData?.display_name}</h3>
                      {selectedCategoryData?.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedCategoryData.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Local Search within Category */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={`Search ${selectedCategoryData?.display_name}...`}
                      value={localSearchTerm}
                      onChange={(e) => setLocalSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {filteredAvailableTags.map(tag => {
                      const isApplied = appliedTagIds.has(tag.id);
                      return (
                        <Button
                          key={tag.id}
                          variant={isApplied ? "default" : "outline"}
                          size="sm"
                          onClick={() => isApplied ? handleRemoveTag(tag.id) : handleAddTag(tag.id)}
                          className="gap-2"
                        >
                          {isApplied && <Check className="h-3 w-3" />}
                          {tag.display_name}
                          <Badge variant="secondary" className="ml-1">
                            {tag.usage_count || 0}
                          </Badge>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Select a category from the sidebar to browse available tags
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Currently Applied Tags */}
          {artworkTags && artworkTags.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <Collapsible open={currentTagsOpen} onOpenChange={setCurrentTagsOpen}>
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Current Tags ({artworkTags.length})
                  </h3>
                  <ChevronDown 
                    className={cn(
                      "h-5 w-5 transition-transform",
                      currentTagsOpen && "rotate-180"
                    )} 
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <div className="space-y-4">
                    {Object.entries(tagsByCategory || {}).map(([categoryName, tags]) => (
                      <div key={categoryName}>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                          {categoryName}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {tags.map(tag => (
                            <TagPill
                              key={tag.tag_id}
                              tag={{
                                display_name: tag.tag_name,
                                category_name: tag.category_name
                              }}
                              onRemove={() => handleRemoveTag(tag.tag_id)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateTagDialog
        open={createTagOpen}
        onOpenChange={setCreateTagOpen}
        categoryKey={selectedCategory || ""}
        categoryName={selectedCategoryData?.display_name || ""}
      />
    </div>
  );
}
