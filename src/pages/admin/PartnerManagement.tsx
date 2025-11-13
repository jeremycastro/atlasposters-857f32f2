import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePartners, usePartnerStats } from "@/hooks/usePartnerManagement";
import { CreatePartnerDialog } from "@/components/partner/CreatePartnerDialog";
import { Plus, Search, Building2, Users, FileText, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PartnerManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: partners, isLoading } = usePartners();
  const { data: stats } = usePartnerStats();

  const filteredPartners = partners?.filter((partner) => {
    const query = searchQuery.toLowerCase();
    // Search partner name
    if (partner.partner_name.toLowerCase().includes(query)) return true;
    // Search brand names
    if (partner.brands?.some(brand => 
      brand.brand_name.toLowerCase().includes(query)
    )) return true;
    return false;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "inactive": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "suspended": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Partner Management</h1>
          <p className="text-muted-foreground">Manage partners, brands, agreements, and contacts</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Partner
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPartners || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activePartners || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBrands || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeBrands || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agreements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeAgreements || 0}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {partners?.reduce((acc, p) => acc + (p.partner_contacts?.length || 0), 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Total contacts</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search partners and brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Partners Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners?.map((partner) => (
            <Card
              key={partner.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => navigate(`/admin/partners/${partner.id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{partner.partner_name}</CardTitle>
                    {partner.website_url && (
                      <CardDescription className="truncate">
                        {partner.website_url}
                      </CardDescription>
                    )}
                  </div>
                  <Badge className={getStatusColor(partner.status)}>
                    {partner.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Brands:</span>
                    <span className="font-medium">{partner.brands?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contacts:</span>
                    <span className="font-medium">{partner.partner_contacts?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Agreements:</span>
                    <span className="font-medium">{partner.partner_agreements?.length || 0}</span>
                  </div>
                  {partner.atlas_manager && (
                    <div className="pt-2 border-t">
                      <span className="text-muted-foreground text-xs">Manager:</span>
                      <p className="text-xs font-medium">{partner.atlas_manager.full_name}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredPartners?.length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No partners found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search" : "Get started by creating your first partner"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Partner
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <CreatePartnerDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  );
}
