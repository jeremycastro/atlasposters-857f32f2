import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, ShoppingBag, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categories = [
  { name: "Posters & Prints", image: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=400&h=500&fit=crop" },
  { name: "Canvas Art", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop" },
  { name: "Picture Frames", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop" },
  { name: "Gallery Walls", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop" },
];

const newArrivals = [
  { id: 1, title: "Alpine Spirit Print", price: 12, originalPrice: 20, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop", badge: "40%" },
  { id: 2, title: "Coastal Breeze", price: 17.97, originalPrice: 29.95, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=500&fit=crop", badge: "40%" },
  { id: 3, title: "Urban Geometry", price: 35.95, image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=500&fit=crop", badge: "NEW" },
  { id: 4, title: "Botanical Garden", price: 12, originalPrice: 20, image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=500&fit=crop", badge: "40%" },
  { id: 5, title: "Nordic Minimalism", price: 17.97, originalPrice: 29.95, image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=500&fit=crop", badge: "40%" },
  { id: 6, title: "Mountain Peaks", price: 24.95, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=500&fit=crop", badge: "NEW" },
];

const featuredCollections = [
  { title: "Bold Lines", image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop" },
  { title: "Famous Painters", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=400&fit=crop" },
  { title: "Featured Artists", image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&h=400&fit=crop" },
];

export function WireframeHome() {
  const [timeLeft, setTimeLeft] = useState({ minutes: 45, seconds: 23 });
  const [sliderPosition, setSliderPosition] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { minutes: 45, seconds: 23 }; // Reset for demo
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const slideLeft = () => setSliderPosition(Math.max(0, sliderPosition - 1));
  const slideRight = () => setSliderPosition(Math.min(newArrivals.length - 4, sliderPosition + 1));

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Top Banner */}
      <div className="bg-[#1a1a1a] text-white text-center py-2 text-sm">
        FREE SHIPPING OVER $69 • WE OFFER FRAMING SERVICES • HAPPINESS GUARANTEE
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FAF9F7] border-b border-border">
        {/* Sale Banner */}
        <div className="bg-[#FAF9F7] text-center py-3 border-b border-border">
          <p className="text-xl font-medium">40% OFF PRINTS*</p>
          <p className="text-sm text-muted-foreground">
            {timeLeft.minutes} min {timeLeft.seconds} s
          </p>
        </div>

        {/* Navigation */}
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
              <Link to="/wireframes-03/collection" className="text-red-600 hover:text-red-700 transition-colors">
                DEALS
              </Link>
              <Link to="/wireframes-03/collection" className="hover:text-muted-foreground transition-colors">
                NEW IN
              </Link>
              <Link to="/wireframes-03/collection" className="hover:text-muted-foreground transition-colors">
                BESTSELLERS
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

      {/* Hero Section */}
      <section className="relative">
        <div className="grid lg:grid-cols-2">
          <div className="relative aspect-[4/3] lg:aspect-auto">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop"
              alt="Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-sm tracking-widest mb-2">CREATE A COZY CABIN AMBIANCE</p>
              <h1 className="text-4xl lg:text-5xl font-serif mb-4">The Winter Collection</h1>
              <p className="text-sm opacity-80 mb-6 max-w-md">
                Bring winter home with art that creates a cozy mountain cabin atmosphere
              </p>
              <Button className="bg-white text-black hover:bg-white/90">
                EXPLORE COLLECTION
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800&h=800&fit=crop"
              alt="Featured art"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* New In Slider */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-medium">New in</h2>
            <Link to="/wireframes-03/collection" className="text-sm font-medium hover:underline">
              Show more →
            </Link>
          </div>

          <div className="relative">
            <div className="flex gap-4 overflow-hidden">
              {newArrivals.slice(sliderPosition, sliderPosition + 5).map((product) => (
                <Link
                  key={product.id}
                  to="/wireframes-03/product"
                  className="group flex-shrink-0 w-[calc(20%-13px)]"
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

            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg"
              onClick={slideLeft}
              disabled={sliderPosition === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg"
              onClick={slideRight}
              disabled={sliderPosition >= newArrivals.length - 4}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Category Banners */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {featuredCollections.map((collection) => (
              <Link
                key={collection.title}
                to="/wireframes-03/collection"
                className="group relative aspect-[3/2] overflow-hidden"
              >
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h3 className="text-2xl font-serif mb-3">{collection.title}</h3>
                  <span className="text-sm font-medium tracking-wider border-b border-white/60 pb-1">
                    EXPLORE NOW
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-medium mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to="/wireframes-03/collection"
                className="group"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-sm mb-3">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-sm font-medium text-center group-hover:underline">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Personalized Prints Banner */}
      <section className="py-16 bg-[#F5F0EA]">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-serif mb-4">Personalized Prints</h2>
          <p className="text-muted-foreground mb-6">
            Create your very own poster and make it unique! Our personalized prints include 
            beautiful designs where you can customize the print according to your style.
          </p>
          <Button className="bg-foreground text-background hover:bg-foreground/90">
            SHOP NOW
          </Button>
        </div>
      </section>

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
