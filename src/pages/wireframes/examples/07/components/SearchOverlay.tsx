import { useState } from "react";
import { X, Search, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const trendingSearches = [
  "Travel Posters",
  "Vintage Movie Posters",
  "Botanical Prints",
  "Japanese Art",
  "Art Deco",
];

const recentSearches = [
  "National Parks",
  "French Riviera",
];

const popularCategories = [
  { label: "New Arrivals", count: "48 items" },
  { label: "Best Sellers", count: "120 items" },
  { label: "Under £30", count: "85 items" },
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background animate-in fade-in duration-200">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b">
        <div className="flex items-center gap-3 p-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posters, artists, styles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 h-11"
              autoFocus
            />
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto h-[calc(100vh-72px)] p-4">
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">Recent Searches</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trending Searches */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-amber-600" />
            <h3 className="text-sm font-medium">Trending Now</h3>
          </div>
          <ul className="space-y-1">
            {trendingSearches.map((term, index) => (
              <li key={term}>
                <button className="flex items-center gap-3 w-full py-2.5 px-2 rounded-lg hover:bg-muted transition-colors text-left">
                  <span className="text-xs font-bold text-muted-foreground w-5">
                    {index + 1}
                  </span>
                  <span className="text-sm">{term}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Popular Categories */}
        <div>
          <h3 className="text-sm font-medium mb-3">Quick Links</h3>
          <ul className="space-y-1">
            {popularCategories.map((cat) => (
              <li key={cat.label}>
                <button className="flex items-center justify-between w-full py-3 px-2 rounded-lg hover:bg-muted transition-colors">
                  <span className="font-medium text-sm">{cat.label}</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-xs">{cat.count}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
