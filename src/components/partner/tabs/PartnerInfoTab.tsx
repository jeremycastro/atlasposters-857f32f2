import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdatePartner } from "@/hooks/usePartnerMutations";
import { useProfiles } from "@/hooks/useProfiles";
import { useState } from "react";
import { Pencil, Save, X } from "lucide-react";

export const PartnerInfoTab = ({ partner }: { partner: any }) => {
  const [isEditing, setIsEditing] = useState(false);
  const updatePartner = useUpdatePartner();
  const { data: profiles } = useProfiles();

  const [formData, setFormData] = useState({
    partner_name: partner.partner_name,
    website_url: partner.website_url || "",
    status: partner.status,
    atlas_manager_id: partner.atlas_manager_id || "",
    notes: partner.notes || "",
  });

  const handleSave = () => {
    updatePartner.mutate(
      { id: partner.id, updates: formData },
      {
        onSuccess: () => setIsEditing(false),
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "inactive": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "suspended": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "";
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <Badge className={getStatusColor(partner.status)}>{partner.status}</Badge>
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={updatePartner.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Partner Name</Label>
              <Input
                value={formData.partner_name}
                onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Atlas Manager</Label>
              <Select value={formData.atlas_manager_id} onValueChange={(value) => setFormData({ ...formData, atlas_manager_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  {profiles?.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.full_name || profile.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Website:</span>{" "}
              {partner.website_url ? (
                <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {partner.website_url}
                </a>
              ) : (
                <span className="text-muted-foreground">Not provided</span>
              )}
            </div>
            <div>
              <span className="text-muted-foreground">Atlas Manager:</span>{" "}
              {partner.atlas_manager?.full_name || "Not assigned"}
            </div>
            {partner.notes && (
              <div>
                <span className="text-muted-foreground">Notes:</span>
                <p className="mt-1 whitespace-pre-wrap">{partner.notes}</p>
              </div>
            )}
            <div className="pt-2 text-xs text-muted-foreground">
              <div>Created: {new Date(partner.created_at).toLocaleDateString()}</div>
              <div>Updated: {new Date(partner.updated_at).toLocaleDateString()}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
