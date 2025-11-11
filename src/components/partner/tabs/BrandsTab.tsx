import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Plus, Edit, Palette, Save, X, Trash2 } from "lucide-react";
import { useCreateBrand, useUpdateBrand, useDeleteBrand } from "@/hooks/usePartnerMutations";
import { BrandLogoUpload } from "@/components/partner/BrandLogoUpload";
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
    figma: string;
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
  partnerId: string;
  brandId?: string;
}
const BrandForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  submitLabel,
  isSubmitting,
  partnerId,
  brandId
}: BrandFormProps) => <form onSubmit={onSubmit} className="space-y-6">
    {/* Basic Information */}
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-muted-foreground">Basic Information</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Brand Name *</Label>
          <Input value={formData.brand_name} onChange={e => setFormData({
          ...formData,
          brand_name: e.target.value
        })} required />
        </div>
        <div className="space-y-2">
          <Label>Tagline</Label>
          <Input value={formData.tagline} onChange={e => setFormData({
          ...formData,
          tagline: e.target.value
        })} placeholder="Short brand tagline" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={formData.description} onChange={e => setFormData({
        ...formData,
        description: e.target.value
      })} rows={2} placeholder="Brief description" />
      </div>
      <div className="space-y-2">
        <Label>Brand Story</Label>
        <Textarea value={formData.brand_story} onChange={e => setFormData({
        ...formData,
        brand_story: e.target.value
      })} rows={3} placeholder="Detailed brand story for landing pages" />
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
            <Input type="color" value={formData.primary_color} onChange={e => setFormData({
            ...formData,
            primary_color: e.target.value
          })} className="w-16 h-10 p-1" />
            <Input type="text" value={formData.primary_color} onChange={e => setFormData({
            ...formData,
            primary_color: e.target.value
          })} placeholder="#000000" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Secondary Color</Label>
          <div className="flex gap-2">
            <Input type="color" value={formData.secondary_color} onChange={e => setFormData({
            ...formData,
            secondary_color: e.target.value
          })} className="w-16 h-10 p-1" />
            <Input type="text" value={formData.secondary_color} onChange={e => setFormData({
            ...formData,
            secondary_color: e.target.value
          })} placeholder="#666666" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Accent Color</Label>
          <div className="flex gap-2">
            <Input type="color" value={formData.accent_color} onChange={e => setFormData({
            ...formData,
            accent_color: e.target.value
          })} className="w-16 h-10 p-1" />
            <Input type="text" value={formData.accent_color} onChange={e => setFormData({
            ...formData,
            accent_color: e.target.value
          })} placeholder="#FF6B6B" />
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
        <Input type="url" value={formData.website_url} onChange={e => setFormData({
        ...formData,
        website_url: e.target.value
      })} placeholder="https://brand.com" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Instagram</Label>
          <Input value={formData.social_links.instagram} onChange={e => setFormData({
          ...formData,
          social_links: {
            ...formData.social_links,
            instagram: e.target.value
          }
        })} placeholder="@brandname or full URL" />
        </div>
        <div className="space-y-2">
          <Label>Facebook</Label>
          <Input value={formData.social_links.facebook} onChange={e => setFormData({
          ...formData,
          social_links: {
            ...formData.social_links,
            facebook: e.target.value
          }
        })} placeholder="facebook.com/brandname" />
        </div>
        <div className="space-y-2">
          <Label>Twitter/X</Label>
          <Input value={formData.social_links.twitter} onChange={e => setFormData({
          ...formData,
          social_links: {
            ...formData.social_links,
            twitter: e.target.value
          }
        })} placeholder="@brandname" />
        </div>
        <div className="space-y-2">
          <Label>LinkedIn</Label>
          <Input value={formData.social_links.linkedin} onChange={e => setFormData({
          ...formData,
          social_links: {
            ...formData.social_links,
            linkedin: e.target.value
          }
        })} placeholder="linkedin.com/company/brand" />
        </div>
                <div className="space-y-2">
                  <Label>Figma</Label>
                  <Input value={formData.social_links.figma} onChange={e => setFormData({
          ...formData,
          social_links: {
            ...formData.social_links,
            figma: e.target.value
          }
        })} placeholder="figma.com/file/..." />
                </div>
                <div className="space-y-2">
                  <Label>Pinterest</Label>
                  <Input value={formData.social_links.pinterest} onChange={e => setFormData({
          ...formData,
          social_links: {
            ...formData.social_links,
            pinterest: e.target.value
          }
        })} placeholder="pinterest.com/brandname" />
                </div>
              </div>
            </div>

    {/* Brand Logo Upload */}
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
        <Palette className="h-4 w-4" />
        Brand Logo
      </h4>
      {brandId && <BrandLogoUpload brandId={brandId} currentLogoUrl={formData.logo_url} onLogoChange={url => setFormData({
      ...formData,
      logo_url: url
    })} />}
      {!brandId && <p className="text-sm text-muted-foreground">
          Save the brand first to upload a logo
        </p>}
    </div>

    <div className="flex gap-2 justify-end">
      <Button type="button" size="sm" variant="outline" onClick={onCancel}>
        <X className="h-4 w-4 mr-2" />
        Cancel
      </Button>
      <Button type="submit" size="sm" disabled={isSubmitting}>
        <Save className="h-4 w-4 mr-2" />
        {submitLabel}
      </Button>
    </div>
  </form>;
