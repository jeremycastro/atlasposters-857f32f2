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
  { title: "Artist Collection", subButtons: ["Browse", "Popular", "New"] },
  { title: "Travel Posters", subButtons: ["Browse", "Popular", "New"] },
  { title: "Movie Posters", subButtons: ["Browse", "Popular", "New"] },
  { title: "Botanical", subButtons: ["Browse", "Popular", "New"] },
];

interface DiscoveryCardsProps {
  onSearchClick: () => void;
}

export function DiscoveryCards({ onSearchClick }: DiscoveryCardsProps) {
  return (
    <section className="px-4 py-8">
      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {discoveryItems.map((item) => (
          <DiscoveryCard key={item.title} {...item} />
        ))}
      </div>

      {/* Search Bar */}
      <button 
        onClick={onSearchClick}
        className="w-full"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posters, artists..."
            className="pl-10 bg-muted border-0 h-12 cursor-pointer"
            readOnly
          />
        </div>
      </button>
    </section>
  );
}
