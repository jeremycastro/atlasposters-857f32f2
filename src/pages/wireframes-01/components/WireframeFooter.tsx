import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Youtube, ArrowRight } from "lucide-react";

const footerLinks = {
  shop: [
    { label: "New Arrivals", href: "/wireframes-01/collection" },
    { label: "Best Sellers", href: "/wireframes-01/collection" },
    { label: "Collections", href: "/wireframes-01/collection" },
    { label: "Artists", href: "/wireframes-01/collection" },
    { label: "Gift Cards", href: "/wireframes-01/collection" },
  ],
  help: [
    { label: "FAQs", href: "/wireframes-01" },
    { label: "Shipping & Delivery", href: "/wireframes-01" },
    { label: "Returns & Refunds", href: "/wireframes-01" },
    { label: "Track Your Order", href: "/wireframes-01" },
    { label: "Contact Us", href: "/wireframes-01" },
  ],
  about: [
    { label: "Our Story", href: "/wireframes-01" },
    { label: "Sustainability", href: "/wireframes-01" },
    { label: "Careers", href: "/wireframes-01" },
    { label: "Press", href: "/wireframes-01" },
    { label: "Affiliates", href: "/wireframes-01" },
  ],
};

export function WireframeFooter() {
  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter Section */}
      <div className="border-b border-background/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto text-center space-y-4">
            <h3 className="font-['Playfair_Display'] text-2xl font-semibold">
              Join the Adventure
            </h3>
            <p className="text-background/80">
              Sign up for exclusive offers, new arrivals, and stories from the
              world of adventure art.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
              />
              <Button className="bg-background text-foreground hover:bg-background/90">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link to="/wireframes-01/home" className="inline-block mb-4">
              <span className="font-['Playfair_Display'] text-2xl font-bold">
                ATLAS
              </span>
              <span className="ml-1 text-xs tracking-widest text-background/60">
                POSTERS
              </span>
            </Link>
            <p className="text-sm text-background/70 mb-6 max-w-xs">
              The destination for adventure art. Museum-quality prints that
              inspire wanderlust and celebrate the spirit of exploration.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-background/60 hover:text-background transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-background/60 hover:text-background transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-background/60 hover:text-background transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-background/60 hover:text-background transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-medium mb-4">Help</h4>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="font-medium mb-4">About</h4>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/60">
            <p>© 2024 Atlas Posters. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/wireframes-01" className="hover:text-background">
                Privacy Policy
              </Link>
              <Link to="/wireframes-01" className="hover:text-background">
                Terms of Service
              </Link>
              <Link to="/wireframes-01" className="hover:text-background">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
