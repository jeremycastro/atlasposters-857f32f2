import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface WireframeHeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  image: string;
  overlay?: boolean;
  size?: "default" | "large" | "banner";
}

export function WireframeHero({
  title,
  subtitle,
  ctaText,
  ctaLink = "/wireframes-01/collection",
  image,
  overlay = true,
  size = "default",
}: WireframeHeroProps) {
  const heightClass = {
    default: "h-[60vh] min-h-[400px]",
    large: "h-[80vh] min-h-[600px]",
    banner: "h-[40vh] min-h-[300px]",
  }[size];

  return (
    <section className={`relative ${heightClass} overflow-hidden`}>
      <img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
      )}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-xl space-y-6">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-background/90 max-w-md">
              {subtitle}
            </p>
          )}
          {ctaText && (
            <Button
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 group"
            >
              {ctaText}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