interface BrandsTabProps {
  partnerId: string;
  brands: Brand[];
}
export function BrandsTab({
  partnerId,
  brands
}: BrandsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
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
      figma: "",
      pinterest: ""
    }
  });
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();
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
        figma: "",
        pinterest: ""
      }
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBrand) {
      updateBrand.mutate({
        id: editingBrand.id,
        updates: formData
      }, {
        onSuccess: () => {
          setShowForm(false);
          setEditingBrand(null);
          resetForm();
        }
      });
    } else {
      createBrand.mutate({
        ...formData,
        partner_id: partnerId
      }, {
        onSuccess: () => {
          setShowForm(false);
          resetForm();
        }
      });
    }
  };
  const handleOpenForm = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
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
          figma: brand.social_links?.figma || "",
          pinterest: brand.social_links?.pinterest || ""
        }
      });
    } else {
      setEditingBrand(null);
      resetForm();
    }
    setShowForm(true);
  };
  const handleBack = () => {
    setShowForm(false);
    setEditingBrand(null);
    resetForm();
  };
  const handleDeleteClick = (brand: Brand, e: React.MouseEvent) => {
    e.stopPropagation();
    setBrandToDelete(brand);
    setDeleteDialogOpen(true);
  };
  const handleConfirmDelete = () => {
    if (brandToDelete) {
      deleteBrand.mutate(brandToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setBrandToDelete(null);
        }
      });
    }
  };
  if (showForm) {
    return <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-4 pb-20">
          <Button onClick={handleBack} variant="ghost" size="sm" className="mb-2">
            ← Back to Brands
          </Button>
          <h3 className="text-lg font-medium">{editingBrand ? "Edit Brand" : "Add Brand"}</h3>
          <form onSubmit={handleSubmit} className="space-y-6" id="brand-form">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Brand Name *</Label>
                  <Input value={formData.brand_name} onChange={e => setFormData({
                  ...formData,
                  brand_name: e.target.value
                })} required />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input value={formData.tagline} onChange={e => setFormData({
                  ...formData,
                  tagline: e.target.value
                })} placeholder="Short brand tagline" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={e => setFormData({
                ...formData,
                description: e.target.value
              })} rows={2} placeholder="Brief description" />
              </div>
              <div className="space-y-2">
                <Label>Brand Story</Label>
                <Textarea value={formData.brand_story} onChange={e => setFormData({
                ...formData,
                brand_story: e.target.value
              })} rows={3} placeholder="Detailed brand story for landing pages" />
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
                    <Input type="color" value={formData.primary_color} onChange={e => setFormData({
                    ...formData,
                    primary_color: e.target.value
                  })} className="w-16 h-10 p-1" />
                    <Input type="text" value={formData.primary_color} onChange={e => setFormData({
                    ...formData,
                    primary_color: e.target.value
                  })} placeholder="#000000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" value={formData.secondary_color} onChange={e => setFormData({
                    ...formData,
                    secondary_color: e.target.value
                  })} className="w-16 h-10 p-1" />
                    <Input type="text" value={formData.secondary_color} onChange={e => setFormData({
                    ...formData,
                    secondary_color: e.target.value
                  })} placeholder="#666666" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" value={formData.accent_color} onChange={e => setFormData({
                    ...formData,
                    accent_color: e.target.value
                  })} className="w-16 h-10 p-1" />
                    <Input type="text" value={formData.accent_color} onChange={e => setFormData({
                    ...formData,
                    accent_color: e.target.value
                  })} placeholder="#FF6B6B" />
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
                <Input type="url" value={formData.website_url} onChange={e => setFormData({
                ...formData,
                website_url: e.target.value
              })} placeholder="https://brand.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Instagram</Label>
                  <Input value={formData.social_links.instagram} onChange={e => setFormData({
                  ...formData,
                  social_links: {
                    ...formData.social_links,
                    instagram: e.target.value
                  }
                })} placeholder="@brandname or full URL" />
                </div>
                <div className="space-y-2">
                  <Label>Facebook</Label>
                  <Input value={formData.social_links.facebook} onChange={e => setFormData({
                  ...formData,
                  social_links: {
                    ...formData.social_links,
                    facebook: e.target.value
                  }
                })} placeholder="facebook.com/brandname" />
                </div>
                <div className="space-y-2">
                  <Label>Twitter/X</Label>
                  <Input value={formData.social_links.twitter} onChange={e => setFormData({
                  ...formData,
                  social_links: {
                    ...formData.social_links,
                    twitter: e.target.value
                  }
                })} placeholder="@brandname" />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input value={formData.social_links.linkedin} onChange={e => setFormData({
                  ...formData,
                  social_links: {
                    ...formData.social_links,
                    linkedin: e.target.value
                  }
                })} placeholder="linkedin.com/company/brand" />
                </div>
                <div className="space-y-2">
                  <Label>Pinterest</Label>
                  <Input value={formData.social_links.pinterest} onChange={e => setFormData({
                  ...formData,
                  social_links: {
                    ...formData.social_links,
                    pinterest: e.target.value
                  }
                })} placeholder="pinterest.com/brandname" />
                </div>
              </div>
            </div>

            {/* Brand Logo Upload */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">Brand Files<Palette className="h-4 w-4" />
                Brand Logo
              </h4>
              {editingBrand && <BrandLogoUpload brandId={editingBrand.id} currentLogoUrl={formData.logo_url} onLogoChange={url => setFormData({
              ...formData,
              logo_url: url
            })} />}
              {!editingBrand && <p className="text-sm text-muted-foreground">
                  Save the brand first to upload a logo
                </p>}
            </div>
          </form>
        </div>
        <div className="sticky bottom-0 left-0 right-0 bg-background border-t p-4 flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={handleBack}>
            Cancel
          </Button>
          <Button type="submit" form="brand-form" disabled={createBrand.isPending || updateBrand.isPending}>
            {editingBrand ? "Save Changes" : "Create Brand"}
          </Button>
        </div>
      </div>;
  }
  return <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Brands ({brands.length})</h3>
        <Button onClick={() => handleOpenForm()} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </div>

      {brands.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">
          No brands yet. Click "Add Brand" to create one.
        </p> : <div className="border rounded-lg">
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
              {brands.map(brand => <TableRow key={brand.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleOpenForm(brand)}>
                  <TableCell>
                    <div className="flex gap-3 items-center">
                      {brand.logo_url && <img src={brand.logo_url} alt={brand.brand_name} className="h-8 w-8 object-contain rounded" />}
                      <div>
                        <div className="font-medium">{brand.brand_name}</div>
                        {brand.description && <div className="text-xs text-muted-foreground line-clamp-1">{brand.description}</div>}
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
                    {brand.website_url ? <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <ExternalLink className="h-3 w-3" />
                        Visit
                      </a> : "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {brand.artworks && brand.artworks.length > 0 ? brand.artworks.length : 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm" onClick={e => {
                  e.stopPropagation();
                  handleOpenForm(brand);
                }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={e => handleDeleteClick(brand, e)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </div>}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Brand</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{brandToDelete?.brand_name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
}