import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useCreateBrand, useUpdateBrand } from "@/hooks/usePartnerMutations";
import { Plus, Edit, Save, X, Palette, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { Brand } from "@/types/partner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BrandLogoUpload } from "@/components/partner/BrandLogoUpload";

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
  <form onSubmit={onSubmit} className="space-y-6">
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

    {/* Visual Identity */}
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
        <Palette className="h-4 w-4" />
        Visual Identity
      </h4>
      <div className="space-y-2">
        <Label>Brand Logos</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Upload multiple logo variations. Set one as the primary brand logo.
        </p>
        {/* We'll only show this upload section when editing an existing brand */}
        {formData.brand_name && (
          <div className="text-sm text-muted-foreground italic">
            Logo upload will be available after creating the brand
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label>Logo URL (Optional)</Label>
        <Input
          type="url"
          value={formData.logo_url}
          onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
          placeholder="https://example.com/logo.png or leave empty to upload"
        />
        {formData.logo_url && (
          <div className="mt-2 p-4 border rounded-md bg-muted/30">
            <img src={formData.logo_url} alt="Brand logo preview" className="h-16 object-contain" />
          </div>
        )}
      </div>
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

    <div className="flex gap-2">
      <Button type="submit" disabled={isSubmitting}>
        <Save className="h-4 w-4 mr-2" />
        {submitLabel}
      </Button>
      <Button type="button" variant="outline" onClick={onCancel}>
        <X className="h-4 w-4 mr-2" />
        Cancel
      </Button>
    </div>
  </form>
);

export const BrandsTab = ({ partnerId, brands }: { partnerId: string; brands: Brand[] }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
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
    setExpandedId(brand.id);
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
          <CardContent>
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

      <div className="grid gap-4">
        {brands.map((brand) => (
          <Card key={brand.id}>
            <Collapsible
              open={expandedId === brand.id}
              onOpenChange={(open) => {
                setExpandedId(open ? brand.id : null);
                if (!open && editingId === brand.id) {
                  handleCancelEdit();
                }
              }}
            >
              <CardContent className="pt-6">
                <CollapsibleTrigger className="w-full">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-start flex-1 text-left">
                      {brand.logo_url && (
                        <img src={brand.logo_url} alt={brand.brand_name} className="h-12 w-12 object-contain rounded" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{brand.brand_name}</h4>
                          <Badge variant={brand.is_active ? "default" : "secondary"}>
                            {brand.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        {brand.tagline && (
                          <p className="text-sm text-muted-foreground italic mt-1">{brand.tagline}</p>
                        )}
                        {brand.description && (
                          <p className="text-sm text-muted-foreground mt-1">{brand.description}</p>
                        )}
                        {brand.artworks && brand.artworks.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {brand.artworks.length} artwork{brand.artworks.length !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-4 pt-4 border-t">
                  {editingId === brand.id ? (
                    <div className="space-y-6">
                      {/* Logo Upload Section */}
                      <div>
                        <Label className="mb-2 block">Brand Logos</Label>
                        <BrandLogoUpload 
                          brandId={brand.id} 
                          currentLogoUrl={brand.logo_url || undefined}
                          onLogoChange={(url) => {
                            setFormData({ ...formData, logo_url: url });
                          }}
                        />
                      </div>
                      
                      {/* Regular Form Fields */}
                      <BrandForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleUpdate(brand.id);
                        }}
                        onCancel={handleCancelEdit}
                        submitLabel="Save Changes"
                        isSubmitting={updateBrand.isPending}
                      />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Brand Identity */}
                      {(brand.primary_color || brand.secondary_color || brand.accent_color) && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">Brand Colors</h5>
                          <div className="flex gap-2">
                            {brand.primary_color && (
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded border" style={{ backgroundColor: brand.primary_color }} />
                                <span className="text-xs text-muted-foreground">{brand.primary_color}</span>
                              </div>
                            )}
                            {brand.secondary_color && (
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded border" style={{ backgroundColor: brand.secondary_color }} />
                                <span className="text-xs text-muted-foreground">{brand.secondary_color}</span>
                              </div>
                            )}
                            {brand.accent_color && (
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded border" style={{ backgroundColor: brand.accent_color }} />
                                <span className="text-xs text-muted-foreground">{brand.accent_color}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {brand.brand_story && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">Brand Story</h5>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{brand.brand_story}</p>
                        </div>
                      )}

                      {/* Links */}
                      {(brand.website_url || Object.values(brand.social_links || {}).some(v => v)) && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">Online Presence</h5>
                          <div className="space-y-2">
                            {brand.website_url && (
                              <a 
                                href={brand.website_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline flex items-center gap-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                {brand.website_url}
                              </a>
                            )}
                            {brand.social_links && (
                              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                {brand.social_links.instagram && (
                                  <span>Instagram: {brand.social_links.instagram}</span>
                                )}
                                {brand.social_links.facebook && (
                                  <span>Facebook: {brand.social_links.facebook}</span>
                                )}
                                {brand.social_links.twitter && (
                                  <span>Twitter: {brand.social_links.twitter}</span>
                                )}
                                {brand.social_links.linkedin && (
                                  <span>LinkedIn: {brand.social_links.linkedin}</span>
                                )}
                                {brand.social_links.pinterest && (
                                  <span>Pinterest: {brand.social_links.pinterest}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <Button onClick={() => handleEdit(brand)} variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Brand
                      </Button>
                    </div>
                  )}
                </CollapsibleContent>
              </CardContent>
            </Collapsible>
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
