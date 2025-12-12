import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WireframePlaceholder } from "./WireframePlaceholder";

const products = [
  { title: "Mont Blanc", artist: "Roger Broders", price: "£45", badge: "Best Seller" },
  { title: "Côte d'Azur", artist: "Cassandre", price: "£55", badge: null },
  { title: "Swiss Alps", artist: "Herbert Matter", price: "£50", badge: "New" },
  { title: "Venice", artist: "David Klein", price: "£48", badge: null },
  { title: "Tokyo", artist: "Kawase Hasui", price: "£42", badge: null },
  { title: "Grand Canyon", artist: "Thomas Moran", price: "£65", badge: "Limited" },
];

export function BestSellers() {
  return (
    <section className="px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Shop the Best Sellers</h2>
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
                  className={`absolute top-2 left-2 text-[10px] ${
                    product.badge === "Best Seller" 
                      ? "bg-foreground text-background" 
                      : product.badge === "New"
                      ? "bg-amber-600 text-white"
                      : "bg-purple-600 text-white"
                  }`}
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
