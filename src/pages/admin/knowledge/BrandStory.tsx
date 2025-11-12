import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Users, MessageSquare, FileText, Megaphone, TrendingUp } from "lucide-react";

const BrandStory = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Atlas Brand Story & Messaging Guide</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Complete brand narrative, positioning, target audiences, messaging pillars, voice guidelines, 
          and content frameworks for all marketing campaigns
        </p>
        <div className="flex gap-2 mt-4">
          <Badge variant="outline">Brand</Badge>
          <Badge variant="outline">Messaging</Badge>
          <Badge variant="outline">Marketing</Badge>
          <Badge variant="outline">Content Strategy</Badge>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Brand Foundation Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Brand Foundation
          </CardTitle>
          <CardDescription>
            Origin Story, Mission, Vision, Values & Positioning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Origin Story</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 1: Draft Origin Story & Brand Narrative
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Mission</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 2: Define Mission, Vision & Core Values
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Vision</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 2: Define Mission, Vision & Core Values
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Core Values</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 2: Define Mission, Vision & Core Values
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Positioning Statement</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 3: Craft Positioning Statement & Brand Promise
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Brand Promise</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 3: Craft Positioning Statement & Brand Promise
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Target Audiences Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Target Audiences
          </CardTitle>
          <CardDescription>
            Detailed personas for our three core audiences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Artists & Creators</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 4: Develop Artist & Creator Persona
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Brands & IP Holders</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 5: Develop Brand & IP Holder Persona
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Adventurers & Art Buyers</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 6: Develop Adventurer & Art Buyer Persona
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Brand Personality & Voice Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Brand Personality & Voice
          </CardTitle>
          <CardDescription>
            Archetype, traits, tone guidelines, and writing style
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Brand Archetype & Personality</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 7: Define Brand Personality & Archetype
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Tone of Voice Guidelines</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 8: Establish Tone of Voice Guidelines
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Key Messaging Pillars</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 9: Document Key Messaging Pillars
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Writing Style Examples</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 10: Create Writing Style Examples & Do's/Don'ts
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Messaging Matrix</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 11: Build Messaging Matrix (Audience × Message)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Story Narratives Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Brand Story Narratives
          </CardTitle>
          <CardDescription>
            Three versions of the Atlas story for different contexts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Elevator Pitch (30 seconds)</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 12: Write Brand Story Narratives
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Short Story (2-3 paragraphs)</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 12: Write Brand Story Narratives
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Long Story (5-8 paragraphs)</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 12: Write Brand Story Narratives
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Content Guidelines Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Content Guidelines by Channel
          </CardTitle>
          <CardDescription>
            Tone, format, and messaging approach for each platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Website Content</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 13: Create Content Guidelines by Channel
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Social Media</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 13: Create Content Guidelines by Channel
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Email Marketing</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 13: Create Content Guidelines by Channel
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Partner Communications</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 13: Create Content Guidelines by Channel
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Templates Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Campaign Framework Templates
          </CardTitle>
          <CardDescription>
            Copy-paste templates for common campaign types
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Product Launch Template</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 14: Build Campaign Framework Templates
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Artist Spotlight Template</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 14: Build Campaign Framework Templates
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Seasonal Campaign Template</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 14: Build Campaign Framework Templates
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Brand Partnership Template</h3>
            <p className="text-muted-foreground italic">
              Content will be populated from Task 14: Build Campaign Framework Templates
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SEO & Keywords Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>SEO Keywords & Content Pillars</CardTitle>
          <CardDescription>
            Primary keywords and content themes tied to brand story
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">
            Content will be populated from Task 15: Define SEO Keywords & Content Pillars
          </p>
        </CardContent>
      </Card>

      {/* Quick Reference Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reference Cheat Sheet</CardTitle>
          <CardDescription>
            One-page summary of key brand elements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">
            This section will be auto-generated from all completed tasks once the milestone is finished
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandStory;
