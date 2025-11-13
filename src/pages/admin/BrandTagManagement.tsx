import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePartnerById } from "@/hooks/usePartnerManagement";
import { BrandTagManager } from "@/components/brands/BrandTagManager";
import { Skeleton } from "@/components/ui/skeleton";
import { PartnerBreadcrumb } from "@/components/admin/PartnerBreadcrumb";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BrandTagManagement() {
  const { partnerId, brandId } = useParams<{ partnerId: string; brandId: string }>();
  const navigate = useNavigate();
  const { data: partner, isLoading } = usePartnerById(partnerId || null);

  const brand = partner?.brands?.find((b) => b.id === brandId);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!partner || !brand) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Brand not found</h2>
          <Button onClick={() => navigate("/admin/partners")}>
            Back to Partners
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/admin/partners/${partnerId}`)}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Partner
        </Button>

        <PartnerBreadcrumb
          segments={[
            { label: "Partners", href: "/admin/partners" },
            { label: partner.partner_name, href: `/admin/partners/${partnerId}` },
            { label: brand.brand_name, href: `/admin/partners/${partnerId}` },
            { label: "Tags" },
          ]}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {brand.logo_url && (
              <img
                src={brand.logo_url}
                alt={brand.brand_name}
                className="h-16 w-16 object-contain rounded"
              />
            )}
            <div>
              <CardTitle className="text-2xl">{brand.brand_name}</CardTitle>
              {brand.description && (
                <CardDescription className="mt-1">{brand.description}</CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BrandTagManager brandId={brandId!} brandName={brand.brand_name} />
        </CardContent>
      </Card>
    </div>
  );
}
