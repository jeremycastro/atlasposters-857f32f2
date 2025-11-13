import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePartnerById } from "@/hooks/usePartnerManagement";
import { PartnerInfoTab } from "@/components/partner/tabs/PartnerInfoTab";
import { BrandsTab } from "@/components/partner/tabs/BrandsTab";
import { AgreementsTab } from "@/components/partner/tabs/AgreementsTab";
import { ContactsTab } from "@/components/partner/tabs/ContactsTab";
import { AddressesTab } from "@/components/partner/tabs/AddressesTab";
import { Skeleton } from "@/components/ui/skeleton";
import { PartnerBreadcrumb } from "@/components/admin/PartnerBreadcrumb";
import { ArrowLeft } from "lucide-react";

export default function PartnerDetail() {
  const { partnerId } = useParams<{ partnerId: string }>();
  const navigate = useNavigate();
  const { data: partner, isLoading } = usePartnerById(partnerId || null);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Partner not found</h2>
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
          onClick={() => navigate("/admin/partners")}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Partners
        </Button>

        <PartnerBreadcrumb
          segments={[
            { label: "Partners", href: "/admin/partners" },
            { label: partner.partner_name },
          ]}
        />

        <div>
          <h1 className="text-3xl font-bold">{partner.partner_name}</h1>
          {partner.website_url && (
            <a
              href={partner.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {partner.website_url}
            </a>
          )}
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="agreements">Agreements</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="info">
            <PartnerInfoTab partner={partner} />
          </TabsContent>

          <TabsContent value="brands">
            <BrandsTab partnerId={partner.id} brands={partner.brands || []} />
          </TabsContent>

          <TabsContent value="agreements">
            <AgreementsTab partnerId={partner.id} agreements={partner.partner_agreements || []} />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactsTab partnerId={partner.id} contacts={partner.partner_contacts || []} />
          </TabsContent>

          <TabsContent value="addresses">
            <AddressesTab partnerId={partner.id} addresses={partner.partner_addresses || []} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
