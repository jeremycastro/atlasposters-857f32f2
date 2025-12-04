import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface ArchivedVersionBannerProps {
  slug: string;
  versionNumber: number;
  archivedAt: string;
  changeSummary?: string | null;
}

export function ArchivedVersionBanner({
  slug,
  versionNumber,
  archivedAt,
  changeSummary,
}: ArchivedVersionBannerProps) {
  return (
    <Alert variant="default" className="mb-6 border-amber-500/50 bg-amber-500/10">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-700 dark:text-amber-400">
        Archived Version (v{versionNumber})
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-muted-foreground">
          You're viewing an archived version from{" "}
          <span className="font-medium">
            {format(new Date(archivedAt), "MMMM d, yyyy")}
          </span>
          .
          {changeSummary && (
            <span className="block mt-1 text-sm italic">
              "{changeSummary}"
            </span>
          )}
        </p>
        <Button asChild variant="outline" size="sm" className="mt-3 gap-2">
          <Link to={`/admin/knowledge/article/${slug}`}>
            View Current Version
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
