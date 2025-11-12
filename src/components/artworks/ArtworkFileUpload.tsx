import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Star, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useArtworkFileUpload, UploadedFile } from '@/hooks/useArtworkFileUpload';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { FileTagSelector } from './FileTagSelector';
import { PrintFileSpecifications } from './PrintFileSpecifications';

interface ArtworkFileUploadProps {
  artworkId: string;
  existingFiles?: UploadedFile[];
  onFilesChange?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  accept?: Record<string, string[]>;
}

export const ArtworkFileUpload = ({
  artworkId,
  existingFiles = [],
  onFilesChange,
  maxFiles = 10,
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.tif', '.tiff'],
    'application/pdf': ['.pdf'],
  },
}: ArtworkFileUploadProps) => {
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles);
  const { uploadFile, deleteFile, uploading, progress } = useArtworkFileUpload();
  
  // Tag & spec dialog state
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<{
    structured: Record<string, string[]>;
    custom: string[];
    matches_variants: Record<string, string[]>;
  }>({
    structured: {},
    custom: [],
    matches_variants: {},
  });
  const [printSpecs, setPrintSpecs] = useState<Record<string, any>>({});

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0 && files.length < maxFiles) {
        // Open dialog for first file to set tags
        setPendingFile(acceptedFiles[0]);
        setSelectedTags({
          structured: {},
          custom: [],
          matches_variants: {},
        });
        setPrintSpecs({});
        setTagDialogOpen(true);
      }
    },
    [files, maxFiles]
  );

  const handleConfirmUpload = async () => {
    if (!pendingFile) return;

    const uploadedFile = await uploadFile(
      pendingFile,
      artworkId,
      files.length === 0, // First file is primary by default
      selectedTags,
      printSpecs
    );

    if (uploadedFile) {
      const newFiles = [...files, uploadedFile];
      setFiles(newFiles);
      onFilesChange?.(newFiles);
    }

    setTagDialogOpen(false);
    setPendingFile(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - files.length,
    disabled: uploading || files.length >= maxFiles,
  });

  const handleDelete = async (fileId: string, filePath: string) => {
    await deleteFile(fileId, filePath);
    const newFiles = files.filter((f) => f.id !== fileId);
    setFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  const handleSetPrimary = async (fileId: string) => {
    // Update all files to not be primary, then set the selected one as primary
    const newFiles = files.map((f) => ({
      ...f,
      is_primary: f.id === fileId,
    }));
    setFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Tag & Specifications Dialog */}
      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>File Tags & Specifications</DialogTitle>
            <DialogDescription>
              Add tags and print specifications for {pendingFile?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <FileTagSelector
              selectedTags={selectedTags}
              onChange={setSelectedTags}
            />

            <PrintFileSpecifications
              specifications={printSpecs}
              onChange={setPrintSpecs}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTagDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmUpload} disabled={uploading}>
              Upload File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive && 'border-primary bg-primary/5',
          !isDragActive && 'border-border hover:border-primary/50',
          (uploading || files.length >= maxFiles) && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        {isDragActive ? (
          <p className="text-lg font-medium">Drop files here...</p>
        ) : (
          <div className="space-y-2">
            <p className="text-lg font-medium">
              Drag & drop print files here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse ({files.length}/{maxFiles} files)
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: High-res images (PNG, JPG, TIFF, WEBP) and PDF files
            </p>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Uploading...</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          <div className="grid gap-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                {/* File Icon/Preview */}
                <div className="shrink-0 w-12 h-12 rounded bg-muted flex items-center justify-center overflow-hidden">
                  {file.mime_type.startsWith('image/') ? (
                    <img
                      src={file.url}
                      alt={file.file_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <File className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium truncate">
                      {file.file_name}
                    </p>
                    {file.is_primary && (
                      <Badge variant="secondary" className="shrink-0">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Primary
                      </Badge>
                    )}
                    {file.version_number && file.version_number > 1 && (
                      <Badge variant="outline" className="shrink-0">
                        v{file.version_number}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatFileSize(file.file_size)}</span>
                    {file.tags && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {Object.values(file.tags.structured).flat().length +
                            file.tags.custom.length}{' '}
                          tags
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {!file.is_primary && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSetPrimary(file.id)}
                      title="Set as primary"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(file.id, file.file_path)}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
