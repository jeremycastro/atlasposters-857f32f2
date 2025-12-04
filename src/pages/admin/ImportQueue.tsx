import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  usePartnerProducts,
  usePartnerProductStats,
  useMapPartnerProductToArtwork,
  useRejectPartnerProduct,
  useUpdatePartnerProduct,
  PartnerProduct,
} from "@/hooks/usePartnerProducts";
import { useArtworks } from "@/hooks/useArtworks";
import { usePartners, useBrands } from "@/hooks/usePartnerManagement";
import { QuickCreateArtworkDialog } from "@/components/artworks/QuickCreateArtworkDialog";
import {
  Package,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Link2,
  AlertTriangle,
  Loader2,
  Users,
  Building2,
  CheckSquare,
  Square,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-yellow-500", icon: Clock },
  reviewing: { label: "Reviewing", color: "bg-blue-500", icon: Eye },
  mapped: { label: "Mapped", color: "bg-green-500", icon: Link2 },
  created: { label: "Created", color: "bg-emerald-600", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-500", icon: XCircle },
};

const ImportQueue = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<PartnerProduct | null>(null);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [assignPartnerDialogOpen, setAssignPartnerDialogOpen] = useState(false);
  const [bulkAssignDialogOpen, setBulkAssignDialogOpen] = useState(false);
  const [quickCreateDialogOpen, setQuickCreateDialogOpen] = useState(false);
  const [selectedArtworkId, setSelectedArtworkId] = useState<string>("");
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [mappingNotes, setMappingNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data: products, isLoading } = usePartnerProducts({
    import_status: statusFilter,
  });
  const { data: stats } = usePartnerProductStats();
  const { data: artworks } = useArtworks();
  const { data: partners } = usePartners();
  const { data: brands } = useBrands();

  const mapMutation = useMapPartnerProductToArtwork();
  const rejectMutation = useRejectPartnerProduct();
  const updateMutation = useUpdatePartnerProduct();

  // Filter brands by selected partner
  const filteredBrands = useMemo(() => {
    if (!brands || !selectedPartnerId) return [];
    return brands.filter(b => b.partner_id === selectedPartnerId);
  }, [brands, selectedPartnerId]);

  // Filter products by search
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchQuery) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.original_title.toLowerCase().includes(query) ||
        p.artwork_code?.toLowerCase().includes(query) ||
        p.original_sku?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  // Find matching artworks by artwork code
  const suggestedArtworks = useMemo(() => {
    if (!selectedProduct?.artwork_code || !artworks) return [];
    const code = selectedProduct.artwork_code.toLowerCase();
    return artworks.filter(
      (a) =>
        a.asc_code?.toLowerCase().includes(code) ||
        a.title?.toLowerCase().includes(code)
    );
  }, [selectedProduct, artworks]);

  const handleMap = () => {
    if (!selectedProduct || !selectedArtworkId) return;
    mapMutation.mutate(
      {
        partnerProductId: selectedProduct.id,
        artworkId: selectedArtworkId,
        notes: mappingNotes,
      },
      {
        onSuccess: () => {
          setMapDialogOpen(false);
          setSelectedProduct(null);
          setSelectedArtworkId("");
          setMappingNotes("");
        },
      }
    );
  };

  const handleReject = () => {
    if (!selectedProduct || !rejectionReason) return;
    rejectMutation.mutate(
      {
        id: selectedProduct.id,
        reason: rejectionReason,
      },
      {
        onSuccess: () => {
          setRejectDialogOpen(false);
          setSelectedProduct(null);
          setRejectionReason("");
        },
      }
    );
  };

  const handleSetReviewing = (product: PartnerProduct) => {
    updateMutation.mutate({
      id: product.id,
      updates: { import_status: "reviewing" },
    });
  };

  const handleAssignPartner = () => {
    if (!selectedProduct || !selectedPartnerId) return;
    updateMutation.mutate(
      {
        id: selectedProduct.id,
        updates: { 
          partner_id: selectedPartnerId,
          brand_id: selectedBrandId || null,
        },
      },
      {
        onSuccess: () => {
          setAssignPartnerDialogOpen(false);
          setSelectedProduct(null);
          setSelectedPartnerId("");
          setSelectedBrandId("");
        },
      }
    );
  };

  // Bulk selection helpers
  const selectableProducts = useMemo(() => {
    return filteredProducts.filter(p => ["pending", "reviewing"].includes(p.import_status));
  }, [filteredProducts]);

  const allSelected = selectableProducts.length > 0 && 
    selectableProducts.every(p => selectedIds.has(p.id));
  
  const someSelected = selectableProducts.some(p => selectedIds.has(p.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(selectableProducts.map(p => p.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkAssignPartner = async () => {
    if (selectedIds.size === 0 || !selectedPartnerId) return;
    
    let successCount = 0;
    const idsArray = Array.from(selectedIds);
    
    for (const id of idsArray) {
      try {
        await updateMutation.mutateAsync({
          id,
          updates: { 
            partner_id: selectedPartnerId,
            brand_id: selectedBrandId || null,
          },
        });
        successCount++;
      } catch (error) {
        console.error(`Failed to assign partner to product ${id}:`, error);
      }
    }
    
    toast.success(`Assigned partner to ${successCount} of ${idsArray.length} products`);
    setBulkAssignDialogOpen(false);
    setSelectedIds(new Set());
    setSelectedPartnerId("");
    setSelectedBrandId("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Import Queue</h1>
          </div>
          <p className="text-muted-foreground">
            Review and map imported products to Atlas artworks
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </Card>
            {Object.entries(statusConfig).map(([key, config]) => {
              const Icon = config.icon;
              const count = stats[key as keyof typeof stats] || 0;
              return (
                <Card
                  key={key}
                  className={`p-4 text-center cursor-pointer transition-all ${
                    statusFilter === key ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
                >
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${config.color.replace("bg-", "text-")}`} />
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-muted-foreground">{config.label}</p>
                </Card>
              );
            })}
          </div>
        )}

        {/* Filters - Fixed two-row layout */}
        <Card className="p-4 mb-6">
          {/* Row 1: Search and Status Filter */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, artwork code, or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Bulk Actions - Always visible */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t">
            <span className="text-sm font-medium text-muted-foreground min-w-[100px]">
              {selectedIds.size} selected
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedIds(new Set())}
              disabled={selectedIds.size === 0}
            >
              Clear Selection
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => setBulkAssignDialogOpen(true)}
              disabled={selectedIds.size === 0}
            >
              <Users className="w-4 h-4 mr-1" />
              Assign Partner
            </Button>
          </div>
        </Card>

        {/* Products Table - Flex grow to fill remaining space */}
        <Card className="p-6 flex-1 flex flex-col min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No products in queue</p>
              <p className="text-sm">Import products from the Syncio Import page first</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-auto flex-1">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Partner</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Artwork Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Variants</TableHead>
                    <TableHead>Imported</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const status = statusConfig[product.import_status];
                    const StatusIcon = status?.icon || Clock;
                    const isSelectable = ["pending", "reviewing"].includes(product.import_status);
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          {isSelectable && (
                            <Checkbox
                              checked={selectedIds.has(product.id)}
                              onCheckedChange={() => toggleSelect(product.id)}
                              aria-label={`Select ${product.original_title}`}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`${status?.color} text-white`}
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {product.partner ? (
                            <div className="flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm">{product.partner.partner_name}</span>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-amber-600 border-amber-300">
                              <Users className="w-3 h-3 mr-1" />
                              Unassigned
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {product.original_title}
                        </TableCell>
                        <TableCell>
                          {product.artwork_code ? (
                            <code className="px-2 py-1 bg-muted rounded text-sm">
                              {product.artwork_code}
                            </code>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {product.product_type || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {product.variants?.length || 0} variants
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(product.imported_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {product.import_status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSetReviewing(product)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            {["pending", "reviewing"].includes(product.import_status) && (
                              <>
                                {!product.partner_id && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedProduct(product);
                                      setAssignPartnerDialogOpen(true);
                                    }}
                                  >
                                    <Users className="w-4 h-4 mr-1" />
                                    Assign
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setMapDialogOpen(true);
                                  }}
                                  disabled={!product.partner_id}
                                  title={!product.partner_id ? "Assign partner first" : ""}
                                >
                                  <Link2 className="w-4 h-4 mr-1" />
                                  Map
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setRejectDialogOpen(true);
                                  }}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            {product.import_status === "mapped" && product.artwork && (
                              <span className="text-sm text-green-600">
                                → {product.artwork.asc_code}
                              </span>
                            )}
                            {product.import_status === "rejected" && (
                              <span className="text-sm text-destructive truncate max-w-[150px]">
                                {product.rejection_reason}
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

        {/* Map Dialog */}
        <Dialog open={mapDialogOpen} onOpenChange={setMapDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Map to Artwork</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-medium">{selectedProduct.original_title}</p>
                  {selectedProduct.artwork_code && (
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {selectedProduct.artwork_code}
                    </code>
                  )}
                </div>

                {suggestedArtworks.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Suggested Artworks
                    </p>
                    <div className="space-y-2">
                      {suggestedArtworks.slice(0, 3).map((artwork) => (
                        <Card
                          key={artwork.id}
                          className={`p-3 cursor-pointer transition-all ${
                            selectedArtworkId === artwork.id
                              ? "ring-2 ring-primary"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedArtworkId(artwork.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{artwork.title}</p>
                              <code className="text-sm text-muted-foreground">
                                {artwork.asc_code}
                              </code>
                            </div>
                            {selectedArtworkId === artwork.id && (
                              <CheckCircle className="w-5 h-5 text-primary" />
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Create New Artwork Option */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => setQuickCreateDialogOpen(true)}
                  disabled={!selectedProduct?.partner_id}
                >
                  <Plus className="w-4 h-4" />
                  Create New Artwork
                </Button>

                {!selectedProduct?.partner_id && (
                  <p className="text-xs text-muted-foreground">
                    Assign a partner to this product first before creating a new artwork
                  </p>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Or select existing artwork
                  </p>
                  <Select value={selectedArtworkId} onValueChange={setSelectedArtworkId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select artwork..." />
                    </SelectTrigger>
                    <SelectContent>
                      {artworks?.map((artwork) => (
                        <SelectItem key={artwork.id} value={artwork.id}>
                          {artwork.asc_code} - {artwork.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Notes (optional)</p>
                  <Textarea
                    value={mappingNotes}
                    onChange={(e) => setMappingNotes(e.target.value)}
                    placeholder="Add any mapping notes..."
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setMapDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleMap}
                disabled={!selectedArtworkId || mapMutation.isPending}
              >
                {mapMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Map Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Reject Product
              </DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-medium">{selectedProduct.original_title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Rejection Reason *
                  </p>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Why is this product being rejected?"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectionReason || rejectMutation.isPending}
              >
                {rejectMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Reject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign Partner Dialog */}
        <Dialog open={assignPartnerDialogOpen} onOpenChange={setAssignPartnerDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Assign Partner
              </DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-medium">{selectedProduct.original_title}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Partner *</p>
                  <Select value={selectedPartnerId} onValueChange={(val) => {
                    setSelectedPartnerId(val);
                    setSelectedBrandId(""); // Reset brand when partner changes
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select partner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {partners?.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.partner_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedPartnerId && filteredBrands.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Brand (optional)</p>
                    <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredBrands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.brand_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setAssignPartnerDialogOpen(false);
                setSelectedPartnerId("");
                setSelectedBrandId("");
              }}>
                Cancel
              </Button>
              <Button
                onClick={handleAssignPartner}
                disabled={!selectedPartnerId || updateMutation.isPending}
              >
                {updateMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Assign Partner
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Assign Partner Dialog */}
        <Dialog open={bulkAssignDialogOpen} onOpenChange={setBulkAssignDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Bulk Assign Partner
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">
                  {selectedIds.size} product{selectedIds.size !== 1 ? "s" : ""} selected
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Partner *</p>
                <Select value={selectedPartnerId} onValueChange={(val) => {
                  setSelectedPartnerId(val);
                  setSelectedBrandId(""); // Reset brand when partner changes
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select partner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {partners?.map((partner) => (
                      <SelectItem key={partner.id} value={partner.id}>
                        {partner.partner_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPartnerId && filteredBrands.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Brand (optional)</p>
                  <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand..." />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredBrands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.brand_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setBulkAssignDialogOpen(false);
                setSelectedPartnerId("");
                setSelectedBrandId("");
              }}>
                Cancel
              </Button>
              <Button
                onClick={handleBulkAssignPartner}
                disabled={!selectedPartnerId || updateMutation.isPending}
              >
                {updateMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Assign to {selectedIds.size} Products
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Quick Create Artwork Dialog */}
        {selectedProduct?.partner_id && (
          <QuickCreateArtworkDialog
            open={quickCreateDialogOpen}
            onOpenChange={setQuickCreateDialogOpen}
            onSuccess={(artworkId, ascCode) => {
              setSelectedArtworkId(artworkId);
              setMappingNotes(`Artwork created from import queue (${ascCode})`);
            }}
            prefillData={{
              title: selectedProduct.original_title,
              brandId: selectedProduct.brand_id || undefined,
              partnerId: selectedProduct.partner_id,
            }}
          />
        )}
      </main>
    </div>
  );
};

export default ImportQueue;
