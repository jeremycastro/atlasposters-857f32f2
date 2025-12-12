import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ExternalLink, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WireframeExampleNavProps {
  version: string;
  title: string;
  referenceUrl?: string;
  referenceName?: string;
  accentColor?: string;
  variant?: "light" | "dark";
}

const pages = ["Index", "Home", "Product", "Collection"] as const;

export function WireframeExampleNav({
  version,
  title,
  referenceUrl,
  referenceName,
  accentColor = "bg-amber-500",
  variant = "dark",
}: WireframeExampleNavProps) {
  const location = useLocation();
  const basePath = `/wireframes/examples/${version}`;
  const [isHidden, setIsHidden] = useState(false);

  const getPagePath = (page: string) => {
    if (page === "Index") return basePath;
    return `${basePath}/${page.toLowerCase()}`;
  };

  const isActive = (page: string) => {
    const pagePath = getPagePath(page);
    return location.pathname === pagePath;
  };

  const isDark = variant === "dark";

  if (isHidden) {
    return (
      <button
        onClick={() => setIsHidden(false)}
        className={`fixed top-2 right-2 z-[100] p-2 rounded-full shadow-lg ${
          isDark ? "bg-[#1c1c1c] text-white/70 hover:text-white" : "bg-background text-muted-foreground hover:text-foreground"
        } border ${isDark ? "border-white/10" : "border-border"}`}
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className={`sticky top-0 z-[100] ${isDark ? "bg-[#1c1c1c] border-white/10" : "bg-muted border-border"} border-b px-4 py-2`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/wireframes">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`gap-2 ${isDark ? "text-white/70 hover:text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground"}`}
            >
              <ArrowLeft className="h-4 w-4" />
              Gallery
            </Button>
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant="outline" className={`text-xs ${isDark ? "text-white/60 border-white/20" : "text-muted-foreground border-border"}`}>
              v{version}
            </Badge>
            <span className={`text-sm ${isDark ? "text-white/50" : "text-muted-foreground"}`}>{title}</span>
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
                    : isDark 
                      ? "text-white/70 hover:text-white hover:bg-white/10"
                      : "text-muted-foreground hover:text-foreground"
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
                className={`gap-2 ${isDark ? "text-white/70 hover:text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground"}`}
              >
                {referenceName}
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsHidden(true)}
            className={`h-8 w-8 ${isDark ? "text-white/70 hover:text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground"}`}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
