import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Palette, Type, Layout, Box, Layers } from "lucide-react";

const AdminBrandGuide = () => {
  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Palette className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Atlas Admin Brand Guide</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Complete brand system for the Atlas Admin interface including typography, colors, design tokens, and component styling standards
        </p>
        <div className="flex gap-2 pt-2">
          <Badge variant="outline">Brand System</Badge>
          <Badge variant="outline">Design Tokens</Badge>
          <Badge variant="outline">Admin Interface</Badge>
        </div>
      </div>

      <Separator />

      {/* Typography System */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Type className="h-5 w-5 text-primary" />
            <CardTitle>Typography System</CardTitle>
          </div>
          <CardDescription>Font families, weights, and usage guidelines for the Atlas admin interface</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Acumin Pro */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold">Acumin Pro</h3>
            <p className="text-sm text-muted-foreground">Primary font for all headers and titles</p>
            <div className="bg-muted/50 p-6 rounded-lg space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Source</p>
                <code className="text-sm bg-background px-2 py-1 rounded">Adobe Typekit (use.typekit.net)</code>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Font Weight</p>
                <p className="font-semibold">700 (Bold) - Used for all h1-h6 headers</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Usage</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>All page headers (h1, h2, h3, h4, h5, h6)</li>
                  <li>Card titles and section headers</li>
                  <li>Navigation menu items</li>
                  <li>Brand-critical text elements</li>
                </ul>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">CSS Implementation</p>
                <code className="text-xs bg-background px-2 py-1 rounded block">
                  font-family: 'acumin-pro', 'Inter', sans-serif;
                </code>
              </div>
            </div>
          </div>

          {/* Inter */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold font-sans">Inter</h3>
            <p className="text-sm text-muted-foreground">Primary font for body text and UI elements</p>
            <div className="bg-muted/50 p-6 rounded-lg space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Source</p>
                <code className="text-sm bg-background px-2 py-1 rounded">Google Fonts</code>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Available Weights</p>
                <div className="space-y-1">
                  <p className="font-light">300 - Light</p>
                  <p className="font-normal">400 - Regular (Default body text)</p>
                  <p className="font-medium">500 - Medium</p>
                  <p className="font-semibold">600 - Semibold</p>
                  <p className="font-bold">700 - Bold</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Usage</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Body text and paragraphs (400 weight)</li>
                  <li>Form labels and inputs</li>
                  <li>Buttons and interactive elements</li>
                  <li>Table content and data displays</li>
                  <li>Fallback font for headers when Acumin Pro is unavailable</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle>Atlas Brand Colors</CardTitle>
          </div>
          <CardDescription>Official brand color palette with complete specifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Atlas Gold */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg border-2 border-border shadow-sm" style={{ backgroundColor: 'hsl(43, 76%, 48%)' }} />
              <div className="flex-1">
                <h4 className="text-lg font-bold mb-2">Atlas Gold</h4>
                <p className="text-sm text-muted-foreground mb-3">Premium, warm metallic representing quality and craftsmanship</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">HSL</p>
                    <code className="font-mono">43 76% 48%</code>
                  </div>
                  <div>
                    <p className="text-muted-foreground">HEX</p>
                    <code className="font-mono">#D4A017</code>
                  </div>
                  <div>
                    <p className="text-muted-foreground">RGB</p>
                    <code className="font-mono">212, 160, 23</code>
                  </div>
                  <div>
                    <p className="text-muted-foreground">PMS (approx)</p>
                    <code className="font-mono">7550 C</code>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">CSS Variable:</p>
                  <code className="text-xs bg-background px-2 py-1 rounded">--atlas-gold</code>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Atlas Ocean */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg border-2 border-border shadow-sm" style={{ backgroundColor: 'hsl(205, 87%, 29%)' }} />
              <div className="flex-1">
                <h4 className="text-lg font-bold mb-2">Atlas Ocean</h4>
                <p className="text-sm text-muted-foreground mb-3">Deep, rich blue evoking depth, trust, and exploration</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">HSL</p>
                    <code className="font-mono">205 87% 29%</code>
                  </div>
                  <div>
                    <p className="text-muted-foreground">HEX</p>
                    <code className="font-mono">#0A5484</code>
                  </div>
                  <div>
                    <p className="text-muted-foreground">RGB</p>
                    <code className="font-mono">10, 84, 132</code>
                  </div>
                  <div>
                    <p className="text-muted-foreground">PMS (approx)</p>
                    <code className="font-mono">7692 C</code>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">CSS Variable:</p>
                  <code className="text-xs bg-background px-2 py-1 rounded">--atlas-ocean</code>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Atlas Charcoal */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg border-2 border-border shadow-sm" style={{ backgroundColor: 'hsl(216, 12%, 27%)' }} />
              <div className="flex-1">
                <h4 className="text-lg font-bold mb-2">Atlas Charcoal</h4>
                <p className="text-sm text-muted-foreground mb-3">Sophisticated neutral providing structure and contrast</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">HSL</p>
                    <code className="font-mono">216 12% 27%</code>
                  </div>
                  <div>
                    <p className="text-muted-foreground">HEX</p>
                    <code className="font-mono">#3D424D</code>
                  </div>
                  <div>
                    <p className="text-muted-foreground">RGB</p>
                    <code className="font-mono">61, 66, 77</code>
                  </div>
                  <div>
                    <p className="text-muted-foreground">PMS (approx)</p>
                    <code className="font-mono">432 C</code>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">CSS Variable:</p>
                  <code className="text-xs bg-background px-2 py-1 rounded">--atlas-charcoal</code>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Atlas Warm Gray */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg border-2 border-border shadow-sm" style={{ backgroundColor: 'hsl(30, 8%, 60%)' }} />
              <div className="flex-1">
                <h4 className="text-lg font-bold mb-2">Atlas Warm Gray</h4>
                <p className="text-sm text-muted-foreground mb-3">Versatile mid-tone balancing warmth and neutrality</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">HSL</p>
                    <code className="font-mono">30 8% 60%</code>
                  </div>
                  <div>
                    <p className="text-muted-foreground">HEX</p>
                    <code className="font-mono">#9D9690</code>
                  </div>
                  <div>
                    <p className="text-muted-foreground">RGB</p>
                    <code className="font-mono">157, 150, 144</code>
                  </div>
                  <div>
                    <p className="text-muted-foreground">PMS (approx)</p>
                    <code className="font-mono">Warm Gray 7 C</code>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">CSS Variable:</p>
                  <code className="text-xs bg-background px-2 py-1 rounded">--atlas-warm-gray</code>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Atlas Cream */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg border-2 border-border shadow-sm" style={{ backgroundColor: 'hsl(46, 45%, 92%)' }} />
              <div className="flex-1">
                <h4 className="text-lg font-bold mb-2">Atlas Cream</h4>
                <p className="text-sm text-muted-foreground mb-3">Soft, warm background providing elegance and comfort</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">HSL</p>
                    <code className="font-mono">46 45% 92%</code>
                  </div>
                  <div>
                    <p className="text-muted-foreground">HEX</p>
                    <code className="font-mono">#F3EFE0</code>
                  </div>
                  <div>
                    <p className="text-muted-foreground">RGB</p>
                    <code className="font-mono">243, 239, 224</code>
                  </div>
                  <div>
                    <p className="text-muted-foreground">PMS (approx)</p>
                    <code className="font-mono">7499 C</code>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">CSS Variable:</p>
                  <code className="text-xs bg-background px-2 py-1 rounded">--atlas-cream</code>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Semantic Color Mapping */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Layers className="h-5 w-5 text-primary" />
            <CardTitle>Semantic Color Mapping</CardTitle>
          </div>
          <CardDescription>How brand colors map to UI semantic tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono">--primary</code>
                  <Badge>Atlas Ocean</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Main brand color for buttons, links, and primary actions</p>
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono">--secondary</code>
                  <Badge>Atlas Gold</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Accent color for highlights and secondary actions</p>
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono">--muted</code>
                  <Badge>Atlas Warm Gray</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Subtle backgrounds and disabled states</p>
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono">--background</code>
                  <Badge>Atlas Cream / White</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Main background (light mode: cream, dark mode: charcoal)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Design Tokens */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Box className="h-5 w-5 text-primary" />
            <CardTitle>Design Tokens</CardTitle>
          </div>
          <CardDescription>Spacing, sizing, and other design system tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Spacing Scale</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Extra Small</span>
                  <code className="bg-muted px-2 py-1 rounded">0.25rem (4px)</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Small</span>
                  <code className="bg-muted px-2 py-1 rounded">0.5rem (8px)</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Medium</span>
                  <code className="bg-muted px-2 py-1 rounded">1rem (16px)</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Large</span>
                  <code className="bg-muted px-2 py-1 rounded">1.5rem (24px)</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Extra Large</span>
                  <code className="bg-muted px-2 py-1 rounded">2rem (32px)</code>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Border Radius</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Small</span>
                  <code className="bg-muted px-2 py-1 rounded">0.25rem (4px)</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Medium</span>
                  <code className="bg-muted px-2 py-1 rounded">0.5rem (8px)</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Large</span>
                  <code className="bg-muted px-2 py-1 rounded">0.75rem (12px)</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Full</span>
                  <code className="bg-muted px-2 py-1 rounded">9999px</code>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Styling Standards */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Layout className="h-5 w-5 text-primary" />
            <CardTitle>Component Styling Standards</CardTitle>
          </div>
          <CardDescription>Best practices for common UI components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Buttons</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Primary:</strong> Use <code className="bg-muted px-1 rounded">variant="default"</code> for main actions (Atlas Ocean background)</p>
                <p><strong>Secondary:</strong> Use <code className="bg-muted px-1 rounded">variant="secondary"</code> for alternative actions (Atlas Gold)</p>
                <p><strong>Outline:</strong> Use <code className="bg-muted px-1 rounded">variant="outline"</code> for less prominent actions</p>
                <p><strong>Ghost:</strong> Use <code className="bg-muted px-1 rounded">variant="ghost"</code> for tertiary actions</p>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Cards</h4>
              <div className="space-y-2 text-sm">
                <p>Use <code className="bg-muted px-1 rounded">Card</code> component with <code className="bg-muted px-1 rounded">CardHeader</code>, <code className="bg-muted px-1 rounded">CardContent</code> structure</p>
                <p>Include icons in headers for visual interest and quick recognition</p>
                <p>Use <code className="bg-muted px-1 rounded">CardDescription</code> for subtitle text in muted color</p>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Badges</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Default:</strong> Primary color (Atlas Ocean) for important status</p>
                <p><strong>Secondary:</strong> Muted background for neutral information</p>
                <p><strong>Outline:</strong> Bordered style for tags and categories</p>
                <p><strong>Destructive:</strong> Red for errors or warnings</p>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Forms</h4>
              <div className="space-y-2 text-sm">
                <p>Always use <code className="bg-muted px-1 rounded">Label</code> components with form inputs</p>
                <p>Include helper text for complex fields using muted text color</p>
                <p>Use validation states with appropriate colors and icons</p>
                <p>Group related fields with <code className="bg-muted px-1 rounded">Separator</code> components</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Usage Guidelines</CardTitle>
          <CardDescription>Best practices for maintaining brand consistency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Typography</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Always use Acumin Pro for headers to maintain brand identity</li>
                <li>Keep header hierarchy consistent (h1 → h2 → h3, etc.)</li>
                <li>Use Inter for body text to ensure readability</li>
                <li>Avoid mixing font families within the same component</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Colors</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Always use semantic CSS variables, never hardcode colors</li>
                <li>Maintain sufficient contrast ratios (WCAG AA minimum)</li>
                <li>Use Atlas Gold sparingly as an accent, not a primary color</li>
                <li>Test all designs in both light and dark modes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Components</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Use shadcn/ui components as the foundation</li>
                <li>Customize variants through the design system, not inline styles</li>
                <li>Maintain consistent spacing using the spacing scale</li>
                <li>Include loading and error states for all interactive components</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="pt-6 text-center text-sm text-muted-foreground">
        <p>Atlas Admin Brand Guide • Last Updated: November 12, 2025</p>
        <p className="mt-1">For questions or updates, contact the design team</p>
      </div>
    </div>
  );
};

export default AdminBrandGuide;
