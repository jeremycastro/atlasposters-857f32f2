import { Search, Palette, Package } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover",
    description: "Browse our curated archive of rare and iconic posters",
  },
  {
    icon: Palette,
    title: "Customize",
    description: "Choose your size and premium framing options",
  },
  {
    icon: Package,
    title: "Delivered",
    description: "Expertly packaged and shipped to your door",
  },
];

export function HowItWorks() {
  return (
    <section className="px-4 py-10 bg-muted/50">
      <h2 className="text-lg font-bold text-center mb-6">How It Works</h2>
      
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {steps.map((step, index) => (
          <div key={step.title} className="text-center">
            {/* Icon */}
            <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-background shadow-sm mb-3">
              <step.icon className="h-5 w-5 text-amber-600" />
              {/* Step number */}
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
            </div>
            
            {/* Text */}
            <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
            <p className="text-xs text-muted-foreground leading-tight">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
