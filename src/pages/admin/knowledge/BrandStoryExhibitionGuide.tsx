import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Presentation, 
  Database, 
  Palette, 
  Layout, 
  Code2, 
  Eye,
  Layers,
  FileText,
  Sparkles
} from "lucide-react";

const BrandStoryExhibitionGuide = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Presentation className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Brand Story Exhibition Pages</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            How to build immersive, museum-quality storytelling experiences
          </p>
        </div>

        {/* Overview */}
        <Card className="p-6 mb-6 border-l-4 border-l-primary">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-foreground mb-4">
            Exhibition pages are <strong>rich, interactive storytelling experiences</strong> that combine 
            visual design, structured data, and narrative flow. Unlike simple markdown articles, 
            these pages use custom React components to create museum-quality presentations.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">React Components</Badge>
            <Badge variant="outline">Database-Driven</Badge>
            <Badge variant="outline">Responsive Design</Badge>
            <Badge variant="outline">Animation Ready</Badge>
          </div>
        </Card>

        {/* When to Use */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">When to Use Exhibition Pages</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Perfect For
              </h4>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>• Brand history timelines</li>
                <li>• Artist portfolio showcases</li>
                <li>• Product evolution stories</li>
                <li>• Company milestones</li>
                <li>• Visual-heavy narratives</li>
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Use Markdown Instead For
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Technical documentation</li>
                <li>• Simple how-to guides</li>
                <li>• FAQs and quick references</li>
                <li>• Frequently updated content</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Architecture */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Architecture</h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg overflow-x-auto mb-6">
            <pre className="text-green-400 text-sm">
{`┌─────────────────────────────────────────────────────────────────┐
│                    EXHIBITION PAGE STACK                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  React Component (e.g., PosterHistoryExhibition.tsx)    │   │
│  │  └── Custom design, animations, layouts                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  React Query Hooks                                       │   │
│  │  └── useBrandStoryComponents()                          │   │
│  │  └── useBrandTimeline()                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Supabase Tables                                         │   │
│  │  └── brand_story_components (scope, title, content)     │   │
│  │  └── brand_story_timeline (event_date, title, content)  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘`}
            </pre>
          </div>
        </Card>

        {/* Database Tables */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Database Tables</h2>
          </div>

          <div className="space-y-6">
            {/* brand_story_components */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge>brand_story_components</Badge>
                <span className="text-sm text-muted-foreground">Primary content blocks</span>
              </h3>
              <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                <pre className="text-green-400 text-xs">
{`{
  id: UUID,
  scope: "atlas_global" | "brand_specific",  // Filter by context
  component_type: "intro" | "story" | "era" | "milestone",
  title: "The Golden Age",
  subtitle: "1920-1945",
  content: "## Main heading\\n> Quote block\\n- List items",
  tags: ["vintage", "history"],
  order_index: 1,
  status: "published" | "draft"
}`}</pre>
              </div>
            </div>

            {/* brand_story_timeline */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge>brand_story_timeline</Badge>
                <span className="text-sm text-muted-foreground">Chronological events</span>
              </h3>
              <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                <pre className="text-green-400 text-xs">
{`{
  id: UUID,
  scope: "atlas_global",
  event_date: "1925-01-01",
  event_type: "milestone" | "launch" | "award",
  title: "First Exhibition",
  content: "Markdown content describing the event...",
  featured_image_url: "/images/event.jpg",
  is_published: true
}`}</pre>
              </div>
            </div>
          </div>
        </Card>

        {/* Page Structure */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Layout className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Page Structure Pattern</h2>
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4 py-2">
              <h3 className="font-semibold">1. Hero Section</h3>
              <p className="text-sm text-muted-foreground">
                Full-width header with title, subtitle, and ambient visuals
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
                Filter by: component_type = "intro"
              </code>
            </div>

            <div className="border-l-4 border-accent pl-4 py-2">
              <h3 className="font-semibold">2. Visual Timeline Bar</h3>
              <p className="text-sm text-muted-foreground">
                Horizontal timeline with clickable era markers
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
                Map: eras.map(era =&gt; TimelineMarker)
              </code>
            </div>

            <div className="border-l-4 border-secondary pl-4 py-2">
              <h3 className="font-semibold">3. Era Cards (Expandable)</h3>
              <p className="text-sm text-muted-foreground">
                Collapsible sections with parsed markdown content
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
                Filter by: component_type = "era"
              </code>
            </div>

            <div className="border-l-4 border-muted-foreground pl-4 py-2">
              <h3 className="font-semibold">4. Closing Section</h3>
              <p className="text-sm text-muted-foreground">
                Summary, call-to-action, or continuation links
              </p>
            </div>
          </div>
        </Card>

        {/* Data Fetching */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Data Fetching Pattern</h2>
          </div>

          <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto mb-4">
            <pre className="text-green-400 text-sm">
{`import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fetch story components for exhibition page
const { data: storyData } = useQuery({
  queryKey: ["poster-history-story"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("brand_story_components")
      .select("*")
      .eq("scope", "atlas_global")
      .eq("status", "published")
      .order("order_index");
    
    if (error) throw error;
    return data;
  }
});

// Separate eras and intro content
const intro = storyData?.find(c => c.component_type === "intro");
const eras = storyData?.filter(c => c.component_type === "era") || [];`}</pre>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Hook Available</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Use <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">useBrandStoryComponents()</code> from 
              <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded ml-1">src/hooks/useBrandStory.ts</code> 
              for pre-built fetching with filters.
            </p>
          </div>
        </Card>

        {/* Content Rendering */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Content Rendering</h2>
          </div>

          <p className="text-foreground mb-4">
            The <code className="bg-muted px-2 py-1 rounded">content</code> field uses lightweight markdown 
            that gets parsed into styled React elements:
          </p>

          <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto mb-4">
            <pre className="text-green-400 text-sm">
{`function renderContent(content: string) {
  return content.split('\\n').map((line, i) => {
    // Main headings
    if (line.startsWith('## ')) {
      return <h3 key={i} className="text-xl font-bold mt-6 mb-3">
        {line.replace('## ', '')}
      </h3>;
    }
    // Subheadings
    if (line.startsWith('### ')) {
      return <h4 key={i} className="text-lg font-semibold mt-4 mb-2">
        {line.replace('### ', '')}
      </h4>;
    }
    // Blockquotes (featured text)
    if (line.startsWith('> ')) {
      return <blockquote key={i} className="border-l-4 border-primary 
        pl-4 my-4 italic text-muted-foreground">
        {line.replace('> ', '')}
      </blockquote>;
    }
    // List items
    if (line.startsWith('- ')) {
      return <li key={i} className="ml-4 text-foreground">
        {line.replace('- ', '')}
      </li>;
    }
    // Paragraphs
    if (line.trim()) {
      return <p key={i} className="text-foreground mb-3">{line}</p>;
    }
    return null;
  });
}`}</pre>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Markdown Input</h4>
              <pre className="text-xs bg-muted p-2 rounded">
{`## The Birth of an Art Form
> Art speaks where words fail

- Pioneered new techniques
- Influenced generations`}</pre>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Rendered Output</h4>
              <div className="space-y-2">
                <h3 className="text-lg font-bold">The Birth of an Art Form</h3>
                <blockquote className="border-l-4 border-primary pl-3 italic text-muted-foreground text-sm">
                  Art speaks where words fail
                </blockquote>
                <ul className="text-sm ml-4 list-disc">
                  <li>Pioneered new techniques</li>
                  <li>Influenced generations</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Styling Tokens */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Design System Tokens</h2>
          </div>

          <p className="text-foreground mb-4">
            Always use semantic tokens from the design system for consistent theming:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Colors</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-background border"></div>
                  <code className="text-xs">bg-background</code>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-foreground"></div>
                  <code className="text-xs">text-foreground</code>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-primary"></div>
                  <code className="text-xs">text-primary / bg-primary</code>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-muted"></div>
                  <code className="text-xs">bg-muted / text-muted-foreground</code>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border-2 border-border"></div>
                  <code className="text-xs">border-border</code>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Custom Brand Tokens</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-atlas-gold"></div>
                  <code className="text-xs">bg-atlas-gold / text-atlas-gold</code>
                </div>
                <p className="text-xs text-muted-foreground">
                  Defined in <code>tailwind.config.ts</code> and <code>index.css</code>
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">⚠️ Never Use Direct Colors</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-red-600 dark:text-red-400 font-mono">❌ text-white, bg-black, text-gray-500</p>
              </div>
              <div>
                <p className="text-green-600 dark:text-green-400 font-mono">✓ text-foreground, bg-background, text-muted-foreground</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Making Pages Public */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Making Pages Public</h2>

          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold">1. Create the Route</h3>
              <div className="bg-slate-900 p-3 rounded mt-2">
                <pre className="text-green-400 text-xs">
{`// App.tsx
<Route path="/poster-history" element={<PosterHistoryExhibition />} />`}</pre>
              </div>
            </div>

            <div className="border-l-4 border-accent pl-4">
              <h3 className="font-semibold">2. Add Navigation Link</h3>
              <div className="bg-slate-900 p-3 rounded mt-2">
                <pre className="text-green-400 text-xs">
{`// Navigation.tsx
<Link to="/poster-history" className="text-sm font-medium 
  hover:text-accent transition-colors">
  Poster History
</Link>`}</pre>
              </div>
            </div>

            <div className="border-l-4 border-secondary pl-4">
              <h3 className="font-semibold">3. Add Footer Link</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Update the footer component to include the new page in relevant sections
              </p>
            </div>
          </div>
        </Card>

        {/* Example Implementation */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <h2 className="text-2xl font-bold mb-4">Live Example</h2>
          <p className="text-foreground mb-4">
            See the Poster History Exhibition page for a complete implementation:
          </p>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="text-sm">
              📍 /poster-history
            </Badge>
            <Badge variant="outline" className="text-sm">
              📁 src/pages/admin/PosterHistoryExhibition.tsx
            </Badge>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default BrandStoryExhibitionGuide;
