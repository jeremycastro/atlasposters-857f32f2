# Partner Payment Models & Profit Calculation Guide

**Version:** v0.4.1  
**Last Updated:** 2025-11-12  
**Status:** Foundation Complete (Sub-Milestone 1.21a)

---

## Overview

This guide documents the partner payment model structure and profit calculation methodology for Atlas platform. The system supports four payment models and includes marketing attribution cap logic to protect Atlas while incentivizing partners.

---

## Payment Models

### 1. Royalty on Profit (royalty_profit)

**Description:** Partner receives a percentage of the final profit after all costs (including capped marketing attribution) are deducted.

**Use Case:** Ideal for partners who want to share both upside and risk. Aligns partner interests with profitability.

**Required Fields:**
- `royalty_rate`: Percentage of profit (0-100%)
- `marketing_attribution_cap_percent`: Cap on marketing deduction

**Calculation:**
```
Final Profit = Net Revenue - Direct Costs - Attributed Marketing
Partner Payment = Final Profit × (royalty_rate / 100)
```

**Example:**
- Net Revenue: £40,000
- COGS + Fees: £21,600
- Ad Spend: £8,000 (capped at £10,000 @ 25%)
- Profit Before Marketing: £18,400
- Final Profit: £18,400 - £8,000 = £10,400
- Payment @ 50%: £5,200

---

### 2. Royalty on Revenue (royalty_revenue)

**Description:** Partner receives a percentage of net revenue, regardless of costs or profitability.

**Use Case:** Suitable for partners who want predictable payments based on sales volume. Atlas bears all cost risk.

**Required Fields:**
- `royalty_rate`: Percentage of revenue (0-100%)

**Calculation:**
```
Net Revenue = Gross Revenue - Discounts
Partner Payment = Net Revenue × (royalty_rate / 100)
```

**Example:**
- Gross Revenue: £40,000
- Discounts: £0
- Net Revenue: £40,000
- Payment @ 10%: £4,000

**⚠️ Note:** Marketing attribution cap does NOT affect revenue-based royalties.

---

### 3. Flat Fee (flat_fee)

**Description:** Partner receives a fixed amount per period, regardless of sales or costs.

**Use Case:** Best for guaranteed income scenarios or retainer-style agreements.

**Required Fields:**
- `flat_fee_amount`: Fixed payment amount
- `payment_period`: Frequency (monthly, quarterly, annually)

**Calculation:**
```
Partner Payment = flat_fee_amount (per period)
```

**Example:**
- Flat Fee: £5,000/month
- Payment: £5,000 (monthly)

---

### 4. Advance with Recoupment (advance)

**Description:** Partner receives upfront payment, which is then recouped from future earnings before regular payments begin.

**Use Case:** Provides working capital to partners while ensuring recoupment from sales.

**Required Fields:**
- `advance_amount`: Initial upfront payment
- `advance_recoupment_rate`: Percentage of earnings used for recoupment (0-100%)

**Calculation:**
```
Earned = Final Profit × (advance_recoupment_rate / 100)

IF advance_balance > 0:
  Recouped = MIN(Earned, advance_balance)
  Partner Payment = 0
  advance_balance -= Recouped
ELSE:
  Partner Payment = Earned
```

**Example:**
- Advance: £10,000
- Recoupment Rate: 50%
- Month 1 Profit: £6,000
  - Earned: £3,000 (50% of £6,000)
  - Recouped: £3,000
  - Payment: £0
  - Balance: £7,000

---

## Marketing Attribution Cap

### Purpose

The marketing attribution cap protects Atlas from absorbing excessive marketing costs while still allowing for strategic ad spend. It creates a balanced risk-sharing model.

### How It Works

```
Marketing Cap Amount = Net Revenue × (marketing_attribution_cap_percent / 100)

Actual Ad Spend = Total marketing spend for period
Attributed Marketing = MIN(Actual Ad Spend, Marketing Cap Amount)
Marketing Absorbed by Atlas = Actual Ad Spend - Attributed Marketing
```

### Recommended Ranges

| Cap % | Use Case | Risk Profile |
|-------|----------|--------------|
| 7.5-10% | Conservative, low-margin products | Low risk to partner |
| 15-20% | Moderate, standard products | Balanced |
| 25-30% | Aggressive growth, high-margin | Higher risk, higher reward |
| 30%+ | Strategic launches | Atlas absorbs most marketing |

### Example Scenarios

**Scenario 1: Cap Not Hit (25% cap, £8k spend on £40k revenue)**
```
Marketing Cap: £40,000 × 0.25 = £10,000
Actual Spend: £8,000
Attributed: £8,000 (within cap)
Atlas Absorbs: £0
✅ System works as intended
```

**Scenario 2: Cap Hit (7.5% cap, £8k spend on £40k revenue)**
```
Marketing Cap: £40,000 × 0.075 = £3,000
Actual Spend: £8,000
Attributed: £3,000 (capped)
Atlas Absorbs: £5,000
⚠️ Atlas takes marketing loss to protect partner profit
```

---

## Profit Calculation Formula

### Complete Calculation Flow

