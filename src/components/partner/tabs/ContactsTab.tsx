import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Star, Plus, Trash2 } from "lucide-react";
import { useCreateContact, useUpdateContact, useDeleteContact } from "@/hooks/usePartnerMutations";

const COUNTRY_CODES = [
  { code: "+1", country: "USA" },
  { code: "+1", country: "Canada" },
  { code: "+44", country: "United Kingdom" },
  { code: "+61", country: "Australia" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+39", country: "Italy" },
  { code: "+34", country: "Spain" },
  { code: "+31", country: "Netherlands" },
  { code: "+32", country: "Belgium" },
  { code: "+41", country: "Switzerland" },
  { code: "+43", country: "Austria" },
  { code: "+46", country: "Sweden" },
  { code: "+47", country: "Norway" },
  { code: "+45", country: "Denmark" },
  { code: "+358", country: "Finland" },
  { code: "+353", country: "Ireland" },
  { code: "+351", country: "Portugal" },
  { code: "+30", country: "Greece" },
  { code: "+48", country: "Poland" },
  { code: "+420", country: "Czech Republic" },
  { code: "+81", country: "Japan" },
  { code: "+82", country: "South Korea" },
  { code: "+65", country: "Singapore" },
  { code: "+64", country: "New Zealand" },
  { code: "+52", country: "Mexico" },
  { code: "+55", country: "Brazil" },
  { code: "+54", country: "Argentina" },
  { code: "+56", country: "Chile" },
];

interface Contact {
  id: string;
  first_name: string;
  last_name?: string;
  full_name: string;
  email: string;
  country_code?: string;
  mobile_phone?: string;
  designation?: string;
  is_primary?: boolean;
}

interface ContactsTabProps {
  partnerId: string;
  contacts: Contact[];
}

export function ContactsTab({ partnerId, contacts }: ContactsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    country_code: "+1",
    mobile_phone: "",
    designation: "",
  });

  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.designation) {
      return;
    }
    
    if (editingContact) {
      updateContact.mutate(
        { id: editingContact.id, updates: formData },
        {
          onSuccess: () => {
            setShowForm(false);
            setEditingContact(null);
            resetForm();
          },
        }
      );
    } else {
      createContact.mutate(
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
      first_name: "",
      last_name: "",
      email: "",
      country_code: "+1",
      mobile_phone: "",
      designation: "",
    });
  };

  const handleOpenForm = (contact?: Contact) => {
    if (contact) {
      setEditingContact(contact);
      setFormData({
        first_name: contact.first_name,
        last_name: contact.last_name || "",
        email: contact.email,
        country_code: contact.country_code || "+1",
        mobile_phone: contact.mobile_phone || "",
        designation: contact.designation || "other",
      });
    } else {
      setEditingContact(null);
      resetForm();
    }
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setEditingContact(null);
    resetForm();
  };

  const handleDeleteClick = (contact: Contact, e: React.MouseEvent) => {
    e.stopPropagation();
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (contactToDelete) {
      deleteContact.mutate(contactToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setContactToDelete(null);
        },
      });
    }
  };

  if (showForm) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-2 pb-20">
          <Button onClick={handleBack} variant="ghost" size="sm" className="mb-1">
            ← Back to Contacts
          </Button>
          <h3 className="text-lg font-medium mb-2">{editingContact ? "Edit Contact" : "Add Contact"}</h3>
          <form onSubmit={handleSubmit} className="space-y-2" id="contact-form">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid grid-cols-[120px_1fr] gap-3 items-center">
              <Label htmlFor="first_name" className="text-sm text-right">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-3 items-center">
              <Label htmlFor="last_name" className="text-sm text-right">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-[120px_1fr] gap-3 items-center">
            <Label htmlFor="email" className="text-sm text-right">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-[120px_1fr] gap-3 items-center">
            <Label className="text-sm text-right">Phone</Label>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <Select
                value={formData.country_code}
                onValueChange={(value) => setFormData({ ...formData, country_code: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_CODES.map(({ code, country }) => (
                    <SelectItem key={code} value={code}>
                      {code} ({country})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="mobile_phone"
                value={formData.mobile_phone}
                onChange={(e) => setFormData({ ...formData, mobile_phone: e.target.value })}
                placeholder="555-1234"
              />
            </div>
          </div>

          <div className="grid grid-cols-[120px_1fr] gap-3 items-center">
            <Label htmlFor="designation" className="text-sm text-right">Designation *</Label>
            <Select
              value={formData.designation}
              onValueChange={(value) => setFormData({ ...formData, designation: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Please select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="point_of_contact">Point of Contact</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="graphic_designer">Graphic Designer</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
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
          <Button type="submit" form="contact-form" disabled={createContact.isPending || updateContact.isPending}>
            {editingContact ? "Update Contact" : "Create Contact"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Contacts ({contacts.length})</h3>
        <Button onClick={() => handleOpenForm()} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {contacts.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No contacts yet. Click "Add Contact" to create one.
        </p>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile Phone</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Primary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow 
                  key={contact.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleOpenForm(contact)}
                >
                  <TableCell className="font-medium">{contact.full_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {contact.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {contact.mobile_phone ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {contact.country_code} {contact.mobile_phone}
                      </div>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {contact.designation?.replace('_', ' ') || 'Other'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {contact.is_primary && (
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
                      onClick={(e) => handleDeleteClick(contact, e)}
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
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{contactToDelete?.full_name}"? This action cannot be undone.
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
