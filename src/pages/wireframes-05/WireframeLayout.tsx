import { Outlet, Link, useLocation } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WireframeLayout() {
  const location = useLocation();
  
  const pages = [
    { name: "Index", path: "/wireframes-05" },
    { name: "Homepage", path: "/wireframes-05/home" },
    { name: "Product", path: "/wireframes-05/product" },
    { name: "Collection", path: "/wireframes-05/collection" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Wireframe Navigation Bar */}
      <div className="sticky top-0 z-[100] bg-[#1c1c1c] border-b border-white/10 px-4 py-2">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/wireframes">
              <Button variant="ghost" size="sm" className="gap-2 text-white/70 hover:text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4" />
                All Wireframes
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-sm text-white/50">Version 05 — Best Practices</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {pages.map((page) => (
              <Link key={page.path} to={page.path}>
                <Button
                  variant={location.pathname === page.path ? "secondary" : "ghost"}
                  size="sm"
                  className={location.pathname === page.path 
                    ? "bg-amber-500 text-white hover:bg-amber-400" 
                    : "text-white/70 hover:text-white hover:bg-white/10"
                  }
                >
                  {page.name}
                </Button>
              </Link>
            ))}
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
