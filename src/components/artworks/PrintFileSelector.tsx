import { useState } from 'react';
import { usePrintFileSuggestions } from '@/hooks/usePrintFileSuggestions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FileImage, Star, CheckCircle2, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrintFileSelectorProps {
  artworkId: string;
  variantCodes: string[];
  selectedFileId?: string | null;
  onSelect: (fileId: string) => void;
  triggerButton?: React.ReactNode;
}

export const PrintFileSelector = ({
  artworkId,
  variantCodes,
  selectedFileId,
  onSelect,
  triggerButton,
}: PrintFileSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { data: suggestions, isLoading } = usePrintFileSuggestions(
    artworkId,
    variantCodes
  );

  const handleSelect = (fileId: string) => {
    onSelect(fileId);
    setOpen(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getTagBadges = (tags: any) => {
    if (!tags) return null;
    
    const allTags = [
      ...Object.entries(tags.structured || {}).flatMap(([category, values]) =>
        (values as string[]).map((v) => ({ type: 'structured', category, value: v }))
      ),
      ...(tags.custom || []).map((v: string) => ({ type: 'custom', value: v })),
    ];

    return allTags.slice(0, 3).map((tag, idx) => (
      <Badge key={idx} variant="outline" className="text-xs">
        {tag.type === 'structured' ? `${tag.category}: ${tag.value}` : tag.value}
      </Badge>
    ));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline">
            <FileImage className="h-4 w-4 mr-2" />
            Select Print File
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Print File</DialogTitle>
          <DialogDescription>
            Choose the print file for this product variant. Files are ranked by
            relevance based on tags and variant codes.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              Loading suggestions...
            </div>
          ) : suggestions && suggestions.length > 0 ? (
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.file_id}
                  className={cn(
                    'border rounded-lg p-4 cursor-pointer transition-colors hover:bg-accent/50',
                    selectedFileId === suggestion.file_id &&
                      'border-primary bg-primary/5'
                  )}
                  onClick={() => handleSelect(suggestion.file_id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-16 h-16 rounded bg-muted flex items-center justify-center">
                      <FileImage className="h-8 w-8 text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm truncate">
                            {suggestion.file_name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {suggestion.match_score > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                Match Score: {suggestion.match_score}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {selectedFileId === suggestion.file_id && (
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                        )}
                      </div>

                      {/* Match Reasons */}
                      {suggestion.match_reasons &&
                        suggestion.match_reasons.length > 0 && (
                          <div className="space-y-1">
                            {suggestion.match_reasons.map((reason, idx) => (
                              <p
                                key={idx}
                                className="text-xs text-muted-foreground flex items-center gap-1"
                              >
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                                {reason}
                              </p>
                            ))}
                          </div>
                        )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {getTagBadges(suggestion.tags)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileImage className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                No print files found for this artwork
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload print files to the artwork first
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
