import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";

interface FilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: {
    name: string;
    publicUrl: string;
    metadata?: {
      mimetype?: string;
    };
  } | null;
  onDownload?: () => void;
}

export const FilePreviewDialog = ({ 
  open, 
  onOpenChange, 
  file,
  onDownload 
}: FilePreviewDialogProps) => {
  if (!file) return null;

  const isImage = file.metadata?.mimetype?.startsWith('image/');
  const isPdf = file.metadata?.mimetype === 'application/pdf';
  const displayName = file.name.replace(/^\d+-/, '');

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="truncate pr-4">{displayName}</DialogTitle>
          <DialogDescription className="sr-only">
            Preview of {displayName}
          </DialogDescription>
          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              {onDownload && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(file.publicUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {isImage ? (
            <div className="flex items-center justify-center bg-muted/30 rounded-lg p-4">
              <img
                src={file.publicUrl}
                alt={displayName}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          ) : isPdf ? (
            <iframe
              src={file.publicUrl}
              className="w-full h-[70vh] rounded-lg border"
              title={displayName}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
              <p className="mb-4">Preview not available for this file type</p>
              <Button variant="outline" onClick={onDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download to view
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
