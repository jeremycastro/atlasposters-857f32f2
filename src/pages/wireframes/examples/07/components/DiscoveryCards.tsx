import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { WireframePlaceholder } from "./WireframePlaceholder";

interface DiscoveryCardProps {
  title: string;
  subButtons: string[];
}

function DiscoveryCard({ title, subButtons }: DiscoveryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg">
      <WireframePlaceholder aspectRatio="square" label={title} />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/50 group-hover:bg-foreground/60 transition-colors" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
        <h3 className="text-background font-semibold text-sm sm:text-base text-center mb-2">
          {title}
        </h3>
        
        {/* Sub-buttons - visible on hover/tap */}
        <div className="flex flex-wrap gap-1 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {subButtons.map((btn) => (
            <button
              key={btn}
              className="text-[10px] sm:text-xs bg-background/20 hover:bg-background/30 text-background px-2 py-1 rounded-full transition-colors"
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const discoveryItems = [
  { title: "Discover Destinations", subButtons: ["Europe", "Americas", "Asia"] },
  { title: "Uncover Artists", subButtons: ["Featured", "Emerging", "All"] },
  { title: "Search People", subButtons: ["Athletes", "Icons", "Legends"] },
  { title: "Discover Places", subButtons: ["Cities", "Landmarks", "Nature"] },
];

interface DiscoveryCardsProps {
  onSearchClick?: () => void;
}

export function DiscoveryCards({ onSearchClick }: DiscoveryCardsProps) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <section className="px-4 py-8">
      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {discoveryItems.map((item) => (
          <DiscoveryCard key={item.title} {...item} />
        ))}
      </div>

      {/* Sticky Search Bar */}
      <div className="sticky top-[88px] z-40 -mx-4 px-4 py-3 bg-background/95 backdrop-blur-sm border-b border-border/30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search people, places, sports, landmarks"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 bg-muted border-0 h-12"
          />
        </div>
      </div>
    </section>
  );
}
