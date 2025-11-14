import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useVariantHierarchy } from "@/hooks/useVariantHierarchy";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const variantSchema = z.object({
  variant_name: z.string().optional(),
  var1: z.string().regex(/^\d{2}$/, "Must be 2 digits").refine(
    (val) => parseInt(val) >= 0 && parseInt(val) <= 98,
    "Must be between 00-98 (99 reserved for N/A)"
  ).optional(),
  var2: z.string().regex(/^\d{2}$/, "Must be 2 digits").refine(
    (val) => parseInt(val) >= 0 && parseInt(val) <= 98,
    "Must be between 00-98"
  ).optional(),
  var3: z.string().regex(/^\d{2}$/, "Must be 2 digits").refine(
    (val) => parseInt(val) >= 0 && parseInt(val) <= 98,
    "Must be between 00-98"
  ).optional(),
  retail_price: z.string().optional(),
  wholesale_price: z.string().optional(),
  cost_price: z.string().optional(),
  inventory_qty: z.string().optional(),
});

type VariantFormData = z.infer<typeof variantSchema>;

interface VariantBuilderProps {
  artworkId: string;
  productId: string;
  productTypeId: string;
  ascCode: string;
  typeCode: string;
  onSuccess?: () => void;
}

/**
 * Component to create product variants using the new VAR1/VAR2/VAR3 structure
 * Automatically builds full SKU using build_full_sku() database function
 */
export function VariantBuilder({
  artworkId,
  productId,
  productTypeId,
  ascCode,
  typeCode,
  onSuccess,
}: VariantBuilderProps) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const { variantGroups, getCodesForGroup, getVariantMapping } = useVariantHierarchy(productTypeId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VariantFormData>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      var1: '99',
      var2: '99',
      var3: '99',
    },
  });

  const mapping = getVariantMapping();
  const var1Value = watch('var1');
  const var2Value = watch('var2');
  const var3Value = watch('var3');

  // Build preview SKU
  const previewSKU = `${ascCode}-${typeCode}-${var1Value || '99'}-${var2Value || '99'}-${var3Value || '99'}`;

  const createVariant = useMutation({
    mutationFn: async (data: VariantFormData) => {
      // Build variant codes
      const var1 = data.var1 || '99';
      const var2 = data.var2 || '99';
      const var3 = data.var3 || '99';
      const variantCode = `${var1}-${var2}-${var3}`;
      
      // Build full SKU manually: {ASC}-{TYPE}-{VAR1}-{VAR2}-{VAR3}
      const fullSku = `${ascCode}-${typeCode}-${var1}-${var2}-${var3}`;

      // Create variant
      const { data: variant, error: variantError } = await supabase
        .from('product_variants')
        .insert({
          product_id: productId,
          full_sku: fullSku,
          variant_code: variantCode,
          variant_name: data.variant_name || null,
          retail_price: data.retail_price ? parseFloat(data.retail_price) : null,
          wholesale_price: data.wholesale_price ? parseFloat(data.wholesale_price) : null,
          cost_price: data.cost_price ? parseFloat(data.cost_price) : null,
          inventory_qty: data.inventory_qty ? parseInt(data.inventory_qty) : 0,
          is_active: true,
        })
        .select()
        .single();

      if (variantError) throw variantError;
      return variant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-variants', productId] });
      toast.success('Variant created successfully');
      reset();
      setShowForm(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error('Failed to create variant: ' + error.message);
    },
  });

  const onSubmit = (data: VariantFormData) => {
    createVariant.mutate(data);
  };

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Variant
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Variant</CardTitle>
        <CardDescription>
          Define variant codes for each dimension. Use 99 for N/A dimensions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* VAR1 */}
          {mapping.var1 && (
            <div className="space-y-2">
              <Label htmlFor="var1">
                VAR1: {mapping.var1.group_name}
                {mapping.var1.is_required && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Select
                value={var1Value}
                onValueChange={(value) => setValue('var1', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${mapping.var1.group_name}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="99">N/A (99)</SelectItem>
                  {getCodesForGroup(mapping.var1.id).map((code) => (
                    <SelectItem key={code.id} value={code.code}>
                      {code.code} - {code.display_value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.var1 && (
                <p className="text-sm text-destructive">{errors.var1.message}</p>
              )}
            </div>
          )}

          {/* VAR2 */}
          {mapping.var2 && (
            <div className="space-y-2">
              <Label htmlFor="var2">
                VAR2: {mapping.var2.group_name}
                {mapping.var2.is_required && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Select
                value={var2Value}
                onValueChange={(value) => setValue('var2', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${mapping.var2.group_name}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="99">N/A (99)</SelectItem>
                  {getCodesForGroup(mapping.var2.id).map((code) => (
                    <SelectItem key={code.id} value={code.code}>
                      {code.code} - {code.display_value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.var2 && (
                <p className="text-sm text-destructive">{errors.var2.message}</p>
              )}
            </div>
          )}

          {/* VAR3 */}
          {mapping.var3 && (
            <div className="space-y-2">
              <Label htmlFor="var3">
                VAR3: {mapping.var3.group_name}
                {mapping.var3.is_required && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Select
                value={var3Value}
                onValueChange={(value) => setValue('var3', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${mapping.var3.group_name}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="99">N/A (99)</SelectItem>
                  {getCodesForGroup(mapping.var3.id).map((code) => (
                    <SelectItem key={code.id} value={code.code}>
                      {code.code} - {code.display_value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.var3 && (
                <p className="text-sm text-destructive">{errors.var3.message}</p>
              )}
            </div>
          )}

          {/* SKU Preview */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Generated SKU:</p>
            <p className="font-mono text-sm font-semibold">{previewSKU}</p>
          </div>

          {/* Optional Fields */}
          <div className="space-y-2">
            <Label htmlFor="variant_name">Variant Name (Optional)</Label>
            <Input
              id="variant_name"
              placeholder="e.g., Black Medium"
              {...register('variant_name')}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="retail_price">Retail Price</Label>
              <Input
                id="retail_price"
                type="number"
                step="0.01"
                placeholder="29.99"
                {...register('retail_price')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wholesale_price">Wholesale</Label>
              <Input
                id="wholesale_price"
                type="number"
                step="0.01"
                placeholder="19.99"
                {...register('wholesale_price')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost_price">Cost</Label>
              <Input
                id="cost_price"
                type="number"
                step="0.01"
                placeholder="9.99"
                {...register('cost_price')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inventory_qty">Initial Inventory</Label>
            <Input
              id="inventory_qty"
              type="number"
              placeholder="0"
              {...register('inventory_qty')}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={createVariant.isPending}
              className="flex-1"
            >
              {createVariant.isPending ? 'Creating...' : 'Create Variant'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                reset();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
