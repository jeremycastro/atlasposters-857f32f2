import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  ShoppingBag, 
  Menu, 
  X,
  ArrowRight,
  Shield,
  Truck,
  Award,
  Heart,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WireframeHome05() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { name: "Travel", count: 124 },
    { name: "Nature", count: 89 },
    { name: "Architecture", count: 67 },
    { name: "Abstract", count: 45 },
    { name: "Vintage", count: 156 },
  ];

  const featuredProducts = [
    {
      id: 1,
      title: "Golden Gate Morning",
      artist: "Sarah Chen",
      price: 89,
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=800&fit=crop",
      tag: "Bestseller",
    },
    {
      id: 2,
      title: "Tokyo Nights",
      artist: "Kenji Tanaka",
      price: 95,
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=800&fit=crop",
      tag: "New",
    },
    {
      id: 3,
      title: "Alpine Serenity",
      artist: "Marco Rossi",
      price: 79,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop",
    },
    {
      id: 4,
      title: "Parisian Dreams",
      artist: "Claire Dubois",
      price: 85,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=800&fit=crop",
    },
  ];

  const trustPoints = [
    { icon: Shield, label: "Museum-Quality Prints" },
    { icon: Truck, label: "Free Shipping Over $75" },
    { icon: Award, label: "Artist-Licensed Works" },
  ];

  const curatedCollections = [
    {
      title: "The Wanderer's Collection",
      description: "Curated for those who dream of distant places",
      image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&h=600&fit=crop",
      count: 24,
    },
    {
      title: "Urban Stories",
      description: "City life captured in timeless moments",
      image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop",
      count: 18,
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Trust Bar */}
      <div className="bg-[#1c1c1c] text-white py-2.5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 text-xs">
            {trustPoints.map((point) => (
              <div key={point.label} className="flex items-center gap-2">
                <point.icon className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-white/80">{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Header - Sticky */}
      <header className="sticky top-0 z-50 bg-[#faf9f7] border-b border-neutral-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/wireframes-05" className="text-xl tracking-tight font-light">
              <span className="font-medium">ATLAS</span> POSTERS
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat.name}
                  to="/wireframes-05/collection"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                to="/wireframes-05/collection"
                className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                All Prints
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-neutral-600">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-neutral-600 hidden sm:flex">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-neutral-600 relative">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#1c1c1c] text-white text-[10px] rounded-full flex items-center justify-center">
                  2
                </span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-neutral-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-[#faf9f7]">
            <nav className="container mx-auto px-4 py-4 space-y-3">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to="/wireframes-05/collection"
                  className="flex items-center justify-between py-2 text-neutral-600"
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-neutral-400">{cat.count}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Hero - Clean, Purpose-Driven */}
      <section className="relative bg-[#1c1c1c] text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=900&fit=crop"
            alt="Framed travel poster in stylish living room"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c1c] via-[#1c1c1c]/80 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-xl">
            <p className="text-amber-400 text-sm font-medium tracking-wider uppercase mb-4">
              Curated Art Prints
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6">
              Transform Your Space with
              <span className="block font-serif italic mt-2">Timeless Art</span>
            </h1>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Museum-quality prints from world-renowned artists, 
              delivered to your door with care and precision.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/wireframes-05/collection">
                <Button size="lg" className="bg-white text-[#1c1c1c] hover:bg-white/90 gap-2">
                  Shop Collection
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Our Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills - Quick Access */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm text-neutral-500 shrink-0">Browse:</span>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to="/wireframes-05/collection"
                className="shrink-0 px-4 py-1.5 rounded-full border border-neutral-200 text-sm text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Clean Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-light mb-2">Featured Prints</h2>
              <p className="text-neutral-500">Our most loved pieces this season</p>
            </div>
            <Link 
              to="/wireframes-05/collection"
              className="hidden sm:flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to="/wireframes-05/product"
                className="group"
              >
                <div className="relative aspect-[3/4] bg-neutral-100 mb-4 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.tag && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-white text-xs font-medium">
                      {product.tag}
                    </span>
                  )}
                  <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-medium text-sm mb-1 group-hover:text-amber-700 transition-colors">
                  {product.title}
                </h3>
                <p className="text-xs text-neutral-500 mb-1">by {product.artist}</p>
                <p className="text-sm font-medium">From ${product.price}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link to="/wireframes-05/collection">
              <Button variant="outline" className="gap-2">
                View All Prints <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Curated Collections - Editorial Style */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light mb-2">Curated Collections</h2>
            <p className="text-neutral-500">Thoughtfully grouped for your space</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {curatedCollections.map((collection) => (
              <Link
                key={collection.title}
                to="/wireframes-05/collection"
                className="group relative aspect-[4/3] overflow-hidden"
              >
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-xs uppercase tracking-wider mb-2 text-white/70">
                    {collection.count} prints
                  </p>
                  <h3 className="text-xl font-light mb-1">{collection.title}</h3>
                  <p className="text-sm text-white/70">{collection.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section - Editorial Depth */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=600&h=700&fit=crop"
                alt="Our craft"
                className="w-full"
              />
            </div>
            <div className="max-w-lg">
              <p className="text-amber-700 text-sm font-medium tracking-wider uppercase mb-4">
                Our Philosophy
              </p>
              <h2 className="text-3xl md:text-4xl font-light leading-tight mb-6">
                Every print tells a story worth sharing
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-6">
                We partner with artists worldwide to bring you prints that 
                do more than decorate—they inspire, provoke thought, and 
                transform the spaces where life happens.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-8">
                Each piece is produced using archival-quality materials 
                and sustainable practices, ensuring your art lasts for generations.
              </p>
              <Button variant="outline" className="gap-2">
                Learn More <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1c1c1c] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-medium mb-4">ATLAS POSTERS</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Curating exceptional art prints since 2019. 
                Making museum-quality accessible to all.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4 text-white/50 uppercase tracking-wider">Shop</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link to="/wireframes-05/collection" className="hover:text-white transition-colors">All Prints</Link></li>
                <li><Link to="/wireframes-05/collection" className="hover:text-white transition-colors">New Arrivals</Link></li>
                <li><Link to="/wireframes-05/collection" className="hover:text-white transition-colors">Bestsellers</Link></li>
                <li><Link to="/wireframes-05/collection" className="hover:text-white transition-colors">Artists</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4 text-white/50 uppercase tracking-wider">Help</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4 text-white/50 uppercase tracking-wider">Newsletter</h4>
              <p className="text-sm text-white/60 mb-4">New releases and exclusive offers.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 text-sm placeholder:text-white/40 focus:outline-none focus:border-white/40"
                />
                <Button size="sm" className="bg-white text-[#1c1c1c] hover:bg-white/90">
                  Join
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/40">
            © 2024 Atlas Posters. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
