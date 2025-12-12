import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WireframePlaceholder } from "./WireframePlaceholder";

const artists = [
  { name: "Roger Broders", specialty: "French Travel", works: 28 },
  { name: "Alphonse Mucha", specialty: "Art Nouveau", works: 42 },
  { name: "Cassandre", specialty: "Art Deco", works: 19 },
  { name: "Bernard Villemot", specialty: "Vintage Ads", works: 35 },
  { name: "David Klein", specialty: "TWA Posters", works: 15 },
];

export function ArtistSpotlight() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 160;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <div>
          <h2 className="text-lg font-bold">Artist Spotlight</h2>
          <p className="text-sm text-muted-foreground">Discover the masters</p>
        </div>
        <div className="hidden sm:flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => scroll("left")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => scroll("right")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Horizontal Scroll */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2 snap-x snap-mandatory"
      >
        {artists.map((artist) => (
          <div
            key={artist.name}
            className="flex-shrink-0 w-[120px] snap-start text-center"
          >
            <WireframePlaceholder 
              aspectRatio="square" 
              className="rounded-full mb-2 mx-auto w-20 h-20"
              label="Artist"
            />
            <h3 className="font-medium text-sm truncate">{artist.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{artist.specialty}</p>
            <p className="text-xs text-amber-600">{artist.works} works</p>
          </div>
        ))}
      </div>
    </section>
  );
}
