import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useArtworkMutations } from "@/hooks/useArtworkMutations";
import { useBrands } from "@/hooks/usePartnerManagement";
import { Loader2, Plus, Sparkles, Tag } from "lucide-react";

interface QuickCreateArtworkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (artworkId: string, ascCode: string) => void;
  prefillData: {
    title: string;
    brandId?: string;
    partnerId: string;
    artworkCode?: string;
  };
}

export const QuickCreateArtworkDialog = ({
  open,
  onOpenChange,
  onSuccess,
  prefillData,
}: QuickCreateArtworkDialogProps) => {
  const [title, setTitle] = useState(prefillData.title);
  const [artistName, setArtistName] = useState("");
  const [brandId, setBrandId] = useState(prefillData.brandId || "");
  const [description, setDescription] = useState("");

  const { createArtwork } = useArtworkMutations();
  const { data: brands } = useBrands();

  // Filter brands by partner
  const partnerBrands = brands?.filter(
    (b) => b.partner_id === prefillData.partnerId
  );

  // Reset form when dialog opens with new data
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setTitle(prefillData.title);
      setArtistName("");
      setBrandId(prefillData.brandId || "");
      setDescription("");
    }
    onOpenChange(newOpen);
  };

  const handleCreate = () => {
    if (!title.trim()) return;

    // Build metadata with partner artwork code if available
    const metadata = prefillData.artworkCode 
      ? {
          partner_artwork_codes: [prefillData.artworkCode],
          import_source: "partner_import_queue",
        }
      : undefined;

    createArtwork.mutate(
      {
        artwork: {
          title: title.trim(),
          artist_name: artistName.trim() || null,
          brand_id: brandId || null,
          description: description.trim() || null,
          partner_id: prefillData.partnerId,
          status: "draft",
          metadata: metadata || null,
        },
        partnerId: prefillData.partnerId,
      },
      {
        onSuccess: (data) => {
          onSuccess(data.id, data.asc_code);
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Quick Create Artwork
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-primary mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Create a new artwork record to map this product. An ASC code will
              be automatically generated.
            </p>
          </div>

          {prefillData.artworkCode && (
            <div className="flex items-center gap-2 px-3 py-2 bg-accent/50 rounded-lg border border-border">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Partner Code:</span>
              <span className="text-sm font-medium">{prefillData.artworkCode}</span>
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Artwork title"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Artist Name
            </label>
            <Input
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Artist name (optional)"
            />
          </div>

          {partnerBrands && partnerBrands.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Brand</label>
              <Select value={brandId} onValueChange={setBrandId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {partnerBrands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.brand_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description (optional)"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!title.trim() || createArtwork.isPending}
          >
            {createArtwork.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Create & Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
