import { useState } from 'react';
import { usePrintFileSuggestions } from '@/hooks/usePrintFileSuggestions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FileImage, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductVariant {
  id: string;
  variant_code: string;
  variant_name: string;
  full_sku: string;
  print_file_id?: string | null;
}

interface BulkPrintFileAssignmentProps {
  artworkId: string;
  variants: ProductVariant[];
  onAssign: (variantIds: string[], printFileId: string) => void;
  triggerButton?: React.ReactNode;
}

export const BulkPrintFileAssignment = ({
  artworkId,
  variants,
  onAssign,
  triggerButton,
}: BulkPrintFileAssignmentProps) => {
  const [open, setOpen] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Set<string>>(new Set());
  const [selectedPrintFile, setSelectedPrintFile] = useState<string | null>(null);

  // Get unique variant codes for suggestions
  const variantCodes = variants
    .map((v) => v.variant_code.split('-'))
    .flat()
    .filter((code, index, self) => self.indexOf(code) === index);

  const { data: suggestions } = usePrintFileSuggestions(artworkId, variantCodes);

  const toggleVariant = (variantId: string) => {
    const newSelected = new Set(selectedVariants);
    if (newSelected.has(variantId)) {
      newSelected.delete(variantId);
    } else {
      newSelected.add(variantId);
    }
    setSelectedVariants(newSelected);
  };

  const toggleAll = () => {
    if (selectedVariants.size === variants.length) {
      setSelectedVariants(new Set());
    } else {
      setSelectedVariants(new Set(variants.map((v) => v.id)));
    }
  };

  const handleAssign = () => {
    if (!selectedPrintFile || selectedVariants.size === 0) return;
    
    onAssign(Array.from(selectedVariants), selectedPrintFile);
    setOpen(false);
    setSelectedVariants(new Set());
    setSelectedPrintFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline">
            <CheckSquare className="h-4 w-4 mr-2" />
            Bulk Assign Print Files
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Bulk Assign Print Files</DialogTitle>
          <DialogDescription>
            Select variants and assign a print file to multiple variants at once
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Left: Variant Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">
                Select Variants ({selectedVariants.size}/{variants.length})
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAll}
              >
                {selectedVariants.size === variants.length
                  ? 'Deselect All'
                  : 'Select All'}
              </Button>
            </div>

            <ScrollArea className="h-[400px] border rounded-lg p-2">
              <div className="space-y-2">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                      selectedVariants.has(variant.id)
                        ? 'bg-primary/5 border-primary'
                        : 'hover:bg-accent/50'
                    )}
                    onClick={() => toggleVariant(variant.id)}
                  >
                    <Checkbox
                      checked={selectedVariants.has(variant.id)}
                      onCheckedChange={() => toggleVariant(variant.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {variant.variant_name || variant.full_sku}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {variant.full_sku}
                      </p>
                      {variant.print_file_id && (
                        <Badge variant="outline" className="text-xs mt-1">
                          Has print file
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right: Print File Selection */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Select Print File</h4>

            <ScrollArea className="h-[400px] border rounded-lg p-2">
              {suggestions && suggestions.length > 0 ? (
                <div className="space-y-2">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.file_id}
                      className={cn(
                        'p-3 rounded-lg border cursor-pointer transition-colors',
                        selectedPrintFile === suggestion.file_id
                          ? 'bg-primary/5 border-primary'
                          : 'hover:bg-accent/50'
                      )}
                      onClick={() => setSelectedPrintFile(suggestion.file_id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-12 h-12 rounded bg-muted flex items-center justify-center">
                          <FileImage className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {suggestion.file_name}
                          </p>
                          {suggestion.match_score > 0 && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Score: {suggestion.match_score}
                            </Badge>
                          )}
                          {suggestion.match_reasons && suggestion.match_reasons.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {suggestion.match_reasons.slice(0, 2).map((reason, idx) => (
                                <p
                                  key={idx}
                                  className="text-xs text-muted-foreground"
                                >
                                  • {reason}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  No print files available
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <Separator />

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">
              {selectedVariants.size > 0 && selectedPrintFile
                ? `Assign to ${selectedVariants.size} variant${
                    selectedVariants.size > 1 ? 's' : ''
                  }`
                : 'Select variants and a print file'}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAssign}
                disabled={selectedVariants.size === 0 || !selectedPrintFile}
              >
                Assign Print File
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
