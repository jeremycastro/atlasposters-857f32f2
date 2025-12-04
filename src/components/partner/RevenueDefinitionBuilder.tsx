import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DollarSign, Truck, Receipt, RotateCcw, Percent } from "lucide-react";

export interface RevenueDefinition {
  exclude_shipping: boolean;
  exclude_taxes_vat: boolean;
  deduct_discounts: boolean;
  deduct_returns: boolean;
}

interface RevenueDefinitionBuilderProps {
  value: RevenueDefinition;
  onChange: (value: RevenueDefinition) => void;
}

const defaultRevenueDefinition: RevenueDefinition = {
  exclude_shipping: true,
  exclude_taxes_vat: true,
  deduct_discounts: true,
  deduct_returns: true,
};

export function RevenueDefinitionBuilder({ value, onChange }: RevenueDefinitionBuilderProps) {
  const settings = { ...defaultRevenueDefinition, ...value };

  const handleToggle = (key: keyof RevenueDefinition) => {
    onChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Revenue Definition
        </CardTitle>
        <CardDescription className="text-xs">
          Configure what components are included/excluded when calculating revenue for royalty payments.
          These settings align with Shopify order data structure.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Exclude Shipping */}
        <div className="flex items-center justify-between gap-4 py-2 border-b">
          <div className="flex items-start gap-3">
            <Truck className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div className="space-y-0.5">
              <Label htmlFor="exclude_shipping" className="text-sm font-medium cursor-pointer">
                Exclude Shipping Revenue
              </Label>
              <p className="text-xs text-muted-foreground">
                Do not include shipping charges in revenue calculations
              </p>
            </div>
          </div>
          <Switch
            id="exclude_shipping"
            checked={settings.exclude_shipping}
            onCheckedChange={() => handleToggle('exclude_shipping')}
          />
        </div>

        {/* Exclude Taxes/VAT */}
        <div className="flex items-center justify-between gap-4 py-2 border-b">
          <div className="flex items-start gap-3">
            <Receipt className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div className="space-y-0.5">
              <Label htmlFor="exclude_taxes_vat" className="text-sm font-medium cursor-pointer">
                Exclude Taxes/VAT
              </Label>
              <p className="text-xs text-muted-foreground">
                Do not include taxes or VAT in revenue calculations (recommended for international)
              </p>
            </div>
          </div>
          <Switch
            id="exclude_taxes_vat"
            checked={settings.exclude_taxes_vat}
            onCheckedChange={() => handleToggle('exclude_taxes_vat')}
          />
        </div>

        {/* Deduct Discounts */}
        <div className="flex items-center justify-between gap-4 py-2 border-b">
          <div className="flex items-start gap-3">
            <Percent className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div className="space-y-0.5">
              <Label htmlFor="deduct_discounts" className="text-sm font-medium cursor-pointer">
                Deduct Discounts
              </Label>
              <p className="text-xs text-muted-foreground">
                Subtract any discount codes or promotions from revenue
              </p>
            </div>
          </div>
          <Switch
            id="deduct_discounts"
            checked={settings.deduct_discounts}
            onCheckedChange={() => handleToggle('deduct_discounts')}
          />
        </div>

        {/* Deduct Returns */}
        <div className="flex items-center justify-between gap-4 py-2">
          <div className="flex items-start gap-3">
            <RotateCcw className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div className="space-y-0.5">
              <Label htmlFor="deduct_returns" className="text-sm font-medium cursor-pointer">
                Deduct Returns
              </Label>
              <p className="text-xs text-muted-foreground">
                Subtract refunded amounts from revenue calculations
              </p>
            </div>
          </div>
          <Switch
            id="deduct_returns"
            checked={settings.deduct_returns}
            onCheckedChange={() => handleToggle('deduct_returns')}
          />
        </div>

        {/* Summary */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs font-medium mb-1">Revenue Formula (Shopify-aligned):</p>
          <p className="text-xs text-muted-foreground font-mono">
            Revenue = subtotal_price
            {settings.exclude_shipping ? '' : ' + shipping'}
            {settings.exclude_taxes_vat ? '' : ' + taxes'}
            {settings.deduct_discounts ? ' - discounts' : ''}
            {settings.deduct_returns ? ' - refunds' : ''}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export { defaultRevenueDefinition };
