import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

{addresses.length === 0 && !showForm ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No addresses yet. Add one to get started.
          </CardContent>
        </Card>
      ) : addresses.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Designation</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Postal Code</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Primary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addresses.map((address) => (
                <TableRow 
                  key={address.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    setFormData({
                      designation: address.designation,
                      address_line1: address.address_line1,
                      address_line2: address.address_line2 || '',
                      city: address.city,
                      state: address.state || '',
                      postal_code: address.postal_code,
                      country: address.country,
                      is_primary: address.is_primary || false,
                    });
                    setShowForm(true);
                  }}
                >
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {address.designation.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>{address.address_line1}</div>
                    {address.address_line2 && <div className="text-muted-foreground">{address.address_line2}</div>}
                  </TableCell>
                  <TableCell className="text-sm">{address.city}</TableCell>
                  <TableCell className="text-sm">{address.state || '-'}</TableCell>
                  <TableCell className="text-sm">{address.postal_code}</TableCell>
                  <TableCell className="text-sm">{address.country}</TableCell>
                  <TableCell>
                    {address.is_primary && (
                      <Badge variant="outline" className="gap-1">
                        <Star className="h-3 w-3" />
                        Primary
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
};
