import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, ShoppingBag, ChevronRight, ChevronDown, Grid, LayoutGrid, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const products = [
  { id: 1, title: "Alpine Spirit Print", category: "Mountains", price: 12, originalPrice: 20, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop", badge: "40%" },
  { id: 2, title: "Coastal Breeze", category: "Ocean", price: 17.97, originalPrice: 29.95, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=500&fit=crop", badge: "40%" },
  { id: 3, title: "Urban Geometry", category: "Architecture", price: 35.95, image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=500&fit=crop", badge: "NEW" },
  { id: 4, title: "Botanical Garden", category: "Plants", price: 12, originalPrice: 20, image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=500&fit=crop", badge: "40%" },
  { id: 5, title: "Nordic Minimalism", category: "Abstract", price: 17.97, originalPrice: 29.95, image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=500&fit=crop", badge: "40%" },
  { id: 6, title: "Mountain Peaks", category: "Mountains", price: 24.95, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=500&fit=crop" },
  { id: 7, title: "Sunset Waves", category: "Ocean", price: 12, originalPrice: 20, image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=500&fit=crop", badge: "40%" },
  { id: 8, title: "Forest Path", category: "Nature", price: 17.97, originalPrice: 29.95, image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=500&fit=crop", badge: "40%" },
  { id: 9, title: "City Lights", category: "Architecture", price: 23.97, originalPrice: 39.95, image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=500&fit=crop", badge: "40%" },
  { id: 10, title: "Desert Dunes", category: "Nature", price: 17.97, originalPrice: 29.95, image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=500&fit=crop", badge: "40%" },
  { id: 11, title: "Tropical Leaves", category: "Plants", price: 12, originalPrice: 20, image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=500&fit=crop", badge: "40%" },
  { id: 12, title: "Abstract Lines", category: "Abstract", price: 19.95, image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop", badge: "NEW" },
];

const filters = [
  {
    name: "Category",
    options: ["Mountains", "Ocean", "Architecture", "Plants", "Nature", "Abstract"],
  },
  {
    name: "Size",
    options: ["21x30 cm", "30x40 cm", "40x50 cm", "50x70 cm", "70x100 cm"],
  },
  {
    name: "Price",
    options: ["Under $15", "$15 - $25", "$25 - $40", "Over $40"],
  },
  {
    name: "Frame",
    options: ["No frame", "Black", "White", "Natural Oak", "Walnut"],
  },
];

export function WireframeCollection() {
  const [showFilters, setShowFilters] = useState(true);
  const [gridSize, setGridSize] = useState<"3" | "4">("4");
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
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Top Banner */}
      <div className="bg-[#1a1a1a] text-white text-center py-2 text-sm">
        FREE SHIPPING OVER $69 • WE OFFER FRAMING SERVICES • HAPPINESS GUARANTEE
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FAF9F7] border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <Link to="/wireframes-03" className="text-2xl font-bold tracking-tight">
                DESENIO
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
              <Link to="/wireframes-03/collection" className="hover:text-muted-foreground transition-colors">
                POSTERS & PRINTS
              </Link>
              <Link to="/wireframes-03/collection" className="hover:text-muted-foreground transition-colors">
                CANVAS ART
              </Link>
              <Link to="/wireframes-03/collection" className="hover:text-muted-foreground transition-colors">
                PICTURE FRAMES
              </Link>
              <Link to="/wireframes-03/collection" className="text-red-600">
                DEALS
              </Link>
              <Link to="/wireframes-03/collection" className="hover:text-muted-foreground transition-colors">
                NEW IN
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/wireframes-03" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/wireframes-03/collection" className="hover:text-foreground">Posters & Prints</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Nature</span>
        </nav>
      </div>

      {/* Category Header */}
      <div className="container mx-auto px-4 pb-6">
        <div className="relative aspect-[4/1] overflow-hidden rounded-sm mb-6">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=400&fit=crop"
            alt="Nature collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-8">
              <h1 className="text-4xl font-serif text-white mb-2">Nature</h1>
              <p className="text-white/80 max-w-md">
                Bring the outdoors in with our collection of stunning nature prints
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              {showFilters ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              Filters
            </Button>
            <span className="text-sm text-muted-foreground">{products.length} products</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant={gridSize === "3" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setGridSize("3")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={gridSize === "4" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setGridSize("4")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" size="sm" className="gap-2">
              Sort by: Recommended
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
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
                    <h3 className="font-medium mb-3 flex items-center justify-between">
                      {filter.name}
                      <ChevronDown className="h-4 w-4" />
                    </h3>
                    <div className="space-y-2">
                      {filter.options.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 text-sm cursor-pointer hover:text-foreground text-muted-foreground"
                        >
                          <Checkbox
                            checked={selectedFilters[filter.name]?.includes(option) || false}
                            onCheckedChange={() => toggleFilter(filter.name, option)}
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
            <div
              className={`grid gap-6 ${
                gridSize === "4"
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-2 md:grid-cols-3"
              }`}
            >
              {products.map((product) => (
                <Link
                  key={product.id}
                  to="/wireframes-03/product"
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm mb-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.badge && (
                      <Badge
                        className={`absolute top-3 left-3 ${
                          product.badge === "NEW" ? "bg-foreground text-background" : "bg-red-600 text-white"
                        }`}
                      >
                        {product.badge}
                      </Badge>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 h-8 w-8 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" className="w-full bg-white text-black hover:bg-white/90">
                        Quick View
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                  <h3 className="text-sm font-medium mb-1">{product.title}</h3>
                  <p className="text-sm">
                    From ${product.price.toFixed(2)}
                    {product.originalPrice && (
                      <span className="text-muted-foreground line-through ml-2">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </p>
                </Link>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">
                Load more products
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-medium mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link to="/wireframes-03/collection" className="hover:text-white">Posters & Prints</Link></li>
                <li><Link to="/wireframes-03/collection" className="hover:text-white">Canvas Art</Link></li>
                <li><Link to="/wireframes-03/collection" className="hover:text-white">Picture Frames</Link></li>
                <li><Link to="/wireframes-03/collection" className="hover:text-white">Gallery Walls</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">About</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white">Our Story</a></li>
                <li><a href="#" className="hover:text-white">Artists</a></li>
                <li><a href="#" className="hover:text-white">Sustainability</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Help</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Size Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Newsletter</h4>
              <p className="text-sm text-white/70 mb-4">
                Subscribe for inspiration and exclusive offers
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded text-sm"
                />
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  →
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-12 pt-8 text-center text-sm text-white/50">
            © 2024 Atlas Posters. Wireframe concept inspired by Desenio.
          </div>
        </div>
      </footer>
    </div>
  );
}
