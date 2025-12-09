import { Link } from "react-router-dom";
import { ExternalLink, Eye, Layout, Palette, Type, Users, Search, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

const wireframeVersions = [
  {
    version: "01",
    title: "King & McGaw Inspired",
    reference: "kingart.com",
    referenceUrl: "https://www.kingart.com",
    status: "In Review",
    description: "Editorial aesthetic with bold serif typography, warm amber accents, and sophisticated gallery-style layouts.",
    designNotes: [
      { icon: Type, label: "Typography", value: "Playfair Display + Source Sans" },
      { icon: Palette, label: "Colors", value: "Warm amber accents on cream" },
      { icon: Layout, label: "Layout", value: "Editorial, gallery-focused" },
    ],
    pages: [
      { name: "Home", path: "/wireframes/examples/01/home" },
      { name: "Product", path: "/wireframes/examples/01/product" },
      { name: "Collection", path: "/wireframes/examples/01/collection" },
    ],
    analysis: {
      uxStrengths: [
        "Clear visual hierarchy with editorial typography creates sophisticated feel",
        "Well-organized category grid enables easy navigation and discovery",
        "Trust bar with shipping/quality messaging builds customer confidence",
        "Consistent product card design with clear pricing reduces cognitive load",
      ],
      uxWeaknesses: [
        "Dense 6-column product grid may overwhelm users on mobile devices",
        "No visible search functionality in header limits discoverability",
        "Newsletter section lacks clear value proposition differentiator",
        "Limited filtering options visible on collection pages",
      ],
      seoStrengths: [
        "Semantic heading structure (H1, H2) used appropriately throughout",
        "Descriptive link text with 'View All' patterns aids crawlability",
        "Good use of alt text patterns for product images",
        "Clear category taxonomy supports topical authority",
      ],
      seoWeaknesses: [
        "Missing breadcrumb navigation for deeper category/product pages",
        "No structured data / schema markup visible for products",
        "Category pages lack meta description guidance in templates",
        "Image-heavy sections lack supporting text content",
      ],
      recommendations: [
        "Add prominent search bar in navigation for improved discoverability",
        "Implement breadcrumbs for collection/product pages to improve navigation and SEO",
        "Add lazy-loading for product grid images to improve Core Web Vitals",
        "Include FAQ or content sections on category pages for long-tail SEO",
        "Implement Product schema markup for rich snippets in search results",
      ],
      overallScore: { ux: 7, seo: 6 },
    },
  },
  {
    version: "02",
    title: "The Poster Club Inspired",
    reference: "theposterclub.com",
    referenceUrl: "https://theposterclub.com",
    status: "In Review",
    description: "Scandinavian minimalism with dark moody backgrounds, elegant serif typography, and clean sophisticated navigation.",
    designNotes: [
      { icon: Type, label: "Typography", value: "Cormorant Garamond + Inter" },
      { icon: Palette, label: "Colors", value: "Dark moody with warm accents" },
      { icon: Layout, label: "Layout", value: "Minimal, Scandinavian" },
    ],
    pages: [
      { name: "Home", path: "/wireframes/examples/02/home" },
      { name: "Product", path: "/wireframes/examples/02/product" },
      { name: "Collection", path: "/wireframes/examples/02/collection" },
    ],
    analysis: {
      uxStrengths: [
        "Dramatic full-bleed hero creates strong first impression and brand recall",
        "Clean, minimal navigation reduces cognitive load and decision fatigue",
        "Featured artists section builds trust and adds personality",
        "Consistent dark theme creates premium, gallery-like aesthetic",
      ],
      uxWeaknesses: [
        "Dark navigation on dark background may have accessibility contrast issues",
        "Icon-only navigation buttons lack discoverability for new users",
        "Long-scroll layout may hide important conversion CTAs below fold",
        "Limited product information visible without interaction",
      ],
      seoStrengths: [
        "Clear H1 with brand messaging establishes page topic",
        "Artist attribution improves content relevance and uniqueness",
        "Good semantic section structure aids content understanding",
        "Clean URL structure visible in navigation patterns",
      ],
      seoWeaknesses: [
        "Very image-heavy with minimal text content reduces crawlable content",
        "Navigation links use generic text ('Art Prints') vs descriptive phrases",
        "Missing H2 semantic structure in some content sections",
        "No visible internal linking strategy beyond main navigation",
      ],
      recommendations: [
        "Increase text content in category sections for improved SEO signals",
        "Add sticky 'Add to Cart' or CTA on scroll to improve conversions",
        "Implement ARIA labels for icon-only buttons to improve accessibility",
        "Add product collection descriptions for topical relevance",
        "Consider adding a blog or editorial section for content marketing",
      ],
      overallScore: { ux: 8, seo: 5 },
    },
  },
  {
    version: "03",
    title: "Desenio Inspired",
    reference: "desenio.com",
    referenceUrl: "https://www.desenio.com",
    status: "In Review",
    description: "Contemporary Nordic style with promotional hero banners, countdown timers, category navigation, and conversion-focused product displays.",
    designNotes: [
      { icon: Type, label: "Typography", value: "DM Sans + System" },
      { icon: Palette, label: "Colors", value: "Clean white with bold accents" },
      { icon: Layout, label: "Layout", value: "Promotional, grid-heavy" },
    ],
    pages: [
      { name: "Home", path: "/wireframes/examples/03/home" },
      { name: "Product", path: "/wireframes/examples/03/product" },
      { name: "Collection", path: "/wireframes/examples/03/collection" },
    ],
    analysis: {
      uxStrengths: [
        "Prominent promotional banners with countdown timers create urgency",
        "Clear category navigation with visual thumbnails aids discovery",
        "Product cards show frame/size options inline for faster decisions",
        "Sticky add-to-cart on product pages improves conversion flow",
      ],
      uxWeaknesses: [
        "Heavy promotional focus may feel aggressive to some users",
        "Multiple banner rotations can cause decision fatigue",
        "Dense product grids may overwhelm on mobile viewports",
        "Sale messaging dominates, potentially devaluing brand perception",
      ],
      seoStrengths: [
        "Category-focused navigation supports topical clustering",
        "Product pages include detailed specifications for long-tail keywords",
        "Breadcrumb navigation visible on collection pages",
        "Clear heading hierarchy throughout pages",
      ],
      seoWeaknesses: [
        "Promotional/sale content may lack evergreen SEO value",
        "Category pages light on descriptive text content",
        "Limited blog or content marketing integration visible",
        "Product descriptions could be more unique and detailed",
      ],
      recommendations: [
        "Balance promotional content with evergreen category descriptions",
        "Add room inspiration galleries to increase time on site",
        "Implement product schema markup for rich snippets",
        "Create buying guides for frame sizes to capture long-tail traffic",
        "Add customer reviews section for social proof and fresh content",
      ],
      overallScore: { ux: 7, seo: 6 },
    },
  },
  {
    version: "04",
    title: "Travel Premium Style",
    reference: null,
    referenceUrl: null,
    status: "In Review",
    description: "Bold travel-inspired aesthetic with dark navy backgrounds, destination-focused imagery, and premium vintage poster presentation.",
    designNotes: [
      { icon: Type, label: "Typography", value: "Playfair Display + Inter" },
      { icon: Palette, label: "Colors", value: "Navy blue with warm accents" },
      { icon: Layout, label: "Layout", value: "Premium, destination-focused" },
    ],
    pages: [
      { name: "Home", path: "/wireframes/examples/04/home" },
      { name: "Product", path: "/wireframes/examples/04/product" },
      { name: "Collection", path: "/wireframes/examples/04/collection" },
    ],
    analysis: {
      uxStrengths: [
        "Strong destination-based navigation creates intuitive browsing experience",
        "Trust bar with licensing/quality badges builds immediate credibility",
        "Full-bleed hero slider creates immersive first impression",
        "Clear framing options on product pages simplify purchase decisions",
      ],
      uxWeaknesses: [
        "Dark theme may reduce readability in bright environments",
        "Hero slider auto-rotation can be disorienting for some users",
        "Limited category visibility in initial navigation view",
        "Frame selection could benefit from visual preview",
      ],
      seoStrengths: [
        "Destination-based taxonomy creates strong topical clusters",
        "Product pages include detailed specifications and artist info",
        "Clear heading hierarchy with H1-H3 structure",
        "Image alt text includes destination and artist keywords",
      ],
      seoWeaknesses: [
        "Limited text content on homepage for search crawlers",
        "Category landing pages need more descriptive content",
        "Missing FAQ sections for long-tail keyword targeting",
        "Blog or editorial content not prominently featured",
      ],
      recommendations: [
        "Add destination guides to capture travel-related search traffic",
        "Implement product schema markup for rich snippets",
        "Create artist profile pages for additional SEO value",
        "Add customer review sections for fresh content signals",
        "Consider adding a vintage poster history section for content marketing",
      ],
      overallScore: { ux: 8, seo: 6 },
    },
  },
  {
    version: "05",
    title: "Best Practices Synthesis",
    reference: null,
    referenceUrl: null,
    status: "New",
    description: "A synthesis of proven patterns: minimal navigation, editorial depth, museum sophistication, and premium presentation unified in one cohesive system.",
    designNotes: [
      { icon: Type, label: "Typography", value: "System + Light weights" },
      { icon: Palette, label: "Colors", value: "Warm neutral with amber accents" },
      { icon: Layout, label: "Layout", value: "Balanced, purposeful" },
    ],
    pages: [
      { name: "Home", path: "/wireframes/examples/05/home" },
      { name: "Product", path: "/wireframes/examples/05/product" },
      { name: "Collection", path: "/wireframes/examples/05/collection" },
    ],
    analysis: {
      uxStrengths: [
        "Clean navigation with category pills enables quick browsing",
        "Trust indicators visible immediately build confidence",
        "Editorial story sections add depth without overwhelming",
        "Curated collections provide discovery without choice paralysis",
      ],
      uxWeaknesses: [
        "Light theme may lack the premium feel of darker alternatives",
        "Could benefit from more visual variation in product grid",
        "Newsletter placement in footer may reduce signups",
        "Limited animation may feel less engaging",
      ],
      seoStrengths: [
        "Strong heading hierarchy throughout all pages",
        "Rich text content supports crawlability",
        "Artist attribution and product stories add unique content",
        "Clean semantic HTML structure",
      ],
      seoWeaknesses: [
        "Could add more structured data markup",
        "FAQ sections would help capture long-tail keywords",
        "Blog integration not visible",
        "Category descriptions could be more detailed",
      ],
      recommendations: [
        "Add product schema markup for rich search results",
        "Include customer reviews for social proof and SEO",
        "Create size guides and care instructions for helpful content",
        "Add breadcrumbs to all product and collection pages",
        "Consider adding room visualization features",
      ],
      overallScore: { ux: 8, seo: 7 },
    },
  },
  {
    version: "06",
    title: "FramedArt.com Inspired",
    reference: "framedart.com",
    referenceUrl: "https://www.framedart.com",
    status: "New",
    description: "Classic e-commerce aesthetic with red accents, category-focused navigation, trust badges, and a warm, approachable design that appeals to mainstream art buyers.",
    designNotes: [
      { icon: Type, label: "Typography", value: "Clean sans-serif headings" },
      { icon: Palette, label: "Colors", value: "White with red accents" },
      { icon: Layout, label: "Layout", value: "Traditional e-commerce grid" },
    ],
    pages: [
      { name: "Home", path: "/wireframes/examples/06/home" },
      { name: "Product", path: "/wireframes/examples/06/product" },
      { name: "Collection", path: "/wireframes/examples/06/collection" },
    ],
    analysis: {
      uxStrengths: [
        "Strong trust signals with customer reviews and ratings prominently displayed",
        "Category cards with images enable intuitive browsing by style or room",
        "Clear pricing and frame customization options reduce purchase friction",
        "Traditional layout familiar to mainstream e-commerce shoppers",
      ],
      uxWeaknesses: [
        "Dense category grid may overwhelm new visitors",
        "Classic design may feel dated compared to modern competitors",
        "Hero carousel auto-rotation can be distracting",
        "Mobile navigation could be more streamlined",
      ],
      seoStrengths: [
        "Category-focused structure creates strong topical clusters",
        "Customer reviews provide fresh, unique content",
        "Clear heading hierarchy and breadcrumbs aid crawlability",
        "Product specifications support long-tail keywords",
      ],
      seoWeaknesses: [
        "Homepage is image-heavy with limited crawlable text",
        "Category descriptions could be more detailed",
        "Missing FAQ sections for common queries",
        "Blog or editorial content not prominently featured",
      ],
      recommendations: [
        "Add product schema markup for rich snippets in search",
        "Include more text content in category header sections",
        "Create room inspiration guides for content marketing",
        "Add customer photos and reviews for social proof",
        "Implement lazy loading for improved Core Web Vitals",
      ],
      overallScore: { ux: 7, seo: 6 },
    },
  },
];

const ScoreIndicator = ({ label, score }: { label: string; score: number }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}/10</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all ${getProgressColor(score)}`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  );
};

const AnalysisSection = ({ 
  items, 
  type 
}: { 
  items: string[]; 
  type: "strength" | "weakness" 
}) => {
  const Icon = type === "strength" ? CheckCircle : AlertCircle;
  const iconColor = type === "strength" ? "text-green-600" : "text-amber-600";
  
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-sm">
          <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${iconColor}`} />
          <span className="text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
};

