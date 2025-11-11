import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Star, Trash2 } from "lucide-react";
import { useCreateAddress, useUpdateAddress, useDeleteAddress } from "@/hooks/usePartnerMutations";

interface Address {
  id: string;
  designation?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  is_primary?: boolean;
}

interface AddressesTabProps {
  partnerId: string;
  addresses: Address[];
}

export function AddressesTab({ partnerId, addresses }: AddressesTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    designation: "ship_to",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "USA",
  });

  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAddress) {
      updateAddress.mutate(
        { id: editingAddress.id, updates: formData },
        {
          onSuccess: () => {
            setShowForm(false);
            setEditingAddress(null);
            resetForm();
          },
        }
      );
    } else {
      createAddress.mutate(
        { ...formData, partner_id: partnerId },
        {
          onSuccess: () => {
            setShowForm(false);
            resetForm();
          },
        }
      );
    }
  };

  const resetForm = () => {
    setFormData({
      designation: "ship_to",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "USA",
    });
  };

  const handleOpenForm = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        designation: address.designation || "ship_to",
        address_line1: address.address_line1,
        address_line2: address.address_line2 || "",
        city: address.city,
        state: address.state || "",
        postal_code: address.postal_code || "",
        country: address.country,
      });
    } else {
      setEditingAddress(null);
      resetForm();
    }
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setEditingAddress(null);
    resetForm();
  };

  const handleDeleteClick = (address: Address, e: React.MouseEvent) => {
    e.stopPropagation();
    setAddressToDelete(address);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (addressToDelete) {
      deleteAddress.mutate(addressToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setAddressToDelete(null);
        },
      });
    }
  };

  if (showForm) {
    return (
      <div className="space-y-4">
        <Button onClick={handleBack} variant="ghost" size="sm" className="mb-2">
          ← Back to Addresses
        </Button>
        <h3 className="text-lg font-medium">{editingAddress ? "Edit Address" : "Add Address"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="designation">Designation *</Label>
            <Select
              value={formData.designation}
              onValueChange={(value) => setFormData({ ...formData, designation: value })}
            >
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
            <Label htmlFor="address_line1">Address Line 1 *</Label>
            <Input
              id="address_line1"
              value={formData.address_line1}
              onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line2">Address Line 2</Label>
            <Input
              id="address_line2"
              value={formData.address_line2}
              onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code *</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createAddress.isPending || updateAddress.isPending}>
              {editingAddress ? "Update Address" : "Create Address"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Addresses ({addresses.length})</h3>
        <Button onClick={() => handleOpenForm()} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No addresses yet. Click "Add Address" to create one.
        </p>
      ) : (
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addresses.map((address) => (
                <TableRow 
                  key={address.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleOpenForm(address)}
                >
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {address.designation?.replace('_', ' ') || 'Other'}
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
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => handleDeleteClick(address, e)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the "{addressToDelete?.designation}" address? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
