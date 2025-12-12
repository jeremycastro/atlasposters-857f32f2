import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WireframePlaceholder } from "./WireframePlaceholder";

export function FeaturedEdition() {
  return (
    <section className="px-4 py-8">
      <div className="relative overflow-hidden rounded-xl bg-foreground text-background">
        {/* Background Placeholder */}
        <div className="absolute inset-0 opacity-30">
          <WireframePlaceholder 
            aspectRatio="wide" 
            className="h-full w-full border-0"
          />
        </div>
        
        {/* Content */}
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          {/* Product Image */}
          <div className="w-32 sm:w-40 flex-shrink-0">
            <WireframePlaceholder 
              aspectRatio="portrait" 
              className="rounded-lg"
              label="Featured"
            />
          </div>
          
          {/* Text */}
          <div className="text-center sm:text-left flex-1">
            <Badge className="bg-amber-600 text-white mb-2">
              Limited Edition
            </Badge>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              The Alpine Collection
            </h2>
            <p className="text-sm text-background/80 mb-4">
              Hand-numbered prints from our exclusive partnership with vintage poster archives. Only 100 available.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                View Collection
              </Button>
              <span className="text-sm text-background/60">
                Starting at £85
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
