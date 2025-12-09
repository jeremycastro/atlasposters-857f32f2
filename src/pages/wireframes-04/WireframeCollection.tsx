import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, User, ShoppingBag, ChevronRight, ChevronDown, Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const products = [
  { id: 1, title: "Tokyo Nights", destination: "Japan", price: 45, image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=500&fit=crop", badge: "Best Seller" },
  { id: 2, title: "Mount Fuji", destination: "Japan", price: 45, image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400&h=500&fit=crop" },
  { id: 3, title: "Kyoto Gardens", destination: "Japan", price: 45, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=500&fit=crop" },
  { id: 4, title: "Osaka Castle", destination: "Japan", price: 45, image: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400&h=500&fit=crop" },
  { id: 5, title: "Shibuya Crossing", destination: "Japan", price: 45, image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&h=500&fit=crop", badge: "New" },
  { id: 6, title: "Nara Deer Park", destination: "Japan", price: 45, image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=500&fit=crop" },
  { id: 7, title: "Hiroshima Peace", destination: "Japan", price: 45, image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=500&fit=crop" },
  { id: 8, title: "Hakone Views", destination: "Japan", price: 45, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=500&fit=crop" },
];

const filters = [
  {
    name: "Region",
    options: ["Tokyo", "Kyoto", "Osaka", "Hokkaido", "Okinawa"],
  },
  {
    name: "Style",
    options: ["Vintage", "Modern", "Minimalist", "Illustrated"],
  },
  {
    name: "Size",
    options: ["A4", "A3", "A2", "A1", "A0"],
  },
  {
    name: "Price",
    options: ["Under €30", "€30 - €50", "€50 - €80", "Over €80"],
  },
];

export function WireframeCollection() {
  const [showFilters, setShowFilters] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const toggleFilter = (category: string, option: string) => {
    setSelectedFilters((prev) => {
      const current = prev[category] || [];
      if (current.includes(option)) {
        return { ...prev, [category]: current.filter((o) => o !== option) };
      }
      return { ...prev, [category]: [...current, option] };
    });
  };

  return (
    <div className="min-h-screen bg-[#1a2332]">
      {/* Promo Banner */}
      <div className="bg-amber-700 text-white text-center py-2 text-sm">
        <span className="font-medium">Buy three premium posters and get a fourth one FREE.</span>
        {" "}Use Code: FREE4x3
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1a2332] border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="icon" className="lg:hidden text-white">
                <Menu className="h-5 w-5" />
              </Button>
              <Link to="/wireframes-04" className="text-2xl font-serif text-white tracking-wide">
                STICK NO BILLS®
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/80">
              <Link to="/wireframes-04/collection" className="hover:text-white transition-colors">
                Best Sellers
              </Link>
              <Link to="/wireframes-04/collection" className="hover:text-white transition-colors">
                Posters
              </Link>
              <Link to="/wireframes-04/collection" className="hover:text-white transition-colors">
                Projects & Partners
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-white/50">
          <Link to="/wireframes-04" className="hover:text-white">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/wireframes-04/collection" className="hover:text-white">Destinations</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/wireframes-04/collection" className="hover:text-white">Asia</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white">Japan</span>
        </nav>
      </div>

      {/* Collection Header */}
      <div className="container mx-auto px-4 pb-8">
        <div className="relative aspect-[4/1] overflow-hidden rounded mb-8">
          <img
            src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&h=400&fit=crop"
            alt="Japan collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332]/90 via-[#1a2332]/60 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-8">
              <h1 className="text-5xl font-serif text-white mb-3">Japan</h1>
              <p className="text-white/80 max-w-lg">
                Explore our collection of vintage-inspired travel posters celebrating 
                the Land of the Rising Sun. From bustling Tokyo to serene Kyoto.
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 border-white/20 text-white hover:bg-white/10"
            >
              {showFilters ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              Filters
            </Button>
            <span className="text-sm text-white/50">{products.length} posters</span>
          </div>

          <Button variant="outline" size="sm" className="gap-2 border-white/20 text-white hover:bg-white/10">
            Sort by: Featured
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-64 flex-shrink-0">
              <div className="space-y-6">
                {filters.map((filter) => (
                  <div key={filter.name}>
                    <h3 className="font-medium text-white mb-3 flex items-center justify-between">
                      {filter.name}
                      <ChevronDown className="h-4 w-4 text-white/50" />
                    </h3>
                    <div className="space-y-2">
                      {filter.options.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 text-sm cursor-pointer text-white/60 hover:text-white"
                        >
                          <Checkbox
                            checked={selectedFilters[filter.name]?.includes(option) || false}
                            onCheckedChange={() => toggleFilter(filter.name, option)}
                            className="border-white/30 data-[state=checked]:bg-amber-700 data-[state=checked]:border-amber-700"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to="/wireframes-04/product"
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded mb-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-amber-700 text-white text-xs px-2 py-1 rounded">
                        {product.badge}
                      </span>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 h-8 w-8 bg-white/10 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="text-white font-medium text-sm mb-1">{product.title}</h3>
                  <p className="text-white/50 text-xs mb-1">{product.destination}</p>
                  <p className="text-amber-500 text-sm">From €{product.price}</p>
                </Link>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-[#1a2332]">
                Load more posters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1a2332] text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-4 text-center text-sm text-white/40">
          © 2024 Atlas Posters. Wireframe concept inspired by Stick No Bills.
        </div>
      </footer>
    </div>
  );
}
