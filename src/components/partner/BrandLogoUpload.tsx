import { useState, useCallback, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useBrandAssetUpload, useDeleteBrandAsset, useListBrandAssets } from "@/hooks/useBrandAssetUpload";
import { useUpdateBrand } from "@/hooks/usePartnerMutations";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BrandLogoUploadProps {
  brandId: string;
  currentLogoUrl?: string;
  onLogoChange?: (url: string) => void;
}

export const BrandLogoUpload = ({ brandId, currentLogoUrl, onLogoChange }: BrandLogoUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    fileName: string;
    progress: number;
    uploadedMB: number;
    totalMB: number;
    status: 'uploading' | 'complete' | 'error';
  }[]>([]);
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

    const allFiles = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', allFiles.map(f => ({ name: f.name, type: f.type, size: f.size })));
    
    if (!brandId) {
      toast.error("Brand ID is missing. Please save the brand first.");
      return;
    }

    const validFiles = filterAndValidateFiles(allFiles);
    
    if (validFiles.length > 0) {
      handleUpload(validFiles);
    }
  }, [brandId]);

  const filterAndValidateFiles = (files: File[]) => {
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.ai', '.psd', '.pdf', '.tif', '.tiff', '.fig'];
    
    const validFiles: File[] = [];
    const rejectedFiles: { name: string; reason: string }[] = [];

    files.forEach(file => {
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      
      // Check file extension
      if (!allowedExtensions.includes(fileExt)) {
        rejectedFiles.push({ name: file.name, reason: 'Unsupported file type' });
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        rejectedFiles.push({ 
          name: file.name, 
          reason: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB, max 100MB)` 
        });
        return;
      }

      validFiles.push(file);
    });

    // Show feedback for rejected files
    if (rejectedFiles.length > 0) {
      console.log('Rejected files:', rejectedFiles);
      rejectedFiles.forEach(({ name, reason }) => {
        toast.error(`${name}: ${reason}`);
      });
    }

    console.log('Valid files for upload:', validFiles.map(f => ({ name: f.name, size: f.size })));
    
    return validFiles;
  };

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const allFiles = Array.from(e.target.files);
      console.log('Files selected:', allFiles.map(f => ({ name: f.name, type: f.type, size: f.size })));
      
      if (!brandId) {
        toast.error("Brand ID is missing. Please save the brand first.");
        return;
      }

      const validFiles = filterAndValidateFiles(allFiles);
      
      if (validFiles.length > 0) {
        handleUpload(validFiles);
      } else if (allFiles.length > 0) {
        toast.error("No valid files to upload");
      }
    }
  }, [brandId]);

  const handleUpload = async (filesToUpload: File[]) => {
    if (filesToUpload.length === 0) return;

    console.log(`Preparing to upload ${filesToUpload.length} file(s)`);

    // Initialize progress tracking
    const initialProgress = filesToUpload.map(file => ({
      fileName: file.name,
      progress: 0,
      uploadedMB: 0,
      totalMB: file.size / 1024 / 1024,
      status: 'uploading' as const,
    }));
    setUploadProgress(initialProgress);

    try {
      await uploadAssets.mutateAsync({
        brandId,
        files: filesToUpload,
        onProgress: (fileName, progress, uploadedMB, totalMB) => {
          setUploadProgress(prev => 
            prev.map(item => 
              item.fileName === fileName
                ? {
                    ...item,
                    progress: progress === -1 ? item.progress : progress,
                    uploadedMB,
                    totalMB,
                    status: progress === -1 ? 'error' : progress === 100 ? 'complete' : 'uploading'
                  }
                : item
            )
          );
        },
      });

      // Clear progress after 2 seconds
      setTimeout(() => {
        setUploadProgress([]);
      }, 2000);

      // Refresh the list after successful upload
      listAssets.mutate(brandId, {
        onSuccess: (files) => {
          setUploadedFiles(files);
        },
      });
    } catch (error) {
      console.error("Upload failed:", error);
      // Mark all as error
      setUploadProgress(prev =>
        prev.map(item => ({ ...item, status: 'error' as const }))
      );
    }
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
                accept="image/*,.pdf,.ai,.psd,.tif,.tiff,.fig"
                onChange={handleFileInput}
              />
              <label htmlFor="file-upload">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-4">
                Supports: JPG, PNG, WEBP, SVG, PDF, AI, PSD, TIF, Figma (max 100MB each)
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <h4 className="text-sm font-semibold">Upload Progress</h4>
            {uploadProgress.map((item) => (
              <div key={item.fileName} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate max-w-[300px]" title={item.fileName}>
                    {item.fileName}
                  </span>
                  <span className="text-muted-foreground text-xs whitespace-nowrap ml-2">
                    {item.status === 'error' ? (
                      <span className="text-destructive">Failed</span>
                    ) : item.status === 'complete' ? (
                      <span className="text-green-600">Complete</span>
                    ) : (
                      `${item.uploadedMB.toFixed(1)} / ${item.totalMB.toFixed(1)} MB (${Math.round(item.progress)}%)`
                    )}
                  </span>
                </div>
                <Progress 
                  value={item.progress} 
                  className={cn(
                    "h-2",
                    item.status === 'error' && "[&>*]:bg-destructive",
                    item.status === 'complete' && "[&>*]:bg-green-600"
                  )}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files Gallery */}
      {uploadedFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">Uploaded Assets ({uploadedFiles.length})</h4>
          <div className="grid grid-cols-3 gap-3">
            {uploadedFiles.map((file) => {
              const isImage = file.metadata?.mimetype?.startsWith('image/');
              const displayName = file.name.replace(/^\d+-/, ''); // Remove timestamp prefix
              
              return (
                <Card key={file.name} className="relative group overflow-hidden">
                  <CardContent className="p-2">
                    <div className="aspect-square relative bg-muted rounded-md overflow-hidden flex items-center justify-center">
                      {isImage ? (
                        <img
                          src={file.publicUrl}
                          alt={displayName}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-xs">{file.name.split('.').pop()?.toUpperCase()}</span>
                        </div>
                      )}
                      {currentLogoUrl === file.publicUrl && (
                        <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                          Active Logo
                        </div>
                      )}
                    </div>
                    <div className="mt-2 space-y-2">
                      <p className="text-xs truncate" title={displayName}>
                        {displayName}
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
              );
            })}
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
