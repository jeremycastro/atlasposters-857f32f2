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
    statusVariant: "secondary" as const,
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
    statusVariant: "secondary" as const,
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
  {
    version: "03",
    title: "Desenio Inspired",
    reference: "desenio.com",
    referenceUrl: "https://www.desenio.com",
    status: "In Review",
    statusVariant: "secondary" as const,
    description: "Contemporary Nordic style with promotional hero banners, countdown timers, category navigation, and conversion-focused product displays.",
    designNotes: [
      { icon: Type, label: "Typography", value: "DM Sans + System" },
      { icon: Palette, label: "Colors", value: "Clean white with bold accents" },
      { icon: Layout, label: "Layout", value: "Promotional, grid-heavy" },
    ],
    pages: [
      { name: "Home", path: "/wireframes-03/home" },
      { name: "Product", path: "/wireframes-03/product" },
      { name: "Collection", path: "/wireframes-03/collection" },
    ],
  },
];

const WireframeDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wireframe Gallery</h1>
          <p className="text-muted-foreground mt-1">
            Design explorations and UI concepts for the Atlas storefront
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/wireframes" target="_blank">
            <ExternalLink className="h-4 w-4 mr-2" />
            Public Gallery
          </Link>
        </Button>
      </div>

      {/* Version Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {wireframeVersions.map((wireframe) => (
          <Card key={wireframe.version} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      v{wireframe.version}
                    </span>
                    <Badge variant={wireframe.statusVariant}>{wireframe.status}</Badge>
                  </div>
                  <CardTitle className="text-xl">{wireframe.title}</CardTitle>
                  <CardDescription>{wireframe.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Design Notes */}
              <div className="grid grid-cols-3 gap-3">
                {wireframe.designNotes.map((note) => (
                  <div
                    key={note.label}
                    className="rounded-lg bg-muted/50 p-3 text-center"
                  >
                    <note.icon className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs font-medium">{note.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{note.value}</p>
                  </div>
                ))}
              </div>

              {/* Reference */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Reference:</span>
                <a
                  href={wireframe.referenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {wireframe.reference}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Page Links */}
              <div className="flex flex-wrap gap-2">
                {wireframe.pages.map((page) => (
                  <Button key={page.path} asChild variant="outline" size="sm">
                    <Link to={page.path}>
                      <Eye className="h-3 w-3 mr-1" />
                      {page.name}
                    </Link>
                  </Button>
                ))}
              </div>

              {/* View Gallery Link */}
              <Button asChild className="w-full" variant="secondary">
                <Link to={`/wireframes-${wireframe.version}`}>
                  View Full Wireframe Set
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Design Direction Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">Version 01 - Editorial</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Warm, inviting color palette</li>
                <li>• Bold editorial typography</li>
                <li>• Gallery-style product presentation</li>
                <li>• Trust-building elements prominent</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Version 02 - Scandinavian</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Dark, moody aesthetic</li>
                <li>• Elegant serif typography</li>
                <li>• Minimal, clean layouts</li>
                <li>• Focus on artwork presentation</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Version 03 - Contemporary</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Promotional, conversion-focused</li>
                <li>• Clean system typography</li>
                <li>• Grid-heavy product layouts</li>
                <li>• Urgency-driven design elements</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WireframeDashboard;
