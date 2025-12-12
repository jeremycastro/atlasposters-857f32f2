import { useState } from "react";
import { SlidersHorizontal, ChevronDown, Grid3X3, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { WireframePlaceholder } from "./components/WireframePlaceholder";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { MobileHeader } from "./components/MobileHeader";
import { MobileNav } from "./components/MobileNav";
import { SearchOverlay } from "./components/SearchOverlay";
import { MobileFooter } from "./components/MobileFooter";

const products = [
  { title: "Mont Blanc", artist: "Roger Broders", price: "£45", badge: "Best Seller" },
  { title: "Côte d'Azur", artist: "Cassandre", price: "£55", badge: null },
  { title: "Swiss Alps", artist: "Herbert Matter", price: "£50", badge: "New" },
  { title: "Venice", artist: "David Klein", price: "£48", badge: null },
  { title: "Tokyo", artist: "Kawase Hasui", price: "£42", badge: null },
  { title: "Grand Canyon", artist: "Thomas Moran", price: "£65", badge: "Limited" },
  { title: "Paris", artist: "Paul Colin", price: "£52", badge: null },
  { title: "London", artist: "Frank Newbould", price: "£48", badge: "New" },
];

const filters = {
  category: ["Travel", "Movie", "Botanical", "Vintage Ads", "Photography"],
  price: ["Under £30", "£30 - £50", "£50 - £100", "Over £100"],
  size: ["A4", "A3", "A2", "A1"],
};

const sortOptions = ["Featured", "Newest", "Price: Low to High", "Price: High to Low", "Best Selling"];

export default function WireframeCollection() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSort, setSelectedSort] = useState("Featured");

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <MobileHeader 
        onMenuOpen={() => setIsNavOpen(true)}
        onSearchOpen={() => setIsSearchOpen(true)}
      />
      <MobileNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="pb-8">
        {/* Collection Header */}
        <div className="px-4 py-6 border-b">
          <h1 className="text-2xl font-bold mb-2">Travel Posters</h1>
          <p className="text-sm text-muted-foreground">
            Explore our collection of vintage and contemporary travel posters from around the world.
          </p>
          <p className="text-sm text-muted-foreground mt-2">{products.length} products</p>
        </div>

        {/* Filter & Sort Bar */}
        <div className="sticky top-[57px] bg-background z-30 px-4 py-3 border-b flex items-center justify-between gap-2">
          {/* Filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {Object.entries(filters).map(([key, values]) => (
                  <div key={key}>
                    <h3 className="font-semibold capitalize mb-3">{key}</h3>
                    <div className="space-y-2">
                      {values.map((value) => (
                        <label key={value} className="flex items-center gap-2 text-sm cursor-pointer">
                          <Checkbox />
                          {value}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {selectedSort}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <SheetHeader>
                <SheetTitle>Sort By</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-1">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedSort(option)}
                    className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                      selectedSort === option 
                        ? "bg-amber-50 text-amber-700 font-medium" 
                        : "hover:bg-muted"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* View Toggle */}
          <div className="flex gap-1">
            <Button 
              variant={viewMode === "grid" ? "secondary" : "ghost"} 
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "secondary" : "ghost"} 
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className={`px-4 py-6 ${viewMode === "grid" ? "grid grid-cols-2 gap-4" : "space-y-4"}`}>
          {products.map((product, index) => (
            viewMode === "grid" ? (
              <div key={index} className="group">
                <div className="relative mb-2">
                  <WireframePlaceholder aspectRatio="portrait" className="rounded-lg" label="Product" />
                  {product.badge && (
                    <Badge 
                      className={`absolute top-2 left-2 text-[10px] ${
                        product.badge === "Best Seller" 
                          ? "bg-foreground text-background" 
                          : product.badge === "New"
                          ? "bg-amber-600 text-white"
                          : "bg-purple-600 text-white"
                      }`}
                    >
                      {product.badge}
                    </Badge>
                  )}
                </div>
                <h3 className="font-medium text-sm truncate">{product.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{product.artist}</p>
                <p className="text-sm font-semibold mt-1">{product.price}</p>
              </div>
            ) : (
              <div key={index} className="flex gap-4 p-3 border rounded-lg">
                <WireframePlaceholder aspectRatio="square" className="w-24 h-24 rounded-lg flex-shrink-0" label="" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">{product.artist}</p>
                  <p className="text-lg font-semibold mt-2">{product.price}</p>
                  {product.badge && (
                    <Badge className="mt-1 text-[10px]" variant="secondary">
                      {product.badge}
                    </Badge>
                  )}
                </div>
              </div>
            )
          ))}
        </div>

        {/* Load More */}
        <div className="px-4">
          <Button variant="outline" className="w-full">
            Load More
          </Button>
        </div>
      </main>

      <MobileFooter />
    </div>
  );
}
