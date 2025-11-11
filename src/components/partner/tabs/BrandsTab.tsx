import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCreateBrand, useUpdateBrand } from "@/hooks/usePartnerMutations";
import { Plus, Edit, Save, X, Palette, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { Brand } from "@/types/partner";

interface BrandFormData {
  brand_name: string;
  description: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  tagline: string;
  brand_story: string;
  website_url: string;
  social_links: {
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    pinterest: string;
  };
}

interface BrandFormProps {
  formData: BrandFormData;
  setFormData: (data: BrandFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
  isSubmitting: boolean;
}

const BrandForm = ({ formData, setFormData, onSubmit, onCancel, submitLabel, isSubmitting }: BrandFormProps) => (
  <form onSubmit={onSubmit} className="flex flex-col h-full">
    <div className="flex-1 overflow-y-auto px-1 space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground">Basic Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Brand Name *</Label>
            <Input
              value={formData.brand_name}
              onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Short brand tagline"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            placeholder="Brief description"
          />
        </div>
        <div className="space-y-2">
          <Label>Brand Story</Label>
          <Textarea
            value={formData.brand_story}
            onChange={(e) => setFormData({ ...formData, brand_story: e.target.value })}
            rows={3}
            placeholder="Detailed brand story for landing pages"
          />
        </div>
      </div>

      {/* Brand Colors */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Brand Colors
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={formData.primary_color}
                onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                className="w-16 h-10 p-1"
              />
              <Input
                type="text"
                value={formData.primary_color}
                onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                placeholder="#000000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={formData.secondary_color}
                onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                className="w-16 h-10 p-1"
              />
              <Input
                type="text"
                value={formData.secondary_color}
                onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                placeholder="#666666"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={formData.accent_color}
                onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                className="w-16 h-10 p-1"
              />
              <Input
                type="text"
                value={formData.accent_color}
                onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                placeholder="#FF6B6B"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Online Presence */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          Online Presence
        </h4>
        <div className="space-y-2">
          <Label>Website URL</Label>
          <Input
            type="url"
            value={formData.website_url}
            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            placeholder="https://brand.com"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Instagram</Label>
            <Input
              value={formData.social_links.instagram}
              onChange={(e) => setFormData({ 
                ...formData, 
                social_links: { ...formData.social_links, instagram: e.target.value }
              })}
              placeholder="@brandname or full URL"
            />
          </div>
          <div className="space-y-2">
            <Label>Facebook</Label>
            <Input
              value={formData.social_links.facebook}
              onChange={(e) => setFormData({ 
                ...formData, 
                social_links: { ...formData.social_links, facebook: e.target.value }
              })}
              placeholder="facebook.com/brandname"
            />
          </div>
          <div className="space-y-2">
            <Label>Twitter/X</Label>
            <Input
              value={formData.social_links.twitter}
              onChange={(e) => setFormData({ 
                ...formData, 
                social_links: { ...formData.social_links, twitter: e.target.value }
              })}
              placeholder="@brandname"
            />
          </div>
          <div className="space-y-2">
            <Label>LinkedIn</Label>
            <Input
              value={formData.social_links.linkedin}
              onChange={(e) => setFormData({ 
                ...formData, 
                social_links: { ...formData.social_links, linkedin: e.target.value }
              })}
              placeholder="linkedin.com/company/brand"
            />
          </div>
          <div className="space-y-2">
            <Label>Pinterest</Label>
            <Input
              value={formData.social_links.pinterest}
              onChange={(e) => setFormData({ 
                ...formData, 
                social_links: { ...formData.social_links, pinterest: e.target.value }
              })}
              placeholder="pinterest.com/brandname"
            />
          </div>
        </div>
      </div>

      {/* Logo URL - Optional fallback */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Logo URL (Optional)
        </h4>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Provide a logo URL as an alternative, or upload files below after saving
          </p>
          <Input
            type="url"
            value={formData.logo_url}
            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
            placeholder="https://example.com/logo.png"
          />
          {formData.logo_url && (
            <div className="mt-2 p-4 border rounded-md bg-muted/30">
              <img src={formData.logo_url} alt="Brand logo preview" className="h-16 object-contain" />
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Sticky Footer with Buttons */}
    <div className="shrink-0 bg-background border-t px-6 py-4 flex justify-end gap-2 -mx-6 -mb-6">
      <Button type="button" size="sm" variant="outline" onClick={onCancel}>
        <X className="h-4 w-4 mr-2" />
        Cancel
      </Button>
      <Button type="submit" size="sm" disabled={isSubmitting}>
        <Save className="h-4 w-4 mr-2" />
        {submitLabel}
      </Button>
    </div>
  </form>
);

export const BrandsTab = ({ partnerId, brands }: { partnerId: string; brands: Brand[] }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();

  const [formData, setFormData] = useState<BrandFormData>({
    brand_name: "",
    description: "",
    logo_url: "",
    primary_color: "#000000",
    secondary_color: "#666666",
    accent_color: "#FF6B6B",
    tagline: "",
    brand_story: "",
    website_url: "",
    social_links: {
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: "",
      pinterest: "",
    },
  });

  const resetForm = () => {
    setFormData({
      brand_name: "",
      description: "",
      logo_url: "",
      primary_color: "#000000",
      secondary_color: "#666666",
      accent_color: "#FF6B6B",
      tagline: "",
      brand_story: "",
      website_url: "",
      social_links: {
        instagram: "",
        facebook: "",
        twitter: "",
        linkedin: "",
        pinterest: "",
      },
    });
  };

  const handleEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setFormData({
      brand_name: brand.brand_name,
      description: brand.description || "",
      logo_url: brand.logo_url || "",
      primary_color: brand.primary_color || "#000000",
      secondary_color: brand.secondary_color || "#666666",
      accent_color: brand.accent_color || "#FF6B6B",
      tagline: brand.tagline || "",
      brand_story: brand.brand_story || "",
      website_url: brand.website_url || "",
      social_links: {
        instagram: brand.social_links?.instagram || "",
        facebook: brand.social_links?.facebook || "",
        twitter: brand.social_links?.twitter || "",
        linkedin: brand.social_links?.linkedin || "",
        pinterest: brand.social_links?.pinterest || "",
      },
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

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
          resetForm();
        },
      }
    );
  };

  const handleUpdate = (brandId: string) => {
    updateBrand.mutate(
      {
        id: brandId,
        updates: formData,
      },
      {
        onSuccess: () => {
          setEditingId(null);
          resetForm();
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
          <CardHeader>
            <CardTitle>Create New Brand</CardTitle>
          </CardHeader>
          <CardContent className="h-[60vh] flex flex-col p-0">
            <BrandForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                resetForm();
              }}
              submitLabel="Create Brand"
              isSubmitting={createBrand.isPending}
            />
          </CardContent>
        </Card>
      )}

      {brands.length === 0 && !showForm ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No brands yet. Add one to get started.
          </CardContent>
        </Card>
      ) : brands.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tagline</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Artworks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow 
                  key={brand.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleEdit(brand)}
                >
                  <TableCell>
                    <div className="flex gap-3 items-center">
                      {brand.logo_url && (
                        <img src={brand.logo_url} alt={brand.brand_name} className="h-8 w-8 object-contain rounded" />
                      )}
                      <div>
                        <div className="font-medium">{brand.brand_name}</div>
                        {brand.description && (
                          <div className="text-xs text-muted-foreground line-clamp-1">{brand.description}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={brand.is_active ? "default" : "secondary"}>
                      {brand.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs">
                    {brand.tagline || "-"}
                  </TableCell>
                  <TableCell>
                    {brand.website_url ? (
                      <a 
                        href={brand.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3 w-3" />
                        Visit
                      </a>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {brand.artworks && brand.artworks.length > 0 ? brand.artworks.length : 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(brand);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}

      {/* Edit Dialog */}
      {editingId && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Brand</CardTitle>
          </CardHeader>
          <CardContent className="h-[60vh] flex flex-col p-0">
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Brand Name *</Label>
                      <Input
                        value={formData.brand_name}
                        onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tagline</Label>
                      <Input
                        value={formData.tagline}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        placeholder="Short brand tagline"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      placeholder="Brief description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Brand Story</Label>
                    <Textarea
                      value={formData.brand_story}
                      onChange={(e) => setFormData({ ...formData, brand_story: e.target.value })}
                      rows={3}
                      placeholder="Detailed brand story for landing pages"
                    />
                  </div>
                </div>

                {/* Brand Colors */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Brand Colors
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={formData.primary_color}
                          onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={formData.primary_color}
                          onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={formData.secondary_color}
                          onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={formData.secondary_color}
                          onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                          placeholder="#666666"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Accent Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={formData.accent_color}
                          onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={formData.accent_color}
                          onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                          placeholder="#FF6B6B"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Online Presence */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Online Presence
                  </h4>
                  <div className="space-y-2">
                    <Label>Website URL</Label>
                    <Input
                      type="url"
                      value={formData.website_url}
                      onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                      placeholder="https://brand.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Instagram</Label>
                      <Input
                        value={formData.social_links.instagram}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          social_links: { ...formData.social_links, instagram: e.target.value }
                        })}
                        placeholder="@brandname or full URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Facebook</Label>
                      <Input
                        value={formData.social_links.facebook}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          social_links: { ...formData.social_links, facebook: e.target.value }
                        })}
                        placeholder="facebook.com/brandname"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Twitter/X</Label>
                      <Input
                        value={formData.social_links.twitter}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          social_links: { ...formData.social_links, twitter: e.target.value }
                        })}
                        placeholder="@brandname"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>LinkedIn</Label>
                      <Input
                        value={formData.social_links.linkedin}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          social_links: { ...formData.social_links, linkedin: e.target.value }
                        })}
                        placeholder="linkedin.com/company/brand"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pinterest</Label>
                      <Input
                        value={formData.social_links.pinterest}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          social_links: { ...formData.social_links, pinterest: e.target.value }
                        })}
                        placeholder="pinterest.com/brandname"
                      />
                    </div>
                  </div>
                </div>

                {/* Logo URL */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Logo URL (Optional)
                  </h4>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Provide a logo URL as an alternative
                    </p>
                    <Input
                      type="url"
                      value={formData.logo_url}
                      onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                      placeholder="https://example.com/logo.png"
                    />
                    {formData.logo_url && (
                      <div className="mt-2 p-4 border rounded-md bg-muted/30">
                        <img src={formData.logo_url} alt="Brand logo preview" className="h-16 object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="shrink-0 bg-background border-t px-6 py-4 flex justify-end gap-2">
                <Button type="button" size="sm" variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="button" size="sm" onClick={() => handleUpdate(editingId)} disabled={updateBrand.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateBrand.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
