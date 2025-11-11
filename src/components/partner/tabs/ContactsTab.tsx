import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCreateContact } from "@/hooks/usePartnerMutations";
import { Plus, Mail, Phone, Star } from "lucide-react";
import { useState } from "react";

export const ContactsTab = ({ partnerId, contacts }: { partnerId: string; contacts: any[] }) => {
  const [showForm, setShowForm] = useState(false);
  const createContact = useCreateContact();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile_phone: "",
    country_code: "+1",
    designation: "other",
    is_primary: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createContact.mutate(
      {
        partner_id: partnerId,
        ...formData,
      },
      {
        onSuccess: () => {
          setShowForm(false);
          setFormData({
            first_name: "",
            last_name: "",
            email: "",
            mobile_phone: "",
            country_code: "+1",
            designation: "other",
            is_primary: false,
          });
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Contacts ({contacts.length})</h3>
        <Button onClick={() => setShowForm(!showForm)} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Country Code</Label>
                  <Select value={formData.country_code} onValueChange={(value) => setFormData({ ...formData, country_code: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+1">+1 (US/Canada)</SelectItem>
                      <SelectItem value="+44">+44 (UK)</SelectItem>
                      <SelectItem value="+61">+61 (Australia)</SelectItem>
                      <SelectItem value="+81">+81 (Japan)</SelectItem>
                      <SelectItem value="+86">+86 (China)</SelectItem>
                      <SelectItem value="+91">+91 (India)</SelectItem>
                      <SelectItem value="+33">+33 (France)</SelectItem>
                      <SelectItem value="+49">+49 (Germany)</SelectItem>
                      <SelectItem value="+39">+39 (Italy)</SelectItem>
                      <SelectItem value="+34">+34 (Spain)</SelectItem>
                      <SelectItem value="+52">+52 (Mexico)</SelectItem>
                      <SelectItem value="+55">+55 (Brazil)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Mobile Phone</Label>
                  <Input
                    value={formData.mobile_phone}
                    onChange={(e) => setFormData({ ...formData, mobile_phone: e.target.value })}
                    placeholder="555-1234"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Select value={formData.designation} onValueChange={(value) => setFormData({ ...formData, designation: value })}>
                    <SelectTrigger>
                      <SelectValue />
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
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createContact.isPending}>
                  {createContact.isPending ? "Creating..." : "Create Contact"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

{contacts.length === 0 && !showForm ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No contacts yet. Add one to get started.
          </CardContent>
        </Card>
      ) : contacts.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile Phone</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Primary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow 
                  key={contact.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    setFormData({
                      first_name: contact.first_name,
                      last_name: contact.last_name || '',
                      email: contact.email,
                      mobile_phone: contact.mobile_phone || '',
                      country_code: contact.country_code || '+1',
                      designation: contact.designation || 'other',
                      is_primary: contact.is_primary || false,
                    });
                    setShowForm(true);
                  }}
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
                      {contact.designation.replace('_', ' ')}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
};
