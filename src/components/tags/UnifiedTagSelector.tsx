import { useState, useEffect } from "react";
import { useCategories, useTags, useEntityTags, useTagEntity, useRemoveTag } from "@/hooks/useTags";
import { TagPill } from "./TagPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface UnifiedTagSelectorProps {
  entityType: string;
  entityId: string;
  scope?: string;
  className?: string;
}

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

  const handleAddTag = async (tagId: string) => {
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

  const filteredAvailableTags = availableTags?.filter(tag => {
    const isAlreadyAdded = entityTags?.some(et => et.tag_id === tag.id);
    const matchesSearch = tag.display_name.toLowerCase().includes(searchTerm.toLowerCase());
    return !isAlreadyAdded && matchesSearch;
  });

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
        <Label>Add Tags</Label>
        
        <Tabs value={selectedCategory || ""} onValueChange={setSelectedCategory}>
          <ScrollArea className="w-full">
            <TabsList className="inline-flex w-max">
              {categories?.map((category) => (
                <TabsTrigger key={category.id} value={category.category_key}>
                  {category.display_name}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>

          {categories?.map((category) => (
            <TabsContent key={category.id} value={category.category_key} className="space-y-3 mt-3">
              {category.description && (
                <p className="text-sm text-muted-foreground">{category.description}</p>
              )}
              
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${category.display_name.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <ScrollArea className="h-[200px] border rounded-md p-2">
                <div className="flex flex-wrap gap-1">
                  {filteredAvailableTags && filteredAvailableTags.length > 0 ? (
                    filteredAvailableTags.map((tag) => (
                      <Button
                        key={tag.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddTag(tag.id)}
                        className="h-7 text-xs"
                        disabled={addTag.isPending}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {tag.display_name}
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
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
