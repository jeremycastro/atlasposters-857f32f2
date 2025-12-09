import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, ShoppingBag, ChevronRight, Minus, Plus, Check, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const productImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=1000&fit=crop",
];

const sizes = [
  { label: "21x30 cm", price: 12.00, originalPrice: 20.00 },
  { label: "30x40 cm", price: 17.97, originalPrice: 29.95 },
  { label: "40x50 cm", price: 23.97, originalPrice: 39.95 },
  { label: "50x70 cm", price: 29.97, originalPrice: 49.95 },
  { label: "70x100 cm", price: 47.97, originalPrice: 79.95 },
];

const frames = [
  { label: "No frame", price: 0 },
  { label: "Black", price: 14.95 },
  { label: "White", price: 14.95 },
  { label: "Natural Oak", price: 19.95 },
  { label: "Walnut", price: 19.95 },
];

const relatedProducts = [
  { id: 1, title: "Coastal Breeze", price: 17.97, originalPrice: 29.95, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=500&fit=crop", badge: "40%" },
  { id: 2, title: "Nordic Minimalism", price: 17.97, originalPrice: 29.95, image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=500&fit=crop", badge: "40%" },
  { id: 3, title: "Urban Geometry", price: 35.95, image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=500&fit=crop", badge: "NEW" },
  { id: 4, title: "Botanical Garden", price: 12, originalPrice: 20, image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=500&fit=crop", badge: "40%" },
];

export function WireframeProduct() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(1);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const currentSize = sizes[selectedSize];
  const currentFrame = frames[selectedFrame];
  const totalPrice = (currentSize.price + currentFrame.price) * quantity;
  const originalTotal = currentSize.originalPrice 
    ? (currentSize.originalPrice + currentFrame.price) * quantity 
    : null;

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
          <Link to="/wireframes-03/collection" className="hover:text-foreground">Nature</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/wireframes-03/collection" className="hover:text-foreground">Mountains</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Alpine Spirit Print</span>
        </nav>
      </div>

      {/* Product Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-muted overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt="Alpine Spirit Print"
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-red-600 text-white text-lg px-3 py-1">
                40%
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className={`absolute top-4 right-4 h-10 w-10 bg-white/80 hover:bg-white ${
                  isWishlisted ? "text-red-500" : ""
                }`}
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>
            </div>
            <div className="flex gap-4">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square w-20 overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? "border-foreground" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">NATURE / MOUNTAINS</p>
              <h1 className="text-3xl font-medium mb-3">Alpine Spirit Print</h1>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-medium">${totalPrice.toFixed(2)}</span>
                {originalTotal && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${originalTotal.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <p className="font-medium mb-3">Size</p>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size, idx) => (
                  <button
                    key={size.label}
                    onClick={() => setSelectedSize(idx)}
                    className={`relative p-3 text-sm border rounded transition-colors ${
                      selectedSize === idx
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    <span className="block font-medium">{size.label}</span>
                    <span className="block text-xs opacity-70">
                      ${size.price.toFixed(2)}
                      {size.originalPrice && (
                        <span className="line-through ml-1">${size.originalPrice.toFixed(2)}</span>
                      )}
                    </span>
                    {selectedSize === idx && (
                      <Check className="absolute top-2 right-2 h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Selection */}
            <div>
              <p className="font-medium mb-3">Frame</p>
              <div className="grid grid-cols-3 gap-2">
                {frames.map((frame, idx) => (
                  <button
                    key={frame.label}
                    onClick={() => setSelectedFrame(idx)}
                    className={`relative p-3 text-sm border rounded transition-colors ${
                      selectedFrame === idx
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    <span className="block font-medium">{frame.label}</span>
                    <span className="block text-xs opacity-70">
                      {frame.price === 0 ? "Included" : `+$${frame.price.toFixed(2)}`}
                    </span>
                    {selectedFrame === idx && (
                      <Check className="absolute top-2 right-2 h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="font-medium mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <Button className="w-full h-14 text-lg bg-foreground text-background hover:bg-foreground/90">
              ADD TO CART — ${totalPrice.toFixed(2)}
            </Button>

            {/* Product Details */}
            <div className="pt-6 border-t border-border space-y-4">
              <div>
                <h3 className="font-medium mb-2">About this print</h3>
                <p className="text-sm text-muted-foreground">
                  This stunning mountain landscape captures the serene beauty of alpine peaks 
                  at golden hour. The warm light creates a dreamy atmosphere that brings a 
                  sense of calm and adventure to any space.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Details</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Premium 200 gsm paper</li>
                  <li>• Archival quality inks</li>
                  <li>• Printed to order</li>
                  <li>• Free shipping over $69</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-medium mb-8">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
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
                </div>
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
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white py-12">
        <div className="container mx-auto px-4 text-center text-sm text-white/50">
          © 2024 Atlas Posters. Wireframe concept inspired by Desenio.
        </div>
      </footer>
    </div>
  );
}
