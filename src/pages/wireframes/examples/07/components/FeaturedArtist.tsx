import { WireframePlaceholder } from "./WireframePlaceholder";
import { Button } from "@/components/ui/button";
import { Quote } from "lucide-react";

export function FeaturedArtist() {
  return (
    <section className="py-10 px-4">
      {/* Section Header */}
      <div className="text-center mb-6">
        <span className="text-xs uppercase tracking-wider text-primary font-medium">Featured Artist</span>
        <h2 className="text-xl font-semibold text-foreground mt-1">Sarah Mitchell</h2>
        <p className="text-sm text-muted-foreground">Contemporary Landscape Artist</p>
      </div>

      {/* Artist Image */}
      <WireframePlaceholder 
        aspectRatio="landscape" 
        label="Artist Portrait / Studio"
        className="rounded-lg mb-6"
      />

      {/* Artist Bio */}
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Known for her bold interpretations of natural landscapes, Sarah Mitchell brings a unique 
          perspective to contemporary poster art. Her work captures the essence of wilderness through 
          vibrant color palettes and striking compositions.
        </p>

        {/* Pull Quote */}
        <blockquote className="relative pl-4 border-l-2 border-primary/40 py-2">
          <Quote className="absolute -left-2 -top-1 w-4 h-4 text-primary/40" />
          <p className="text-sm italic text-foreground">
            "I want people to feel the wind and smell the pine when they look at my work."
          </p>
        </blockquote>

        {/* CTA */}
        <div className="text-center pt-2">
          <Button className="w-full sm:w-auto">
            View Collection
          </Button>
        </div>
      </div>
    </section>
  );
}
