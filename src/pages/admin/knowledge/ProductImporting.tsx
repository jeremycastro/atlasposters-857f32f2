import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Database, Package, FileSpreadsheet, RefreshCw, Store } from "lucide-react";

const ProductImporting = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ArrowRightLeft className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Product Importing</h1>
          </div>
          <p className="text-muted-foreground">
            Shopify/Syncio learning and bi-directional product flow documentation
          </p>
        </div>

        {/* The Challenge */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">The Challenge: Bi-Directional Product Flow</h2>
          
          <p className="text-foreground mb-4">
            Atlas must handle complex product flows between multiple systems:
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <Store className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Partner Stores</h3>
              <p className="text-sm text-muted-foreground">
                Existing Shopify stores with products, images, and metadata
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <Database className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Atlas Catalog</h3>
              <p className="text-sm text-muted-foreground">
                Central artwork database with ASC codes and product variants
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Atlas Shopify</h3>
              <p className="text-sm text-muted-foreground">
                Customer-facing store at atlasposters.com
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">Key Requirements</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Preserve original partner product data for reporting</li>
              <li>• Map partner products to Atlas artworks with new ASC codes</li>
              <li>• Create Atlas product variants with proper SKU structure</li>
              <li>• Report sales back to partners using their original identifiers</li>
            </ul>
          </div>
        </Card>

        {/* Syncio Overview */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Syncio Overview</h2>
          </div>

          <p className="text-foreground mb-4">
            <strong>Syncio</strong> is a Shopify app that synchronizes products between stores. 
            It's currently used to sync <strong>Stick No Bills (SNB)</strong> products to the Atlas Shopify store.
          </p>

          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold">How Syncio Works</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Products sync from Source Store (partner) to Destination Store (Atlas) with configurable options for visibility, inventory, and pricing.
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Current SNB → Atlas Flow</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Source</Badge>
                  <span>Stick No Bills Shopify Store</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="ml-8">↓ Syncio syncs products</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Destination</Badge>
                  <span>Atlas Shopify Store (hidden status)</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">What Syncs</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Product title and description</li>
                  <li>• Images (all variants)</li>
                  <li>• Price and compare-at price</li>
                  <li>• Variants and options</li>
                  <li>• Tags and collections</li>
                  <li>• SKU and barcode</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2">Limitations</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Products arrive as "hidden" by default</li>
                  <li>• No automatic ASC code assignment</li>
                  <li>• SKU format may not match Atlas structure</li>
                  <li>• Metadata needs manual mapping</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Partner Product Mapping */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Partner Product → Artwork Mapping</h2>
          </div>

          <p className="text-foreground mb-4">
            Partner products are essentially "artwork source records" that need to be mapped to Atlas artworks. 
            The mapping process preserves original data while creating Atlas-native records.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Conceptual Understanding</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  For SNB products, each unique artwork code (e.g., <code>LKWAVEO</code>) represents a single piece of art that may have multiple product variants (sizes, frames, etc.).
                </p>
                <div className="font-mono text-xs mt-3 space-y-1">
                  <p><strong>SNB Product:</strong> "Waves of Light - LKWAVEO-PST-A3"</p>
                  <p><strong>↓ Maps to ↓</strong></p>
                  <p><strong>Atlas Artwork:</strong> "Waves of Light" (ASC: 10A001)</p>
                  <p><strong>Atlas Product:</strong> "Waves of Light Poster" (SKU: 10A001-PST-02)</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Data Preservation Strategy</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg p-4">
                  <Badge className="mb-2">partner_products Table</Badge>
                  <p className="text-sm text-muted-foreground">
                    Stores original partner product data:
                  </p>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                    <li>• Original Shopify product ID</li>
                    <li>• Original SKU format</li>
                    <li>• Raw Shopify JSON data</li>
                    <li>• Partner reference ID</li>
                    <li>• Link to Atlas artwork_id</li>
                  </ul>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <Badge className="mb-2">sku_crosswalk Table</Badge>
                  <p className="text-sm text-muted-foreground">
                    Maps Atlas variants to partner SKUs:
                  </p>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                    <li>• Atlas product_variant_id</li>
                    <li>• Partner product_id</li>
                    <li>• Original partner SKU</li>
                    <li>• Used for sales reporting</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Data Flow Diagram */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileSpreadsheet className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Complete Data Flow</h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg overflow-x-auto">
            <pre className="text-green-400 text-sm">
{`┌─────────────────────────────────────────────────────────────────────────┐
│                           INBOUND FLOW                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Partner Shopify Store (e.g., Stick No Bills)                          │
│  └── Products with original SKUs (e.g., LKWAVEO-PST-A3)                │
│                          │                                              │
│                          ▼ Syncio                                       │
│                                                                         │
│  Atlas Shopify Store (hidden products)                                  │
│  └── Synced products with raw Shopify data                             │
│                          │                                              │
│                          ▼ Import Process                               │
│                                                                         │
│  partner_products Table                                                 │
│  └── Raw data preserved                                                 │
│  └── shopify_product_id, raw_shopify_data, partner_sku                 │
│                          │                                              │
│                          ▼ Artwork Mapping                              │
│                                                                         │
│  artworks Table                                                         │
│  └── New ASC code generated (e.g., 10A001)                             │
│  └── artwork_id linked to partner_products                             │
│                          │                                              │
│                          ▼ Product Creation                             │
│                                                                         │
│  products & product_variants Tables                                     │
│  └── Atlas SKU structure (e.g., 10A001-PST-02-01)                      │
│  └── Linked to artwork_id                                               │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                           OUTBOUND FLOW                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Order placed on atlasposters.com                                       │
│  └── Contains Atlas SKU (10A001-PST-02-01)                             │
│                          │                                              │
│                          ▼ SKU Crosswalk Lookup                         │
│                                                                         │
│  sku_crosswalk Table                                                    │
│  └── Maps Atlas variant → Partner SKU                                  │
│                          │                                              │
│                          ▼ Partner Reporting                            │
│                                                                         │
│  Report to Partner                                                      │
│  └── Original SKU: LKWAVEO-PST-A3                                      │
│  └── Sale amount, date, customer location                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘`}
            </pre>
          </div>
        </Card>

        {/* Import Methods */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Import Methods</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge>Syncio Import</Badge>
                <Badge variant="outline">Current</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Products synced via Syncio from partner Shopify stores
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✓ Automatic product sync</li>
                <li>✓ Images included</li>
                <li>✓ Real-time updates</li>
                <li>○ Requires manual artwork mapping</li>
              </ul>
            </div>

            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">CSV Bulk Import</Badge>
                <Badge variant="outline">Future</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Bulk import from spreadsheet with artwork metadata
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✓ Batch processing</li>
                <li>✓ Pre-mapped artwork data</li>
                <li>○ Images uploaded separately</li>
                <li>○ Manual validation required</li>
              </ul>
            </div>

            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">Direct API Import</Badge>
                <Badge variant="outline">Future</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Direct Shopify API integration for automated imports
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✓ Full automation</li>
                <li>✓ Webhook support</li>
                <li>○ Complex setup</li>
                <li>○ Rate limiting considerations</li>
              </ul>
            </div>

            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">Manual Entry</Badge>
                <Badge variant="outline">Available</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Create artworks directly in Atlas admin
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✓ Full control</li>
                <li>✓ No external dependencies</li>
                <li>○ Time intensive</li>
                <li>○ Not scalable for large catalogs</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Proposed Database Schema */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Proposed Database Schema</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">partner_products Table</h3>
              <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`CREATE TABLE partner_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) NOT NULL,
  artwork_id UUID REFERENCES artworks(id),  -- NULL until mapped
  
  -- Original Shopify Data
  shopify_product_id TEXT NOT NULL,
  shopify_store_domain TEXT NOT NULL,
  original_sku TEXT,
  original_title TEXT NOT NULL,
  raw_shopify_data JSONB,  -- Full product JSON
  
  -- Import Metadata
  import_method TEXT NOT NULL,  -- 'syncio', 'csv', 'api', 'manual'
  import_status TEXT DEFAULT 'pending',  -- 'pending', 'mapped', 'created'
  imported_at TIMESTAMPTZ DEFAULT NOW(),
  mapped_at TIMESTAMPTZ,
  
  UNIQUE(shopify_product_id, shopify_store_domain)
);`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">sku_crosswalk Table</h3>
              <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`CREATE TABLE sku_crosswalk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  atlas_variant_id UUID REFERENCES product_variants(id) NOT NULL,
  partner_product_id UUID REFERENCES partner_products(id) NOT NULL,
  
  -- Partner SKU Info
  partner_sku TEXT NOT NULL,
  partner_variant_id TEXT,  -- Shopify variant ID
  
  -- Reporting Fields
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(atlas_variant_id, partner_product_id)
);`}
                </pre>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Implementation Roadmap</h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge className="bg-green-600 shrink-0">Phase 1</Badge>
              <div>
                <p className="font-semibold">Database Schema</p>
                <p className="text-sm text-muted-foreground">
                  Create partner_products and sku_crosswalk tables with proper relationships
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge className="bg-blue-600 shrink-0">Phase 2</Badge>
              <div>
                <p className="font-semibold">Import Queue UI</p>
                <p className="text-sm text-muted-foreground">
                  Admin interface to view synced products and map to artworks
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge className="bg-purple-600 shrink-0">Phase 3</Badge>
              <div>
                <p className="font-semibold">Automated Mapping</p>
                <p className="text-sm text-muted-foreground">
                  Intelligent suggestions for artwork mapping based on titles and images
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="shrink-0">Phase 4</Badge>
              <div>
                <p className="font-semibold">Partner Reporting</p>
                <p className="text-sm text-muted-foreground">
                  Sales reports using sku_crosswalk to show partner-native SKUs
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Last Updated:</strong> December 2025 - Product Importing Discovery - Atlas Knowledge Base
          </p>
        </div>
      </main>
    </div>
  );
};

export default ProductImporting;