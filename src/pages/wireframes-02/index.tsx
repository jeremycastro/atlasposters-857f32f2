import { Link } from "react-router-dom";
import { ArrowRight, Palette, Type, Layout, Moon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const wireframes = [
  {
    title: "Homepage",
    description: "Full-bleed hero with moody lifestyle photography, minimal navigation, and curated collections",
    href: "/wireframes-02/home",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
    features: ["Dark hero imagery", "Serif italic headlines", "Lifestyle-first presentation", "Minimal UI chrome"],
  },
  {
    title: "Product Display",
    description: "Clean product presentation with room scene context and streamlined variant selection",
    href: "/wireframes-02/product",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=600&h=400&fit=crop",
    features: ["Large product imagery", "Contextual room shots", "Simple size/frame options", "Artist spotlight"],
  },
  {
    title: "Collection Page",
    description: "Masonry-style grid with editorial category headers and subtle filtering",
    href: "/wireframes-02/collection",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    features: ["Asymmetric grid", "Hover-reveal details", "Minimal filter UI", "Editorial intro"],
  },
];

const designNotes = [
  {
    icon: Type,
    title: "Typography",
    description: "Elegant serif for headlines (italic style), clean sans-serif for body. High contrast, generous line-height.",
  },
  {
    icon: Palette,
    title: "Color Palette",
    description: "Dark, moody backgrounds (charcoal, deep greens). Warm neutral accents. White/cream for contrast.",
  },
  {
    icon: Layout,
    title: "Layout Philosophy",
    description: "Full-bleed imagery, generous white space, asymmetric grids. Content breathes.",
  },
  {
    icon: Moon,
    title: "Mood & Atmosphere",
    description: "Scandinavian minimalism meets art gallery. Sophisticated, curated, aspirational.",
  },
];

export function WireframeIndex() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline">Version 02</Badge>
            <Badge className="bg-emerald-600">Scandinavian Minimal</Badge>
          </div>
          <h1 className="text-4xl font-serif mb-4">Wireframe Gallery</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Design direction inspired by The Poster Club — Scandinavian minimalism with moody, 
            lifestyle-driven imagery and elegant typography. Focus on art as interior design.
          </p>
        </div>
      </div>

      {/* Wireframe Cards */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {wireframes.map((wireframe) => (
            <Card key={wireframe.title} className="group overflow-hidden border-border hover:border-foreground/20 transition-colors">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={wireframe.image}
                  alt={wireframe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardHeader>
                <CardTitle className="font-serif">{wireframe.title}</CardTitle>
                <CardDescription>{wireframe.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                  {wireframe.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-emerald-600 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={wireframe.href}>
                  <Button variant="outline" className="w-full group-hover:bg-foreground group-hover:text-background transition-colors">
                    View Wireframe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Design Notes */}
      <div className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-serif mb-8">Design Direction</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {designNotes.map((note) => (
              <Card key={note.title} className="bg-background">
                <CardHeader>
                  <note.icon className="h-8 w-8 text-emerald-600 mb-2" />
                  <CardTitle className="text-lg">{note.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{note.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Reference Link */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground mb-4">Design reference</p>
          <a
            href="https://theposterclub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-foreground hover:text-emerald-600 transition-colors font-medium"
          >
            The Poster Club
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
