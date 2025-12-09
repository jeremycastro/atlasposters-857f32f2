import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search, Heart, ShoppingCart, User, Star, Truck, Shield, RotateCcw, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=1400&h=500&fit=crop",
    title: "Abstract Art",
    subtitle: "Bold & Modern Pieces",
    cta: "Shop Now",
  },
  {
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1400&h=500&fit=crop",
    title: "Classic Masterpieces",
    subtitle: "Museum Quality Prints",
    cta: "Explore Collection",
  },
  {
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1400&h=500&fit=crop",
    title: "Photography",
    subtitle: "Stunning Landscapes",
    cta: "View Gallery",
  },
];

const categories = [
  { name: "Abstract Art", image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop" },
  { name: "Pop Art", image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&h=400&fit=crop" },
  { name: "Modern Art", image: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&h=400&fit=crop" },
  { name: "Vintage Art", image: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=400&h=400&fit=crop" },
  { name: "Photography", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop" },
  { name: "Country Art", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=400&fit=crop" },
  { name: "Drawing Art", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop" },
  { name: "Cultural Art", image: "https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=400&h=400&fit=crop" },
];

const roomCategories = [
  { name: "Living Room", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop" },
  { name: "Bedroom", image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=300&fit=crop" },
  { name: "Office", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" },
  { name: "Kitchen", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop" },
];

const featuredProducts = [
  { title: "Sunset Over Mountains", artist: "Nature Photography", price: 89, rating: 4.8, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=300&fit=crop" },
  { title: "Abstract Composition", artist: "Modern Masters", price: 129, rating: 4.9, image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop" },
  { title: "City Skyline", artist: "Urban Views", price: 99, rating: 4.7, image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=300&h=300&fit=crop" },
  { title: "Floral Arrangement", artist: "Botanical Art", price: 79, rating: 4.6, image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=300&fit=crop" },
];

export default function WireframeHome06() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);

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
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">Free Shipping on Orders $99+</span>
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
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">framed<span className="text-red-600">art</span></span>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl hidden md:block">
              <div className="relative">
                <Input 
                  placeholder="Search for art..." 
                  className="pl-4 pr-10 py-2 border-gray-300"
                />
                <Button size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 h-7 w-7 p-0">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="flex flex-col items-center text-gray-600 hover:text-red-600">
                <Heart className="h-5 w-5" />
                <span className="text-xs mt-0.5 hidden sm:inline">Favorites</span>
              </button>
              <button className="flex flex-col items-center text-gray-600 hover:text-red-600">
                <User className="h-5 w-5" />
                <span className="text-xs mt-0.5 hidden sm:inline">Account</span>
              </button>
              <button className="flex flex-col items-center text-gray-600 hover:text-red-600 relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="text-xs mt-0.5 hidden sm:inline">Cart</span>
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-gray-50 border-t">
          <div className="container mx-auto px-4">
            <ul className="flex items-center gap-8 py-3 text-sm font-medium overflow-x-auto">
              <li><Link to="#" className="text-gray-700 hover:text-red-600 whitespace-nowrap">Rooms</Link></li>
              <li><Link to="#" className="text-gray-700 hover:text-red-600 whitespace-nowrap">Styles</Link></li>
              <li><Link to="#" className="text-gray-700 hover:text-red-600 whitespace-nowrap">Subjects</Link></li>
              <li><Link to="#" className="text-gray-700 hover:text-red-600 whitespace-nowrap">Inspiration</Link></li>
              <li><Link to="#" className="text-gray-700 hover:text-red-600 whitespace-nowrap">Custom Framing</Link></li>
              <li><Link to="#" className="text-gray-700 hover:text-red-600 whitespace-nowrap">Sale</Link></li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Hero Carousel */}
      <section className="relative">
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img 
                src={slide.image} 
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div className="text-white">
                  <h2 className="text-4xl md:text-6xl font-bold mb-2">{slide.title}</h2>
                  <p className="text-xl md:text-2xl mb-6">{slide.subtitle}</p>
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                    {slide.cta}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-red-600" : "bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-gray-50 border-y py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <Truck className="h-5 w-5 text-red-600" />
              <span className="text-sm">Free Shipping $99+</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <Shield className="h-5 w-5 text-red-600" />
              <span className="text-sm">Satisfaction Guaranteed</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <RotateCcw className="h-5 w-5 text-red-600" />
              <span className="text-sm">30-Day Returns</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <Star className="h-5 w-5 text-red-600" />
              <span className="text-sm">74K+ 5-Star Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Style Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Framed Wall Art for Any Style
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                to="/wireframes/examples/06/collection"
                className="group relative aspect-square overflow-hidden rounded-lg"
              >
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Room */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Shop by Room
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {roomCategories.map((room) => (
              <Link 
                key={room.name} 
                to="/wireframes/examples/06/collection"
                className="group relative aspect-[4/3] overflow-hidden rounded-lg"
              >
                <img 
                  src={room.image} 
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white font-bold text-xl">{room.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Customer Favorites
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link 
                key={product.title} 
                to="/wireframes/examples/06/product"
                className="group"
              >
                <div className="aspect-square overflow-hidden rounded-lg mb-3 bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">{product.title}</h3>
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
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-red-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Join Our Newsletter
          </h2>
          <p className="text-red-100 mb-6 max-w-md mx-auto">
            Get exclusive offers, new arrivals, and design inspiration delivered to your inbox.
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white border-0"
            />
            <Button className="bg-gray-900 hover:bg-gray-800 text-white">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="#" className="hover:text-white">New Arrivals</Link></li>
                <li><Link to="#" className="hover:text-white">Best Sellers</Link></li>
                <li><Link to="#" className="hover:text-white">Sale</Link></li>
                <li><Link to="#" className="hover:text-white">Gift Cards</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="#" className="hover:text-white">Abstract</Link></li>
                <li><Link to="#" className="hover:text-white">Photography</Link></li>
                <li><Link to="#" className="hover:text-white">Modern</Link></li>
                <li><Link to="#" className="hover:text-white">Vintage</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Help</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="#" className="hover:text-white">FAQ</Link></li>
                <li><Link to="#" className="hover:text-white">Shipping</Link></li>
                <li><Link to="#" className="hover:text-white">Returns</Link></li>
                <li><Link to="#" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">About</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="#" className="hover:text-white">Our Story</Link></li>
                <li><Link to="#" className="hover:text-white">Artists</Link></li>
                <li><Link to="#" className="hover:text-white">Reviews</Link></li>
                <li><Link to="#" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© 2024 FramedArt Wireframe. For demonstration purposes only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
