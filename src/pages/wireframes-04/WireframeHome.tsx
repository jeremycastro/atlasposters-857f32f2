import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, User, ShoppingBag, ChevronLeft, ChevronRight, Menu, Award, Globe, Heart, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&h=900&fit=crop",
    title: "Discover Japan",
    subtitle: "Vintage travel posters from the Land of the Rising Sun",
  },
  {
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&h=900&fit=crop",
    title: "Paris Calling",
    subtitle: "Classic European destinations reimagined",
  },
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop",
    title: "Alpine Adventures",
    subtitle: "Mountain landscapes from Switzerland to Austria",
  },
];

const trustBadges = [
  { icon: Award, title: "Officially Licensed", subtitle: "& Curated" },
  { icon: Globe, title: "Authentic,", subtitle: "Community-Born" },
  { icon: Heart, title: "Giving", subtitle: "Back" },
  { icon: Leaf, title: "Archival Quality", subtitle: "& Sustainable" },
];

const curatorPicks = [
  { id: 1, title: "Tokyo Nights", destination: "Japan", price: 45, image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=500&fit=crop" },
  { id: 2, title: "Côte d'Azur", destination: "France", price: 45, image: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=400&h=500&fit=crop" },
  { id: 3, title: "Swiss Alps", destination: "Switzerland", price: 45, image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=500&fit=crop" },
  { id: 4, title: "Amalfi Coast", destination: "Italy", price: 45, image: "https://images.unsplash.com/photo-1534008897995-27a23e859048?w=400&h=500&fit=crop" },
  { id: 5, title: "Santorini", destination: "Greece", price: 45, image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=500&fit=crop" },
];

const destinations = [
  { name: "Europe", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&h=400&fit=crop" },
  { name: "Asia", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop" },
  { name: "Americas", image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=600&h=400&fit=crop" },
  { name: "Oceania", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&h=400&fit=crop" },
];

export function WireframeHome() {
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
    <div className="min-h-screen bg-[#1a2332]">
      {/* Promo Banner */}
      <div className="bg-amber-700 text-white text-center py-2 text-sm">
        <span className="font-medium">Buy three premium posters and get a fourth one FREE.</span>
        {" "}Use Code: FREE4x3
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
              <Link to="/wireframes-04/collection" className="hover:text-white transition-colors">
                About Us
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

      {/* Hero Slider */}
      <section className="relative h-[70vh] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2332] via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center text-center text-white">
              <div>
                <h1 className="text-5xl md:text-7xl font-serif mb-4">{slide.title}</h1>
                <p className="text-lg md:text-xl text-white/80 mb-8">{slide.subtitle}</p>
                <Button className="bg-amber-700 hover:bg-amber-600 text-white px-8 py-3">
                  EXPLORE COLLECTION
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:bg-white/10"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:bg-white/10"
          onClick={nextSlide}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/40"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-[#243044] py-6 border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.title} className="flex items-center gap-3 justify-center">
                <badge.icon className="h-8 w-8 text-amber-600" />
                <div className="text-white">
                  <p className="text-sm font-medium">{badge.title}</p>
                  <p className="text-xs text-white/60">{badge.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curator's Picks */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-white mb-2">Curator's Picks</h2>
            <p className="text-white/60">Hand-selected vintage travel posters</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {curatorPicks.map((poster) => (
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
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
                <h3 className="text-white font-medium text-sm mb-1">{poster.title}</h3>
                <p className="text-white/50 text-xs mb-1">{poster.destination}</p>
                <p className="text-amber-500 text-sm">From €{poster.price}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/wireframes-04/collection">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white hover:text-[#1a2332]">
                View All Posters
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-16 bg-[#243044]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-white mb-2">Explore by Destination</h2>
            <p className="text-white/60">Discover poster art from around the world</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {destinations.map((dest) => (
              <Link
                key={dest.name}
                to="/wireframes-04/collection"
                className="group relative aspect-[4/3] overflow-hidden rounded"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-end p-6">
                  <h3 className="text-2xl font-serif text-white">{dest.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-amber-700">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <h2 className="text-3xl font-serif text-white mb-4">Join the Journey</h2>
          <p className="text-white/80 mb-8">
            Subscribe for exclusive offers, new arrivals, and travel inspiration
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded bg-white/10 border border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:border-white"
            />
            <Button className="bg-[#1a2332] hover:bg-[#243044] text-white px-6">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a2332] text-white py-16 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-serif text-lg mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link to="/wireframes-04/collection" className="hover:text-white">Best Sellers</Link></li>
                <li><Link to="/wireframes-04/collection" className="hover:text-white">New Arrivals</Link></li>
                <li><Link to="/wireframes-04/collection" className="hover:text-white">All Posters</Link></li>
                <li><Link to="/wireframes-04/collection" className="hover:text-white">Gift Cards</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-lg mb-4">Destinations</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link to="/wireframes-04/collection" className="hover:text-white">Europe</Link></li>
                <li><Link to="/wireframes-04/collection" className="hover:text-white">Asia</Link></li>
                <li><Link to="/wireframes-04/collection" className="hover:text-white">Americas</Link></li>
                <li><Link to="/wireframes-04/collection" className="hover:text-white">Oceania</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-lg mb-4">About</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white">Our Story</a></li>
                <li><a href="#" className="hover:text-white">Artists</a></li>
                <li><a href="#" className="hover:text-white">Sustainability</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-lg mb-4">Help</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white">FAQs</a></li>
                <li><a href="#" className="hover:text-white">Shipping</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-white/40">
            © 2024 Atlas Posters. Wireframe concept inspired by Stick No Bills.
          </div>
        </div>
      </footer>
    </div>
  );
}
