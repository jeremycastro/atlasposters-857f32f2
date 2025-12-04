import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface Technology {
  name: string;
  category: string;
  description: string;
  version?: string;
  url?: string;
  purpose: string;
}

const technologies: Technology[] = [
  {
    name: "Lovable",
    category: "Development Platform",
    description: "AI-powered web application builder and hosting platform",
    url: "https://lovable.dev",
    purpose: "Primary development environment, deployment, and project management",
  },
  {
    name: "React",
    category: "Frontend Framework",
    description: "JavaScript library for building user interfaces",
    version: "18.3.1",
    url: "https://react.dev",
    purpose: "Core UI framework for building component-based interfaces",
  },
  {
    name: "TypeScript",
    category: "Programming Language",
    description: "Typed superset of JavaScript",
    url: "https://www.typescriptlang.org",
    purpose: "Type safety and enhanced developer experience",
  },
  {
    name: "Vite",
    category: "Build Tool",
    description: "Next-generation frontend tooling",
    url: "https://vitejs.dev",
    purpose: "Fast development server and optimized production builds",
  },
  {
    name: "Tailwind CSS",
    category: "Styling",
    description: "Utility-first CSS framework",
    url: "https://tailwindcss.com",
    purpose: "Rapid UI development with consistent design system",
  },
  {
    name: "Supabase",
    category: "Backend (Lovable Cloud)",
    description: "Open-source Firebase alternative with PostgreSQL",
    url: "https://supabase.com",
    purpose: "Database, authentication, storage, and edge functions",
  },
  {
    name: "PostgreSQL",
    category: "Database",
    description: "Advanced open-source relational database",
    url: "https://www.postgresql.org",
    purpose: "Primary data storage for artwork catalog, products, and user data",
  },
  {
    name: "React Query (TanStack Query)",
    category: "State Management",
    description: "Powerful data synchronization for React",
    version: "5.83.0",
    url: "https://tanstack.com/query",
    purpose: "Server state management, caching, and data fetching",
  },
  {
    name: "React Router",
    category: "Routing",
    description: "Declarative routing for React applications",
    version: "6.30.1",
    url: "https://reactrouter.com",
    purpose: "Client-side routing and navigation",
  },
  {
    name: "Zustand",
    category: "State Management",
    description: "Small, fast, scalable state management",
    version: "5.0.8",
    url: "https://zustand-demo.pmnd.rs",
    purpose: "Client-side global state (cart, UI preferences)",
  },
  {
    name: "Shopify Storefront API",
    category: "E-commerce",
    description: "GraphQL API for Shopify storefronts",
    version: "2025-07",
    url: "https://shopify.dev/docs/api/storefront",
    purpose: "Product data fetching and e-commerce integration",
  },
  {
    name: "Shopify Admin API",
    category: "E-commerce",
    description: "REST/GraphQL API for Shopify admin operations",
    url: "https://shopify.dev/docs/api/admin",
    purpose: "Product sync, inventory management, and order processing",
  },
  {
    name: "shadcn/ui",
    category: "Component Library",
    description: "Re-usable components built with Radix UI and Tailwind",
    url: "https://ui.shadcn.com",
    purpose: "Accessible, customizable UI components",
  },
  {
    name: "Radix UI",
    category: "UI Primitives",
    description: "Unstyled, accessible components for React",
    url: "https://www.radix-ui.com",
    purpose: "Foundation for accessible UI components",
  },
  {
    name: "Lucide React",
    category: "Icons",
    description: "Beautiful & consistent icon toolkit",
    version: "0.462.0",
    url: "https://lucide.dev",
    purpose: "Icon system throughout the application",
  },
  {
    name: "React Hook Form",
    category: "Forms",
    description: "Performant, flexible forms with easy validation",
    version: "7.61.1",
    url: "https://react-hook-form.com",
    purpose: "Form state management and validation",
  },
  {
    name: "Zod",
    category: "Validation",
    description: "TypeScript-first schema validation",
    version: "3.25.76",
    url: "https://zod.dev",
    purpose: "Type-safe data validation and schema definition",
  },
  {
    name: "Prodigi",
    category: "Print-on-Demand",
    description: "Global print fulfillment network with 50+ production facilities worldwide",
    url: "https://www.prodigi.com",
    purpose: "Print production, framing, and worldwide fulfillment for custom products via API integration",
  },
  {
    name: "Readymades",
    category: "Manufacturing Partner",
    description: "Premium custom framing manufacturer with extensive frame collections (acquired by Prodigi)",
    url: "https://www.readymades.co",
    purpose: "Frame catalog reference and quality framing options available through Prodigi integration",
  },
];

const categories = Array.from(new Set(technologies.map((t) => t.category)));

const TechStack = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Tech Stack</h1>
          <p className="text-muted-foreground">
            Technologies, frameworks, and tools powering Atlas Posters
          </p>
        </div>

        {/* Technologies by Category */}
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                {category}
                <Badge variant="secondary">
                  {technologies.filter((t) => t.category === category).length}
                </Badge>
              </h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                {technologies
                  .filter((tech) => tech.category === category)
                  .map((tech) => (
                    <div
                      key={tech.name}
                      className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-colors"
                    >
                      {/* Tech Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            {tech.name}
                          </h3>
                          {tech.version && (
                            <Badge variant="outline" className="text-xs">
                              v{tech.version}
                            </Badge>
                          )}
                        </div>
                        {tech.url && (
                          <a
                            href={tech.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-3">
                        {tech.description}
                      </p>

                      {/* Purpose */}
                      <div className="pt-3 border-t border-border">
                        <p className="text-xs font-medium text-foreground mb-1">
                          Purpose:
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tech.purpose}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">Technology Principles</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong>Platform Agnostic:</strong> Architecture designed to work with multiple e-commerce platforms</li>
            <li>• <strong>Scalable:</strong> Database and infrastructure ready to handle millions of artworks</li>
            <li>• <strong>Type Safe:</strong> TypeScript and Zod ensure data integrity throughout the stack</li>
            <li>• <strong>Modern Standards:</strong> Latest versions with long-term support and active communities</li>
            <li>• <strong>Developer Experience:</strong> Fast builds, hot reload, and excellent tooling</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default TechStack;
