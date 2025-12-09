import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  ShoppingBag, 
  Menu,
  Heart,
  Minus,
  Plus,
  Check,
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
  ChevronLeft,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WireframeProduct05() {
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [selectedFrame, setSelectedFrame] = useState("Unframed");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const sizes = [
    { name: "Small", dimensions: "30 × 40 cm", price: 49 },
    { name: "Medium", dimensions: "50 × 70 cm", price: 79 },
    { name: "Large", dimensions: "70 × 100 cm", price: 129 },
  ];

  const frames = [
    { name: "Unframed", price: 0 },
    { name: "Black Oak", price: 45 },
    { name: "Natural Oak", price: 45 },
    { name: "White", price: 40 },
  ];

  const images = [
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=1000&fit=crop",
  ];

  const relatedProducts = [
    {
      id: 1,
      title: "Brooklyn Bridge Dawn",
      artist: "Michael Torres",
      price: 79,
      image: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=400&h=500&fit=crop",
    },
    {
      id: 2,
      title: "Pacific Coast Highway",
      artist: "Sarah Chen",
      price: 89,
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=500&fit=crop",
    },
    {
      id: 3,
      title: "San Francisco Skyline",
      artist: "David Kim",
      price: 95,
      image: "https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=400&h=500&fit=crop",
    },
  ];

  const currentSize = sizes.find((s) => s.name === selectedSize);
  const currentFrame = frames.find((f) => f.name === selectedFrame);
  const totalPrice = (currentSize?.price || 0) + (currentFrame?.price || 0);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-[#faf9f7]/95 backdrop-blur-sm border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/wireframes-05" className="text-lg tracking-tight font-light">
              <span className="font-medium">ATLAS</span> POSTERS
            </Link>
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

      {/* Breadcrumb */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-neutral-500">
            <Link to="/wireframes-05" className="hover:text-neutral-900">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/wireframes-05/collection" className="hover:text-neutral-900">Travel</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-neutral-900">Golden Gate Morning</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/5] bg-neutral-100">
                <img
                  src={images[activeImage]}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
                {/* Navigation */}
                <button
                  onClick={() => setActiveImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setActiveImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                {/* Wishlist */}
                <button className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-20 h-24 flex-shrink-0 border-2 transition-colors ${
                      activeImage === index ? "border-[#1c1c1c]" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:py-4">
              {/* Title & Artist */}
              <div className="mb-6">
                <p className="text-sm text-amber-700 font-medium mb-2">Travel Collection</p>
                <h1 className="text-3xl md:text-4xl font-light mb-2">Golden Gate Morning</h1>
                <p className="text-neutral-500">
                  by <span className="text-neutral-900 font-medium">Sarah Chen</span>
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-neutral-500">4.9 (127 reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <span className="text-2xl font-medium">${totalPrice}</span>
                <span className="text-sm text-neutral-500 ml-2">
                  {selectedFrame !== "Unframed" && `(includes ${selectedFrame} frame)`}
                </span>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Size</label>
                  <button className="text-xs text-amber-700 hover:underline">Size guide</button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size.name)}
                      className={`p-3 border text-center transition-all ${
                        selectedSize === size.name
                          ? "border-[#1c1c1c] bg-[#1c1c1c] text-white"
                          : "border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      <span className="block text-sm font-medium">{size.name}</span>
                      <span className={`block text-xs mt-0.5 ${
                        selectedSize === size.name ? "text-white/70" : "text-neutral-500"
                      }`}>
                        {size.dimensions}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Selection */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Frame</label>
                <div className="grid grid-cols-2 gap-2">
                  {frames.map((frame) => (
                    <button
                      key={frame.name}
                      onClick={() => setSelectedFrame(frame.name)}
                      className={`p-3 border text-left transition-all ${
                        selectedFrame === frame.name
                          ? "border-[#1c1c1c] bg-[#1c1c1c] text-white"
                          : "border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      <span className="block text-sm font-medium">{frame.name}</span>
                      <span className={`block text-xs mt-0.5 ${
                        selectedFrame === frame.name ? "text-white/70" : "text-neutral-500"
                      }`}>
                        {frame.price === 0 ? "No frame" : `+$${frame.price}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <label className="text-sm font-medium mb-3 block">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-neutral-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-neutral-100 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-neutral-100 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex gap-3 mb-8">
                <Button className="flex-1 h-12 bg-[#1c1c1c] hover:bg-[#2c2c2c] text-white gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Add to Cart — ${totalPrice * quantity}
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 border-neutral-300">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Trust Points */}
              <div className="space-y-3 p-4 bg-white border border-neutral-200">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-4 w-4 text-amber-700" />
                  <span>Free shipping on orders over $75</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="h-4 w-4 text-amber-700" />
                  <span>30-day easy returns</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-amber-700" />
                  <span>Museum-quality, archival prints</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Story - Editorial Section */}
      <section className="py-16 bg-white border-t border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-amber-700 text-sm font-medium tracking-wider uppercase mb-4">
              About This Piece
            </p>
            <h2 className="text-2xl md:text-3xl font-light mb-6">
              Captured at dawn, this iconic view of the Golden Gate Bridge 
              emerges from the morning fog like a dream.
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-8">
              San Francisco-based photographer Sarah Chen spent weeks waiting for the 
              perfect morning conditions—low fog, golden light, and absolute stillness. 
              This image captures a rare moment of serenity in one of the world's most 
              photographed landmarks, revealing a perspective that feels both timeless 
              and intimately personal.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left border-t border-neutral-200 pt-8">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Print Quality</h3>
                <p className="text-sm text-neutral-600">Giclée print on 240gsm fine art paper with a subtle matte finish</p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Color Accuracy</h3>
                <p className="text-sm text-neutral-600">Professionally color-calibrated for true-to-original reproduction</p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Longevity</h3>
                <p className="text-sm text-neutral-600">Archival inks rated for 100+ years of fade-resistant display</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16 border-t border-neutral-200">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-light mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {relatedProducts.map((product) => (
              <Link
                key={product.id}
                to="/wireframes-05/product"
                className="group"
              >
                <div className="relative aspect-[4/5] bg-neutral-100 mb-4 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-medium text-sm mb-1 group-hover:text-amber-700 transition-colors">
                  {product.title}
                </h3>
                <p className="text-xs text-neutral-500 mb-1">by {product.artist}</p>
                <p className="text-sm font-medium">From ${product.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1c1c1c] text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-4 text-center text-sm text-white/40">
          © 2024 Atlas Posters. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
