import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useProductTypeMutations, ProductType } from "@/hooks/useProductTypeMutations";
import { useVariantGroups } from "@/hooks/useVariantGroups";
import { useVariantHierarchy } from "@/hooks/useVariantHierarchy";

interface ProductTypeSheetProps {
  productType?: ProductType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AssignedGroup {
  variant_group_id: string;
  sort_order: number;
  is_required: boolean;
  allow_multiple: boolean;
  group_name?: string;
}

export function ProductTypeSheet({ productType, open, onOpenChange }: ProductTypeSheetProps) {
  const { createProductType, updateProductType, deleteProductType, assignVariantGroups } = useProductTypeMutations();
  const { variantGroups } = useVariantGroups();
  const { productTypeVariantGroups } = useVariantHierarchy(productType?.id);

  const [typeCode, setTypeCode] = useState("");
  const [typeName, setTypeName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [assignedGroups, setAssignedGroups] = useState<AssignedGroup[]>([]);

  const isEditing = !!productType;

  useEffect(() => {
    if (productType) {
      setTypeCode(productType.type_code);
      setTypeName(productType.type_name);
      setDescription(productType.description || "");
      setSortOrder(productType.sort_order);
      setIsActive(productType.is_active);
    } else {
      setTypeCode("");
      setTypeName("");
      setDescription("");
      setSortOrder(0);
      setIsActive(true);
    }
  }, [productType, open]);

  // Load assigned groups when editing
  useEffect(() => {
    if (productTypeVariantGroups && productType) {
      setAssignedGroups(
        productTypeVariantGroups.map(ptg => ({
          variant_group_id: ptg.variant_group_id,
          sort_order: ptg.sort_order,
          is_required: ptg.is_required,
          allow_multiple: ptg.allow_multiple,
          group_name: ptg.variant_group?.group_name,
        }))
      );
    } else {
      setAssignedGroups([]);
    }
  }, [productTypeVariantGroups, productType]);

  const handleSaveType = async () => {
    if (!typeCode.trim() || !typeName.trim()) return;

    if (isEditing && productType) {
      await updateProductType.mutateAsync({
        id: productType.id,
        type_code: typeCode.toUpperCase(),
        type_name: typeName,
        description: description || null,
        sort_order: sortOrder,
        is_active: isActive,
      });
    } else {
      await createProductType.mutateAsync({
        type_code: typeCode.toUpperCase(),
        type_name: typeName,
        description: description || undefined,
        sort_order: sortOrder,
      });
      onOpenChange(false);
    }
  };

  const handleDeleteType = async () => {
    if (!productType) return;
    if (!confirm(`Delete "${productType.type_name}"? This cannot be undone.`)) return;

    await deleteProductType.mutateAsync(productType.id);
    onOpenChange(false);
  };

  const handleSaveGroups = async () => {
    if (!productType) return;

    await assignVariantGroups.mutateAsync({
      productTypeId: productType.id,
      variantGroups: assignedGroups.map((g, idx) => ({
        variant_group_id: g.variant_group_id,
        sort_order: idx, // Ensure sequential ordering
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? `Edit: ${productType?.type_name}` : "Create Product Type"}
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="info" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Type Info</TabsTrigger>
            <TabsTrigger value="groups" disabled={!isEditing}>
              Variant Groups
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!isEditing}>
              SKU Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
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

            {isEditing && (
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSaveType} 
                disabled={!typeCode.trim() || typeCode.length !== 3 || !typeName.trim()}
              >
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Save Changes" : "Create Type"}
              </Button>
              {isEditing && (
                <Button variant="destructive" onClick={handleDeleteType}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-4 mt-4">
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
                <Label>Assigned Groups (drag to reorder)</Label>
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
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 mt-4">
            <div className="border rounded-lg p-4 space-y-4">
              <Label>SKU Structure Preview</Label>
              <div className="font-mono text-lg bg-muted p-3 rounded">
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
                <div><span className="text-blue-500 font-mono">[ASC]</span> = Artwork Source Code (e.g., A001)</div>
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

              <div className="pt-2 border-t">
                <Label className="text-sm">Example SKU:</Label>
                <div className="font-mono text-sm mt-1">
                  A001-{typeCode || 'XXX'}-{assignedGroups.length > 0 ? '04' : '99'}-{assignedGroups.length > 1 ? '02' : '99'}-99
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
