import { Link } from "react-router-dom";
import { ArrowRight, Award, Globe, Heart, Leaf } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const wireframes = [
  {
    title: "Homepage",
    description: "Full-bleed vintage hero with rotating banners, trust indicators, and curated collection highlights",
    href: "/wireframes-04/home",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop",
    features: ["Full-bleed hero slider", "Trust bar with icons", "Curator's picks carousel", "Destination collections"],
  },
  {
    title: "Product Display",
    description: "Immersive product page with vintage aesthetic, size options, and storytelling elements",
    href: "/wireframes-04/product",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    features: ["Large product imagery", "Size/frame selector", "Artist & destination story", "Related posters"],
  },
  {
    title: "Collection Page",
    description: "Destination-focused grid with geographic filtering and immersive category headers",
    href: "/wireframes-04/collection",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
    features: ["Geographic filters", "Vintage-style grid", "Destination header banner", "Load more pagination"],
  },
];

const designNotes = [
  {
    icon: Award,
    title: "Vintage Aesthetic",
    description: "Classic travel poster style with serif typography, muted colors, and nostalgic imagery.",
  },
  {
    icon: Globe,
    title: "Destination Focus",
    description: "Content organized by location and journey. Geographic navigation and place-centric stories.",
  },
  {
    icon: Heart,
    title: "Curated Experience",
    description: "Hand-picked collections, curator's picks, and editorial storytelling throughout.",
  },
  {
    icon: Leaf,
    title: "Premium & Sustainable",
    description: "Emphasis on archival quality, licensed artwork, and sustainable production methods.",
  },
];

export function WireframeIndex() {
  return (
    <div className="min-h-screen bg-[#1a2332]">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className="border-white/30 text-white/80">Version 04</Badge>
            <Badge className="bg-amber-700 text-white">Vintage Travel</Badge>
          </div>
          <h1 className="text-4xl font-serif text-white mb-4">Wireframe Gallery</h1>
          <p className="text-lg text-white/70 max-w-2xl">
            Design direction inspired by Stick No Bills — vintage travel poster aesthetic 
            with destination-focused navigation, curated collections, and premium presentation.
          </p>
        </div>
      </div>

      {/* Wireframe Cards */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {wireframes.map((wireframe) => (
            <Card key={wireframe.title} className="group overflow-hidden bg-[#243044] border-white/10 hover:border-amber-600/50 transition-colors">
              <div className="aspect-[4/3] overflow-hidden bg-[#1a2332]">
                <img
                  src={wireframe.image}
                  alt={wireframe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
              </div>
              <CardHeader>
                <CardTitle className="font-serif text-white">{wireframe.title}</CardTitle>
                <CardDescription className="text-white/60">{wireframe.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-white/50 space-y-1 mb-4">
                  {wireframe.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-amber-600 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={wireframe.href}>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-amber-700 hover:border-amber-700 hover:text-white transition-colors">
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
      <div className="border-t border-white/10 bg-[#243044]">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-serif text-white mb-8">Design Direction</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {designNotes.map((note) => (
              <Card key={note.title} className="bg-[#1a2332] border-white/10">
                <CardHeader>
                  <note.icon className="h-8 w-8 text-amber-600 mb-2" />
                  <CardTitle className="text-lg text-white">{note.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/60">{note.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Reference Link */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-white/50 mb-4">Design reference</p>
          <a
            href="https://sticknobillsonline.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white hover:text-amber-500 transition-colors font-medium"
          >
            Stick No Bills
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
