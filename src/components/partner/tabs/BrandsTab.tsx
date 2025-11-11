import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useCreateBrand } from "@/hooks/usePartnerMutations";
import { Plus } from "lucide-react";
import { useState } from "react";

export const BrandsTab = ({ partnerId, brands }: { partnerId: string; brands: any[] }) => {
  const [showForm, setShowForm] = useState(false);
  const createBrand = useCreateBrand();

  const [formData, setFormData] = useState({
    brand_name: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBrand.mutate(
      {
        partner_id: partnerId,
        ...formData,
      },
      {
        onSuccess: () => {
          setShowForm(false);
          setFormData({ brand_name: "", description: "" });
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Brands ({brands.length})</h3>
        <Button onClick={() => setShowForm(!showForm)} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Brand Name *</Label>
                <Input
                  value={formData.brand_name}
                  onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createBrand.isPending}>
                  {createBrand.isPending ? "Creating..." : "Create Brand"}
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
        {brands.map((brand) => (
          <Card key={brand.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{brand.brand_name}</h4>
                  {brand.description && (
                    <p className="text-sm text-muted-foreground mt-1">{brand.description}</p>
                  )}
                  {brand.artworks && brand.artworks.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {brand.artworks.length} artwork{brand.artworks.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <Badge variant={brand.is_active ? "default" : "secondary"}>
                  {brand.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {brands.length === 0 && !showForm && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No brands yet. Add one to get started.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
