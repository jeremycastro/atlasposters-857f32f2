import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WireframeIndex05() {
  const pages = [
    {
      name: "Homepage",
      path: "/wireframes-05/home",
      description: "Hero with purpose-driven messaging, curated collections, and trust indicators",
    },
    {
      name: "Product Page",
      path: "/wireframes-05/product",
      description: "Immersive product experience with storytelling and clear CTAs",
    },
    {
      name: "Collection Page",
      path: "/wireframes-05/collection",
      description: "Filterable grid with editorial headers and smart organization",
    },
  ];

  const principles = [
    {
      title: "Clarity First",
      description: "Every element serves a purpose. No decoration without function.",
    },
    {
      title: "Story-Driven",
      description: "Products tell stories. The UI reveals them progressively.",
    },
    {
      title: "Trust Building",
      description: "Quality indicators, artist attribution, and transparent processes.",
    },
    {
      title: "Effortless Navigation",
      description: "Users find what they want in 3 clicks or less.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Hero */}
      <div className="bg-[#1c1c1c] text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-medium tracking-wider uppercase text-amber-400">
              Version 05 — Best Practices Synthesis
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-6">
            The Optimal<br />
            <span className="font-serif italic">Experience</span>
          </h1>
          <p className="text-lg text-white/70 max-w-xl leading-relaxed">
            A synthesis of proven patterns: minimal navigation, editorial depth, 
            museum sophistication, and premium presentation unified in one cohesive system.
          </p>
        </div>
      </div>

      {/* Design Principles */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-sm font-medium tracking-wider uppercase text-neutral-500 mb-8">
          Core Principles
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((principle, index) => (
            <div 
              key={principle.title}
              className="p-6 bg-white border border-neutral-200 hover:border-neutral-400 transition-colors"
            >
              <span className="text-xs text-neutral-400 mb-3 block">0{index + 1}</span>
              <h3 className="font-medium text-lg mb-2">{principle.title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Page Links */}
      <div className="container mx-auto px-6 pb-20">
        <h2 className="text-sm font-medium tracking-wider uppercase text-neutral-500 mb-8">
          Explore Pages
        </h2>
        <div className="space-y-4">
          {pages.map((page) => (
            <Link
              key={page.path}
              to={page.path}
              className="group flex items-center justify-between p-6 bg-white border border-neutral-200 hover:border-[#1c1c1c] hover:bg-[#1c1c1c] transition-all duration-300"
            >
              <div>
                <h3 className="text-xl font-medium mb-1 group-hover:text-white transition-colors">
                  {page.name}
                </h3>
                <p className="text-sm text-neutral-500 group-hover:text-white/70 transition-colors">
                  {page.description}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-neutral-400 group-hover:text-white group-hover:translate-x-2 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* What's Inside */}
      <div className="bg-[#1c1c1c] text-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-sm font-medium tracking-wider uppercase text-white/50 mb-8">
            Elements Combined
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-sm">
            <div>
              <h3 className="font-medium mb-3 text-amber-400">From Gallery Minimal</h3>
              <ul className="space-y-2 text-white/70">
                <li>• Clean category navigation</li>
                <li>• Generous whitespace</li>
                <li>• Focus on imagery</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3 text-amber-400">From Editorial & Museum</h3>
              <ul className="space-y-2 text-white/70">
                <li>• Strong typography hierarchy</li>
                <li>• Story-driven product pages</li>
                <li>• Archival sophistication</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3 text-amber-400">From Travel Premium</h3>
              <ul className="space-y-2 text-white/70">
                <li>• Trust bar with credentials</li>
                <li>• Curated collections</li>
                <li>• Premium presentation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
