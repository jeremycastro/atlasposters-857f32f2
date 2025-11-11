import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { useCreateAgreement, useUpdateAgreement, useDeleteAgreement } from "@/hooks/usePartnerMutations";

interface Agreement {
  id: string;
  agreement_type: string;
  status: string;
  effective_date?: string;
  expiration_date?: string;
  royalty_rate?: number;
  commission_rate?: number;
  payment_period?: string;
}

interface AgreementsTabProps {
  partnerId: string;
  agreements: Agreement[];
}

export function AgreementsTab({ partnerId, agreements }: AgreementsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState<Agreement | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agreementToDelete, setAgreementToDelete] = useState<Agreement | null>(null);
  const [formData, setFormData] = useState({
    agreement_type: "royalty",
    effective_date: "",
    expiration_date: "",
    royalty_rate: "",
    commission_rate: "",
    payment_period: "monthly",
    status: "active",
  });

  const createAgreement = useCreateAgreement();
  const updateAgreement = useUpdateAgreement();
  const deleteAgreement = useDeleteAgreement();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const agreementData = {
      agreement_type: formData.agreement_type,
      status: formData.status,
      effective_date: formData.effective_date,
      expiration_date: formData.expiration_date || null,
      royalty_rate: formData.royalty_rate ? parseFloat(formData.royalty_rate) : null,
      commission_rate: formData.commission_rate ? parseFloat(formData.commission_rate) : null,
      payment_period: formData.payment_period,
    };

    if (editingAgreement) {
      updateAgreement.mutate(
        { id: editingAgreement.id, updates: agreementData },
        {
          onSuccess: () => {
            setShowForm(false);
            setEditingAgreement(null);
            resetForm();
          },
        }
      );
    } else {
      createAgreement.mutate(
        { ...agreementData, partner_id: partnerId },
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
      agreement_type: "royalty",
      effective_date: "",
      expiration_date: "",
      royalty_rate: "",
      commission_rate: "",
      payment_period: "monthly",
      status: "active",
    });
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

  const handleOpenForm = (agreement?: Agreement) => {
    if (agreement) {
      setEditingAgreement(agreement);
      setFormData({
        agreement_type: agreement.agreement_type,
        effective_date: agreement.effective_date || "",
        expiration_date: agreement.expiration_date || "",
        commission_rate: agreement.commission_rate?.toString() || "",
        royalty_rate: agreement.royalty_rate?.toString() || "",
        payment_period: agreement.payment_period || "monthly",
        status: agreement.status,
      });
    } else {
      setEditingAgreement(null);
      resetForm();
    }
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setEditingAgreement(null);
    resetForm();
  };

  const handleDeleteClick = (agreement: Agreement, e: React.MouseEvent) => {
    e.stopPropagation();
    setAgreementToDelete(agreement);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (agreementToDelete) {
      deleteAgreement.mutate(agreementToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setAgreementToDelete(null);
        },
      });
    }
  };

  if (showForm) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-4 pb-20">
          <Button onClick={handleBack} variant="ghost" size="sm" className="mb-2">
            ← Back to Agreements
          </Button>
          <h3 className="text-lg font-medium">{editingAgreement ? "Edit Agreement" : "Add Agreement"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4" id="agreement-form">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agreement_type">Agreement Type *</Label>
              <Select
                value={formData.agreement_type}
                onValueChange={(value) => setFormData({ ...formData, agreement_type: value })}
              >
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
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="effective_date">Effective Date *</Label>
              <Input
                id="effective_date"
                type="date"
                value={formData.effective_date}
                onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiration_date">Expiration Date</Label>
              <Input
                id="expiration_date"
                type="date"
                value={formData.expiration_date}
                onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="royalty_rate">Royalty Rate (%)</Label>
              <Input
                id="royalty_rate"
                type="number"
                step="0.01"
                value={formData.royalty_rate}
                onChange={(e) => setFormData({ ...formData, royalty_rate: e.target.value })}
                placeholder="10.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission_rate">Commission Rate (%)</Label>
              <Input
                id="commission_rate"
                type="number"
                step="0.01"
                value={formData.commission_rate}
                onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })}
                placeholder="15.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_period">Payment Period</Label>
            <Select
              value={formData.payment_period}
              onValueChange={(value) => setFormData({ ...formData, payment_period: value })}
            >
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
          <Button type="submit" form="agreement-form" disabled={createAgreement.isPending || updateAgreement.isPending}>
            {editingAgreement ? "Update Agreement" : "Create Agreement"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Agreements ({agreements.length})</h3>
        <Button onClick={() => handleOpenForm()} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Agreement
        </Button>
      </div>

      {agreements.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No agreements yet. Click "Add Agreement" to create one.
        </p>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Effective Date</TableHead>
                <TableHead>Expiration Date</TableHead>
                <TableHead>Royalty Rate</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead>Payment Period</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agreements.map((agreement) => (
                <TableRow 
                  key={agreement.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleOpenForm(agreement)}
                >
                  <TableCell className="font-medium capitalize">{agreement.agreement_type}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(agreement.status)}>{agreement.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {agreement.effective_date ? new Date(agreement.effective_date).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {agreement.expiration_date ? new Date(agreement.expiration_date).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {agreement.royalty_rate ? `${agreement.royalty_rate}%` : '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {agreement.commission_rate ? `${agreement.commission_rate}%` : '-'}
                  </TableCell>
                  <TableCell className="text-sm capitalize">
                    {agreement.payment_period ? agreement.payment_period.replace('_', ' ') : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => handleDeleteClick(agreement, e)}
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
            <AlertDialogTitle>Delete Agreement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the "{agreementToDelete?.agreement_type}" agreement? This action cannot be undone.
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
