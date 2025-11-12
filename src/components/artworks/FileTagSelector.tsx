import { useState } from 'react';
import { useFileTags } from '@/hooks/useFileTags';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Tags, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileTagSelectorProps {
  selectedTags: {
    structured: Record<string, string[]>;
    custom: string[];
    matches_variants: Record<string, string[]>;
  };
  onChange: (tags: {
    structured: Record<string, string[]>;
    custom: string[];
    matches_variants: Record<string, string[]>;
  }) => void;
  className?: string;
}

export const FileTagSelector = ({
  selectedTags,
  onChange,
  className,
}: FileTagSelectorProps) => {
  const { data: tagCategories, isLoading } = useFileTags();
  const [customTagInput, setCustomTagInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleStructuredTagToggle = (category: string, tagValue: string) => {
    const currentCategoryTags = selectedTags.structured[category] || [];
    const newCategoryTags = currentCategoryTags.includes(tagValue)
      ? currentCategoryTags.filter((t) => t !== tagValue)
      : [...currentCategoryTags, tagValue];

    onChange({
      ...selectedTags,
      structured: {
        ...selectedTags.structured,
        [category]: newCategoryTags,
      },
    });
  };

  const handleAddCustomTag = () => {
    if (!customTagInput.trim()) return;
    
    const newTag = customTagInput.trim().toLowerCase();
    if (!selectedTags.custom.includes(newTag)) {
      onChange({
        ...selectedTags,
        custom: [...selectedTags.custom, newTag],
      });
    }
    setCustomTagInput('');
  };

  const handleRemoveCustomTag = (tag: string) => {
    onChange({
      ...selectedTags,
      custom: selectedTags.custom.filter((t) => t !== tag),
    });
  };

  const getTotalTagCount = () => {
    const structuredCount = Object.values(selectedTags.structured).reduce(
      (sum, tags) => sum + tags.length,
      0
    );
    return structuredCount + selectedTags.custom.length;
  };

  const getAllSelectedTags = () => {
    const structured = Object.entries(selectedTags.structured).flatMap(
      ([category, tags]) =>
        tags.map((tag) => ({
          type: 'structured' as const,
          category,
          value: tag,
        }))
    );
    const custom = selectedTags.custom.map((tag) => ({
      type: 'custom' as const,
      value: tag,
    }));
    return [...structured, ...custom];
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label>File Tags</Label>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <Tags className="mr-2 h-4 w-4" />
            {getTotalTagCount() > 0 ? (
              <span>{getTotalTagCount()} tags selected</span>
            ) : (
              <span className="text-muted-foreground">Select tags...</span>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-96 p-0" align="start">
          <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
            {/* Structured Tags */}
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading tags...</div>
            ) : (
              <div className="space-y-4">
                {tagCategories?.map((categoryGroup) => (
                  <div key={categoryGroup.category} className="space-y-2">
                    <h4 className="font-medium text-sm capitalize">
                      {categoryGroup.category.replace('_', ' ')}
                    </h4>
                    <div className="space-y-2">
                      {categoryGroup.tags.map((tag) => (
                        <div
                          key={tag.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={tag.id}
                            checked={
                              selectedTags.structured[categoryGroup.category]?.includes(
                                tag.tag_value
                              ) || false
                            }
                            onCheckedChange={() =>
                              handleStructuredTagToggle(
                                categoryGroup.category,
                                tag.tag_value
                              )
                            }
                          />
                          <Label
                            htmlFor={tag.id}
                            className="text-sm font-normal cursor-pointer flex-1"
                          >
                            {tag.display_name}
                            {tag.description && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({tag.description})
                              </span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Separator />

            {/* Custom Tags */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Custom Tags</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom tag..."
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomTag();
                    }
                  }}
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleAddCustomTag}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Display Selected Tags */}
      {getTotalTagCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {getAllSelectedTags().map((tag, index) => (
            <Badge
              key={index}
              variant={tag.type === 'structured' ? 'secondary' : 'outline'}
              className="gap-1"
            >
              {tag.type === 'structured'
                ? `${tag.category}: ${tag.value}`
                : tag.value}
              <button
                onClick={() => {
                  if (tag.type === 'structured') {
                    handleStructuredTagToggle(tag.category, tag.value);
                  } else {
                    handleRemoveCustomTag(tag.value);
                  }
                }}
                className="ml-1 hover:bg-background/20 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
