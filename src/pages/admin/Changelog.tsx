import { Badge } from "@/components/ui/badge";
import { GitBranch } from "lucide-react";

interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    type: "added" | "changed" | "fixed" | "removed";
    description: string;
  }[];
}

const changelogData: ChangelogEntry[] = [
  {
    version: "0.4.1",
    date: "2024-11-12",
    changes: [
      {
        type: "added",
        description: "Partner Pricing & Payment Models - Comprehensive partner agreement system with multiple payment models (royalty, commission, flat fee, advance), marketing attribution caps, and flexible payment terms",
      },
      {
        type: "changed",
        description: "Roadmap UI Refinement - Removed progress bars from milestone cards to reduce visual clutter and emphasize minimalist design",
      },
      {
        type: "changed",
        description: "Enhanced Status Badges - Made milestone status badges larger and more prominent with integrated progress information (e.g., 'In Progress • 5/10 tasks')",
      },
      {
        type: "changed",
        description: "Improved Status Indicators - Status icons and color-coded badges now serve as primary visual indicators instead of progress bars",
      },
    ],
  },
  {
    version: "0.4.0",
    date: "2024-11-10",
    changes: [
      {
        type: "added",
        description: "Atlas Artwork Catalog - Complete artwork management system with image upload, metadata tracking, ASC code generation, and full CRUD operations",
      },
      {
        type: "added",
        description: "Partner Management System - Comprehensive partner database with contacts, addresses, and agreements tracking",
      },
      {
        type: "added",
        description: "Enhanced Brand Management - Logos, colors (primary/secondary/accent), taglines, brand stories, and social media links",
      },
      {
        type: "added",
        description: "Bulk Logo Upload - Drag-and-drop interface for uploading multiple brand logos with gallery view and asset management",
      },
      {
        type: "added",
        description: "Brand Assets Storage - Secure 'brand-assets' bucket with RLS policies for partner and admin access (5MB limit, supports JPG/PNG/WEBP/SVG)",
      },
      {
        type: "added",
        description: "Dynamic Brand Pages Foundation - Brand identity system designed for generating dynamic landing pages with logos, colors, and stories",
      },
      {
        type: "added",
        description: "Partner-Brand Artwork Linking - Database relationship structure to link artworks and products to specific partner brands",
      },
      {
        type: "changed",
        description: "Partner Modal UI - Redesigned with tabbed interface (Info/Brands/Agreements/Contacts/Addresses) and fixed-height layout to prevent tab-switching resizing",
      },
      {
        type: "changed",
        description: "Task Modal Tabs - Updated to match Partner modal styling with TabsList and TabsTrigger components for consistent design",
      },
      {
        type: "changed",
        description: "Sticky Action Buttons - Save/Cancel buttons now sticky at bottom of forms, matching Task detail dialog pattern for better UX",
      },
      {
        type: "fixed",
        description: "Modal Focus Issue - Resolved text input focus loss in Partner modal forms by extracting BrandForm as separate component",
      },
      {
        type: "fixed",
        description: "Always-Editable Status - Restored prominent Badge-style status dropdown in Task modal for quick updates without entering edit mode",
      },
      {
        type: "changed",
        description: "Logo Management - Moved logo upload section to bottom of brand forms for better visual hierarchy and workflow",
      },
    ],
  },
  {
    version: "0.3.0",
    date: "2024-11-01",
    changes: [
      {
        type: "added",
        description: "Roadmap Manager with semantic versioning (v1.0.0) and progress tracking",
      },
      {
        type: "added",
        description: "Task Management system with Kanban and Table views",
      },
      {
        type: "added",
        description: "Activity logging with human-readable change descriptions",
      },
      {
        type: "added",
        description: "Role-based access control with admin, editor, partner, viewer, and customer roles",
      },
      {
        type: "added",
        description: "User Management interface for role assignments",
      },
      {
        type: "added",
        description: "Admin Dashboard with statistics and insights",
      },
      {
        type: "added",
        description: "Task filtering, sorting, and search capabilities",
      },
      {
        type: "added",
        description: "Task comments and collaboration features",
      },
      {
        type: "added",
        description: "Milestone tracking with deliverables and success metrics",
      },
      {
        type: "changed",
        description: "Migrated to semantic versioning format (v1.0.0) for better version management",
      },
    ],
  },
  {
    version: "0.2.0",
    date: "2024-10-20",
    changes: [
      {
        type: "added",
        description: "Custom favicon with Atlas branding",
      },
      {
        type: "changed",
        description: "Social media preview metadata - Updated title to 'Atlas Posters' with brand tagline",
      },
      {
        type: "added",
        description: "Custom hero image for social sharing (og-image.webp)",
      },
      {
        type: "added",
        description: "Email signup functionality with form validation",
      },
      {
        type: "added",
        description: "Coming soon page with hero section and brand positioning",
      },
      {
        type: "added",
        description: "'Why Atlas Posters?' features grid showcasing value proposition",
      },
      {
        type: "added",
        description: "Partner CTA section inviting brand collaborations",
      },
      {
        type: "fixed",
        description: "Improved form validation and error handling for better UX",
      },
    ],
  },
  {
    version: "0.1.0",
    date: "2024-10-10",
    changes: [
      {
        type: "added",
        description: "Initial roadmap structure with comprehensive implementation plan",
      },
      {
        type: "added",
        description: "Foundation database architecture for Atlas Catalog",
      },
      {
        type: "added",
        description: "Phase 1: Atlas Catalog admin platform milestones (1.1 - 1.5)",
      },
      {
        type: "added",
        description: "Phase 2: atlasposters.com storefront milestones (2.1 - 2.5)",
      },
      {
        type: "added",
        description: "Phase 3: Integration & launch milestones",
      },
      {
        type: "added",
        description: "Project management structure with weekly rhythm",
      },
      {
        type: "added",
        description: "Decision checkpoints and success criteria",
      },
    ],
  },
];

const Changelog = () => {
  const getTypeBadgeVariant = (type: ChangelogEntry["changes"][0]["type"]) => {
    switch (type) {
      case "added":
        return "default";
      case "changed":
        return "secondary";
      case "fixed":
        return "outline";
      case "removed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <GitBranch className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Changelog</h1>
          </div>
          <p className="text-muted-foreground">
            Track all changes, updates, and improvements to Atlas Catalog
          </p>
        </div>

        {/* Changelog Entries */}
        <div className="space-y-8">
          {changelogData.map((entry) => (
            <div
              key={entry.version}
              className="bg-card border border-border rounded-lg p-6"
            >
              {/* Version Header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <h2 className="text-2xl font-bold text-foreground">
                  v{entry.version}
                </h2>
                <Badge variant="outline">{entry.date}</Badge>
              </div>

              {/* Changes List */}
              <div className="space-y-3">
                {entry.changes.map((change, idx) => (
                  <div key={idx} className="flex gap-3">
                    <Badge
                      variant={getTypeBadgeVariant(change.type)}
                      className="shrink-0 h-6"
                    >
                      {change.type}
                    </Badge>
                    <p className="text-sm text-foreground leading-relaxed">
                      {change.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            Following semantic versioning: Major.Minor.Patch (v0.x.x). 
            Pre-1.0 versions represent feature development toward MVP launch at v1.0.0.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Changelog;
