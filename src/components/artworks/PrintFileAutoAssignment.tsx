import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { FileImage, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface PrintFileSuggestion {
  file_id: string;
  file_name: string;
  tags: any;
  match_score: number;
  match_reasons: string[];
}

interface PrintFileAutoAssignmentProps {
  artworkId: string;
  variantCodes: string[]; // Full SKUs of variants to match
  ascCode?: string; // Artwork's ASC code for dynamic examples
  productTypeCode?: string; // First product's type code for examples
}

/**
 * Component for reviewing and approving print file auto-assignment suggestions
 * Uses hierarchical SKU matching to suggest which print files should be assigned to which variants
 */
export function PrintFileAutoAssignment({ 
  artworkId, 
  variantCodes, 
  ascCode = '11K001', 
  productTypeCode = 'UTS' 
}: PrintFileAutoAssignmentProps) {
  const queryClient = useQueryClient();
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());

  // Generate dynamic examples based on actual artwork data
  const exampleProductLevel = `${ascCode}-${productTypeCode}_print.png`;
  const exampleVar1 = `${ascCode}-${productTypeCode}-01_print.png`;
  const exampleVar2 = `${ascCode}-${productTypeCode}-01-02_print.png`;
  const exampleVar3 = `${ascCode}-${productTypeCode}-01-02-03_print.png`;

  // Fetch print file suggestions using the database function
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['print-file-suggestions', artworkId, variantCodes],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_print_file_suggestions', {
        p_artwork_id: artworkId,
        p_variant_codes: variantCodes,
      });

      if (error) throw error;
      return data as PrintFileSuggestion[];
    },
    enabled: variantCodes.length > 0,
  });

  // Apply selected suggestions
  const applyAssignments = useMutation({
    mutationFn: async (fileIds: string[]) => {
      // Get file details
      const { data: files, error: filesError } = await supabase
        .from('artwork_files')
        .select('id, file_name')
        .in('id', fileIds);

      if (filesError) throw filesError;

      // For each file, parse filename and assign to matching variants
      const assignments: { variant_id: string; print_file_id: string }[] = [];

      for (const file of files) {
        // Parse SKU from filename using regex (database function parse_sku_from_filename)
        // Pattern: {ASC}-{TYPE}(-{VAR1})?(-{VAR2})?(-{VAR3})?_print
        const skuPattern = /([0-9]{2}[A-Z][0-9]{3})-([A-Z]{3})(?:-([0-9]{2}))?(?:-([0-9]{2}))?(?:-([0-9]{2}))?[_\.]/;
        const matches = file.file_name.match(skuPattern);

        if (!matches) continue;

        const asc_code = matches[1];
        const product_type_code = matches[2];
        const var1 = matches[3] || null;
        const var2 = matches[4] || null;
        const var3 = matches[5] || null;

        // Determine match level and build pattern
        let pattern: string;
        let match_level: string;
        
        if (var1 && var2 && var3) {
          // Exact 3D match
          pattern = `${asc_code}-${product_type_code}-${var1}-${var2}-${var3}`;
          match_level = 'exact_3d';
        } else if (var1 && var2) {
          // Exact 2D match (all VAR3 variants)
          pattern = `${asc_code}-${product_type_code}-${var1}-${var2}-%`;
          match_level = 'exact_2d';
        } else if (var1) {
          // Hierarchical VAR1 match
          pattern = `${asc_code}-${product_type_code}-${var1}-%`;
          match_level = 'hierarchical_var1';
        } else {
          // Product-level match
          pattern = `${asc_code}-${product_type_code}-%`;
          match_level = 'product_level';
        }

        // Find matching variants
        const query = supabase
          .from('product_variants')
          .select('id')
          .like('full_sku', pattern);

        const { data: matchingVariants, error: variantsError } = await query;

        if (variantsError) throw variantsError;

        matchingVariants?.forEach(variant => {
          assignments.push({
            variant_id: variant.id,
            print_file_id: file.id,
          });
        });
      }

      // Apply assignments
      const updatePromises = assignments.map(({ variant_id, print_file_id }) =>
        supabase
          .from('product_variants')
          .update({ print_file_id })
          .eq('id', variant_id)
      );

      const results = await Promise.all(updatePromises);
      const errors = results.filter(r => r.error);
      if (errors.length > 0) throw errors[0].error;

      return { assignedCount: assignments.length };
    },
    onSuccess: ({ assignedCount }) => {
      queryClient.invalidateQueries({ queryKey: ['product-variants'] });
      queryClient.invalidateQueries({ queryKey: ['print-file-suggestions'] });
      toast.success(`Successfully assigned print files to ${assignedCount} variants`);
      setSelectedSuggestions(new Set());
    },
    onError: (error) => {
      toast.error('Failed to apply assignments: ' + error.message);
    },
  });

  const toggleSelection = (fileId: string) => {
    const newSelection = new Set(selectedSuggestions);
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
    } else {
      newSelection.add(fileId);
    }
    setSelectedSuggestions(newSelection);
  };

  const selectAll = () => {
    if (!suggestions) return;
    setSelectedSuggestions(new Set(suggestions.map(s => s.file_id)));
  };

  const clearSelection = () => {
    setSelectedSuggestions(new Set());
  };

  const getConfidenceBadge = (score: number) => {
    if (score >= 100) return <Badge className="bg-green-600">Exact Match</Badge>;
    if (score >= 90) return <Badge className="bg-blue-600">Hierarchical</Badge>;
    if (score >= 70) return <Badge className="bg-purple-600">Product-Level</Badge>;
    return <Badge variant="outline">Low Confidence</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileImage className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Print File Auto-Assignment</CardTitle>
          </div>
          <CardDescription>
            No matching print files found for the selected variants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm mb-3">
              Upload print files with SKU patterns in filenames to enable auto-assignment.
            </p>
            <div className="space-y-2 text-xs">
              <div className="text-left bg-muted/50 p-3 rounded-lg max-w-md mx-auto">
                <p className="font-semibold mb-2">Example filenames:</p>
                <div className="space-y-1 font-mono">
                  <div><code className="bg-background px-2 py-1 rounded">{exampleProductLevel}</code> <span className="text-muted-foreground">→ All variants</span></div>
                  <div><code className="bg-background px-2 py-1 rounded">{exampleVar1}</code> <span className="text-muted-foreground">→ VAR1 family</span></div>
                  <div><code className="bg-background px-2 py-1 rounded">{exampleVar2}</code> <span className="text-muted-foreground">→ 2D group</span></div>
                  <div><code className="bg-background px-2 py-1 rounded">{exampleVar3}</code> <span className="text-muted-foreground">→ Exact variant</span></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileImage className="h-5 w-5 text-primary" />
          <CardTitle>Print File Auto-Assignment</CardTitle>
        </div>
        <CardDescription>
          Review and approve suggested print file assignments based on hierarchical SKU matching.
          Files are matched from filenames like <code className="text-xs bg-muted px-2 py-1 rounded">{exampleVar1}</code>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAll}
              disabled={selectedSuggestions.size === suggestions.length}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearSelection}
              disabled={selectedSuggestions.size === 0}
            >
              Clear Selection
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {selectedSuggestions.size} of {suggestions.length} selected
          </div>
        </div>

        {/* Suggestions List */}
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.file_id}
                className={`p-4 border rounded-lg transition-colors ${
                  selectedSuggestions.has(suggestion.file_id)
                    ? 'bg-primary/5 border-primary/50'
                    : 'bg-muted/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <Checkbox
                    checked={selectedSuggestions.has(suggestion.file_id)}
                    onCheckedChange={() => toggleSelection(suggestion.file_id)}
                  />

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-sm truncate">{suggestion.file_name}</p>
                      {getConfidenceBadge(suggestion.match_score)}
                      <Badge variant="outline" className="text-xs font-mono">
                        Score: {suggestion.match_score}
                      </Badge>
                    </div>

                    {/* Match Reasons */}
                    <div className="space-y-1">
                      {suggestion.match_reasons.map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="h-3 w-3 shrink-0 mt-0.5 text-green-600" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Apply Button */}
        <div className="mt-6 pt-4 border-t">
          <Button
            onClick={() => applyAssignments.mutate(Array.from(selectedSuggestions))}
            disabled={selectedSuggestions.size === 0 || applyAssignments.isPending}
            className="w-full"
          >
            {applyAssignments.isPending ? (
              <>Applying Assignments...</>
            ) : (
              <>Apply {selectedSuggestions.size} Assignment{selectedSuggestions.size !== 1 ? 's' : ''}</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
