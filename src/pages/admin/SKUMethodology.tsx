import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Hash, Database, Package, FileImage } from "lucide-react";

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
            The full product SKU combines the ASC code with product type and up to three variant dimensions, 
            creating a unique identifier for every purchasable item.
          </p>

          <div className="bg-muted p-4 rounded-lg mb-4">
            <p className="font-mono text-lg font-semibold text-center">
              Format: <span className="text-primary">{'{ASC}'}</span>-
              <span className="text-blue-600">{'{TYPE}'}</span>-
              <span className="text-purple-600">{'{VAR1}'}</span>-
              <span className="text-orange-600">{'{VAR2}'}</span>-
              <span className="text-pink-600">{'{VAR3}'}</span>
            </p>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Maximum length: 20 characters
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Badge className="mb-2">ASC Code</Badge>
              <p className="text-sm text-muted-foreground ml-2">
                The unique artwork identifier (6 characters)
                <br />
                <strong>Example:</strong> 11K001
              </p>
            </div>

            <div>
              <Badge variant="secondary" className="mb-2">Product Type Code (TYPE)</Badge>
              <p className="text-sm text-muted-foreground ml-2">
                <strong>Common codes:</strong> UTS (Unisex T-Shirt), PST (Poster), 
                CNV (Canvas), FRM (Framed), DIG (Digital Download)
                <br />
                <strong>Length:</strong> 3 characters
                <br />
                <strong>Example:</strong> UTS for unisex t-shirts
              </p>
            </div>

            <div>
              <Badge variant="outline" className="mb-2">Variant Codes (VAR1, VAR2, VAR3)</Badge>
              <p className="text-sm text-muted-foreground ml-2">
                <strong>Format:</strong> 2-digit codes (00-98) for each variant dimension
                <br />
                <strong>Placeholder:</strong> 99 indicates "not applicable" for that dimension
                <br />
                <strong>Valid values:</strong> 00-98 (99 reserved for N/A)
                <br />
                <strong>Examples:</strong>
              </p>
              <ul className="text-sm text-muted-foreground ml-6 mt-2 space-y-1">
                <li><strong>VAR1:</strong> Color (00=White, 01=Black, 02=Forest Green)</li>
                <li><strong>VAR2:</strong> Size (00=XS, 01=S, 02=M, 03=L, 04=XL)</li>
                <li><strong>VAR3:</strong> Material/Finish (00=Glossy Paper, 01=Matte Paper, 02=Oak Frame)</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* SKU Examples */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Complete SKU Examples</h3>
          
          <div className="space-y-3">
            {/* 2D Product Examples */}
            <div className="flex flex-col gap-2 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary">2D Product</Badge>
                <span className="text-xs text-muted-foreground">16 characters</span>
              </div>
              <code className="font-mono text-lg font-bold">11K001-UTS-01-02</code>
              <span className="text-sm text-muted-foreground">
                Artwork #1 → Unisex T-Shirt → Black (01) → Medium (02)
              </span>
            </div>

            <div className="flex flex-col gap-2 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary">2D Product</Badge>
                <span className="text-xs text-muted-foreground">16 characters</span>
              </div>
              <code className="font-mono text-lg font-bold">11K001-UTS-00-04</code>
              <span className="text-sm text-muted-foreground">
                Artwork #1 → Unisex T-Shirt → White (00) → XL (04)
              </span>
            </div>
            
            {/* 3D Product Examples */}
            <div className="flex flex-col gap-2 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Badge>3D Product</Badge>
                <span className="text-xs text-muted-foreground">19 characters</span>
              </div>
              <code className="font-mono text-lg font-bold">11K001-PST-00-02-01</code>
              <span className="text-sm text-muted-foreground">
                Artwork #1 → Poster → Glossy Paper (00) → 18x24 (02) → Matte Frame (01)
              </span>
            </div>

            <div className="flex flex-col gap-2 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Badge>3D Product</Badge>
                <span className="text-xs text-muted-foreground">19 characters</span>
              </div>
              <code className="font-mono text-lg font-bold">11K001-PST-01-03-02</code>
              <span className="text-sm text-muted-foreground">
                Artwork #1 → Poster → Matte Paper (01) → 24x36 (03) → Oak Frame (02)
              </span>
            </div>
            
            {/* Product with Placeholders */}
            <div className="flex flex-col gap-2 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline">No Variants</Badge>
                <span className="text-xs text-muted-foreground">19 characters</span>
              </div>
              <code className="font-mono text-lg font-bold">11K001-DIG-99-99-99</code>
              <span className="text-sm text-muted-foreground">
                Artwork #1 → Digital Download → No variants (placeholder codes)
              </span>
            </div>

            <div className="flex flex-col gap-2 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline">Single Variant</Badge>
                <span className="text-xs text-muted-foreground">19 characters</span>
              </div>
              <code className="font-mono text-lg font-bold">11K001-PST-99-02-99</code>
              <span className="text-sm text-muted-foreground">
                Artwork #1 → Poster → Size-only variant (02) → Paper and Frame N/A
              </span>
            </div>
          </div>
        </Card>

        {/* Print File Naming & Matching */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileImage className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Print File Naming & Hierarchical Matching</h2>
          </div>

          <p className="text-foreground mb-4">
            Atlas uses intelligent filename parsing to automatically suggest print file assignments 
            to product variants. By following standardized naming conventions, the system can match 
            files to hundreds of variants instantly.
          </p>

          <div className="space-y-4">
            {/* Naming Convention */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge>Naming Convention</Badge>
              </h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-mono text-lg font-semibold">
                  {'{ASC}'}-{'{TYPE}'}-{'{VAR1}'}-{'{VAR2}'}-{'{VAR3}'}_print.ext
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Examples:</strong>
              </p>
              <ul className="text-sm text-muted-foreground ml-4 mt-1 space-y-1">
                <li><code className="bg-muted px-2 py-0.5 rounded">11K001-UTS-01-02_print.png</code> → Exact match: Black Medium t-shirt</li>
                <li><code className="bg-muted px-2 py-0.5 rounded">11K001-UTS-01_print.png</code> → All sizes of Black t-shirts</li>
                <li><code className="bg-muted px-2 py-0.5 rounded">11K001-UTS_print.png</code> → All UTS variants</li>
                <li><code className="bg-muted px-2 py-0.5 rounded">11K001-PST-00-02_print.png</code> → All frames of Glossy 18x24 poster</li>
              </ul>
            </div>

            {/* Hierarchical Matching Logic */}
            <div>
              <h3 className="font-semibold mb-2">Hierarchical Matching Logic</h3>
              <p className="text-sm text-muted-foreground mb-3">
                The system supports three match types based on filename specificity:
              </p>
              
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4 py-2 bg-muted/50 rounded-r">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-green-600">Exact Match</Badge>
                    <span className="text-xs font-mono">Confidence: 100</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Filename SKU matches variant SKU exactly
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Example:</strong> <code>11K001-UTS-01-02_print.png</code> → 
                    Variant <code>11K001-UTS-01-02</code>
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2 bg-muted/50 rounded-r">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-blue-600">Hierarchical Match</Badge>
                    <span className="text-xs font-mono">Confidence: 90</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Filename SKU is a prefix of variant SKU (matches all child variants)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Example:</strong> <code>11K001-UTS-01_print.png</code> → 
                    Variants <code>11K001-UTS-01-00</code>, <code>11K001-UTS-01-01</code>, 
                    <code>11K001-UTS-01-02</code>, etc.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4 py-2 bg-muted/50 rounded-r">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-purple-600">Product-Level Match</Badge>
                    <span className="text-xs font-mono">Confidence: 70</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Filename contains ASC and product type only (matches all product variants)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Example:</strong> <code>11K001-UTS_print.png</code> → 
                    All variants under product type UTS for artwork 11K001
                  </p>
                </div>
              </div>
            </div>

            {/* Auto-Assignment Workflow */}
            <div>
              <h3 className="font-semibold mb-2">Auto-Assignment Workflow</h3>
              <ol className="text-sm text-muted-foreground ml-4 space-y-2">
                <li>
                  <strong>1. Upload Detection:</strong> When a print file is uploaded, 
                  the system parses the filename for SKU patterns
                </li>
                <li>
                  <strong>2. Variant Matching:</strong> Database function searches for variants 
                  matching the detected SKU pattern
                </li>
                <li>
                  <strong>3. Pending Queue:</strong> Matches are added to a review queue with 
                  confidence scores and match reasoning
                </li>
                <li>
                  <strong>4. Batch Approval:</strong> Admins can review and approve/reject 
                  suggestions in bulk
                </li>
                <li>
                  <strong>5. Assignment:</strong> Approved suggestions update 
                  <code className="bg-muted px-1 rounded">product_variants.print_file_id</code>
                </li>
              </ol>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Important Notes</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>
                  <strong>VAR3 and Print Files:</strong> For products with 3 dimensions, 
                  VAR3 typically represents frame/finish options that don't affect print files. 
                  Use 2-part SKUs (e.g., <code>11K001-PST-00-02_print</code>) to match all 
                  frames of that paper/size combination.
                </li>
                <li>
                  <strong>Placeholder Handling:</strong> Files named with <code>-99-</code> 
                  placeholders won't match variants. Use the shortest relevant SKU pattern 
                  (e.g., <code>11K001-DIG_print</code> instead of <code>11K001-DIG-99-99-99_print</code>).
                </li>
                <li>
                  <strong>Manual Override:</strong> Auto-suggestions are optional. 
                  Print files can always be assigned manually through the Products tab.
                </li>
              </ul>
            </div>

            {/* Real-World Example */}
            <div>
              <h3 className="font-semibold mb-2">Real-World Example</h3>
              <div className="bg-slate-50 border rounded-lg p-4">
                <p className="text-sm font-semibold mb-2">Scenario: T-shirt with 3 colors × 5 sizes = 15 variants</p>
                <div className="text-xs text-muted-foreground space-y-1 mb-3">
                  <p>• Colors: White (00), Black (01), Forest Green (02)</p>
                  <p>• Sizes: XS (00), S (01), M (02), L (03), XL (04)</p>
                </div>
                
                <p className="text-sm font-semibold mb-2">Upload Strategy:</p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">Option 1</Badge>
                    <div>
                      <p className="font-mono text-xs">11K001-UTS_print.png</p>
                      <p className="text-xs text-muted-foreground">One file → Suggests all 15 variants</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">Option 2</Badge>
                    <div>
                      <p className="font-mono text-xs">11K001-UTS-00_print.png (White)</p>
                      <p className="font-mono text-xs">11K001-UTS-01_print.png (Black)</p>
                      <p className="font-mono text-xs">11K001-UTS-02_print.png (Forest Green)</p>
                      <p className="text-xs text-muted-foreground">Three files → Color-specific assignments (5 variants each)</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">Option 3</Badge>
                    <div>
                      <p className="font-mono text-xs">11K001-UTS-01-02_print.png</p>
                      <p className="text-xs text-muted-foreground">Exact match → Single variant (Black Medium)</p>
                    </div>
                  </li>
                </ul>
              </div>
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
  p_var1 TEXT DEFAULT '99',
  p_var2 TEXT DEFAULT '99',
  p_var3 TEXT DEFAULT '99'
) RETURNS TEXT AS $$
BEGIN
  RETURN p_asc_code || '-' || p_product_type_code || 
         '-' || p_var1 || '-' || p_var2 || '-' || p_var3;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Example usage:
-- build_full_sku('11K001', 'UTS', '01', '02', '99') 
--   → Returns: '11K001-UTS-01-02-99'
-- build_full_sku('11K001', 'DIG') 
--   → Returns: '11K001-DIG-99-99-99'`}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Builds full SKU with optional variant dimensions. Defaults to '99' (N/A) for missing variants.
              </p>
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
            <strong>Version 1.0.0</strong> - Updated with Print File Hierarchical Matching - Atlas SKU Methodology - Admin Knowledge Base
          </p>
        </div>
      </main>
    </div>
  );
};

export default SKUMethodology;
