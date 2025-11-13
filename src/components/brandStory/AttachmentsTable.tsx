import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, FileText, Image } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Attachment {
  id: string;
  file_name: string;
  file_path: string;
  asset_type: string;
  mime_type: string;
  file_size: number;
  description?: string;
  usage_context?: string;
  uploaded_at: string;
  uploaded_by?: string;
}

interface AttachmentsTableProps {
  attachments: Attachment[];
  onDelete: () => void;
}

export const AttachmentsTable = ({ attachments, onDelete }: AttachmentsTableProps) => {
  const handleDownload = async (attachment: Attachment) => {
    try {
      const { data, error } = await supabase.storage
        .from('brand-story-assets')
        .download(attachment.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("File downloaded successfully");
    } catch (err: any) {
      console.error('Download error:', err);
      toast.error("Failed to download file");
    }
  };

  const handleDelete = async (attachment: Attachment) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('brand-story-assets')
        .remove([attachment.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('brand_story_assets')
        .delete()
        .eq('id', attachment.id);

      if (dbError) throw dbError;

      toast.success("File deleted successfully");
      onDelete();
    } catch (err: any) {
      console.error('Delete error:', err);
      toast.error("Failed to delete file");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  if (attachments.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        No attachments yet. Upload files to get started.
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attachments.map((attachment) => (
            <TableRow key={attachment.id}>
              <TableCell>
                <Badge variant="outline" className="gap-1">
                  {attachment.asset_type === 'image' ? (
                    <Image className="h-3 w-3" />
                  ) : (
                    <FileText className="h-3 w-3" />
                  )}
                  {attachment.asset_type}
                </Badge>
              </TableCell>
              <TableCell className="font-medium max-w-xs">
                <div className="line-clamp-1">{attachment.file_name}</div>
                {attachment.mime_type && (
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {attachment.mime_type}
                  </div>
                )}
              </TableCell>
              <TableCell className="max-w-xs">
                {attachment.description ? (
                  <div className="line-clamp-1 text-sm">{attachment.description}</div>
                ) : (
                  <span className="text-xs text-muted-foreground">No description</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm">{formatFileSize(attachment.file_size)}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {format(new Date(attachment.uploaded_at), "MMM d, yyyy")}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(attachment)}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Attachment</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{attachment.file_name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(attachment)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
