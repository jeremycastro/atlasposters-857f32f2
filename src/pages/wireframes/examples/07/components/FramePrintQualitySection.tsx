import { Frame, Sparkles, Shield, Package } from "lucide-react";
import { WireframePlaceholder } from "./WireframePlaceholder";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Frame, title: "Solid Wood Frames", description: "Premium hardwood construction" },
  { icon: Sparkles, title: "Museum-Grade Prints", description: "Archival giclée printing" },
  { icon: Shield, title: "UV-Protective Glass", description: "Preserves colors for decades" },
  { icon: Package, title: "Ready to Hang", description: "Arrives with hardware included" },
];

export function FramePrintQualitySection() {
  return (
    <section className="py-10 px-4 bg-muted/30">
      {/* Section Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Frames & Quality</h2>
        <p className="text-sm text-muted-foreground">
          Premium materials. Expert craftsmanship. Built to last.
        </p>
      </div>

      {/* Image + Features Grid */}
      <div className="space-y-6">
        {/* Featured Image */}
        <WireframePlaceholder 
          aspectRatio="landscape" 
          label="Frame Detail Close-up"
          className="rounded-lg"
        />

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center text-center p-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-medium text-foreground">{feature.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="outline" size="sm" className="text-sm">
            Learn About Our Quality
          </Button>
        </div>
      </div>
    </section>
  );
}
