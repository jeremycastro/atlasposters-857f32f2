import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Database, 
  Code2, 
  GitBranch, 
  Layers,
  FileCode,
  History,
  FolderTree,
  CheckCircle2,
  Github
} from "lucide-react";

const KnowledgeBaseArchitecture = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Knowledge Base Architecture</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            System documentation for implementing and extending the Knowledge Base
          </p>
        </div>

        {/* Overview */}
        <Card className="p-6 mb-6 border-l-4 border-l-primary">
          <h2 className="text-2xl font-bold mb-4">System Overview</h2>
          <p className="text-foreground mb-4">
            The Knowledge Base supports <strong>two types of articles</strong>, each with its own 
            versioning mechanism and use case:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-primary mb-2">Static React Components</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Rich, beautifully designed pages with full React power
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Custom layouts and animations</li>
                <li>• Data visualizations and diagrams</li>
                <li>• Interactive elements</li>
                <li>• Version archived as .v1.tsx files</li>
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-semibold mb-2">Database Markdown</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Simple content stored in database with basic rendering
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Quick to create and update</li>
                <li>• Content editor friendly</li>
                <li>• Limited styling options</li>
                <li>• Versions stored in DB table</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Database Schema */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Database Schema</h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg overflow-x-auto mb-6">
            <pre className="text-green-400 text-sm">
{`┌─────────────────────────────────────────────────────────────────────────┐
│                        KNOWLEDGE BASE SCHEMA                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────┐         ┌─────────────────────────────────┐   │
│  │ knowledge_categories│         │ knowledge_articles              │   │
│  ├─────────────────────┤         ├─────────────────────────────────┤   │
│  │ id (PK)             │◄────────│ category_id (FK)                │   │
│  │ category_key        │         │ id (PK)                         │   │
│  │ display_name        │         │ slug (unique)                   │   │
│  │ icon                │         │ title                           │   │
│  │ color               │         │ description                     │   │
│  │ sort_order          │         │ current_version_id (FK) ────────┼───┐
│  │ is_active           │         │ is_published                    │   │
│  └─────────────────────┘         │ tags[]                          │   │
│                                   └─────────────────────────────────┘   │
│                                                      │                  │
│                                                      ▼                  │
│                                   ┌─────────────────────────────────┐   │
│                                   │ knowledge_article_versions      │◄──┘
│                                   ├─────────────────────────────────┤
│                                   │ id (PK)                         │
│                                   │ article_id (FK)                 │
│                                   │ version_number                  │
│                                   │ content_markdown                │
│                                   │ change_summary                  │
│                                   │ created_by (FK → profiles)      │
│                                   │ created_at                      │
│                                   └─────────────────────────────────┘
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ static_article_versions (for React component versioning)        │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │ id (PK)                                                          │   │
│  │ slug (e.g., "product-importing")                                 │   │
│  │ version_number                                                   │   │
│  │ component_path (e.g., "./archive/ProductImporting.v1.tsx")       │   │
│  │ change_summary                                                   │   │
│  │ is_current                                                       │   │
│  │ archived_at                                                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘`}
            </pre>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4">
              <Badge className="mb-2">knowledge_categories</Badge>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li><strong>category_key</strong>: URL-safe identifier</li>
                <li><strong>display_name</strong>: Human-readable name</li>
                <li><strong>icon</strong>: Lucide icon name</li>
                <li><strong>color</strong>: Theme color for badges</li>
                <li><strong>sort_order</strong>: Display ordering</li>
              </ul>
            </div>
            <div className="border border-border rounded-lg p-4">
              <Badge className="mb-2">knowledge_articles</Badge>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li><strong>slug</strong>: URL path identifier</li>
                <li><strong>current_version_id</strong>: Points to active version</li>
                <li><strong>is_published</strong>: Visibility toggle</li>
                <li><strong>tags[]</strong>: Searchable keywords</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Component Library */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileCode className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Component Library</h2>
          </div>

          <p className="text-foreground mb-4">
            Located in <code className="bg-muted px-2 py-1 rounded">src/components/knowledge/</code>
          </p>

          <div className="space-y-3">
            {[
              { name: "KnowledgeArticleViewer.tsx", desc: "Displays article with metadata, badges, and content" },
              { name: "MarkdownRenderer.tsx", desc: "Parses markdown to styled HTML" },
              { name: "VersionHistoryPanel.tsx", desc: "Sidebar list of all article versions" },
              { name: "VersionPreviewDialog.tsx", desc: "Modal to preview old version content" },
              { name: "RestoreVersionDialog.tsx", desc: "Confirmation modal for version restore" },
              { name: "StaticArticleVersionDropdown.tsx", desc: "Dropdown for selecting static article versions" },
              { name: "ArchivedVersionBanner.tsx", desc: "Alert banner when viewing archived version" },
            ].map((comp) => (
              <div key={comp.name} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Code2 className="w-4 h-4 mt-1 text-primary shrink-0" />
                <div>
                  <code className="text-sm font-medium">{comp.name}</code>
                  <p className="text-xs text-muted-foreground">{comp.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Barrel Export</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              All components exported from <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">src/components/knowledge/index.ts</code>
            </p>
          </div>
        </Card>

        {/* Hooks */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Data Hooks</h2>
          </div>

          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge>useKnowledgeBase.ts</Badge>
                <span className="text-sm text-muted-foreground">Database articles</span>
              </div>
              <div className="bg-slate-900 p-3 rounded">
                <pre className="text-green-400 text-xs">
{`useKnowledgeCategories()      // All categories
useKnowledgeArticles(opts)    // Articles with filters
useKnowledgeArticle(slug)     // Single article by slug
useArticleVersions(articleId) // Version history
useArticleVersion(versionId)  // Single version`}</pre>
              </div>
            </div>

            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge>useKnowledgeMutations.ts</Badge>
                <span className="text-sm text-muted-foreground">CRUD operations</span>
              </div>
              <div className="bg-slate-900 p-3 rounded">
                <pre className="text-green-400 text-xs">
{`useCreateArticle()   // Create new article + v1
useUpdateArticle()   // Update article metadata
useDeleteArticle()   // Delete article + versions
useCreateVersion()   // Add new version
useRestoreVersion()  // Restore old version
useTogglePublish()   // Publish/unpublish`}</pre>
              </div>
            </div>

            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">useStaticArticleVersions.ts</Badge>
                <span className="text-sm text-muted-foreground">React component versioning</span>
              </div>
              <div className="bg-slate-900 p-3 rounded">
                <pre className="text-green-400 text-xs">
{`useStaticArticleVersions(slug)    // All versions for slug
useStaticArticleVersion(slug, v)  // Specific version
useCurrentStaticVersion(slug)     // Current version number
useCreateStaticVersion()          // Create new version
parseVersionedSlug(slug)          // Parse "page-v1" → { baseSlug, version }`}</pre>
              </div>
            </div>
          </div>
        </Card>

        {/* Static Article System */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Static Article Versioning</h2>
          </div>

          <p className="text-foreground mb-4">
            Static React components use a file-based versioning system combined with database tracking:
          </p>

          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold">1. Register Component</h3>
              <div className="bg-slate-900 p-3 rounded mt-2">
                <pre className="text-green-400 text-xs">
{`// Article.tsx - staticArticleComponents map
const staticArticleComponents = {
  "product-importing": lazy(() => import("./ProductImporting")),
  "brand-story": lazy(() => import("./BrandStory")),
  // ... other components
};`}</pre>
              </div>
            </div>

            <div className="border-l-4 border-accent pl-4">
              <h3 className="font-semibold">2. Archive Old Version (when updating)</h3>
              <div className="bg-slate-900 p-3 rounded mt-2">
                <pre className="text-green-400 text-xs">
{`// 1. Copy current file to archive folder with version suffix
src/pages/admin/knowledge/ProductImporting.tsx
  → src/pages/admin/knowledge/archive/ProductImporting.v1.tsx

// 2. Register in archive/index.ts
export const archivedComponents = {
  "product-importing": {
    1: lazy(() => import("./ProductImporting.v1")),
  },
};

// 3. Insert record in static_article_versions table
INSERT INTO static_article_versions (slug, version_number, component_path, ...)
VALUES ('product-importing', 1, './archive/ProductImporting.v1.tsx', ...);`}</pre>
              </div>
            </div>

            <div className="border-l-4 border-secondary pl-4">
              <h3 className="font-semibold">3. URL Pattern</h3>
              <div className="bg-muted p-3 rounded mt-2">
                <p className="text-sm font-mono">
                  <span className="text-muted-foreground">/admin/knowledge/article/</span>
                  <span className="text-primary">product-importing</span> → Current version
                </p>
                <p className="text-sm font-mono">
                  <span className="text-muted-foreground">/admin/knowledge/article/</span>
                  <span className="text-primary">product-importing-v1</span> → Archived v1
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* File Structure */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FolderTree className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">File Structure</h2>
          </div>

          <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
            <pre className="text-green-400 text-sm">
{`src/
├── components/knowledge/
│   ├── index.ts                      # Barrel export
│   ├── KnowledgeArticleViewer.tsx    # Main viewer component
│   ├── MarkdownRenderer.tsx          # MD → HTML
│   ├── VersionHistoryPanel.tsx       # Version list sidebar
│   ├── VersionPreviewDialog.tsx      # Preview modal
│   ├── RestoreVersionDialog.tsx      # Restore confirmation
│   ├── StaticArticleVersionDropdown.tsx
│   └── ArchivedVersionBanner.tsx
│
├── hooks/
│   ├── useKnowledgeBase.ts           # Query hooks
│   ├── useKnowledgeMutations.ts      # Mutation hooks
│   └── useStaticArticleVersions.ts   # Static versioning
│
├── pages/admin/knowledge/
│   ├── Article.tsx                   # Main article router
│   ├── ProductImporting.tsx          # Static article (current)
│   ├── BrandStory.tsx                # Static article (current)
│   ├── ArtworkCatalog.tsx            # Static article (current)
│   └── archive/
│       ├── index.ts                  # Archive registry
│       └── ArtworkCatalog.v1.tsx     # Archived version
│
└── types/
    └── knowledge.ts                  # Type definitions`}</pre>
          </div>
        </Card>

        {/* GitHub Integration */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Github className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">GitHub Integration & Code Sharing</h2>
          </div>

          <p className="text-foreground mb-4">
            Strategies for sharing the Knowledge Base system across projects:
          </p>

          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Option A: Shared npm Package</h3>
                <Badge variant="outline">Recommended</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Extract to a private npm package like <code>@your-org/knowledge-base</code>
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Semantic versioning for updates</li>
                <li>• Easy to install in any project</li>
                <li>• Requires npm registry (GitHub Packages or npm)</li>
              </ul>
            </div>

            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="w-5 h-5" />
                <h3 className="font-semibold">Option B: Git Submodules</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Shared directory synced across repos
              </p>
              <div className="bg-slate-900 p-2 rounded mt-2">
                <pre className="text-green-400 text-xs">
{`git submodule add git@github.com:org/knowledge-base.git src/features/knowledge`}</pre>
              </div>
            </div>

            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="w-5 h-5" />
                <h3 className="font-semibold">Option C: Monorepo</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Both projects in one repo with shared packages
              </p>
              <div className="bg-slate-900 p-2 rounded mt-2">
                <pre className="text-green-400 text-xs">
{`monorepo/
├── apps/
│   ├── atlas/           # This project
│   └── other-project/   # Another project
└── packages/
    └── knowledge-base/  # Shared components & hooks`}</pre>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Current Setup</h4>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Lovable projects use <strong>bidirectional GitHub sync</strong>. Changes push automatically 
              to your connected repo. To share code, extract components to a separate package or use 
              the monorepo approach with pnpm workspaces.
            </p>
          </div>
        </Card>

        {/* Implementation Checklist */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <h2 className="text-2xl font-bold mb-4">Implementation Checklist</h2>
          <p className="text-muted-foreground mb-4">
            For implementing this system in a new project:
          </p>

          <div className="space-y-3">
            {[
              "Create 4 database tables with migrations (categories, articles, versions, static_versions)",
              "Add RPC functions for version management",
              "Copy component library to src/components/knowledge/",
              "Copy hooks to src/hooks/",
              "Configure Tailwind theme tokens (if different design system)",
              "Set up RLS policies for data access",
              "Create routes in App.tsx (/admin/knowledge/*)",
              "Add navigation links to admin sidebar",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-2 bg-background rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default KnowledgeBaseArchitecture;
