import { useState, useEffect, useMemo } from "react";
import { useCategories, useTags, useEntityTags, useTagEntity, useRemoveTag } from "@/hooks/useTags";
import { TagPill } from "./TagPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Palette, Briefcase, Award, Calendar, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface UnifiedTagSelectorProps {
  entityType: string;
  entityId: string;
  scope?: string;
  className?: string;
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

export const UnifiedTagSelector = ({ 
  entityType, 
  entityId, 
  scope,
  className 
}: UnifiedTagSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories } = useCategories(scope);
  const { data: entityTags, isLoading: tagsLoading } = useEntityTags(entityType, entityId);
  const { data: availableTags } = useTags(selectedCategory || "");
  const addTag = useTagEntity();
  const removeTag = useRemoveTag();

  // Auto-select first category when categories load
  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].category_key);
    }
  }, [categories, selectedCategory]);

  const currentCategory = categories?.find(c => c.category_key === selectedCategory);
  
  // Group entity tags by category
  const tagsByCategory = entityTags?.reduce((acc, tag) => {
    if (!acc[tag.category_key]) {
      acc[tag.category_key] = [];
    }
    acc[tag.category_key].push(tag);
    return acc;
  }, {} as Record<string, typeof entityTags>);

  const handleAddTag = async (tagId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    await addTag.mutateAsync({
      entityType,
      entityId,
      tagId,
    });
  };

  const handleRemoveTag = async (tagId: string) => {
    await removeTag.mutateAsync({
      entityType,
      entityId,
      tagId,
    });
  };

  // Show all tags but indicate which are already added
  const processedTags = availableTags?.map(tag => {
    const isAlreadyAdded = entityTags?.some(et => et.tag_id === tag.id);
    const matchesSearch = tag.display_name.toLowerCase().includes(searchTerm.toLowerCase());
    return {
      ...tag,
      isAlreadyAdded,
      matchesSearch
    };
  }).filter(tag => tag.matchesSearch);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Current Tags Display */}
      <div className="space-y-3">
        <Label>Current Tags</Label>
        {tagsLoading ? (
          <div className="text-sm text-muted-foreground">Loading tags...</div>
        ) : entityTags && entityTags.length > 0 ? (
          <div className="space-y-2">
            {categories?.map((category) => {
              const categoryTags = tagsByCategory?.[category.category_key];
              if (!categoryTags || categoryTags.length === 0) return null;

              return (
                <div key={category.id} className="space-y-1">
                  <div className="text-xs text-muted-foreground font-medium">
                    {category.display_name}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {categoryTags.map((tag) => (
                      <TagPill
                        key={tag.tag_id}
                        tag={{
                          display_name: tag.tag_name,
                          category_name: tag.category_name,
                          source: tag.source,
                          confidence_score: tag.confidence_score || undefined,
                        }}
                        onRemove={
                          tag.source === 'manual' 
                            ? () => handleRemoveTag(tag.tag_id)
                            : undefined
                        }
                        showSource
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No tags added yet</div>
        )}
      </div>

      {/* Tag Selection Interface */}
      <div className="border rounded-lg p-4 space-y-3">
        <Label>Browse & Add Tags</Label>
        
        {/* Flat category selector with visual grouping */}
        <div className="space-y-3">
          {Object.entries(CATEGORY_GROUPS).map(([groupName, group]) => {
            const GroupIcon = group.icon;
            
            return (
              <div key={groupName} className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <GroupIcon className="h-3 w-3" />
                  <span>{groupName}</span>
                </div>
                
                <div className="flex flex-wrap gap-1.5">
                  {group.categories.map(categoryKey => {
                    const category = categories?.find(c => c.category_key === categoryKey);
                    if (!category) return null;
                    
                    const isActive = selectedCategory === categoryKey;
                    
                    return (
                      <Button
                        key={categoryKey}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setSelectedCategory(categoryKey);
                          setSearchTerm("");
                        }}
                        className={cn(
                          "h-8 text-xs",
                          !isActive && "hover:bg-accent"
                        )}
                      >
                        {category.display_name}
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tag selection area for selected category */}
        {currentCategory && (
          <div className="space-y-3 mt-4 pt-4 border-t">
            <div>
              <div className="text-sm font-medium mb-1">{currentCategory.display_name}</div>
              {currentCategory.description && (
                <p className="text-xs text-muted-foreground">{currentCategory.description}</p>
              )}
            </div>
            
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${currentCategory.display_name.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <ScrollArea className="h-[200px] border rounded-md p-2">
              <div className="flex flex-wrap gap-1">
                {processedTags && processedTags.length > 0 ? (
                  processedTags.map((tag) => (
                    <Button
                      key={tag.id}
                      variant={tag.isAlreadyAdded ? "secondary" : "outline"}
                      size="sm"
                      onClick={(e) => handleAddTag(tag.id, e)}
                      className={cn(
                        "h-7 text-xs",
                        tag.isAlreadyAdded && "opacity-60 cursor-default"
                      )}
                      disabled={addTag.isPending || tag.isAlreadyAdded}
                    >
                      {tag.isAlreadyAdded ? (
                        <>
                          <Badge variant="secondary" className="h-3 w-3 mr-1 p-0 flex items-center justify-center rounded-full">✓</Badge>
                          {tag.display_name}
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3 mr-1" />
                          {tag.display_name}
                        </>
                      )}
                      {tag.usage_count > 0 && (
                        <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1">
                          {tag.usage_count}
                        </Badge>
                      )}
                    </Button>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground p-4">
                    {searchTerm ? 'No matching tags found' : 'No available tags'}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};
