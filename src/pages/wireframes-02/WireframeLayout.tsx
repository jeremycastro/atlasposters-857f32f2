import { Outlet, Link, useLocation } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function WireframeLayout() {
  const location = useLocation();
  const isIndex = location.pathname === "/wireframes-02";

  return (
    <div className="min-h-screen bg-background">
      {/* Wireframe Navigation Bar */}
      <div className="sticky top-0 z-50 bg-muted border-b border-border">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/wireframes-02">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {isIndex ? "Back to Admin" : "Wireframe Index"}
              </Button>
            </Link>
            <Badge variant="outline" className="text-xs">
              Version 02
            </Badge>
            <Badge className="bg-emerald-600 text-white text-xs">Scandinavian Minimal</Badge>
          </div>
          
          {!isIndex && (
            <div className="flex items-center gap-2">
              <Link to="/wireframes-02/home">
                <Button
                  variant={location.pathname === "/wireframes-02/home" ? "secondary" : "ghost"}
                  size="sm"
                >
                  Homepage
                </Button>
              </Link>
              <Link to="/wireframes-02/product">
                <Button
                  variant={location.pathname === "/wireframes-02/product" ? "secondary" : "ghost"}
                  size="sm"
                >
                  Product
                </Button>
              </Link>
              <Link to="/wireframes-02/collection">
                <Button
                  variant={location.pathname === "/wireframes-02/collection" ? "secondary" : "ghost"}
                  size="sm"
                >
                  Collection
                </Button>
              </Link>
            </div>
          )}

          <a
            href="https://theposterclub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            Reference: The Poster Club
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
