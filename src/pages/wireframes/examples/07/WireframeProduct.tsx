import { useState } from "react";
import { ArrowLeft, Heart, Share2, Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WireframePlaceholder } from "./components/WireframePlaceholder";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { MobileHeader } from "./components/MobileHeader";
import { MobileNav } from "./components/MobileNav";
import { SearchOverlay } from "./components/SearchOverlay";
import { TrustPropositions } from "./components/TrustPropositions";
import { MobileFooter } from "./components/MobileFooter";

const sizes = [
  { label: "A4", dimensions: "21 × 30 cm", price: "£25" },
  { label: "A3", dimensions: "30 × 42 cm", price: "£35" },
  { label: "A2", dimensions: "42 × 59 cm", price: "£55" },
  { label: "A1", dimensions: "59 × 84 cm", price: "£85" },
];

const frames = [
  { label: "No Frame", price: "+£0" },
  { label: "Black", price: "+£25" },
  { label: "White", price: "+£25" },
  { label: "Oak", price: "+£35" },
];

export default function WireframeProduct() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(sizes[1]);
  const [selectedFrame, setSelectedFrame] = useState(frames[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <MobileHeader 
        onMenuOpen={() => setIsNavOpen(true)}
        onSearchOpen={() => setIsSearchOpen(true)}
      />
      <MobileNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="pb-24">
        {/* Breadcrumb */}
        <div className="px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span>Travel Posters</span>
          <span>/</span>
          <span className="text-foreground">Mont Blanc</span>
        </div>

        {/* Product Image */}
        <div className="px-4 mb-6">
          <div className="relative">
            <WireframePlaceholder aspectRatio="portrait" className="rounded-lg" label="Product Image" />
            <Badge className="absolute top-3 left-3 bg-amber-600 text-white">Best Seller</Badge>
            <Button variant="ghost" size="icon" className="absolute top-3 right-3 bg-background/80 backdrop-blur">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="px-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm text-amber-600 font-medium">Roger Broders</p>
              <h1 className="text-2xl font-bold">Mont Blanc - French Alps</h1>
            </div>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <p className="text-2xl font-bold mb-4">£{parseInt(selectedSize.price.replace("£", "")) + parseInt(selectedFrame.price.replace("+£", ""))}</p>

          {/* Size Selector */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Size</h3>
            <div className="grid grid-cols-2 gap-2">
              {sizes.map((size) => (
                <button
                  key={size.label}
                  onClick={() => setSelectedSize(size)}
                  className={`p-3 rounded-lg border-2 transition-colors text-left ${
                    selectedSize.label === size.label 
                      ? "border-amber-600 bg-amber-50" 
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{size.label}</span>
                    <span className="font-semibold">{size.price}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{size.dimensions}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Frame Selector */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Frame</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {frames.map((frame) => (
                <button
                  key={frame.label}
                  onClick={() => setSelectedFrame(frame)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full border-2 transition-colors ${
                    selectedFrame.label === frame.label 
                      ? "border-amber-600 bg-amber-50" 
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <span className="text-sm font-medium">{frame.label}</span>
                  <span className="text-xs text-muted-foreground ml-1">{frame.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Details Accordion */}
          <Accordion type="single" collapsible className="mb-6">
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  This stunning vintage travel poster by Roger Broders captures the majesty of Mont Blanc and the French Alps. 
                  Originally created for the Paris-Lyon-Mediterranean Railway in the 1930s, this reproduction is printed on 
                  museum-quality archival paper using fade-resistant inks.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping & Returns</AccordionTrigger>
              <AccordionContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    Free UK delivery on orders over £50
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    30-day returns, no questions asked
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    Ships within 2-3 business days
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="artist">
              <AccordionTrigger>About the Artist</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Roger Broders (1883-1953) was a French artist known for his striking travel posters. 
                  Working primarily for the French national railway, his Art Deco style made destinations 
                  across France and the Mediterranean come alive.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <TrustPropositions />
      </main>

      {/* Sticky Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-40">
        <Button className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-semibold">
          Add to Cart - £{parseInt(selectedSize.price.replace("£", "")) + parseInt(selectedFrame.price.replace("+£", ""))}
        </Button>
      </div>

      <MobileFooter />
    </div>
  );
}
