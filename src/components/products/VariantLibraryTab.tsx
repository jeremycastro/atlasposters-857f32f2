import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ChevronRight } from "lucide-react";
import { useVariantGroups } from "@/hooks/useVariantGroups";
import { VariantGroupSheet } from "./VariantGroupSheet";

export function VariantLibraryTab() {
  const { variantGroups, isLoading, getCodesForGroup } = useVariantGroups();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const selectedGroup = variantGroups.find(g => g.id === selectedGroupId);

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
                      onClick={() => setSelectedGroupId(group.id)}
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

      {/* Edit existing group */}
      <VariantGroupSheet
        group={selectedGroup}
        open={!!selectedGroupId}
        onOpenChange={(open) => !open && setSelectedGroupId(null)}
      />

      {/* Create new group */}
      <VariantGroupSheet
        group={undefined}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}