const Wireframes = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-bold text-xl tracking-tight">
              ATLAS
            </Link>
            <Badge variant="outline" className="font-mono text-xs">
              Wireframes
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground hidden sm:block">
            Storefront Design Explorations
          </p>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Wireframe Gallery
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore our design explorations for the Atlas storefront. Each version represents
            a different aesthetic direction inspired by leading art retailers, with detailed UX and SEO analysis.
          </p>
        </div>
      </section>

      {/* Wireframe Versions */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {wireframeVersions.map((wireframe) => (
            <Card key={wireframe.version} className="overflow-hidden flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    VERSION {wireframe.version}
                  </span>
                  <Badge variant="secondary">{wireframe.status}</Badge>
                </div>
                <CardTitle className="text-2xl">{wireframe.title}</CardTitle>
                <CardDescription className="text-base">
                  {wireframe.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 flex-1 flex flex-col">
                {/* Design Notes */}
                <div className="grid grid-cols-3 gap-3">
                  {wireframe.designNotes.map((note) => (
                    <div
                      key={note.label}
                      className="rounded-lg bg-muted/50 p-4 text-center"
                    >
                      <note.icon className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">{note.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{note.value}</p>
                    </div>
                  ))}
                </div>

                {/* Reference */}
                <div className="flex items-center justify-between py-3 border-y">
                  <span className="text-sm text-muted-foreground">Design Reference:</span>
                  <a
                    href={wireframe.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    {wireframe.reference}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {/* Overall Scores */}
                <div className="flex gap-6 p-4 bg-muted/30 rounded-lg">
                  <ScoreIndicator label="UX Score" score={wireframe.analysis.overallScore.ux} />
                  <ScoreIndicator label="SEO Score" score={wireframe.analysis.overallScore.seo} />
                </div>

                {/* Analysis Accordion */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="ux-analysis" className="border-none">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline py-3 px-4 bg-muted/30 rounded-lg data-[state=open]:rounded-b-none">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        UX Analysis
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-3 bg-muted/10 rounded-b-lg">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-2">Strengths</h4>
                          <AnalysisSection items={wireframe.analysis.uxStrengths} type="strength" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-2">Areas for Improvement</h4>
                          <AnalysisSection items={wireframe.analysis.uxWeaknesses} type="weakness" />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="seo-analysis" className="border-none mt-2">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline py-3 px-4 bg-muted/30 rounded-lg data-[state=open]:rounded-b-none">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-primary" />
                        SEO Analysis
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-3 bg-muted/10 rounded-b-lg">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-2">Strengths</h4>
                          <AnalysisSection items={wireframe.analysis.seoStrengths} type="strength" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-2">Areas for Improvement</h4>
                          <AnalysisSection items={wireframe.analysis.seoWeaknesses} type="weakness" />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="recommendations" className="border-none mt-2">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline py-3 px-4 bg-muted/30 rounded-lg data-[state=open]:rounded-b-none">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Recommendations
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-3 bg-muted/10 rounded-b-lg">
                      <ul className="space-y-2">
                        {wireframe.analysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-muted-foreground">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Page Links */}
                <div className="space-y-3 mt-auto">
                  <p className="text-sm font-medium">Pages</p>
                  <div className="flex flex-wrap gap-2">
                    {wireframe.pages.map((page) => (
                      <Button key={page.path} asChild variant="outline" size="sm">
                        <Link to={page.path}>
                          <Eye className="h-3 w-3 mr-1.5" />
                          {page.name}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* View Full Set */}
                <Button asChild className="w-full">
                  <Link to={`/wireframes/examples/${wireframe.version}`}>
                    View Full Wireframe Set
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Atlas Storefront Wireframes • For Internal Review</p>
        </div>
      </footer>
    </div>
  );
};

export default Wireframes;
