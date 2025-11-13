import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UnifiedTagSelector } from "@/components/tags/UnifiedTagSelector";
import { AITagSuggestions } from "@/components/tags/AITagSuggestions";

interface ArtworkTagsTabProps {
  artworkId: string;
}

export function ArtworkTagsTab({ artworkId }: ArtworkTagsTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tag Management</CardTitle>
        </CardHeader>
        <CardContent>
          <UnifiedTagSelector
            entityType="artwork"
            entityId={artworkId}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Tag Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <AITagSuggestions
            entityType="artwork"
            entityId={artworkId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
