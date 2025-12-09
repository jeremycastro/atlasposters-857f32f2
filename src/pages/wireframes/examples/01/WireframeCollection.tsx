import { useState } from "react";
import { Grid3X3, List, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { WireframeTrustBar } from "./components/WireframeTrustBar";
import { WireframeNav } from "./components/WireframeNav";
import { WireframeHero } from "./components/WireframeHero";
import { WireframeBreadcrumb } from "./components/WireframeBreadcrumb";
import { WireframeProductCard } from "./components/WireframeProductCard";
import { WireframeFilterSidebar } from "./components/WireframeFilterSidebar";
import { WireframeFooter } from "./components/WireframeFooter";

const products = [
  { title: "Mont Blanc - French Alps", artist: "Roger Broders", price: "£45", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", isNew: true },
  { title: "The Grand Canyon", artist: "Thomas Moran", price: "£55", image: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&q=80" },
  { title: "Japanese Cherry Blossom", artist: "Kawase Hasui", price: "£40", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80", isLimited: true },
  { title: "Venice at Sunset", artist: "Claude Monet", price: "£65", image: "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=400&q=80" },
  { title: "Norwegian Fjords", artist: "Harald Sohlberg", price: "£50", image: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=400&q=80", isNew: true },
  { title: "African Safari", artist: "Wilhelm Kuhnert", price: "£48", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80" },
  { title: "Swiss Alps Railway", artist: "Otto Baumberger", price: "£52", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=80" },
  { title: "Yosemite Valley", artist: "Albert Bierstadt", price: "£58", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80" },
  { title: "Scottish Highlands", artist: "Peter Graham", price: "£45", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
  { title: "Patagonia Peaks", artist: "Fritz Roy", price: "£62", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=80", isNew: true },
  { title: "New Zealand Sounds", artist: "Rita Angus", price: "£55", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80" },
  { title: "Iceland Aurora", artist: "Jón Stefánsson", price: "£68", image: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=400&q=80", isLimited: true },
];

export default function WireframeCollection() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-background">
      <WireframeTrustBar />
      <WireframeNav />

      {/* Category Hero */}
      <WireframeHero
        title="Travel & Adventure"
        subtitle="Discover our curated collection of vintage travel posters and contemporary adventure art. From Alpine peaks to tropical shores."
        image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
        size="banner"
      />

      <div className="container mx-auto px-4">
        <WireframeBreadcrumb
          items={[{ label: "Travel & Adventure" }]}
        />

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              245 products
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <WireframeFilterSidebar />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select defaultValue="featured">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="hidden md:flex items-center border border-border rounded-sm">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-none rounded-l-sm"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-none rounded-r-sm"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8 py-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <WireframeFilterSidebar />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {products.map((product, index) => (
                viewMode === "grid" ? (
                  <WireframeProductCard
                    key={index}
                    title={product.title}
                    artist={product.artist}
                    price={product.price}
                    image={product.image}
                    isNew={product.isNew}
                    isLimited={product.isLimited}
                  />
                ) : (
                  <div
                    key={index}
                    className="flex gap-6 p-4 border border-border rounded-sm hover:border-foreground/30 transition-colors"
                  >
                    <div className="w-32 h-40 bg-muted rounded-sm overflow-hidden shrink-0">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {product.artist}
                      </p>
                      <h3 className="font-medium mt-1">{product.title}</h3>
                      <div className="flex gap-1 mt-2">
                        {product.isNew && <Badge className="text-xs">New</Badge>}
                        {product.isLimited && <Badge variant="secondary" className="text-xs">Limited</Badge>}
                      </div>
                      <p className="font-medium mt-3">From {product.price}</p>
                      <Button size="sm" className="mt-4">
                        View Product
                      </Button>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 py-12">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="secondary">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <span className="px-2 text-muted-foreground">...</span>
              <Button variant="outline">12</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>

        {/* SEO Content Block */}
        <section className="py-12 border-t border-border">
          <div className="max-w-3xl">
            <h2 className="font-['Playfair_Display'] text-2xl font-semibold mb-4">
              Travel & Adventure Art Prints
            </h2>
            <div className="prose prose-muted">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Explore our extensive collection of travel and adventure art prints, featuring 
                vintage travel posters from the golden age of rail and steamship travel, alongside 
                contemporary wilderness photography and original adventure-inspired artworks. 
                Each piece is carefully selected to inspire wanderlust and celebrate the spirit 
                of exploration.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From the iconic Art Deco travel posters of Roger Broders and A.M. Cassandre to 
                stunning landscape photography of the world's most remote destinations, our 
                curated selection brings the beauty of travel into your home. All prints are 
                produced to museum-quality standards using archival inks and premium papers, 
                available in a range of sizes with optional professional framing.
              </p>
            </div>
          </div>
        </section>
      </div>

      <WireframeFooter />
    </div>
  );
}
