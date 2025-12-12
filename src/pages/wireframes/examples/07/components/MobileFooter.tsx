import { Instagram, Facebook, Twitter, Mail, MapPin } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const footerLinks = {
  shop: [
    { label: "New Arrivals", href: "#" },
    { label: "Best Sellers", href: "#" },
    { label: "Collections", href: "#" },
    { label: "Artists", href: "#" },
    { label: "Gift Cards", href: "#" },
  ],
  help: [
    { label: "FAQs", href: "#" },
    { label: "Shipping Info", href: "#" },
    { label: "Returns", href: "#" },
    { label: "Size Guide", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
  about: [
    { label: "Our Story", href: "#" },
    { label: "Press", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Sustainability", href: "#" },
  ],
};

export function MobileFooter() {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="px-4 py-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-xl font-bold">Atlas</span>
            <span className="text-xl font-bold text-amber-500">Posters</span>
          </div>
          <p className="text-sm text-background/60">
            Rare & Iconic Posters for the Adventurous Spirit
          </p>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-6">
          <a href="#" className="p-2 hover:bg-background/10 rounded-full transition-colors">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" className="p-2 hover:bg-background/10 rounded-full transition-colors">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" className="p-2 hover:bg-background/10 rounded-full transition-colors">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="#" className="p-2 hover:bg-background/10 rounded-full transition-colors">
            <Mail className="h-5 w-5" />
          </a>
        </div>

        {/* Accordion Links */}
        <Accordion type="single" collapsible className="space-y-0">
          <AccordionItem value="shop" className="border-background/20">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
              Shop
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 pb-2">
                {footerLinks.shop.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-background/70 hover:text-background">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="help" className="border-background/20">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
              Help
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 pb-2">
                {footerLinks.help.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-background/70 hover:text-background">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="about" className="border-background/20">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
              About
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 pb-2">
                {footerLinks.about.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-background/70 hover:text-background">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/20 px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-background/50">
          <p>© 2026 Atlas Posters. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-background">Privacy</a>
            <a href="#" className="hover:text-background">Terms</a>
            <a href="#" className="hover:text-background">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
