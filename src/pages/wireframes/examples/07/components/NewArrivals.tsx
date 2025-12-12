import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WireframePlaceholder } from "./WireframePlaceholder";

const products = [
  { title: "Oslo Winter", artist: "Harald Damsleth", price: "£52", badge: "New" },
  { title: "Amalfi Coast", artist: "Mario Puppo", price: "£48", badge: "New" },
  { title: "Lake Como", artist: "Aldo Raimondi", price: "£55", badge: "New" },
  { title: "Zermatt", artist: "Herbert Matter", price: "£60", badge: "New" },
  { title: "Santorini", artist: "Nikos Kostas", price: "£45", badge: "New" },
  { title: "Kyoto", artist: "Kawase Hasui", price: "£58", badge: "New" },
];

export function NewArrivals() {
  return (
    <section className="px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">New Arrivals</h2>
        <Button variant="ghost" size="sm" className="text-amber-600">
          View All
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.title} className="group">
            <div className="relative mb-2">
              <WireframePlaceholder 
                aspectRatio="portrait" 
                className="rounded-lg"
                label="Product"
              />
              {product.badge && (
                <Badge 
                  className="absolute top-2 left-2 text-[10px] bg-amber-600 text-white"
                >
                  {product.badge}
                </Badge>
              )}
            </div>
            <h3 className="font-medium text-sm truncate">{product.title}</h3>
            <p className="text-xs text-muted-foreground truncate">{product.artist}</p>
            <p className="text-sm font-semibold mt-1">{product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
