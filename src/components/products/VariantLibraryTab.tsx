import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ChevronRight } from "lucide-react";
import { useVariantGroups } from "@/hooks/useVariantGroups";
import { CreateVariantGroupDialog } from "./CreateVariantGroupDialog";

export function VariantLibraryTab() {
  const navigate = useNavigate();
  const { variantGroups, isLoading, getCodesForGroup } = useVariantGroups();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="h-32 flex items-center justify-center text-muted-foreground">
          Loading variant groups...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Shared Variant Groups</CardTitle>
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Group
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {variantGroups.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              No variant groups configured
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Codes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variantGroups.map((group) => {
                  const codes = getCodesForGroup(group.id);
                  return (
                    <TableRow
                      key={group.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/admin/products/groups/${group.id}`)}
                    >
                      <TableCell className="font-medium">{group.group_name}</TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {group.description || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{codes.length} codes</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={group.is_active ? "default" : "secondary"}>
                          {group.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create new group */}
      <CreateVariantGroupDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}