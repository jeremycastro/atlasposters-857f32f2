import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Hash, Database, Package } from "lucide-react";

const SKUMethodology = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Atlas SKU Methodology</h1>
          </div>
          <p className="text-muted-foreground">
            Understanding the Atlas Sequential Code (ASC) system and product SKU structure
          </p>
        </div>

        {/* ASC Overview */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Atlas Sequential Code (ASC)</h2>
          </div>
          
          <p className="text-foreground mb-4">
            The ASC is a unique identifier assigned to every artwork in the Atlas catalog. 
            It serves as the foundation for all product SKUs and ensures each piece of art has a permanent, 
            traceable identity within our system.
          </p>

          <div className="bg-muted p-4 rounded-lg mb-4">
            <p className="font-mono text-lg font-semibold text-center">
              Format: <span className="text-primary">DD</span>
              <span className="text-blue-600">L</span>
              <span className="text-purple-600">NNN</span>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Badge className="mb-2">Decade Digit (DD)</Badge>
              <p className="text-sm text-muted-foreground ml-2">
                <strong>10-19:</strong> Represents the decade (2020s = 10, 2030s = 11, etc.)
                <br />
                <strong>Logic:</strong> 10 + (Current Year - 2020) / 10
                <br />
                <strong>Example:</strong> In 2024 → 10 + (2024-2020)/10 = 10
              </p>
            </div>

            <div>
              <Badge variant="secondary" className="mb-2">Letter Code (L)</Badge>
              <p className="text-sm text-muted-foreground ml-2">
                <strong>A-Z:</strong> Cycles through alphabet every 1,000 artworks
                <br />
                <strong>Logic:</strong> chr(65 + (sequence / 1000) % 26)
                <br />
                <strong>Example:</strong> Sequence 0-999 = A, 1000-1999 = B, 2000-2999 = C
              </p>
            </div>

            <div>
              <Badge variant="outline" className="mb-2">Number Part (NNN)</Badge>
              <p className="text-sm text-muted-foreground ml-2">
                <strong>000-999:</strong> Three-digit sequence within each letter block
                <br />
                <strong>Logic:</strong> Last 3 digits of sequence, padded with zeros
                <br />
                <strong>Example:</strong> Sequence 1 = 001, Sequence 42 = 042, Sequence 1337 = 337
              </p>
            </div>
          </div>
        </Card>

        {/* ASC Examples */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">ASC Code Examples</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              <code className="font-mono text-lg font-bold">10A001</code>
              <span className="text-sm text-muted-foreground">First artwork in the catalog (2020s, Block A, #1)</span>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              <code className="font-mono text-lg font-bold">10A999</code>
              <span className="text-sm text-muted-foreground">999th artwork (2020s, Block A, #999)</span>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              <code className="font-mono text-lg font-bold">10B000</code>
              <span className="text-sm text-muted-foreground">1,000th artwork (2020s, Block B, #0)</span>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              <code className="font-mono text-lg font-bold">10B337</code>
              <span className="text-sm text-muted-foreground">1,337th artwork (2020s, Block B, #337)</span>
            </div>
          </div>
        </Card>

        {/* Full SKU Structure */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Complete SKU Structure</h2>
          </div>

          <p className="text-foreground mb-4">
            The full product SKU combines the ASC code with product type and variant information, 
            creating a unique identifier for every purchasable item.
          </p>

          <div className="bg-muted p-4 rounded-lg mb-4">
            <p className="font-mono text-lg font-semibold text-center">
              Format: <span className="text-primary">[ASC]</span>-
              <span className="text-blue-600">[PRODUCT_TYPE]</span>-
              <span className="text-purple-600">[VARIANT]</span>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Badge className="mb-2">ASC Code</Badge>
              <p className="text-sm text-muted-foreground ml-2">
                The unique artwork identifier (6 characters)
                <br />
                <strong>Example:</strong> 10A042
              </p>
            </div>

            <div>
              <Badge variant="secondary" className="mb-2">Product Type Code</Badge>
              <p className="text-sm text-muted-foreground ml-2">
                <strong>Common codes:</strong> PST (Poster), CNV (Canvas), FRM (Framed), MTL (Metal), ACR (Acrylic)
                <br />
                <strong>Length:</strong> Typically 3 characters
                <br />
                <strong>Example:</strong> PST for standard posters
              </p>
            </div>

            <div>
              <Badge variant="outline" className="mb-2">Variant Code</Badge>
              <p className="text-sm text-muted-foreground ml-2">
                Describes size, finish, or configuration options
                <br />
                <strong>Format:</strong> Size + optional finish codes
                <br />
                <strong>Example:</strong> 18X24 (18"x24"), 24X36GL (24"x36" glossy)
              </p>
            </div>
          </div>
        </Card>

        {/* SKU Examples */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Complete SKU Examples</h3>
          
          <div className="space-y-3">
            <div className="flex flex-col gap-2 p-3 bg-muted rounded-lg">
              <code className="font-mono text-lg font-bold">10A042-PST-18X24</code>
              <span className="text-sm text-muted-foreground">
                Artwork #42 → Poster format → 18"x24" size
              </span>
            </div>
            
            <div className="flex flex-col gap-2 p-3 bg-muted rounded-lg">
              <code className="font-mono text-lg font-bold">10B137-CNV-24X36GL</code>
              <span className="text-sm text-muted-foreground">
                Artwork #1,137 → Canvas format → 24"x36" glossy finish
              </span>
            </div>
            
            <div className="flex flex-col gap-2 p-3 bg-muted rounded-lg">
              <code className="font-mono text-lg font-bold">10A001-FRM-30X40BK</code>
              <span className="text-sm text-muted-foreground">
                First artwork → Framed format → 30"x40" black frame
              </span>
            </div>
          </div>
        </Card>

        {/* Database Implementation */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Database Implementation</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">PostgreSQL Sequence</h3>
              <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-green-400 text-sm">
                  CREATE SEQUENCE asc_sequence START 1;
                </code>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Auto-incrementing sequence ensures unique ASC codes without gaps or conflicts
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">ASC Generation Function</h3>
              <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`CREATE FUNCTION generate_next_asc() RETURNS TEXT AS $$
DECLARE
  seq_val INTEGER;
  decade_digit INTEGER;
  letter_code TEXT;
  number_part TEXT;
BEGIN
  seq_val := nextval('asc_sequence');
  decade_digit := 10 + (EXTRACT(YEAR FROM CURRENT_DATE) - 2020) / 10;
  letter_code := chr(65 + (seq_val / 1000) % 26);
  number_part := LPAD((seq_val % 1000)::TEXT, 3, '0');
  RETURN LPAD(decade_digit::TEXT, 2, '0') || letter_code || number_part;
END;
$$ LANGUAGE plpgsql;`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Full SKU Builder Function</h3>
              <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`CREATE FUNCTION build_full_sku(
  p_asc_code TEXT,
  p_product_type_code TEXT,
  p_variant_code TEXT
) RETURNS TEXT AS $$
BEGIN
  RETURN p_asc_code || '-' || p_product_type_code || '-' || p_variant_code;
END;
$$ LANGUAGE plpgsql IMMUTABLE;`}
                </pre>
              </div>
            </div>
          </div>
        </Card>

        {/* Key Benefits */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">System Benefits</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Scalability</h3>
              <p className="text-sm text-muted-foreground">
                Supports 26,000 artworks per decade block (A-Z × 1,000), with automatic rollover to new letter blocks
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Chronological Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Decade digit provides instant visual reference to when artwork was cataloged
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Human Readable</h3>
              <p className="text-sm text-muted-foreground">
                Short, memorable codes that can be easily communicated and searched
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Permanent Identity</h3>
              <p className="text-sm text-muted-foreground">
                ASC codes never change, ensuring artwork traceability across all systems
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Product Flexibility</h3>
              <p className="text-sm text-muted-foreground">
                One artwork can spawn unlimited product variations while maintaining clear lineage
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Database Integrity</h3>
              <p className="text-sm text-muted-foreground">
                PostgreSQL sequence ensures no duplicates or conflicts in code generation
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Version 0.4.0</strong> - Atlas SKU Methodology - Admin Knowledge Base
          </p>
        </div>
      </main>
    </div>
  );
};

export default SKUMethodology;
