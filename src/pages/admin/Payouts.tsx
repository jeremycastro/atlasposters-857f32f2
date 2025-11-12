import { useState } from 'react';
import { usePartners } from '@/hooks/usePartnerManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, DollarSign, TrendingUp, Calculator } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const paymentModelLabels = {
  royalty_profit: 'Royalty on Profit',
  royalty_revenue: 'Royalty on Revenue',
  flat_fee: 'Flat Fee',
  advance: 'Advance + Royalty',
};

const paymentModelColors = {
  royalty_profit: 'default',
  royalty_revenue: 'secondary',
  flat_fee: 'outline',
  advance: 'destructive',
} as const;

export default function Payouts() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: partners, isLoading } = usePartners();

  const filteredPartners = partners?.filter(partner =>
    partner.partner_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate summary stats
  const totalAgreements = filteredPartners?.reduce(
    (sum, p) => sum + (p.partner_agreements?.length || 0),
    0
  ) || 0;

  const agreementsByModel = filteredPartners?.reduce((acc, partner) => {
    partner.partner_agreements?.forEach(agreement => {
      if (agreement.payment_model) {
        acc[agreement.payment_model] = (acc[agreement.payment_model] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Partner Payouts</h1>
        <p className="text-muted-foreground">
          Manage partner payment models, view agreement terms, and track payout calculations
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPartners?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active partnerships</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agreements</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgreements}</div>
            <p className="text-xs text-muted-foreground">Payment structures</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Royalty Models</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(agreementsByModel.royalty_profit || 0) + (agreementsByModel.royalty_revenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {agreementsByModel.royalty_profit || 0} profit / {agreementsByModel.royalty_revenue || 0} revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fixed Models</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(agreementsByModel.flat_fee || 0) + (agreementsByModel.advance || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {agreementsByModel.flat_fee || 0} flat / {agreementsByModel.advance || 0} advance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search partners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Partners & Agreements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Partner Payment Structures</CardTitle>
          <CardDescription>
            View and manage payment models for each partner agreement
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredPartners && filteredPartners.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Agreement Type</TableHead>
                  <TableHead>Payment Model</TableHead>
                  <TableHead>Rate/Amount</TableHead>
                  <TableHead>Marketing Cap</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dates</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map(partner => (
                  partner.partner_agreements && partner.partner_agreements.length > 0 ? (
                    partner.partner_agreements.map((agreement, idx) => (
                      <TableRow key={`${partner.id}-${idx}`}>
                        <TableCell className="font-medium">
                          {partner.partner_name}
                          {partner.partner_agreements!.length > 1 && (
                            <span className="text-xs text-muted-foreground ml-2">
                              ({idx + 1} of {partner.partner_agreements!.length})
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{agreement.agreement_type || 'N/A'}</TableCell>
                        <TableCell>
                          {agreement.payment_model ? (
                            <Badge variant={paymentModelColors[agreement.payment_model]}>
                              {paymentModelLabels[agreement.payment_model]}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">Not set</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {agreement.payment_model === 'royalty_profit' || agreement.payment_model === 'royalty_revenue' ? (
                            <span>{agreement.royalty_rate || agreement.commission_rate || 0}%</span>
                          ) : agreement.payment_model === 'flat_fee' ? (
                            <span>${agreement.flat_fee_amount?.toLocaleString() || 0}</span>
                          ) : agreement.payment_model === 'advance' ? (
                            <div className="space-y-1">
                              <div className="text-sm">${agreement.advance_amount?.toLocaleString() || 0}</div>
                              <div className="text-xs text-muted-foreground">
                                Recoup: {agreement.advance_recoupment_rate || 0}%
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {agreement.marketing_attribution_cap_percent ? (
                            <span className="text-sm">{agreement.marketing_attribution_cap_percent}%</span>
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={agreement.status === 'active' ? 'default' : 'secondary'}>
                            {agreement.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1">
                            <div>Start: {new Date(agreement.effective_date).toLocaleDateString()}</div>
                            {agreement.expiration_date && (
                              <div className="text-muted-foreground">
                                End: {new Date(agreement.expiration_date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">{partner.partner_name}</TableCell>
                      <TableCell colSpan={6} className="text-muted-foreground text-center">
                        No agreements configured
                      </TableCell>
                    </TableRow>
                  )
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No partners found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Box */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">About Payment Models</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            <strong>Royalty on Profit:</strong> Partner receives a percentage of final profit after all costs and marketing attribution
          </p>
          <p>
            <strong>Royalty on Revenue:</strong> Partner receives a percentage of net revenue (after discounts)
          </p>
          <p>
            <strong>Flat Fee:</strong> Partner receives a fixed payment per period regardless of sales
          </p>
          <p>
            <strong>Advance + Royalty:</strong> Partner receives upfront advance, then royalty payments after advance is recouped
          </p>
          <p className="pt-2 border-t">
            <strong>Marketing Cap:</strong> Limits the amount of marketing costs attributed to profit calculations. 
            Excess marketing costs are absorbed by Atlas.
          </p>
        </CardContent>
      </Card>

      {/* Future Feature Notice */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Coming Soon: Milestone 1.21b</CardTitle>
          <CardDescription>
            Sales tracking, payment calculations, and reporting dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>• Record sales and calculate payments based on these models</p>
          <p>• Track marketing attribution and apply caps automatically</p>
          <p>• Generate payment reports for each partner</p>
          <p>• Financial analytics by Partner, Brand, Artwork, Product, and Product Type</p>
          <p>• Export reports to PDF and Excel</p>
        </CardContent>
      </Card>
    </div>
  );
}
