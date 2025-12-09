import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  ShoppingBag, 
  Menu,
  X,
  Filter,
  ChevronDown,
  Grid3X3,
  LayoutGrid,
  Heart,
  SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WireframeCollection05() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "large">("grid");
  const [sortBy, setSortBy] = useState("featured");

  const products = [
    {
      id: 1,
      title: "Golden Gate Morning",
      artist: "Sarah Chen",
      price: 79,
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=800&fit=crop",
      tag: "Bestseller",
    },
    {
      id: 2,
      title: "Tokyo Nights",
      artist: "Kenji Tanaka",
      price: 95,
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=800&fit=crop",
      tag: "New",
    },
    {
      id: 3,
      title: "Alpine Serenity",
      artist: "Marco Rossi",
      price: 79,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop",
    },
    {
      id: 4,
      title: "Parisian Dreams",
      artist: "Claire Dubois",
      price: 85,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=800&fit=crop",
    },
    {
      id: 5,
      title: "Coastal Highway",
      artist: "Michael Torres",
      price: 89,
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=600&h=800&fit=crop",
    },
    {
      id: 6,
      title: "Nordic Fjords",
      artist: "Erik Larsen",
      price: 95,
      image: "https://images.unsplash.com/photo-1520769945061-0a448c463865?w=600&h=800&fit=crop",
    },
    {
      id: 7,
      title: "Desert Sunset",
      artist: "Anna Martinez",
      price: 75,
      image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&h=800&fit=crop",
    },
    {
      id: 8,
      title: "London Calling",
      artist: "James Wright",
      price: 85,
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=800&fit=crop",
    },
  ];

  const filters = {
    categories: ["Travel", "Nature", "Architecture", "Abstract", "Vintage"],
    sizes: ["Small (30×40)", "Medium (50×70)", "Large (70×100)"],
    priceRanges: ["Under $50", "$50 - $100", "$100 - $150", "Over $150"],
    colors: ["Warm", "Cool", "Neutral", "Vibrant", "Muted"],
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#faf9f7]/95 backdrop-blur-sm border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-neutral-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <Link to="/wireframes-05" className="text-lg tracking-tight font-light">
                <span className="font-medium">ATLAS</span> POSTERS
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/wireframes-05/collection" className="text-sm text-neutral-600 hover:text-neutral-900">
                Travel
              </Link>
              <Link to="/wireframes-05/collection" className="text-sm text-neutral-600 hover:text-neutral-900">
                Nature
              </Link>
              <Link to="/wireframes-05/collection" className="text-sm text-neutral-600 hover:text-neutral-900">
                Architecture
              </Link>
              <Link to="/wireframes-05/collection" className="text-sm text-amber-700 font-medium">
                All Prints
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-neutral-600">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-neutral-600 relative">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#1c1c1c] text-white text-[10px] rounded-full flex items-center justify-center">
                  2
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Collection Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <p className="text-sm text-amber-700 font-medium tracking-wider uppercase mb-3">
              124 Prints
            </p>
            <h1 className="text-3xl md:text-4xl font-light mb-4">All Art Prints</h1>
            <p className="text-neutral-600 leading-relaxed">
              Explore our complete collection of museum-quality prints. 
              From iconic travel destinations to serene nature scenes, 
              find the perfect piece for your space.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-14 z-40 bg-[#faf9f7] border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="gap-2 text-neutral-600"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
              
              {/* Quick Filters - Desktop */}
              <div className="hidden md:flex items-center gap-2">
                {filters.categories.slice(0, 4).map((cat) => (
                  <Button
                    key={cat}
                    variant="ghost"
                    size="sm"
                    className="text-neutral-600 hover:bg-neutral-100"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500 hidden sm:inline">Sort by:</span>
                <button className="flex items-center gap-1 text-sm font-medium">
                  Featured <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              {/* View Mode - Desktop */}
              <div className="hidden md:flex items-center border border-neutral-200 rounded-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-neutral-100" : ""}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("large")}
                  className={`p-2 ${viewMode === "large" ? "bg-neutral-100" : ""}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          {filtersOpen && (
            <aside className="hidden md:block w-64 shrink-0">
              <div className="sticky top-32 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Category</h3>
                  <div className="space-y-2">
                    {filters.categories.map((cat) => (
                      <label key={cat} className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                        <input type="checkbox" className="rounded border-neutral-300" />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Size</h3>
                  <div className="space-y-2">
                    {filters.sizes.map((size) => (
                      <label key={size} className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                        <input type="checkbox" className="rounded border-neutral-300" />
                        {size}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Price</h3>
                  <div className="space-y-2">
                    {filters.priceRanges.map((range) => (
                      <label key={range} className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                        <input type="checkbox" className="rounded border-neutral-300" />
                        {range}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Color Mood */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Color Mood</h3>
                  <div className="space-y-2">
                    {filters.colors.map((color) => (
                      <label key={color} className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                        <input type="checkbox" className="rounded border-neutral-300" />
                        {color}
                      </label>
                    ))}
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  Clear All
                </Button>
              </div>
            </aside>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            <div className={`grid gap-4 md:gap-6 ${
              viewMode === "large" 
                ? "grid-cols-1 sm:grid-cols-2" 
                : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}>
              {products.map((product) => (
                <Link
                  key={product.id}
                  to="/wireframes-05/product"
                  className="group"
                >
                  <div className="relative aspect-[3/4] bg-neutral-100 mb-4 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.tag && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-white text-xs font-medium">
                        {product.tag}
                      </span>
                    )}
                    <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="h-4 w-4" />
                    </button>
                    {/* Quick Add - on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" className="w-full bg-white text-[#1c1c1c] hover:bg-white/90">
                        Quick View
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm mb-1 group-hover:text-amber-700 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mb-1">by {product.artist}</p>
                  <p className="text-sm font-medium">From ${product.price}</p>
                </Link>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                Load More
              </Button>
              <p className="text-sm text-neutral-500 mt-3">
                Showing 8 of 124 prints
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filtersOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50">
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="font-medium">Filters</h2>
              <button onClick={() => setFiltersOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium mb-3">Category</h3>
                <div className="space-y-2">
                  {filters.categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                      <input type="checkbox" className="rounded border-neutral-300" />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>
              {/* More filters... */}
            </div>
            <div className="p-4 border-t border-neutral-200">
              <Button className="w-full bg-[#1c1c1c]" onClick={() => setFiltersOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#1c1c1c] text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-4 text-center text-sm text-white/40">
          © 2024 Atlas Posters. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
