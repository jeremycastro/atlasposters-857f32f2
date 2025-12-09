import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Heart, ShoppingCart, User, Search, Star, Truck, Shield, RotateCcw, Minus, Plus, Check, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const productImages = [
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop&sat=-100",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop",
];

const sizes = [
  { name: "Small", dimensions: "8\" x 10\"", price: 49 },
  { name: "Medium", dimensions: "16\" x 20\"", price: 89 },
  { name: "Large", dimensions: "24\" x 30\"", price: 149 },
  { name: "XL", dimensions: "30\" x 40\"", price: 199 },
];

const frames = [
  { name: "No Frame", color: "bg-gray-200", price: 0 },
  { name: "Black", color: "bg-gray-900", price: 35 },
  { name: "White", color: "bg-white border", price: 35 },
  { name: "Natural Wood", color: "bg-amber-600", price: 45 },
  { name: "Walnut", color: "bg-amber-900", price: 55 },
];

const reviews = [
  { name: "Sarah M.", rating: 5, text: "Beautiful quality! The colors are vibrant and the frame is sturdy. Love it!", date: "2 weeks ago" },
  { name: "Michael R.", rating: 5, text: "Fast shipping and great packaging. The print looks amazing in my living room.", date: "1 month ago" },
  { name: "Jennifer L.", rating: 4, text: "Great product, just wish there were more size options.", date: "1 month ago" },
];

const relatedProducts = [
  { title: "Ocean Waves", price: 79, image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&h=300&fit=crop" },
  { title: "Mountain Peak", price: 89, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=300&fit=crop" },
  { title: "City Lights", price: 99, image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=300&h=300&fit=crop" },
  { title: "Forest Path", price: 69, image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&h=300&fit=crop" },
];

export default function WireframeProduct06() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(1);
  const [selectedFrame, setSelectedFrame] = useState(1);
  const [quantity, setQuantity] = useState(1);

  const totalPrice = sizes[selectedSize].price + frames[selectedFrame].price;

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
              <button className="flex flex-col items-center text-gray-600 hover:text-red-600">
                <Heart className="h-5 w-5" />
              </button>
              <button className="flex flex-col items-center text-gray-600 hover:text-red-600">
                <User className="h-5 w-5" />
              </button>
              <button className="flex flex-col items-center text-gray-600 hover:text-red-600 relative">
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
            <Link to="/wireframes/examples/06/collection" className="hover:text-red-600">Abstract Art</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">Abstract Composition #42</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={productImages[selectedImage]} 
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-3">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      idx === selectedImage ? "border-red-600" : "border-gray-200"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Abstract Composition #42</h1>
                <p className="text-gray-500">By Modern Masters Collection</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(127 reviews)</span>
                </div>
              </div>

              <div className="text-3xl font-bold text-red-600">
                ${totalPrice * quantity}
                <span className="text-lg text-gray-400 font-normal ml-2">
                  (${totalPrice} each)
                </span>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Select Size</h3>
                <div className="grid grid-cols-2 gap-3">
                  {sizes.map((size, idx) => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(idx)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        idx === selectedSize 
                          ? "border-red-600 bg-red-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-medium text-gray-900">{size.name}</div>
                      <div className="text-sm text-gray-500">{size.dimensions}</div>
                      <div className="text-sm font-semibold text-red-600">${size.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Selection */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Select Frame</h3>
                <div className="flex flex-wrap gap-3">
                  {frames.map((frame, idx) => (
                    <button
                      key={frame.name}
                      onClick={() => setSelectedFrame(idx)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        idx === selectedFrame 
                          ? "border-red-600 bg-red-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded ${frame.color}`} />
                      <span className="text-sm">{frame.name}</span>
                      {frame.price > 0 && (
                        <span className="text-xs text-gray-500">+${frame.price}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button size="lg" className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Trust */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <Truck className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-xs text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-xs text-gray-600">30-Day Returns</p>
                </div>
                <div className="text-center">
                  <Shield className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-xs text-gray-600">Satisfaction Guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-700 mb-3">{review.text}</p>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-500">Verified Purchase - {review.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <Link key={product.title} to="/wireframes/examples/06/product" className="group">
                <div className="aspect-square overflow-hidden rounded-lg mb-3 bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-red-600">{product.title}</h3>
                <p className="text-red-600 font-semibold">${product.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2024 FramedArt Wireframe. For demonstration purposes only.</p>
        </div>
      </footer>
    </div>
  );
}
