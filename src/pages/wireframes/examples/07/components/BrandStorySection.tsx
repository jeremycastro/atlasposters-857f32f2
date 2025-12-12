import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WireframePlaceholder } from "./WireframePlaceholder";

export function BrandStorySection() {
  return (
    <section className="py-10 bg-foreground text-background">
      <div className="px-4 max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">
          The Destination for Rare & Iconic Posters
        </h2>
        <p className="text-sm text-background/80 mb-6 leading-relaxed">
          At Atlas Posters, we believe that great art should inspire adventure. 
          Our curated collection brings together vintage travel posters, iconic movie art, 
          and rare finds from archives around the world—all printed to museum-quality 
          standards and ready to transform your space.
        </p>
        
        {/* Image Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <WireframePlaceholder aspectRatio="square" className="rounded" label="" />
          <WireframePlaceholder aspectRatio="square" className="rounded" label="" />
          <WireframePlaceholder aspectRatio="square" className="rounded" label="" />
        </div>
        
        <Button 
          variant="outline" 
          className="border-background text-background hover:bg-background hover:text-foreground"
        >
          Our Story
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </section>
  );
}
