import { Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Layout, Palette, Search, Mail, Navigation } from "lucide-react";

const wireframePages = [
  {
    title: "Homepage",
    description: "Mobile-first homepage with sticky header, hero section, 2x2 discovery cards, curated collections, artist spotlight, and full-screen search.",
    path: "home",
    features: ["Sticky Header", "Discovery Cards", "Email Modal", "Full-Screen Search", "Artist Carousel"],
  },
  {
    title: "Product Page",
    description: "Touch-optimized product detail with size/frame selectors, sticky add-to-cart, and expandable product information.",
    path: "product",
    features: ["Size Selector", "Frame Options", "Sticky CTA", "Accordion Details"],
  },
  {
    title: "Collection Page",
    description: "Filterable collection with slide-out filters, sort options, and toggle between grid and list views.",
    path: "collection",
    features: ["Slide-out Filters", "Sort Sheet", "Grid/List Toggle", "Sticky Toolbar"],
  },
];

const designNotes = [
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Designed for phone screens first, then adapted for tablet and desktop. Touch-friendly tap targets and swipe gestures.",
  },
  {
    icon: Navigation,
    title: "Smart Navigation",
    description: "Sticky header that hides on scroll down and shows on scroll up. Full-screen mobile nav drawer with clear hierarchy.",
  },
  {
    icon: Search,
    title: "Discovery-Focused",
    description: "2x2 discovery cards for quick category access. Full-screen search overlay with trending terms and recent searches.",
  },
  {
    icon: Mail,
    title: "Email Capture",
    description: "Timed email signup modal with £20 discount offer. Dismissible with session persistence to avoid repeat popups.",
  },
  {
    icon: Palette,
    title: "Atlas Brand",
    description: "Clean white backgrounds with amber/gold accents. 'Atlas' in dark, 'Posters' in brand gold for consistent identity.",
  },
  {
    icon: Layout,
    title: "Wireframe Placeholders",
    description: "X-pattern boxes following Balsamiq style for image placeholders. Focus on layout and UX over visual polish.",
  },
];

export default function WireframeIndex() {
  const location = useLocation();
  // Determine base path based on current context
  const isAdmin = location.pathname.startsWith("/admin");
  const basePath = isAdmin ? "/admin/wireframes/examples/07" : "/wireframes/examples/07";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">Version 07</Badge>
              <Badge className="bg-amber-600 text-white">Mobile-First</Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">Mobile-First Atlas Wireframe</h1>
            <p className="text-lg text-muted-foreground mb-2">
              Phone-First Design with Desktop Adaptation
            </p>
            <p className="text-muted-foreground">
              This wireframe prioritizes the mobile shopping experience with a sticky header, 
              full-screen overlays, touch-optimized interactions, and a conversion-focused layout. 
              Based on Balsamiq wireframes with a focus on the customer journey from discovery to purchase.
            </p>
          </div>
        </div>
      </div>

      {/* Wireframe Cards */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">Page Wireframes</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {wireframePages.map((wireframe) => (
            <Card key={wireframe.title} className="group overflow-hidden">
              <div className="aspect-video overflow-hidden bg-muted flex items-center justify-center">
                <div className="text-center p-4">
                  <Smartphone className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                  <span className="text-sm text-muted-foreground">Mobile Wireframe</span>
                </div>
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
                <Link to={`${basePath}/${wireframe.path}`}>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    View Wireframe
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Design Notes */}
        <h2 className="text-2xl font-semibold mb-6">Design Approach</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {designNotes.map((note) => (
            <Card key={note.title}>
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center mb-2">
                  <note.icon className="h-5 w-5 text-amber-700" />
                </div>
                <CardTitle className="text-lg">{note.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{note.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Key Features */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1 text-amber-900">Key Mobile UX Patterns</h3>
                <p className="text-sm text-amber-800">
                  Sticky header with hide/show on scroll • Full-screen search overlay • 
                  Email capture modal • Slide-out navigation drawer • Touch-optimized cards • 
                  Bottom sheet filters • Sticky add-to-cart bar
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
