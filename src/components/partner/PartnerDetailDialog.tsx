import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePartnerById } from "@/hooks/usePartnerManagement";
import { PartnerInfoTab } from "./tabs/PartnerInfoTab";
import { BrandsTab } from "./tabs/BrandsTab";
import { AgreementsTab } from "./tabs/AgreementsTab";
import { ContactsTab } from "./tabs/ContactsTab";
import { AddressesTab } from "./tabs/AddressesTab";
import { Skeleton } from "@/components/ui/skeleton";

interface PartnerDetailDialogProps {
  partnerId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PartnerDetailDialog = ({ partnerId, open, onOpenChange }: PartnerDetailDialogProps) => {
  const { data: partner, isLoading } = usePartnerById(partnerId);

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </DialogContent>
      </Dialog>
    );
  }

  if (!partner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{partner.partner_name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full flex flex-col flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-5 flex-shrink-0">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="brands">Brands</TabsTrigger>
            <TabsTrigger value="agreements">Agreements</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="info" className="h-full">
              <PartnerInfoTab partner={partner} />
            </TabsContent>

            <TabsContent value="brands" className="h-full">
              <BrandsTab partnerId={partner.id} brands={partner.brands || []} />
            </TabsContent>

            <TabsContent value="agreements" className="h-full">
              <AgreementsTab partnerId={partner.id} agreements={partner.partner_agreements || []} />
            </TabsContent>

            <TabsContent value="contacts" className="h-full">
              <ContactsTab partnerId={partner.id} contacts={partner.partner_contacts || []} />
            </TabsContent>

            <TabsContent value="addresses" className="h-full">
              <AddressesTab partnerId={partner.id} addresses={partner.partner_addresses || []} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
