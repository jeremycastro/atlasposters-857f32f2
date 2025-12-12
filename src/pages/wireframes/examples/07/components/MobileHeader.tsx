import { Menu, Search, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  onMenuOpen: () => void;
  onSearchOpen: () => void;
}

export function MobileHeader({ onMenuOpen, onSearchOpen }: MobileHeaderProps) {
  return (
    <header className="bg-background border-b border-border/50">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left: Menu + Search */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMenuOpen}
            className="h-10 w-10"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onSearchOpen}
            className="h-10 w-10"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>

        {/* Center: Logo */}
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold tracking-tight">Atlas</span>
          <span className="text-lg font-bold tracking-tight text-amber-600">Posters</span>
        </div>

        {/* Right: Heart + Cart */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-600 text-[10px] font-bold text-white flex items-center justify-center">
              2
            </span>
            <span className="sr-only">Cart</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
