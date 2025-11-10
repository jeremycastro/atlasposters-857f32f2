import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import atlasIcon from "@/assets/atlas-icon.png";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img src={atlasIcon} alt="Atlas Posters" className="h-10 w-10" />
          <h1 className="text-xl font-atlas">Atlas Posters</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="/#why-atlas" className="text-sm font-medium hover:text-accent transition-colors">
            Why Atlas
          </a>
          <a href="/#partner" className="text-sm font-medium hover:text-accent transition-colors">
            Become a Partner
          </a>
        </div>

        <div className="flex items-center gap-4">
          <CartDrawer />
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 flex flex-col space-y-4">
            <a
              href="/#why-atlas"
              className="text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Why Atlas
            </a>
            <a
              href="/#partner"
              className="text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Become a Partner
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
