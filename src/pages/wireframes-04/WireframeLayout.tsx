import { Outlet, Link, useLocation } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WireframeLayout() {
  const location = useLocation();
  
  const pages = [
    { name: "Index", path: "/wireframes-04" },
    { name: "Homepage", path: "/wireframes-04/home" },
    { name: "Product", path: "/wireframes-04/product" },
    { name: "Collection", path: "/wireframes-04/collection" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Wireframe Navigation Bar */}
      <div className="sticky top-0 z-[100] bg-[#1a2332] border-b border-white/10 px-4 py-2">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/wireframes">
              <Button variant="ghost" size="sm" className="gap-2 text-white/70 hover:text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4" />
                All Wireframes
              </Button>
            </Link>
            <span className="text-sm text-white/50">Version 04 — Stick No Bills Style</span>
          </div>
          
          <div className="flex items-center gap-2">
            {pages.map((page) => (
              <Link key={page.path} to={page.path}>
                <Button
                  variant={location.pathname === page.path ? "secondary" : "ghost"}
                  size="sm"
                  className={location.pathname === page.path 
                    ? "bg-amber-700 text-white hover:bg-amber-600" 
                    : "text-white/70 hover:text-white hover:bg-white/10"
                  }
                >
                  {page.name}
                </Button>
              </Link>
            ))}
            <a
              href="https://sticknobillsonline.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm" className="gap-2 text-white/70 hover:text-white hover:bg-white/10">
                Reference
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
