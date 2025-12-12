import { Button } from "@/components/ui/button";
import { WireframePlaceholder } from "./WireframePlaceholder";

export function HeroSection() {
  return (
    <section className="relative">
      {/* Hero Image Placeholder */}
      <div className="relative aspect-[3/4] sm:aspect-[16/10] lg:aspect-[21/9]">
        <WireframePlaceholder 
          aspectRatio="portrait" 
          className="absolute inset-0 aspect-auto h-full w-full" 
          label="Hero Image"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end text-center text-background p-6 pb-10 sm:pb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            Rare and Iconic Posters
          </h1>
          <p className="text-sm sm:text-base text-background/80 mb-6 max-w-md">
            Authentic Art at Accessible Prices
          </p>
          <Button 
            size="lg" 
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8"
          >
            Shop the Archive
          </Button>
        </div>
      </div>
    </section>
  );
}
