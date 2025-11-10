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
    version: "0.001",
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
          <Link to="/roadmap">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Roadmap
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
            Version numbers will eventually align with Atlas Catalog application releases.
            Each increment represents significant progress toward our goals.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Changelog;
