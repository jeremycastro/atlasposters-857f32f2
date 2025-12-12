import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WireframePlaceholder } from "./WireframePlaceholder";

const collections = [
  { title: "Editor's Picks", tag: "Featured", count: 48 },
  { title: "Under £50", tag: "Value", count: 234 },
  { title: "Museum Quality", tag: "Premium", count: 76 },
  { title: "Gift Ideas", tag: "Gifting", count: 112 },
];

export function CuratedCollectionsGrid() {
  return (
    <section className="px-4 py-8">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-lg font-bold">Curated Collections</h2>
        <p className="text-sm text-muted-foreground">
          Hand-picked selections for every taste
        </p>
      </div>

      {/* Vertical List - 16:9 items */}
      <div className="space-y-3 mt-4">
        {collections.map((collection) => (
          <div key={collection.title} className="relative group cursor-pointer">
            <WireframePlaceholder 
              aspectRatio="video" 
              className="rounded-lg"
              label={collection.title}
            />
            <Badge 
              className="absolute top-3 left-3 bg-background/90 text-foreground text-xs"
            >
              {collection.tag}
            </Badge>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-semibold text-background text-sm drop-shadow-lg">
                {collection.title}
              </h3>
              <p className="text-xs text-background/80 drop-shadow-lg">
                {collection.count} posters
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* View All */}
      <Button variant="ghost" className="w-full mt-4 text-amber-600">
        View All Collections
        <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </section>
  );
}
