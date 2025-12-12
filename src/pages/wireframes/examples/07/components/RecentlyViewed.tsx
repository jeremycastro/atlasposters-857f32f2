import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WireframePlaceholder } from "./WireframePlaceholder";
import { cn } from "@/lib/utils";

const recentProducts = [
  { id: 1, title: "Mountain Sunrise", price: "$49" },
  { id: 2, title: "Ocean Waves", price: "$59" },
  { id: 3, title: "Desert Bloom", price: "$45" },
  { id: 4, title: "Forest Path", price: "$55" },
  { id: 5, title: "City Lights", price: "$65" },
];

export function RecentlyViewed() {
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
    handleScroll();
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
    <section className="py-10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Recently Viewed</h2>
          <p className="text-sm text-muted-foreground">Continue where you left off</p>
        </div>
        <div className="hidden sm:flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => scroll("left")} className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => scroll("right")} className="h-8 w-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Products Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
      >
        {recentProducts.map((product, index) => (
          <div
            key={product.id}
            className={cn(
              "flex-shrink-0 w-[140px] sm:w-[160px] snap-start transition-all duration-200",
              index === 0 && isAtStart && "ml-4",
              index === recentProducts.length - 1 && isAtEnd && "mr-4"
            )}
          >
            <WireframePlaceholder 
              aspectRatio="portrait" 
              label="Product"
              className="rounded-lg mb-2"
            />
            <h3 className="text-sm font-medium text-foreground truncate">{product.title}</h3>
            <p className="text-sm text-primary font-medium">{product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
