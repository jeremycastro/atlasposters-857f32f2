import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCreateAgreement } from "@/hooks/usePartnerMutations";
import { Plus } from "lucide-react";
import { useState } from "react";

export const AgreementsTab = ({ partnerId, agreements }: { partnerId: string; agreements: any[] }) => {
  const [showForm, setShowForm] = useState(false);
  const createAgreement = useCreateAgreement();

  const [formData, setFormData] = useState({
    agreement_type: "royalty",
    effective_date: "",
    expiration_date: "",
    royalty_rate: "",
    commission_rate: "",
    payment_period: "monthly",
    status: "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAgreement.mutate(
      {
        partner_id: partnerId,
        ...formData,
        royalty_rate: formData.royalty_rate ? parseFloat(formData.royalty_rate) : null,
        commission_rate: formData.commission_rate ? parseFloat(formData.commission_rate) : null,
        expiration_date: formData.expiration_date || null,
      },
      {
        onSuccess: () => {
          setShowForm(false);
          setFormData({
            agreement_type: "royalty",
            effective_date: "",
            expiration_date: "",
            royalty_rate: "",
            commission_rate: "",
            payment_period: "monthly",
            status: "active",
          });
        },
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "draft": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "expired": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "terminated": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default: return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Agreements ({agreements.length})</h3>
        <Button onClick={() => setShowForm(!showForm)} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Agreement
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Agreement Type *</Label>
                  <Select value={formData.agreement_type} onValueChange={(value) => setFormData({ ...formData, agreement_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="royalty">Royalty</SelectItem>
                      <SelectItem value="wholesale">Wholesale</SelectItem>
                      <SelectItem value="commission">Commission</SelectItem>
                      <SelectItem value="licensing">Licensing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Effective Date *</Label>
                  <Input
                    type="date"
                    value={formData.effective_date}
                    onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Expiration Date</Label>
                  <Input
                    type="date"
                    value={formData.expiration_date}
                    onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Royalty Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.royalty_rate}
                    onChange={(e) => setFormData({ ...formData, royalty_rate: e.target.value })}
                    placeholder="10.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Commission Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.commission_rate}
                    onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })}
                    placeholder="15.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Payment Period</Label>
                  <Select value={formData.payment_period} onValueChange={(value) => setFormData({ ...formData, payment_period: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                      <SelectItem value="per_transaction">Per Transaction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createAgreement.isPending}>
                  {createAgreement.isPending ? "Creating..." : "Create Agreement"}
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
        {agreements.map((agreement) => (
          <Card key={agreement.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium capitalize">{agreement.agreement_type}</h4>
                    <Badge className={getStatusColor(agreement.status)}>{agreement.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(agreement.effective_date).toLocaleDateString()} - 
                    {agreement.expiration_date ? new Date(agreement.expiration_date).toLocaleDateString() : ' No end date'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {agreement.royalty_rate && (
                  <div>
                    <span className="text-muted-foreground">Royalty Rate:</span> {agreement.royalty_rate}%
                  </div>
                )}
                {agreement.commission_rate && (
                  <div>
                    <span className="text-muted-foreground">Commission Rate:</span> {agreement.commission_rate}%
                  </div>
                )}
                {agreement.payment_period && (
                  <div>
                    <span className="text-muted-foreground">Payment Period:</span>{" "}
                    <span className="capitalize">{agreement.payment_period.replace('_', ' ')}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {agreements.length === 0 && !showForm && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No agreements yet. Add one to get started.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
