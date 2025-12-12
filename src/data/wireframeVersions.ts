import { Type, Palette, Layout } from "lucide-react";

export interface WireframeVersion {
  version: string;
  title: string;
  reference: string | null;
  referenceUrl: string | null;
  status: string;
  published: boolean;
  description: string;
  designNotes: Array<{
    icon: typeof Type | typeof Palette | typeof Layout;
    label: string;
    value: string;
  }>;
  pages: Array<{
    name: string;
    path: string;
  }>;
  analysis: {
    uxStrengths: string[];
    uxWeaknesses: string[];
    seoStrengths: string[];
    seoWeaknesses: string[];
    recommendations: string[];
    overallScore: { ux: number; seo: number };
  };
}

// Helper to generate page paths based on context (admin vs public)
export const getPagePath = (version: string, page: string, isAdmin: boolean) => {
  const basePath = isAdmin 
    ? `/admin/wireframes/examples/${version}` 
    : `/wireframes/examples/${version}`;
  return page.toLowerCase() === 'index' ? basePath : `${basePath}/${page.toLowerCase()}`;
};

export const wireframeVersions: WireframeVersion[] = [
  {
    version: "01",
    title: "King & McGaw Inspired",
    reference: "kingart.com",
    referenceUrl: "https://www.kingart.com",
    status: "In Review",
    published: false,
    description: "Editorial aesthetic with bold serif typography, warm amber accents, and sophisticated gallery-style layouts.",
    designNotes: [
      { icon: Type, label: "Typography", value: "Playfair Display + Source Sans" },
      { icon: Palette, label: "Colors", value: "Warm amber accents on cream" },
      { icon: Layout, label: "Layout", value: "Editorial, gallery-focused" },
    ],
    pages: [
      { name: "Home", path: "home" },
      { name: "Product", path: "product" },
      { name: "Collection", path: "collection" },
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
    published: false,
    description: "Scandinavian minimalism with dark moody backgrounds, elegant serif typography, and clean sophisticated navigation.",
    designNotes: [
      { icon: Type, label: "Typography", value: "Cormorant Garamond + Inter" },
      { icon: Palette, label: "Colors", value: "Dark moody with warm accents" },
      { icon: Layout, label: "Layout", value: "Minimal, Scandinavian" },
    ],
    pages: [
      { name: "Home", path: "home" },
      { name: "Product", path: "product" },
      { name: "Collection", path: "collection" },
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
    published: false,
    description: "Contemporary Nordic style with promotional hero banners, countdown timers, category navigation, and conversion-focused product displays.",
    designNotes: [
      { icon: Type, label: "Typography", value: "DM Sans + System" },
      { icon: Palette, label: "Colors", value: "Clean white with bold accents" },
      { icon: Layout, label: "Layout", value: "Promotional, grid-heavy" },
    ],
    pages: [
      { name: "Home", path: "home" },
      { name: "Product", path: "product" },
      { name: "Collection", path: "collection" },
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
    title: "Stick No Bills Inspired",
    reference: "sticknobills.com",
    referenceUrl: "https://www.sticknobills.com",
    status: "In Review",
    published: false,
    description: "Bold travel-inspired aesthetic with dark navy backgrounds, destination-focused imagery, and premium vintage poster presentation.",
    designNotes: [
      { icon: Type, label: "Typography", value: "Playfair Display + Inter" },
      { icon: Palette, label: "Colors", value: "Navy blue with warm accents" },
      { icon: Layout, label: "Layout", value: "Premium, destination-focused" },
    ],
    pages: [
      { name: "Home", path: "home" },
      { name: "Product", path: "product" },
      { name: "Collection", path: "collection" },
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
    published: false,
    description: "A synthesis of proven patterns: minimal navigation, editorial depth, museum sophistication, and premium presentation unified in one cohesive system.",
    designNotes: [
      { icon: Type, label: "Typography", value: "System + Light weights" },
      { icon: Palette, label: "Colors", value: "Warm neutral with amber accents" },
      { icon: Layout, label: "Layout", value: "Balanced, purposeful" },
    ],
    pages: [
      { name: "Home", path: "home" },
      { name: "Product", path: "product" },
      { name: "Collection", path: "collection" },
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
    published: false,
    description: "Classic e-commerce aesthetic with red accents, category-focused navigation, trust badges, and a warm, approachable design that appeals to mainstream art buyers.",
    designNotes: [
      { icon: Type, label: "Typography", value: "Clean sans-serif headings" },
      { icon: Palette, label: "Colors", value: "White with red accents" },
      { icon: Layout, label: "Layout", value: "Traditional e-commerce grid" },
    ],
    pages: [
      { name: "Home", path: "home" },
      { name: "Product", path: "product" },
      { name: "Collection", path: "collection" },
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
  {
    version: "07",
    title: "Mobile-First Atlas",
    reference: null,
    referenceUrl: null,
    status: "Active",
    published: true, // This one is published by default
    description: "Mobile-first design with sticky header, 2x2 discovery cards, full-screen search overlay, email capture modal, and touch-optimized interactions.",
    designNotes: [
      { icon: Type, label: "Typography", value: "System fonts, bold headings" },
      { icon: Palette, label: "Colors", value: "White with amber/gold accents" },
      { icon: Layout, label: "Layout", value: "Phone-first, touch-optimized" },
    ],
    pages: [
      { name: "Home", path: "home" },
      { name: "Product", path: "product" },
      { name: "Collection", path: "collection" },
    ],
    analysis: {
      uxStrengths: [
        "Mobile-first approach ensures optimal phone experience",
        "Sticky header with smart hide/show reduces navigation friction",
        "Full-screen search overlay with trending terms aids discovery",
        "2x2 discovery cards provide quick category access with minimal scrolling",
      ],
      uxWeaknesses: [
        "Email popup may feel intrusive to some users",
        "Wireframe placeholders need real imagery to evaluate visual impact",
        "Desktop adaptation needs refinement for larger screens",
        "Limited product information visible in grid view",
      ],
      seoStrengths: [
        "Semantic HTML structure with proper heading hierarchy",
        "Mobile-first design aligns with Google's mobile-first indexing",
        "Clear category taxonomy supports topical clustering",
        "Product pages include detailed specifications",
      ],
      seoWeaknesses: [
        "Image placeholders reduce crawlable visual content",
        "Limited text content on homepage sections",
        "Missing structured data markup for products",
        "Blog or editorial content not integrated",
      ],
      recommendations: [
        "Add product schema markup for rich snippets",
        "Include more descriptive text in category sections",
        "Implement lazy loading for product images",
        "Add customer reviews for social proof and SEO value",
        "Create buying guides for frame sizes and care instructions",
      ],
      overallScore: { ux: 8, seo: 6 },
    },
  },
];
