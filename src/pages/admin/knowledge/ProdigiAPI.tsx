import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Globe, Truck, Image, Code, Zap, MapPin } from "lucide-react";

const ProdigiAPI = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Prodigi API Discovery</h1>
          </div>
          <p className="text-muted-foreground">
            Technical documentation for integrating with Prodigi's global print-on-demand fulfillment network
          </p>
          <a 
            href="https://www.prodigi.com/print-api/docs/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
          >
            Official API Documentation <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Overview */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">What is Prodigi?</h2>
          </div>
          
          <p className="text-foreground mb-4">
            Prodigi is a global print-on-demand fulfillment network with 50+ production facilities worldwide. 
            They acquired <strong>Readymades.co</strong> (premium framing) and offer integrated printing + framing services.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Global Network</h3>
              <p className="text-sm text-muted-foreground">
                50+ production facilities across North America, Europe, Asia, and Australia
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Product Range</h3>
              <p className="text-sm text-muted-foreground">
                Prints, posters, framed prints, canvas, apparel, home decor, and more
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Auto-Routing</h3>
              <p className="text-sm text-muted-foreground">
                Intelligent routing to nearest facility based on shipping destination
              </p>
            </div>
          </div>
        </Card>

        {/* API Structure */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">API Structure</h2>
          </div>

          <p className="text-foreground mb-4">
            Prodigi offers a REST API with the following primary endpoints:
          </p>

          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold">Products Endpoint</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">GET /v4.0/products</code>
              <p className="text-sm text-muted-foreground mt-1">
                Retrieve available products, their SKUs, and configuration options
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold">Quotes Endpoint</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">POST /v4.0/quotes</code>
              <p className="text-sm text-muted-foreground mt-1">
                Get pricing and shipping estimates before placing an order
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold">Orders Endpoint</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">POST /v4.0/orders</code>
              <p className="text-sm text-muted-foreground mt-1">
                Submit orders with print file URLs and shipping details
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold">Order Status</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">GET /v4.0/orders/{'{orderId}'}</code>
              <p className="text-sm text-muted-foreground mt-1">
                Track order status, fulfillment, and shipping information
              </p>
            </div>
          </div>
        </Card>

        {/* Product SKU System */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Image className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Prodigi SKU System</h2>
          </div>

          <p className="text-foreground mb-4">
            Prodigi uses a structured SKU format that encodes product type, destination routing, and size:
          </p>

          <div className="bg-muted p-4 rounded-lg mb-4">
            <p className="font-mono text-lg font-semibold text-center">
              Format: <span className="text-primary">{'{DESTINATION}'}</span>-
              <span className="text-blue-600">{'{PRODUCT_CODE}'}</span>-
              <span className="text-purple-600">{'{SIZE}'}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Badge className="mb-2">Destination Prefix</Badge>
              <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                <li><code className="bg-muted px-2 py-0.5 rounded">GLOBAL</code> - Auto-route to nearest facility</li>
                <li><code className="bg-muted px-2 py-0.5 rounded">US</code> - Force US production only</li>
                <li><code className="bg-muted px-2 py-0.5 rounded">EU</code> - Force EU production only</li>
                <li><code className="bg-muted px-2 py-0.5 rounded">AU</code> - Force Australia production only</li>
              </ul>
            </div>

            <div>
              <Badge variant="secondary" className="mb-2">Product Codes</Badge>
              <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                <li><code className="bg-muted px-2 py-0.5 rounded">CFPM</code> - Classic Framed Print Matte</li>
                <li><code className="bg-muted px-2 py-0.5 rounded">CFPG</code> - Classic Framed Print Gloss</li>
                <li><code className="bg-muted px-2 py-0.5 rounded">POSTER</code> - Unframed Poster</li>
                <li><code className="bg-muted px-2 py-0.5 rounded">CANVAS</code> - Stretched Canvas</li>
                <li><code className="bg-muted px-2 py-0.5 rounded">METALPRINT</code> - Metal Print</li>
              </ul>
            </div>

            <div>
              <Badge variant="outline" className="mb-2">Size Suffix</Badge>
              <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                <li><code className="bg-muted px-2 py-0.5 rounded">A4</code>, <code className="bg-muted px-2 py-0.5 rounded">A3</code>, <code className="bg-muted px-2 py-0.5 rounded">A2</code>, <code className="bg-muted px-2 py-0.5 rounded">A1</code> - Metric sizes</li>
                <li><code className="bg-muted px-2 py-0.5 rounded">8X10</code>, <code className="bg-muted px-2 py-0.5 rounded">11X14</code>, <code className="bg-muted px-2 py-0.5 rounded">16X20</code>, <code className="bg-muted px-2 py-0.5 rounded">24X36</code> - Imperial sizes</li>
              </ul>
            </div>
          </div>

          <h3 className="font-semibold mt-6 mb-3">SKU Examples</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              <code className="font-mono text-lg font-bold">GLOBAL-CFPM-16X20</code>
              <span className="text-sm text-muted-foreground">Classic Framed Print Matte, 16×20", auto-routed globally</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              <code className="font-mono text-lg font-bold">US-POSTER-24X36</code>
              <span className="text-sm text-muted-foreground">Unframed Poster, 24×36", US production only</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              <code className="font-mono text-lg font-bold">GLOBAL-CFPM-A3</code>
              <span className="text-sm text-muted-foreground">Classic Framed Print Matte, A3 size, auto-routed globally</span>
            </div>
          </div>
        </Card>

        {/* Attributes System */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Attributes System</h2>
          </div>

          <p className="text-foreground mb-4">
            Beyond the SKU, Prodigi uses an <code className="bg-muted px-2 py-0.5 rounded">attributes</code> object 
            to specify customization options. This is how frame colors, mount colors, and finishes are specified.
          </p>

          <div className="bg-slate-900 p-4 rounded-lg mb-4 overflow-x-auto">
            <pre className="text-green-400 text-sm">
{`{
  "sku": "GLOBAL-CFPM-16X20",
  "copies": 1,
  "sizing": "fillPrintArea",
  "assets": [
    {
      "printArea": "default",
      "url": "https://storage.example.com/artwork/10A001_print.png"
    }
  ],
  "attributes": {
    "frame_colour": "black",
    "mount_colour": "white",
    "frame_style": "classic"
  }
}`}
            </pre>
          </div>

          <h3 className="font-semibold mb-3">Common Attributes</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Badge className="mb-2">frame_colour</Badge>
              <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                <li>black, white, natural</li>
                <li>walnut, oak, silver</li>
              </ul>
            </div>
            <div>
              <Badge className="mb-2">mount_colour</Badge>
              <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                <li>white, off_white, black</li>
                <li>cream, gray</li>
              </ul>
            </div>
            <div>
              <Badge className="mb-2">frame_style</Badge>
              <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                <li>classic, modern, gallery</li>
                <li>box, float</li>
              </ul>
            </div>
            <div>
              <Badge className="mb-2">glaze_type</Badge>
              <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                <li>acrylic, glass</li>
                <li>anti_reflective</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Geographic Routing */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Geographic Routing</h2>
          </div>

          <p className="text-foreground mb-4">
            When using <code className="bg-muted px-2 py-0.5 rounded">GLOBAL</code> prefix, Prodigi automatically 
            selects the optimal production facility based on:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">1. Shipping Destination</h3>
              <p className="text-sm text-muted-foreground">
                Primary factor - chooses facility closest to the customer's shipping address
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">2. Product Availability</h3>
              <p className="text-sm text-muted-foreground">
                Ensures the selected facility can produce the specific product/size combination
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">3. Current Capacity</h3>
              <p className="text-sm text-muted-foreground">
                May route to alternative facility if primary is at capacity
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">4. Cost Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Balances production cost with shipping cost for optimal pricing
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">Atlas Integration Strategy</h4>
            <p className="text-sm text-yellow-800">
              Atlas will use <code className="bg-yellow-100 px-1 rounded">GLOBAL</code> prefix for all orders, 
              letting Prodigi handle geographic routing. Customer's shipping address determines the production facility, 
              ensuring fastest delivery and lowest shipping costs.
            </p>
          </div>
        </Card>

        {/* Order Workflow */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Order Workflow</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Badge className="bg-blue-600 shrink-0">1</Badge>
              <div>
                <h3 className="font-semibold">Quote Request (Optional)</h3>
                <p className="text-sm text-muted-foreground">
                  Request pricing and shipping estimates before committing to an order
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Badge className="bg-blue-600 shrink-0">2</Badge>
              <div>
                <h3 className="font-semibold">Order Submission</h3>
                <p className="text-sm text-muted-foreground">
                  Submit order with product SKU, print file URL, attributes, and shipping address
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Badge className="bg-blue-600 shrink-0">3</Badge>
              <div>
                <h3 className="font-semibold">File Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Prodigi downloads and validates print file, checks resolution and dimensions
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Badge className="bg-blue-600 shrink-0">4</Badge>
              <div>
                <h3 className="font-semibold">Production</h3>
                <p className="text-sm text-muted-foreground">
                  Order is queued for production at the selected facility (typically 2-5 business days)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Badge className="bg-blue-600 shrink-0">5</Badge>
              <div>
                <h3 className="font-semibold">Shipping & Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Webhook notification sent with tracking info; order status updated
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Atlas Integration */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Atlas Integration Strategy</h2>

          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Order Flow</h3>
              <ol className="text-sm text-muted-foreground ml-4 space-y-2 list-decimal">
                <li>Customer selects artwork and frame configuration on atlasposters.com</li>
                <li>Atlas translates frame configuration to Prodigi attributes</li>
                <li>Order submitted to Prodigi with Atlas print file URL</li>
                <li>Prodigi routes to nearest facility based on shipping address</li>
                <li>Atlas receives webhook updates for order status tracking</li>
              </ol>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">SKU Mapping</h3>
              <p className="text-sm text-muted-foreground">
                Atlas SKU → Prodigi SKU translation happens at order time:
              </p>
              <div className="mt-2 font-mono text-xs bg-background p-2 rounded">
                <p>Atlas: <code>10A001-FPM-02-01</code></p>
                <p>↓ translates to ↓</p>
                <p>Prodigi: <code>GLOBAL-CFPM-16X20</code> + attributes from FC config</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Frame Configuration Translation</h3>
              <p className="text-sm text-muted-foreground">
                Atlas <code>frame_configurations</code> table stores curated packages that map to Prodigi attributes:
              </p>
              <div className="mt-2 font-mono text-xs bg-background p-2 rounded">
                <p>Atlas FC: "Gallery Black" (FC042)</p>
                <p>→ frame_colour: "black"</p>
                <p>→ mount_colour: "white"</p>
                <p>→ frame_style: "classic"</p>
                <p>→ glaze_type: "acrylic"</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Integration Options */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Available Integration Methods</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge>Direct API</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Full control over orders, custom workflows, real-time status updates
              </p>
              <a 
                href="https://www.prodigi.com/print-api/docs/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                API Docs <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">Shopify App</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                One-click integration, automatic order sync, simpler setup
              </p>
              <a 
                href="https://www.prodigi.com/shopify-print-on-demand-app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Shopify App <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">CSV Importer</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Bulk product import, catalog synchronization, batch updates
              </p>
              <a 
                href="https://www.prodigi.com/csv-importer/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                CSV Tool <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Last Updated:</strong> December 2025 - Prodigi API Discovery - Atlas Knowledge Base
          </p>
        </div>
      </main>
    </div>
  );
};

export default ProdigiAPI;