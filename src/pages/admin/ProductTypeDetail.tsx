import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Save, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { PartnerBreadcrumb } from "@/components/admin/PartnerBreadcrumb";
import { useProductTypeMutations } from "@/hooks/useProductTypeMutations";
import { useVariantGroups } from "@/hooks/useVariantGroups";
import { useVariantHierarchy } from "@/hooks/useVariantHierarchy";
import { toast } from "sonner";

interface AssignedGroup {
  variant_group_id: string;
  sort_order: number;
  is_required: boolean;
  allow_multiple: boolean;
  group_name?: string;
}

export default function ProductTypeDetail() {
  const { typeId } = useParams<{ typeId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { updateProductType, deleteProductType, assignVariantGroups } = useProductTypeMutations();
  const { variantGroups } = useVariantGroups();
  const { productTypeVariantGroups } = useVariantHierarchy(typeId);

  // Form state
  const [typeCode, setTypeCode] = useState("");
  const [typeName, setTypeName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [assignedGroups, setAssignedGroups] = useState<AssignedGroup[]>([]);

  const { data: productType, isLoading } = useQuery({
    queryKey: ['productType', typeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_types')
        .select('*')
        .eq('id', typeId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!typeId,
  });

  // Initialize form when data loads
  useEffect(() => {
    if (productType) {
      setTypeCode(productType.type_code);
      setTypeName(productType.type_name);
      setDescription(productType.description || "");
      setSortOrder(productType.sort_order);
      setIsActive(productType.is_active ?? true);
    }
  }, [productType]);

  // Load assigned groups
  useEffect(() => {
    if (productTypeVariantGroups) {
      setAssignedGroups(
        productTypeVariantGroups.map(ptg => ({
          variant_group_id: ptg.variant_group_id,
          sort_order: ptg.sort_order,
          is_required: ptg.is_required,
          allow_multiple: ptg.allow_multiple,
          group_name: ptg.variant_group?.group_name,
        }))
      );
    }
  }, [productTypeVariantGroups]);

  const handleSaveInfo = async () => {
    if (!typeCode.trim() || !typeName.trim() || !typeId) return;

    await updateProductType.mutateAsync({
      id: typeId,
      type_code: typeCode.toUpperCase(),
      type_name: typeName,
      description: description || null,
      sort_order: sortOrder,
      is_active: isActive,
    });
  };

  const handleDelete = async () => {
    if (!typeId) return;
    await deleteProductType.mutateAsync(typeId);
    navigate('/admin/products?tab=types');
  };

  const handleSaveGroups = async () => {
    if (!typeId) return;

    await assignVariantGroups.mutateAsync({
      productTypeId: typeId,
      variantGroups: assignedGroups.map((g, idx) => ({
        variant_group_id: g.variant_group_id,
        sort_order: idx,
        is_required: g.is_required,
        allow_multiple: g.allow_multiple,
      })),
    });
  };

  const toggleGroup = (groupId: string) => {
    const existing = assignedGroups.find(g => g.variant_group_id === groupId);
    if (existing) {
      setAssignedGroups(assignedGroups.filter(g => g.variant_group_id !== groupId));
    } else {
      const group = variantGroups.find(vg => vg.id === groupId);
      setAssignedGroups([
        ...assignedGroups,
        {
          variant_group_id: groupId,
          sort_order: assignedGroups.length,
          is_required: false,
          allow_multiple: false,
          group_name: group?.group_name,
        },
      ]);
    }
  };

  const moveGroup = (index: number, direction: 'up' | 'down') => {
    const newGroups = [...assignedGroups];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newGroups.length) return;

    [newGroups[index], newGroups[newIndex]] = [newGroups[newIndex], newGroups[index]];
    setAssignedGroups(newGroups);
  };

  const toggleRequired = (groupId: string) => {
    setAssignedGroups(assignedGroups.map(g =>
      g.variant_group_id === groupId ? { ...g, is_required: !g.is_required } : g
    ));
  };

  const getVarLabel = (index: number) => {
    if (index === 0) return "VAR1";
    if (index === 1) return "VAR2";
    if (index === 2) return "VAR3";
    return `VAR${index + 1}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!productType) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product Type not found</h2>
          <p className="text-muted-foreground mt-2">
            The product type you're looking for doesn't exist or has been removed.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/admin/products?tab=types')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Product Types
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Back Button & Breadcrumb */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/products?tab=types')}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Product Types
        </Button>

        <PartnerBreadcrumb
          segments={[
            { label: "Products", href: "/admin/products" },
            { label: "Product Types", href: "/admin/products?tab=types" },
            { label: productType.type_name, href: `/admin/products/types/${productType.id}` }
          ]}
        />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">
              <code className="text-muted-foreground font-normal bg-muted px-2 py-1 rounded text-2xl">
                {productType.type_code}
              </code>
              {' – '}
              {productType.type_name}
            </h1>
            <Badge variant={productType.is_active ? 'default' : 'secondary'}>
              {productType.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          {productType.description && (
            <p className="text-muted-foreground">{productType.description}</p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDeleteDialogOpen(true)}
          className="shrink-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Type Info</TabsTrigger>
          <TabsTrigger value="groups">Variant Groups</TabsTrigger>
          <TabsTrigger value="preview">SKU Preview</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="typeCode">Type Code (3 letters)</Label>
                    <Input
                      id="typeCode"
                      value={typeCode}
                      onChange={(e) => setTypeCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3))}
                      placeholder="PST"
                      className="font-mono uppercase"
                      maxLength={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="typeName">Type Name</Label>
                  <Input
                    id="typeName"
                    value={typeName}
                    onChange={(e) => setTypeName(e.target.value)}
                    placeholder="e.g., Poster, Canvas, T-Shirt"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe this product type..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Active</Label>
                  <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                </div>

                <Button
                  onClick={handleSaveInfo}
                  disabled={!typeCode.trim() || typeCode.length !== 3 || !typeName.trim()}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <CardTitle>Variant Group Assignments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Available Variant Groups</Label>
                  <div className="border rounded-lg divide-y">
                    {variantGroups.map((group) => {
                      const isAssigned = assignedGroups.some(g => g.variant_group_id === group.id);
                      return (
                        <div key={group.id} className="flex items-center gap-3 p-3">
                          <Checkbox
                            checked={isAssigned}
                            onCheckedChange={() => toggleGroup(group.id)}
                          />
                          <div className="flex-1">
                            <div className="font-medium">{group.group_name}</div>
                            {group.description && (
                              <div className="text-sm text-muted-foreground">{group.description}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {assignedGroups.length > 0 && (
                  <div className="space-y-2">
                    <Label>Assigned Groups (reorder to change VAR position)</Label>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Position</TableHead>
                          <TableHead>Group</TableHead>
                          <TableHead className="w-20">Required</TableHead>
                          <TableHead className="w-20">Reorder</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assignedGroups.map((ag, index) => (
                          <TableRow key={ag.variant_group_id}>
                            <TableCell>
                              <Badge variant="outline">{getVarLabel(index)}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {ag.group_name || variantGroups.find(vg => vg.id === ag.variant_group_id)?.group_name}
                            </TableCell>
                            <TableCell>
                              <Checkbox
                                checked={ag.is_required}
                                onCheckedChange={() => toggleRequired(ag.variant_group_id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => moveGroup(index, 'up')}
                                  disabled={index === 0}
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => moveGroup(index, 'down')}
                                  disabled={index === assignedGroups.length - 1}
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                <Button onClick={handleSaveGroups} disabled={assignedGroups.length === 0}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Group Assignments
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>SKU Structure Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="font-mono text-lg bg-muted p-4 rounded">
                  <span className="text-blue-500">[ASC]</span>
                  <span className="text-muted-foreground">-</span>
                  <span className="text-green-500">{typeCode || 'XXX'}</span>
                  <span className="text-muted-foreground">-</span>
                  {assignedGroups.map((ag, idx) => (
                    <span key={ag.variant_group_id}>
                      <span className="text-orange-500">[{getVarLabel(idx)}]</span>
                      {idx < assignedGroups.length - 1 && <span className="text-muted-foreground">-</span>}
                    </span>
                  ))}
                  {assignedGroups.length < 3 && (
                    <>
                      {assignedGroups.length > 0 && <span className="text-muted-foreground">-</span>}
                      <span className="text-muted-foreground/50">99</span>
                    </>
                  )}
                </div>

                <div className="text-sm space-y-1">
                  <div><span className="text-blue-500 font-mono">[ASC]</span> = Artwork Source Code (e.g., ABC)</div>
                  <div><span className="text-green-500 font-mono">{typeCode || 'XXX'}</span> = Product Type Code</div>
                  {assignedGroups.map((ag, idx) => (
                    <div key={ag.variant_group_id}>
                      <span className="text-orange-500 font-mono">[{getVarLabel(idx)}]</span> = {ag.group_name || 'Unknown'} (2-digit code)
                    </div>
                  ))}
                  {assignedGroups.length < 3 && (
                    <div><span className="text-muted-foreground font-mono">99</span> = Not applicable / Reserved</div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <Label className="text-sm">Example SKU:</Label>
                  <div className="font-mono text-sm mt-1">
                    ABC-{typeCode || 'XXX'}-{assignedGroups.length > 0 ? '04' : '99'}-{assignedGroups.length > 1 ? '02' : '99'}-99
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product Type?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete "{productType.type_name}" ({productType.type_code}). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}