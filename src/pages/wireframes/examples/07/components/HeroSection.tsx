import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { WireframePlaceholder } from "./WireframePlaceholder";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  onSearchClick?: () => void;
}

export function HeroSection({ onSearchClick }: HeroSectionProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <div className="absolute inset-0 flex flex-col items-center justify-end text-center text-background p-6 pb-24 sm:pb-28">
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

      {/* Fixed Bottom Search Bar */}
      <div 
        className={cn(
          "fixed bottom-6 left-4 right-4 z-50 transition-all duration-300",
          isScrolled 
            ? "opacity-0 translate-y-4 pointer-events-none" 
            : "opacity-100 translate-y-0"
        )}
      >
        <button 
          onClick={onSearchClick} 
          className="w-full"
          aria-label="Open search"
        >
          <div className="relative bg-background/95 backdrop-blur-md rounded-full shadow-lg border border-border/50">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search posters, artists..."
              className="pl-12 h-12 rounded-full cursor-pointer bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              readOnly
            />
          </div>
        </button>
      </div>
    </section>
  );
}
