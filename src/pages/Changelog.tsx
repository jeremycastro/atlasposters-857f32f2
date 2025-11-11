import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, GitBranch } from "lucide-react";

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
    version: "1.0.0",
    date: "2025-12-01",
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
    date: "2025-01-11",
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
    date: "2025-01-10",
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
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          
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
            Following semantic versioning: Major.Minor.Patch (v1.0.0). 
            Each version represents milestones in the Atlas Platform journey to MVP launch.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Changelog;
