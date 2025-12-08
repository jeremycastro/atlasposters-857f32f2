import { Link } from "react-router-dom";
import { ExternalLink, Eye, Layout, Palette, Type } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const wireframeVersions = [
  {
    version: "01",
    title: "King & McGaw Inspired",
    reference: "kingart.com",
    referenceUrl: "https://www.kingart.com",
    status: "In Review",
    description: "Editorial aesthetic with bold serif typography, warm amber accents, and sophisticated gallery-style layouts.",
    designNotes: [
      { icon: Type, label: "Typography", value: "Playfair Display + Source Sans" },
      { icon: Palette, label: "Colors", value: "Warm amber accents on cream" },
      { icon: Layout, label: "Layout", value: "Editorial, gallery-focused" },
    ],
    pages: [
      { name: "Home", path: "/wireframes-01/home" },
      { name: "Product", path: "/wireframes-01/product" },
      { name: "Collection", path: "/wireframes-01/collection" },
    ],
  },
  {
    version: "02",
    title: "The Poster Club Inspired",
    reference: "theposterclub.com",
    referenceUrl: "https://theposterclub.com",
    status: "In Review",
    description: "Scandinavian minimalism with dark moody backgrounds, elegant serif typography, and clean sophisticated navigation.",
    designNotes: [
      { icon: Type, label: "Typography", value: "Cormorant Garamond + Inter" },
      { icon: Palette, label: "Colors", value: "Dark moody with warm accents" },
      { icon: Layout, label: "Layout", value: "Minimal, Scandinavian" },
    ],
    pages: [
      { name: "Home", path: "/wireframes-02/home" },
      { name: "Product", path: "/wireframes-02/product" },
      { name: "Collection", path: "/wireframes-02/collection" },
    ],
  },
];

const Wireframes = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-bold text-xl tracking-tight">
              ATLAS
            </Link>
            <Badge variant="outline" className="font-mono text-xs">
              Wireframes
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground hidden sm:block">
            Storefront Design Explorations
          </p>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Wireframe Gallery
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore our design explorations for the Atlas storefront. Each version represents
            a different aesthetic direction inspired by leading art retailers.
          </p>
        </div>
      </section>

      {/* Wireframe Versions */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-8 md:grid-cols-2">
          {wireframeVersions.map((wireframe) => (
            <Card key={wireframe.version} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    VERSION {wireframe.version}
                  </span>
                  <Badge variant="secondary">{wireframe.status}</Badge>
                </div>
                <CardTitle className="text-2xl">{wireframe.title}</CardTitle>
                <CardDescription className="text-base">
                  {wireframe.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Design Notes */}
                <div className="grid grid-cols-3 gap-3">
                  {wireframe.designNotes.map((note) => (
                    <div
                      key={note.label}
                      className="rounded-lg bg-muted/50 p-4 text-center"
                    >
                      <note.icon className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">{note.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{note.value}</p>
                    </div>
                  ))}
                </div>

                {/* Reference */}
                <div className="flex items-center justify-between py-3 border-y">
                  <span className="text-sm text-muted-foreground">Design Reference:</span>
                  <a
                    href={wireframe.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    {wireframe.reference}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {/* Page Links */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Pages</p>
                  <div className="flex flex-wrap gap-2">
                    {wireframe.pages.map((page) => (
                      <Button key={page.path} asChild variant="outline" size="sm">
                        <Link to={page.path}>
                          <Eye className="h-3 w-3 mr-1.5" />
                          {page.name}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* View Full Set */}
                <Button asChild className="w-full">
                  <Link to={`/wireframes-0${wireframe.version}`}>
                    View Full Wireframe Set
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Atlas Storefront Wireframes • For Internal Review</p>
        </div>
      </footer>
    </div>
  );
};

export default Wireframes;
