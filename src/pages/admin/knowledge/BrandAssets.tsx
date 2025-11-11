import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Upload, Shield, Sparkles, Image, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BrandAssets = () => {
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

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Brand Asset Guidelines</h1>
          </div>
          <p className="text-muted-foreground">
            Standards for brand logos, color systems, identity management, and asset organization
          </p>
        </div>

        {/* Overview */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Brand Identity System</h2>
          <p className="text-foreground mb-4">
            Atlas maintains a comprehensive brand asset management system that ensures consistent, 
            professional representation of partner brands across all touchpoints. This system 
            supports the creation of dynamic brand pages and branded product experiences.
          </p>
          <div className="bg-primary/10 border-l-4 border-primary p-4 rounded">
            <p className="font-semibold">Design Philosophy:</p>
            <p className="text-sm text-muted-foreground">
              Every brand asset is treated as a building block for creating cohesive, on-brand 
              experiences. From logos to color palettes, each element contributes to telling the brand's story.
            </p>
          </div>
        </Card>

        {/* Logo Management */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Image className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Logo Management</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Supported Logo Formats</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-3 bg-muted rounded-lg">
                  <Badge className="mb-2">SVG (Preferred)</Badge>
                  <p className="text-sm text-muted-foreground">
                    Vector format - scales perfectly at any size. Ideal for responsive designs and print.
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <Badge variant="secondary" className="mb-2">PNG</Badge>
                  <p className="text-sm text-muted-foreground">
                    Raster with transparency. Good for complex logos with effects. Recommended 300 DPI minimum.
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <Badge variant="secondary" className="mb-2">WEBP</Badge>
                  <p className="text-sm text-muted-foreground">
                    Modern format with excellent compression. Smaller file sizes with maintained quality.
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <Badge variant="secondary" className="mb-2">JPG</Badge>
                  <p className="text-sm text-muted-foreground">
                    Use only for logos without transparency. Not recommended for primary logos.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">File Size Limits</h3>
              <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg">
                <p className="font-semibold text-sm mb-2">Maximum: 5MB per file</p>
                <p className="text-sm text-muted-foreground">
                  This limit ensures fast loading times while accommodating high-quality assets. 
                  Most logos should be well under 1MB. If exceeding limit, optimize the file or 
                  choose a more efficient format.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Logo Variants</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Upload multiple logo versions to handle different use cases:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="shrink-0">Primary</Badge>
                  <span>Main logo with full color and tagline - use on light backgrounds</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="shrink-0">Light</Badge>
                  <span>White or light version for dark backgrounds and imagery</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="shrink-0">Mark</Badge>
                  <span>Icon or symbol only - for small spaces like favicons or app icons</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="shrink-0">Horizontal</Badge>
                  <span>Wide format for headers and banners</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Color System */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Brand Color System</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Three-Tier Color Palette</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Each brand has three core colors that define its visual identity:
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="w-12 h-12 rounded bg-gradient-to-br from-blue-600 to-blue-800 shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Primary Color</h4>
                    <p className="text-sm text-muted-foreground">
                      The main brand color - used for buttons, headings, and primary CTAs. 
                      Should be distinctive and memorable.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="w-12 h-12 rounded bg-gradient-to-br from-slate-600 to-slate-800 shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Secondary Color</h4>
                    <p className="text-sm text-muted-foreground">
                      Complementary color for secondary elements, backgrounds, and supporting UI. 
                      Provides contrast without competing with primary.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="w-12 h-12 rounded bg-gradient-to-br from-purple-600 to-purple-800 shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Accent Color</h4>
                    <p className="text-sm text-muted-foreground">
                      Highlight color for special features, badges, and attention-grabbing elements. 
                      Use sparingly for maximum impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Color Format: HEX Codes</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-mono text-center text-lg mb-2">#RRGGBB</p>
                <p className="text-sm text-muted-foreground text-center">
                  Store colors as 6-digit hexadecimal codes for universal compatibility
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <code className="text-sm">#3B82F6</code>
                  <code className="text-sm">#64748B</code>
                  <code className="text-sm">#A855F7</code>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Brand Identity Fields */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Brand Identity Elements</h2>
          </div>

          <div className="space-y-4">
            <div className="border-l-2 border-primary pl-4">
              <h3 className="font-semibold mb-2">Brand Name</h3>
              <p className="text-sm text-muted-foreground">
                Official brand name - used in page titles, navigation, and product descriptions
              </p>
            </div>

            <div className="border-l-2 border-blue-600 pl-4">
              <h3 className="font-semibold mb-2">Tagline</h3>
              <p className="text-sm text-muted-foreground">
                Short, memorable phrase that captures brand essence. Appears below logos and in headers.
                <br />
                <span className="text-xs italic">Example: "Authentic. Timeless. Yours."</span>
              </p>
            </div>

            <div className="border-l-2 border-purple-600 pl-4">
              <h3 className="font-semibold mb-2">Brand Story</h3>
              <p className="text-sm text-muted-foreground">
                Narrative that explains brand history, values, and what makes it unique. 
                Used on brand landing pages and about sections. Aim for 100-300 words.
              </p>
            </div>

            <div className="border-l-2 border-green-600 pl-4">
              <h3 className="font-semibold mb-2">Website URL</h3>
              <p className="text-sm text-muted-foreground">
                Official brand website - linked from brand pages for customers who want to learn more
              </p>
            </div>

            <div className="border-l-2 border-orange-600 pl-4">
              <h3 className="font-semibold mb-2">Social Media Links</h3>
              <p className="text-sm text-muted-foreground">
                Instagram, Twitter, Facebook, TikTok, Pinterest - helps customers connect with brands 
                they love and follow their latest content
              </p>
            </div>
          </div>
        </Card>

        {/* Upload Process */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Asset Upload Process</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Single Upload</h3>
              <p className="text-sm text-muted-foreground mb-2">
                For individual brands or when adding specific logo variants:
              </p>
              <ol className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>1. Navigate to Partner → Brands tab</li>
                <li>2. Select or create brand</li>
                <li>3. Scroll to logo upload section</li>
                <li>4. Click upload or drag file into dropzone</li>
                <li>5. Logo appears immediately in gallery</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Bulk Upload</h3>
              <p className="text-sm text-muted-foreground mb-2">
                For uploading multiple logos at once (new partners or logo variants):
              </p>
              <ol className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>1. Access bulk upload interface</li>
                <li>2. Drag multiple files into upload area</li>
                <li>3. Review files in queue with preview thumbnails</li>
                <li>4. Remove any incorrect files before upload</li>
                <li>5. Confirm upload - progress shown for each file</li>
                <li>6. All logos saved to brand-assets bucket</li>
              </ol>
            </div>
          </div>
        </Card>

        {/* Security & Access */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Security & Access Control</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Storage Bucket: brand-assets</h3>
              <p className="text-sm text-muted-foreground mb-3">
                All brand logos and assets are stored in a secure Supabase storage bucket 
                with Row Level Security (RLS) policies.
              </p>

              <div className="space-y-2">
                <div className="flex items-start gap-2 p-3 bg-muted rounded">
                  <Badge>Public Read</Badge>
                  <p className="text-sm text-muted-foreground">
                    Logos are publicly accessible for display on product pages and brand landing pages
                  </p>
                </div>

                <div className="flex items-start gap-2 p-3 bg-muted rounded">
                  <Badge variant="secondary">Authenticated Upload</Badge>
                  <p className="text-sm text-muted-foreground">
                    Only authenticated admins and partners can upload or modify brand assets
                  </p>
                </div>

                <div className="flex items-start gap-2 p-3 bg-muted rounded">
                  <Badge variant="outline">Partner Isolation</Badge>
                  <p className="text-sm text-muted-foreground">
                    Partners can only manage assets for their own brands, not other partners' assets
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Best Practices */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Asset Management Best Practices</h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Badge className="bg-green-600 shrink-0">✓</Badge>
              <div>
                <p className="font-semibold text-sm">Use SVG when possible</p>
                <p className="text-xs text-muted-foreground">
                  Vector logos ensure perfect quality at any size and smaller file sizes
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Badge className="bg-green-600 shrink-0">✓</Badge>
              <div>
                <p className="font-semibold text-sm">Name files descriptively</p>
                <p className="text-xs text-muted-foreground">
                  Use clear names like "brand-logo-primary.svg" or "brand-logo-white.png"
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Badge className="bg-green-600 shrink-0">✓</Badge>
              <div>
                <p className="font-semibold text-sm">Optimize before upload</p>
                <p className="text-xs text-muted-foreground">
                  Compress images and remove unnecessary metadata to keep file sizes minimal
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <Badge className="bg-red-600 shrink-0">✗</Badge>
              <div>
                <p className="font-semibold text-sm">Avoid uploading draft files</p>
                <p className="text-xs text-muted-foreground">
                  Only upload final, approved logo versions to maintain professional appearance
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Version 0.4.0</strong> - Brand Asset Guidelines - Admin Knowledge Base
          </p>
        </div>
      </main>
    </div>
  );
};

export default BrandAssets;