```
1. Calculate Net Revenue:
   net_revenue = SUM(gross_revenue) - SUM(discounts_applied)

2. Calculate Direct Costs:
   direct_costs = SUM(cogs) + SUM(transaction_fees)
   
   Note: Shipping is EXCLUDED from calculations

3. Calculate Profit Before Marketing:
   profit_before_marketing = net_revenue - direct_costs

4. Apply Marketing Attribution (WITH CAP):
   marketing_cap_amount = net_revenue × (marketing_attribution_cap_percent / 100)
   actual_ad_spend = SUM(marketing_attribution.total_ad_spend) for period
   attributed_marketing = MIN(actual_ad_spend, marketing_cap_amount)
   marketing_absorbed_by_atlas = actual_ad_spend - attributed_marketing

5. Calculate Final Profit:
   total_profit = profit_before_marketing - attributed_marketing

6. Calculate Payment (based on payment_model):
   See individual payment model sections above
```

---

## What's Included / Excluded

### ✅ Included in Calculations

- **Revenue:**
  - Product sales (gross revenue)
  - After discounts (net revenue)

- **Costs:**
  - COGS (Cost of Goods Sold)
  - Transaction fees (payment processing, platform fees)
  - Marketing attribution (capped)

### ❌ Excluded from Calculations

- **Shipping:**
  - Shipping revenue
  - Shipping costs
  - Tracked separately, not part of profit share

- **Returns/Refunds:**
  - Will be handled as negative revenue entries (future implementation)

---

## Database Schema

### partner_agreements Table

```sql
-- Core fields
payment_model               enum (royalty_profit, royalty_revenue, flat_fee, advance)
status                      text (draft, active, expired, terminated)
effective_date              date (required)
expiration_date             date (optional)

-- Royalty-based fields
royalty_rate                numeric (0-100, required for royalty models)
commission_rate             numeric (0-100, legacy field)

-- Flat fee fields
flat_fee_amount             numeric (required for flat_fee model)

-- Advance fields
advance_amount              numeric (required for advance model)
advance_balance             numeric (auto-calculated remaining balance)
advance_recoupment_rate     numeric (0-100, required for advance model)

-- Profit calculation
marketing_attribution_cap_percent  numeric (0-100, recommended field)
calculation_basis           text (free-form description)
payment_period              text (monthly, quarterly, annually, per_transaction)
```

---

## Agreement Templates

### Template 1: Standard Profit Share (50/50)

```
Payment Model: Royalty on Profit
Royalty Rate: 50%
Marketing Cap: 25%
Payment Period: Monthly
Calculation Basis: Net revenue minus COGS, transaction fees, and capped marketing attribution
```

### Template 2: Revenue Share (Low Risk)

```
Payment Model: Royalty on Revenue
Royalty Rate: 10%
Payment Period: Monthly
Calculation Basis: Net revenue after discounts
```

### Template 3: Artist Advance

```
Payment Model: Advance with Recoupment
Advance Amount: £10,000
Recoupment Rate: 50%
Payment Period: Monthly
Calculation Basis: 50% of profit used to recoup advance, then regular profit share begins
```

---

## Validation Rules

### Agreement Creation

1. **Payment Model Selection:**
   - If `royalty_profit` or `royalty_revenue`: `royalty_rate` required (0-100)
   - If `flat_fee`: `flat_fee_amount` required (>0)
   - If `advance`: `advance_amount` and `advance_recoupment_rate` required (>0, 0-100)

2. **Date Validation:**
   - `effective_date` is required
   - `expiration_date` must be after `effective_date` (if provided)

3. **Rate Validation:**
   - All percentage fields: 0-100 range
   - `marketing_attribution_cap_percent`: Recommended 15-30%

### Marketing Attribution

1. **Period Validation:**
   - `period_end` must be after `period_start`
   - No overlapping periods for same partner/brand

2. **Amount Validation:**
   - `total_ad_spend` >= 0
   - Must link to active partner

---

## Troubleshooting

### Issue: Payment calculation seems incorrect

**Check:**
1. Verify marketing attribution cap is set correctly
2. Confirm all sales data has accurate COGS and transaction fees
3. Check if marketing spend exceeds cap (Atlas absorbs excess)
4. Ensure payment_model matches partner's agreement

### Issue: Marketing absorbed by Atlas is too high

**Solution:**
1. Increase marketing_attribution_cap_percent
2. Review ad spend efficiency
3. Consider switching to revenue-based model (no cap)

### Issue: Advance not recouping

**Check:**
1. Verify `advance_recoupment_rate` is set correctly
2. Confirm sales are generating positive profit
3. Check `advance_balance` is being updated after each calculation

---

## Future Enhancements (Sub-Milestone 1.21b)

The following features are planned for Phase 2 implementation:

1. **Sales Tracking:**
   - `partner_sales` table with detailed cost breakdown
   - Manual entry and CSV import
   - Shopify webhook integration

2. **Marketing Attribution:**
   - `marketing_attribution` table for ad spend tracking
   - Platform-specific tracking (Meta, Google, TikTok)
   - Monthly attribution management UI

3. **Payment Calculations:**
   - `partner_payment_calculations` table
   - Automated calculation engine
   - Payment report generation
   - Partner-facing reports

4. **Analytics:**
   - Profitability by Partner/Brand/Artwork/Product/Product Type
   - Marketing efficiency reports
   - Financial dashboard

---

## Version History

- **v0.4.1** - Sub-Milestone 1.21a Complete
  - Added payment_model enum to partner_agreements
  - Implemented conditional form fields in UI
  - Created calculation preview in agreement form
  - Documented all payment models and calculation logic

---

## Support

For questions about payment model implementation or profit calculations:
- Review this guide thoroughly
- Check database constraints and validation rules
- Test calculations with example scenarios above
- Refer to UI tooltips and help text in agreement forms