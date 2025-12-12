import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WireframePlaceholder } from "./WireframePlaceholder";
import { cn } from "@/lib/utils";

const collections = [
  { title: "National Parks", count: 42 },
  { title: "French Riviera", count: 28 },
  { title: "Art Deco", count: 35 },
  { title: "Vintage Ski", count: 24 },
  { title: "Japanese Art", count: 31 },
];

export function CuratedCollections() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const threshold = 10;
      setIsAtStart(el.scrollLeft < threshold);
      setIsAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - threshold);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 200;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-lg font-bold">Curated Collections</h2>
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
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
      >
        {collections.map((collection, index) => (
          <div
            key={collection.title}
            className={cn(
              "flex-shrink-0 w-[140px] sm:w-[180px] snap-start transition-all duration-200",
              index === 0 && isAtStart && "ml-4",
              index === collections.length - 1 && isAtEnd && "mr-4"
            )}
          >
            <WireframePlaceholder 
              aspectRatio="portrait" 
              className="rounded-lg mb-2"
              label={collection.title}
            />
            <h3 className="font-medium text-sm truncate">{collection.title}</h3>
            <p className="text-xs text-muted-foreground">{collection.count} posters</p>
          </div>
        ))}
      </div>
    </section>
  );
}
