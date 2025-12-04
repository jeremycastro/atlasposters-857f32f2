import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RoyaltyGroup } from "@/types/partner";

interface ProductType {
  id: string;
  type_code: string;
  type_name: string;
}

interface RoyaltyGroupsBuilderProps {
  value: RoyaltyGroup[];
  onChange: (groups: RoyaltyGroup[]) => void;
}

export function RoyaltyGroupsBuilder({ value, onChange }: RoyaltyGroupsBuilderProps) {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductTypes();
  }, []);

  const fetchProductTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('product_types')
        .select('id, type_code, type_name')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      setProductTypes(data || []);
    } catch (error) {
      console.error('Error fetching product types:', error);
    } finally {
      setLoading(false);
    }
  };

  const addGroup = () => {
    const newGroup: RoyaltyGroup = {
      id: crypto.randomUUID(),
      name: value.length === 0 ? "All Products" : `Group ${value.length + 1}`,
      rate: 10,
      calculation_basis: 'revenue',
      applies_to: value.length === 0 ? 'all' : 'specific',
      product_type_ids: [],
      product_ids: [],
    };
    onChange([...value, newGroup]);
  };

  const updateGroup = (id: string, updates: Partial<RoyaltyGroup>) => {
    onChange(value.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const removeGroup = (id: string) => {
    onChange(value.filter(g => g.id !== id));
  };

  const toggleProductType = (groupId: string, typeId: string) => {
    const group = value.find(g => g.id === groupId);
    if (!group) return;

    const currentIds = group.product_type_ids || [];
    const newIds = currentIds.includes(typeId)
      ? currentIds.filter(id => id !== typeId)
      : [...currentIds, typeId];
    
    updateGroup(groupId, { product_type_ids: newIds });
  };

  // Check if a product type is already assigned to another group
  const isTypeAssigned = (typeId: string, excludeGroupId: string) => {
    return value.some(g => 
      g.id !== excludeGroupId && 
      g.applies_to === 'specific' && 
      g.product_type_ids?.includes(typeId)
    );
  };

  // Check if there's an "all_other" group
  const hasAllOtherGroup = value.some(g => g.applies_to === 'all_other');
  const hasAllGroup = value.some(g => g.applies_to === 'all');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">Royalty Groups</Label>
          <p className="text-xs text-muted-foreground">
            Define royalty rates for different product categories
          </p>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addGroup}
          disabled={hasAllGroup}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Group
        </Button>
      </div>

      {value.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground">
            <p className="text-sm">No royalty groups defined</p>
            <p className="text-xs mt-1">Add a group to define tiered royalty rates</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {value.map((group, index) => (
            <Card key={group.id} className="relative">
              <CardHeader className="pb-2 pt-3 px-4">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <Input
                    value={group.name}
                    onChange={(e) => updateGroup(group.id, { name: e.target.value })}
                    className="h-8 font-medium flex-1"
                    placeholder="Group name"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGroup(group.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Rate (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={group.rate}
                      onChange={(e) => updateGroup(group.id, { rate: parseFloat(e.target.value) || 0 })}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Basis</Label>
                    <Select
                      value={group.calculation_basis}
                      onValueChange={(v) => updateGroup(group.id, { calculation_basis: v as 'revenue' })}
                      disabled
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="revenue">Revenue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Applies To</Label>
                    <Select
                      value={group.applies_to}
                      onValueChange={(v) => updateGroup(group.id, { 
                        applies_to: v as 'all' | 'all_other' | 'specific',
                        product_type_ids: v === 'specific' ? group.product_type_ids : []
                      })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" disabled={value.length > 1}>All Products</SelectItem>
                        <SelectItem value="specific">Specific Types</SelectItem>
                        <SelectItem value="all_other" disabled={hasAllOtherGroup && group.applies_to !== 'all_other'}>
                          All Other Products
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {group.applies_to === 'specific' && (
                  <div>
                    <Label className="text-xs mb-2 block">Product Types</Label>
                    <div className="flex flex-wrap gap-2">
                      {loading ? (
                        <span className="text-xs text-muted-foreground">Loading...</span>
                      ) : productTypes.length === 0 ? (
                        <span className="text-xs text-muted-foreground">No product types defined</span>
                      ) : (
                        productTypes.map((type) => {
                          const isSelected = group.product_type_ids?.includes(type.id);
                          const isDisabled = isTypeAssigned(type.id, group.id);
                          
                          return (
                            <div
                              key={type.id}
                              className={`flex items-center gap-2 px-2 py-1 rounded border cursor-pointer transition-colors ${
                                isSelected 
                                  ? 'bg-primary/10 border-primary' 
                                  : isDisabled 
                                    ? 'bg-muted/50 border-muted cursor-not-allowed opacity-50' 
                                    : 'hover:bg-muted'
                              }`}
                              onClick={() => !isDisabled && toggleProductType(group.id, type.id)}
                            >
                              <Checkbox 
                                checked={isSelected} 
                                disabled={isDisabled}
                                onCheckedChange={() => !isDisabled && toggleProductType(group.id, type.id)}
                              />
                              <span className="text-xs">{type.type_name}</span>
                              <Badge variant="outline" className="text-[10px] px-1">
                                {type.type_code}
                              </Badge>
                            </div>
                          );
                        })
                      )}
                    </div>
                    {group.product_type_ids?.length === 0 && (
                      <p className="text-xs text-amber-500 mt-1">
                        Select at least one product type for this group
                      </p>
                    )}
                  </div>
                )}

                {group.applies_to === 'all_other' && (
                  <p className="text-xs text-muted-foreground">
                    This group will apply to all products not covered by other specific groups
                  </p>
                )}

                {group.applies_to === 'all' && (
                  <p className="text-xs text-muted-foreground">
                    This single rate applies to all products
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {value.length > 0 && !hasAllGroup && !hasAllOtherGroup && (
        <p className="text-xs text-amber-500">
          Tip: Add an "All Other Products" group to catch products not explicitly assigned
        </p>
      )}
    </div>
  );
}
