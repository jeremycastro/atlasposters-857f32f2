import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Frame, Palette, Layers, DollarSign, ExternalLink, Ruler, Square } from "lucide-react";

const ReadymadesFraming = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Frame className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Readymades.co Framing Discovery</h1>
          </div>
          <p className="text-muted-foreground">
            Comprehensive documentation of Readymades frame collections, options, and SKU structure
          </p>
          <div className="flex gap-4 mt-2">
            <a 
              href="https://www.readymades.co" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Readymades Website <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://www.readymades.co/pages/custom-pricing-calculator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Pricing Calculator <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Overview */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Company Overview</h2>
          
          <p className="text-foreground mb-4">
            <strong>Readymades.co</strong> is a premium custom framing manufacturer based in the UK, 
            specializing in high-quality ready-made and custom frames. They were acquired by 
            <strong> Prodigi</strong> and their frame catalog is now available through Prodigi's print-on-demand API.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Product Range</h3>
              <p className="text-sm text-muted-foreground">
                25,000+ SKUs across multiple frame collections, sizes, and configurations
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Quality Focus</h3>
              <p className="text-sm text-muted-foreground">
                Gallery-quality frames with solid wood options, museum glass, and archival materials
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Integration</h3>
              <p className="text-sm text-muted-foreground">
                Available via Prodigi API for print + frame fulfillment in single orders
              </p>
            </div>
          </div>
        </Card>

        {/* Frame Collections */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Frame className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Frame Collections</h2>
          </div>

          <p className="text-foreground mb-4">
            Readymades offers several distinct frame collections, each with unique profiles and finishes:
          </p>

          <div className="space-y-6">
            {/* Classic Collection */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge>Classic Collection</Badge>
                <span className="text-sm text-muted-foreground">Traditional solid wood frames</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Frame Styles</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li><strong>Ashby</strong> - Simple flat profile, 20mm width</li>
                    <li><strong>Strand</strong> - Slimline modern profile, 15mm width</li>
                    <li><strong>Arundel</strong> - Traditional stepped profile, 25mm width</li>
                    <li><strong>Henley</strong> - Deep box profile, 35mm depth</li>
                    <li><strong>Whitby</strong> - Rounded edge profile, 22mm width</li>
                    <li><strong>Windsor</strong> - Ornate traditional profile, 30mm width</li>
                    <li><strong>Tate</strong> - Gallery-style floating frame</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Available Colors</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Black (matte & gloss)</li>
                    <li>• White (matte & gloss)</li>
                    <li>• Natural Oak</li>
                    <li>• Walnut</li>
                    <li>• Silver</li>
                    <li>• Gold</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Premium Collection */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">Premium Collection</Badge>
                <span className="text-sm text-muted-foreground">Higher-end finishes and materials</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Frame Styles</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li><strong>Strand Premium</strong> - Wider profile variant</li>
                    <li><strong>Ashby Premium</strong> - Deeper rebate for thick media</li>
                    <li><strong>Gallery Float</strong> - Modern floating presentation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Premium Finishes</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Hand-stained wood</li>
                    <li>• Brushed metallic</li>
                    <li>• Lacquered finish</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contemporary/Metal */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">Contemporary Frames</Badge>
                <span className="text-sm text-muted-foreground">Aluminum and modern profiles</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Frame Styles</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li><strong>Metro</strong> - Slim aluminum, 8mm width</li>
                    <li><strong>Edge</strong> - Ultra-thin aluminum, 5mm width</li>
                    <li><strong>Cube</strong> - Box-style aluminum frame</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Colors</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Black Anodized</li>
                    <li>• Silver Anodized</li>
                    <li>• White Powder Coat</li>
                    <li>• Brushed Steel</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Mount Options */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Mount Options</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Mount Types</h3>
              <div className="space-y-3">
                <div className="bg-muted p-3 rounded-lg">
                  <Badge className="mb-1">Single Mount</Badge>
                  <p className="text-sm text-muted-foreground">
                    Standard single-layer matboard with beveled aperture
                  </p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <Badge className="mb-1">Double Mount</Badge>
                  <p className="text-sm text-muted-foreground">
                    Two-layer matboard creating depth and color accent
                  </p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <Badge className="mb-1">Float Mount</Badge>
                  <p className="text-sm text-muted-foreground">
                    Artwork appears to float with visible edges
                  </p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <Badge className="mb-1">No Mount</Badge>
                  <p className="text-sm text-muted-foreground">
                    Artwork fills frame edge-to-edge
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Mount Colors</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border bg-white"></div>
                  <span className="text-sm">White (most common)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border bg-[#F5F5DC]"></div>
                  <span className="text-sm">Off-White / Cream</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border bg-black"></div>
                  <span className="text-sm">Black</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border bg-gray-400"></div>
                  <span className="text-sm">Gray</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border bg-[#F5F5DC]"></div>
                  <span className="text-sm">Antique White</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> Mount aperture sizes are typically calculated automatically based on artwork size, leaving standard borders (e.g., 2" on sides, 2.5" on bottom).
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Glaze Options */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Square className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Glaze Options</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-border rounded-lg p-4">
              <Badge className="mb-2">Standard Acrylic</Badge>
              <p className="text-sm text-muted-foreground mb-2">
                Clear acrylic glazing, lightweight and shatter-resistant
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✓ Lightweight</li>
                <li>✓ Safe for shipping</li>
                <li>✓ Most affordable</li>
                <li>○ Some reflection</li>
              </ul>
            </div>

            <div className="border border-border rounded-lg p-4">
              <Badge variant="secondary" className="mb-2">Glass</Badge>
              <p className="text-sm text-muted-foreground mb-2">
                Traditional glass glazing, premium clarity
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✓ Superior clarity</li>
                <li>✓ Traditional look</li>
                <li>○ Heavier</li>
                <li>○ Fragile in shipping</li>
              </ul>
            </div>

            <div className="border border-border rounded-lg p-4">
              <Badge variant="outline" className="mb-2">Anti-Reflective</Badge>
              <p className="text-sm text-muted-foreground mb-2">
                Premium non-glare coating on acrylic or glass
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✓ Minimal reflection</li>
                <li>✓ Museum quality</li>
                <li>✓ UV protection</li>
                <li>○ Premium price</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* SKU Structure */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Readymades SKU Decoding</h2>
          </div>

          <p className="text-foreground mb-4">
            Based on analysis of their Shopify store, Readymades uses a structured SKU format:
          </p>

          <div className="bg-muted p-4 rounded-lg mb-4">
            <p className="font-mono text-lg font-semibold text-center">
              <span className="text-primary">FRM</span>-
              <span className="text-blue-600">STRAND</span>-
              <span className="text-purple-600">BLK</span>-
              <span className="text-orange-600">A3</span>-
              <span className="text-green-600">SGL</span>-
              <span className="text-pink-600">WHT</span>-
              <span className="text-cyan-600">ACR</span>
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge className="shrink-0">FRM</Badge>
              <div>
                <span className="font-semibold">Product Type</span>
                <p className="text-sm text-muted-foreground">Frame product identifier</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="shrink-0">STRAND</Badge>
              <div>
                <span className="font-semibold">Frame Style</span>
                <p className="text-sm text-muted-foreground">Collection and profile name</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="shrink-0">BLK</Badge>
              <div>
                <span className="font-semibold">Frame Color</span>
                <p className="text-sm text-muted-foreground">BLK=Black, WHT=White, NAT=Natural, WAL=Walnut</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-orange-600 shrink-0">A3</Badge>
              <div>
                <span className="font-semibold">Size</span>
                <p className="text-sm text-muted-foreground">Metric (A4, A3, A2, A1) or Imperial (8X10, 11X14, etc.)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-green-600 shrink-0">SGL</Badge>
              <div>
                <span className="font-semibold">Mount Type</span>
                <p className="text-sm text-muted-foreground">SGL=Single, DBL=Double, FLT=Float, NOM=No Mount</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-pink-600 shrink-0">WHT</Badge>
              <div>
                <span className="font-semibold">Mount Color</span>
                <p className="text-sm text-muted-foreground">WHT=White, OFW=Off-White, BLK=Black</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-cyan-600 shrink-0">ACR</Badge>
              <div>
                <span className="font-semibold">Glaze Type</span>
                <p className="text-sm text-muted-foreground">ACR=Acrylic, GLS=Glass, ARG=Anti-Reflective Glass</p>
              </div>
            </div>
          </div>

          <h3 className="font-semibold mt-6 mb-3">SKU Examples</h3>
          <div className="space-y-2">
            <div className="flex flex-col gap-1 p-3 bg-muted rounded-lg">
              <code className="font-mono text-lg font-bold">FRM-ASHBY-BLK-16X20-SGL-WHT-ACR</code>
              <span className="text-sm text-muted-foreground">
                Ashby frame, Black, 16×20", Single white mount, Acrylic glaze
              </span>
            </div>
            <div className="flex flex-col gap-1 p-3 bg-muted rounded-lg">
              <code className="font-mono text-lg font-bold">FRM-STRAND-NAT-A2-DBL-OFW-GLS</code>
              <span className="text-sm text-muted-foreground">
                Strand frame, Natural Oak, A2, Double off-white mount, Glass glaze
              </span>
            </div>
            <div className="flex flex-col gap-1 p-3 bg-muted rounded-lg">
              <code className="font-mono text-lg font-bold">FRM-HENLEY-WHT-24X36-NOM-XXX-ARG</code>
              <span className="text-sm text-muted-foreground">
                Henley frame, White, 24×36", No mount, Anti-reflective glass
              </span>
            </div>
          </div>
        </Card>

        {/* Price Bands */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Price Band System</h2>
          </div>

          <p className="text-foreground mb-4">
            Readymades uses an elegant A-E price band system based on frame configuration complexity:
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Badge className="bg-green-600 shrink-0">Band A</Badge>
              <div>
                <span className="font-semibold">Entry Level</span>
                <p className="text-sm text-muted-foreground">
                  Standard sizes, basic frame styles, single mount, acrylic glaze
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Badge className="bg-blue-600 shrink-0">Band B</Badge>
              <div>
                <span className="font-semibold">Standard</span>
                <p className="text-sm text-muted-foreground">
                  Wider size range, additional frame colors, double mount option
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <Badge className="bg-purple-600 shrink-0">Band C</Badge>
              <div>
                <span className="font-semibold">Premium</span>
                <p className="text-sm text-muted-foreground">
                  Premium frame styles (Henley, Arundel), glass glaze option
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <Badge className="bg-orange-600 shrink-0">Band D</Badge>
              <div>
                <span className="font-semibold">Gallery</span>
                <p className="text-sm text-muted-foreground">
                  Large format sizes, anti-reflective glass, float mount
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <Badge className="bg-red-600 shrink-0">Band E</Badge>
              <div>
                <span className="font-semibold">Museum</span>
                <p className="text-sm text-muted-foreground">
                  Extra-large format, museum glass, hand-finished frames
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Atlas Price Band Strategy</h4>
            <p className="text-sm text-muted-foreground">
              Atlas can adopt similar banding, offering curated packages at each tier. This simplifies the customer experience while maintaining profitability through clear pricing tiers.
            </p>
          </div>
        </Card>

        {/* Sizes */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Ruler className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Available Sizes</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Metric Sizes (UK/EU)</h3>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="font-mono">A4</span>
                  <span className="text-muted-foreground">210 × 297mm</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="font-mono">A3</span>
                  <span className="text-muted-foreground">297 × 420mm</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="font-mono">A2</span>
                  <span className="text-muted-foreground">420 × 594mm</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="font-mono">A1</span>
                  <span className="text-muted-foreground">594 × 841mm</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="font-mono">A0</span>
                  <span className="text-muted-foreground">841 × 1189mm</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Imperial Sizes (US)</h3>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="font-mono">8×10</span>
                  <span className="text-muted-foreground">8" × 10"</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="font-mono">11×14</span>
                  <span className="text-muted-foreground">11" × 14"</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="font-mono">16×20</span>
                  <span className="text-muted-foreground">16" × 20"</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="font-mono">18×24</span>
                  <span className="text-muted-foreground">18" × 24"</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="font-mono">24×36</span>
                  <span className="text-muted-foreground">24" × 36"</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Atlas Integration */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Atlas Integration via Prodigi</h2>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-yellow-900 mb-2">Important Note</h4>
            <p className="text-sm text-yellow-800">
              Readymades does <strong>not</strong> print artwork—they only produce frames. 
              Atlas will use <strong>Prodigi</strong> for integrated print + frame fulfillment, 
              which includes the Readymades frame catalog via Prodigi's API.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold">Recommended Approach</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Use Prodigi API with frame attributes derived from Readymades catalog specifications. 
                Prodigi handles both printing and framing in a single fulfillment order.
              </p>
            </div>

            <div className="border-l-4 border-muted pl-4">
              <h3 className="font-semibold">Direct Readymades API</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Not recommended unless separate print vendor is established. 
                Would require coordinating two shipments (print + frame).
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Last Updated:</strong> December 2025 - Readymades Framing Discovery - Atlas Knowledge Base
          </p>
        </div>
      </main>
    </div>
  );
};

export default ReadymadesFraming;