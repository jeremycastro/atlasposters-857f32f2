import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, FileText, Info } from "lucide-react";
import { useCreateAgreement, useUpdateAgreement, useDeleteAgreement } from "@/hooks/usePartnerMutations";
import { AgreementDocumentUpload } from "@/components/partner/AgreementDocumentUpload";

interface Agreement {
  id: string;
  agreement_type: string;
  status: string;
  effective_date?: string;
  expiration_date?: string;
  royalty_rate?: number;
  commission_rate?: number;
  payment_period?: string;
  payment_model?: string;
  flat_fee_amount?: number;
  advance_amount?: number;
  advance_balance?: number;
  advance_recoupment_rate?: number;
  marketing_attribution_cap_percent?: number;
  calculation_basis?: string;
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
    payment_model: "",
    flat_fee_amount: "",
    advance_amount: "",
    advance_recoupment_rate: "",
    marketing_attribution_cap_percent: "",
    calculation_basis: "",
  });

  const createAgreement = useCreateAgreement();
  const updateAgreement = useUpdateAgreement();
  const deleteAgreement = useDeleteAgreement();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const agreementData: any = {
      agreement_type: formData.agreement_type,
      status: formData.status,
      effective_date: formData.effective_date,
      expiration_date: formData.expiration_date || null,
      royalty_rate: formData.royalty_rate ? parseFloat(formData.royalty_rate) : null,
      commission_rate: formData.commission_rate ? parseFloat(formData.commission_rate) : null,
      payment_period: formData.payment_period,
      payment_model: formData.payment_model || null,
      flat_fee_amount: formData.flat_fee_amount ? parseFloat(formData.flat_fee_amount) : null,
      advance_amount: formData.advance_amount ? parseFloat(formData.advance_amount) : null,
      advance_recoupment_rate: formData.advance_recoupment_rate ? parseFloat(formData.advance_recoupment_rate) : null,
      marketing_attribution_cap_percent: formData.marketing_attribution_cap_percent ? parseFloat(formData.marketing_attribution_cap_percent) : null,
      calculation_basis: formData.calculation_basis || null,
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
      payment_model: "",
      flat_fee_amount: "",
      advance_amount: "",
      advance_recoupment_rate: "",
      marketing_attribution_cap_percent: "",
      calculation_basis: "",
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
        payment_model: agreement.payment_model || "",
        flat_fee_amount: agreement.flat_fee_amount?.toString() || "",
        advance_amount: agreement.advance_amount?.toString() || "",
        advance_recoupment_rate: agreement.advance_recoupment_rate?.toString() || "",
        marketing_attribution_cap_percent: agreement.marketing_attribution_cap_percent?.toString() || "",
        calculation_basis: agreement.calculation_basis || "",
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

  // Calculate preview based on example values
  const getCalculationPreview = () => {
    const model = formData.payment_model;
    const rate = parseFloat(formData.royalty_rate) || 0;
    const cap = parseFloat(formData.marketing_attribution_cap_percent) || 25;
    
    // Example values
    const exampleRevenue = 40000;
    const exampleCOGS = 20000;
    const exampleFees = 1600;
    const exampleAdSpend = 8000;
    
    const netRevenue = exampleRevenue;
    const directCosts = exampleCOGS + exampleFees;
    const profitBeforeMarketing = netRevenue - directCosts;
    const marketingCap = netRevenue * (cap / 100);
    const attributedMarketing = Math.min(exampleAdSpend, marketingCap);
    const finalProfit = profitBeforeMarketing - attributedMarketing;
    
    let payment = 0;
    if (model === 'royalty_profit') {
      payment = finalProfit * (rate / 100);
    } else if (model === 'royalty_revenue') {
      payment = netRevenue * (rate / 100);
    } else if (model === 'flat_fee' && formData.flat_fee_amount) {
      payment = parseFloat(formData.flat_fee_amount);
    }
    
    return {
      netRevenue,
      directCosts,
      profitBeforeMarketing,
      marketingCap,
      attributedMarketing,
      atlasAbsorbs: exampleAdSpend - attributedMarketing,
      finalProfit,
      payment,
      split: payment / 2,
    };
  };

  if (showForm) {
    const preview = getCalculationPreview();
    
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-6 pb-20">
          <Button onClick={handleBack} variant="ghost" size="sm" className="mb-2">
            ← Back to Agreements
          </Button>
          <h3 className="text-lg font-medium">{editingAgreement ? "Edit Agreement" : "Add Agreement"}</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6" id="agreement-form">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Basic Information</h4>
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
            </div>

            {/* Payment Model */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Payment Model</h4>
              <div className="space-y-2">
                <Label htmlFor="payment_model">Payment Model</Label>
                <Select
                  value={formData.payment_model}
                  onValueChange={(value) => setFormData({ ...formData, payment_model: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment model..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="royalty_profit">Royalty on Profit</SelectItem>
                    <SelectItem value="royalty_revenue">Royalty on Revenue</SelectItem>
                    <SelectItem value="flat_fee">Flat Fee</SelectItem>
                    <SelectItem value="advance">Advance with Recoupment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional fields based on payment model */}
              {(formData.payment_model === 'royalty_profit' || formData.payment_model === 'royalty_revenue') && (
                <div className="space-y-2">
                  <Label htmlFor="royalty_rate">Royalty Rate (%) *</Label>
                  <Input
                    id="royalty_rate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.royalty_rate}
                    onChange={(e) => setFormData({ ...formData, royalty_rate: e.target.value })}
                    placeholder="50.00"
                    required={formData.payment_model === 'royalty_profit' || formData.payment_model === 'royalty_revenue'}
                  />
                </div>
              )}

              {formData.payment_model === 'flat_fee' && (
                <div className="space-y-2">
                  <Label htmlFor="flat_fee_amount">Flat Fee Amount (£) *</Label>
                  <Input
                    id="flat_fee_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.flat_fee_amount}
                    onChange={(e) => setFormData({ ...formData, flat_fee_amount: e.target.value })}
                    placeholder="5000.00"
                    required={formData.payment_model === 'flat_fee'}
                  />
                </div>
              )}

              {formData.payment_model === 'advance' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="advance_amount">Advance Amount (£) *</Label>
                    <Input
                      id="advance_amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.advance_amount}
                      onChange={(e) => setFormData({ ...formData, advance_amount: e.target.value })}
                      placeholder="10000.00"
                      required={formData.payment_model === 'advance'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="advance_recoupment_rate">Recoupment Rate (%) *</Label>
                    <Input
                      id="advance_recoupment_rate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.advance_recoupment_rate}
                      onChange={(e) => setFormData({ ...formData, advance_recoupment_rate: e.target.value })}
                      placeholder="50.00"
                      required={formData.payment_model === 'advance'}
                    />
                  </div>
                </div>
              )}

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
            </div>

            {/* Marketing Attribution Cap */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Profit Calculation Settings</h4>
              <div className="space-y-2">
                <Label htmlFor="marketing_attribution_cap_percent" className="flex items-center gap-2">
                  Marketing Attribution Cap (%)
                  <Info className="h-3 w-3 text-muted-foreground" />
                </Label>
                <Input
                  id="marketing_attribution_cap_percent"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.marketing_attribution_cap_percent}
                  onChange={(e) => setFormData({ ...formData, marketing_attribution_cap_percent: e.target.value })}
                  placeholder="25.0"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum % of net revenue that can be deducted for marketing costs in profit calculations. Recommended: 15-30%
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="calculation_basis">Calculation Basis</Label>
                <Textarea
                  id="calculation_basis"
                  value={formData.calculation_basis}
                  onChange={(e) => setFormData({ ...formData, calculation_basis: e.target.value })}
                  placeholder="Describe what counts as revenue/profit for this agreement..."
                  rows={3}
                />
              </div>
            </div>

            {/* Legacy fields */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Legacy Fields (Optional)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commission_rate">Commission Rate (%)</Label>
                  <Input
                    id="commission_rate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.commission_rate}
                    onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })}
                    placeholder="15.00"
                  />
                </div>
              </div>
            </div>

            {/* Calculation Preview */}
            {formData.payment_model && formData.marketing_attribution_cap_percent && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm">Calculation Preview</CardTitle>
                  <CardDescription className="text-xs">
                    Example with £40,000 revenue, £20,000 COGS, £1,600 fees, £8,000 ad spend
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Net Revenue:</span>
                    <span className="font-medium">£{preview.netRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Direct Costs:</span>
                    <span className="font-medium">£{preview.directCosts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profit Before Marketing:</span>
                    <span className="font-medium">£{preview.profitBeforeMarketing.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Marketing Cap ({formData.marketing_attribution_cap_percent}%):</span>
                    <span className="font-medium">£{preview.marketingCap.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Attributed Marketing:</span>
                    <span className="font-medium">£{preview.attributedMarketing.toLocaleString()}</span>
                  </div>
                  {preview.atlasAbsorbs > 0 && (
                    <div className="flex justify-between text-orange-500">
                      <span>Atlas Absorbs:</span>
                      <span className="font-medium">£{preview.atlasAbsorbs.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Final Profit:</span>
                    <span>£{preview.finalProfit.toLocaleString()}</span>
                  </div>
                  {formData.payment_model !== 'flat_fee' && (
                    <>
                      <div className="flex justify-between text-primary">
                        <span>Calculated Payment:</span>
                        <span className="font-medium">£{preview.payment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Split (50/50):</span>
                        <span>£{preview.split.toLocaleString()} each</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Agreement Documents */}
            {editingAgreement && (
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Agreement Documents
                </h4>
                <AgreementDocumentUpload agreementId={editingAgreement.id} />
              </div>
            )}
            {!editingAgreement && (
              <p className="text-sm text-muted-foreground">
                Save the agreement first to upload documents
              </p>
            )}
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
                <TableHead>Payment Model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Effective Date</TableHead>
                <TableHead>Rate/Amount</TableHead>
                <TableHead>Marketing Cap</TableHead>
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
                  <TableCell className="text-sm">
                    {agreement.payment_model ? (
                      <Badge variant="outline" className="capitalize">
                        {agreement.payment_model.replace('_', ' ')}
                      </Badge>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(agreement.status)}>{agreement.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {agreement.effective_date ? new Date(agreement.effective_date).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {agreement.royalty_rate ? `${agreement.royalty_rate}%` : 
                     agreement.flat_fee_amount ? `£${agreement.flat_fee_amount.toLocaleString()}` :
                     agreement.advance_amount ? `£${agreement.advance_amount.toLocaleString()} adv` : '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {agreement.marketing_attribution_cap_percent ? `${agreement.marketing_attribution_cap_percent}%` : '-'}
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