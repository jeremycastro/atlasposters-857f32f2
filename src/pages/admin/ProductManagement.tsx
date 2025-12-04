import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Layers, Tags, Plus, Upload, Library } from "lucide-react";
import { useProducts, useProductStats, useProductTypes } from "@/hooks/useProducts";
import { ProductTableView } from "@/components/products/ProductTableView";
import { VariantLibraryTab } from "@/components/products/VariantLibraryTab";
import { ProductTypeSheet } from "@/components/products/ProductTypeSheet";
import { useNavigate } from "react-router-dom";

export default function ProductManagement() {
  const navigate = useNavigate();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: stats, isLoading: statsLoading } = useProductStats();
  const { data: productTypes = [], isLoading: typesLoading } = useProductTypes();

  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [isCreateTypeOpen, setIsCreateTypeOpen] = useState(false);

  const selectedType = productTypes.find(t => t.id === selectedTypeId);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Catalog</h1>
          <p className="text-muted-foreground mt-1">
            Manage products, variants, and SKUs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/import-queue')}>
            <Upload className="mr-2 h-4 w-4" />
            Import Queue
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "—" : stats?.totalProducts || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeProducts || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Variants
            </CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "—" : stats?.totalVariants || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeVariants || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Product Types
            </CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "—" : stats?.productTypes || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              configured types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Variants/Product
            </CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading || !stats?.totalProducts 
                ? "—" 
                : (stats.totalVariants / stats.totalProducts).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              variants per product
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="types">Product Types</TabsTrigger>
          <TabsTrigger value="library">
            <Library className="mr-2 h-4 w-4" />
            Variant Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <ProductTableView products={products} isLoading={productsLoading} />
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Product Types</CardTitle>
              <Button size="sm" onClick={() => setIsCreateTypeOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Type
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {typesLoading ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  Loading...
                </div>
              ) : productTypes.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  No product types configured
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Sort Order</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productTypes.map((type) => (
                      <TableRow 
                        key={type.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedTypeId(type.id)}
                      >
                        <TableCell className="font-medium">{type.type_name}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {type.type_code}
                          </code>
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">
                          {type.description || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={type.is_active ? "default" : "secondary"}>
                            {type.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{type.sort_order}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <VariantLibraryTab />
        </TabsContent>
      </Tabs>

      {/* Edit Product Type Sheet */}
      <ProductTypeSheet
        productType={selectedType as any}
        open={!!selectedTypeId}
        onOpenChange={(open) => !open && setSelectedTypeId(null)}
      />

      {/* Create Product Type Sheet */}
      <ProductTypeSheet
        productType={undefined}
        open={isCreateTypeOpen}
        onOpenChange={setIsCreateTypeOpen}
      />
    </div>
  );
}
