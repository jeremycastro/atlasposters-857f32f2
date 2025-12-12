import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Monitor, Tablet, Layout, Layers, Navigation, Search, ShoppingBag, Menu, ArrowDown, Eye, EyeOff, Fingerprint } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const MobileViewMethodology = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <Link to="/admin/knowledge">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Knowledge Base
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Smartphone className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Mobile View Methodology</h1>
          </div>
          <p className="text-muted-foreground">
            Design patterns, component architecture, and best practices for mobile-first wireframe development
          </p>
        </div>

        {/* Overview */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Mobile-First Philosophy</h2>
          <p className="text-foreground mb-4">
            Our wireframes follow a mobile-first design approach, where we design for the smallest 
            screen first and progressively enhance for larger viewports. This ensures optimal user 
            experience on mobile devices while maintaining design quality on desktop.
          </p>
          <div className="bg-primary/10 border-l-4 border-primary p-4 rounded">
            <p className="font-semibold">Core Principle:</p>
            <p className="text-sm text-muted-foreground">
              Design for thumb zones, optimize for touch targets, and prioritize content hierarchy 
              that works within the constraints of a small screen.
            </p>
          </div>
        </Card>

        {/* Viewport Breakpoints */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Viewport Breakpoints</h2>
          
          <div className="grid gap-4">
            <div className="flex items-center gap-4 p-4 border-2 border-primary rounded-lg">
              <Smartphone className="w-8 h-8 text-primary shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">Mobile</h3>
                  <Badge>Primary Focus</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  <code className="bg-muted px-1 rounded">max-width: 639px</code> — Single column layouts, 
                  bottom navigation, touch-optimized components
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <Tablet className="w-8 h-8 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Tablet</h3>
                <p className="text-sm text-muted-foreground">
                  <code className="bg-muted px-1 rounded">640px - 1023px</code> — Two-column grids, 
                  expanded navigation, hybrid layouts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <Monitor className="w-8 h-8 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Desktop</h3>
                <p className="text-sm text-muted-foreground">
                  <code className="bg-muted px-1 rounded">1024px+</code> — Multi-column layouts, 
                  sidebar navigation, hover states, expanded content
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Mobile Component Architecture */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Mobile Component Architecture</h2>
          <p className="text-muted-foreground mb-4">
            Each wireframe example uses a consistent set of mobile-specific components:
          </p>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">MobileHeader</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Sticky header with scroll-aware behavior (show/hide on scroll direction).
              </p>
              <div className="bg-muted/50 p-3 rounded text-sm">
                <p className="font-mono text-xs mb-2">Key Features:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Menu trigger (hamburger icon)</li>
                  <li>• Search trigger</li>
                  <li>• Logo/brand centered</li>
                  <li>• Cart and wishlist icons on right</li>
                  <li>• Scroll-based visibility toggle</li>
                </ul>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Menu className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">MobileNav</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Full-screen slide-in navigation drawer with hierarchical menu structure.
              </p>
              <div className="bg-muted/50 p-3 rounded text-sm">
                <p className="font-mono text-xs mb-2">Key Features:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Full viewport overlay</li>
                  <li>• Slide-in from left animation</li>
                  <li>• Main navigation links</li>
                  <li>• Category browsing section</li>
                  <li>• Account/login links</li>
                  <li>• Close on backdrop click</li>
                </ul>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">SearchOverlay</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Full-screen search experience with recent searches and suggestions.
              </p>
              <div className="bg-muted/50 p-3 rounded text-sm">
                <p className="font-mono text-xs mb-2">Key Features:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Fixed position overlay</li>
                  <li>• Auto-focus on input</li>
                  <li>• Recent searches list</li>
                  <li>• Popular categories</li>
                  <li>• Close button accessible</li>
                </ul>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">MobileFooter</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Accordion-based footer with collapsible link sections for mobile.
              </p>
              <div className="bg-muted/50 p-3 rounded text-sm">
                <p className="font-mono text-xs mb-2">Key Features:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Accordion for link categories</li>
                  <li>• Social media icons</li>
                  <li>• Newsletter signup</li>
                  <li>• Legal links (privacy, terms)</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Touch Interaction Patterns */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Fingerprint className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Touch Interaction Patterns</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Touch Target Sizes</h3>
              <p className="text-sm text-muted-foreground mb-3">
                All interactive elements must meet minimum touch target requirements:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
                  <p className="text-sm font-semibold text-green-600">✓ Recommended</p>
                  <p className="text-xs text-muted-foreground">44×44px minimum</p>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                  <p className="text-sm font-semibold text-yellow-600">⚠ Acceptable</p>
                  <p className="text-xs text-muted-foreground">36×36px minimum</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Thumb Zone Design</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Primary actions should be placed within the natural thumb reach zone:
              </p>
              <div className="bg-muted/50 p-4 rounded text-center">
                <div className="inline-block border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 w-48">
                  <div className="h-8 bg-red-200 rounded mb-2 text-xs flex items-center justify-center">Hard to reach</div>
                  <div className="h-12 bg-yellow-200 rounded mb-2 text-xs flex items-center justify-center">Moderate reach</div>
                  <div className="h-16 bg-green-200 rounded text-xs flex items-center justify-center font-semibold">Easy thumb zone</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Fixed Bottom Elements</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Key call-to-action elements should use fixed bottom positioning:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                <li>• <strong>Search bar:</strong> Fixed at bottom on hero, fades on scroll</li>
                <li>• <strong>Add to cart:</strong> Sticky bottom bar on product pages</li>
                <li>• <strong>Checkout button:</strong> Fixed bottom in cart drawer</li>
                <li>• <strong>Filter/Sort:</strong> Sticky bar below header on collection pages</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Scroll Behavior */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ArrowDown className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Scroll Behavior Patterns</h2>
          </div>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold">Show on Scroll Up</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Header reappears when user scrolls up, indicating intent to navigate.
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
                isVisible = currentScrollY &lt; lastScrollY
              </code>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <EyeOff className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold">Hide on Scroll Down</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Header hides when scrolling down to maximize content viewing area.
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
                isVisible = false when scrollY &gt; lastScrollY && scrollY &gt; 100
              </code>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Scroll Threshold Example</h3>
              <div className="bg-muted/50 p-3 rounded">
                <pre className="text-xs overflow-x-auto">
{`useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    // Background change threshold
    setIsScrolled(currentScrollY > 50);
    
    // Show/hide based on direction
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    
    setLastScrollY(currentScrollY);
  };
  
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, [lastScrollY]);`}
                </pre>
              </div>
            </div>
          </div>
        </Card>

        {/* Component File Structure */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Layout className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">File Structure</h2>
          </div>

          <div className="bg-muted/50 p-4 rounded font-mono text-sm">
            <pre className="overflow-x-auto text-xs">
{`src/pages/wireframes/examples/07/
├── index.tsx                    # Route exports
├── WireframeLayout.tsx          # Main layout wrapper
├── WireframeHome.tsx            # Homepage
├── WireframeCollection.tsx      # Collection/PLP
├── WireframeProduct.tsx         # Product detail page
└── components/
    ├── AnnouncementBar.tsx      # Top promo banner
    ├── MobileHeader.tsx         # Scroll-aware header
    ├── MobileNav.tsx            # Slide-in menu drawer
    ├── MobileFooter.tsx         # Accordion footer
    ├── SearchOverlay.tsx        # Full-screen search
    ├── HeroSection.tsx          # Hero with fixed search
    ├── DiscoveryCards.tsx       # Category cards
    ├── BestSellers.tsx          # Product grid section
    ├── TrustPropositions.tsx    # Trust badges
    └── ...                      # Additional sections`}
            </pre>
          </div>
        </Card>

        {/* Design Tokens */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Mobile-Specific Design Tokens</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Spacing</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-muted rounded">
                  <code>px-4</code> — Standard horizontal padding
                </div>
                <div className="p-2 bg-muted rounded">
                  <code>py-3</code> — Header vertical padding
                </div>
                <div className="p-2 bg-muted rounded">
                  <code>gap-1</code> — Tight icon spacing
                </div>
                <div className="p-2 bg-muted rounded">
                  <code>bottom-6</code> — Fixed element inset
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Touch Targets</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-muted rounded">
                  <code>h-10 w-10</code> — Icon buttons (40px)
                </div>
                <div className="p-2 bg-muted rounded">
                  <code>h-12</code> — Input fields (48px)
                </div>
                <div className="p-2 bg-muted rounded">
                  <code>h-14</code> — Primary CTAs (56px)
                </div>
                <div className="p-2 bg-muted rounded">
                  <code>min-h-[44px]</code> — Minimum touch target
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Z-Index Layers</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span>Fixed search bar</span>
                  <code>z-40</code>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span>Mobile header</span>
                  <code>z-50</code>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span>Navigation drawer</span>
                  <code>z-[60]</code>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span>Search overlay</span>
                  <code>z-[70]</code>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Checklist */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Mobile View Checklist</h2>
          
          <div className="space-y-3">
            {[
              "Header hides on scroll down, shows on scroll up",
              "All touch targets are at least 44×44px",
              "Primary CTAs are within thumb zone (bottom of screen)",
              "Navigation drawer slides in from left",
              "Search is accessible from header and/or fixed position",
              "Footer uses accordions for link categories",
              "Images are lazy-loaded",
              "No horizontal scroll on any viewport",
              "Form inputs have appropriate input types (tel, email, etc.)",
              "Modals/sheets use bottom drawer pattern",
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-2 border rounded">
                <div className="h-5 w-5 rounded border-2 border-primary shrink-0 mt-0.5" />
                <p className="text-sm">{item}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            Reference this methodology when building or reviewing mobile wireframes. 
            For wireframe examples, visit{" "}
            <Link to="/wireframes" className="text-primary hover:underline">
              /wireframes
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default MobileViewMethodology;
