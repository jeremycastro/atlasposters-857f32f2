import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Heart, ShoppingCart, User, Search, Star, Grid3X3, LayoutGrid, SlidersHorizontal, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const products = [
  { id: 1, title: "Abstract Waves", artist: "Modern Collection", price: 89, rating: 4.8, image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop" },
  { id: 2, title: "Color Splash", artist: "Contemporary Art", price: 79, rating: 4.6, image: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&h=400&fit=crop" },
  { id: 3, title: "Geometric Forms", artist: "Abstract Studio", price: 99, rating: 4.9, image: "https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=400&h=400&fit=crop" },
  { id: 4, title: "Flow Motion", artist: "Modern Masters", price: 119, rating: 4.7, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop" },
  { id: 5, title: "Urban Abstract", artist: "City Collection", price: 109, rating: 4.5, image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=400&fit=crop" },
  { id: 6, title: "Nature Forms", artist: "Organic Art", price: 89, rating: 4.8, image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop" },
  { id: 7, title: "Bold Strokes", artist: "Expression Art", price: 129, rating: 4.9, image: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=400&h=400&fit=crop" },
  { id: 8, title: "Calm Waters", artist: "Serenity Collection", price: 99, rating: 4.7, image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=400&fit=crop" },
];

const filters = {
  style: ["Abstract", "Modern", "Contemporary", "Minimalist"],
  size: ["Small (up to 16\")", "Medium (17\" - 24\")", "Large (25\" - 36\")", "Oversized (37\"+)"],
  color: ["Blue", "Red", "Green", "Neutral", "Multi-Color"],
  price: ["Under $50", "$50 - $100", "$100 - $200", "Over $200"],
};

export default function WireframeCollection06() {
  const [showFilters, setShowFilters] = useState(true);
  const [gridSize, setGridSize] = useState<"small" | "large">("large");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-gray-100 border-b text-sm">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4 text-gray-600">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              1-800-FRAMED
            </span>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <Link to="#" className="hover:text-red-600">Sign In</Link>
            <span>|</span>
            <Link to="#" className="hover:text-red-600">Create Account</Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b sticky top-[52px] z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            <Link to="/wireframes/examples/06/home" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">framed<span className="text-red-600">art</span></span>
            </Link>

            <div className="flex-1 max-w-xl hidden md:block">
              <div className="relative">
                <Input placeholder="Search for art..." className="pl-4 pr-10 py-2 border-gray-300" />
                <Button size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 h-7 w-7 p-0">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-red-600">
                <Heart className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-red-600">
                <User className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-red-600 relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/wireframes/examples/06/home" className="hover:text-red-600">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">Abstract Art</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <section className="py-8 bg-gradient-to-r from-gray-100 to-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Abstract Art</h1>
          <p className="text-gray-600 max-w-2xl">
            Explore our collection of stunning abstract art prints. From bold color splashes to 
            minimalist geometric forms, find the perfect piece to transform your space.
          </p>
        </div>
      </section>

      {/* Toolbar */}
      <div className="border-b sticky top-[120px] bg-white z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              <span className="text-sm text-gray-500">{products.length} products</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setGridSize("large")}
                  className={`p-1.5 rounded ${gridSize === "large" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setGridSize("small")}
                  className={`p-1.5 rounded ${gridSize === "small" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>
              <Select defaultValue="featured">
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {selectedFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedFilters.map(filter => (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded text-sm"
                >
                  {filter}
                  <X className="h-3 w-3" />
                </button>
              ))}
              <button 
                onClick={() => setSelectedFilters([])}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-64 shrink-0 hidden lg:block">
              <div className="space-y-6">
                {Object.entries(filters).map(([category, options]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-gray-900 mb-3 capitalize">{category}</h3>
                    <div className="space-y-2">
                      {options.map(option => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox 
                            checked={selectedFilters.includes(option)}
                            onCheckedChange={() => toggleFilter(option)}
                          />
                          <span className="text-sm text-gray-600">{option}</span>
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
            <div className={`grid gap-6 ${
              gridSize === "large" 
                ? "grid-cols-2 md:grid-cols-3" 
                : "grid-cols-3 md:grid-cols-4"
            }`}>
              {products.map((product) => (
                <Link 
                  key={product.id} 
                  to="/wireframes/examples/06/product"
                  className="group"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-3 bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-500">{product.artist}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs text-gray-600">{product.rating}</span>
                    </div>
                    <span className="text-red-600 font-semibold">${product.price}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Products
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2024 FramedArt Wireframe. For demonstration purposes only.</p>
        </div>
      </footer>
    </div>
  );
}
