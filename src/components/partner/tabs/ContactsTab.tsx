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
  { code: "+1", country: "US/CA" },
  { code: "+7", country: "RU/KZ" },
  { code: "+20", country: "EG" },
  { code: "+27", country: "ZA" },
  { code: "+30", country: "GR" },
  { code: "+31", country: "NL" },
  { code: "+32", country: "BE" },
  { code: "+33", country: "FR" },
  { code: "+34", country: "ES" },
  { code: "+36", country: "HU" },
  { code: "+39", country: "IT" },
  { code: "+40", country: "RO" },
  { code: "+41", country: "CH" },
  { code: "+43", country: "AT" },
  { code: "+44", country: "UK" },
  { code: "+45", country: "DK" },
  { code: "+46", country: "SE" },
  { code: "+47", country: "NO" },
  { code: "+48", country: "PL" },
  { code: "+49", country: "DE" },
  { code: "+51", country: "PE" },
  { code: "+52", country: "MX" },
  { code: "+53", country: "CU" },
  { code: "+54", country: "AR" },
  { code: "+55", country: "BR" },
  { code: "+56", country: "CL" },
  { code: "+57", country: "CO" },
  { code: "+58", country: "VE" },
  { code: "+60", country: "MY" },
  { code: "+61", country: "AU" },
  { code: "+62", country: "ID" },
  { code: "+63", country: "PH" },
  { code: "+64", country: "NZ" },
  { code: "+65", country: "SG" },
  { code: "+66", country: "TH" },
  { code: "+81", country: "JP" },
  { code: "+82", country: "KR" },
  { code: "+84", country: "VN" },
  { code: "+86", country: "CN" },
  { code: "+90", country: "TR" },
  { code: "+91", country: "IN" },
  { code: "+92", country: "PK" },
  { code: "+93", country: "AF" },
  { code: "+94", country: "LK" },
  { code: "+95", country: "MM" },
  { code: "+98", country: "IR" },
  { code: "+212", country: "MA" },
  { code: "+213", country: "DZ" },
  { code: "+216", country: "TN" },
  { code: "+218", country: "LY" },
  { code: "+220", country: "GM" },
  { code: "+221", country: "SN" },
  { code: "+222", country: "MR" },
  { code: "+223", country: "ML" },
  { code: "+224", country: "GN" },
  { code: "+225", country: "CI" },
  { code: "+226", country: "BF" },
  { code: "+227", country: "NE" },
  { code: "+228", country: "TG" },
  { code: "+229", country: "BJ" },
  { code: "+230", country: "MU" },
  { code: "+231", country: "LR" },
  { code: "+232", country: "SL" },
  { code: "+233", country: "GH" },
  { code: "+234", country: "NG" },
  { code: "+235", country: "TD" },
  { code: "+236", country: "CF" },
  { code: "+237", country: "CM" },
  { code: "+238", country: "CV" },
  { code: "+239", country: "ST" },
  { code: "+240", country: "GQ" },
  { code: "+241", country: "GA" },
  { code: "+242", country: "CG" },
  { code: "+243", country: "CD" },
  { code: "+244", country: "AO" },
  { code: "+245", country: "GW" },
  { code: "+246", country: "IO" },
  { code: "+248", country: "SC" },
  { code: "+249", country: "SD" },
  { code: "+250", country: "RW" },
  { code: "+251", country: "ET" },
  { code: "+252", country: "SO" },
  { code: "+253", country: "DJ" },
  { code: "+254", country: "KE" },
  { code: "+255", country: "TZ" },
  { code: "+256", country: "UG" },
  { code: "+257", country: "BI" },
  { code: "+258", country: "MZ" },
  { code: "+260", country: "ZM" },
  { code: "+261", country: "MG" },
  { code: "+262", country: "RE/YT" },
  { code: "+263", country: "ZW" },
  { code: "+264", country: "NA" },
  { code: "+265", country: "MW" },
  { code: "+266", country: "LS" },
  { code: "+267", country: "BW" },
  { code: "+268", country: "SZ" },
  { code: "+269", country: "KM" },
  { code: "+290", country: "SH" },
  { code: "+291", country: "ER" },
  { code: "+297", country: "AW" },
  { code: "+298", country: "FO" },
  { code: "+299", country: "GL" },
  { code: "+350", country: "GI" },
  { code: "+351", country: "PT" },
  { code: "+352", country: "LU" },
  { code: "+353", country: "IE" },
  { code: "+354", country: "IS" },
  { code: "+355", country: "AL" },
  { code: "+356", country: "MT" },
  { code: "+357", country: "CY" },
  { code: "+358", country: "FI" },
  { code: "+359", country: "BG" },
  { code: "+370", country: "LT" },
  { code: "+371", country: "LV" },
  { code: "+372", country: "EE" },
  { code: "+373", country: "MD" },
  { code: "+374", country: "AM" },
  { code: "+375", country: "BY" },
  { code: "+376", country: "AD" },
  { code: "+377", country: "MC" },
  { code: "+378", country: "SM" },
  { code: "+380", country: "UA" },
  { code: "+381", country: "RS" },
  { code: "+382", country: "ME" },
  { code: "+383", country: "XK" },
  { code: "+385", country: "HR" },
  { code: "+386", country: "SI" },
  { code: "+387", country: "BA" },
  { code: "+389", country: "MK" },
  { code: "+420", country: "CZ" },
  { code: "+421", country: "SK" },
  { code: "+423", country: "LI" },
  { code: "+500", country: "FK" },
  { code: "+501", country: "BZ" },
  { code: "+502", country: "GT" },
  { code: "+503", country: "SV" },
  { code: "+504", country: "HN" },
  { code: "+505", country: "NI" },
  { code: "+506", country: "CR" },
  { code: "+507", country: "PA" },
  { code: "+508", country: "PM" },
  { code: "+509", country: "HT" },
  { code: "+590", country: "GP/BL/MF" },
  { code: "+591", country: "BO" },
  { code: "+592", country: "GY" },
  { code: "+593", country: "EC" },
  { code: "+594", country: "GF" },
  { code: "+595", country: "PY" },
  { code: "+596", country: "MQ" },
  { code: "+597", country: "SR" },
  { code: "+598", country: "UY" },
  { code: "+599", country: "CW/BQ" },
  { code: "+670", country: "TL" },
  { code: "+672", country: "NF" },
  { code: "+673", country: "BN" },
  { code: "+674", country: "NR" },
  { code: "+675", country: "PG" },
  { code: "+676", country: "TO" },
  { code: "+677", country: "SB" },
  { code: "+678", country: "VU" },
  { code: "+679", country: "FJ" },
  { code: "+680", country: "PW" },
  { code: "+681", country: "WF" },
  { code: "+682", country: "CK" },
  { code: "+683", country: "NU" },
  { code: "+685", country: "WS" },
  { code: "+686", country: "KI" },
  { code: "+687", country: "NC" },
  { code: "+688", country: "TV" },
  { code: "+689", country: "PF" },
  { code: "+690", country: "TK" },
  { code: "+691", country: "FM" },
  { code: "+692", country: "MH" },
  { code: "+850", country: "KP" },
  { code: "+852", country: "HK" },
  { code: "+853", country: "MO" },
  { code: "+855", country: "KH" },
  { code: "+856", country: "LA" },
  { code: "+880", country: "BD" },
  { code: "+886", country: "TW" },
  { code: "+960", country: "MV" },
  { code: "+961", country: "LB" },
  { code: "+962", country: "JO" },
  { code: "+963", country: "SY" },
  { code: "+964", country: "IQ" },
  { code: "+965", country: "KW" },
  { code: "+966", country: "SA" },
  { code: "+967", country: "YE" },
  { code: "+968", country: "OM" },
  { code: "+970", country: "PS" },
  { code: "+971", country: "AE" },
  { code: "+972", country: "IL" },
  { code: "+973", country: "BH" },
  { code: "+974", country: "QA" },
  { code: "+975", country: "BT" },
  { code: "+976", country: "MN" },
  { code: "+977", country: "NP" },
  { code: "+992", country: "TJ" },
  { code: "+993", country: "TM" },
  { code: "+994", country: "AZ" },
  { code: "+995", country: "GE" },
  { code: "+996", country: "KG" },
  { code: "+998", country: "UZ" },
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
