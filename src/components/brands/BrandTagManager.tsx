import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEntityTags, useCategories, useTags, useAllTags, useTagEntity, useRemoveTag } from "@/hooks/useTags";
import { TagPill } from "@/components/tags/TagPill";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Info, ArrowDown, Search, Plus, Check, Palette, Briefcase, Award, Calendar, Wrench, ChevronDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CreateTagDialog } from "@/components/tags/CreateTagDialog";
interface BrandTagManagerProps {
  brandId: string;
  brandName: string;
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
export const BrandTagManager = ({
  brandId,
  brandName
}: BrandTagManagerProps) => {
  const navigate = useNavigate();
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

  // Fetch brand tags
  const {
    data: brandTags,
    refetch: refetchBrandTags
  } = useEntityTags('brand', brandId);
  const {
    data: categories
  } = useCategories();
  const {
    data: availableTags
  } = useTags(selectedCategory || "");
  const {
    data: allTags
  } = useAllTags();
  const tagEntity = useTagEntity();
  const removeTag = useRemoveTag();

  // Auto-select first category
  if (categories && categories.length > 0 && !selectedCategory) {
    setSelectedCategory(categories[0].category_key);
  }

  // Group current tags by category
  const tagsByCategory = brandTags?.reduce((acc, tag) => {
    if (!acc[tag.category_name]) {
      acc[tag.category_name] = [];
    }
    acc[tag.category_name].push(tag);
    return acc;
  }, {} as Record<string, typeof brandTags>);

  // Get currently applied tag IDs
  const appliedTagIds = new Set(brandTags?.map(t => t.tag_id) || []);

  // Filter available tags by local search term (within category)
  const filteredAvailableTags = useMemo(() => {
    if (!availableTags) return [];
    if (!localSearchTerm) return availableTags;
    const searchLower = localSearchTerm.toLowerCase();
    return availableTags.filter(tag => tag.display_name.toLowerCase().includes(searchLower) || tag.tag_key.toLowerCase().includes(searchLower));
  }, [availableTags, localSearchTerm]);

  // Global search results (across all tags)
  const globalSearchResults = useMemo(() => {
    if (!allTags || !globalSearchTerm) return [];
    const searchLower = globalSearchTerm.toLowerCase();
    return allTags.filter(tag => tag.display_name.toLowerCase().includes(searchLower) || tag.tag_key.toLowerCase().includes(searchLower));
  }, [allTags, globalSearchTerm]);

  // Count artworks under this brand
  const {
    data: artworkCount
  } = useQuery({
    queryKey: ['brand-artwork-count', brandId],
    queryFn: async () => {
      const {
        count,
        error
      } = await supabase.from('artworks').select('*', {
        count: 'exact',
        head: true
      }).eq('brand_id', brandId);
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch sample artworks
  const {
    data: sampleArtworks
  } = useQuery({
    queryKey: ['brand-sample-artworks', brandId],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('artworks').select('id, title, asc_code').eq('brand_id', brandId).limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!artworkCount && artworkCount > 0
  });
  const handleAddTag = async (tagId: string) => {
    try {
      await tagEntity.mutateAsync({
        entityType: 'brand',
        entityId: brandId,
        tagId
      });
      toast.success("Tag added to brand");
      refetchBrandTags();
    } catch (error) {
      toast.error("Failed to add tag");
    }
  };
  const handleRemoveTag = async (tagId: string) => {
    try {
      await removeTag.mutateAsync({
        entityType: 'brand',
        entityId: brandId,
        tagId
      });
      toast.success("Tag removed from brand");
      refetchBrandTags();
    } catch (error) {
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
  return <div className="space-y-4">
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
              <Input placeholder="Search all tags..." value={globalSearchTerm} onChange={e => setGlobalSearchTerm(e.target.value)} className="pl-8" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {Object.entries(CATEGORY_GROUPS).map(([groupName, groupData]) => {
              const Icon = groupData.icon;
              const groupCategories = categories?.filter(cat => groupData.categories.includes(cat.category_key));
              return <Collapsible key={groupName} open={openGroups[groupName]} onOpenChange={() => toggleGroup(groupName)}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-md transition-colors">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{groupName}</span>
                      </div>
                      <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", openGroups[groupName] && "transform rotate-180")} />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-6 mt-1 space-y-0.5">
                        {groupCategories?.map(category => <Button key={category.category_key} variant="ghost" size="sm" className={cn("w-full justify-start text-left font-normal", selectedCategory === category.category_key && "bg-muted text-primary font-medium")} onClick={() => {
                      setSelectedCategory(category.category_key);
                      setGlobalSearchTerm("");
                      setLocalSearchTerm("");
                    }}>
                            <span className="truncate">{category.display_name}</span>
                          </Button>)}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>;
            })}
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-4 flex flex-col h-full">
          {/* Browse & Add Tags */}
          <Card className="flex-1 flex flex-col overflow-hidden">
            {globalSearchTerm ?
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
                  {globalSearchResults.length > 0 ? <div className="space-y-4">
                      {/* Group results by category */}
                      {Object.entries(globalSearchResults.reduce((acc, tag) => {
                  const categoryName = tag.category?.display_name || 'Uncategorized';
                  if (!acc[categoryName]) acc[categoryName] = [];
                  acc[categoryName].push(tag);
                  return acc;
                }, {} as Record<string, typeof globalSearchResults>)).map(([categoryName, tags]) => <div key={categoryName} className="space-y-2">
                          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                            {categoryName}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {tags.map(tag => {
                      const isApplied = appliedTagIds.has(tag.id);
                      return <Button key={tag.id} variant={isApplied ? "default" : "outline"} size="sm" className={cn("justify-between gap-2", isApplied && "bg-primary text-primary-foreground")} onClick={() => isApplied ? handleRemoveTag(tag.id) : handleAddTag(tag.id)}>
                                  <span className="truncate">{tag.display_name}</span>
                                  <div className="flex items-center gap-1 shrink-0">
                                    {isApplied && <Check className="h-3 w-3" />}
                                    {!isApplied && <Plus className="h-3 w-3" />}
                                  </div>
                                </Button>;
                    })}
                          </div>
                        </div>)}
                    </div> : <div className="text-center py-12 text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No tags found matching "{globalSearchTerm}"</p>
                    </div>}
                </CardContent>
              </> :
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
                      <Button size="sm" onClick={() => setCreateTagOpen(true)} disabled={!selectedCategory}>
                        <Plus className="h-4 w-4 mr-1" />
                        New
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search tags..." value={localSearchTerm} onChange={e => setLocalSearchTerm(e.target.value)} className="pl-8" />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  {selectedCategory ? <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {filteredAvailableTags.map(tag => {
                  const isApplied = appliedTagIds.has(tag.id);
                  return <Button key={tag.id} variant={isApplied ? "default" : "outline"} size="sm" className={cn("justify-between gap-2", isApplied && "bg-primary text-primary-foreground")} onClick={() => isApplied ? handleRemoveTag(tag.id) : handleAddTag(tag.id)}>
                            <span className="truncate">{tag.display_name}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              {isApplied && <Check className="h-3 w-3" />}
                              {!isApplied && <Plus className="h-3 w-3" />}
                            </div>
                          </Button>;
                })}
                    </div> : <div className="text-center py-12 text-muted-foreground">
                      <Palette className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>Select a category from the sidebar to browse tags</p>
                    </div>}
                </CardContent>
              </>}
          </Card>
        </div>
      </div>

      {/* Current Brand Tags */}
      {brandTags && brandTags.length > 0 && <Collapsible open={currentTagsOpen} onOpenChange={setCurrentTagsOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Current Brand Tags</CardTitle>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", currentTagsOpen && "rotate-180")} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(tagsByCategory || {}).map(([categoryName, tags]) => <div key={categoryName} className="space-y-1">
                      <div className="text-xs text-muted-foreground font-medium">
                        {categoryName}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {tags.map(tag => <TagPill key={tag.tag_id} tag={{
                    display_name: tag.tag_name,
                    category_name: tag.category_name,
                    source: tag.source
                  }} onRemove={() => handleRemoveTag(tag.tag_id)} />)}
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>}

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Tags added to this brand will automatically be inherited by all {artworkCount || 0} artwork{artworkCount !== 1 ? 's' : ''} under <strong>{brandName}</strong>. 
          Inherited tags appear with a dashed border and cannot be removed from individual artworks.
        </AlertDescription>
      </Alert>

      {/* Inheritance Preview */}
      {artworkCount && artworkCount > 0 && brandTags && brandTags.length > 0 && <Card className="border-dashed">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ArrowDown className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Tag Inheritance</CardTitle>
            </div>
            <CardDescription>
              {artworkCount} artwork{artworkCount !== 1 ? 's' : ''} will inherit these tags
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sampleArtworks?.map(artwork => <div 
                  key={artwork.id} 
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                  onClick={() => navigate('/admin/artworks')}
                >
                  <Badge variant="outline" className="font-mono text-xs">
                    {artwork.asc_code}
                  </Badge>
                  <span className="text-muted-foreground">{artwork.title}</span>
                </div>)}
              {artworkCount > 5 && <p className="text-xs text-muted-foreground pt-2">
                  + {artworkCount - 5} more artwork{artworkCount - 5 !== 1 ? 's' : ''}
                </p>}
            </div>
          </CardContent>
        </Card>}

      {/* Create Tag Dialog */}
      <CreateTagDialog open={createTagOpen} onOpenChange={setCreateTagOpen} categoryKey={selectedCategory || ""} categoryName={selectedCategoryData?.display_name || ""} />
    </div>;
};