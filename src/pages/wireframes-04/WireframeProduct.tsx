import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, User, ShoppingBag, ChevronRight, Heart, Minus, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const sizes = [
  { name: "A4", dimensions: "21 × 29.7 cm", price: 25 },
  { name: "A3", dimensions: "29.7 × 42 cm", price: 35 },
  { name: "A2", dimensions: "42 × 59.4 cm", price: 45 },
  { name: "A1", dimensions: "59.4 × 84.1 cm", price: 65 },
  { name: "A0", dimensions: "84.1 × 118.9 cm", price: 95 },
];

const frameOptions = [
  { name: "No Frame", price: 0 },
  { name: "Black", price: 35 },
  { name: "White", price: 35 },
  { name: "Natural Oak", price: 45 },
  { name: "Walnut", price: 55 },
];

const relatedPosters = [
  { id: 1, title: "Mount Fuji", destination: "Japan", price: 45, image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400&h=500&fit=crop" },
  { id: 2, title: "Kyoto Gardens", destination: "Japan", price: 45, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=500&fit=crop" },
  { id: 3, title: "Osaka Nights", destination: "Japan", price: 45, image: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400&h=500&fit=crop" },
  { id: 4, title: "Shibuya Crossing", destination: "Japan", price: 45, image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&h=500&fit=crop" },
];

export function WireframeProduct() {
  const [selectedSize, setSelectedSize] = useState(sizes[2]);
  const [selectedFrame, setSelectedFrame] = useState(frameOptions[0]);
  const [quantity, setQuantity] = useState(1);

  const totalPrice = (selectedSize.price + selectedFrame.price) * quantity;

  return (
    <div className="min-h-screen bg-[#1a2332]">
      {/* Promo Banner */}
      <div className="bg-amber-700 text-white text-center py-2 text-sm">
        <span className="font-medium">Free worldwide shipping for all orders over €70</span>
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
          <Link to="/wireframes-04/collection" className="hover:text-white">Asia</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/wireframes-04/collection" className="hover:text-white">Japan</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white">Tokyo Nights</span>
        </nav>
      </div>

      {/* Product Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-[3/4] rounded overflow-hidden bg-[#243044]">
              <img
                src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=1000&fit=crop"
                alt="Tokyo Nights"
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 bg-white/10 text-white hover:bg-white/20"
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Badge className="absolute top-4 left-4 bg-amber-700 text-white">
              Best Seller
            </Badge>
          </div>

          {/* Product Info */}
          <div className="text-white">
            <p className="text-amber-500 text-sm mb-2">Japan Collection</p>
            <h1 className="text-4xl font-serif mb-4">Tokyo Nights</h1>
            <p className="text-white/60 mb-8 leading-relaxed">
              A stunning vintage-style travel poster capturing the electric energy of Tokyo 
              after dark. Neon lights illuminate the bustling streets of Shinjuku, creating 
              a mesmerizing urban landscape that has captivated travelers for decades.
            </p>

            {/* Size Selection */}
            <div className="mb-8">
              <h3 className="font-medium mb-4">Select Size</h3>
              <div className="grid grid-cols-5 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 rounded border text-center transition-colors ${
                      selectedSize.name === size.name
                        ? "border-amber-600 bg-amber-700/20"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <p className="font-medium text-sm">{size.name}</p>
                    <p className="text-xs text-white/50">{size.dimensions}</p>
                    <p className="text-amber-500 text-sm mt-1">€{size.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Selection */}
            <div className="mb-8">
              <h3 className="font-medium mb-4">Frame Option</h3>
              <div className="flex flex-wrap gap-3">
                {frameOptions.map((frame) => (
                  <button
                    key={frame.name}
                    onClick={() => setSelectedFrame(frame)}
                    className={`px-4 py-2 rounded border transition-colors ${
                      selectedFrame.name === frame.name
                        ? "border-amber-600 bg-amber-700/20"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <span className="text-sm">{frame.name}</span>
                    {frame.price > 0 && (
                      <span className="text-amber-500 text-sm ml-2">+€{frame.price}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="font-medium mb-4">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-white/20 rounded">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-white/60">Total</span>
                <span className="text-3xl font-serif">€{totalPrice}</span>
              </div>
              <Button className="w-full bg-amber-700 hover:bg-amber-600 text-white py-6 text-lg">
                Add to Cart
              </Button>
              <p className="text-center text-white/50 text-sm mt-4">
                Free shipping on orders over €70 • 30-day returns
              </p>
            </div>

            {/* Product Details */}
            <div className="mt-12 space-y-6 border-t border-white/10 pt-8">
              <div>
                <h3 className="font-medium mb-2">About This Poster</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Officially licensed and printed on premium 250gsm archival matte paper 
                  using fade-resistant inks. Each poster is carefully packaged in a sturdy 
                  tube for safe delivery worldwide.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">The Artist</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Created in collaboration with local Japanese artists, this design 
                  captures the essence of Tokyo's vibrant nightlife while paying homage 
                  to classic travel poster aesthetics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posters */}
      <section className="bg-[#243044] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif text-white mb-8">More from Japan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedPosters.map((poster) => (
              <Link
                key={poster.id}
                to="/wireframes-04/product"
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded mb-3">
                  <img
                    src={poster.image}
                    alt={poster.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-white font-medium text-sm mb-1">{poster.title}</h3>
                <p className="text-white/50 text-xs mb-1">{poster.destination}</p>
                <p className="text-amber-500 text-sm">From €{poster.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a2332] text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-4 text-center text-sm text-white/40">
          © 2024 Atlas Posters. Wireframe concept inspired by Stick No Bills.
        </div>
      </footer>
    </div>
  );
}
