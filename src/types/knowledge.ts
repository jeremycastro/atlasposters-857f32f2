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
  | "Technical Documentation";

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: "sku-methodology",
    title: "Atlas SKU Methodology",
    description: "Understanding the Atlas Sequential Code (ASC) system and complete product SKU structure for artwork cataloging",
    category: "Systems & Methodology",
    route: "/admin/knowledge/sku-methodology",
    icon: "Hash",
    lastUpdated: "2024-11-10",
    tags: ["SKU", "ASC", "Catalog", "Database", "Product Codes"]
  },
  {
    id: "partner-management",
    title: "Partner Management Workflow",
    description: "Complete guide to onboarding partners, managing relationships, tracking agreements, and maintaining partner data",
    category: "Workflows & Processes",
    route: "/admin/knowledge/partner-management",
    icon: "Building2",
    lastUpdated: "2024-11-10",
    tags: ["Partners", "Onboarding", "Relationships", "Agreements", "Contacts"]
  },
  {
    id: "brand-assets",
    title: "Brand Asset Guidelines",
    description: "Standards for brand logos, color systems, identity management, and asset organization across the platform",
    category: "Brand & Design",
    route: "/admin/knowledge/brand-assets",
    icon: "Palette",
    lastUpdated: "2024-11-10",
    tags: ["Branding", "Logos", "Colors", "Assets", "Design System"]
  },
  {
    id: "task-management",
    title: "Task Management Process",
    description: "How to effectively use the task system for project tracking, collaboration, status updates, and milestone delivery",
    category: "Workflows & Processes",
    route: "/admin/knowledge/task-management",
    icon: "CheckSquare",
    lastUpdated: "2024-11-10",
    tags: ["Tasks", "Projects", "Kanban", "Collaboration", "Workflows"]
  }
];
