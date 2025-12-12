import { Link } from "react-router-dom";
import { ExternalLink, Eye, CheckCircle, AlertCircle, TrendingUp, Users, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Navigation } from "@/components/Navigation";
import { wireframeVersions, getPagePath } from "@/data/wireframeVersions";

const PublicWireframesGallery = () => {
  // Filter to only published wireframes
  const publishedWireframes = wireframeVersions.filter(wf => wf.published);

  if (publishedWireframes.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <section className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Wireframe Gallery</h1>
          <p className="text-muted-foreground">No wireframes are currently published.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Wireframe Gallery
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore our design explorations for the Atlas storefront. Each version represents
            a different aesthetic direction with detailed UX and SEO analysis.
          </p>
        </div>
      </section>

      {/* Wireframe Versions */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {publishedWireframes.map((wireframe) => (
            <Card key={wireframe.version} className="overflow-hidden flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    V{wireframe.version}
                  </span>
                  <Badge variant="secondary" className="text-xs">{wireframe.status}</Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{wireframe.title}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {wireframe.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 pt-0">
                {/* Design Notes */}
                <div className="space-y-2">
                  {wireframe.designNotes.map((note) => (
                    <div key={note.label} className="flex items-center gap-2 text-xs">
                      <note.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="font-medium">{note.label}:</span>
                      <span className="text-muted-foreground truncate">{note.value}</span>
                    </div>
                  ))}
                </div>

                {/* Reference */}
                {wireframe.reference && (
                  <div className="flex items-center justify-between py-2 border-y text-xs">
                    <span className="text-muted-foreground">Reference:</span>
                    <a
                      href={wireframe.referenceUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      {wireframe.reference}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {/* Scores */}
                <div className="flex gap-4 p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">UX</span>
                      <span className={`text-xs font-bold ${wireframe.analysis.overallScore.ux >= 8 ? 'text-green-600' : wireframe.analysis.overallScore.ux >= 6 ? 'text-amber-600' : 'text-red-600'}`}>
                        {wireframe.analysis.overallScore.ux}/10
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                      <div 
                        className={`h-full rounded-full ${wireframe.analysis.overallScore.ux >= 8 ? 'bg-green-500' : wireframe.analysis.overallScore.ux >= 6 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${wireframe.analysis.overallScore.ux * 10}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">SEO</span>
                      <span className={`text-xs font-bold ${wireframe.analysis.overallScore.seo >= 8 ? 'text-green-600' : wireframe.analysis.overallScore.seo >= 6 ? 'text-amber-600' : 'text-red-600'}`}>
                        {wireframe.analysis.overallScore.seo}/10
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                      <div 
                        className={`h-full rounded-full ${wireframe.analysis.overallScore.seo >= 8 ? 'bg-green-500' : wireframe.analysis.overallScore.seo >= 6 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${wireframe.analysis.overallScore.seo * 10}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Page Links */}
                <div className="space-y-2">
                  <p className="text-xs font-medium">Pages</p>
                  <div className="flex flex-wrap gap-1.5">
                    {wireframe.pages.map((page) => (
                      <Button key={page.path} asChild variant="outline" size="sm" className="h-7 text-xs px-2">
                        <Link to={getPagePath(wireframe.version, page.path, false)}>
                          <Eye className="h-3 w-3 mr-1" />
                          {page.name}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>

              {/* View Full Set */}
              <div className="p-4 pt-0 mt-auto">
                <Button asChild size="sm" className="w-full">
                  <Link to={`/wireframes/examples/${wireframe.version}`}>
                    View Full Wireframe
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Atlas Storefront Wireframes</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicWireframesGallery;
