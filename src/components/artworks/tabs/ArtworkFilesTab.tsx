import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArtworkFileUpload } from "@/components/artworks/ArtworkFileUpload";

interface ArtworkFilesTabProps {
  artworkId: string;
}

export function ArtworkFilesTab({ artworkId }: ArtworkFilesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Artwork Files</CardTitle>
      </CardHeader>
      <CardContent>
        <ArtworkFileUpload artworkId={artworkId} />
      </CardContent>
    </Card>
  );
}
