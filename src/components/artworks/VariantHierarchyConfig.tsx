import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVariantHierarchy } from "@/hooks/useVariantHierarchy";
import { ArrowUp, ArrowDown, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface VariantHierarchyConfigProps {
  productTypeId: string;
}

/**
 * Component to configure which variant dimension (Color, Size, Finish) maps to VAR1, VAR2, VAR3
 * Based on sort_order: 0=VAR1, 1=VAR2, 2=VAR3
 */
export function VariantHierarchyConfig({ productTypeId }: VariantHierarchyConfigProps) {
  const { variantGroups, isLoading, updateHierarchy, getVariantMapping } = useVariantHierarchy(productTypeId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!variantGroups || variantGroups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Variant Hierarchy</CardTitle>
          <CardDescription>
            No variant groups configured for this product type.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const mapping = getVariantMapping();
  const sorted = [...variantGroups].sort((a, b) => a.sort_order - b.sort_order);

  const moveUp = (index: number) => {
    if (index === 0) return;
    
    const updates = [
      { id: sorted[index].id, sort_order: sorted[index - 1].sort_order },
      { id: sorted[index - 1].id, sort_order: sorted[index].sort_order },
    ];
    
    updateHierarchy.mutate(updates);
  };

  const moveDown = (index: number) => {
    if (index === sorted.length - 1) return;
    
    const updates = [
      { id: sorted[index].id, sort_order: sorted[index + 1].sort_order },
      { id: sorted[index + 1].id, sort_order: sorted[index].sort_order },
    ];
    
    updateHierarchy.mutate(updates);
  };

  const getVarLabel = (sortOrder: number): string => {
    if (sortOrder === 0) return 'VAR1';
    if (sortOrder === 1) return 'VAR2';
    if (sortOrder === 2) return 'VAR3';
    return `VAR${sortOrder + 1}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <CardTitle>Variant Hierarchy Configuration</CardTitle>
        </div>
        <CardDescription>
          Define which variant dimension maps to VAR1, VAR2, and VAR3 in SKU structure.
          Drag to reorder. First = VAR1, Second = VAR2, Third = VAR3.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sorted.map((group, index) => (
            <div
              key={group.id}
              className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30"
            >
              {/* Reorder Buttons */}
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveUp(index)}
                  disabled={index === 0 || updateHierarchy.isPending}
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveDown(index)}
                  disabled={index === sorted.length - 1 || updateHierarchy.isPending}
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>

              {/* VAR Badge */}
              <Badge className="shrink-0 font-mono text-xs">
                {getVarLabel(group.sort_order)}
              </Badge>

              {/* Group Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold">{group.group_name}</p>
                  {group.is_required && (
                    <Badge variant="outline" className="text-xs">Required</Badge>
                  )}
                </div>
                {group.description && (
                  <p className="text-xs text-muted-foreground">{group.description}</p>
                )}
              </div>

              {/* Sort Order */}
              <div className="text-xs text-muted-foreground">
                Order: {group.sort_order}
              </div>
            </div>
          ))}
        </div>

        {/* Current Mapping Summary */}
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm font-semibold mb-2">Current SKU Structure:</p>
          <p className="font-mono text-sm">
            {'{ASC}'}-{'{TYPE}'}-
            <span className="text-purple-600 dark:text-purple-400">{'{VAR1: '}{mapping.var1?.group_name || 'N/A'}{'}'}</span>-
            <span className="text-orange-600 dark:text-orange-400">{'{VAR2: '}{mapping.var2?.group_name || 'N/A'}{'}'}</span>-
            <span className="text-pink-600 dark:text-pink-400">{'{VAR3: '}{mapping.var3?.group_name || 'N/A'}{'}'}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Example: 11K001-PST-{mapping.var1 ? '01' : '99'}-{mapping.var2 ? '02' : '99'}-{mapping.var3 ? '03' : '99'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
