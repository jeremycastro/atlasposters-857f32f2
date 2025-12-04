import { useNavigate } from "react-router-dom";
import { ChevronDown, History, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useStaticArticleVersions, StaticArticleVersion } from "@/hooks/useStaticArticleVersions";
import { format } from "date-fns";

interface StaticArticleVersionDropdownProps {
  slug: string;
  currentVersion: number | null; // null means viewing latest/current
}

export function StaticArticleVersionDropdown({
  slug,
  currentVersion,
}: StaticArticleVersionDropdownProps) {
  const navigate = useNavigate();
  const { data: versions = [], isLoading } = useStaticArticleVersions(slug);

  if (isLoading || versions.length <= 1) {
    return null; // Don't show if only one version exists
  }

  const currentVersionData = versions.find((v) => v.is_current);
  const isViewingCurrent = currentVersion === null || currentVersion === currentVersionData?.version_number;

  const handleVersionSelect = (version: StaticArticleVersion) => {
    if (version.is_current) {
      // Navigate to current (no version suffix)
      navigate(`/admin/knowledge/article/${slug}`);
    } else {
      // Navigate to archived version
      navigate(`/admin/knowledge/article/${slug}-v${version.version_number}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <History className="h-4 w-4" />
          {isViewingCurrent ? (
            <>
              Current Version
              <Badge variant="secondary" className="ml-1 text-xs">
                v{currentVersionData?.version_number || 1}
              </Badge>
            </>
          ) : (
            <>
              Version {currentVersion}
              <Badge variant="outline" className="ml-1 text-xs">
                Archived
              </Badge>
            </>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Version History
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {versions.map((version) => {
          const isSelected = version.is_current
            ? isViewingCurrent
            : currentVersion === version.version_number;

          return (
            <DropdownMenuItem
              key={version.id}
              onClick={() => handleVersionSelect(version)}
              className="flex items-start gap-2 cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                  <span className="font-medium">
                    Version {version.version_number}
                  </span>
                  {version.is_current && (
                    <Badge variant="default" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {format(new Date(version.archived_at), "MMM d, yyyy")}
                </div>
                {version.change_summary && (
                  <div className="text-xs text-muted-foreground mt-1 truncate">
                    {version.change_summary}
                  </div>
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
