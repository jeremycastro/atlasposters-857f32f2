import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { ArrowLeft, Save, Trash2, Plus } from "lucide-react";
import { PartnerBreadcrumb } from "@/components/admin/PartnerBreadcrumb";
import { useVariantGroups } from "@/hooks/useVariantGroups";
import { toast } from "sonner";

export default function VariantGroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    updateGroup,
    deleteGroup,
    createCode,
    deleteCode,
    getCodesForGroup,
    getNextAvailableCode,
  } = useVariantGroups();

  // Form state
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  // New code form
  const [newCode, setNewCode] = useState("");
  const [newDisplayValue, setNewDisplayValue] = useState("");
  const [newCodeDescription, setNewCodeDescription] = useState("");

  const { data: variantGroup, isLoading } = useQuery({
    queryKey: ['variantGroup', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('variant_groups')
        .select('*')
        .eq('id', groupId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!groupId,
  });

  const codes = groupId ? getCodesForGroup(groupId) : [];

  // Initialize form when data loads
  useEffect(() => {
    if (variantGroup) {
      setGroupName(variantGroup.group_name);
      setDescription(variantGroup.description || "");
      setIsActive(variantGroup.is_active ?? true);
    }
  }, [variantGroup]);

  // Set suggested next code
  useEffect(() => {
    if (groupId && !newCode) {
      setNewCode(getNextAvailableCode(groupId));
    }
  }, [groupId, codes.length]);

  const handleSaveInfo = async () => {
    if (!groupName.trim() || !groupId) return;

    await updateGroup.mutateAsync({
      id: groupId,
      group_name: groupName,
      description: description || null,
      is_active: isActive,
    });
  };

  const handleDelete = async () => {
    if (!groupId) return;
    await deleteGroup.mutateAsync(groupId);
    navigate('/admin/products?tab=library');
  };

  const handleAddCode = async () => {
    if (!groupId || !newCode.trim() || !newDisplayValue.trim()) return;

    // Validate code format (2 digits, 00-98)
    if (!/^\d{2}$/.test(newCode) || parseInt(newCode, 10) > 98) {
      toast.error("Code must be 2 digits between 00-98");
      return;
    }

    // Check for duplicate
    if (codes.some(c => c.code === newCode)) {
      toast.error("This code already exists");
      return;
    }

    await createCode.mutateAsync({
      variant_group_id: groupId,
      code: newCode,
      display_value: newDisplayValue,
      description: newCodeDescription || undefined,
      display_order: codes.length,
    });

    // Reset form and suggest next code
    setNewCode(getNextAvailableCode(groupId));
    setNewDisplayValue("");
    setNewCodeDescription("");
  };

  const handleDeleteCode = async (codeId: string) => {
    if (!confirm("Delete this variant code?")) return;
    await deleteCode.mutateAsync(codeId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!variantGroup) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Variant Group not found</h2>
          <p className="text-muted-foreground mt-2">
            The variant group you're looking for doesn't exist or has been removed.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/admin/products?tab=library')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Variant Library
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
          onClick={() => navigate('/admin/products?tab=library')}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Variant Library
        </Button>

        <PartnerBreadcrumb
          segments={[
            { label: "Products", href: "/admin/products" },
            { label: "Variant Library", href: "/admin/products?tab=library" },
            { label: variantGroup.group_name, href: `/admin/products/groups/${variantGroup.id}` }
          ]}
        />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{variantGroup.group_name}</h1>
            <Badge variant={variantGroup.is_active ? 'default' : 'secondary'}>
              {variantGroup.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline">{codes.length} codes</Badge>
          </div>
          {variantGroup.description && (
            <p className="text-muted-foreground">{variantGroup.description}</p>
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Group Info</TabsTrigger>
          <TabsTrigger value="codes">
            Codes
            <Badge variant="secondary" className="ml-2">{codes.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Active</Label>
                  <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                </div>

                <Button onClick={handleSaveInfo} disabled={!groupName.trim()}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="codes">
            <Card>
              <CardHeader>
                <CardTitle>Variant Codes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Variant Group?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete "{variantGroup.group_name}" and all its codes. This action cannot be undone.
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
