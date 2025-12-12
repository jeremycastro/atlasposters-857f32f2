import { Button } from "@/components/ui/button";
import { WireframePlaceholder } from "./WireframePlaceholder";

export function HeroSection() {
  return (
    <section className="relative">
      {/* Hero Image Placeholder */}
      <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9]">
        <WireframePlaceholder 
          aspectRatio="portrait" 
          className="absolute inset-0 aspect-auto h-full w-full" 
          label="Hero Image"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end text-center text-background p-6 pb-12 sm:pb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3 max-w-md">
            Museum-grade posters by local artists from around the world
          </h1>
          <p className="text-sm sm:text-base text-background/80 mb-6 max-w-md">
            Explore curated travel, sport, culture and landmarks collections. Framed and Unframed options
          </p>
          <Button 
            size="lg" 
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 uppercase tracking-wide"
          >
            Shop All Posters
          </Button>
        </div>
      </div>
    </section>
  );
}
