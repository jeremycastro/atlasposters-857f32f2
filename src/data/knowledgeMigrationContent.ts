// Pre-converted markdown content for existing knowledge articles
// These will be inserted as version 1 during migration

export const articleMarkdownContent: Record<string, string> = {
  "sku-methodology": `# Atlas SKU Methodology

The Atlas SKU system provides a comprehensive, hierarchical approach to product identification and cataloging. This guide covers the complete SKU structure from the ASC (Atlas Sequential Code) to variant specifications.

## ASC Code System

The Atlas Sequential Code (ASC) is the foundation of our product identification system. Every artwork in the Atlas catalog receives a unique ASC code.

### ASC Format: \`DDLnnn\`

| Component | Description | Example |
|-----------|-------------|---------|
| DD | Decade digit (10 for 2020s, 11 for 2030s) | 10 |
| L | Letter code (A-Z cycling based on sequence) | A |
| nnn | 3-digit number (000-999) | 001 |

**Examples:** \`10A001\`, \`10A002\`, \`10B000\`, \`10B001\`

### Generation Rules

- ASC codes are generated automatically by the \`generate_next_asc()\` database function
- Each code is guaranteed unique through PostgreSQL sequence
- Letter rotates every 1000 codes
- Decade digit changes every 10 years

## Complete SKU Structure

A full product SKU follows this pattern:

\`\`\`
{ASC}-{TYPE}-{VAR1}-{VAR2}-{VAR3}
\`\`\`

### Component Breakdown

| Position | Code | Description | Example |
|----------|------|-------------|---------|
| 1 | ASC | Artwork identifier | 10A001 |
| 2 | TYPE | Product type (3 letters) | FRP, POS, CNV |
| 3 | VAR1 | Size code | A4, 18, 24 |
| 4 | VAR2 | Material/finish | MT, GL, UN |
| 5 | VAR3 | Frame option | NF, BK, WH |

### Product Type Codes

| Code | Product Type |
|------|-------------|
| FRP | Framed Print |
| POS | Poster |
| CNV | Canvas |
| ACP | Acrylic Print |
| MTP | Metal Print |
| PHO | Photo Print |

### Size Codes

Standard sizes use two-digit codes representing the shorter dimension in inches:

| Code | Dimensions |
|------|-----------|
| A4 | A4 (210×297mm) |
| A3 | A3 (297×420mm) |
| 08 | 8×10" |
| 11 | 11×14" |
| 16 | 16×20" |
| 18 | 18×24" |
| 24 | 24×36" |

### Frame Codes

| Code | Frame Type |
|------|-----------|
| NF | No Frame |
| BK | Black Frame |
| WH | White Frame |
| NT | Natural Wood |
| GD | Gold Frame |
| SL | Silver Frame |

## Full SKU Examples

| SKU | Description |
|-----|-------------|
| \`10A001-FRP-18-MT-BK\` | Artwork 10A001, Framed Print, 18×24", Matte, Black Frame |
| \`10A001-POS-24-GL-NF\` | Artwork 10A001, Poster, 24×36", Gloss, No Frame |
| \`10B042-CNV-16-UN-NF\` | Artwork 10B042, Canvas, 16×20", Uncoated, No Frame |

## Best Practices

1. **Always start with ASC** - Never skip the artwork identifier
2. **Use standard codes** - Don't create custom codes without approval
3. **Maintain consistency** - Same product = same SKU structure
4. **Document exceptions** - If a product doesn't fit standard codes, document why
`,

  "partner-management": `# Partner Management Workflow

The Partner Management system is the foundation of Atlas's collaboration network. It provides comprehensive tools for tracking partner information, brand relationships, agreements, contacts, and addresses.

## Overview

> **Core Purpose:** Maintain professional relationships with brands and licensors while organizing all necessary business data for smooth collaboration and legal compliance.

## Onboarding New Partners

### Step 1: Create Partner Record

Navigate to Partner Management and create a new partner entry with:

- **Partner Name:** Official business name
- **Partner Type:** Brand, Licensor, Distributor, etc.
- **Status:** Active, Pending, Inactive
- **Notes:** Initial relationship context and background

### Step 2: Add Contact Information

In the Contacts tab, add all relevant stakeholders:

- Primary contact (decision maker)
- Secondary contacts (account managers, creative teams)
- Contact details: Name, role, email, phone
- Note contact preferences and best times to reach

### Step 3: Record Business Addresses

In the Addresses tab, document all relevant locations:

- **Billing Address:** For invoices and payments
- **Shipping Address:** For physical deliverables
- **Legal Address:** Registered business location
- Mark primary address for default use

### Step 4: Establish Brand Relationships

In the Brands tab, connect partner to their brand identities:

- Create or link existing brand records
- Upload brand logos and assets
- Define brand colors (primary, secondary, accent)
- Add taglines, brand stories, and social links

### Step 5: Document Agreements

In the Agreements tab, track all legal and business agreements:

- Agreement type (License, Distribution, NDA, etc.)
- Start and end dates with renewal tracking
- Key terms and special conditions
- Upload agreement documents for reference

## Core Features

| Feature | Description |
|---------|-------------|
| Tabbed Interface | Organized tabs keep partner data structured and accessible |
| Search & Filter | Quickly find partners by name, type, or status |
| Multiple Contacts | Unlimited contacts per partner with roles |
| Agreement Tracking | Monitor lifecycles with start/end dates |
| Brand Asset Management | Store logos, colors, and identity information |
| Document Storage | Secure storage with Row Level Security |

## Best Practices

1. **Keep Information Current** - Regularly update contact information and agreement statuses
2. **Document Everything** - Use notes fields to capture conversation summaries and requirements
3. **Set Agreement Reminders** - Review agreements 60-90 days before expiration
4. **Organize Brand Assets Immediately** - Upload logos and define colors when partnerships are established
5. **Maintain Contact Hierarchy** - Clearly identify primary vs. secondary contacts

## Partner Status Types

| Status | Description |
|--------|-------------|
| **Active** | Current partnerships with active agreements |
| **Pending** | Partnerships under discussion or onboarding |
| **Inactive** | Concluded partnerships, maintained for reference |
`,

  "brand-assets": `# Brand Asset Guidelines

Standards for brand logos, color systems, identity management, and asset organization across the Atlas platform.

## Brand Identity System

Atlas maintains a comprehensive brand asset management system that ensures consistent, professional representation of partner brands across all touchpoints.

> **Design Philosophy:** Every brand asset is treated as a building block for creating cohesive, on-brand experiences. From logos to color palettes, each element contributes to telling the brand's story.

## Logo Management

### Supported Logo Formats

| Format | Notes |
|--------|-------|
| **SVG (Preferred)** | Vector format - scales perfectly at any size |
| **PNG** | Raster with transparency, recommended 300 DPI minimum |
| **WEBP** | Modern format with excellent compression |
| **JPG** | Use only for logos without transparency |

### File Size Limits

**Maximum: 5MB per file**

Most logos should be well under 1MB. If exceeding limit, optimize the file or choose a more efficient format.

### Logo Variants

Upload multiple logo versions for different use cases:

- **Primary:** Main logo with full color and tagline - for light backgrounds
- **Light:** White or light version for dark backgrounds
- **Mark:** Icon or symbol only - for small spaces like favicons
- **Horizontal:** Wide format for headers and banners

## Brand Color System

### Three-Tier Color Palette

Each brand has three core colors that define its visual identity:

1. **Primary Color** - Main brand color for buttons, headings, and primary CTAs
2. **Secondary Color** - Complementary color for secondary elements and backgrounds
3. **Accent Color** - Highlight color for special features and badges (use sparingly)

### Color Format

Store colors as 6-digit hexadecimal codes:

\`\`\`
#RRGGBB
Example: #3B82F6, #64748B, #A855F7
\`\`\`

## Brand Identity Elements

| Element | Purpose |
|---------|---------|
| **Brand Name** | Official name for titles and navigation |
| **Tagline** | Short phrase capturing brand essence |
| **Brand Story** | Narrative explaining history and values (100-300 words) |
| **Website URL** | Official brand website |
| **Social Links** | Instagram, Twitter, Facebook, TikTok, Pinterest |

## Asset Upload Process

### Single Upload

1. Navigate to Partner → Brands tab
2. Select or create brand
3. Scroll to logo upload section
4. Click upload or drag file into dropzone
5. Logo appears immediately in gallery

### Bulk Upload

1. Access bulk upload interface
2. Drag multiple files into upload area
3. Review files in queue with previews
4. Remove any incorrect files
5. Confirm upload - progress shown for each file

## Security & Access Control

**Storage Bucket:** brand-assets

| Access Level | Description |
|--------------|-------------|
| Public Read | Logos accessible for product pages and landing pages |
| Authenticated Upload | Only admins and partners can upload |
| Partner Isolation | Partners can only manage their own assets |

## Best Practices

✓ **Use SVG when possible** - Vector logos ensure perfect quality at any size

✓ **Name files descriptively** - Use names like "brand-logo-primary.svg"

✓ **Optimize before upload** - Compress images and remove unnecessary metadata

✗ **Avoid uploading draft files** - Only upload final, approved logo versions
`,

  "task-management": `# Task Management Process

How to effectively use the task system for project tracking, collaboration, status updates, and milestone delivery.

## Overview

The Task Manager provides a comprehensive project management interface with Kanban boards, status tracking, and team collaboration features.

## Task States

| Status | Description | Color |
|--------|-------------|-------|
| **Backlog** | Tasks identified but not yet scheduled | Gray |
| **To Do** | Tasks ready to be worked on | Blue |
| **In Progress** | Tasks actively being worked on | Yellow |
| **Review** | Tasks pending review or approval | Purple |
| **Done** | Completed tasks | Green |

## Creating Tasks

### Required Fields

- **Title:** Clear, actionable task description
- **Priority:** Low, Medium, High, Critical
- **Status:** Initial state (usually Backlog or To Do)

### Optional Fields

- **Description:** Detailed task requirements
- **Assignee:** Team member responsible
- **Due Date:** Target completion date
- **Tags:** Categorization labels

## Task Views

### Kanban Board

Drag-and-drop interface organized by status columns. Best for:
- Visual workflow management
- Quick status updates
- Sprint planning

### Table View

Sortable list with all task details. Best for:
- Bulk operations
- Filtering and searching
- Detailed analysis

## Workflow Best Practices

### Daily Workflow

1. Review tasks in "To Do" column
2. Move selected tasks to "In Progress"
3. Update task descriptions with progress notes
4. Move completed tasks to "Review"

### Weekly Review

1. Archive completed tasks older than 2 weeks
2. Prioritize backlog items for next sprint
3. Review overdue tasks and adjust dates
4. Update stakeholders on blockers

## Task Comments

Use comments to:
- Document decisions and discussions
- Request clarification
- Provide progress updates
- Tag team members for attention

## Filtering Tasks

| Filter | Use Case |
|--------|----------|
| By Assignee | View your tasks or specific team member's work |
| By Priority | Focus on critical items first |
| By Status | Find tasks in specific workflow stages |
| By Due Date | Identify upcoming deadlines |

## Integration with Roadmap

Tasks can be linked to roadmap milestones:

1. Create milestone in Roadmap Manager
2. Create related tasks in Task Manager
3. Link tasks to milestone deliverables
4. Track milestone progress through task completion
`,

  "artwork-catalog": `# Artwork Catalog Architecture

Complete technical documentation for the Artwork Catalog module including database schema, frontend components, and ASC code system.

## Module Overview

The Artwork Catalog is the central module for managing artwork submissions, tracking ASC codes, and organizing the complete artwork lifecycle.

### Key Features

- Automated ASC (Atlas Sequential Code) generation
- Partner-based artwork submission and management
- Status lifecycle management (draft → active → archived)
- File attachment system with metadata tracking
- Full audit trail through asc_history table
- Role-based access control

## Data Hierarchy

\`\`\`
Partner (Top Level)
    │
    ├── Brand (Optional)
    │       │
    │       └── Artwork
    │               │
    │               └── Product
    │
    └── Artwork (Direct to Partner)
            │
            └── Product
\`\`\`

### Relationship Rules

- **Partner → Artwork:** Every artwork must have exactly one partner
- **Brand → Artwork:** Optional - if linked, brand must belong to same partner
- **Artwork → Product:** An artwork can have zero or more products

## Database Schema

### artworks Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| asc_code | text | Generated ASC code (unique) |
| sequence_number | integer | Sequential number from asc_sequence |
| title | text | Artwork title |
| artist_name | text | Artist's name |
| partner_id | uuid | Reference to partner |
| brand_id | uuid | Optional reference to brand |
| status | enum | draft, active, archived |
| metadata | jsonb | Flexible additional data |

### artwork_files Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| artwork_id | uuid | Reference to artwork |
| file_name | text | Original filename |
| file_path | text | Storage bucket path |
| file_type | text | original, print, thumbnail |
| dimensions | text | Pixel dimensions |
| dpi | integer | Resolution |
| is_primary | boolean | Primary display file |

## ASC Generation

The \`generate_next_asc()\` function creates unique codes:

\`\`\`sql
-- Format: DDLnnn
-- DD: Decade (10 for 2020s)
-- L: Letter (A-Z, cycles every 1000)
-- nnn: Number (000-999)

SELECT generate_next_asc();
-- Returns: '10A001'
\`\`\`

## Frontend Components

| Component | Purpose |
|-----------|---------|
| ArtworkCatalog | Main grid view with search/filter |
| CreateArtworkDialog | New artwork form with validation |
| EditArtworkDialog | Modify existing artwork |
| ArtworkDetailDialog | Tabbed detail view |
| ArtworkFileUpload | File upload with drag-drop |

## Row Level Security

| Policy | Access |
|--------|--------|
| Active artworks | Public view |
| Draft artworks | Partner + Admin only |
| Create | Partners (own) + Admin |
| Update | Partners (own) + Admin |
| Delete | Admin only |

## Status Workflow

\`\`\`
Draft → Active → Archived
  │       │         │
  │       │         └── Permanent storage
  │       └── Visible to customers
  └── Internal only
\`\`\`
`,

  "admin-brand-guide": `# Atlas Admin Brand Guide

Complete brand system for the Atlas Admin interface including typography, colors, design tokens, and component styling standards.

## Design Philosophy

The Atlas Admin interface follows a clean, professional aesthetic that prioritizes:

- **Clarity:** Information hierarchy is immediately apparent
- **Consistency:** Similar patterns across all modules
- **Efficiency:** Minimal clicks to accomplish tasks
- **Accessibility:** WCAG 2.1 AA compliance

## Color System

### Semantic Colors

| Token | Purpose | HSL Value |
|-------|---------|-----------|
| \`--background\` | Page backgrounds | 0 0% 100% |
| \`--foreground\` | Primary text | 222.2 84% 4.9% |
| \`--primary\` | Buttons, links, accents | 222.2 47.4% 11.2% |
| \`--secondary\` | Secondary backgrounds | 210 40% 96.1% |
| \`--muted\` | Subtle backgrounds | 210 40% 96.1% |
| \`--accent\` | Highlights | 210 40% 96.1% |

### Status Colors

| Status | Color | Usage |
|--------|-------|-------|
| Success | Green | Confirmations, completed states |
| Warning | Amber | Cautions, pending states |
| Error | Red | Errors, destructive actions |
| Info | Blue | Informational messages |

## Typography

### Font Stack

\`\`\`css
font-family: 'Inter', system-ui, sans-serif;
\`\`\`

### Scale

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| H1 | 2.25rem | 700 | Page titles |
| H2 | 1.5rem | 600 | Section headers |
| H3 | 1.25rem | 600 | Card titles |
| Body | 1rem | 400 | Default text |
| Small | 0.875rem | 400 | Supporting text |
| Caption | 0.75rem | 400 | Labels, metadata |

## Spacing System

Based on 4px grid:

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Component padding |
| md | 16px | Standard gaps |
| lg | 24px | Section spacing |
| xl | 32px | Page margins |

## Component Standards

### Buttons

| Variant | Usage |
|---------|-------|
| Primary | Main actions |
| Secondary | Alternative actions |
| Outline | Tertiary actions |
| Ghost | Inline actions |
| Destructive | Delete/remove actions |

### Cards

- Use for grouping related content
- Include CardHeader for context
- Padding: 24px (lg)
- Border radius: 8px
- Shadow: subtle elevation

### Tables

- Zebra striping optional
- Sticky headers for long lists
- Sort indicators on sortable columns
- Pagination for 10+ items

### Forms

- Labels above inputs
- Helper text below inputs
- Error messages in red
- Required field indicators (*)

## Dark Mode

All components support dark mode through CSS custom properties. The theme toggle switches between:

- Light: White backgrounds, dark text
- Dark: Dark backgrounds, light text

## Animation Guidelines

| Type | Duration | Easing |
|------|----------|--------|
| Micro | 150ms | ease-out |
| Standard | 200ms | ease-in-out |
| Complex | 300ms | ease-in-out |
| Page | 400ms | ease-in-out |

Use animation sparingly for:
- State changes
- Loading indicators
- Transitions between views
`,

  "brand-story": `# Atlas Brand Story & Messaging Guide

Complete brand narrative, positioning, target audiences, messaging pillars, voice guidelines, and content frameworks for all Atlas marketing campaigns.

## Brand Essence

**Atlas** brings museum-quality art into everyday spaces, making exceptional artwork accessible to everyone.

> "Art should be part of life, not locked away in galleries."

## Mission Statement

To democratize access to beautiful, meaningful artwork by partnering with artists and brands worldwide, delivering museum-quality prints directly to customers' homes.

## Brand Pillars

### 1. Authenticity

- Partner directly with artists and estates
- Licensed, legitimate artwork only
- Transparent sourcing and attribution

### 2. Quality

- Museum-grade printing standards
- Premium materials and finishes
- Professional framing options

### 3. Accessibility

- Affordable pricing tiers
- Global shipping
- Easy discovery and purchase

### 4. Curation

- Expertly selected collections
- Themed experiences
- Editorial storytelling

## Target Audiences

### Primary: Design-Conscious Homeowners

- Age: 28-45
- Values aesthetics and quality
- Willing to invest in home décor
- Active on Instagram/Pinterest

### Secondary: Gift Shoppers

- Seeking meaningful, unique gifts
- Values presentation and unboxing
- Often repeat customers

### Tertiary: Commercial Buyers

- Interior designers
- Hospitality industry
- Corporate offices

## Voice & Tone

### Voice Characteristics

| Attribute | Description |
|-----------|-------------|
| Knowledgeable | We understand art and design |
| Approachable | Not pretentious or exclusive |
| Passionate | Genuine love for what we do |
| Helpful | Guide customers to perfect choices |

### Tone Variations

| Context | Tone |
|---------|------|
| Product descriptions | Evocative, descriptive |
| Customer service | Warm, helpful |
| Social media | Casual, inspiring |
| Partnership | Professional, collaborative |

## Messaging Framework

### Headline Formats

\`\`\`
[Adjective] [Art/Prints] for [Audience/Space]
Transform your [space] with [benefit]
Discover [collection name]: [description]
\`\`\`

### Value Propositions

1. **Quality:** "Museum-quality prints that last a lifetime"
2. **Selection:** "Thousands of artworks from renowned artists"
3. **Service:** "Expert curation, exceptional delivery"
4. **Trust:** "Officially licensed, artist-approved"

## Content Guidelines

### Do's

✓ Use descriptive, evocative language
✓ Tell the story behind artworks
✓ Highlight artist partnerships
✓ Include room styling inspiration
✓ Emphasize quality and craftsmanship

### Don'ts

✗ Use generic stock photo language
✗ Oversell or use hyperbole
✗ Ignore artwork attribution
✗ Focus only on price
✗ Use jargon without explanation

## Campaign Themes

| Season | Theme | Focus |
|--------|-------|-------|
| Spring | Refresh | New beginnings, color |
| Summer | Bold | Statement pieces |
| Fall | Warmth | Cozy, textured |
| Winter | Gift | Giving, special editions |
`,

  "prodigi-api": `# Prodigi API Discovery

Technical documentation for integrating with Prodigi's global print-on-demand fulfillment network.

## Overview

Prodigi is a global print-on-demand platform with production facilities worldwide. They handle printing, framing, and shipping of art prints.

## API Structure

### Base URL

\`\`\`
Production: https://api.prodigi.com/v4.0
Sandbox: https://api.sandbox.prodigi.com/v4.0
\`\`\`

### Authentication

\`\`\`
X-API-Key: your_api_key_here
\`\`\`

## Product SKU Structure

Prodigi uses structured SKUs for product identification:

\`\`\`
{CATEGORY}_{SIZE}_{MATERIAL}_{FINISH}
\`\`\`

### Categories

| Code | Product Type |
|------|-------------|
| GLOBAL-FAP | Fine Art Print |
| GLOBAL-PHO | Photo Print |
| GLOBAL-CNV | Canvas |
| GLOBAL-FRM | Framed Print |
| GLOBAL-ACR | Acrylic |
| GLOBAL-MTL | Metal Print |

### Size Codes

| Code | Dimensions |
|------|-----------|
| 8X10 | 8×10 inches |
| 11X14 | 11×14 inches |
| 16X20 | 16×20 inches |
| 18X24 | 18×24 inches |
| 24X36 | 24×36 inches |

### Attributes

Specified in the attributes object:

\`\`\`json
{
  "attributes": {
    "finish": "matte",
    "frameColor": "black",
    "mountType": "standard"
  }
}
\`\`\`

## Order Flow

\`\`\`
1. Create Quote (optional)
   POST /quotes
   
2. Create Order
   POST /orders
   
3. Order Status Updates
   GET /orders/{id}
   Webhook notifications
   
4. Shipment Tracking
   GET /orders/{id}/shipments
\`\`\`

## Shipping Destinations

Prodigi ships to 180+ countries with routing to nearest production facility:

| Region | Facilities |
|--------|-----------|
| North America | USA, Canada |
| Europe | UK, Germany, Netherlands |
| Asia Pacific | Australia, Japan |

## Print Specifications

### File Requirements

| Spec | Requirement |
|------|-------------|
| Format | JPEG, PNG, TIFF, PDF |
| Color Space | sRGB or CMYK |
| Resolution | 300 DPI minimum |
| File Size | Up to 100MB |

### Bleed & Safety

- **Bleed:** 3mm on all sides
- **Safety Zone:** 10mm from trim
- **Trim Size:** Final print size

## Integration Best Practices

1. **Use Sandbox First** - Test all orders in sandbox environment
2. **Handle Webhooks** - Set up webhook endpoint for status updates
3. **Cache Product Data** - Cache SKU and pricing data locally
4. **Queue Orders** - Use background jobs for order submission
5. **Monitor Failures** - Set up alerting for failed orders
`,

  "product-importing": `# Product Importing - Shopify/Syncio

Bi-directional product flow documentation covering Syncio sync, partner product mapping, artwork creation, and sales reporting workflows.

## Overview

Atlas uses Syncio to synchronize products between partner Shopify stores and the Atlas master store. This enables:

- Automatic product import from partners
- Inventory sync across stores
- Order routing to partners
- Centralized product management

## Data Flow Architecture

\`\`\`
Partner Shopify Store
        │
        ├── Syncio Push
        ↓
Atlas Master Store
        │
        ├── Import Queue
        ↓
Partner Products Table
        │
        ├── Manual Mapping
        ↓
Atlas Artworks + Products
        │
        ├── SKU Crosswalk
        ↓
Sales & Reporting
\`\`\`

## Import Process

### Step 1: Syncio Sync

Products automatically sync from partner stores:

- Title, description, images
- Variants and pricing
- Inventory levels
- SKU data

### Step 2: Import Queue

Synced products appear in Import Queue with status:

| Status | Description |
|--------|-------------|
| **Pending** | Awaiting review |
| **Mapped** | Linked to artwork |
| **Rejected** | Not suitable for Atlas |

### Step 3: Product Mapping

Admin reviews and maps products:

1. Identify or create artwork record
2. Link partner product to artwork
3. Map variant SKUs
4. Set Atlas pricing

### Step 4: SKU Crosswalk

Create mappings between SKUs:

| Partner SKU | Atlas SKU |
|-------------|-----------|
| ABC-PRINT-SM | 10A001-POS-11-MT-NF |
| ABC-PRINT-MD | 10A001-POS-16-MT-NF |
| ABC-PRINT-LG | 10A001-POS-24-MT-NF |

## Partner Products Table

Stores imported product data:

| Column | Description |
|--------|-------------|
| partner_id | Source partner |
| original_title | Original product name |
| original_sku | Partner's SKU |
| artwork_id | Linked Atlas artwork |
| import_status | pending, mapped, rejected |

## Reporting Workflows

### Sales by Partner

Track which partner products sold:

1. Order contains Atlas SKU
2. Lookup SKU Crosswalk
3. Identify partner product
4. Attribute sale to partner

### Revenue Calculation

\`\`\`
Partner Revenue = Sale Price × Partner Percentage
Atlas Commission = Sale Price × Atlas Percentage
Production Cost = Prodigi price
Net Margin = Sale Price - Partner Revenue - Production Cost
\`\`\`

## Best Practices

1. **Review imports promptly** - Don't let queue grow too large
2. **Maintain SKU mappings** - Update when partners change SKUs
3. **Document rejections** - Note why products were rejected
4. **Monitor sync errors** - Check Syncio logs regularly
5. **Verify inventory** - Ensure levels are accurate
`,

  "readymades-framing": `# Readymades.co Framing Discovery

Comprehensive framing catalog documentation including frame collections, mount options, glaze types, SKU structure, and price band system.

## Overview

Readymades.co provides custom framing services with a standardized system of frames, mounts, and glazing options.

## Frame Collections

### Classic Collection

Traditional profiles for timeless appeal:

| Frame | Width | Material |
|-------|-------|----------|
| Oxford | 20mm | Wood |
| Cambridge | 25mm | Wood |
| Windsor | 30mm | Wood |
| Hampton | 35mm | Wood |

### Modern Collection

Clean lines for contemporary spaces:

| Frame | Width | Material |
|-------|-------|----------|
| Metro | 15mm | Aluminum |
| Edge | 18mm | Aluminum |
| Gallery | 22mm | Wood |
| Studio | 25mm | Wood |

### Premium Collection

Luxury options for special pieces:

| Frame | Width | Material |
|-------|-------|----------|
| Heritage | 40mm | Hand-finished |
| Estate | 50mm | Hand-finished |
| Artisan | 45mm | Reclaimed |

## Frame Colors

| Code | Color |
|------|-------|
| BK | Black |
| WH | White |
| NT | Natural Oak |
| WN | Walnut |
| GD | Gold |
| SL | Silver |
| BZ | Bronze |

## Mount Options

### Standard Mounts

| Type | Description |
|------|-------------|
| None | No mount, image to edge |
| Single | One mount layer |
| Double | Two mount layers |
| Float | Artwork floats on mount |

### Mount Colors

| Code | Color |
|------|-------|
| WHT | White |
| CRM | Cream |
| BLK | Black |
| GRY | Grey |

### Mount Widths

| Code | Width |
|------|-------|
| SM | 30mm |
| MD | 50mm |
| LG | 70mm |
| XL | 100mm |

## Glazing Options

| Type | Code | Features |
|------|------|----------|
| Standard | STD | Basic protection |
| Anti-Reflective | AR | Reduced glare |
| UV Protective | UV | Blocks harmful rays |
| Museum | MUS | AR + UV combined |
| Acrylic | ACR | Lightweight, shatterproof |

## SKU Structure

\`\`\`
{FRAME}-{COLOR}-{MOUNT}-{GLAZE}-{SIZE}
\`\`\`

### Example SKUs

| SKU | Description |
|-----|-------------|
| OXFORD-BK-SGL-WHT-AR-16X20 | Oxford Black, Single White Mount, AR Glaze, 16×20 |
| METRO-SL-NONE-UV-24X36 | Metro Silver, No Mount, UV Glaze, 24×36 |
| GALLERY-NT-DBL-CRM-MUS-18X24 | Gallery Natural, Double Cream Mount, Museum Glaze, 18×24 |

## Price Bands

Pricing is based on frame + size combination:

### Band A (Budget)

- Metro, Edge in small sizes
- No mount options
- Standard glaze

### Band B (Standard)

- Classic collection
- Single mount
- AR glaze option

### Band C (Premium)

- Premium collection
- Double mount
- Museum glaze
- Float mount

### Size Multipliers

| Size Range | Multiplier |
|------------|------------|
| Up to 12×16 | 1.0× |
| 16×20 - 20×24 | 1.3× |
| 24×30 - 30×40 | 1.6× |
| Over 30×40 | 2.0× |

## Integration Notes

When ordering frames:

1. Validate SKU components exist
2. Check size is available for frame
3. Apply price band + multiplier
4. Add production time (5-7 days)
5. Include shipping weight
`
};

// Map from article ID to category key
export const articleCategoryMap: Record<string, string> = {
  "sku-methodology": "systems-methodology",
  "partner-management": "workflows-processes",
  "brand-assets": "brand-design",
  "task-management": "workflows-processes",
  "artwork-catalog": "technical-documentation",
  "admin-brand-guide": "brand-design",
  "brand-story": "brand-design",
  "prodigi-api": "technical-documentation",
  "product-importing": "workflows-processes",
  "readymades-framing": "technical-documentation",
};

// Map icon names to actual icon strings
export const articleIconMap: Record<string, string> = {
  "sku-methodology": "Hash",
  "partner-management": "Building2",
  "brand-assets": "Palette",
  "task-management": "CheckSquare",
  "artwork-catalog": "Image",
  "admin-brand-guide": "Palette",
  "brand-story": "BookOpen",
  "prodigi-api": "Globe",
  "product-importing": "ArrowRightLeft",
  "readymades-framing": "Frame",
};
