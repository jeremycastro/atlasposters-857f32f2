import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Grid3X3, LayoutGrid, Search, Heart, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const products = [
  { id: 1, title: "Serene Horizon", artist: "Emma Larsson", price: "€49", image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop", category: "Abstract" },
  { id: 2, title: "Quiet Morning", artist: "Sofia Lind", price: "€55", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", category: "Photography" },
  { id: 3, title: "Abstract Flow", artist: "Karl Nielsen", price: "€42", image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&h=500&fit=crop", category: "Abstract" },
  { id: 4, title: "Line Study II", artist: "Emma Berg", price: "€65", image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=450&fit=crop", category: "Line Art" },
  { id: 5, title: "Nordic Light", artist: "Oscar Holm", price: "€79", image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&h=550&fit=crop", category: "Photography" },
  { id: 6, title: "Form Study", artist: "Mia Berg", price: "€45", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop", category: "Abstract" },
  { id: 7, title: "Botanical I", artist: "Lisa Nord", price: "€52", image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=600&fit=crop", category: "Botanical" },
  { id: 8, title: "Urban Lines", artist: "Karl Nielsen", price: "€68", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop", category: "Photography" },
  { id: 9, title: "Soft Forms", artist: "Emma Larsson", price: "€55", image: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=400&h=550&fit=crop", category: "Abstract" },
  { id: 10, title: "Coastal", artist: "Oscar Holm", price: "€72", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=500&fit=crop", category: "Photography" },
  { id: 11, title: "Gesture III", artist: "Sofia Lind", price: "€48", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=600&fit=crop", category: "Line Art" },
  { id: 12, title: "Still Life", artist: "Mia Berg", price: "€58", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop", category: "Photography" },
];

const filters = [
  { name: "Style", options: ["Abstract", "Photography", "Line Art", "Botanical", "Illustration"] },
  { name: "Artist", options: ["Emma Larsson", "Sofia Lind", "Karl Nielsen", "Oscar Holm", "Mia Berg"] },
  { name: "Size", options: ["21x30 cm", "30x40 cm", "50x70 cm", "70x100 cm"] },
  { name: "Price", options: ["Under €50", "€50 - €100", "Over €100"] },
];

export function WireframeCollection() {
  const [showFilters, setShowFilters] = useState(false);
  const [gridSize, setGridSize] = useState<"large" | "small">("large");

  return (
    <div className="min-h-screen bg-white text-[#2a2a2a]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white">
        {/* Announcement Bar */}
        <div className="bg-[#2a2a2a] text-white text-center py-2 text-sm">
          <span className="text-white/80">Free shipping on orders over €100</span>
        </div>

        {/* Navigation */}
        <nav className="border-b border-[#e5e5e5]">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/wireframes-02/collection" className="text-sm uppercase tracking-wider text-[#2a2a2a] font-medium">
              Art Prints
            </Link>
            <Link to="/wireframes-02/collection" className="text-sm uppercase tracking-wider text-[#666] hover:text-[#2a2a2a]">
              Frames
            </Link>
            <Link to="/wireframes-02/collection" className="text-sm uppercase tracking-wider text-[#666] hover:text-[#2a2a2a]">
              Artists
            </Link>
          </div>
          
          <Link to="/wireframes-02" className="text-2xl font-serif italic text-[#2a2a2a]">
            atlas studio
          </Link>
          
          <div className="flex items-center gap-4 text-[#666]">
            <button className="hover:text-[#2a2a2a]">
              <Search className="h-5 w-5" />
            </button>
            <button className="hover:text-[#2a2a2a]">
              <Heart className="h-5 w-5" />
            </button>
            <button className="hover:text-[#2a2a2a]">
              <ShoppingBag className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-[#666]">
          <Link to="/wireframes-02" className="hover:text-[#2a2a2a]">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#2a2a2a]">Art Prints</span>
        </nav>
      </div>

      {/* Category Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-serif italic mb-4">Art Prints</h1>
          <p className="text-[#666] leading-relaxed">
            Discover our curated collection of art prints from emerging and established artists. 
            Each piece is carefully selected to bring beauty and meaning into your space.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-0 bg-white border-y border-[#e5e5e5] z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm uppercase tracking-wider hover:text-[#666]"
            >
              {showFilters ? <X className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              Filters
            </button>
            <span className="text-sm text-[#666]">{products.length} products</span>
          </div>

          <div className="flex items-center gap-4">
            <select className="text-sm bg-transparent border-none focus:outline-none cursor-pointer">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
            <div className="flex items-center gap-2 border-l border-[#e5e5e5] pl-4">
              <button
                onClick={() => setGridSize("large")}
                className={gridSize === "large" ? "text-[#2a2a2a]" : "text-[#999]"}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setGridSize("small")}
                className={gridSize === "small" ? "text-[#2a2a2a]" : "text-[#999]"}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t border-[#e5e5e5] bg-[#fafafa]">
            <div className="container mx-auto px-6 py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {filters.map((filter) => (
                  <div key={filter.name}>
                    <h4 className="text-sm uppercase tracking-wider mb-3">{filter.name}</h4>
                    <ul className="space-y-2">
                      {filter.options.map((option) => (
                        <li key={option}>
                          <label className="flex items-center gap-2 text-sm text-[#666] hover:text-[#2a2a2a] cursor-pointer">
                            <input type="checkbox" className="rounded border-[#ccc]" />
                            {option}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Grid - Masonry Style */}
      <div className="container mx-auto px-6 py-12">
        <div className={`grid gap-6 ${gridSize === "large" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-3 md:grid-cols-4"}`}>
          {products.map((product, index) => (
            <Link
              key={product.id}
              to="/wireframes-02/product"
              className="group"
            >
              <div 
                className="overflow-hidden bg-[#f5f3f0] mb-4"
                style={{ 
                  aspectRatio: index % 3 === 1 ? "4/6" : index % 3 === 2 ? "4/4.5" : "4/5"
                }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className={`${gridSize === "small" ? "text-sm" : ""}`}>
                <h3 className="font-medium mb-1 group-hover:underline">{product.title}</h3>
                <p className="text-[#666] text-sm mb-1">{product.artist}</p>
                <p className="text-sm">From {product.price}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" className="rounded-none border-[#2a2a2a] px-12">
            Load more
          </Button>
        </div>
      </div>

      {/* Category Description */}
      <section className="py-16 bg-[#f5f3f0]">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-2xl font-serif italic mb-6">Curated with care</h2>
          <p className="text-[#666] leading-relaxed">
            Our art prints are produced on museum-quality paper with archival inks, 
            ensuring your artwork will stand the test of time. Each piece is carefully 
            packaged and shipped with the utmost care to arrive in perfect condition.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#2a2a2a] text-white/60">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-white font-medium mb-4">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Art Prints</a></li>
                <li><a href="#" className="hover:text-white">Frames</a></li>
                <li><a href="#" className="hover:text-white">New Arrivals</a></li>
                <li><a href="#" className="hover:text-white">Best Sellers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">About</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Our Story</a></li>
                <li><a href="#" className="hover:text-white">Artists</a></li>
                <li><a href="#" className="hover:text-white">Sustainability</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Help</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Shipping</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Follow</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">Pinterest</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm">
            <p>© 2024 Atlas Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
