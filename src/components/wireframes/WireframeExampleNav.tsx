import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WireframeExampleNavProps {
  version: string;
  title: string;
  referenceUrl?: string;
  referenceName?: string;
  accentColor?: string;
  bgColor?: string;
}

const pages = ["Index", "Home", "Product", "Collection"] as const;

export function WireframeExampleNav({
  version,
  title,
  referenceUrl,
  referenceName,
  accentColor = "bg-amber-500",
  bgColor = "bg-[#1c1c1c]",
}: WireframeExampleNavProps) {
  const location = useLocation();
  const basePath = `/wireframes/examples/${version}`;

  const getPagePath = (page: string) => {
    if (page === "Index") return basePath;
    return `${basePath}/${page.toLowerCase()}`;
  };

  const isActive = (page: string) => {
    const pagePath = getPagePath(page);
    return location.pathname === pagePath;
  };

  return (
    <div className={`sticky top-0 z-[100] ${bgColor} border-b border-white/10 px-4 py-2`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/wireframes">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Gallery
            </Button>
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant="outline" className="text-white/60 border-white/20 text-xs">
              v{version}
            </Badge>
            <span className="text-sm text-white/50">{title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pages.map((page) => (
            <Link key={page} to={getPagePath(page)}>
              <Button
                variant={isActive(page) ? "secondary" : "ghost"}
                size="sm"
                className={
                  isActive(page)
                    ? `${accentColor} text-white hover:opacity-90`
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }
              >
                {page}
              </Button>
            </Link>
          ))}
          {referenceUrl && referenceName && (
            <a
              href={referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block"
            >
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-white/70 hover:text-white hover:bg-white/10"
              >
                {referenceName}
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
