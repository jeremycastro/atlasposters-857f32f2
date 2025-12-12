import { Link } from "react-router-dom";
import { ExternalLink, Eye, CheckCircle, AlertCircle, TrendingUp, Users, Search, Globe, GlobeLock, Smartphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WireframeVersion, getPagePath } from "@/data/wireframeVersions";

interface WireframeCardProps {
  wireframe: WireframeVersion;
  isAdmin?: boolean;
  isPublished?: boolean;
  onTogglePublish?: () => void;
}

export function WireframeCard({ 
  wireframe, 
  isAdmin = false, 
  isPublished = false, 
  onTogglePublish 
}: WireframeCardProps) {
  const viewPath = isAdmin 
    ? `/admin/wireframes/examples/${wireframe.version}` 
    : `/wireframes/examples/${wireframe.version}`;

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
            V{wireframe.version}
          </span>
          <div className="flex items-center gap-1.5">
            {isAdmin && isPublished && (
              <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">
                <Globe className="h-3 w-3 mr-1" />
                Public
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">{wireframe.status}</Badge>
          </div>
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

        {/* Analysis Accordion - Only shown in admin */}
        {isAdmin && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="ux-analysis" className="border-none">
              <AccordionTrigger className="text-xs font-medium hover:no-underline py-2 px-3 bg-muted/30 rounded-lg data-[state=open]:rounded-b-none">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  UX Analysis
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3 pt-2 bg-muted/10 rounded-b-lg text-xs">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-green-600 mb-1.5">Strengths</h4>
                    <ul className="space-y-1">
                      {wireframe.analysis.uxStrengths.slice(0, 2).map((item, index) => (
                        <li key={index} className="flex items-start gap-1.5">
                          <CheckCircle className="h-3 w-3 mt-0.5 shrink-0 text-green-600" />
                          <span className="text-muted-foreground line-clamp-2">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-1.5">Improvements</h4>
                    <ul className="space-y-1">
                      {wireframe.analysis.uxWeaknesses.slice(0, 2).map((item, index) => (
                        <li key={index} className="flex items-start gap-1.5">
                          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0 text-amber-600" />
                          <span className="text-muted-foreground line-clamp-2">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="seo-analysis" className="border-none mt-1.5">
              <AccordionTrigger className="text-xs font-medium hover:no-underline py-2 px-3 bg-muted/30 rounded-lg data-[state=open]:rounded-b-none">
                <div className="flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 text-primary" />
                  SEO Analysis
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3 pt-2 bg-muted/10 rounded-b-lg text-xs">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-green-600 mb-1.5">Strengths</h4>
                    <ul className="space-y-1">
                      {wireframe.analysis.seoStrengths.slice(0, 2).map((item, index) => (
                        <li key={index} className="flex items-start gap-1.5">
                          <CheckCircle className="h-3 w-3 mt-0.5 shrink-0 text-green-600" />
                          <span className="text-muted-foreground line-clamp-2">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-1.5">Improvements</h4>
                    <ul className="space-y-1">
                      {wireframe.analysis.seoWeaknesses.slice(0, 2).map((item, index) => (
                        <li key={index} className="flex items-start gap-1.5">
                          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0 text-amber-600" />
                          <span className="text-muted-foreground line-clamp-2">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="recommendations" className="border-none mt-1.5">
              <AccordionTrigger className="text-xs font-medium hover:no-underline py-2 px-3 bg-muted/30 rounded-lg data-[state=open]:rounded-b-none">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  Recommendations
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3 pt-2 bg-muted/10 rounded-b-lg text-xs">
                <ul className="space-y-1.5">
                  {wireframe.analysis.recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index} className="flex items-start gap-1.5">
                      <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary/10 text-primary text-[10px] font-medium shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground line-clamp-2">{rec}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Page Links */}
        <div className="space-y-2">
          <p className="text-xs font-medium">Pages</p>
          <div className="flex flex-wrap gap-1.5">
            {wireframe.pages.map((page) => (
              <Button key={page.path} asChild variant="outline" size="sm" className="h-7 text-xs px-2">
                <Link to={getPagePath(wireframe.version, page.path, isAdmin)}>
                  <Eye className="h-3 w-3 mr-1" />
                  {page.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Actions */}
      <div className="p-4 pt-0 mt-auto space-y-2">
        <div className="flex gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link to={viewPath}>
              View Wireframe
            </Link>
          </Button>
          {isAdmin && (
            <Button asChild variant="outline" size="sm" title="Mobile Preview">
              <Link to={`/admin/wireframes/preview/${wireframe.version}`}>
                <Smartphone className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
          {isAdmin && isPublished && (
            <Button asChild variant="outline" size="sm" title="Open public link">
              <a href={`${window.location.origin}/wireframes/examples/${wireframe.version}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}
        </div>
        {isAdmin && onTogglePublish && (
          <Button
            variant={isPublished ? "outline" : "secondary"}
            size="sm"
            className="w-full"
            onClick={onTogglePublish}
          >
            {isPublished ? (
              <>
                <GlobeLock className="h-3.5 w-3.5 mr-1.5" />
                Unpublish
              </>
            ) : (
              <>
                <Globe className="h-3.5 w-3.5 mr-1.5" />
                Publish
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}
