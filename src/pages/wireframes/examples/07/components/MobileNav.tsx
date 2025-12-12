import { X, ChevronRight, User, Package, Heart, HelpCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainLinks = [
  { label: "Shop All", href: "#" },
  { label: "New Arrivals", href: "#", badge: "New" },
  { label: "Best Sellers", href: "#" },
  { label: "Collections", href: "#" },
  { label: "Artists", href: "#" },
];

const categories = [
  { label: "Travel Posters", href: "#" },
  { label: "Movie Posters", href: "#" },
  { label: "Botanical Prints", href: "#" },
  { label: "Vintage Ads", href: "#" },
  { label: "Photography", href: "#" },
];

const accountLinks = [
  { label: "Sign In", href: "#", icon: LogIn },
  { label: "My Orders", href: "#", icon: Package },
  { label: "Wishlist", href: "#", icon: Heart },
  { label: "Help & FAQ", href: "#", icon: HelpCircle },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/50"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-background shadow-xl animate-in slide-in-from-left duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold">Atlas</span>
            <span className="text-lg font-bold text-amber-600">Posters</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100vh-65px)]">
          {/* Main Links */}
          <nav className="p-4">
            <ul className="space-y-1">
              {mainLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="font-medium">{link.label}</span>
                    <div className="flex items-center gap-2">
                      {link.badge && (
                        <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded">
                          {link.badge}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <Separator />

          {/* Categories */}
          <div className="p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Browse by Category
            </h3>
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <a 
                    href={cat.href}
                    className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-muted transition-colors text-sm"
                  >
                    <span>{cat.label}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Account Links */}
          <div className="p-4">
            <ul className="space-y-1">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-muted transition-colors text-sm"
                  >
                    <link.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
