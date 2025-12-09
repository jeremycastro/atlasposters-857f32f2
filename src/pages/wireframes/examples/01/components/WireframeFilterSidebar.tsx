import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

const artists = [
  "Roger Broders",
  "Alphonse Mucha",
  "Henri Cassiers",
  "Ludwig Hohlwein",
  "A.M. Cassandre",
];

const sizes = ["Small (A4)", "Medium (A3)", "Large (A2)", "Extra Large (A1)"];

const colors = [
  { name: "Blue", value: "hsl(200, 100%, 40%)" },
  { name: "Orange", value: "hsl(30, 100%, 50%)" },
  { name: "Green", value: "hsl(140, 60%, 40%)" },
  { name: "Red", value: "hsl(0, 80%, 50%)" },
  { name: "Neutral", value: "hsl(30, 10%, 60%)" },
];

export function WireframeFilterSidebar() {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="w-64 shrink-0 space-y-6">
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Active Filters</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveFilters([])}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {activeFilters.map((filter) => (
              <Badge
                key={filter}
                variant="secondary"
                className="gap-1 pr-1"
              >
                {filter}
                <button
                  onClick={() => toggleFilter(filter)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Artist Filter */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
          Artist
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          {artists.map((artist) => (
            <label
              key={artist}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <Checkbox
                checked={activeFilters.includes(artist)}
                onCheckedChange={() => toggleFilter(artist)}
              />
              {artist}
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Filter */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
          Price
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 pb-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={500}
            step={10}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>£{priceRange[0]}</span>
            <span>£{priceRange[1]}</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Size Filter */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
          Size
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          {sizes.map((size) => (
            <label
              key={size}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <Checkbox
                checked={activeFilters.includes(size)}
                onCheckedChange={() => toggleFilter(size)}
              />
              {size}
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Color Filter */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
          Colour
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => toggleFilter(color.name)}
                className={`h-8 w-8 rounded-full border-2 transition-all ${
                  activeFilters.includes(color.name)
                    ? "border-foreground scale-110"
                    : "border-transparent hover:border-border"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Frame Style */}
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
          Frame Style
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          {["Unframed", "Black Frame", "White Frame", "Oak Frame"].map(
            (frame) => (
              <label
                key={frame}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <Checkbox
                  checked={activeFilters.includes(frame)}
                  onCheckedChange={() => toggleFilter(frame)}
                />
                {frame}
              </label>
            )
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
