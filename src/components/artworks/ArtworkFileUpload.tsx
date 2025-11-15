import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useArtworkFileUpload, UploadedFile } from '@/hooks/useArtworkFileUpload';
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
import { ArtworkFileTable } from './ArtworkFileTable';

interface ArtworkFileUploadProps {
  artworkId: string;
  artworkAscCode?: string;
  existingFiles?: UploadedFile[];
  onFilesChange?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  accept?: Record<string, string[]>;
}

export const ArtworkFileUpload = ({
  artworkId,
  artworkAscCode,
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
  
  // Sync files when existingFiles changes
  useEffect(() => {
    setFiles(existingFiles);
  }, [existingFiles]);
  
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
      printSpecs,
      artworkAscCode
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

      {/* Upload Progress - Fixed position to avoid modal overlap */}
      {uploading && (
        <div className="fixed top-4 right-4 z-[100] w-96 max-w-[calc(100vw-2rem)] space-y-3 p-4 border rounded-lg bg-background shadow-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium truncate mr-2">
              {pendingFile?.name || 'Uploading file...'}
            </span>
            <span className="font-semibold text-primary shrink-0">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {progress < 5 && 'Preparing upload...'}
            {progress >= 5 && progress < 90 && 'Uploading file...'}
            {progress >= 90 && progress < 100 && 'Saving...'}
            {progress === 100 && 'Complete!'}
          </div>
        </div>
      )}

      {/* Uploaded Files Table */}
      {files.length > 0 && (
        <ArtworkFileTable
          files={files}
          onSetPrimary={handleSetPrimary}
          onDelete={(fileId) => {
            const file = files.find(f => f.id === fileId);
            if (file) handleDelete(fileId, file.file_path);
          }}
        />
      )}
    </div>
  );
};
