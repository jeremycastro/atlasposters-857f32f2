import { Link, Outlet, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WireframeLayout() {
  const location = useLocation();
  const isIndex = location.pathname === "/wireframes-03";

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link to="/wireframes">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  All Wireframes
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">Version 03 — Desenio Style</span>
            </div>

            {!isIndex && (
              <nav className="flex items-center gap-1">
                <Link to="/wireframes-03">
                  <Button
                    variant={location.pathname === "/wireframes-03" ? "secondary" : "ghost"}
                    size="sm"
                  >
                    Index
                  </Button>
                </Link>
                <Link to="/wireframes-03/home">
                  <Button
                    variant={location.pathname === "/wireframes-03/home" ? "secondary" : "ghost"}
                    size="sm"
                  >
                    Homepage
                  </Button>
                </Link>
                <Link to="/wireframes-03/product">
                  <Button
                    variant={location.pathname === "/wireframes-03/product" ? "secondary" : "ghost"}
                    size="sm"
                  >
                    Product
                  </Button>
                </Link>
                <Link to="/wireframes-03/collection">
                  <Button
                    variant={location.pathname === "/wireframes-03/collection" ? "secondary" : "ghost"}
                    size="sm"
                  >
                    Collection
                  </Button>
                </Link>
              </nav>
            )}

            <a
              href="https://desenio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Reference →
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <Outlet />
    </div>
  );
}
