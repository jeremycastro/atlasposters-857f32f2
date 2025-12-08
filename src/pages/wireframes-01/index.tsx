import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Palette, Type, Layout } from "lucide-react";

const wireframes = [
  {
    title: "Homepage",
    description: "Full homepage with trust bar, hero section, category grid, featured collections, new arrivals, and brand story block.",
    href: "/wireframes-01/home",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    features: ["Trust Bar", "Mega Navigation", "Hero Section", "Category Grid", "Newsletter"],
  },
  {
    title: "Product Display Page",
    description: "Detailed product page with image gallery, size/frame selectors, product details accordion, and related products.",
    href: "/wireframes-01/product",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80",
    features: ["Image Gallery", "Frame Selector", "Size Options", "Product Details", "Artist Info"],
  },
  {
    title: "Collection / Keyword Landing",
    description: "Collection page with filter sidebar, product grid, sorting options, and SEO content section.",
    href: "/wireframes-01/collection",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80",
    features: ["Filter Sidebar", "Product Grid", "Sort Options", "Pagination", "SEO Block"],
  },
];

const designNotes = [
  {
    icon: Type,
    title: "Typography",
    description: "Playfair Display for headlines, Inter for body text. Classic editorial feel with modern readability.",
  },
  {
    icon: Palette,
    title: "Color Palette",
    description: "Warm neutrals with Atlas gold accents. Dark backgrounds for premium sections, light for product focus.",
  },
  {
    icon: Layout,
    title: "Layout Approach",
    description: "Full-width hero sections, generous whitespace, grid-based category displays inspired by King & McGaw.",
  },
];

export default function WireframeIndex() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">Version 01</Badge>
              <Badge className="bg-amber-500 text-white">In Review</Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">Wireframe Gallery</h1>
            <p className="text-lg text-muted-foreground mb-2">
              King & McGaw Inspired Design Direction
            </p>
            <p className="text-muted-foreground">
              These wireframes explore a refined, editorial aesthetic inspired by King & McGaw's 
              approach to showcasing art prints. The design emphasizes typography, generous whitespace, 
              and a premium feel aligned with Atlas Posters' brand positioning.
            </p>
          </div>
        </div>
      </div>

      {/* Wireframe Cards */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">Page Wireframes</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {wireframes.map((wireframe) => (
            <Card key={wireframe.title} className="group overflow-hidden">
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={wireframe.image}
                  alt={wireframe.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {wireframe.title}
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <CardDescription>{wireframe.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-4">
                  {wireframe.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <Link to={wireframe.href}>
                  <Button className="w-full">View Wireframe</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Design Notes */}
        <h2 className="text-2xl font-semibold mb-6">Design Direction</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {designNotes.map((note) => (
            <Card key={note.title}>
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center mb-2">
                  <note.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{note.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{note.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reference */}
        <Card className="bg-muted/50">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1">Design Reference</h3>
                <p className="text-sm text-muted-foreground">
                  These wireframes are inspired by King & McGaw's approach to art print e-commerce, 
                  adapted for Atlas Posters' adventure and travel focus.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
