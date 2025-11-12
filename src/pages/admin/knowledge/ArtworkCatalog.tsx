import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Image, Database, Code, Lock, Layers, GitBranch, ArrowLeft } from "lucide-react";

const ArtworkCatalog = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <Link to="/admin/knowledge">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Knowledge Base
          </Button>
        </Link>

        <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Image className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Artwork Catalog Architecture</h1>
              <p className="text-muted-foreground mt-1">
                Complete technical documentation for the Artwork Catalog module
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">Technical Documentation</Badge>
            <Badge variant="outline">Database Schema</Badge>
            <Badge variant="outline">Frontend Architecture</Badge>
          </div>
        </div>

        <Separator />

        {/* Overview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Module Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The Artwork Catalog is the central module for managing artwork submissions, tracking ASC codes, 
              and organizing the complete artwork lifecycle from draft to active status.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Key Features:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Automated ASC (Atlas Sequential Code) generation with decade-based system</li>
                <li>Partner-based artwork submission and management</li>
                <li>Status lifecycle management (draft → active → archived)</li>
                <li>File attachment system for artwork files with metadata tracking</li>
                <li>Full audit trail through asc_history table</li>
                <li>Advanced search and filtering capabilities</li>
                <li>Role-based access control (Admin, Partner, Public)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Hierarchy & Relationships Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Data Hierarchy & Relationships
            </CardTitle>
            <CardDescription>Understanding the Partner → Brand → Artwork → Product structure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Hierarchy Overview</h4>
              <p className="text-sm text-muted-foreground">
                The system follows a strict hierarchical structure where each entity is a child of the one above it.
              </p>
              <div className="bg-muted/50 p-6 rounded-lg overflow-x-auto">
                <pre className="text-sm whitespace-pre-wrap font-mono">
{`┌─────────────────────────────────────────────────────────┐
│  PARTNER (Top Level)                                    │
│  Table: partners                                        │
│  • The organization or individual providing artworks    │
│  • Required: partner_name, status                       │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ├── partner_id (foreign key)
                        ↓
        ┌───────────────────────────────────────┐
        │  BRAND (Optional)                     │
        │  Table: brands                        │
        │  • A partner can have multiple brands │
        │  • Required: brand_name, partner_id   │
        └─────────────────┬─────────────────────┘
                          │
                          ├── brand_id (optional foreign key)
                          │   partner_id (required foreign key)
                          ↓
          ┌───────────────────────────────────────────┐
          │  ARTWORK                                  │
          │  Table: artworks                          │
          │  • Must belong to a partner               │
          │  • Can optionally be linked to a brand    │
          │  • Required: title, partner_id, asc_code  │
          └─────────────────┬─────────────────────────┘
                            │
                            ├── artwork_id (foreign key)
                            ↓
            ┌─────────────────────────────────────┐
            │  PRODUCT                            │
            │  Table: products                    │
            │  • Physical products from artworks  │
            │  • Required: product_name,          │
            │    artwork_id, product_type_id      │
            └─────────────────────────────────────┘`}
                </pre>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Relationship Rules</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                <li>
                  <strong>Partner → Artwork:</strong> Every artwork must have exactly one partner (partner_id is required).
                </li>
                <li>
                  <strong>Brand → Artwork:</strong> An artwork can optionally belong to a brand. If linked, the brand must belong to the same partner.
                </li>
                <li>
                  <strong>Artwork → Product:</strong> An artwork can have zero or more products created from it (e.g., posters, prints, merchandise).
                </li>
                <li>
                  <strong>Partner → Brand:</strong> A partner can have multiple brands, but a brand belongs to exactly one partner.
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Database References</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Foreign key relationships that enforce data integrity:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2 font-mono text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">→</span>
                  <div>
                    <strong>artworks.partner_id</strong> → <strong>partners.id</strong>
                    <p className="text-xs text-muted-foreground mt-1 font-sans">Every artwork is linked to a partner</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">→</span>
                  <div>
                    <strong>artworks.brand_id</strong> → <strong>brands.id</strong>
                    <p className="text-xs text-muted-foreground mt-1 font-sans">Optional link to a brand (nullable)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">→</span>
                  <div>
                    <strong>brands.partner_id</strong> → <strong>partners.id</strong>
                    <p className="text-xs text-muted-foreground mt-1 font-sans">Every brand belongs to a partner</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">→</span>
                  <div>
                    <strong>products.artwork_id</strong> → <strong>artworks.id</strong>
                    <p className="text-xs text-muted-foreground mt-1 font-sans">Products are created from artworks</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Practical Example</h4>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                <p className="font-semibold">Scenario: A partner submits artwork</p>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Partner created:</strong> "ABC Art Studios" (partners table)</li>
                  <li><strong>Brand created (optional):</strong> "ABC Modern Collection" linked to ABC Art Studios</li>
                  <li><strong>Artwork submitted:</strong> "Sunset Dreams" linked to ABC Art Studios and optionally to "ABC Modern Collection"</li>
                  <li><strong>Products created:</strong> "Sunset Dreams Poster 18x24" and "Sunset Dreams Canvas 24x36" both linked to the "Sunset Dreams" artwork</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Schema Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Schema
            </CardTitle>
            <CardDescription>Core tables and relationships</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Artworks Table */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">artworks Table</h4>
              <p className="text-sm text-muted-foreground">
                Main table storing all artwork records with metadata and tracking information.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2 font-mono text-sm">
                <div><strong>id</strong> uuid PRIMARY KEY</div>
                <div><strong>asc_code</strong> text UNIQUE NOT NULL - Generated ASC code</div>
                <div><strong>sequence_number</strong> integer NOT NULL - Sequential number from asc_sequence</div>
                <div><strong>title</strong> text NOT NULL</div>
                <div><strong>artist_name</strong> text</div>
                <div><strong>description</strong> text</div>
                <div><strong>art_medium</strong> text - Painting, sculpture, photography, etc.</div>
                <div><strong>year_created</strong> integer</div>
                <div><strong>original_dimensions</strong> text - HxWxD format</div>
                <div><strong>partner_id</strong> uuid NOT NULL REFERENCES profiles(id)</div>
                <div><strong>brand_id</strong> uuid REFERENCES brands(id)</div>
                <div><strong>created_by</strong> uuid REFERENCES profiles(id)</div>
                <div><strong>status</strong> artwork_status DEFAULT 'draft' - draft | active | archived</div>
                <div><strong>is_exclusive</strong> boolean DEFAULT false</div>
                <div><strong>rights_start_date</strong> date</div>
                <div><strong>rights_end_date</strong> date</div>
                <div><strong>tags</strong> text[]</div>
                <div><strong>metadata</strong> jsonb DEFAULT '{}'</div>
                <div><strong>created_at</strong> timestamptz DEFAULT now()</div>
                <div><strong>updated_at</strong> timestamptz DEFAULT now()</div>
              </div>
            </div>

            {/* Artwork Files Table */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">artwork_files Table</h4>
              <p className="text-sm text-muted-foreground">
                Stores file attachments for artworks with comprehensive metadata.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2 font-mono text-sm">
                <div><strong>id</strong> uuid PRIMARY KEY</div>
                <div><strong>artwork_id</strong> uuid NOT NULL REFERENCES artworks(id)</div>
                <div><strong>file_name</strong> text NOT NULL</div>
                <div><strong>file_path</strong> text NOT NULL - Storage bucket path</div>
                <div><strong>file_type</strong> text NOT NULL - original | print | thumbnail</div>
                <div><strong>file_size</strong> bigint</div>
                <div><strong>mime_type</strong> text</div>
                <div><strong>dimensions</strong> text - Pixel dimensions</div>
                <div><strong>dpi</strong> integer</div>
                <div><strong>color_profile</strong> text - RGB, CMYK, etc.</div>
                <div><strong>is_primary</strong> boolean DEFAULT false</div>
                <div><strong>uploaded_by</strong> uuid REFERENCES profiles(id)</div>
                <div><strong>uploaded_at</strong> timestamptz DEFAULT now()</div>
                <div><strong>metadata</strong> jsonb DEFAULT '{}'</div>
              </div>
            </div>

            {/* ASC History Table */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">asc_history Table</h4>
              <p className="text-sm text-muted-foreground">
                Audit trail for ASC code assignments and lifecycle changes.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2 font-mono text-sm">
                <div><strong>id</strong> uuid PRIMARY KEY</div>
                <div><strong>asc_code</strong> text NOT NULL</div>
                <div><strong>artwork_id</strong> uuid REFERENCES artworks(id)</div>
                <div><strong>status</strong> asc_status NOT NULL - assigned | voided | reassigned</div>
                <div><strong>assigned_by</strong> uuid REFERENCES profiles(id)</div>
                <div><strong>assigned_at</strong> timestamptz DEFAULT now()</div>
                <div><strong>voided_by</strong> uuid REFERENCES profiles(id)</div>
                <div><strong>voided_at</strong> timestamptz</div>
                <div><strong>void_reason</strong> text</div>
                <div><strong>notes</strong> text</div>
              </div>
            </div>

            {/* Database Functions */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Database Functions</h4>
              <div className="space-y-3">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="font-mono text-sm mb-2"><strong>generate_next_asc()</strong> → text</div>
                  <p className="text-sm text-muted-foreground">
                    Generates the next ASC code using the format: DDLnnn
                  </p>
                  <ul className="text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>• <strong>DD</strong>: Decade digit (10 for 2020s, 11 for 2030s, etc.)</li>
                    <li>• <strong>L</strong>: Letter code (A-Z cycling based on sequence)</li>
                    <li>• <strong>nnn</strong>: 3-digit number (000-999)</li>
                  </ul>
                  <div className="bg-background p-2 rounded mt-2 text-xs font-mono">
                    Example: 10A001, 10A002... 10B000, 10B001...
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Flow Diagram */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Data Flow Architecture
            </CardTitle>
            <CardDescription>Component relationships and data mutations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Artwork Creation Flow</h4>
              <div className="bg-muted/50 p-4 rounded-lg overflow-x-auto">
                <pre className="text-xs whitespace-pre-wrap">
{`User Clicks 'New Artwork'
  ↓
CreateArtworkDialog Opens
  ↓
Form Validation (Zod Schema)
  ↓
Valid? → No → Show Validation Errors
  ↓ Yes
useArtworkMutations.createArtwork()
  ↓
Check Auth User
  ↓
Generate ASC Code via generate_next_asc()
  ↓
Insert into artworks table
  ↓
Log to asc_history table
  ↓
Invalidate React Query Cache
  ↓
Show Success Toast
  ↓
Close Dialog
  ↓
Grid Refreshes with New Artwork`}
                </pre>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Component Hierarchy</h4>
              <div className="bg-muted/50 p-4 rounded-lg overflow-x-auto">
                <pre className="text-xs whitespace-pre-wrap">
{`ArtworkCatalog (Page)
├── ArtworkStats Component
│   └── useArtworkStats Hook
├── Search Input
├── ArtworkCardView Component
│   ├── useArtworks Hook
│   ├── Card per Artwork
│   └── Dropdown Menu (Actions)
├── CreateArtworkDialog
│   ├── useForm (react-hook-form)
│   ├── useArtworkMutations.createArtwork
│   └── useProfiles (Partner Select)
└── ArtworkDetailDialog
    ├── useArtworkById Hook
    ├── useArtworkMutations.updateArtwork
    └── useArtworkMutations.archiveArtwork`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Frontend Architecture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Frontend Architecture
            </CardTitle>
            <CardDescription>React hooks, components, and state management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hooks Section */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Custom Hooks</h4>
              
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="font-mono text-sm mb-2"><strong>useArtworks(filters?)</strong></div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Query hook for fetching and filtering artworks with related data.
                  </p>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <div>• Returns: <code>&#123; data, isLoading, error &#125;</code></div>
                    <div>• Filters: search, status[], tags[], isExclusive, dateFrom, dateTo</div>
                    <div>• Includes: created_by_profile, partner_profile (joined data)</div>
                    <div>• Ordering: created_at DESC</div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="font-mono text-sm mb-2"><strong>useArtworkById(id)</strong></div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Query hook for fetching a single artwork with file attachments.
                  </p>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <div>• Returns: <code>&#123; data, isLoading, error &#125;</code></div>
                    <div>• Includes: created_by_profile, artwork_files</div>
                    <div>• Enabled only when id is provided</div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="font-mono text-sm mb-2"><strong>useArtworkStats()</strong></div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Query hook for fetching artwork statistics summary.
                  </p>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <div>• Returns: <code>&#123; total, active, draft, archived &#125;</code></div>
                    <div>• Aggregates status counts across all artworks</div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="font-mono text-sm mb-2"><strong>useArtworkMutations</strong></div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Mutation hooks for creating, updating, and archiving artworks.
                  </p>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <div>• <strong>createArtwork</strong>: Handles ASC generation and history logging</div>
                    <div>• <strong>updateArtwork</strong>: Updates artwork fields by ID</div>
                    <div>• <strong>archiveArtwork</strong>: Sets status to 'archived'</div>
                    <div>• All mutations invalidate relevant queries and show toasts</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Components Section */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Key Components</h4>
              
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="font-mono text-sm mb-2"><strong>ArtworkCatalog</strong> (Page)</div>
                  <p className="text-sm text-muted-foreground">
                    Main page component managing state and orchestrating child components.
                  </p>
                  <div className="text-xs space-y-1 text-muted-foreground mt-2">
                    <div>• Manages search, dialog visibility, and selected artwork state</div>
                    <div>• Handles view, edit, and archive actions</div>
                    <div>• Coordinates between card view and detail dialog</div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="font-mono text-sm mb-2"><strong>ArtworkStats</strong></div>
                  <p className="text-sm text-muted-foreground">
                    Displays summary statistics in a responsive grid of cards.
                  </p>
                  <div className="text-xs space-y-1 text-muted-foreground mt-2">
                    <div>• Shows: Total, Active, Draft, Archived counts</div>
                    <div>• Loading state with skeleton placeholders</div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="font-mono text-sm mb-2"><strong>ArtworkCardView</strong></div>
                  <p className="text-sm text-muted-foreground">
                    Grid display of artwork cards with action menus.
                  </p>
                  <div className="text-xs space-y-1 text-muted-foreground mt-2">
                    <div>• Responsive grid layout</div>
                    <div>• Color-coded status badges</div>
                    <div>• Dropdown menu: View Details, Edit, Archive</div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="font-mono text-sm mb-2"><strong>CreateArtworkDialog</strong></div>
                  <p className="text-sm text-muted-foreground">
                    Form dialog for creating new artworks with validation.
                  </p>
                  <div className="text-xs space-y-1 text-muted-foreground mt-2">
                    <div>• Zod schema validation</div>
                    <div>• React Hook Form integration</div>
                    <div>• Admin: Can assign to any partner</div>
                    <div>• Partner: Auto-assigned to self</div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="font-mono text-sm mb-2"><strong>ArtworkDetailDialog</strong></div>
                  <p className="text-sm text-muted-foreground">
                    Tabbed view showing complete artwork details and metadata.
                  </p>
                  <div className="text-xs space-y-1 text-muted-foreground mt-2">
                    <div>• Details Tab: Core artwork information</div>
                    <div>• Metadata Tab: System tracking fields</div>
                    <div>• Actions: Copy ASC, Edit, Archive</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Model */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security Model & RLS Policies
            </CardTitle>
            <CardDescription>Row-Level Security implementation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">artworks Table Policies</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="font-mono text-xs bg-background p-2 rounded mb-1">
                      SELECT | "Active artworks are publicly viewable"
                    </div>
                    <p className="text-muted-foreground ml-2">
                      Anyone can view artworks with status = 'active' (no authentication required)
                    </p>
                  </div>
                  
                  <div>
                    <div className="font-mono text-xs bg-background p-2 rounded mb-1">
                      SELECT | "Partners can view own artworks"
                    </div>
                    <p className="text-muted-foreground ml-2">
                      Partners can view all artworks where partner_id = auth.uid() (any status)
                    </p>
                  </div>
                  
                  <div>
                    <div className="font-mono text-xs bg-background p-2 rounded mb-1">
                      ALL | "Admins can manage all artworks"
                    </div>
                    <p className="text-muted-foreground ml-2">
                      Users with 'admin' role can perform any operation via has_role() function
                    </p>
                  </div>
                  
                  <div>
                    <div className="font-mono text-xs bg-background p-2 rounded mb-1">
                      INSERT | "Partners can create artworks"
                    </div>
                    <p className="text-muted-foreground ml-2">
                      Partners can only insert artworks where partner_id = auth.uid()
                    </p>
                  </div>
                  
                  <div>
                    <div className="font-mono text-xs bg-background p-2 rounded mb-1">
                      UPDATE | "Partners can update own artworks"
                    </div>
                    <p className="text-muted-foreground ml-2">
                      Partners can update artworks where partner_id = auth.uid()
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">artwork_files Table Policies</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="font-mono text-xs bg-background p-2 rounded mb-1">
                      SELECT | "Anyone can view files for active artworks"
                    </div>
                    <p className="text-muted-foreground ml-2">
                      Public access to files for artworks with status = 'active'
                    </p>
                  </div>
                  
                  <div>
                    <div className="font-mono text-xs bg-background p-2 rounded mb-1">
                      ALL | "Partners can manage own artwork files"
                    </div>
                    <p className="text-muted-foreground ml-2">
                      Full access to files for artworks where partner_id = auth.uid()
                    </p>
                  </div>
                  
                  <div>
                    <div className="font-mono text-xs bg-background p-2 rounded mb-1">
                      ALL | "Admins can manage all artwork files"
                    </div>
                    <p className="text-muted-foreground ml-2">
                      Complete access for admin role users
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">asc_history Table Policies</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="font-mono text-xs bg-background p-2 rounded mb-1">
                      INSERT | "System can log ASC history"
                    </div>
                    <p className="text-muted-foreground ml-2">
                      Allows automated logging during artwork creation (used by mutations)
                    </p>
                  </div>
                  
                  <div>
                    <div className="font-mono text-xs bg-background p-2 rounded mb-1">
                      SELECT | "Admins can view ASC history"
                    </div>
                    <p className="text-muted-foreground ml-2">
                      Admin users can view complete audit trail
                    </p>
                  </div>
                  
                  <div>
                    <div className="font-mono text-xs bg-background p-2 rounded mb-1">
                      SELECT | "Partners can view own ASC history"
                    </div>
                    <p className="text-muted-foreground ml-2">
                      Partners can view history for their own artworks only
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Points */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Points</CardTitle>
            <CardDescription>How this module connects with other systems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Partner Management</h4>
                <p className="text-sm text-muted-foreground">
                  • Artworks are linked to partners via <code className="bg-background px-1 py-0.5 rounded">partner_id</code>
                </p>
                <p className="text-sm text-muted-foreground">
                  • Partner profile data is joined for display (company name, contact info)
                </p>
                <p className="text-sm text-muted-foreground">
                  • Admin can assign artworks to any partner, partners only see/manage own artworks
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Brand System</h4>
                <p className="text-sm text-muted-foreground">
                  • Artworks can be associated with brands via optional <code className="bg-background px-1 py-0.5 rounded">brand_id</code>
                </p>
                <p className="text-sm text-muted-foreground">
                  • Supports multi-brand partners with separate brand identities
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Product Creation (Future)</h4>
                <p className="text-sm text-muted-foreground">
                  • Artworks serve as the base for product creation
                </p>
                <p className="text-sm text-muted-foreground">
                  • ASC code becomes the first part of product SKUs (ASC-TYPE-VARIANT)
                </p>
                <p className="text-sm text-muted-foreground">
                  • Only 'active' artworks can be used for product creation
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">File Storage</h4>
                <p className="text-sm text-muted-foreground">
                  • Artwork files stored in storage buckets (implementation pending)
                </p>
                <p className="text-sm text-muted-foreground">
                  • Supports multiple file types: original, print-ready, thumbnails
                </p>
                <p className="text-sm text-muted-foreground">
                  • Comprehensive metadata tracking (dimensions, DPI, color profiles)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground border-t pt-6">
          <p>Last Updated: November 11, 2025 | Version 1.0</p>
          <p className="mt-2">Part of Atlas Platform Knowledge Base</p>
        </div>
      </div>
      </main>
    </div>
  );
};

export default ArtworkCatalog;