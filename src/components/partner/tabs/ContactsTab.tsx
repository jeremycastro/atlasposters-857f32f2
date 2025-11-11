import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCreateContact } from "@/hooks/usePartnerMutations";
import { Plus, Mail, Phone, Star } from "lucide-react";
import { useState } from "react";

export const ContactsTab = ({ partnerId, contacts }: { partnerId: string; contacts: any[] }) => {
  const [showForm, setShowForm] = useState(false);
  const createContact = useCreateContact();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
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
            full_name: "",
            email: "",
            phone: "",
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
                  <Label>Full Name *</Label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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

      <div className="grid gap-4">
        {contacts.map((contact) => (
          <Card key={contact.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{contact.full_name}</h4>
                    {contact.is_primary && (
                      <Badge variant="outline" className="gap-1">
                        <Star className="h-3 w-3" />
                        Primary
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {contact.email}
                  </div>
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </div>
                  )}
                </div>
                <Badge variant="secondary" className="capitalize">
                  {contact.designation.replace('_', ' ')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {contacts.length === 0 && !showForm && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No contacts yet. Add one to get started.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
