import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { WireframeTrustBar } from "./components/WireframeTrustBar";
import { WireframeNav } from "./components/WireframeNav";
import { WireframeHero } from "./components/WireframeHero";
import { WireframeCategoryCard } from "./components/WireframeCategoryCard";
import { WireframeProductCard } from "./components/WireframeProductCard";
import { WireframeFooter } from "./components/WireframeFooter";

const categories = [
  { title: "Travel & Adventure", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", count: 245 },
  { title: "Sport & Outdoors", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=80", count: 128 },
  { title: "Nature & Wildlife", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80", count: 312 },
  { title: "Culture & Heritage", image: "https://images.unsplash.com/photo-1533929736558-12f22e5e9073?w=400&q=80", count: 189 },
  { title: "Vintage Posters", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80", count: 456 },
  { title: "Photography", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80", count: 234 },
  { title: "Limited Editions", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80", count: 42 },
  { title: "New Arrivals", image: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=400&q=80", count: 67 },
];

const featuredProducts = [
  { title: "Mont Blanc - French Alps", artist: "Roger Broders", price: "£45", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", isNew: true },
  { title: "The Grand Canyon", artist: "Thomas Moran", price: "£55", image: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&q=80" },
  { title: "Japanese Cherry Blossom", artist: "Kawase Hasui", price: "£40", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80", isLimited: true },
  { title: "Venice at Sunset", artist: "Claude Monet", price: "£65", image: "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=400&q=80" },
  { title: "Norwegian Fjords", artist: "Harald Sohlberg", price: "£50", image: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=400&q=80", isNew: true },
  { title: "African Safari", artist: "Wilhelm Kuhnert", price: "£48", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80" },
];

const partnerBrands = [
  { name: "National Geographic", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80" },
  { name: "Patagonia Archive", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80" },
  { name: "Vintage Ski Posters", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&q=80" },
  { name: "Safari Heritage", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=300&q=80" },
];

export default function WireframeHome() {
  return (
    <div className="min-h-screen bg-background">
      <WireframeTrustBar />
      <WireframeNav />

      {/* Hero Section */}
      <WireframeHero
        title="Art for the Adventurous Soul"
        subtitle="Museum-quality prints celebrating exploration, nature, and the spirit of adventure. From vintage travel posters to contemporary wilderness photography."
        ctaText="Explore Collections"
        image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
        size="large"
      />

      {/* Category Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-['Playfair_Display'] text-3xl font-semibold mb-3">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Discover curated collections spanning vintage travel posters, wildlife photography, 
              and contemporary adventure art.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <WireframeCategoryCard
                key={category.title}
                title={category.title}
                image={category.image}
                itemCount={category.count}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections (Partner Brands) */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-['Playfair_Display'] text-2xl font-semibold">
              Featured Collections
            </h2>
            <Link
              to="/wireframes-01/collection"
              className="text-sm font-medium hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {partnerBrands.map((brand) => (
              <Link
                key={brand.name}
                to="/wireframes-01/collection"
                className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-muted"
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-background font-medium text-lg text-center px-4">
                    {brand.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-['Playfair_Display'] text-2xl font-semibold">
              New Arrivals
            </h2>
            <Link
              to="/wireframes-01/collection"
              className="text-sm font-medium hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredProducts.map((product) => (
              <WireframeProductCard
                key={product.title}
                title={product.title}
                artist={product.artist}
                price={product.price}
                image={product.image}
                isNew={product.isNew}
                isLimited={product.isLimited}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Block */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-['Playfair_Display'] text-4xl font-semibold mb-6">
              The Destination for Adventure Art
            </h2>
            <p className="text-lg text-background/80 mb-8 leading-relaxed">
              At Atlas Posters, we believe that art should inspire action. Our carefully curated 
              collection brings together vintage travel posters, contemporary wilderness photography, 
              and original artworks that celebrate the spirit of exploration. Every print is 
              produced to museum-quality standards, supporting independent artists and preserving 
              the stories behind each piece.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="border-background text-background hover:bg-background hover:text-foreground"
            >
              Our Story
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Inline Newsletter */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-['Playfair_Display'] text-2xl font-semibold mb-3">
              Stay Inspired
            </h3>
            <p className="text-muted-foreground mb-6">
              Join our community for exclusive offers, new arrivals, and stories from the world 
              of adventure art.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>

      <WireframeFooter />
    </div>
  );
}
