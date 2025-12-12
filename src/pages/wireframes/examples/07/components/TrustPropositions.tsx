import { Truck, RotateCcw, ShieldCheck, Award } from "lucide-react";

const propositions = [
  {
    icon: Truck,
    title: "Free UK Delivery",
    description: "On orders over £50",
  },
  {
    icon: RotateCcw,
    title: "30-Day Returns",
    description: "No questions asked",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    description: "SSL encrypted",
  },
  {
    icon: Award,
    title: "Museum Quality",
    description: "Archival prints",
  },
];

export function TrustPropositions() {
  return (
    <section className="py-8 border-y border-border">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-4">
        {propositions.map((prop) => (
          <div key={prop.title} className="text-center">
            <prop.icon className="h-6 w-6 mx-auto mb-2 text-amber-600" />
            <h3 className="font-medium text-sm">{prop.title}</h3>
            <p className="text-xs text-muted-foreground">{prop.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
