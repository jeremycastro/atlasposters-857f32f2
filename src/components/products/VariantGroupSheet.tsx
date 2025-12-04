import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Save } from "lucide-react";
import { useVariantGroups, VariantGroup, VariantCode } from "@/hooks/useVariantGroups";

interface VariantGroupSheetProps {
  group?: VariantGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VariantGroupSheet({ group, open, onOpenChange }: VariantGroupSheetProps) {
  const { 
    createGroup, 
    updateGroup, 
    deleteGroup,
    createCode, 
    updateCode, 
    deleteCode,
    getCodesForGroup,
    getNextAvailableCode 
  } = useVariantGroups();

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  // New code form
  const [newCode, setNewCode] = useState("");
  const [newDisplayValue, setNewDisplayValue] = useState("");
  const [newCodeDescription, setNewCodeDescription] = useState("");

  const codes = group ? getCodesForGroup(group.id) : [];
  const isEditing = !!group;

  useEffect(() => {
    if (group) {
      setGroupName(group.group_name);
      setDescription(group.description || "");
      setIsActive(group.is_active);
    } else {
      setGroupName("");
      setDescription("");
      setIsActive(true);
    }
    // Reset new code form
    setNewCode("");
    setNewDisplayValue("");
    setNewCodeDescription("");
  }, [group, open]);

  const handleSaveGroup = async () => {
    if (!groupName.trim()) return;

    if (isEditing && group) {
      await updateGroup.mutateAsync({
        id: group.id,
        group_name: groupName,
        description: description || null,
        is_active: isActive,
      });
    } else {
      await createGroup.mutateAsync({
        group_name: groupName,
        description: description || undefined,
      });
      onOpenChange(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!group) return;
    if (!confirm(`Delete "${group.group_name}" and all its codes?`)) return;

    await deleteGroup.mutateAsync(group.id);
    onOpenChange(false);
  };

  const handleAddCode = async () => {
    if (!group || !newCode.trim() || !newDisplayValue.trim()) return;

    // Validate code format (2 digits, 00-98)
    if (!/^\d{2}$/.test(newCode) || parseInt(newCode, 10) > 98) {
      alert("Code must be 2 digits between 00-98");
      return;
    }

    await createCode.mutateAsync({
      variant_group_id: group.id,
      code: newCode,
      display_value: newDisplayValue,
      description: newCodeDescription || undefined,
      display_order: codes.length,
    });

    // Reset form and suggest next code
    setNewCode(getNextAvailableCode(group.id));
    setNewDisplayValue("");
    setNewCodeDescription("");
  };

  const handleDeleteCode = async (codeId: string) => {
    if (!confirm("Delete this variant code?")) return;
    await deleteCode.mutateAsync(codeId);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? `Edit: ${group?.group_name}` : "Create Variant Group"}
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="info" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Group Info</TabsTrigger>
            <TabsTrigger value="codes" disabled={!isEditing}>
              Codes {isEditing && <Badge variant="secondary" className="ml-2">{codes.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., Print Size, Paper Type"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this variant group..."
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
              <Button onClick={handleSaveGroup} disabled={!groupName.trim()}>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Save Changes" : "Create Group"}
              </Button>
              {isEditing && (
                <Button variant="destructive" onClick={handleDeleteGroup}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="codes" className="space-y-4 mt-4">
            {/* Add new code form */}
            <div className="border rounded-lg p-4 space-y-3">
              <Label className="text-sm font-medium">Add New Code</Label>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-2">
                  <Input
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.replace(/\D/g, '').slice(0, 2))}
                    placeholder="00"
                    className="text-center font-mono"
                    maxLength={2}
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    value={newDisplayValue}
                    onChange={(e) => setNewDisplayValue(e.target.value)}
                    placeholder="Display value"
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    value={newCodeDescription}
                    onChange={(e) => setNewCodeDescription(e.target.value)}
                    placeholder="Description (optional)"
                  />
                </div>
                <div className="col-span-2">
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={handleAddCode}
                    disabled={!newCode || !newDisplayValue}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Existing codes table */}
            {codes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No codes defined yet. Add codes above.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Code</TableHead>
                    <TableHead>Display Value</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-16">Status</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {codes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                          {code.code}
                        </code>
                      </TableCell>
                      <TableCell className="font-medium">{code.display_value}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {code.description || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={code.is_active ? "default" : "secondary"} className="text-xs">
                          {code.is_active ? "Active" : "Off"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteCode(code.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
