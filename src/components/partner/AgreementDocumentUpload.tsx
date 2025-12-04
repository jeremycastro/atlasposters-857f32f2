import { useState, useCallback, useEffect } from "react";
import { Upload, X, Loader2, Download, ExternalLink, FileText, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FilePreviewDialog } from "./FilePreviewDialog";

interface AgreementDocumentUploadProps {
  agreementId: string;
  activeDocumentPath?: string | null;
  onSetActive?: (filePath: string) => void;
}

export const AgreementDocumentUpload = ({ agreementId, activeDocumentPath, onSetActive }: AgreementDocumentUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [previewFile, setPreviewFile] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    fileName: string;
    progress: number;
    uploadedMB: number;
    totalMB: number;
    status: 'uploading' | 'complete' | 'error';
  }[]>([]);

  // Load existing documents
  useEffect(() => {
    if (agreementId) {
      loadDocuments();
    }
  }, [agreementId]);

  const loadDocuments = async () => {
    try {
      const { data: files, error } = await supabase.storage
        .from('partner-documents')
        .list(`agreements/${agreementId}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) throw error;

      const filesWithUrls = await Promise.all(
        files.map(async (file) => {
          const { data: { publicUrl } } = supabase.storage
            .from('partner-documents')
            .getPublicUrl(`agreements/${agreementId}/${file.name}`);

          return {
            ...file,
            fullPath: `agreements/${agreementId}/${file.name}`,
            publicUrl,
          };
        })
      );

      setUploadedFiles(filesWithUrls);
    } catch (error: any) {
      toast.error('Failed to load documents');
    }
  };

  const filterAndValidateFiles = (files: File[]) => {
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png'];
    
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
      rejectedFiles.forEach(({ name, reason }) => {
        toast.error(`${name}: ${reason}`);
      });
    }
    
    return validFiles;
  };

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const allFiles = Array.from(e.target.files);
      
      if (!agreementId) {
        toast.error("Agreement ID is missing. Please save the agreement first.");
        return;
      }

      const validFiles = filterAndValidateFiles(allFiles);
      
      if (validFiles.length > 0) {
        handleUpload(validFiles);
      }
    }
  }, [agreementId]);

  const handleUpload = async (filesToUpload: File[]) => {
    if (filesToUpload.length === 0) return;

    setIsUploading(true);

    const initialProgress = filesToUpload.map(file => ({
      fileName: file.name,
      progress: 0,
      uploadedMB: 0,
      totalMB: file.size / 1024 / 1024,
      status: 'uploading' as const,
    }));
    setUploadProgress(initialProgress);

    try {
      for (const file of filesToUpload) {
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name}`;
        const filePath = `agreements/${agreementId}/${fileName}`;

        // Upload via Edge Function for server-side validation
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'partner-documents');
        formData.append('filePath', filePath);
        formData.append('maxSizeMB', '100');

        const { data: uploadData, error: uploadError } = await supabase.functions.invoke('validate-upload', {
          body: formData,
        });

        if (uploadError) throw uploadError;
        if (!uploadData.success) throw new Error(uploadData.error || 'Upload failed');

        setUploadProgress(prev =>
          prev.map(item =>
            item.fileName === file.name
              ? { ...item, progress: 100, status: 'complete' as const }
              : item
          )
        );
      }

      toast.success(`Successfully uploaded ${filesToUpload.length} file(s)`);

      setTimeout(() => {
        setUploadProgress([]);
      }, 2000);

      await loadDocuments();
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
      
      setUploadProgress(prev =>
        prev.map(item => ({ ...item, status: 'error' as const }))
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (filePath: string) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.storage
        .from('partner-documents')
        .remove([filePath]);

      if (error) throw error;

      toast.success("Document deleted");
      await loadDocuments();
    } catch (error: any) {
      toast.error(`Delete failed: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async (file: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('partner-documents')
        .download(file.fullPath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/^\d+-/, ''); // Remove timestamp
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Download started");
    } catch (error: any) {
      toast.error(`Download failed: ${error.message}`);
    }
  };

  const handleView = (file: any) => {
    setPreviewFile(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <FilePreviewDialog
        open={!!previewFile}
        onOpenChange={(open) => !open && setPreviewFile(null)}
        file={previewFile}
        onDownload={() => previewFile && handleDownload(previewFile)}
      />
      
      {/* Upload Area */}
      <div className="flex items-center gap-3">
        <input
          type="file"
          id="agreement-file-upload"
          className="hidden"
          multiple
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          onChange={handleFileInput}
          disabled={isUploading}
        />
        <label htmlFor="agreement-file-upload">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            asChild 
            disabled={isUploading}
          >
            <span className="flex items-center gap-2">
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isUploading ? "Uploading..." : "Upload Document"}
            </span>
          </Button>
        </label>
        <span className="text-xs text-muted-foreground">
          PDF, DOC, DOCX, TXT, JPG, PNG (max 100MB)
        </span>
      </div>

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

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">Uploaded Documents ({uploadedFiles.length})</h4>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[100px]">Size</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[150px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadedFiles.map((file) => {
                  const displayName = file.name.replace(/^\d+-/, ''); // Remove timestamp prefix
                  const isActive = activeDocumentPath === file.fullPath;
                  
                  return (
                    <TableRow key={file.name} className={cn(isActive && "bg-primary/5")}>
                      <TableCell>
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium truncate max-w-[300px]" title={displayName}>
                            {displayName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {file.name.split('.').pop()?.toUpperCase()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatFileSize(file.metadata?.size || 0)}
                      </TableCell>
                      <TableCell>
                        {isActive ? (
                          <Badge variant="default" className="bg-green-600 hover:bg-green-600 text-white">
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : onSetActive ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onSetActive(file.fullPath);
                            }}
                            type="button"
                          >
                            <Star className="h-3 w-3 mr-1" />
                            Set Active
                          </Button>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => handleView(file)}
                            title="View"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDownload(file)}
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(file.fullPath)}
                            disabled={isDeleting}
                            title="Delete"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};
