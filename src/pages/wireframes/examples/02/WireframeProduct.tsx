import { Link } from "react-router-dom";
import { ChevronRight, Heart, Minus, Plus, Search, ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const productImages = [
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800&h=1000&fit=crop",
];

const sizes = [
  { name: "21x30 cm", price: "€35" },
  { name: "30x40 cm", price: "€49" },
  { name: "50x70 cm", price: "€79" },
  { name: "70x100 cm", price: "€129" },
];

const frames = [
  { name: "No frame", price: "" },
  { name: "Black", price: "+€25" },
  { name: "White", price: "+€25" },
  { name: "Natural Oak", price: "+€35" },
];

const relatedProducts = [
  { title: "Quiet Morning", artist: "Sofia Lind", price: "€49", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop" },
  { title: "Abstract Flow", artist: "Karl Nielsen", price: "€55", image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&h=500&fit=crop" },
  { title: "Line Study II", artist: "Emma Berg", price: "€42", image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=500&fit=crop" },
  { title: "Nordic Light", artist: "Oscar Holm", price: "€65", image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&h=500&fit=crop" },
];

export function WireframeProduct() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(1);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [quantity, setQuantity] = useState(1);

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
            <Link to="/wireframes-02/collection" className="text-sm uppercase tracking-wider text-[#666] hover:text-[#2a2a2a]">
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
          <Link to="/wireframes-02/collection" className="hover:text-[#2a2a2a]">Abstract</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#2a2a2a]">Serene Horizon</span>
        </nav>
      </div>

      {/* Product Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-[#f5f3f0] overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt="Product"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-[4/5] bg-[#f5f3f0] overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-[#2a2a2a]" : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-8">
            <div>
              <p className="text-sm text-[#666] mb-2">Emma Larsson</p>
              <h1 className="text-3xl font-serif italic mb-4">Serene Horizon</h1>
              <p className="text-2xl">{sizes[selectedSize].price}</p>
            </div>

            <p className="text-[#666] leading-relaxed">
              A contemplative piece exploring the intersection of form and space. 
              This minimalist artwork brings a sense of calm and sophistication to any interior.
            </p>

            {/* Size Selection */}
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-4">Size</h3>
              <div className="grid grid-cols-2 gap-3">
                {sizes.map((size, index) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(index)}
                    className={`py-3 px-4 border text-sm transition-colors ${
                      selectedSize === index
                        ? "border-[#2a2a2a] bg-[#2a2a2a] text-white"
                        : "border-[#e5e5e5] hover:border-[#2a2a2a]"
                    }`}
                  >
                    {size.name} — {size.price}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Selection */}
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-4">Frame</h3>
              <div className="grid grid-cols-2 gap-3">
                {frames.map((frame, index) => (
                  <button
                    key={frame.name}
                    onClick={() => setSelectedFrame(index)}
                    className={`py-3 px-4 border text-sm transition-colors flex items-center justify-between ${
                      selectedFrame === index
                        ? "border-[#2a2a2a] bg-[#2a2a2a] text-white"
                        : "border-[#e5e5e5] hover:border-[#2a2a2a]"
                    }`}
                  >
                    <span>{frame.name}</span>
                    {frame.price && <span className="text-xs opacity-70">{frame.price}</span>}
                    {selectedFrame === index && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-4">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-[#e5e5e5] flex items-center justify-center hover:border-[#2a2a2a]"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-[#e5e5e5] flex items-center justify-center hover:border-[#2a2a2a]"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4">
              <Button className="flex-1 rounded-none bg-[#2a2a2a] hover:bg-[#1a1a1a] py-6">
                Add to Cart
              </Button>
              <Button variant="outline" size="icon" className="w-14 h-14 rounded-none border-[#e5e5e5]">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Product Info */}
            <div className="border-t border-[#e5e5e5] pt-8 space-y-4 text-sm text-[#666]">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5" />
                <span>In stock — Ships within 2-4 business days</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Free shipping on orders over €100</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5" />
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Artist Section */}
      <section className="py-16 bg-[#f5f3f0]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-square bg-[#e5e5e5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop"
                alt="Artist"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider text-[#666] mb-4">The Artist</p>
              <h2 className="text-3xl font-serif italic mb-6">Emma Larsson</h2>
              <p className="text-[#666] leading-relaxed mb-6">
                Based in Stockholm, Emma Larsson creates contemplative works that explore 
                the relationship between form and emotion. Her minimalist approach draws 
                inspiration from Scandinavian landscapes and architecture.
              </p>
              <Link 
                to="/wireframes-02/collection" 
                className="text-sm uppercase tracking-wider underline hover:no-underline"
              >
                View all works by Emma Larsson
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-serif italic mb-8">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <Link
                key={product.title}
                to="/wireframes-02/product"
                className="group"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#f5f3f0] mb-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-medium mb-1">{product.title}</h3>
                <p className="text-sm text-[#666] mb-1">{product.artist}</p>
                <p className="text-sm">From {product.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
