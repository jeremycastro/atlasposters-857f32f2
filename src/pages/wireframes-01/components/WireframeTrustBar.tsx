import { Award, Truck, Heart, Shield } from "lucide-react";

const trustItems = [
  { icon: Award, text: "Museum-quality printing" },
  { icon: Truck, text: "Free UK delivery over £50" },
  { icon: Heart, text: "Supporting independent artists" },
  { icon: Shield, text: "100% satisfaction guarantee" },
];

export function WireframeTrustBar() {
  return (
    <div className="bg-foreground text-background py-2 overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...trustItems, ...trustItems].map((item, index) => (
          <div key={index} className="flex items-center mx-8">
            <item.icon className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
