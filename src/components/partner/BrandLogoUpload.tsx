import { useState, useCallback, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBrandAssetUpload, useDeleteBrandAsset, useListBrandAssets } from "@/hooks/useBrandAssetUpload";
import { useUpdateBrand } from "@/hooks/usePartnerMutations";
import { cn } from "@/lib/utils";

interface BrandLogoUploadProps {
  brandId: string;
  currentLogoUrl?: string;
  onLogoChange?: (url: string) => void;
}

export const BrandLogoUpload = ({ brandId, currentLogoUrl, onLogoChange }: BrandLogoUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const uploadAssets = useBrandAssetUpload();
  const deleteAsset = useDeleteBrandAsset();
  const listAssets = useListBrandAssets();
  const updateBrand = useUpdateBrand();

  // Load existing assets
  useEffect(() => {
    if (brandId) {
      listAssets.mutate(brandId, {
        onSuccess: (files) => {
          setUploadedFiles(files);
        },
      });
    }
  }, [brandId]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      handleUpload(files);
    }
  }, [brandId]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).filter(file =>
        file.type.startsWith('image/')
      );
      handleUpload(files);
    }
  }, [brandId]);

  const handleUpload = (files: File[]) => {
    uploadAssets.mutate(
      { brandId, files },
      {
        onSuccess: (uploadedFiles) => {
          // Refresh the list
          listAssets.mutate(brandId, {
            onSuccess: (files) => {
              setUploadedFiles(files);
            },
          });
        },
      }
    );
  };

  const handleSetAsLogo = (publicUrl: string) => {
    updateBrand.mutate(
      {
        id: brandId,
        updates: { logo_url: publicUrl },
      },
      {
        onSuccess: () => {
          if (onLogoChange) {
            onLogoChange(publicUrl);
          }
        },
      }
    );
  };

  const handleDelete = (filePath: string) => {
    deleteAsset.mutate(filePath, {
      onSuccess: () => {
        // Refresh the list
        listAssets.mutate(brandId, {
          onSuccess: (files) => {
            setUploadedFiles(files);
          },
        });
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          uploadAssets.isPending && "opacity-50 pointer-events-none"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 px-4">
          {uploadAssets.isPending ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading files...</p>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">Upload Brand Logos</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Drag and drop image files here, or click to browse
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileInput}
              />
              <label htmlFor="file-upload">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-4">
                Supports: JPG, PNG, WEBP, SVG (max 5MB each)
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files Gallery */}
      {uploadedFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">Uploaded Assets ({uploadedFiles.length})</h4>
          <div className="grid grid-cols-3 gap-3">
            {uploadedFiles.map((file) => (
              <Card key={file.name} className="relative group overflow-hidden">
                <CardContent className="p-2">
                  <div className="aspect-square relative bg-muted rounded-md overflow-hidden">
                    <img
                      src={file.publicUrl}
                      alt={file.name}
                      className="w-full h-full object-contain"
                    />
                    {currentLogoUrl === file.publicUrl && (
                      <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                        Active Logo
                      </div>
                    )}
                  </div>
                  <div className="mt-2 space-y-2">
                    <p className="text-xs truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-7 text-xs"
                        onClick={() => handleSetAsLogo(file.publicUrl)}
                        disabled={currentLogoUrl === file.publicUrl || updateBrand.isPending}
                      >
                        {currentLogoUrl === file.publicUrl ? "Current" : "Set as Logo"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => handleDelete(file.fullPath)}
                        disabled={deleteAsset.isPending}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {uploadedFiles.length === 0 && !uploadAssets.isPending && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No logos uploaded yet</p>
        </div>
      )}
    </div>
  );
};
