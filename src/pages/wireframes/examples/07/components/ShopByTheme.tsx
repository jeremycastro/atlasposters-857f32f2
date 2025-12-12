import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WireframePlaceholder } from "./WireframePlaceholder";

const themes = [
  { title: "Travel Posters", tag: "Travel", count: 156 },
  { title: "Art Deco Collection", tag: "Art Deco", count: 89 },
  { title: "Vintage Ski", tag: "Winter Sports", count: 67 },
  { title: "National Parks", tag: "Nature", count: 124 },
];

export function ShopByTheme() {
  return (
    <section className="px-4 py-8">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-lg font-bold">Shop by Theme</h2>
        <p className="text-sm text-muted-foreground">
          Explore our curated collections by style and era
        </p>
      </div>

      {/* Vertical List - 16:9 items */}
      <div className="space-y-3 mt-4">
        {themes.map((theme) => (
          <div key={theme.title} className="relative group cursor-pointer">
            <WireframePlaceholder 
              aspectRatio="video" 
              className="rounded-lg"
              label={theme.title}
            />
            <Badge 
              className="absolute top-3 left-3 bg-background/90 text-foreground text-xs"
            >
              {theme.tag}
            </Badge>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-semibold text-background text-sm drop-shadow-lg">
                {theme.title}
              </h3>
              <p className="text-xs text-background/80 drop-shadow-lg">
                {theme.count} posters
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* View All */}
      <Button variant="ghost" className="w-full mt-4 text-amber-600">
        View All Themes
        <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </section>
  );
}
