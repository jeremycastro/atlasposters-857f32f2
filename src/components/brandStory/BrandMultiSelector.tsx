import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Brand {
  id: string;
  brand_name: string;
  primary_color: string | null;
}

interface BrandMultiSelectorProps {
  selectedBrandIds: string[];
  onChange: (brandIds: string[]) => void;
  includeGlobal: boolean;
  onIncludeGlobalChange: (include: boolean) => void;
}

export const BrandMultiSelector = ({
  selectedBrandIds,
  onChange,
  includeGlobal,
  onIncludeGlobalChange,
}: BrandMultiSelectorProps) => {
  const [open, setOpen] = useState(false);

  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("id, brand_name, primary_color")
        .eq("is_active", true)
        .order("brand_name");

      if (error) throw error;
      return data as Brand[];
    },
  });

  const handleBrandToggle = (brandId: string) => {
    if (selectedBrandIds.includes(brandId)) {
      onChange(selectedBrandIds.filter((id) => id !== brandId));
    } else {
      onChange([...selectedBrandIds, brandId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedBrandIds.length === brands.length) {
      onChange([]);
    } else {
      onChange(brands.map((b) => b.id));
    }
  };

  const handleClearAll = () => {
    onChange([]);
    onIncludeGlobalChange(false);
  };

  const isAllSelected = selectedBrandIds.length === brands.length && brands.length > 0;
  const selectedCount = selectedBrandIds.length + (includeGlobal ? 1 : 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[280px] justify-between">
          <span className="truncate">
            {selectedCount === 0
              ? "Select brands..."
              : `${selectedCount} brand${selectedCount !== 1 ? "s" : ""} selected`}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-50 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="p-3 border-b space-y-2">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="h-7 text-xs"
            >
              {isAllSelected ? "Deselect All" : "Select All Brands"}
            </Button>
            {selectedCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-7 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="global-content"
              checked={includeGlobal}
              onCheckedChange={(checked) => onIncludeGlobalChange(!!checked)}
            />
            <label
              htmlFor="global-content"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Atlas Global Content
            </label>
          </div>
        </div>
        <ScrollArea className="h-[240px]">
          <div className="p-3 space-y-2">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={brand.id}
                  checked={selectedBrandIds.includes(brand.id)}
                  onCheckedChange={() => handleBrandToggle(brand.id)}
                />
                <label
                  htmlFor={brand.id}
                  className="flex items-center gap-2 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                >
                  {brand.primary_color && (
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: brand.primary_color }}
                    />
                  )}
                  {brand.brand_name}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
