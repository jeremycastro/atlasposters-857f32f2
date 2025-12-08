import { Link } from "react-router-dom";
import { ArrowRight, Search, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "Abstract", image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop" },
  { name: "Photography", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop" },
  { name: "Illustration", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop" },
  { name: "Line Art", image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=500&fit=crop" },
];

const featuredArtists = [
  { name: "Sofia Lind", works: 24, image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=300&h=400&fit=crop" },
  { name: "Malene Birger", works: 18, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=400&fit=crop" },
  { name: "Leise Dich", works: 31, image: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=300&h=400&fit=crop" },
];

const newArrivals = [
  { title: "Serene Horizon", artist: "Emma Larsson", price: "€49", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop" },
  { title: "Abstract Form III", artist: "Karl Nielsen", price: "€65", image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&h=500&fit=crop" },
  { title: "Botanical Study", artist: "Mia Berg", price: "€42", image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=500&fit=crop" },
  { title: "Urban Lines", artist: "Oscar Holm", price: "€55", image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&h=500&fit=crop" },
];

export function WireframeHome() {
  return (
    <div className="min-h-screen bg-[#2a2a2a] text-white">
      {/* Announcement Bar */}
      <div className="bg-[#1a1a1a] text-center py-2 text-sm">
        <span className="text-white/80">Free shipping on orders over €100</span>
      </div>

      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/wireframes-02/collection" className="text-sm uppercase tracking-wider hover:text-white/70">
              Art Prints
            </Link>
            <Link to="/wireframes-02/collection" className="text-sm uppercase tracking-wider hover:text-white/70">
              Frames
            </Link>
            <Link to="/wireframes-02/collection" className="text-sm uppercase tracking-wider hover:text-white/70">
              Artists
            </Link>
            <Link to="/wireframes-02" className="text-sm uppercase tracking-wider hover:text-white/70">
              Inspiration
            </Link>
          </div>
          
          <Link to="/wireframes-02" className="text-2xl font-serif italic">
            atlas studio
          </Link>
          
          <div className="flex items-center gap-4">
            <button className="hover:text-white/70">
              <Search className="h-5 w-5" />
            </button>
            <button className="hover:text-white/70">
              <Heart className="h-5 w-5" />
            </button>
            <button className="hover:text-white/70">
              <ShoppingBag className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Bleed */}
      <section className="relative h-[90vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop"
          alt="Curated interior with art"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-2xl px-6">
            <h1 className="text-5xl md:text-7xl font-serif italic mb-6">
              Real art. By real artists.
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Explore our curated collection
            </p>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white text-black hover:bg-white/90 border-white rounded-none px-12"
            >
              SHOP NOW
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-[#f5f3f0] text-[#2a2a2a]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif italic text-center mb-12">Shop by style</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to="/wireframes-02/collection"
                className="group relative aspect-[4/5] overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xl font-serif italic">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-white text-[#2a2a2a]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-serif italic">New arrivals</h2>
            <Link to="/wireframes-02/collection" className="flex items-center gap-2 text-sm uppercase tracking-wider hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
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

      {/* Featured Artists */}
      <section className="py-20 bg-[#2a2a2a]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif italic text-center mb-12 text-white">Featured artists</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredArtists.map((artist) => (
              <Link
                key={artist.name}
                to="/wireframes-02/collection"
                className="group text-center"
              >
                <div className="aspect-[3/4] overflow-hidden mb-6">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="text-xl font-serif italic text-white mb-1">{artist.name}</h3>
                <p className="text-white/60 text-sm">{artist.works} works</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 bg-[#f5f3f0] text-[#2a2a2a]">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-serif italic mb-8">
            Art that transforms spaces
          </h2>
          <p className="text-lg text-[#666] mb-8 leading-relaxed">
            We believe that art should be accessible to everyone. Our carefully curated 
            collection features works from emerging and established artists, designed 
            to bring beauty and meaning into your everyday life.
          </p>
          <Button 
            variant="outline" 
            className="rounded-none border-[#2a2a2a] text-[#2a2a2a] hover:bg-[#2a2a2a] hover:text-white px-8"
          >
            Our Story
          </Button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-[#2a2a2a] border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-serif italic text-white mb-4">Join our world</h3>
          <p className="text-white/60 mb-6">Get 10% off your first order</p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 bg-transparent border border-white/30 text-white placeholder:text-white/40 focus:outline-none focus:border-white"
            />
            <Button className="rounded-none bg-white text-[#2a2a2a] hover:bg-white/90 px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#1a1a1a] text-white/60">
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
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Help</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Shipping</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Follow</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">Pinterest</a></li>
                <li><a href="#" className="hover:text-white">Facebook</a></li>
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
