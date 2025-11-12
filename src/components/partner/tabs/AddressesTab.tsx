import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Star, Trash2 } from "lucide-react";
import { useCreateAddress, useUpdateAddress, useDeleteAddress } from "@/hooks/usePartnerMutations";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Address {
  id: string;
  designation?: string;
  contact_name?: string;
  contact_id?: string;
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

const COUNTRIES = [
  "Argentina",
  "Australia",
  "Austria",
  "Belgium",
  "Brazil",
  "Canada",
  "Chile",
  "Czech Republic",
  "Denmark",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Ireland",
  "Italy",
  "Japan",
  "Mexico",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Poland",
  "Portugal",
  "Singapore",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "United Kingdom",
  "USA",
];

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

const CANADIAN_PROVINCES = [
  "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"
];

const getStatesForCountry = (country: string) => {
  if (country === "USA") return US_STATES;
  if (country === "Canada") return CANADIAN_PROVINCES;
  return [];
};

export function AddressesTab({ partnerId, addresses }: AddressesTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    designation: "",
    contact_selection: "",
    contact_id: "",
    contact_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "USA",
  });

  const { data: partnerContacts = [] } = useQuery({
    queryKey: ["partner-contacts", partnerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partner_contacts")
        .select("id, full_name, first_name, last_name, email")
        .eq("partner_id", partnerId)
        .order("is_primary", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    // Reset state when country changes
    if (formData.country && !getStatesForCountry(formData.country).includes(formData.state)) {
      setFormData(prev => ({ ...prev, state: "" }));
    }
  }, [formData.country]);

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
      designation: "",
      contact_selection: "",
      contact_id: "",
      contact_name: "",
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
        contact_selection: address.contact_id ? address.contact_id : "other",
        contact_id: address.contact_id || "",
        contact_name: address.contact_name || "",
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
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-2 pb-20">
          <Button onClick={handleBack} variant="ghost" size="sm" className="mb-1">
            ← Back to Addresses
          </Button>
          <h3 className="text-lg font-medium mb-2">{editingAddress ? "Edit Address" : "Add Address"}</h3>
          <form onSubmit={handleSubmit} className="space-y-2" id="address-form">
          <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
            <Label htmlFor="designation" className="text-sm text-right">Address Type *</Label>
            <Select
              value={formData.designation}
              onValueChange={(value) => setFormData({ ...formData, designation: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
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

          <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
            <Label htmlFor="contact" className="text-sm text-right">Contact</Label>
            <Select
              value={formData.contact_selection}
              onValueChange={(value) => {
                if (value === "other") {
                  setFormData({ ...formData, contact_selection: value, contact_id: "", contact_name: "" });
                } else {
                  const contact = partnerContacts.find(c => c.id === value);
                  setFormData({ 
                    ...formData, 
                    contact_selection: value, 
                    contact_id: value,
                    contact_name: contact?.full_name || `${contact?.first_name} ${contact?.last_name}`.trim()
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Contact" />
              </SelectTrigger>
              <SelectContent>
                {partnerContacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.full_name || `${contact.first_name} ${contact.last_name}`.trim()}
                  </SelectItem>
                ))}
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.contact_selection === "other" && (
            <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
              <Label htmlFor="contact_name" className="text-sm text-right">Contact Name</Label>
              <Input
                id="contact_name"
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                placeholder="Enter contact name"
              />
            </div>
          )}

          <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
            <Label htmlFor="address_line1" className="text-sm text-right">Address Line 1 *</Label>
            <Input
              id="address_line1"
              value={formData.address_line1}
              onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
            <Label htmlFor="address_line2" className="text-sm text-right">Address Line 2</Label>
            <Input
              id="address_line2"
              value={formData.address_line2}
              onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
            <Label htmlFor="country" className="text-sm text-right">Country *</Label>
            <Select
              value={formData.country}
              onValueChange={(value) => setFormData({ ...formData, country: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
            <Label htmlFor="city" className="text-sm text-right">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
            <Label htmlFor="state" className="text-sm text-right">State/Province</Label>
            {getStatesForCountry(formData.country).length > 0 ? (
              <Select
                value={formData.state}
                onValueChange={(value) => setFormData({ ...formData, state: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state/province" />
                </SelectTrigger>
                <SelectContent>
                  {getStatesForCountry(formData.country).map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Enter state/province/region"
              />
            )}
          </div>

          <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
            <Label htmlFor="postal_code" className="text-sm text-right">Postal Code *</Label>
            <Input
              id="postal_code"
              value={formData.postal_code}
              onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              required
            />
          </div>

          </form>
        </div>
        <div className="sticky bottom-0 left-0 right-0 bg-background border-t p-4 flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
          >
            Cancel
          </Button>
          <Button type="submit" form="address-form" disabled={createAddress.isPending || updateAddress.isPending}>
            {editingAddress ? "Update Address" : "Create Address"}
          </Button>
        </div>
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
