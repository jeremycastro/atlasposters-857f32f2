import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCreateAddress } from "@/hooks/usePartnerMutations";
import { Plus, MapPin, Star } from "lucide-react";
import { useState } from "react";

export const AddressesTab = ({ partnerId, addresses }: { partnerId: string; addresses: any[] }) => {
  const [showForm, setShowForm] = useState(false);
  const createAddress = useCreateAddress();

  const [formData, setFormData] = useState({
    designation: "ship_to",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "USA",
    is_primary: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAddress.mutate(
      {
        partner_id: partnerId,
        ...formData,
      },
      {
        onSuccess: () => {
          setShowForm(false);
          setFormData({
            designation: "ship_to",
            address_line1: "",
            address_line2: "",
            city: "",
            state: "",
            postal_code: "",
            country: "USA",
            is_primary: false,
          });
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Addresses ({addresses.length})</h3>
        <Button onClick={() => setShowForm(!showForm)} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Designation *</Label>
                <Select value={formData.designation} onValueChange={(value) => setFormData({ ...formData, designation: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ship_to">Ship To</SelectItem>
                    <SelectItem value="bill_to">Bill To</SelectItem>
                    <SelectItem value="headquarters">Headquarters</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Address Line 1 *</Label>
                <Input
                  value={formData.address_line1}
                  onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Address Line 2</Label>
                <Input
                  value={formData.address_line2}
                  onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Postal Code *</Label>
                  <Input
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createAddress.isPending}>
                  {createAddress.isPending ? "Creating..." : "Create Address"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary" className="capitalize">
                      {address.designation.replace('_', ' ')}
                    </Badge>
                    {address.is_primary && (
                      <Badge variant="outline" className="gap-1">
                        <Star className="h-3 w-3" />
                        Primary
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm">
                    <p>{address.address_line1}</p>
                    {address.address_line2 && <p>{address.address_line2}</p>}
                    <p>
                      {address.city}, {address.state} {address.postal_code}
                    </p>
                    <p>{address.country}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {addresses.length === 0 && !showForm && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No addresses yet. Add one to get started.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
