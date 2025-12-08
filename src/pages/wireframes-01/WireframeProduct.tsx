import { useState } from "react";
import { Heart, Share2, Truck, RotateCcw, Shield, ChevronDown, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WireframeTrustBar } from "./components/WireframeTrustBar";
import { WireframeNav } from "./components/WireframeNav";
import { WireframeBreadcrumb } from "./components/WireframeBreadcrumb";
import { WireframeProductCard } from "./components/WireframeProductCard";
import { WireframeFooter } from "./components/WireframeFooter";

const productImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
];

const sizes = [
  { label: "A4", dimensions: "21 x 29.7cm", price: "£35" },
  { label: "A3", dimensions: "29.7 x 42cm", price: "£55" },
  { label: "A2", dimensions: "42 x 59.4cm", price: "£85" },
  { label: "A1", dimensions: "59.4 x 84.1cm", price: "£125" },
];

const frames = [
  { label: "Unframed", color: "transparent", price: "£0" },
  { label: "Black", color: "#1a1a1a", price: "+£45" },
  { label: "White", color: "#ffffff", price: "+£45" },
  { label: "Oak", color: "#c4a77d", price: "+£65" },
];

const relatedProducts = [
  { title: "The Grand Canyon", artist: "Thomas Moran", price: "£55", image: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&q=80" },
  { title: "Swiss Alps Railway", artist: "Otto Baumberger", price: "£48", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=80" },
  { title: "Norwegian Fjords", artist: "Harald Sohlberg", price: "£50", image: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=400&q=80" },
  { title: "Dolomites at Dawn", artist: "Friedrich Loos", price: "£52", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80" },
];

export default function WireframeProduct() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(1);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const currentPrice = sizes[selectedSize].price;
  const framePrice = frames[selectedFrame].price;

  return (
    <div className="min-h-screen bg-background">
      <WireframeTrustBar />
      <WireframeNav />

      <div className="container mx-auto px-4">
        <WireframeBreadcrumb
          items={[
            { label: "Travel & Adventure", href: "/wireframes-01/collection" },
            { label: "Mont Blanc - French Alps" },
          ]}
        />

        {/* Product Layout */}
        <div className="grid lg:grid-cols-2 gap-12 pb-16">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-muted rounded-sm overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt="Product"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-muted rounded-sm overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? "border-foreground"
                      : "border-transparent hover:border-border"
                  }`}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              <div className="aspect-square bg-muted rounded-sm flex items-center justify-center text-muted-foreground text-sm">
                +3 more
              </div>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            <div>
              <a href="#" className="text-sm text-muted-foreground hover:underline">
                Roger Broders
              </a>
              <h1 className="font-['Playfair_Display'] text-3xl font-semibold mt-1">
                Mont Blanc - French Alps
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">Vintage Travel</Badge>
                <Badge variant="outline">Limited Edition</Badge>
              </div>
            </div>

            <div className="text-2xl font-semibold">
              From {currentPrice}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                {framePrice !== "£0" && `(${framePrice} framed)`}
              </span>
            </div>

            <Separator />

            {/* Size Selector */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Size: {sizes[selectedSize].label} ({sizes[selectedSize].dimensions})
              </label>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((size, index) => (
                  <button
                    key={size.label}
                    onClick={() => setSelectedSize(index)}
                    className={`py-3 px-4 border rounded-sm text-center transition-colors ${
                      selectedSize === index
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    <div className="font-medium">{size.label}</div>
                    <div className="text-xs opacity-70">{size.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Selector */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Frame: {frames[selectedFrame].label}
              </label>
              <div className="flex gap-3">
                {frames.map((frame, index) => (
                  <button
                    key={frame.label}
                    onClick={() => setSelectedFrame(index)}
                    className={`relative w-16 h-16 rounded-sm border-2 transition-colors ${
                      selectedFrame === index
                        ? "border-foreground"
                        : "border-border hover:border-foreground"
                    }`}
                    title={`${frame.label} ${frame.price}`}
                  >
                    {frame.label === "Unframed" ? (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-xs text-muted-foreground">None</span>
                      </div>
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{ backgroundColor: frame.color, border: frame.label === "White" ? "1px solid hsl(var(--border))" : "none" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4">
              <div className="flex items-center border border-border rounded-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button size="lg" className="flex-1">
                Add to Basket
              </Button>
              <Button variant="outline" size="icon" className="h-11 w-11">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-11 w-11">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span>Free UK Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span>Quality Guarantee</span>
              </div>
            </div>

            <Separator />

            {/* Product Details Accordion */}
            <Accordion type="single" collapsible defaultValue="description" className="w-full">
              <AccordionItem value="description">
                <AccordionTrigger>Product Description</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground leading-relaxed">
                    This stunning vintage travel poster depicts the majestic Mont Blanc, 
                    the highest peak in the Alps. Originally created in 1930 by legendary 
                    Art Deco poster artist Roger Broders, this print captures the golden 
                    age of European mountain tourism. The bold colours and geometric forms 
                    are characteristic of Broders' distinctive style.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="artist">
                <AccordionTrigger>About the Artist</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Roger Broders (1883-1953) was a French artist best known for his Art Deco 
                    travel posters. Working primarily for the PLM railway company, his works 
                    promoted destinations across France and beyond, helping define the visual 
                    language of early 20th-century travel advertising.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="printing">
                <AccordionTrigger>Printing & Framing</AccordionTrigger>
                <AccordionContent>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Giclée printed on 315gsm Hahnemühle fine art paper</li>
                    <li>• Archival pigment inks with 100+ year lightfastness</li>
                    <li>• Hand-finished frames with premium mouldings</li>
                    <li>• Conservation-grade mounting and glazing</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                <AccordionContent>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Free UK delivery on orders over £50</li>
                    <li>• International shipping available</li>
                    <li>• 30-day return policy for unframed prints</li>
                    <li>• Carefully packaged for safe transit</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Related Products */}
        <section className="py-16 border-t border-border">
          <h2 className="font-['Playfair_Display'] text-2xl font-semibold mb-8">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <WireframeProductCard
                key={product.title}
                title={product.title}
                artist={product.artist}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
        </section>

        {/* Artist Spotlight */}
        <section className="py-16 border-t border-border">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Artist Spotlight</Badge>
              <h2 className="font-['Playfair_Display'] text-3xl font-semibold mb-4">
                Roger Broders
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Discover the complete collection of Roger Broders' iconic travel posters. 
                From the French Riviera to the Alpine peaks, Broders' work defined the 
                visual language of early 20th-century travel advertising and continues 
                to inspire wanderlust today.
              </p>
              <Button variant="outline">
                View All Works
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] bg-muted rounded-sm overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${1506905925346 + i * 1000}-21bda4d32df4?w=300&q=80`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <WireframeFooter />
    </div>
  );
}
