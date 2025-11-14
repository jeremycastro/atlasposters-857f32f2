import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VariantBuilder } from "@/components/artworks/VariantBuilder";
import { VariantHierarchyConfig } from "@/components/artworks/VariantHierarchyConfig";
import { PrintFileAutoAssignment } from "@/components/artworks/PrintFileAutoAssignment";
import { Package, Settings } from "lucide-react";
import { useState } from "react";

interface ArtworkProductsTabProps {
  artworkId: string;
  ascCode: string;
}

export function ArtworkProductsTab({ artworkId, ascCode }: ArtworkProductsTabProps) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Fetch products for this artwork
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', artworkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_type:product_types(
            id,
            type_name,
            type_code
          )
        `)
        .eq('artwork_id', artworkId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch variants for selected product
  const { data: variants, isLoading: isLoadingVariants } = useQuery({
    queryKey: ['product-variants', selectedProductId],
    queryFn: async () => {
      if (!selectedProductId) return [];

      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', selectedProductId)
        .order('full_sku', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedProductId,
  });

  const selectedProduct = products?.find(p => p.id === selectedProductId);
  const variantCodes = variants?.map(v => v.full_sku) || [];

  if (isLoadingProducts) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No products created yet for this artwork.</p>
            <p className="text-sm mt-2">Create a product first to add variants.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Product Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((product) => (
              <Button
                key={product.id}
                variant={selectedProductId === product.id ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-start gap-2"
                onClick={() => setSelectedProductId(product.id)}
              >
                <div className="flex items-center gap-2 w-full">
                  <Package className="h-4 w-4" />
                  <span className="font-semibold truncate">
                    {product.product_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.product_type?.type_code}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {product.product_type?.type_name}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Details */}
      {selectedProduct && (
        <Tabs defaultValue="variants">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="print-files">Print File Assignment</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="variants" className="space-y-4 mt-6">
            {/* Variant List */}
            {isLoadingVariants ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : variants && variants.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Existing Variants ({variants.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-mono text-sm font-semibold">
                            {variant.full_sku}
                          </p>
                          {variant.variant_name && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {variant.variant_name}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {variant.retail_price && (
                            <span className="text-sm font-medium">
                              ${variant.retail_price}
                            </span>
                          )}
                          <Badge variant={variant.is_active ? 'default' : 'outline'}>
                            {variant.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-6">
                  <p className="text-center text-muted-foreground">
                    No variants created yet. Add your first variant below.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Variant Builder */}
            <VariantBuilder
              artworkId={artworkId}
              productId={selectedProduct.id}
              productTypeId={selectedProduct.product_type_id}
              ascCode={ascCode}
              typeCode={selectedProduct.product_type?.type_code || ''}
            />
          </TabsContent>

          <TabsContent value="print-files" className="mt-6">
            <PrintFileAutoAssignment
              artworkId={artworkId}
              variantCodes={variantCodes}
              ascCode={ascCode}
              productTypeCode={selectedProduct.product_type?.type_code || 'UTS'}
            />
          </TabsContent>

          <TabsContent value="config" className="mt-6">
            <VariantHierarchyConfig productTypeId={selectedProduct.product_type_id} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
