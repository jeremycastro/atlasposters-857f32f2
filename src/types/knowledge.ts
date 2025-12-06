/**
 * Knowledge Article Type Definitions
 * 
 * NOTE: This file contains legacy static definitions.
 * The Knowledge Base now uses TWO sources:
 * 
 * 1. STATIC REACT COMPONENTS - Rich pages defined in:
 *    - Article.tsx → staticArticleComponents map
 *    - static_article_versions DB table (for version tracking)
 *    
 * 2. DATABASE MARKDOWN - Simple articles in:
 *    - knowledge_articles table
 *    - knowledge_article_versions table
 * 
 * This file is kept for backward compatibility with components
 * that may reference knowledgeArticles directly.
 */

export interface KnowledgeArticle {
  id: string;
  title: string;
  description: string;
  category: KnowledgeCategory;
  route: string;
  icon: string;
  lastUpdated: string;
  tags: string[];
}

export type KnowledgeCategory = 
  | "Systems & Methodology"
  | "Workflows & Processes"
  | "Brand & Design"
  | "Technical Documentation"
  | "Developer Documentation";

export const knowledgeArticles: KnowledgeArticle[] = [
  // === Systems & Methodology ===
  {
    id: "sku-methodology",
    title: "Atlas SKU Methodology",
    description: "Understanding the Atlas Sequential Code (ASC) system and complete product SKU structure for artwork cataloging",
    category: "Systems & Methodology",
    route: "/admin/knowledge/article/sku-methodology",
    icon: "Hash",
    lastUpdated: "2025-12-04",
    tags: ["SKU", "ASC", "Catalog", "Database", "Product Codes", "Size Codes", "Framing"]
  },

  // === Workflows & Processes ===
  {
    id: "partner-management",
    title: "Partner Management Workflow",
    description: "Complete guide to onboarding partners, managing relationships, tracking agreements, and maintaining partner data",
    category: "Workflows & Processes",
    route: "/admin/knowledge/article/partner-management",
    icon: "Building2",
    lastUpdated: "2025-11-10",
    tags: ["Partners", "Onboarding", "Relationships", "Agreements", "Contacts"]
  },
  {
    id: "task-management",
    title: "Task Management Process",
    description: "How to effectively use the task system for project tracking, collaboration, status updates, and milestone delivery",
    category: "Workflows & Processes",
    route: "/admin/knowledge/article/task-management",
    icon: "CheckSquare",
    lastUpdated: "2025-11-10",
    tags: ["Tasks", "Projects", "Kanban", "Collaboration", "Workflows"]
  },
  {
    id: "product-importing",
    title: "Product Importing - Shopify/Syncio",
    description: "Bi-directional product flow documentation covering Syncio sync, partner product mapping, artwork creation, and sales reporting workflows",
    category: "Workflows & Processes",
    route: "/admin/knowledge/article/product-importing",
    icon: "ArrowRightLeft",
    lastUpdated: "2025-12-04",
    tags: ["Shopify", "Syncio", "Import", "Partner Products", "SKU Crosswalk", "Data Flow"]
  },

  // === Brand & Design ===
  {
    id: "brand-assets",
    title: "Brand Asset Guidelines",
    description: "Standards for brand logos, color systems, identity management, and asset organization across the platform",
    category: "Brand & Design",
    route: "/admin/knowledge/article/brand-assets",
    icon: "Palette",
    lastUpdated: "2025-11-10",
    tags: ["Branding", "Logos", "Colors", "Assets", "Design System"]
  },
  {
    id: "admin-brand-guide",
    title: "Atlas Admin Brand Guide",
    description: "Complete brand system for the Atlas Admin interface including typography, colors, design tokens, and component styling standards",
    category: "Brand & Design",
    route: "/admin/knowledge/article/admin-brand-guide",
    icon: "Palette",
    lastUpdated: "2025-11-12",
    tags: ["Brand", "Design System", "Typography", "Colors", "Components", "Admin UI"]
  },
  {
    id: "brand-story",
    title: "Atlas Brand Story & Messaging Guide",
    description: "Complete brand narrative, positioning, target audiences, messaging pillars, voice guidelines, and content frameworks for all marketing campaigns",
    category: "Brand & Design",
    route: "/admin/knowledge/article/brand-story",
    icon: "BookOpen",
    lastUpdated: "2025-11-12",
    tags: ["Brand", "Story", "Messaging", "Marketing", "Content", "Voice", "Positioning", "Campaigns"]
  },

  // === Technical Documentation ===
  {
    id: "artwork-catalog",
    title: "Artwork Catalog Architecture",
    description: "Complete architecture documentation for the Artwork Catalog module including database schema, frontend components, and ASC code system",
    category: "Technical Documentation",
    route: "/admin/knowledge/article/artwork-catalog",
    icon: "Image",
    lastUpdated: "2025-11-11",
    tags: ["Artworks", "ASC", "Database", "Architecture", "Components"]
  },
  {
    id: "prodigi-api",
    title: "Prodigi API Discovery",
    description: "Technical documentation for integrating with Prodigi's global print-on-demand fulfillment network including SKU structure, attributes system, and geographic routing",
    category: "Technical Documentation",
    route: "/admin/knowledge/article/prodigi-api",
    icon: "Globe",
    lastUpdated: "2025-12-04",
    tags: ["Prodigi", "API", "Print-on-Demand", "Fulfillment", "Integration", "SKU"]
  },
  {
    id: "readymades-framing",
    title: "Readymades.co Framing Discovery",
    description: "Comprehensive framing catalog documentation including frame collections, mount options, glaze types, SKU structure, and price band system",
    category: "Technical Documentation",
    route: "/admin/knowledge/article/readymades-framing",
    icon: "Frame",
    lastUpdated: "2025-12-04",
    tags: ["Readymades", "Framing", "Frames", "Mounts", "Glaze", "Price Bands", "SKU"]
  },

  // === Developer Documentation ===
  {
    id: "brand-story-exhibition-guide",
    title: "Brand Story Exhibition Pages",
    description: "How to build immersive, museum-quality storytelling experiences with database-driven content and custom React components",
    category: "Developer Documentation",
    route: "/admin/knowledge/article/brand-story-exhibition-guide",
    icon: "Presentation",
    lastUpdated: "2025-12-06",
    tags: ["Exhibition", "Brand Story", "React", "Database", "Timeline", "Design"]
  },
  {
    id: "knowledge-base-architecture",
    title: "Knowledge Base System Architecture",
    description: "System documentation for implementing and extending the Knowledge Base including database schema, components, hooks, and GitHub integration strategies",
    category: "Developer Documentation",
    route: "/admin/knowledge/article/knowledge-base-architecture",
    icon: "BookOpen",
    lastUpdated: "2025-12-06",
    tags: ["Knowledge Base", "Architecture", "Database", "Versioning", "GitHub", "Components"]
  },
];
