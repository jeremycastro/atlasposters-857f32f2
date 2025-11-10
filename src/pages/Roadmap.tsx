import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, History } from "lucide-react";

// Version data structure
interface RoadmapVersion {
  version: string;
  date: string;
  content: string;
}

const roadmapVersions: RoadmapVersion[] = [
  {
    version: "0.001",
    date: "2025-01-10",
    content: `# 🎯 Atlas Posters: Comprehensive Implementation Plan

## Project Overview
Building two concurrent systems:
- **Atlas Catalog**: Internal product & project management platform
- **atlasposters.com**: Customer-facing storefront with dynamic branding

---

## 🏗️ FOUNDATION: Atlas Catalog Database Architecture

### Core Database Tables

#### 1. **artwork_catalog** (The Source of Truth)
\`\`\`sql
- id (uuid, primary key)
- title (text) - "Bali Rice Terraces at Sunset"
- artist_id (uuid, foreign key to artists table)
- description_long (text) - Full story/description
- description_short (text) - Brief description for products
- category (enum) - travel, sport, culture, nature
- tags (text[]) - Keywords for search/filtering
- source_image_url (text) - Original high-res artwork
- source_image_metadata (jsonb) - Dimensions, DPI, color profile
- rights_status (enum) - owned, licensed, partner
- license_details (jsonb) - Terms, expiration, royalty info
- created_at, updated_at
- status (enum) - draft, approved, archived
\`\`\`

#### 2. **artists**
\`\`\`sql
- id (uuid)
- name (text)
- bio (text)
- website (text)
- social_links (jsonb)
- royalty_rate (decimal) - For revenue sharing
- partner_type (enum) - internal, brand_partner, independent
- brand_assets (jsonb) - Logo, colors, fonts for partner pages
\`\`\`

#### 3. **product_configurations**
\`\`\`sql
- id (uuid)
- artwork_id (uuid, foreign key)
- product_type (enum) - poster, canvas, digital, tshirt, etc.
- default_size (text) - "A2 (42x59cm)"
- default_quality (text) - "Standard"
- default_frame (text) - "Unframed"
- available_sizes (jsonb) - [{name: "A2", price_modifier: 0}, ...]
- available_qualities (jsonb) - [{name: "Premium", price_modifier: 10}, ...]
- available_frames (jsonb) - [{name: "Black Wooden Frame", price_modifier: 15}, ...]
- base_price (decimal)
- production_cost (decimal) - For margin calculations
\`\`\`

#### 4. **platform_products** (Multi-Platform Sync)
\`\`\`sql
- id (uuid)
- product_config_id (uuid, foreign key)
- platform (enum) - shopify, woocommerce, etsy, printful
- platform_product_id (text) - External ID
- platform_handle (text) - URL slug on that platform
- sync_status (enum) - synced, pending, error
- last_synced_at (timestamptz)
- sync_errors (jsonb)
- platform_specific_data (jsonb) - Custom fields per platform
\`\`\`

#### 5. **marketing_landing_pages**
\`\`\`sql
- id (uuid)
- campaign_name (text)
- url_slug (text, unique) - "/summer-adventure-2024"
- heading_1 (text)
- heading_2 (text)
- hero_image_url (text)
- cta_text (text)
- cta_link (text)
- ad_copy_1 (text)
- ad_copy_2 (text)
- keywords (text[])
- product_selection (uuid[]) - Array of product_config_ids
- budget (decimal)
- start_date, end_date
- status (enum) - draft, active, paused, completed
- analytics (jsonb) - Click-through, conversion, etc.
\`\`\`

#### 6. **partner_pages**
\`\`\`sql
- id (uuid)
- partner_id (uuid, foreign key to artists)
- url_slug (text) - "/stick-no-bills"
- page_title (text)
- hero_section (jsonb) - Heading, image, description
- brand_colors (jsonb) - Primary, secondary, accent
- featured_collections (uuid[])
- custom_sections (jsonb) - Flexible content blocks
- is_published (boolean)
\`\`\`

#### 7. **project_tasks** (Built-in PM System)
\`\`\`sql
- id (uuid)
- title (text)
- description (text)
- assigned_to (uuid, foreign key to auth.users)
- project_area (enum) - atlas_catalog, storefront, infrastructure, marketing
- status (enum) - todo, in_progress, review, completed, blocked
- priority (enum) - low, medium, high, urgent
- due_date (date)
- tags (text[])
- checklist_items (jsonb) - [{text: "...", completed: bool}, ...]
- metrics (jsonb) - Custom KPIs
- parent_task_id (uuid) - For subtasks
- created_by, created_at, updated_at
\`\`\`

---

## 📋 PHASE 1: Atlas Catalog - Internal Admin Platform

### Milestone 1.1: Core Infrastructure (Week 1)
**Deliverables:**
- [ ] Supabase project setup with Lovable Cloud
- [ ] Authentication system (email + Google OAuth)
- [ ] User roles table (admin, editor, viewer)
- [ ] Security policies (RLS) for all tables
- [ ] Database migrations for core tables

**Success Metrics:**
- 3 users can log in and have appropriate permissions
- All tables created with proper relationships

---

### Milestone 1.2: Artwork Catalog Module (Week 2)
**Deliverables:**
- [ ] \`/admin/catalog\` - Main catalog view (table/grid toggle)
- [ ] \`/admin/catalog/new\` - Add artwork form
- [ ] \`/admin/catalog/[id]\` - Edit artwork details
- [ ] Image upload system (Supabase Storage)
- [ ] Bulk import via CSV
- [ ] Search & filter by category, artist, tags, status

**Key Features:**
- Visual grid view with thumbnails
- Inline editing for quick updates
- Tag management (autocomplete existing tags)
- Artwork status workflow (draft → approved → published)

**Success Metrics:**
- Can add 100 artworks in under 30 minutes
- Search returns results in <500ms

---

### Milestone 1.3: Product Configuration Builder (Week 3)
**Deliverables:**
- [ ] \`/admin/products\` - Product configurations list
- [ ] \`/admin/products/create-from-artwork\` - Wizard to turn artwork into sellable product
- [ ] Default variant selector (size, quality, frame)
- [ ] Pricing calculator with cost margins
- [ ] Multi-platform target selection (Shopify, WooCommerce, etc.)

**Key Features:**
- Visual variant builder (drag to reorder)
- Real-time price preview with margins
- Duplicate configuration for quick variations
- Bulk update defaults across products

**Success Metrics:**
- Create product from artwork in <2 minutes
- Pricing calculations accurate to actual platform sync

---

### Milestone 1.4: Platform Sync Engine (Week 4)
**Deliverables:**
- [ ] Supabase Edge Functions for platform APIs
- [ ] Shopify sync (create, update, delete)
- [ ] Sync status dashboard
- [ ] Error handling & retry logic
- [ ] Webhook listeners for external changes

**Technical Specs:**
\`\`\`typescript
// Edge Function: sync-product-to-shopify
- Reads from product_configurations + artwork_catalog
- Creates/updates Shopify product via Admin API
- Handles variant creation (all size/quality/frame combos)
- Updates platform_products table with sync status
\`\`\`

**Success Metrics:**
- 100 products sync to Shopify without errors
- Sync time: <5 seconds per product
- Failed syncs logged with actionable error messages

---

### Milestone 1.5: Project Management Module (Week 5)
**Deliverables:**
- [ ] \`/admin/projects\` - Kanban board view
- [ ] \`/admin/projects/list\` - Table view with filters
- [ ] Task creation with checklist builder
- [ ] Assignment & due date management
- [ ] Real-time updates (Supabase Realtime)
- [ ] Email notifications for assignments

**Key Features:**
- Drag-and-drop between status columns
- Filter by assignee, project area, priority
- Progress tracking (% of checklist complete)
- Comment threads on tasks
- Time tracking (optional)

**Success Metrics:**
- Team uses this instead of external PM tools
- Task completion rate visible on dashboard
- Zero tasks "lost" or forgotten

---

## 🌐 PHASE 2: atlasposters.com - Customer Storefront

### Milestone 2.1: Brand Foundation (Week 2-3, parallel with 1.2)
**Deliverables:**
- [ ] Coming Soon page at root \`/\`
- [ ] Brand story section (from email to Meg)
- [ ] Artist/partner pitch section
- [ ] Email capture form (Supabase table)
- [ ] Social media links

**Design Requirements:**
- Logo implementation (test multiple options)
- Color palette application
- Typography system (headings, body, accents)
- Mobile-responsive hero section
- Animated transitions (subtle, professional)

**Success Metrics:**
- Page loads in <2 seconds
- Email capture works (stores in DB)
- Looks professional on mobile & desktop

---

### Milestone 2.2: Brand Guidelines System (Week 3-4)
**Deliverables:**
- [ ] \`/brand-guide\` - Public-facing brand guidelines
- [ ] Logo variations & usage rules
- [ ] Color system with hex codes
- [ ] Typography scale & font files
- [ ] Component showcase (buttons, cards, etc.)
- [ ] Voice & tone guidelines
- [ ] Example layouts

**Technical:**
- Exportable as PDF for partners
- Code snippets for developers
- Figma embed (if applicable)

**Success Metrics:**
- Partners can implement brand correctly
- Internal team references for all design decisions
- Downloadable assets package

---

### Milestone 2.3: Partner Page Architecture (Week 5-6)
**Deliverables:**
- [ ] Dynamic route \`/partner/[slug]\`
- [ ] Partner page template system
- [ ] Stick No Bills (SNB) pilot page
- [ ] Brand color override system
- [ ] Custom hero sections
- [ ] Featured collection grids
- [ ] Partner story section

**Technical Implementation:**
\`\`\`typescript
// Route: /partner/stick-no-bills
- Fetches partner_pages + artists table
- Applies brand_colors override to CSS variables
- Queries products filtered by artist_id
- Renders custom_sections from JSONB
\`\`\`

**SNB Specific Requirements:**
- Parse SNB brand book (colors, fonts, imagery style)
- Custom typography matching SNB aesthetic
- Integration with their Syncio product feed
- "About SNB" section with their story

**Success Metrics:**
- SNB page feels distinctly different from Atlas main brand
- Products display correctly with SNB branding
- Page load time <3 seconds

---

### Milestone 2.4: Landing Page Generator (Week 6-7)
**Deliverables:**
- [ ] \`/admin/marketing/landing-pages\` - Campaign manager
- [ ] Spreadsheet-style table editor
- [ ] One-click page generation
- [ ] Dynamic route \`/lp/[slug]\`
- [ ] A/B testing support
- [ ] Analytics integration (Google Analytics)

**Landing Page Builder Fields:**
\`\`\`
- Campaign Name
- URL Slug
- Heading 1 (H1)
- Heading 2 (H2)
- Hero Image (upload or select from catalog)
- CTA Text + CTA Link
- Ad Copy Section 1
- Ad Copy Section 2
- Keywords (for meta tags)
- Product Selection (multi-select from catalog)
- Budget & Duration
- Target Audience Notes
\`\`\`

**Technical Flow:**
1. Admin fills out row in table
2. Clicks "Generate Page"
3. Edge function creates landing page entry
4. Page is live at \`/lp/summer-adventure-2024\`
5. Analytics tracking code auto-added

**Success Metrics:**
- Marketing team creates 5 test pages in <15 minutes
- Pages rank on Google for target keywords
- Conversion tracking works (form submissions, cart adds)

---

### Milestone 2.5: Enhanced Product Detail Pages (Week 7-8)
**Deliverables:**
- [ ] Redesigned \`/product/[handle]\` page
- [ ] Default variant pre-selection (from metadata)
- [ ] Large image gallery (zoom, swipe)
- [ ] Artist bio section
- [ ] Frame preview toggle (visual frame mockup)
- [ ] Size comparison chart
- [ ] "Similar Artworks" recommendations
- [ ] Add to Cart with real-time price updates

**UX Improvements:**
- Sticky Add to Cart button on mobile
- Visual frame selector (not dropdown)
- Size visualization (room mockup)
- Quality comparison (Standard vs Premium)
- Shipping estimate calculator

**Success Metrics:**
- Conversion rate >3% (industry standard ~2%)
- Average time on page >45 seconds
- Reduced cart abandonment

---

## 🔗 PHASE 3: Integration & Launch (Week 8-10)

### Milestone 3.1: Product Import & Sync
**Deliverables:**
- [ ] Syncio connection for SNB products
- [ ] Atlas Catalog import for Quantity Postcards
- [ ] Metadata enrichment for all products
- [ ] Bulk default variant assignment
- [ ] Image optimization pipeline

---

### Milestone 3.2: Testing & Optimization
**Deliverables:**
- [ ] End-to-end purchase flow testing
- [ ] Mobile responsiveness audit
- [ ] Page speed optimization (<3s load)
- [ ] SEO metadata for all pages
- [ ] Error handling & fallbacks

---

### Milestone 3.3: Launch Preparation
**Deliverables:**
- [ ] Production database backup strategy
- [ ] Monitoring & alerts setup
- [ ] Customer support email templates
- [ ] Returns/refunds policy pages
- [ ] Privacy policy & terms of service

---

## 📊 Project Management Structure

### Weekly Rhythm
**Mondays:**
- Sprint planning (assign tasks for the week)
- Review blockers from previous week

**Wednesdays:**
- Mid-week check-in (async updates)
- Share progress screenshots/demos

**Fridays:**
- Sprint review (what shipped this week)
- Retrospective (what to improve)
- Plan next week's priorities

---

### Built-in Accountability System

**Task Status Workflow:**
\`\`\`
TODO → IN PROGRESS → REVIEW → COMPLETED
          ↓
       BLOCKED (with reason + unblock plan)
\`\`\`

**Automated Reminders:**
- Tasks overdue by 2 days → Slack/email notification
- Tasks in REVIEW >24 hours → Notify reviewer
- BLOCKED tasks >48 hours → Escalate to team

**Progress Dashboard:**
- Burndown chart (tasks completed vs remaining)
- Velocity tracking (tasks/week)
- Blockers visualization
- Individual contributor metrics

---

## 🚦 Decision Checkpoints

### Before We Build Anything:
1. **Is this aligned with the core mission?**
   - Does it help artists share their stories?
   - Does it make buying posters easier?
   - Does it support multi-platform flexibility?

2. **Does this create technical debt?**
   - Can we scale this to 1M+ artworks?
   - Will this lock us into one platform?
   - Is this maintainable long-term?

3. **What's the MVP version?**
   - What can we cut and still ship value?
   - What can be manual for the first 10 customers?

---

## 🎯 Success Criteria

### Atlas Catalog Launch (Week 5)
- [ ] 50+ artworks cataloged
- [ ] 3 team members trained & using daily
- [ ] Products syncing to Shopify automatically
- [ ] Zero manual product entry in Shopify

### atlasposters.com Launch (Week 8)
- [ ] Coming soon page live with email capture
- [ ] 1 partner page (SNB) published
- [ ] 5 marketing landing pages generated
- [ ] First test order completed end-to-end

### 90-Day Vision (Week 12)
- [ ] 500+ products in catalog
- [ ] 2+ brand partners onboarded
- [ ] 10+ marketing campaigns running
- [ ] All product management in Atlas Catalog (Shopify is just fulfillment layer)`,
  },
];

const Roadmap = () => {
  const [selectedVersion, setSelectedVersion] = useState(roadmapVersions[0].version);
  const currentRoadmap = roadmapVersions.find((v) => v.version === selectedVersion) || roadmapVersions[0];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Atlas Posters Roadmap</h1>
            <p className="text-muted-foreground">
              Comprehensive implementation plan and version tracking
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link to="/changelog">
              <Button variant="outline" className="gap-2">
                <History className="w-4 h-4" />
                Changelog
              </Button>
            </Link>
            <Link to="/techstack">
              <Button variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                Tech Stack
              </Button>
            </Link>
          </div>
        </div>

        {/* Version Selector */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <label htmlFor="version" className="text-sm font-medium text-foreground">
                Version:
              </label>
              <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roadmapVersions.map((version) => (
                    <SelectItem key={version.version} value={version.version}>
                      v{version.version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="secondary">{currentRoadmap.date}</Badge>
            </div>
            
            {selectedVersion === roadmapVersions[0].version && (
              <Badge className="bg-primary text-primary-foreground">Current</Badge>
            )}
          </div>
        </div>

        {/* Roadmap Content */}
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {currentRoadmap.content}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Roadmap;
